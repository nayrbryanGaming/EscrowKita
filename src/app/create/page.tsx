'use client';

import React, { useState, useMemo } from 'react';
// Link not used
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ethers } from 'ethers';
import { useWallet, useNotification } from '../providers';
import { ESCROW_FACTORY_ABI, ESCROW_ABI, ESCROW_ERC20_FACTORY_ABI, ESCROW_ERC20_ABI, txUrl } from '../../lib/constants';

const WIZARD_STEPS = [
  { id: 'role', title: 'Your role' },
  { id: 'counterparty', title: "Counterparty's wallet" },
  { id: 'amount', title: 'Amount' },
  { id: 'review', title: 'Review & lock' },
];

const FACTORY_ADDRESS = process.env.NEXT_PUBLIC_ESCROW_FACTORY_ADDRESS || process.env.NEXT_PUBLIC_ESCROW_FACTORY || '';
const FACTORY_ERC20_ADDRESS = process.env.NEXT_PUBLIC_ESCROW_FACTORY_ERC20 || '';
const FACTORY_MILESTONE_ADDRESS = process.env.NEXT_PUBLIC_ESCROW_FACTORY_MILESTONE || '';
const IDRX_ADDRESS = process.env.NEXT_PUBLIC_IDRX_ADDRESS || '';

function isValidAddress(s: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(s);
}

function humanError(err: unknown): string {
  const maybeMsg = typeof err === 'object' && err && 'message' in (err as { message?: string }) ? (err as { message?: string }).message : undefined;
  const msg = String(maybeMsg ?? err);
  if (msg.includes('user rejected')) return 'You cancelled the transaction.';
  if (msg.includes('insufficient funds')) return 'Not enough ETH in your wallet for this amount and gas.';
  if (msg.includes('incorrect amount')) return 'Amount must match exactly. Please try again.';
  if (msg.includes('already funded')) return 'This escrow is already funded.';
  return msg.length > 80 ? msg.slice(0, 80) + '…' : msg;
}

