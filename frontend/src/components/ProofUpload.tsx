"use client";
import React from 'react';

export default function ProofUpload({ onUpload }: { onUpload: (url: string) => void }) {
  return (
    <div className="mt-2">
      <input type="text" placeholder="Paste proof URL" className="input input-bordered w-full" onBlur={(e) => onUpload(e.currentTarget.value)} />
    </div>
  );
}
