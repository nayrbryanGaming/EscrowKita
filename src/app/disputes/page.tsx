'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ethers } from 'ethers';
import { ESCROW_FACTORY_ABI, ESCROW_ABI } from '../../lib/constants';
import { getJsonRpcProvider } from '../../lib/web3';

type Dispute = { address: string; payer: string; payee: string; amount: string };

export default function DisputesPage() {
  const [items, setItems] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const provider = getJsonRpcProvider();
        const fact = process.env.NEXT_PUBLIC_ESCROW_FACTORY_ADDRESS || process.env.NEXT_PUBLIC_ESCROW_FACTORY;
        if (!fact) { setItems([]); setLoading(false); return; }
        const f = new ethers.Contract(fact, ESCROW_FACTORY_ABI as ethers.InterfaceAbi, provider);
        const addrs: string[] = await f.allEscrows();
        const out: Dispute[] = [];
        for (const addr of addrs) {
          const c = new ethers.Contract(addr, ESCROW_ABI as ethers.InterfaceAbi, provider);
          const [payer, payee, amount, submitted, refunded, released] = await Promise.all([
            c.payer(), c.payee(), c.amount(), c.submitted(), c.refunded(), c.released(),
          ]);
          const isDispute = submitted && !refunded && !released;
          if (isDispute) out.push({ address: addr, payer, payee, amount: amount.toString() });
        }
        setItems(out);
        setLoading(false);
      } catch {
        setItems([]);
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center"><div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-darknavy">Disputes</h1>
        <p className="text-slate-600">Deal dengan status submitted, menunggu keputusan payer/arbiter.</p>
      </div>
      <div className="space-y-4">
        {items.length === 0 && <div className="card"><div className="text-sm text-slate-600">Tidak ada dispute saat ini.</div></div>}
        {items.map((d) => (
          <div key={d.address} className="card flex items-center justify-between gap-4">
            <div>
              <div className="text-sm text-slate-600">{d.payer} → {d.payee}</div>
              <div className="font-mono text-sm">{d.address}</div>
            </div>
            <Link href={`/escrow/${d.address}`} className="btn-outline">Buka</Link>
          </div>
        ))}
      </div>
    </div>
  );
}