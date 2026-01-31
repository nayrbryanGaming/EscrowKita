'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
import { useWallet } from '../../providers';
import { useEscrow, type EscrowStatus } from '../../../hooks/useEscrow';
import { useNotification } from '../../providers';
import { ESCROW_ABI, ESCROW_ERC20_ABI, ESCROW_MILESTONE_ABI, addressUrl, txUrl, ESCROW_TIMEOUT_SECONDS } from '../../../lib/constants';
import { getBrowserProvider } from '../../../lib/web3';

const STATUS_LABELS: Record<EscrowStatus, string> = {
  idle: 'Loading…',
  loading: 'Loading…',
  created: 'Waiting for deposit',
  funded: 'Funds Locked',
  submitted: 'Proof Submitted',
  released: 'Released',
  refunded: 'Refunded',
  error: 'Error',
};

function formatAmount(wei?: string): string {
  if (!wei) return '—';
  try {
    return ethers.formatEther(wei);
  } catch {
    return wei;
  }
}

function Countdown({ fundedAt }: { fundedAt: number }) {
  const [now, setNow] = useState(Date.now());
  React.useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const end = fundedAt * 1000 + ESCROW_TIMEOUT_SECONDS * 1000;
  const left = Math.max(0, Math.floor((end - now) / 1000));
  const d = Math.floor(left / 86400);
  const h = Math.floor((left % 86400) / 3600);
  const m = Math.floor((left % 3600) / 60);
  const s = left % 60;
  if (left <= 0) return <span className="font-mono text-warning">Timeout reached — can claim refund</span>;
  return (
    <span className="font-mono text-text">
      {d}d {h}h {m}m {s}s
    </span>
  );
}

