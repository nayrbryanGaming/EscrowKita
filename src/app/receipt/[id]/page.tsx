"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ethers } from "ethers";
import abi from "../../../contracts/escrowABI.json";
import { addressUrl, txUrl } from "../../../lib/constants";
import { getJsonRpcProvider } from "../../../lib/web3";

type Receipt = {
  payer: string;
  payee: string;
  amount: string;
  currency: "ETH" | "IDRX";
  status: "CREATED" | "FUNDED" | "SUBMITTED" | "RELEASED" | "REFUNDED";
  fundedAt?: number | null;
  lastProof?: string | null;
  lastTx?: string | null;
};

export default function ReceiptPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Receipt | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        if (!id || typeof id !== "string" || !/^0x[a-fA-F0-9]{40}$/.test(id)) {
          setError("Invalid escrow address");
          return;
        }
        const provider = getJsonRpcProvider();
        const contract = new ethers.Contract(id, abi as any, provider);
        const [amountBn, payer, payee, fundedAtBn, released, refunded] = await Promise.all([
          contract.amount(),
          contract.payer(),
          contract.payee(),
          contract.fundedAt(),
          contract.released(),
          contract.refunded(),
        ]);

        const amount = ethers.formatEther(amountBn);
        let status: Receipt["status"] = "CREATED";
        if (released) status = "RELEASED";
        else if (refunded) status = "REFUNDED";
        else if (fundedAtBn && Number(fundedAtBn) > 0) status = "FUNDED";

        const filterProof = contract.filters.ProofSubmitted();
        const proofs = await contract.queryFilter(filterProof, 0, "latest");
        const lastProof = proofs.length > 0 ? String((proofs[proofs.length - 1] as any).args?.proof || "") : null;
        if (status === "FUNDED" && proofs.length > 0) status = "SUBMITTED";

        const filterRelease = contract.filters.Released();
        const releases = await contract.queryFilter(filterRelease, 0, "latest");
        const lastTx = releases.length > 0 ? (releases[releases.length - 1] as any).transactionHash : null;

        setData({
          payer,
          payee,
          amount,
          currency: "ETH",
          status,
          fundedAt: fundedAtBn ? Number(fundedAtBn) : null,
          lastProof,
          lastTx,
        });
        setError(null);
      } catch (e: any) {
        setError(e?.message || String(e));
      }
    }
    load();
  }, [id]);

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-lg text-center">
          <p className="text-danger font-medium">Could not load receipt.</p>
          <p className="text-sm text-slate-600 mt-1">{error}</p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600">Loading on-chain receipt…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-2 py-8">
      <section className="w-full max-w-2xl flex flex-col items-center gap-10">
        <div className="w-full flex flex-col gap-6 p-8 bg-white shadow-sm rounded-2xl border border-slate-200">
          <h1 className="text-2xl font-bold text-darknavy">Escrow Receipt</h1>
          <div className="text-sm text-slate-600 font-mono">Address: {id as string}</div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
            <div className="text-sm text-slate-500">Payer: <a className="font-mono hover:underline" href={addressUrl(data.payer)} target="_blank" rel="noopener">{data.payer}</a></div>
            <div className="text-sm text-slate-500">Payee: <a className="font-mono hover:underline" href={addressUrl(data.payee)} target="_blank" rel="noopener">{data.payee}</a></div>
          </div>
          <div className="text-lg font-bold text-darknavy">{data.amount} {data.currency}</div>
          <div className="text-sm font-semibold">
            Status: <span className="font-mono">{data.status}</span>
          </div>
          {data.lastProof && (
            <div className="text-sm text-slate-600">Last proof: <a href={data.lastProof} target="_blank" rel="noopener" className="underline">{data.lastProof}</a></div>
          )}
          <div className="mt-2">
            <a href={data.lastTx ? txUrl(data.lastTx) : `https://sepolia.basescan.org/address/${id as string}`}
               target="_blank" rel="noopener" className="text-primary hover:underline font-semibold">View on BaseScan</a>
          </div>
        </div>
      </section>
    </main>
  );
}
