'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Search } from 'lucide-react';

const BASE_SEPOLIA_CHAIN_ID = 84532;

export default function EscrowListPage() {
  const [addressInput, setAddressInput] = useState('');

  const trimmed = addressInput.trim();
  const looksLikeAddress = /^0x[a-fA-F0-9]{40}$/.test(trimmed);

  return (
    <div className="min-h-full">
      <div className="max-w-xl mx-auto space-y-8">
        <h1 className="text-2xl md:text-3xl font-bold text-darknavy">Deals</h1>
        <p className="text-slate-600">
          Create a new secure deal or open an existing one by contract address.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-darknavy mb-4">Create a deal</h2>
          <p className="text-sm text-slate-600 mb-4">
            Lock funds onchain. Release only when work is done.
          </p>
          <Link
            href="/create"
            className="btn-primary inline-flex items-center gap-2"
          >
            Create Secure Deal
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-darknavy mb-4">Open by address</h2>
          <p className="text-sm text-slate-600 mb-4">
            Enter the escrow contract address to view deal details and take action.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder="0x..."
              className="input-field font-mono text-sm flex-1"
            />
            <Link
              href={looksLikeAddress ? `/escrow/${trimmed}` : '#'}
              className={`btn-primary flex items-center justify-center gap-2 ${!looksLikeAddress ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <Search className="w-4 h-4" />
              Open
            </Link>
          </div>
          {addressInput && !looksLikeAddress && (
            <p className="mt-2 text-sm text-warning">Enter a valid Ethereum address (0x + 40 hex characters).</p>
          )}
        </motion.div>

        <p className="text-xs text-slate-500">
          Deals are on Base Sepolia (Chain ID {BASE_SEPOLIA_CHAIN_ID}). Ensure your wallet is on this network.
        </p>
      </div>
    </div>
  );
}