export default function EscrowDetailPage() {
  const { address } = useParams<{ address: string }>();
  const router = useRouter();
  const wallet = useWallet();
  const { notify } = useNotification();
  const state = useEscrow(address);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const isPayer = wallet?.address && state.payer?.toLowerCase() === wallet.address.toLowerCase();
  const isPayee = wallet?.address && state.payee?.toLowerCase() === wallet.address.toLowerCase();
  const isArbiter = wallet?.address && state.arbiter?.toLowerCase() === wallet.address.toLowerCase();
  const canApproveOrRefund = isArbiter || isPayer;

  async function getSigner() {
    const browser = getBrowserProvider();
    if (!browser) throw new Error('Please connect your wallet.');
    const signer = await browser.getSigner();
    if (!signer) throw new Error('Please connect your wallet.');
    return signer;
  }

  async function doFund() {
    if (!state.amount) return;
    try {
      setLoadingAction('fund');
      const signer = await getSigner();
      if (state.isErc20 && !state.tokenAddress) {
        const contract20 = new ethers.Contract(address as string, ESCROW_ERC20_ABI as any, signer);
        const tx = await contract20.fund();
        const receipt = await tx.wait();
        notify('success', `Funded. View: ${txUrl(receipt.hash)}`);
        window.open(txUrl(receipt.hash), '_blank');
      } else if (state.isErc20 && state.tokenAddress) {
        const contractM = new ethers.Contract(address as string, ESCROW_MILESTONE_ABI as any, signer);
        const tx = await contractM.fundMilestone(1);
        const receipt = await tx.wait();
        notify('success', `Milestone 2 funded. View: ${txUrl(receipt.hash)}`);
        window.open(txUrl(receipt.hash), '_blank');
      } else {
        const contract = new ethers.Contract(address as string, ESCROW_ABI as any, signer);
        const tx = await contract.fund({ value: state.amount });
        const receipt = await tx.wait();
        notify('success', `Funded. View: ${txUrl(receipt.hash)}`);
        window.open(txUrl(receipt.hash), '_blank');
      }
    } catch (e: any) {
      notify('error', e?.message || 'Transaction failed.');
    } finally {
      setLoadingAction(null);
    }
  }

  async function doSubmitProof(proof: string) {
    try {
      setLoadingAction('proof');
      const signer = await getSigner();
      const isMilestone = state.isErc20 && state.tokenAddress;
      const contract = new ethers.Contract(address as string, isMilestone ? ESCROW_MILESTONE_ABI as any : ESCROW_ABI as any, signer);
      const tx = isMilestone ? await contract.submitProofForMilestone(0, proof) : await contract.submitProof(proof);
      const receipt = await tx.wait();
      notify('success', `Proof submitted. View: ${txUrl(receipt.hash)}`);
      window.open(txUrl(receipt.hash), '_blank');
    } catch (e: any) {
      notify('error', e?.message || 'Transaction failed.');
    } finally {
      setLoadingAction(null);
    }
  }

  async function doApprove() {
    try {
      setLoadingAction('approve');
      const signer = await getSigner();
      const isMilestone = state.isErc20 && state.tokenAddress;
      const contract = new ethers.Contract(address as string, isMilestone ? ESCROW_MILESTONE_ABI as any : ESCROW_ABI as any, signer);
      const tx = isMilestone ? await contract.approveMilestone(0) : await contract.approve();
      const receipt = await tx.wait();
      notify('success', `Released to payee. View: ${txUrl(receipt.hash)}`);
      window.open(txUrl(receipt.hash), '_blank');
    } catch (e: any) {
      notify('error', e?.message || 'Transaction failed.');
    } finally {
      setLoadingAction(null);
    }
  }

  async function doRefund() {
    try {
      setLoadingAction('refund');
      const signer = await getSigner();
      const isMilestone = state.isErc20 && state.tokenAddress;
      const contract = new ethers.Contract(address as string, isMilestone ? ESCROW_MILESTONE_ABI as any : ESCROW_ABI as any, signer);
      const tx = isMilestone ? await contract.refundMilestone(0) : await contract.refund();
      const receipt = await tx.wait();
      notify('success', `Refunded to payer. View: ${txUrl(receipt.hash)}`);
      window.open(txUrl(receipt.hash), '_blank');
    } catch (e: any) {
      notify('error', e?.message || 'Transaction failed.');
    } finally {
      setLoadingAction(null);
    }
  }

  async function doClaimTimeout() {
    try {
      setLoadingAction('claim');
      const signer = await getSigner();
      const contract = new ethers.Contract(address as string, ESCROW_ABI as any, signer);
      const tx = await contract.claimTimeout(ESCROW_TIMEOUT_SECONDS);
      const receipt = await tx.wait();
      notify('success', `Timeout claimed. View: ${txUrl(receipt.hash)}`);
      window.open(txUrl(receipt.hash), '_blank');
    } catch (e: any) {
      notify('error', e?.message || 'Transaction failed.');
    } finally {
      setLoadingAction(null);
    }
  }

  const busy = loadingAction !== null;

  if (!address) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <p className="text-slate-600">Invalid address.</p>
        <Link href="/escrow" className="text-primary ml-2 hover:underline">Back to deals</Link>
      </div>
    );
  }

  if (state.status === 'loading' || state.status === 'idle') {
    return (
      <div className="min-h-full flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-600">Loading deal from chain…</p>
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="min-h-full flex flex-col items-center justify-center gap-4">
        <p className="text-danger font-medium">Could not load this deal.</p>
        <p className="text-sm text-slate-600 max-w-md text-center">{state.error}</p>
        <Link href="/escrow" className="btn-outline mt-2">Back to deals</Link>
      </div>
    );
  }

  const statusLabel = STATUS_LABELS[state.status];
  const showCountdown = state.fundedAt && state.status === 'funded' && !state.released && !state.refunded;

  return (
    <div className="min-h-full">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.push('/escrow')}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-darknavy">Deal</h1>
        </div>

        {/* Status — large and clear */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <p className="text-sm font-medium text-slate-500 mb-1">Status</p>
          <p className="text-2xl font-bold text-darknavy">{statusLabel}</p>
          {state.status === 'funded' && (
            <>
              <p className="mt-1 text-sm text-slate-600">Waiting for delivery. Payee can submit proof; then payer/arbiter can release.</p>
              {canApproveOrRefund && (
                <p className="mt-1 text-sm font-medium text-primary">Ready to release — use the action below to release funds to payee.</p>
              )}
            </>
          )}
        </motion.div>

        {/* Amount — mono */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Amount</p>
          <p className="font-mono text-2xl font-bold text-darknavy">{formatAmount(state.amount)} ETH</p>
        </div>

        {state.milestones && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500 mb-2">Milestones</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {state.milestones.map((m, i) => (
                <div key={i} className="rounded-lg border border-slate-200 p-4">
                  <p className="text-sm text-slate-500">Milestone {i + 1}</p>
                  <p className="font-mono text-lg text-darknavy">{ethers.formatEther(m.amount)} IDRX</p>
                  <p className="text-sm text-slate-600 mt-1">{m.funded ? 'Funded' : 'Not funded'} · {m.submitted ? 'Proof submitted' : 'No proof'} · {m.released ? 'Released' : 'Pending'}</p>
                  {isPayer && !m.funded && i === 1 && (
                    <button onClick={doFund} className="btn-outline mt-3">Fund milestone 2</button>
                  )}
                  {isPayee && m.funded && !m.submitted && i === 0 && (
                    <button onClick={() => doSubmitProof(prompt('Enter proof URL') || '')} className="btn-outline mt-3">Submit proof (M1)</button>
                  )}
                  {canApproveOrRefund && m.funded && m.submitted && !m.released && i === 0 && (
                    <div className="mt-3 flex gap-2">
                      <button onClick={doApprove} className="btn-primary">Approve M1</button>
                      <button onClick={doRefund} className="btn-outline">Refund M1</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Countdown */}
        {showCountdown && state.fundedAt && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500 mb-1">Refund available after (30 days)</p>
            <Countdown fundedAt={state.fundedAt} />
          </div>
        )}

        {/* Contract address — copyable */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-2">Contract address</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm text-text break-all">{address}</span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(address);
                notify('success', 'Address copied.');
              }}
              className="shrink-0 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Copy
            </button>
            <a
              href={addressUrl(address)}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primaryHover transition-colors"
            >
              BaseScan
            </a>
          </div>
        </div>

        {/* Parties */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
          <p className="text-sm font-medium text-slate-500">Payer</p>
          <p className="font-mono text-sm text-text break-all">{state.payer ?? '—'}</p>
          <p className="text-sm font-medium text-slate-500 mt-4">Payee</p>
          <p className="font-mono text-sm text-text break-all">{state.payee ?? '—'}</p>
        </div>

        {/* Actions — role-based */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
          <p className="text-sm font-medium text-slate-500 mb-4">Actions</p>
          {state.status === 'created' && isPayer && (
            <button
              type="button"
              onClick={doFund}
              disabled={busy}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loadingAction === 'fund' ? 'Processing…' : 'Deposit funds'}
            </button>
          )}
          {state.status === 'funded' && isPayee && (
            <button
              type="button"
              onClick={() => {
                const url = prompt('Proof URL (e.g. link to deliverable):');
                if (url) doSubmitProof(url);
              }}
              disabled={busy}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loadingAction === 'proof' ? 'Processing…' : 'Submit proof'}
            </button>
          )}
          {state.status === 'funded' && canApproveOrRefund && (
            <>
              <button
                type="button"
                onClick={doApprove}
                disabled={busy}
                className="w-full rounded-lg bg-success text-white font-semibold py-2.5 px-4 hover:bg-green-600 disabled:opacity-50"
              >
                {loadingAction === 'approve' ? 'Processing…' : 'Release to payee'}
              </button>
              <button
                type="button"
                onClick={doRefund}
                disabled={busy}
                className="w-full rounded-lg border-2 border-danger text-danger font-semibold py-2.5 px-4 hover:bg-red-50 disabled:opacity-50"
              >
                {loadingAction === 'refund' ? 'Processing…' : 'Refund to payer'}
              </button>
            </>
          )}
          {state.status === 'funded' && isPayer && state.fundedAt && (() => {
            const elapsed = Date.now() / 1000 - state.fundedAt;
            if (elapsed >= ESCROW_TIMEOUT_SECONDS) {
              return (
                <button
                  type="button"
                  onClick={doClaimTimeout}
                  disabled={busy}
                  className="w-full rounded-lg bg-warning text-white font-semibold py-2.5 px-4 hover:bg-amber-600 disabled:opacity-50"
                >
                  {loadingAction === 'claim' ? 'Processing…' : 'Claim refund (timeout)'}
                </button>
              );
            }
            return null;
          })()}
          {!wallet?.address && (
            <p className="text-sm text-slate-500">Connect your wallet to see actions.</p>
          )}
        </div>
      </div>
    </div>
  );
}
