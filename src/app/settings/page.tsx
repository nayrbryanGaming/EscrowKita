'use client';

import React from 'react';
import { useWallet } from '../providers';

export default function SettingsPage() {
  const w = useWallet();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-darknavy">Settings</h1>
        <p className="text-slate-600">Preferensi akun dan jaringan.</p>
      </div>
      <div className="card">
        <div className="text-sm text-slate-600">Connected Wallet</div>
        <div className="mt-1 font-mono text-sm">{w.address ? w.address : 'Not connected'}</div>
      </div>
      <div className="card">
        <div className="text-sm text-slate-600">Network</div>
        <div className="mt-1 text-sm">Base Sepolia (84532)</div>
      </div>
    </div>
  );
}