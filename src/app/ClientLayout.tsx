"use client";


import { Providers } from "./providers";
import { useState, useEffect } from "react";
import Head from "next/head";
import MultiWalletConnect from "@/components/MultiWalletConnect";
import NotificationToaster, { useNotification } from "@/components/NotificationToaster";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { HomeIcon, PlusCircledIcon, QuestionMarkCircledIcon, Link1Icon } from "@radix-ui/react-icons";
import { motion, AnimatePresence } from "framer-motion";


function WalletConnectHeader() {
  return <MultiWalletConnect />;
}

function SidebarLink({ href, icon, children }: { href: string, icon: React.ReactNode, children: React.ReactNode }) {
  const isActive = typeof window !== "undefined" && window.location.pathname.startsWith(href);
  return (
    <Link href={href} className={cn(
      "sidebar-link flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all",
      isActive
        ? "bg-brand-500 text-white shadow-lg"
        : "text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-surface-muted"
    )}>
      {icon}
      {children}
    </Link>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);
  const { notifications } = useNotification();
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/escrowkita-logo.svg" type="image/svg+xml" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="EscrowKita — Escrow IDR onchain berbasis IDRX untuk event & freelancer Indonesia — aman, transparan, tanpa drama." />
        <meta property="og:title" content="EscrowKita — IDRX Onchain Escrow" />
        <meta property="og:description" content="Escrow IDR onchain berbasis IDRX untuk event & freelancer Indonesia — aman, transparan, tanpa drama." />
        <meta property="og:image" content="/escrowkita-logo.svg" />
        <meta property="og:type" content="website" />
        <meta name="theme-color" content="#1A2233" />
      </Head>
      <body className={cn("min-h-screen font-sans antialiased transition-colors duration-300", dark ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-900") }>
        <Providers>
          <NotificationToaster notifications={notifications} />
          <div className="flex min-h-screen">
            {/* Sidebar for desktop */}
            <AnimatePresence>
              <motion.aside
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -40, opacity: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
                className="w-64 card border-r border-slate-200 dark:border-slate-800 flex-col justify-between py-8 px-6 hidden md:flex transition-all duration-300 shadow-2xl"
              >
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8 flex items-center gap-3"
                  >
                    <Image src="/escrowkita-logo.svg" alt="EscrowKita Logo" width={44} height={44} className="rounded-lg shadow-lg" />
                    <div>
                      <div className="logo text-xl font-extrabold tracking-tight">EscrowKita</div>
                      <div className="kicker text-xs">On‑chain IDR Escrow (IDRX)</div>
                    </div>
                  </motion.div>
                  <nav className="flex flex-col gap-2 mt-6">
                    <SidebarLink href="/dashboard" icon={<HomeIcon className="w-5 h-5" />}>Dashboard</SidebarLink>
                    <SidebarLink href="/create" icon={<PlusCircledIcon className="w-5 h-5" />}>Create Escrow</SidebarLink>
                    <SidebarLink href="/help" icon={<QuestionMarkCircledIcon className="w-5 h-5" />}>Help</SidebarLink>
                    <div className="relative">
                      <Dropdown />
                    </div>
                  </nav>
                </div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xs text-slate-400 mt-8"
                  >
                    &copy; {new Date().getFullYear()} EscrowKita
                  </motion.div>
              </motion.aside>
            </AnimatePresence>
            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen px-2 md:px-0 bg-gradient-to-br from-[#f8fafc] to-[#e0f7fa] dark:from-[#0A2540] dark:to-[#1e293b] transition-colors duration-300">
              {/* Topbar for mobile */}
              <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
                className="md:hidden flex items-center justify-between px-4 py-3 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 shadow"
              >
                <div className="flex items-center gap-2">
                  <Image src="/escrowkita-logo.svg" alt="EscrowKita Logo" width={36} height={36} className="rounded-lg shadow" />
                  <div className="site-title text-lg font-bold tracking-tight text-[#0A2540] dark:text-blue-200">EscrowKita</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn btn-xs btn-ghost" onClick={() => setDark(d => !d)}>{dark ? "Light" : "Dark"}</button>
                  <WalletConnectHeader />
                </div>
              </motion.header>
              <div className="max-w-4xl mx-auto w-full py-10 px-4 md:px-0">
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 120, damping: 18 }}
                  className="hero card mb-8 bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-2xl p-6 md:p-10"
                >
                  {children}
                </motion.section>
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}

  function Dropdown() {
    const [open, setOpen] = useState(false);
    const factory = "https://sepolia.basescan.org/address/0x114C64F70cbB96E0346907aFb13EB2Ce13fE740B";
    const explorer = "https://sepolia.basescan.org";
    return (
      <div className="inline-block">
        <button onClick={() => setOpen(o => !o)} className="sidebar-link flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200">
          <Link1Icon className="w-5 h-5" />Explorer
        </button>
        {open && (
          <div className="mt-2 w-48 bg-white dark:bg-slate-900 rounded shadow-lg border border-slate-200 dark:border-slate-800 p-2 z-50">
            <a href={explorer} target="_blank" rel="noreferrer" className="block px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800">Home</a>
            <a href={factory} target="_blank" rel="noreferrer" className="block px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800">Factory (address)</a>
            <Link href="/proof" className="block px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800">Proof (tx)</Link>
          </div>
        )}
      </div>
    );
  }
