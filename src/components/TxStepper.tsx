"use client";
import React from "react";

export type TxStepperState = "idle" | "wallet" | "pending" | "confirmed" | "failed";

export function TxStepper({ state, explorerUrl, txHash }: { state: TxStepperState; explorerUrl?: string; txHash?: string }) {
  const label = state === "idle" ? "Ready" : state === "wallet" ? "Waiting for wallet" : state === "pending" ? "Pending" : state === "confirmed" ? "Confirmed" : "Failed";
    const color = state === "confirmed" ? "text-success-500" : state === "failed" ? "text-danger-500" : "text-brand-500";
  return (
      <div className="w-full card p-4 flex items-center justify-between border border-slate-200 dark:border-slate-700 shadow-lg rounded-xl animate-fade-in">
        <div className="flex items-center gap-4">
          <div className={`w-4 h-4 rounded-full border-2 ${state === 'confirmed' ? 'bg-success-500 border-success-500 animate-pulse' : state === 'failed' ? 'bg-danger-500 border-danger-500 animate-shake' : 'bg-brand-400 border-brand-500 animate-pulse-slow'}`} aria-label={label} />
        <div>
          <div className={`text-sm font-semibold ${color}`}>{label}</div>
          {txHash && <div className="text-xs text-slate-500">{txHash.slice(0, 8)}...{txHash.slice(-6)}</div>}
        </div>
      </div>
      <div>
        {explorerUrl && txHash ? (
          <a href={`${explorerUrl.replace(/\/$/, "")}/tx/${txHash}`} target="_blank" rel="noreferrer" className="logo text-sm font-semibold">View on explorer</a>
        ) : (
          <div className="text-xs text-slate-400">No transaction</div>
        )}
      </div>
    </div>
  );
}

export default TxStepper;
