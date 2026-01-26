
"use client";
import React from "react";
export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";


export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-2 py-8 bg-gradient-to-br from-[#f8fafc] via-[#e0f7fa] to-[#e0e7ef] dark:from-[#0A2540] dark:via-[#1e293b] dark:to-[#0b1530]">
      <section className="w-full max-w-5xl mx-auto flex flex-col items-center gap-16 animate-fade-in-up">
        {/* HERO SECTION */}
        <div className="relative w-full flex flex-col items-center gap-8 card shadow-2xl animate-fade-in-up p-10 bg-white/80 dark:bg-gray-900/80 rounded-3xl">
          <span className="badge-proof absolute left-8 top-8 z-10 cursor-pointer" title="Lihat bukti deploy di BaseScan">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#06B6D4"/><path d="M8 12.5l2.5 2.5L16 9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <a href="https://sepolia.basescan.org/tx/0x40f4c65b435017a49797eb3f2245aefc030c7de7df93b905ebf65cd25ab3c08a" target="_blank" rel="noopener" className="underline font-bold text-blue-700 dark:text-blue-400 ml-2">Live on Base Sepolia</a>
          </span>
          <Image src="/escrowkita-logo.svg" alt="EscrowKita Logo" width={96} height={96} className="rounded-2xl shadow-2xl mb-2" />
          <h1 className="text-6xl md:text-7xl font-extrabold text-center tracking-tight logo text-blue-700 dark:text-blue-400 drop-shadow-2xl mb-4">
            EscrowKita
          </h1>
          <div className="text-2xl md:text-3xl text-center text-slate-700 dark:text-slate-200 font-semibold max-w-2xl mb-2">
            Escrow IDR onchain berbasis <span className="font-bold text-blue-700 dark:text-blue-400">IDRX</span> untuk event & freelancer Indonesia.<br />
            <span className="font-bold text-green-700 dark:text-green-400">Aman, transparan, tanpa drama.</span>
          </div>
          <div className="flex flex-col md:flex-row gap-6 mt-8 w-full justify-center">
            <Link href="/create" className="btn btn-primary text-xl shadow-xl px-8 py-4 rounded-2xl font-bold">
              return (
                <>
                  <main className="min-h-screen flex flex-col items-center justify-center px-2 py-8 bg-gradient-to-br from-[#f8fafc] via-[#e0f7fa] to-[#e0e7ef] dark:from-[#0A2540] dark:via-[#1e293b] dark:to-[#0b1530]">
                    <section className="w-full max-w-5xl mx-auto flex flex-col items-center gap-16 animate-fade-in-up">
                      {/* HERO SECTION */}
                      <div className="relative w-full flex flex-col items-center gap-8 card shadow-2xl animate-fade-in-up p-10 bg-white/80 dark:bg-gray-900/80 rounded-3xl">
                        <span className="badge-proof absolute left-8 top-8 z-10 cursor-pointer" title="Lihat bukti deploy di BaseScan">
                          <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#06B6D4"/><path d="M8 12.5l2.5 2.5L16 9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          <a href="https://sepolia.basescan.org/tx/0x40f4c65b435017a49797eb3f2245aefc030c7de7df93b905ebf65cd25ab3c08a" target="_blank" rel="noopener" className="underline font-bold text-blue-700 dark:text-blue-400 ml-2">Live on Base Sepolia</a>
                        </span>
                        <Image src="/escrowkita-logo.svg" alt="EscrowKita Logo" width={96} height={96} className="rounded-2xl shadow-2xl mb-2" />
                        <h1 className="text-6xl md:text-7xl font-extrabold text-center tracking-tight logo text-blue-700 dark:text-blue-400 drop-shadow-2xl mb-4">
                          EscrowKita
                        </h1>
                        <div className="text-2xl md:text-3xl text-center text-slate-700 dark:text-slate-200 font-semibold max-w-2xl mb-2">
                          Escrow IDR onchain berbasis <span className="font-bold text-blue-700 dark:text-blue-400">IDRX</span> untuk event & freelancer Indonesia.<br />
                          <span className="font-bold text-green-700 dark:text-green-400">Aman, transparan, tanpa drama.</span>
                        </div>
                        <div className="flex flex-col md:flex-row gap-6 mt-8 w-full justify-center">
                          <Link href="/create" className="btn btn-primary text-xl shadow-xl px-8 py-4 rounded-2xl font-bold">
                            🚀 Create Escrow
                          </Link>
                          <a href="https://sepolia.basescan.org/tx/0x40f4c65b435017a49797eb3f2245aefc030c7de7df93b905ebf65cd25ab3c08a" target="_blank" rel="noopener" className="btn btn-outline text-xl shadow-xl px-8 py-4 rounded-2xl font-bold">
                            🔎 Bukti Deploy (BaseScan)
                          </a>
                        </div>
                      </div>

                      {/* VALUE PROPS */}
                      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 mt-4">
                        <div className="card flex flex-col gap-3 p-8 rounded-2xl shadow-xl animate-fade-in-up bg-white/80 dark:bg-gray-900/80">
                          <h2 className="text-2xl font-bold mb-1 text-blue-700 dark:text-blue-400">Aman & Transparan</h2>
                          <p className="text-slate-700 dark:text-slate-200 text-base">Dana disimpan di smart contract, hanya bisa dicairkan sesuai workflow. Bukti transaksi onchain, bisa diverifikasi publik.</p>
                        </div>
                        <div className="card flex flex-col gap-3 p-8 rounded-2xl shadow-xl animate-fade-in-up bg-white/80 dark:bg-gray-900/80">
                          <h2 className="text-2xl font-bold mb-1 text-blue-700 dark:text-blue-400">Workflow Matang</h2>
                          <p className="text-slate-700 dark:text-slate-200 text-base">Create escrow, deposit, submit proof, approve, release. Semua terotomasi, role-based, event-driven, dan audit-ready.</p>
                        </div>
                        <div className="card flex flex-col gap-3 p-8 rounded-2xl shadow-xl animate-fade-in-up bg-white/80 dark:bg-gray-900/80">
                          <h2 className="text-2xl font-bold mb-1 text-blue-700 dark:text-blue-400">Multi Wallet</h2>
                          <p className="text-slate-700 dark:text-slate-200 text-base">Support Metamask, Trust Wallet, Coinbase, OKX, Binance, Solflare, dsb. Network auto-switch, wallet awareness, event-based state.</p>
                        </div>
                        <div className="card flex flex-col gap-3 p-8 rounded-2xl shadow-xl animate-fade-in-up bg-white/80 dark:bg-gray-900/80">
                          <h2 className="text-2xl font-bold mb-1 text-blue-700 dark:text-blue-400">BaseScan Proof</h2>
                          <p className="text-slate-700 dark:text-slate-200 text-base">Semua transaksi bisa dicek di BaseScan. Transparansi penuh, audit-ready, siap presentasi ke VC/juri.</p>
                        </div>
                      </div>

                      {/* STATUS TIMELINE DEMO */}
                      <div className="w-full flex flex-col items-center mt-12 animate-fade-in-up">
                        <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400 mb-4">Demo Escrow Workflow</h3>
                        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                          <div className="flex flex-col items-center">
                            <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-xl font-bold mb-2">1. Create Escrow</span>
                            <span className="text-gray-500 dark:text-gray-400 text-sm">User A (payer) membuat escrow</span>
                          </div>
                          <span className="mx-2 md:mx-4 text-2xl text-blue-400">→</span>
                          <div className="flex flex-col items-center">
                            <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400 px-4 py-2 rounded-xl font-bold mb-2">2. Deposit</span>
                            <span className="text-gray-500 dark:text-gray-400 text-sm">User A deposit IDRX ke smart contract</span>
                          </div>
                          <span className="mx-2 md:mx-4 text-2xl text-blue-400">→</span>
                          <div className="flex flex-col items-center">
                            <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-400 px-4 py-2 rounded-xl font-bold mb-2">3. Submit Proof</span>
                            <span className="text-gray-500 dark:text-gray-400 text-sm">User B (payee) submit proof URL</span>
                          </div>
                          <span className="mx-2 md:mx-4 text-2xl text-blue-400">→</span>
                          <div className="flex flex-col items-center">
                            <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-400 px-4 py-2 rounded-xl font-bold mb-2">4. Approve</span>
                            <span className="text-gray-500 dark:text-gray-400 text-sm">User A approve proof</span>
                          </div>
                          <span className="mx-2 md:mx-4 text-2xl text-blue-400">→</span>
                          <div className="flex flex-col items-center">
                            <span className="bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-400 px-4 py-2 rounded-xl font-bold mb-2">5. Release Funds</span>
                            <span className="text-gray-500 dark:text-gray-400 text-sm">Dana otomatis cair ke payee</span>
                          </div>
                        </div>
                      </div>
                    </section>
                  </main>
                  {/* FOOTER */}
                  <footer className="mt-20 text-center text-gray-400 text-sm w-full border-t border-blue-100 dark:border-blue-900 pt-8">
                    Production-grade escrow platform • Built for real users • <span className="font-bold text-blue-700 dark:text-blue-400">Base Sepolia Testnet</span>
                  </footer>
                </>
              );
              <span className="text-gray-500 dark:text-gray-400 text-sm">User A deposit IDRX ke smart contract</span>
            </div>
            <span className="mx-2 md:mx-4 text-2xl text-blue-400">→</span>
            <div className="flex flex-col items-center">
              <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-400 px-4 py-2 rounded-xl font-bold mb-2">3. Submit Proof</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">User B (payee) submit proof URL</span>
            </div>
            <span className="mx-2 md:mx-4 text-2xl text-blue-400">→</span>
            <div className="flex flex-col items-center">
              <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-400 px-4 py-2 rounded-xl font-bold mb-2">4. Approve</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">User A approve proof</span>
            </div>
            <span className="mx-2 md:mx-4 text-2xl text-blue-400">→</span>
            <div className="flex flex-col items-center">
              <span className="bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-400 px-4 py-2 rounded-xl font-bold mb-2">5. Release Funds</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">Dana otomatis cair ke payee</span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
          <footer className="mt-20 text-center text-gray-400 text-sm w-full border-t border-blue-100 dark:border-blue-900 pt-8">
            {/* FOOTER */}
            Production-grade escrow platform • Built for real users • <span className="font-bold text-blue-700 dark:text-blue-400">Base Sepolia Testnet</span>
          </footer>
      </section>
    </main>
  );

      {/* VALUE PROPS */}
      <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        <div className="card p-8 flex flex-col items-start border border-blue-100 dark:border-blue-900 shadow-xl">
          <h2 className="text-2xl font-bold mb-2 text-blue-700 dark:text-blue-400">Aman & Transparan</h2>
          <p className="text-gray-700 dark:text-gray-200 text-left">Dana disimpan di smart contract, hanya bisa dicairkan sesuai workflow. Bukti transaksi onchain, bisa diverifikasi publik.</p>
        </div>
        <div className="card p-8 flex flex-col items-start border border-blue-100 dark:border-blue-900 shadow-xl">
          <h2 className="text-2xl font-bold mb-2 text-blue-700 dark:text-blue-400">Workflow Matang</h2>
          <p className="text-gray-700 dark:text-gray-200 text-left">Create escrow, deposit, submit proof, approve, release. Semua terotomasi, role-based, event-driven, dan audit-ready.</p>
        </div>
        <div className="card p-8 flex flex-col items-start border border-blue-100 dark:border-blue-900 shadow-xl">
          <h2 className="text-2xl font-bold mb-2 text-blue-700 dark:text-blue-400">Multi Wallet</h2>
          <p className="text-gray-700 dark:text-gray-200 text-left">Support Metamask, Trust Wallet, Coinbase, OKX, Binance, Solflare, dsb. Network auto-switch, wallet awareness, event-based state.</p>
        </div>
        <div className="card p-8 flex flex-col items-start border border-blue-100 dark:border-blue-900 shadow-xl">
          <h2 className="text-2xl font-bold mb-2 text-blue-700 dark:text-blue-400">BaseScan Proof</h2>
          <p className="text-gray-700 dark:text-gray-200 text-left">Semua transaksi bisa dicek di BaseScan. Transparansi penuh, audit-ready, siap presentasi ke VC/juri.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-20 text-center text-gray-400 text-sm w-full border-t border-blue-100 dark:border-blue-900 pt-8">
        Production-grade escrow platform • Built for real users • <span className="font-bold text-blue-700 dark:text-blue-400">Base Sepolia Testnet</span>
      </footer>
    </div>
  );
}
"use client";
