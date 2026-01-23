"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ReceiptDemoPage() {
  // Ambil address dari query string (misal: /receipt/demo?address=0x...)
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
        // Fetch contract data (BaseScan API)
        const txUrl = `https://api-sepolia.basescan.org/api?module=account&action=txlist&address=${address}&sort=desc`;
        const txRes = await fetch(txUrl);
        const txData = await txRes.json();
        const lastTx = txData.status === "1" ? txData.result[0] : null;
        // Fetch contract info (customize as needed)
        setData({
          address,
          payer: lastTx?.from || "-",
          payee: lastTx?.to || "-",
          amount: lastTx?.value ? Number(lastTx.value) / 1e18 : "-",
          status: lastTx?.isError === "0" ? "Success" : "Failed",
      setLoading(false);
    }
    fetchData();
  }, []);
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-2 py-8 bg-gradient-to-br from-white/90 to-blue-50 dark:from-gray-950 dark:to-gray-900">
      <section className="w-full max-w-xl card rounded-3xl shadow-2xl p-10 flex flex-col items-center gap-8 animate-fade-in-up border border-blue-100 dark:border-blue-900 bg-white/90 dark:bg-gray-900/90">
        <h1 className="text-4xl md:text-5xl font-extrabold logo mb-4 tracking-tight flex items-center gap-3 drop-shadow-2xl text-blue-700 dark:text-blue-400">
          Escrow Receipt
        </h1>
        {loading ? (
          <div className="text-center text-blue-700 dark:text-blue-400">Loading receipt...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : (
          <div className="w-full flex flex-col gap-3 text-lg">
            <div><span className="font-semibold text-blue-700 dark:text-blue-400">Escrow Address:</span> {data.address}</div>
            <div><span className="font-semibold text-blue-700 dark:text-blue-400">Payer:</span> {data.payer}</div>
            <div><span className="font-semibold text-blue-700 dark:text-blue-400">Payee:</span> {data.payee}</div>
            <div><span className="font-semibold text-blue-700 dark:text-blue-400">Amount:</span> {data.amount} IDRX</div>
            <div><span className="font-semibold text-blue-700 dark:text-blue-400">Status:</span> <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ml-2 shadow bg-green-100 text-green-800">{data.status}</span></div>
            <div><span className="font-semibold text-blue-700 dark:text-blue-400">Released At:</span> {data.releasedAt}</div>
            <div><span className="font-semibold text-blue-700 dark:text-blue-400">Tx Hash:</span> <a href={`https://sepolia.basescan.org/tx/${data.txHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{data.txHash}</a></div>
          </div>
        )}
        <div className="mt-8 flex gap-4">
          <Link href="/" className="btn btn-outline">Back to Home</Link>
          <button className="btn btn-primary" onClick={() => navigator.clipboard.writeText(window.location.href)}>Copy Receipt Link</button>
        </div>
        <div className="text-xs text-gray-400 mt-8">Share this receipt as proof of payment. All data is verifiable on BaseScan.</div>
      </section>
    </main>
  );
}
