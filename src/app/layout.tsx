import React from 'react';
import '../styles/globals.css';
import Providers from './providers';
import ConnectWallet from '../components/ConnectWallet';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'EscrowKita — Get Paid Safely. Without Trusting Anyone.',
  description: 'Smart contract escrow in IDR. Funds are locked onchain and released only when the work is done. Non-custodial, open-source, verified on Base.',
  keywords: ['escrow', 'Base', 'smart contract', 'IDR', 'freelancer', 'Indonesia', 'onchain'],
  authors: [{ name: 'EscrowKita' }],
  openGraph: {
    title: 'EscrowKita — Get Paid Safely. Without Trusting Anyone.',
    description: 'Smart contract escrow. Funds locked onchain, released when work is done.',
    type: 'website',
  },
  icons: {
    icon: '/favicon.svg',
  },
  metadataBase: process.env.NEXT_PUBLIC_APP_URL ? new URL(process.env.NEXT_PUBLIC_APP_URL) : undefined,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className={`${inter.className} antialiased bg-gradient-to-r from-blue-50 to-blue-100 text-text`}>
        <Providers>
          <div className="flex min-h-screen">
            <div className="flex-1 flex flex-col min-h-screen">
              <header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur border-b border-slate-200 overflow-visible">
                <div className="max-w-6xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
                  <a href="/" className="flex items-center gap-2">
                    <img src="/escrowkita-logo.svg" alt="EscrowKita" className="w-10 h-10 rounded-full shadow-md" />
                    <span className="font-bold text-lg text-blue-600">EscrowKita</span>
                  </a>
                  <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-700">
                    <div className="relative group">
                      <button type="button" className="nav-link">Products</button>
                      <span className="absolute left-0 top-full w-full h-3"></span>
                      <div className="absolute left-0 top-full z-40 mt-2 w-[520px] p-4 bg-white border border-slate-200 rounded-xl shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto transition">
                        <div className="grid grid-cols-2 gap-4">
                          <a href="/escrow" className="card hover:shadow-md">
                            <div className="text-sm font-bold text-darknavy">Escrow Deals</div>
                            <div className="text-xs text-slate-600">Kelola kontrak escrow Anda</div>
                          </a>
                          <a href="/create" className="card hover:shadow-md">
                            <div className="text-sm font-bold text-darknavy">Create Deal</div>
                            <div className="text-xs text-slate-600">Buat kontrak dengan cepat</div>
                          </a>
                          <a href="/milestone" className="card hover:shadow-md">
                            <div className="text-sm font-bold text-darknavy">Milestone Escrow</div>
                            <div className="text-xs text-slate-600">Pembayaran bertahap aman</div>
                          </a>
                          <a href="/token-escrow" className="card hover:shadow-md">
                            <div className="text-sm font-bold text-darknavy">Token Escrow (IDRX)</div>
                            <div className="text-xs text-slate-600">Gunakan token IDRX</div>
                          </a>
                        </div>
                      </div>
                    </div>
                    <a href="/how-it-works" className="nav-link">How it works</a>
                    <div className="relative group">
                      <button type="button" className="nav-link">Pricing</button>
                      <span className="absolute left-0 top-full w-full h-3"></span>
                      <div className="absolute left-0 top-full z-40 mt-2 w-[420px] p-4 bg-white border border-slate-200 rounded-xl shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto transition">
                        <div className="grid grid-cols-2 gap-4">
                          <a href="/pricing" className="card hover:shadow-md">
                            <div className="text-sm font-bold text-darknavy">Standard</div>
                            <div className="text-xs text-slate-600">Biaya rendah untuk proyek kecil</div>
                          </a>
                          <a href="/pricing" className="card hover:shadow-md">
                            <div className="text-sm font-bold text-darknavy">Pro</div>
                            <div className="text-xs text-slate-600">Fitur premium untuk tim</div>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="relative group">
                      <button type="button" className="nav-link">Resources</button>
                      <span className="absolute left-0 top-full w-full h-3"></span>
                      <div className="absolute left-0 top-full z-40 mt-2 w-[420px] p-4 bg-white border border-slate-200 rounded-xl shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto transition">
                        <div className="grid grid-cols-2 gap-4">
                          <a href="https://sepolia.basescan.org" target="_blank" rel="noopener" className="card hover:shadow-md">
                            <div className="text-sm font-bold text-darknavy">BaseScan</div>
                            <div className="text-xs text-slate-600">Explorer untuk verifikasi transaksi</div>
                          </a>
                          <a href="https://www.coinbase.com/wallet" target="_blank" rel="noopener" className="card hover:shadow-md">
                            <div className="text-sm font-bold text-darknavy">Wallet Apps</div>
                            <div className="text-xs text-slate-600">MetaMask • Coinbase • WalletConnect</div>
                          </a>
                          <a href="https://github.com/nayrbryanGaming/EscrowKita" target="_blank" rel="noopener" className="card hover:shadow-md">
                            <div className="text-sm font-bold text-darknavy">GitHub</div>
                            <div className="text-xs text-slate-600">Kode sumber publik</div>
                          </a>
                          <a href="https://faucet.quicknode.com/base/sepolia" target="_blank" rel="noopener" className="card hover:shadow-md">
                            <div className="text-sm font-bold text-darknavy">Base Sepolia Faucet</div>
                            <div className="text-xs text-slate-600">Dapatkan test ETH untuk gas</div>
                          </a>
                        </div>
                      </div>
                    </div>
                    <a href="/escrow" className="nav-link">My Deals</a>
                  </nav>
                  <div className="hidden md:flex items-center gap-3">
                    <a href="/create" className="btn-outline hidden sm:inline-flex">Create Deal</a>
                    <ConnectWallet />
                  </div>
                  <details className="md:hidden">
                    <summary className="list-none cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">Menu</summary>
                    <div className="mt-3 p-3 rounded-xl border border-slate-200 bg-white shadow-xl">
                      <a href="/escrow" className="block px-3 py-2 rounded hover:bg-slate-100">My Deals</a>
                      <a href="/create" className="block px-3 py-2 rounded hover:bg-slate-100">Create Deal</a>
                      <a href="/how-it-works" className="block px-3 py-2 rounded hover:bg-slate-100">How it works</a>
                      <a href="/pricing" className="block px-3 py-2 rounded hover:bg-slate-100">Pricing</a>
                      <div className="mt-3">
                        <ConnectWallet />
                      </div>
                    </div>
                  </details>
                </div>
              </header>
              <main className="flex-1 w-full max-w-6xl mx-auto px-6 sm:px-8 py-10 md:py-12">
                {children}
              </main>
              <Footer />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}

function Footer() {
  const contractAddr = process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS;
  const baseScanContract = contractAddr
    ? `https://sepolia.basescan.org/address/${contractAddr}`
    : 'https://sepolia.basescan.org';
  return (
    <footer className="py-10 px-6 bg-gradient-to-r from-blue-50 to-blue-100 border-t border-slate-200 w-full">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-slate-700">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <span className="font-semibold text-blue-600">EscrowKita</span>
          <span>Built for Base Indonesia Hackathon</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <a href="/how-it-works" className="hover:text-blue-600 transition">About EscrowKita</a>
          <a href={baseScanContract} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition">
            Smart Contract Verified (BaseScan)
          </a>
          <a href="https://github.com/nayrbryanGaming/EscrowKita" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition">
            GitHub Repository
          </a>
        </div>
      </div>
      <p className="text-center text-slate-500 text-xs mt-6">
        Built for Base Indonesia Hackathon. © {new Date().getFullYear()} EscrowKita. Non-custodial · Open-source · On-chain escrow.
      </p>
    </footer>
  );
}
