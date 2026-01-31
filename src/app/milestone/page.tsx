'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function MilestonePage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-darknavy">Milestone Escrow</h1>
        <p className="text-slate-600">Dua tahap: DP 30% dan Pelunasan 70%. Setiap tahap punya proof dan approval sendiri.</p>
      </div>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="text-lg font-bold text-darknavy">Tahap 1 — DP 30%</div>
          <p className="text-sm text-slate-600">Payer fund tahap pertama, payee submit proof, lalu payer/arbiter approve.</p>
        </div>
        <div className="card">
          <div className="text-lg font-bold text-darknavy">Tahap 2 — 70%</div>
          <p className="text-sm text-slate-600">Setelah tahap 1 selesai, fund dan approve tahap 2.</p>
        </div>
      </motion.div>
      <div className="flex gap-3">
        <Link href="/create?milestone=1&idrx=1" className="btn-primary">Buat Milestone Escrow</Link>
        <Link href="/how-it-works" className="btn-outline">Lihat alur</Link>
      </div>
    </div>
  );
}