export default function CreateDealPage() {
  const router = useRouter();
  const search = useSearchParams();
  const wallet = useWallet();
  const { notify } = useNotification();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    payee: '',
    amountEth: '',
  });
  const [useIdrx, setUseIdrx] = useState(Boolean(search.get('idrx')));
  const [useMilestone, setUseMilestone] = useState(Boolean(search.get('milestone')));
  const [submitting, setSubmitting] = useState(false);
  // removed unused state

  const progressPct = ((step + 1) / WIZARD_STEPS.length) * 100;

  const canNext = useMemo(() => {
    if (step === 0) return true;
    if (step === 1) return form.payee.trim() !== '' && isValidAddress(form.payee.trim());
    if (step === 2) {
      const n = Number(form.amountEth);
      return !Number.isNaN(n) && n > 0 && n < 1e6;
    }
    return true;
  }, [step, form]);

  const handleSubmit = async () => {
    if (step < WIZARD_STEPS.length - 1) {
      setStep((s) => s + 1);
      return;
    }

    const signer = wallet?.signer;
    const payerAddr = wallet?.address;
    if (!signer || !payerAddr) {
      notify('error', 'Please connect your wallet first.');
      return;
    }
    if (!FACTORY_ADDRESS) {
      notify('error', 'Factory contract not configured. Please try again later.');
      return;
    }
    if (!form.payee.trim() || !isValidAddress(form.payee.trim())) {
      notify('error', 'Please enter a valid payee address.');
      return;
    }
    const amountEth = Number(form.amountEth);
    if (Number.isNaN(amountEth) || amountEth <= 0) {
      notify('error', 'Please enter a valid amount.');
      return;
    }

    setSubmitting(true);
    try {
      const amountWei = ethers.parseEther(String(form.amountEth));
      const arbiter = process.env.NEXT_PUBLIC_PLATFORM_ARBITER || payerAddr;
      const payee = form.payee.trim();

      if (useMilestone && useIdrx) {
        if (!FACTORY_MILESTONE_ADDRESS || !IDRX_ADDRESS) throw new Error('ERC20 milestone escrow not configured.');
        const totalWei = ethers.parseEther(String(form.amountEth));
        const m1Wei = (totalWei * 30n) / 100n;
        const m2Wei = totalWei - m1Wei;
        const factoryMilestoneAbi = [
          { inputs: [
            { internalType: 'address', name: 'payer', type: 'address' },
            { internalType: 'address', name: 'payee', type: 'address' },
            { internalType: 'address', name: 'arbiter', type: 'address' },
            { internalType: 'address', name: 'token', type: 'address' },
            { internalType: 'uint256', name: 'totalAmount', type: 'uint256' },
            { internalType: 'uint256', name: 'm1Amount', type: 'uint256' },
            { internalType: 'uint256', name: 'm2Amount', type: 'uint256' },
          ], name: 'createEscrowMilestone', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'nonpayable', type: 'function' },
          { inputs: [], name: 'allEscrowsLength', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
        ] as const;
        const factoryM = new ethers.Contract(FACTORY_MILESTONE_ADDRESS, factoryMilestoneAbi as ethers.InterfaceAbi, signer);
        const tx = await factoryM.createEscrowMilestone(payerAddr, payee, arbiter, IDRX_ADDRESS, totalWei, m1Wei, m2Wei);
        const _receipt = await tx.wait();
        const len = await factoryM.allEscrowsLength();
        const idx = Number(len) - 1;
        const escrowAddr = await factoryM.allEscrows(idx);
        const idrxAbi = [
          { inputs: [{ internalType: 'address', name: 'spender', type: 'address' }, { internalType: 'uint256', name: 'value', type: 'uint256' }], name: 'approve', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'nonpayable', type: 'function' },
        ] as const;
        const idrx = new ethers.Contract(IDRX_ADDRESS, idrxAbi as ethers.InterfaceAbi, signer);
        const approveTx = await idrx.approve(escrowAddr, m1Wei);
        await approveTx.wait();
        const milestoneAbi = [
          { inputs: [{ internalType: 'uint256', name: 'index', type: 'uint256' }], name: 'fundMilestone', outputs: [], stateMutability: 'nonpayable', type: 'function' },
        ] as const;
        const escrowM = new ethers.Contract(escrowAddr, milestoneAbi as ethers.InterfaceAbi, signer);
        const fundTx = await escrowM.fundMilestone(0);
        const fundReceipt = await fundTx.wait();
        notify('success', `Milestone 1 funded. View: ${txUrl(fundReceipt.hash)}`);
        setSubmitting(false);
        router.push(`/escrow/${escrowAddr}`);
      } else if (useIdrx) {
        if (!FACTORY_ERC20_ADDRESS || !IDRX_ADDRESS) {
          throw new Error('ERC20 escrow not configured. Missing factory or IDRX address.');
        }
        const factory20 = new ethers.Contract(FACTORY_ERC20_ADDRESS, ESCROW_ERC20_FACTORY_ABI as ethers.InterfaceAbi, signer);
        const tx = await factory20.createEscrowERC20(payerAddr, payee, arbiter, IDRX_ADDRESS, amountWei);
        const _receipt = await tx.wait();
        const all20 = await factory20.allEscrows();
        const escrowAddr = all20.length > 0 ? all20[all20.length - 1] : null;
        if (!escrowAddr) throw new Error('Could not get ERC20 escrow address');
        // Approve IDRX to escrow then fund
        const idrxAbi = [
          { inputs: [{ internalType: 'address', name: 'spender', type: 'address' }, { internalType: 'uint256', name: 'value', type: 'uint256' }], name: 'approve', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'nonpayable', type: 'function' },
        ] as const;
        const idrx = new ethers.Contract(IDRX_ADDRESS, idrxAbi as ethers.InterfaceAbi, signer);
        const approveTx = await idrx.approve(escrowAddr, amountWei);
        await approveTx.wait();
        const escrow20 = new ethers.Contract(escrowAddr, ESCROW_ERC20_ABI as ethers.InterfaceAbi, signer);
        const fundTx = await escrow20.fund();
        const fundReceipt = await fundTx.wait();
        notify('success', `IDRX deal created and funded. View: ${txUrl(fundReceipt.hash)}`);
        setSubmitting(false);
        router.push(`/escrow/${escrowAddr}`);
      } else {
        const factory = new ethers.Contract(FACTORY_ADDRESS, ESCROW_FACTORY_ABI as ethers.InterfaceAbi, signer);
        const tx = await factory.createEscrow(payerAddr, payee, arbiter, amountWei);
        const _receipt = await tx.wait();
        const addrs = await factory.allEscrows();
        const escrowAddress = addrs.length > 0 ? addrs[addrs.length - 1] : null;
        if (!escrowAddress) throw new Error('Could not get escrow address');
        const escrow = new ethers.Contract(escrowAddress, ESCROW_ABI as ethers.InterfaceAbi, signer);
        const fundTx = await escrow.fund({ value: amountWei });
        const fundReceipt = await fundTx.wait();
        notify('success', `Deal created and funded. View: ${txUrl(fundReceipt.hash)}`);
        setSubmitting(false);
        router.push(`/escrow/${escrowAddress}`);
      }
    } catch (err: unknown) {
      setSubmitting(false);
      notify('error', humanError(err));
    }
  };

  return (
    <div className="min-h-full">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-darknavy">Create Secure Deal</h1>
        <p className="mt-1 text-slate-600">Four steps. One decision per screen.</p>

        {/* Progress bar */}
        <div className="mt-8 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-slate-500">
          {WIZARD_STEPS.map((s, i) => (
            <span key={s.id} className={i <= step ? 'text-primary font-medium' : ''}>
              {s.title}
            </span>
          ))}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="mt-8 space-y-6">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="role"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="space-y-4"
              >
                <p className="text-slate-700">
                  You are the <strong className="text-darknavy">payer</strong>. You will lock funds in the escrow contract. The payee will receive them only after you approve (or after proof of work).
                </p>
                <p className="text-sm text-slate-500">
                  Click Next to enter the payee&apos;s wallet address.
                </p>
              </motion.div>
            )}
            {step === 1 && (
              <motion.div
                key="counterparty"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="space-y-4"
              >
                <label className="block text-sm font-medium text-text">
                  Payee wallet address
                </label>
                <input
                  type="text"
                  value={form.payee}
                  onChange={(e) => setForm((f) => ({ ...f, payee: e.target.value }))}
                  placeholder="0x..."
                  className="input-field font-mono text-sm"
                  required
                />
                {form.payee && !isValidAddress(form.payee.trim()) && (
                  <p className="text-sm text-danger">Please enter a valid Ethereum address (0x followed by 40 hex characters).</p>
                )}
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                key="amount"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="space-y-4"
              >
                <label className="block text-sm font-medium text-text">Amount ({useIdrx ? 'IDRX' : 'ETH'})</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={form.amountEth}
                  onChange={(e) => setForm((f) => ({ ...f, amountEth: e.target.value }))}
                  placeholder="0.01"
                  className="input-field font-mono"
                  required
                />
        <div className="flex items-center gap-2">
          <input id="use-idrx" type="checkbox" checked={useIdrx} onChange={(e) => setUseIdrx(e.target.checked)} />
          <label htmlFor="use-idrx" className="text-sm text-slate-700">Use IDRX token (Base Sepolia)</label>
        </div>
        <div className="flex items-center gap-2">
          <input id="use-milestone" type="checkbox" checked={useMilestone} onChange={(e) => setUseMilestone(e.target.checked)} />
          <label htmlFor="use-milestone" className="text-sm text-slate-700">Milestone mode (DP 30% + 70%)</label>
        </div>
                <p className="text-sm text-slate-500">
                  Funds are locked onchain. Refund is available after 30 days if not released. You pay gas to create and fund.
                </p>
                {form.amountEth && (Number(form.amountEth) <= 0 || Number.isNaN(Number(form.amountEth))) && (
                  <p className="text-sm text-danger">Please enter a positive number.</p>
                )}
              </motion.div>
            )}
            {step === 3 && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="space-y-4"
              >
                <div className="card-muted space-y-3">
                  <div>
                    <span className="text-sm text-slate-500">Payee</span>
                    <p className="font-mono text-sm text-text break-all">{form.payee.trim()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-slate-500">Amount</span>
                    <p className="font-mono text-lg font-semibold text-darknavy">{form.amountEth} ETH</p>
                  </div>
                  <p className="text-sm text-slate-600">
                    You will create the escrow contract and send the amount in one flow. This will require two transactions (create + fund).
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0 || submitting}
              className="btn-outline disabled:opacity-50"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={!canNext || submitting}
              className="btn-primary disabled:opacity-50 disabled:pointer-events-none"
            >
              {submitting ? 'Creating…' : step === WIZARD_STEPS.length - 1 ? 'Create & lock funds' : 'Next'}
            </button>
          </div>
        </form>

        <p className="mt-6 text-xs text-slate-500">
          Deployed on Base Sepolia. Ensure your wallet is on Base Sepolia (Chain ID 84532).
        </p>
      </div>
    </div>
  );
}
