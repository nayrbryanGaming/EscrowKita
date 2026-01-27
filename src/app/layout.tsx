

import "./globals.css";
import { ReactNode } from "react";
import MultiWalletConnect from "../components/MultiWalletConnect";
import ClientLayout from "./ClientLayout";
import { Providers } from "./providers";


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gradient-to-br from-[#e3eafc] via-[#f8fafc] to-[#e0e7ef] min-h-screen font-sans antialiased text-gray-900">
        <Providers>
          <div className="flex min-h-screen w-full">
            {/* Sidebar Trustpay-SEA style */}
            <aside className="hidden md:flex flex-col items-center w-64 bg-gradient-to-b from-blue-800 via-blue-700 to-blue-600 text-white shadow-2xl py-10 px-4 sticky top-0 h-screen z-30">
              <a href="/" className="mb-10 flex items-center gap-3">
                <img src="/escrowkita-logo.svg" alt="Logo" className="w-12 h-12 rounded-xl shadow-lg" />
                <span className="font-bold text-2xl tracking-tight">EscrowKita</span>
              </a>
              <nav className="flex flex-col gap-4 w-full">
                <a href="/" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-900/60 transition font-semibold">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M3 12L12 3l9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 21V9h6v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Home
                </a>
                <a href="/create" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-900/60 transition font-semibold">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Create Escrow
                </a>
                <a href="/escrow" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-900/60 transition font-semibold">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M16 3v4M8 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  Escrows
                </a>
              </nav>
              <div className="flex-1" />
              <a href="https://sepolia.basescan.org/" target="_blank" rel="noopener" className="mt-8 text-xs text-blue-200 font-mono hover:underline">BaseScan</a>
            </aside>
            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen bg-[#f8fafc]">
              <ClientLayout>{children}</ClientLayout>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
