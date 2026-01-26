"use client";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ReceiptDemoPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const address = urlParams.get("address") || "";
    if (!address) {
      setError("No address provided");
      setLoading(false);
      return;
    }
    async function fetchData() {
      try {
        const txUrl = `https://api-sepolia.basescan.org/api?module=account&action=txlist&address=${address}&sort=desc`;
        const txRes = await fetch(txUrl);
        const txData = await txRes.json();
        const lastTx = txData.status === "1" ? txData.result[0] : null;
        setData({
          address,
          payer: lastTx?.from || "-",
          payee: lastTx?.to || "-",
          amount: lastTx?.value ? Number(lastTx.value) / 1e18 : "-",
          status: lastTx?.isError === "0" ? "Success" : "Failed",
          txHash: lastTx?.hash || "-",
          releasedAt: lastTx?.timeStamp ? new Date(Number(lastTx.timeStamp) * 1000).toLocaleString() : "-",
        });
      } catch (e) {
        setError("Failed to fetch receipt data");
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-2 py-8 bg-gradient-to-br from-[#f8fafc] via-[#e0f7fa] to-[#e0e7ef] dark:from-[#0A2540] dark:via-[#1e293b] dark:to-[#0b1530] animate-fade-in-up">
      <section className="w-full max-w-xl card rounded-3xl shadow-2xl p-12 flex flex-col items-center gap-10 border border-blue-100 dark:border-blue-900 animate-fade-in-up">
        <div className="w-full flex flex-col md:flex-row items-center justify-between mb-2 gap-4">
          <h1 className="text-4xl md:text-5xl font-extrabold logo tracking-tight flex items-center gap-4 drop-shadow-2xl text-blue-700 dark:text-blue-400 animate-fade-in-up">
            Escrow Receipt
          </h1>
          {data?.address && (
            <span className="badge-proof cursor-pointer animate-fade-in-up" title="Lihat bukti escrow di BaseScan">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#06B6D4"/><path d="M8 12.5l2.5 2.5L16 9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <a href={`https://sepolia.basescan.org/address/${data.address}`} target="_blank" rel="noopener" className="underline">BaseScan Proof</a>
            </span>
          )}
        </div>
        {loading ? (
          <div className="text-center text-blue-700 dark:text-blue-400">Loading receipt...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : (
          <div className="w-full flex flex-col gap-4 text-lg animate-fade-in-up">
            <div><span className="font-semibold text-blue-700 dark:text-blue-400">Escrow Address:</span> {data.address}</div>
            <div><span className="font-semibold text-blue-700 dark:text-blue-400">Payer:</span> {data.payer}</div>
            <div><span className="font-semibold text-blue-700 dark:text-blue-400">Payee:</span> {data.payee}</div>
            <div><span className="font-semibold text-blue-700 dark:text-blue-400">Amount:</span> {data.amount} IDRX</div>
            <div><span className="font-semibold text-blue-700 dark:text-blue-400">Status:</span> <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ml-2 shadow bg-green-100 text-green-800">{data.status}</span></div>
            <div><span className="font-semibold text-blue-700 dark:text-blue-400">Released At:</span> {data.releasedAt}</div>
            <div><span className="font-semibold text-blue-700 dark:text-blue-400">Tx Hash:</span> <a href={`https://sepolia.basescan.org/tx/${data.txHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{data.txHash}</a></div>
            {/* QR code for sharing */}
            <div className="flex flex-col items-center mt-4">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(window.location.href)}`} alt="QR Code" className="rounded-lg border border-blue-100 shadow" />
              <span className="text-xs text-gray-400 mt-1">Scan to view receipt</span>
            </div>
          </div>
        )}
        <div className="mt-10 flex gap-6">
          <Link href="/" className="btn btn-outline text-lg">Back to Home</Link>
          <button className="btn btn-primary text-lg" onClick={() => navigator.clipboard.writeText(window.location.href)}>Copy Receipt Link</button>
        </div>
        <div className="text-base text-gray-400 mt-10 font-semibold">Share this receipt as proof of payment. All data is verifiable on BaseScan.</div>
      </section>
    </main>
  );
}
