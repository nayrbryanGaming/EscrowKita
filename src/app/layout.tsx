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
  metadataBase: process.env.NEXT_PUBLIC_APP_URL ? new URL(process.env.NEXT_PUBLIC_APP_URL) : undefined,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className={`${inter.className} antialiased bg-lightbg text-text`}>
        <Providers>
          <div className="flex min-h-screen">
            <aside className="hidden lg:flex flex-col w-24 bg-white border-r border-slate-200 py-8 px-4 items-center gap-6 shrink-0">
              <a href="/" className="mb-8 flex items-center justify-center">
                <img src="/escrowkita-logo.svg" alt="EscrowKita" className="w-12 h-12 rounded-full" />
              </a>
              <nav className="flex flex-col gap-4 text-sm font-semibold text-slate-600">
                <a href="/" className="hover:text-primary transition">Home</a>
                <a href="/how-it-works" className="hover:text-primary transition">How it works</a>
                <a href="/create" className="hover:text-primary transition">Create deal</a>
                <a href="/escrow" className="hover:text-primary transition">Deals</a>
              </nav>
              <div className="mt-auto pb-4">
                <ConnectWallet />
              </div>
            </aside>
            <div className="flex-1 flex flex-col min-h-screen">
              <header className="lg:hidden sticky top-0 z-30 w-full bg-white flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <a href="/" className="flex items-center gap-2">
                  <img src="/escrowkita-logo.svg" alt="EscrowKita" className="w-10 h-10 rounded-full" />
                  <span className="font-bold text-lg text-primary">EscrowKita</span>
                </a>
                <ConnectWallet />
              </header>
              <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-10">
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
    <footer className="py-8 px-4 bg-white border-t border-slate-200 w-full">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-600">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <span className="font-semibold text-text">EscrowKita</span>
          <span>Built for Base Indonesia Hackathon</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a href="/how-it-works" className="hover:text-primary transition">About EscrowKita</a>
          <a href={baseScanContract} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition">
            Smart Contract Verified (BaseScan)
          </a>
          <a href="https://github.com/nayrbryanGaming/EscrowKita" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition">
            GitHub Repository
          </a>
        </div>
      </div>
      <p className="text-center text-slate-500 text-xs mt-4">
        Built for Base Indonesia Hackathon. © {new Date().getFullYear()} EscrowKita. Non-custodial · Open-source · On-chain escrow.
      </p>
    </footer>
  );
}
