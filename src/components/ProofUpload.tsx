"use client";
import React from 'react';

export default function ProofUpload({ onUpload }: { onUpload: (url: string) => void }) {
  return (
    <div className="mt-2 flex flex-col gap-1">
      <label htmlFor="proof-upload" className="text-xs font-semibold text-slate-600 dark:text-slate-300">Paste or upload proof URL</label>
      <input
        id="proof-upload"
        type="text"
        placeholder="https://..."
        className="input input-bordered w-full focus:ring-2 focus:ring-accent-500 transition"
        onBlur={(e) => onUpload(e.currentTarget.value)}
        aria-label="Proof URL input"
      />
    </div>
  );
}
