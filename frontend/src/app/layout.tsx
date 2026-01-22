
import "./globals.css";
import { ReactNode } from "react";
import MultiWalletConnect from "@/components/MultiWalletConnect";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef] min-h-screen text-gray-900 dark:text-gray-100 font-sans antialiased">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="hidden md:flex flex-col w-72 bg-white/90 dark:bg-gray-900/90 border-r border-gray-200 dark:border-gray-800 shadow-2xl z-20">
            <div className="flex items-center h-20 px-8 font-extrabold text-3xl tracking-tight logo text-blue-700 dark:text-blue-400 drop-shadow-xl select-none">
              <span className="mr-2">🛡️</span> EscrowKita
            </div>
            <nav className="flex-1 px-6 py-8 space-y-3">
              <a href="/" className="block px-4 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 font-semibold transition text-lg">Home</a>
              <a href="/create" className="block px-4 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 font-semibold transition text-lg">Create Escrow</a>
              <a href="/receipt/demo" className="block px-4 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 font-semibold transition text-lg">Receipt Demo</a>
            </nav>
            <div className="px-6 pb-4">
              <MultiWalletConnect />
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-400 flex flex-col gap-1">
              <span>v1.0 • Base Sepolia</span>
              <span className="text-blue-700 dark:text-blue-400 font-bold">IDRX Escrow</span>
            </div>
          </aside>
          {/* Main Content */}
          <main className="flex-1 flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-white/90 to-blue-50 dark:from-gray-950 dark:to-gray-900">
            <div className="w-full max-w-7xl px-2 md:px-8 py-4 flex flex-col flex-1">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
