'use client';

import React from 'react';

export default function AnalyticsPage() {
  const stats = [
    { label: 'Total Value', value: 'IDR 150,000,000' },
    { label: 'Active Deals', value: '24' },
    { label: 'Completed', value: '18' },
    { label: 'Disputes', value: '2' },
  ];
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-darknavy">Analytics</h1>
        <p className="text-slate-600">Ringkasan transaksi escrow Anda.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="card">
            <div className="text-sm text-slate-600">{s.label}</div>
            <div className="mt-2 text-xl font-bold text-darknavy">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="text-lg font-bold text-darknavy">Activity</div>
        <p className="text-sm text-slate-600">Grafik dan tren akan ditambahkan setelah integrasi telemetry.</p>
      </div>
    </div>
  );
}