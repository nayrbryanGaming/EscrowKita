'use client';

import React from 'react';

export default function PricingPage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-darknavy">Pricing</h1>
        <p className="text-slate-600">Biaya transparan, optimized untuk freelancer dan tim.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="text-lg font-bold text-darknavy">Starter</div>
          <p className="text-sm text-slate-600">Untuk proyek kecil dan percobaan.</p>
          <div className="mt-4 text-3xl font-bold text-darknavy">0.5%</div>
          <ul className="mt-4 text-sm text-slate-700 space-y-2">
            <li>Escrow dasar</li>
            <li>Notifikasi</li>
            <li>Base Sepolia</li>
          </ul>
        </div>
        <div className="card border-blue-200">
          <div className="text-lg font-bold text-darknavy">Pro</div>
          <p className="text-sm text-slate-600">Untuk tim dan proyek berulang.</p>
          <div className="mt-4 text-3xl font-bold text-darknavy">0.3%</div>
          <ul className="mt-4 text-sm text-slate-700 space-y-2">
            <li>Milestone escrow</li>
            <li>Token IDRX</li>
            <li>Prioritas support</li>
          </ul>
        </div>
        <div className="card">
          <div className="text-lg font-bold text-darknavy">Enterprise</div>
          <p className="text-sm text-slate-600">Untuk organisasi dengan kebutuhan khusus.</p>
          <div className="mt-4 text-3xl font-bold text-darknavy">Custom</div>
          <ul className="mt-4 text-sm text-slate-700 space-y-2">
            <li>Integrasi SSO</li>
            <li>Audit & report</li>
            <li>SLA khusus</li>
          </ul>
        </div>
      </div>
    </div>
  );
}