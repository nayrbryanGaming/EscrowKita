

import "./globals.css";
import { ReactNode } from "react";
import MultiWalletConnect from "@/components/MultiWalletConnect";
import { Providers } from "./providers";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gradient-to-br from-[#f8fafc] via-[#e0f7fa] to-[#e0e7ef] dark:from-[#0A2540] dark:via-[#1e293b] dark:to-[#0b1530] min-h-screen font-sans antialiased text-gray-900 dark:text-slate-100">
        <Providers>
          <div className="flex min-h-screen w-full">
            {/* Sidebar */}
            <aside className="hidden md:flex flex-col items-center w-20 bg-white/80 dark:bg-gray-900/80 border-r border-blue-100 dark:border-blue-900 py-8 px-2 sticky top-0 h-screen z-30 shadow-xl">
              <a href="/" className="mb-8">
                <img src="/escrowkita-logo.svg" alt="Logo" className="w-12 h-12 rounded-2xl shadow-lg" />
              </a>
              <nav className="flex flex-col gap-6 mt-4">
                <a href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="Home">
                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M3 12L12 3l9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 21V9h6v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
                <a href="/create" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="Create Escrow">
                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
                <a href="/escrow" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="Escrows">
                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M16 3v4M8 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                </a>
              </nav>
              <div className="flex-1" />
              <a href="https://sepolia.basescan.org/" target="_blank" rel="noopener" className="mt-8 text-xs text-blue-500 dark:text-blue-300 font-mono hover:underline">BaseScan</a>
            </aside>
            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen">
              <ClientLayout>{children}</ClientLayout>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
