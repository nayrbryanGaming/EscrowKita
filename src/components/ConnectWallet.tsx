"use client";
import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useWallet, useNotification } from "../app/providers";

export default function ConnectWallet() {
  const { address, connect, disconnect, connectWalletConnect, connectCoinbase } = useWallet();
  const { notify } = useNotification();
  const [open, setOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const actions = useMemo(
    () => [
      { label: "Create Deal", run: () => (window.location.href = "/create") },
      { label: "My Deals", run: () => (window.location.href = "/escrow") },
      { label: "Pricing", run: () => (window.location.href = "/pricing") },
      { label: "How it works", run: () => (window.location.href = "/how-it-works") },
      { label: "Connect: Injected (MetaMask)", run: async () => { await (connect && connect()); } },
      { label: "Connect: WalletConnect", run: async () => { await (connectWalletConnect && connectWalletConnect()); } },
      { label: "Connect: Coinbase Wallet", run: async () => { await (connectCoinbase && connectCoinbase()); } },
    ], [connect, connectWalletConnect, connectCoinbase]
  );

  const filtered = useMemo(
    () => actions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase())),
    [actions, query]
  );

  useEffect(() => {
    const anyOpen = open || cmdOpen;
    if (anyOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
    return () => {};
  }, [open, cmdOpen]);

  if (address) {
    return (
      <div className="flex items-center gap-3">
        <div className="font-mono text-sm bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded">{String(address).slice(0,6)}...{String(address).slice(-4)}</div>
        <button className="btn-outline-main px-3 py-2 rounded-full" onClick={() => disconnect && disconnect()}>Disconnect</button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button className="btn-outline-main px-3 py-2 rounded-full" onClick={() => setCmdOpen(true)}>Cmd ⌘K</button>
        <button className="btn-main px-3 py-2 rounded-full" onClick={() => setOpen(true)}>Connect Wallet</button>
      </div>
      {open && createPortal(
        (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)}></div>
            <div className="relative z-10 w-full max-w-md mx-auto card">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-darknavy">Pilih Wallet</h3>
                <p className="text-sm text-slate-600">Base Sepolia • Chain ID 84532</p>
              </div>
              <div className="space-y-3">
                <button className="w-full btn-primary" onClick={async () => { setOpen(false); await (connect && connect()); }}>Injected (MetaMask)</button>
                <button className="w-full btn-outline" onClick={async () => {
                  const pid = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
                  if (!pid) notify('error', 'WalletConnect projectId belum di-set. Tambahkan NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID di .env');
                  setOpen(false);
                  await (connectWalletConnect && connectWalletConnect());
                }}>WalletConnect (Trust/OKX/Binance/OKX)</button>
                <button className="w-full btn-outline" onClick={async () => { setOpen(false); await (connectCoinbase && connectCoinbase()); }}>Coinbase Wallet</button>
              </div>
              <div className="mt-4 flex justify-end">
                <button className="btn-outline" onClick={() => setOpen(false)}>Close</button>
              </div>
            </div>
          </div>
        ), document.body
      )}
      {cmdOpen && createPortal(
        (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setCmdOpen(false)}></div>
            <div className="relative z-10 w-full max-w-xl mx-auto card">
              <div className="mb-3">
                <h3 className="text-lg font-bold text-darknavy">Quick Actions</h3>
                <p className="text-sm text-slate-600">Cari aksi atau halaman • Ctrl/⌘ + K</p>
              </div>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari…" className="input-field" />
              <div className="mt-3 max-h-64 overflow-y-auto">
                {filtered.map((a) => (
                  <button key={a.label} className="w-full text-left px-3 py-2 rounded hover:bg-slate-100" onClick={() => { setCmdOpen(false); a.run(); }}>
                    {a.label}
                  </button>
                ))}
                {filtered.length === 0 && (
                  <div className="text-sm text-slate-500 px-3 py-2">Tidak ada hasil</div>
                )}
              </div>
              <div className="mt-3 flex justify-end">
                <button className="btn-outline" onClick={() => setCmdOpen(false)}>Close</button>
              </div>
            </div>
          </div>
        ), document.body
      )}
    </div>
  );
}
