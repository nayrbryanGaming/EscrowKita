'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, Shield, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      title: 'Client locks funds',
      desc: 'The payer creates a deal and deposits the amount into the escrow smart contract. Funds are held onchain.',
      icon: Lock,
    },
    {
      title: 'Smart contract holds funds',
      desc: 'Money stays in the contract until conditions are met. No one can move it without the agreed flow.',
      icon: Shield,
    },
    {
      title: 'Funds auto-released when approved',
      desc: 'When the payer (or arbiter) approves, funds are sent to the payee automatically. No manual release.',
      icon: ArrowRight,
    },
  ];

  return (
    <div className="min-h-full">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="max-w-3xl"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-darknavy">How it works</h1>
        <p className="mt-2 text-slate-600">No blockchain jargon. Three steps.</p>
        <div className="mt-12 space-y-8">
          {steps.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: i * 0.1 }}
              className="flex gap-6"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-darknavy">{item.title}</h2>
                <p className="mt-1 text-slate-600">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-4">
          <Link href="/create" className="btn-primary px-5 py-2.5 rounded-lg font-semibold">
            Create Secure Deal
          </Link>
          <Link href="/" className="btn-outline px-5 py-2.5 rounded-lg font-semibold">
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
