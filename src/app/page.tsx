'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, Shield, ArrowRight, Check, Zap } from 'lucide-react';
import { addressUrl } from '../lib/constants';

const BASESCAN_CONTRACT = process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS
  ? `https://sepolia.basescan.org/address/${process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS}`
  : 'https://sepolia.basescan.org';

function isAddr(s?: string) {
  if (!s) return false;
  return /^0x[a-fA-F0-9]{40}$/.test(s);
}

export default function Home() {
  const factoryEth = process.env.NEXT_PUBLIC_ESCROW_FACTORY_ADDRESS || process.env.NEXT_PUBLIC_ESCROW_FACTORY;
  const factoryErc20 = process.env.NEXT_PUBLIC_ESCROW_FACTORY_ERC20;
  const factoryMilestone = process.env.NEXT_PUBLIC_ESCROW_FACTORY_MILESTONE;
  const idrx = process.env.NEXT_PUBLIC_IDRX_ADDRESS;

  const proofs = useMemo(() => {
    const items: { label: string; href: string }[] = [];
    if (isAddr(factoryEth)) items.push({ label: 'Factory (ETH)', href: addressUrl(String(factoryEth)) });
    if (isAddr(factoryErc20)) items.push({ label: 'Factory (IDRX)', href: addressUrl(String(factoryErc20)) });
    if (isAddr(factoryMilestone)) items.push({ label: 'Factory (Milestone)', href: addressUrl(String(factoryMilestone)) });
    if (isAddr(idrx)) items.push({ label: 'IDRX Token', href: addressUrl(String(idrx)) });
    return items;
  }, [factoryEth, factoryErc20, factoryMilestone, idrx]);
  return (
    <div className="min-h-full">
      {/* HERO */}
      <section className="pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl"
        >
          <div className="mb-4">
            <span className="badge-outline">Powered by Base Sepolia</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-darknavy tracking-tight leading-tight">
            Get Paid Safely.{' '}
            <span className="text-primary">Without Trusting Anyone.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-600 leading-relaxed">
            Smart contract escrow in IDR. Funds are locked onchain and released only when the work is done.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link
              href="/create"
              className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-base font-semibold rounded-lg"
            >
              Create Secure Deal
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/how-it-works"
              className="btn-outline inline-flex items-center gap-2 px-6 py-3 text-base font-semibold rounded-lg"
            >
              See How It Works
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="badge-success">
              <Check className="w-4 h-4" />
              Verified on Base
            </span>
            <a
              href={BASESCAN_CONTRACT}
              target="_blank"
              rel="noopener noreferrer"
              className="badge-outline hover:border-primary hover:text-primary"
            >
              View on BaseScan
            </a>
            {proofs.map((p) => (
              <a key={p.label} href={p.href} target="_blank" rel="noopener noreferrer" className="badge-outline hover:border-primary hover:text-primary">
                {p.label}
              </a>
            ))}
          </div>
          <div className="mt-10 pt-10 border-t border-slate-200">
            <p className="text-sm font-medium text-slate-500 mb-3">Trust indicators</p>
            <div className="flex flex-wrap gap-6 text-sm text-slate-700">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Non-custodial
              </span>
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                Open-source
              </span>
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                On-chain escrow
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* HOW IT WORKS — 3 steps */}
      <section id="how-it-works" className="py-16 md:py-24 border-t border-slate-200">
        <h2 className="text-2xl md:text-3xl font-bold text-darknavy mb-2">How it works</h2>
        <p className="text-slate-600 mb-12 max-w-xl">No blockchain jargon. Three simple steps.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: 1,
              title: 'Client locks funds',
              desc: 'The payer creates a deal and deposits the amount into the escrow smart contract. Funds are held onchain.',
              icon: Lock,
            },
            {
              step: 2,
              title: 'Smart contract holds funds',
              desc: 'Money stays in the contract until conditions are met. No one can move it without the agreed flow.',
              icon: Shield,
            },
            {
              step: 3,
              title: 'Funds auto-released when approved',
              desc: 'When the payer (or arbiter) approves, funds are sent to the payee automatically. No manual release.',
              icon: ArrowRight,
            },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.1 }}
              className="relative bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-mono font-bold text-lg">
                {item.step}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-darknavy">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              {i < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-slate-200" aria-hidden />
              )}
            </motion.div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/how-it-works" className="text-primary font-semibold hover:underline">
            Full flow and comparison →
          </Link>
        </div>
      </section>

      {/* WHY ESCROWKITA — comparison table */}
      <section className="py-16 md:py-24 border-t border-slate-200">
        <h2 className="text-2xl md:text-3xl font-bold text-darknavy mb-2">Why EscrowKita</h2>
        <p className="text-slate-600 mb-12 max-w-xl">
          We never touch your money. The smart contract holds it until the deal is done.
        </p>
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-lightbg">
                <th className="px-6 py-4 font-semibold text-darknavy">Feature</th>
                <th className="px-6 py-4 font-semibold text-darknavy">Manual rekber / traditional</th>
                <th className="px-6 py-4 font-semibold text-primary bg-primary/5">EscrowKita</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="px-6 py-4 font-medium text-text">Who holds the funds?</td>
                <td className="px-6 py-4 text-slate-600">Middleman or platform</td>
                <td className="px-6 py-4 text-slate-700 font-medium">Smart contract onchain</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-6 py-4 font-medium text-text">Can the platform run away with funds?</td>
                <td className="px-6 py-4 text-slate-600">Yes, possible</td>
                <td className="px-6 py-4 text-success font-medium">No. We never custody funds.</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-6 py-4 font-medium text-text">Verifiable on blockchain?</td>
                <td className="px-6 py-4 text-slate-600">No</td>
                <td className="px-6 py-4 text-success font-medium">Yes. Every step on BaseScan.</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-text">Release when?</td>
                <td className="px-6 py-4 text-slate-600">When middleman decides</td>
                <td className="px-6 py-4 text-slate-700 font-medium">Only when payer/arbiter approves</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 border-t border-slate-200">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-darknavy text-white p-8 md:p-12 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold">Ready to create a secure deal?</h2>
          <p className="mt-2 text-slate-300">Lock funds onchain. Release only when work is done.</p>
          <Link
            href="/create"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primaryHover transition-colors"
          >
            Create Secure Deal
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
