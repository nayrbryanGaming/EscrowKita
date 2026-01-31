'use client';

import React from 'react';
import Link from 'next/link';

export default function TokenEscrowPage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-darknavy">Token Escrow (IDRX)</h1>
        <p className="text-slate-600">Gunakan token IDRX di Base Sepolia untuk escrow berbasis Rupiah onchain.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="text-lg font-bold text-darknavy">Approve & Fund</div>
          <p className="text-sm text-slate-600">Approve IDRX ke kontrak escrow, lalu fund tanpa ETH value.</p>
        </div>
        <div className="card">
          <div className="text-lg font-bold text-darknavy">Release/Refund</div>
          <p className="text-sm text-slate-600">Payer atau arbiter dapat release atau refund sesuai status.</p>
        </div>
      </div>
      <div className="flex gap-3">
        <Link href="/create?idrx=1" className="btn-primary">Buat Escrow IDRX</Link>
        <Link href="/how-it-works" className="btn-outline">Lihat alur</Link>
      </div>
    </div>
  );
}