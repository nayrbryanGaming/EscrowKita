import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full max-w-5xl mx-auto py-24 px-4 flex flex-col items-center animate-fade-in-up">
      <h1 className="text-6xl md:text-7xl font-extrabold mb-8 text-center tracking-tight logo text-blue-700 dark:text-blue-400 drop-shadow-2xl">
        EscrowKita
      </h1>
      <p className="text-2xl md:text-3xl text-gray-700 dark:text-gray-200 mb-10 text-center max-w-3xl font-medium">
        Escrow IDR onchain berbasis <span className="font-bold text-blue-700 dark:text-blue-400">IDRX</span> untuk event & freelancer Indonesia — <span className="font-bold">aman, transparan, tanpa drama</span>.
      </p>
      <div className="flex flex-col md:flex-row gap-6 mb-16">
        <Link href="/create" className="btn btn-primary px-10 py-4 text-xl font-bold rounded-2xl shadow-xl hover:scale-105 transition-all">
          🚀 Create Escrow
        </Link>
        <a href="https://basescan.org/" target="_blank" rel="noopener" className="btn btn-outline px-10 py-4 text-xl font-bold rounded-2xl shadow-xl hover:scale-105 transition-all">
          🔎 View on BaseScan
        </a>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
        <div className="bg-white/90 dark:bg-gray-900/90 rounded-3xl p-10 shadow-2xl flex flex-col items-center border border-blue-100 dark:border-blue-900">
          <h2 className="text-2xl font-bold mb-2 text-blue-700 dark:text-blue-400">Aman & Transparan</h2>
          <p className="text-gray-700 dark:text-gray-200 text-center">Dana disimpan di smart contract, hanya bisa dicairkan sesuai workflow. Bukti transaksi onchain, bisa diverifikasi publik.</p>
        </div>
        <div className="bg-white/90 dark:bg-gray-900/90 rounded-3xl p-10 shadow-2xl flex flex-col items-center border border-blue-100 dark:border-blue-900">
          <h2 className="text-2xl font-bold mb-2 text-blue-700 dark:text-blue-400">Workflow Matang</h2>
          <p className="text-gray-700 dark:text-gray-200 text-center">Create escrow, deposit, submit proof, approve, release. Semua terotomasi, role-based, event-driven, dan audit-ready.</p>
        </div>
        <div className="bg-white/90 dark:bg-gray-900/90 rounded-3xl p-10 shadow-2xl flex flex-col items-center border border-blue-100 dark:border-blue-900">
          <h2 className="text-2xl font-bold mb-2 text-blue-700 dark:text-blue-400">Multi Wallet</h2>
          <p className="text-gray-700 dark:text-gray-200 text-center">Support Metamask, Trust Wallet, Coinbase, OKX, Binance, Solflare, dsb. Network auto-switch, wallet awareness, event-based state.</p>
        </div>
        <div className="bg-white/90 dark:bg-gray-900/90 rounded-3xl p-10 shadow-2xl flex flex-col items-center border border-blue-100 dark:border-blue-900">
          <h2 className="text-2xl font-bold mb-2 text-blue-700 dark:text-blue-400">BaseScan Proof</h2>
          <p className="text-gray-700 dark:text-gray-200 text-center">Semua transaksi bisa dicek di BaseScan. Transparansi penuh, audit-ready, siap presentasi ke VC/juri.</p>
        </div>
      </div>
      <div className="mt-16 text-center text-gray-400 text-sm">Production-grade escrow platform • Built for real users • Base Sepolia Testnet</div>
    </div>
  );
}
