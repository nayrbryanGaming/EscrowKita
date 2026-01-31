"use client";
import React from "react";
import { useWallet } from "../app/providers";

export default function ConnectWallet() {
  const { address, connect, disconnect } = useWallet();

  if (address) {
    return (
      <div className="flex items-center gap-3">
        <div className="font-mono text-sm bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded">{String(address).slice(0,6)}...{String(address).slice(-4)}</div>
        <button className="btn-outline-main px-3 py-2 rounded-full" onClick={() => disconnect && disconnect()}>Disconnect</button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button className="btn-main px-3 py-2 rounded-full" onClick={() => connect && connect()}>Connect Wallet</button>
    </div>
  );
}
