'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Search, DollarSign, CheckCircle, Clock, ShieldAlert, AlertTriangle } from 'lucide-react';
import { ethers } from 'ethers';
import { ESCROW_FACTORY_ABI, ESCROW_ABI, ESCROW_ERC20_FACTORY_ABI, ESCROW_ERC20_ABI } from '../../lib/constants';
import { getJsonRpcProvider } from '../../lib/web3';

const BASE_SEPOLIA_CHAIN_ID = 84532;

type Deal = {
  address: string;
  buyer: string;
  seller: string;
  amount: number;
  status: 'active' | 'completed' | 'disputed';
  submitted?: boolean;
};

export default function EscrowListPage() {
  const [addressInput, setAddressInput] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'disputed' | 'needs'>('all');
  const [q, setQ] = useState('');

  const trimmed = addressInput.trim();
  const looksLikeAddress = /^0x[a-fA-F0-9]{40}$/.test(trimmed);
  const [deals, setDeals] = useState<Deal[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const provider = getJsonRpcProvider();
        const factPlain = process.env.NEXT_PUBLIC_ESCROW_FACTORY_ADDRESS || process.env.NEXT_PUBLIC_ESCROW_FACTORY;
        const factErc20 = process.env.NEXT_PUBLIC_ESCROW_FACTORY_ERC20;
        const out: Deal[] = [];
        if (factPlain) {
          const f = new ethers.Contract(factPlain, ESCROW_FACTORY_ABI as ethers.InterfaceAbi, provider);
          const addrs: string[] = await f.allEscrows();
          for (const addr of addrs) {
            const c = new ethers.Contract(addr, ESCROW_ABI as ethers.InterfaceAbi, provider);
            const [payer, payee, amount, released, refunded, submitted] = await Promise.all([
              c.payer(), c.payee(), c.amount(), c.released(), c.refunded(), c.submitted(),
            ]);
            const status: Deal['status'] = released ? 'completed' : submitted && !refunded ? 'disputed' : 'active';
            out.push({ address: addr, buyer: String(payer), seller: String(payee), amount: Number(amount), status, submitted: Boolean(submitted) });
          }
        }
        if (factErc20) {
          const f20 = new ethers.Contract(factErc20, ESCROW_ERC20_FACTORY_ABI as ethers.InterfaceAbi, provider);
          const addrs20: string[] = await f20.allEscrows();
          for (const addr of addrs20) {
            const c20 = new ethers.Contract(addr, ESCROW_ERC20_ABI as ethers.InterfaceAbi, provider);
            const [payer, payee, amount, released, refunded, submitted] = await Promise.all([
              c20.payer(), c20.payee(), c20.amount(), c20.released(), c20.refunded(), c20.submitted(),
            ]);
            const status: Deal['status'] = released ? 'completed' : submitted && !refunded ? 'disputed' : 'active';
            // IDRX 6 decimals → tampilkan sebagai integer micro (n), formatter akan konversi
            out.push({ address: addr, buyer: String(payer), seller: String(payee), amount: Number(amount), status, submitted: Boolean(submitted) });
          }
        }
        setDeals(out);
      } catch (e) {
        // silent fail: tetap tampil UI, tanpa dummy
        setDeals([]);
      }
    }
    load();
  }, []);

  const stats = useMemo(() => {
    const totalValue = deals.reduce((s, d) => s + d.amount, 0);
    const active = deals.filter((d) => d.status === 'active').length;
    const completed = deals.filter((d) => d.status === 'completed').length;
    const needs = deals.filter((d) => d.submitted && d.status === 'active').length;
    return { totalValue, active, completed, needs };
  }, [deals]);

  const filteredDeals = useMemo(() => {
    const byFilter = filter === 'all' ? deals : filter === 'disputed' || filter === 'completed' || filter === 'active'
      ? deals.filter((d) => d.status === filter)
      : deals.filter((d) => d.submitted && d.status === 'active');
    const bySearch = q
      ? byFilter.filter((d) => d.address.toLowerCase().includes(q.toLowerCase()))
      : byFilter;
    return bySearch;
  }, [filter, q, deals]);

  function formatIdrx(n: number) {
    const v = n / 1_000_000;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);
  }

  return (
    <div className="min-h-full">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-darknavy">Deals</h1>
            <p className="text-slate-600">Kelola escrow Anda seperti dashboard profesional.</p>
          </div>
          <Link href="/create" className="btn-primary inline-flex items-center gap-2">
            Create Deal
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-blue-50 rounded-lg"><DollarSign className="w-5 h-5 text-blue-600" /></div>
            </div>
            <div className="text-sm text-slate-600">Total Value</div>
            <div className="text-2xl font-bold text-darknavy">{formatIdrx(stats.totalValue)}</div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-emerald-50 rounded-lg"><CheckCircle className="w-5 h-5 text-emerald-600" /></div>
            </div>
            <div className="text-sm text-slate-600">Completed</div>
            <div className="text-2xl font-bold text-darknavy">{stats.completed}</div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-indigo-50 rounded-lg"><Clock className="w-5 h-5 text-indigo-600" /></div>
            </div>
            <div className="text-sm text-slate-600">Active</div>
            <div className="text-2xl font-bold text-darknavy">{stats.active}</div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-amber-50 rounded-lg"><ShieldAlert className="w-5 h-5 text-amber-600" /></div>
            </div>
            <div className="text-sm text-slate-600">Disputed</div>
            <div className="text-2xl font-bold text-darknavy">{deals.filter((d) => d.status === 'disputed').length}</div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-rose-50 rounded-lg"><AlertTriangle className="w-5 h-5 text-rose-600" /></div>
            </div>
            <div className="text-sm text-slate-600">Needs Attention</div>
            <div className="text-2xl font-bold text-darknavy">{stats.needs}</div>
          </div>
        </div>

        <div className="card">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-2">
              <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-full text-sm font-semibold ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}>All</button>
              <button onClick={() => setFilter('active')} className={`px-3 py-1.5 rounded-full text-sm font-semibold ${filter === 'active' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}>Active</button>
              <button onClick={() => setFilter('completed')} className={`px-3 py-1.5 rounded-full text-sm font-semibold ${filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}>Completed</button>
              <button onClick={() => setFilter('disputed')} className={`px-3 py-1.5 rounded-full text-sm font-semibold ${filter === 'disputed' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}>Disputed</button>
              <button onClick={() => setFilter('needs' as any)} className={`px-3 py-1.5 rounded-full text-sm font-semibold ${filter === 'needs' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}>Needs</button>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full lg:w-72">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari address…" className="input-field pl-9" />
              </div>
            </div>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-sm text-slate-500">
                  <th className="py-2">Address</th>
                  <th className="py-2">Parties</th>
                  <th className="py-2">Amount</th>
                  <th className="py-2">Status</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {filteredDeals.map((d) => (
                  <tr key={d.address} className="border-t border-slate-200">
                    <td className="py-3 font-mono text-sm">{d.address.slice(0, 8)}…{d.address.slice(-6)}</td>
                    <td className="py-3 text-sm text-slate-700">{d.buyer} → {d.seller}</td>
                    <td className="py-3 text-sm font-semibold">{formatIdrx(d.amount)}</td>
                    <td className="py-3">
                      <span className={`badge ${d.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : d.status === 'active' ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'}`}>{d.status}</span>
                    </td>
                    <td className="py-3">
                      <Link href={`/escrow/${d.address}`} className="btn-outline">Open</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card">
            <h2 className="text-lg font-semibold text-darknavy mb-2">Create a deal</h2>
            <p className="text-sm text-slate-600 mb-4">Lock funds onchain. Release only when work is done.</p>
            <Link href="/create" className="btn-primary inline-flex items-center gap-2">
              Create Secure Deal
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
            <h2 className="text-lg font-semibold text-darknavy mb-2">Open by address</h2>
            <p className="text-sm text-slate-600 mb-4">Enter the escrow contract address to view details.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input type="text" value={addressInput} onChange={(e) => setAddressInput(e.target.value)} placeholder="0x..." className="input-field font-mono text-sm flex-1" />
              <Link href={looksLikeAddress ? `/escrow/${trimmed}` : '#'} className={`btn-primary flex items-center justify-center gap-2 ${!looksLikeAddress ? 'opacity-50 pointer-events-none' : ''}`}>
                <Search className="w-4 h-4" />
                Open
              </Link>
            </div>
            {addressInput && !looksLikeAddress && (
              <p className="mt-2 text-sm text-warning">Enter a valid Ethereum address (0x + 40 hex characters).</p>
            )}
            <p className="mt-4 text-xs text-slate-500">Base Sepolia (Chain ID {BASE_SEPOLIA_CHAIN_ID}). Pastikan wallet Anda pada network ini.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
