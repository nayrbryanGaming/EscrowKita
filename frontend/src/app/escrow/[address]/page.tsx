"use client";
import { useParams } from "next/navigation";
import { useContractRead, useAccount, useContractWrite } from "wagmi";
import { Address } from "wagmi";
import escrowABIJson from "../../../contracts/escrowABI.json";
import { useState, useMemo, useEffect } from "react";
import { useEscrowEvents } from '@/lib/useEscrowEvents';
import type { EscrowEvent } from '@/lib/useEscrowEvents';
import ProofUpload from "@/components/ProofUpload";
import { EnsOrAddress } from "@/components/EnsOrAddress";
import { TxStepper, TxStepperState } from "@/components/TxStepper";
import MilestoneComments from "@/components/MilestoneComments";

const STATUS_LABELS = [
  "Created", "Funded", "Submitted", "Released", "Refunded", "Claimed"
];

// Strongly typed event feed item
type EventFeedItem = {
  name: string;
  args: Record<string, unknown> | null;
  txHash?: string;
  blockNumber?: number;
};


// Milestone event structure
type MilestoneEvent = {
  index: number;
  proof?: string;
  approved?: boolean;
  released?: boolean;
  eventName?: string; // Added for event tracking
};

// ProofInput component
interface ProofInputProps {
  proofUrl: string;
  setProofUrl: (v: string) => void;
  submittingProof: boolean;
  handleSubmitProof: () => void;
}
const ProofInput: React.FC<ProofInputProps> = ({ proofUrl, setProofUrl, submittingProof, handleSubmitProof }) => (
  <div className="flex flex-col gap-2">
    <div className="flex gap-2">
      <input
        className="input input-bordered flex-1"
        placeholder="Proof URL"
        value={proofUrl}
        onChange={e => setProofUrl(e.target.value)}
        disabled={submittingProof}
      />
      <button
        className="btn btn-primary"
        disabled={submittingProof || !proofUrl}
        onClick={handleSubmitProof}
      >
        {submittingProof ? "Submitting..." : "Submit Proof"}
      </button>
    </div>
    <ProofUpload onUpload={setProofUrl} />
  </div>
);

// MilestoneTimeline component
const MilestoneTimeline: React.FC<{ milestones: MilestoneEvent[] }> = ({ milestones }) => (
  <ol className="flex flex-col md:flex-row gap-4 md:gap-0 md:items-center justify-between w-full mb-4">
    {milestones.map((m, i) => (
      <li key={i} className="flex flex-col items-center flex-1">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${m.released ? 'bg-green-600 text-white' : m.approved ? 'bg-blue-600 text-white' : m.proof ? 'bg-yellow-400 text-white' : 'bg-slate-200 text-slate-400'}`}>{i + 1}</div>
        <span className={`text-xs font-semibold ${m.released ? 'text-green-700' : m.approved ? 'text-blue-700' : m.proof ? 'text-yellow-700' : 'text-slate-400'}`}>Milestone {i + 1}</span>
        {m.proof && (
          <a href={m.proof} className="text-xs text-blue-600 underline mt-1" target="_blank" rel="noopener noreferrer">View Proof</a>
        )}
        {m.approved && <span className="text-xs text-blue-600 mt-1">Approved</span>}
        {m.released && <span className="text-xs text-green-600 mt-1">Released</span>}
        <MilestoneComments milestoneIndex={i} />
        {i < milestones.length - 1 && <div className="w-1 h-6 md:w-12 md:h-1 bg-slate-200 mx-auto md:mx-0 md:my-0 my-2" />}
      </li>
    ))}
  </ol>
);

// TxHistory is declared later in the file (single definition kept)

// Status timeline visual (moved outside component)
interface StatusTimelineProps { statusNum: number | undefined }
const StatusTimeline: React.FC<StatusTimelineProps> = ({ statusNum }) => {
  const sn = typeof statusNum === "number" ? statusNum : -1;
  const steps = [
    { label: "Created", color: "bg-gray-300", active: sn >= 0 },
    { label: "Funded", color: "bg-blue-400", active: sn >= 1 },
    { label: "Submitted", color: "bg-yellow-400", active: sn >= 2 },
    { label: "Released", color: "bg-green-500", active: sn === 3 },
    { label: "Refunded", color: "bg-red-400", active: sn === 4 },
    { label: "Claimed", color: "bg-green-700", active: sn === 5 },
  ];
  // Only one of Released/Refunded/Claimed is active at a time
  const finalIdx = sn >= 3 ? sn : null;
  return (
    <ol className="flex items-center justify-between w-full mb-8 gap-2">
      {steps.map((step, i) => (
        <li key={i} className="flex-1 flex flex-col items-center relative">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-lg border-2 transition-all duration-300
            ${i === finalIdx ? step.color + " border-black scale-110 animate-pulse" : step.active ? step.color + " border-white" : "bg-slate-200 border-slate-300 text-slate-400"}`}>{i + 1}</div>
          <span className={`text-xs mt-1 font-semibold ${i === finalIdx ? "text-black" : step.active ? "text-gray-800 dark:text-gray-200" : "text-slate-400"}`}>{step.label}</span>
          {i < steps.length - 1 && <div className={`absolute top-4 left-1/2 w-full h-1 -z-10 ${step.active ? "bg-blue-200" : "bg-slate-200"}`}></div>}
        </li>
      ))}
    </ol>
  );
}

export default function EscrowDetailPage() {
  const { address } = useParams();
  // ...existing code...
  const [error, setError] = useState("");
  const [proofUrl, setProofUrl] = useState<string>("");
  // Transaction stepper state
  const [txState, setTxState] = useState<TxStepperState>("idle");
  // Removed txHash state, not used
  const { address: user } = useAccount();

  // Extract Escrow ABI array from JSON (assume correct key is 'Escrow')
  const escrowABI = (escrowABIJson as any).Escrow || (escrowABIJson as any).default || escrowABIJson;
  // Real-time contract state
  const { data: status } = useContractRead({ address: address as `0x${string}`, abi: escrowABI, functionName: "getStatus" });
  const { data: proof } = useContractRead({ address: address as `0x${string}`, abi: escrowABI, functionName: "getProof" });
  const { data: payer } = useContractRead({ address: address as `0x${string}`, abi: escrowABI, functionName: "payer" });
  const { data: payee } = useContractRead({ address: address as `0x${string}`, abi: escrowABI, functionName: "payee" });
  const { data: amount } = useContractRead({ address: address as `0x${string}`, abi: escrowABI, functionName: "amount" });
  const { data: timeout } = useContractRead({ address: address as `0x${string}`, abi: escrowABI, functionName: "timeout" });
  const { data: milestoneCountRaw } = useContractRead({ address: address as `0x${string}`, abi: escrowABI, functionName: "milestoneCount" });
  const milestoneCount = Number(milestoneCountRaw) || 1;
  // Milestone event audit: event-driven state

  type MilestoneEventState = { eventName: string; index?: number; data?: string };
  const [milestoneEvents, setMilestoneEvents] = useState<MilestoneEventState[]>([]);
  // Global decoded events feed (new) - most recent first
  const [eventsFeed, setEventsFeed] = useState<EventFeedItem[]>([]);

  // subscribe to contract events (hook notifies and calls onEvent)
  useEscrowEvents(address as string, escrowABI, (ev: EscrowEvent) => {
    try {
      let args: Record<string, unknown> | null = null;
      if (ev.decoded && typeof ev.decoded === 'object' && 'args' in ev.decoded && typeof (ev.decoded as any).args === 'object') {
        args = (ev.decoded as any).args;
      } else if (ev.decoded && typeof ev.decoded === 'object') {
        args = ev.decoded as Record<string, unknown>;
      }
      const compact: EventFeedItem = {
        name: ev.name,
        args,
        txHash: ev.log?.transactionHash,
        blockNumber: ev.log?.blockNumber ? Number(ev.log.blockNumber) : undefined,
      };
      setEventsFeed(prev => [compact, ...prev].slice(0, 200));
      // mirror specific milestone events for timeline
      if (compact.name === 'ProofSubmitted' && compact.args && typeof (compact.args as any).index !== 'undefined') {
        setMilestoneEvents(prev => ([...prev, { eventName: 'ProofSubmitted', index: Number((compact.args as any).index ?? 0), data: (compact.args as any).proof }]));
      }
      if (compact.name === 'Released') setMilestoneEvents(prev => ([...prev, { eventName: 'Released', index: Number((compact.args as any)?.index ?? 0) }]));
      if (compact.name === 'Approved') setMilestoneEvents(prev => ([...prev, { eventName: 'Approved', index: Number((compact.args as any)?.index ?? 0) }]));
    } catch (e) {
      // swallow
    }
  });
  const milestones: MilestoneEvent[] = useMemo(() => {
    if (!milestoneCount) return [];
    const arr: MilestoneEvent[] = Array.from({ length: milestoneCount }, (_, i) => ({ index: i }));
    milestoneEvents.forEach(ev => {
      if (ev.eventName === 'ProofSubmitted' && arr[ev.index ?? 0]) arr[ev.index ?? 0].proof = ev.data || undefined;
      if (ev.eventName === 'Released' && arr[ev.index ?? 0]) arr[ev.index ?? 0].released = true;
      if (ev.eventName === 'Approved' && arr[ev.index ?? 0]) arr[ev.index ?? 0].approved = true;
    });
    arr.forEach(m => { if (m.released) m.approved = true; });
    return arr;
  }, [milestoneCount, milestoneEvents]);



// ...existing code...

  // Write contract hooks
  // @ts-expect-error wagmi v1 type issue, runtime is correct
  const depositWrite = useContractWrite({ address: address as unknown as Address, abi: escrowABI, functionName: "deposit" });
  // @ts-expect-error wagmi v1 type issue, runtime is correct
  const submitProofWrite = useContractWrite({ address: address as unknown as Address, abi: escrowABI, functionName: "submitProof" });
  // @ts-expect-error wagmi v1 type issue, runtime is correct
  const approveWrite = useContractWrite({ address: address as unknown as Address, abi: escrowABI, functionName: "approve" });
  // @ts-expect-error wagmi v1 type issue, runtime is correct
  const refundWrite = useContractWrite({ address: address as unknown as Address, abi: escrowABI, functionName: "refund" });
  // @ts-expect-error wagmi v1 type issue, runtime is correct
  const claimWrite = useContractWrite({ address: address as unknown as Address, abi: escrowABI, functionName: "claim" });

  // Role detection
  const payerAddr = typeof payer === 'string' ? payer : undefined;
  const payeeAddr = typeof payee === 'string' ? payee : undefined;
  const isPayer = user && payerAddr && user.toLowerCase() === payerAddr.toLowerCase();
  const isPayee = user && payeeAddr && user.toLowerCase() === payeeAddr.toLowerCase();

  // Action handlers (all defined at the top for scope)
  const handleDeposit = async () => {
    setError("");
    setTxState("wallet");
    try {
      await (depositWrite as any).writeContract({
        address: address as `0x${string}`,
        abi: escrowABI,
        functionName: "deposit"
      });
      setTxState("pending");
      setTimeout(() => setTxState("confirmed"), 2000);
    } catch (e) {
      setError((e as Error).message);
      setTxState("failed");
    }
  };
  const handleApprove = async () => {
    setError("");
    setTxState("wallet");
    try {
      await (approveWrite as any).writeContract({
        address: address as `0x${string}`,
        abi: escrowABI,
        functionName: "approve"
      });
      setTxState("pending");
      setTimeout(() => setTxState("confirmed"), 2000);
    } catch (e) {
      setError((e as Error).message);
      setTxState("failed");
    }
  };
  const handleRefund = async () => {
    setError("");
    setTxState("wallet");
    try {
      await (refundWrite as any).writeContract({
        address: address as `0x${string}`,
        abi: escrowABI,
        functionName: "refund"
      });
      setTxState("pending");
      setTimeout(() => setTxState("confirmed"), 2000);
    } catch (e) {
      setError((e as Error).message);
      setTxState("failed");
    }
  };
  const handleClaim = async () => {
    setError("");
    setTxState("wallet");
    try {
      await (claimWrite as any).writeContract({
        address: address as `0x${string}`,
        abi: escrowABI,
        functionName: "claim"
      });
      setTxState("pending");
      setTimeout(() => setTxState("confirmed"), 2000);
    } catch (e) {
      setError((e as Error).message);
      setTxState("failed");
    }
  };
  const handleSubmitProof = async () => {
    setError("");
    setTxState("wallet");
    try {
      await (submitProofWrite as any).writeContract({
        address: address as `0x${string}`,
        abi: escrowABI,
        functionName: "submitProof",
        args: [proofUrl]
      });
      setTxState("pending");
      setTimeout(() => setTxState("confirmed"), 2000);
    } catch (e) {
      setError((e as Error).message);
      setTxState("failed");
    }
  };
  // Timeout logic (fix impure Date.now usage)
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));
  useEffect(() => {
    const interval = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 10000);
    return () => clearInterval(interval);
  }, []);
  const statusNum = typeof status === "number"
    ? status
    : Array.isArray(status) && typeof status[0] === "number"
    ? status[0]
    : undefined;
  const canRefund = (statusNum === 1 || statusNum === 2) && timeout && now > Number(timeout);
  // Action UI variables for type-safe rendering
  let proofInput: React.ReactNode = null;
  let approveButton: React.ReactNode = null;
  let refundButton: React.ReactNode = null;
  let claimButton: React.ReactNode = null;
  if (typeof statusNum === "number" && Boolean(isPayee) && statusNum === 1) {
    proofInput = (
      <ProofInput
        proofUrl={proofUrl}
        setProofUrl={setProofUrl}
        submittingProof={txState === "pending" || txState === "wallet"}
        handleSubmitProof={handleSubmitProof}
      />
    );
  }
  if (typeof statusNum === "number" && isPayer && statusNum === 2) {
    approveButton = (
      <button
        className="btn btn-primary w-full"
        onClick={handleApprove}
      >
        Approve & Release
      </button>
    );
  }
  if (isPayer && canRefund) {
    refundButton = (
      <button
        className="btn btn-warning w-full"
        onClick={handleRefund}
      >
        Refund to Payer
      </button>
    );
  }
  if (typeof statusNum === "number" && isPayee && statusNum === 3) {
    claimButton = (
      <button
        className="btn btn-success w-full"
        onClick={handleClaim}
      >
        Claim Funds
      </button>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-2 py-8 bg-gradient-to-br from-white/90 to-blue-50 dark:from-gray-950 dark:to-gray-900" role="main">
      <section className="w-full max-w-3xl card rounded-3xl shadow-2xl p-10 md:p-16 flex flex-col items-center gap-10 animate-fade-in-up border border-blue-100 dark:border-blue-900">
        <h1 id="escrow-detail-title" className="text-5xl md:text-6xl font-extrabold logo mb-4 tracking-tight flex items-center gap-3 drop-shadow-2xl text-blue-700 dark:text-blue-400">
          Escrow Detail
          {typeof statusNum === "number" && (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ml-3 shadow-lg ${statusNum === 3 ? 'bg-green-100 text-green-800' : statusNum === 4 ? 'bg-red-100 text-red-800' : statusNum === 5 ? 'bg-green-200 text-green-900' : 'bg-blue-100 text-blue-800 animate-bounce-in'}`}>
              {STATUS_LABELS[statusNum]}
            </span>
          )}
        </h1>
        {/* Status Timeline */}
        <div className="w-full animate-fade-in">
          <StatusTimeline statusNum={statusNum} />
        </div>
        <div className="mb-8 w-full animate-fade-in">
          <MilestoneTimeline milestones={milestones} />
        </div>
        <div className="mb-4 flex flex-col gap-3 mt-6 w-full animate-fade-in card rounded-2xl p-8 shadow-xl border border-blue-50 dark:border-blue-900 bg-white/90 dark:bg-gray-900/90">
          <div className="flex items-center gap-2"><span className="font-semibold text-blue-700 dark:text-blue-400">Escrow Address:</span>{typeof address === "string" ? <EnsOrAddress address={address} /> : <span>-</span>}</div>
          <div className="flex items-center gap-2"><span className="font-semibold text-blue-700 dark:text-blue-400">Payer:</span>{typeof payer === "string" ? <EnsOrAddress address={payer} /> : <span>-</span>}</div>
          <div className="flex items-center gap-2"><span className="font-semibold text-blue-700 dark:text-blue-400">Payee:</span>{typeof payee === "string" ? <EnsOrAddress address={payee} /> : <span>-</span>}</div>
          <div className="flex items-center gap-2"><span className="font-semibold text-blue-700 dark:text-blue-400">Amount:</span><span>{typeof amount === "bigint" ? `${Number(amount) / 1e18} IDRX` : "-"}</span></div>
          <div className="flex items-center gap-2"><span className="font-semibold text-blue-700 dark:text-blue-400">Timeout:</span><span>{timeout ? new Date(Number(timeout) * 1000).toLocaleString() : "-"}</span></div>
          <div className="flex items-center gap-2"><span className="font-semibold text-blue-700 dark:text-blue-400">Proof:</span>{typeof proof === "string" && proof ? (<a href={proof} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{proof}</a>) : (<span>-</span>)}</div>
        </div>
        <div className="my-6 w-full animate-fade-in">
          <TxStepper state={txState} explorerUrl="https://sepolia.basescan.org" />
        </div>
        <div className="mt-8 flex flex-col gap-3 w-full animate-fade-in">
          {isPayer && statusNum === 0 && (
            <button className="btn btn-primary w-full animate-bounce-in text-lg font-bold shadow-lg" onClick={handleDeposit}>Deposit (Fund Escrow)</button>
          )}
          {proofInput && <div className="animate-fade-in">{proofInput}</div>}
          {approveButton && <div className="animate-fade-in">{approveButton}</div>}
          {refundButton && <div className="animate-fade-in">{refundButton}</div>}
          {claimButton && <div className="animate-fade-in">{claimButton}</div>}
        </div>
        {txState === "pending" && <div className="animate-pulse bg-slate-100 h-10 w-full rounded mb-2" />}
        {error && <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50 text-sm animate-fade-in flex items-center gap-2"><span>❌</span>{error}</div>}
        <div className="text-xs text-gray-400 mt-8">Actions and data update based on contract state and user role.</div>
        <div className="mt-12 w-full animate-fade-in">
          <h3 className="font-bold text-2xl mb-3 logo text-blue-700 dark:text-blue-400">Recent On‑Chain Events</h3>
          <EventFeed events={eventsFeed} />
        </div>
        <div className="mt-8 w-full animate-fade-in">
          <h3 className="font-bold text-2xl mb-3 logo text-blue-700 dark:text-blue-400">Transaction History</h3>
          <TxHistory address={address as string} />
        </div>
      </section>
    </main>
  );
}

function EventFeed({ events }: { events: EventFeedItem[] }) {
  if (!events || events.length === 0) return (
    <div className="flex flex-col items-center gap-2 text-gray-400 animate-fade-in">
      <span className="text-3xl">🔔</span>
      <div>No recent events.</div>
    </div>
  );
  return (
    <ul className="space-y-2 max-h-56 overflow-auto rounded-lg border border-slate-100 bg-white/60 p-2">
      {events.map((ev, i) => (
        <li key={i} className="flex items-start gap-3 p-3 rounded hover:bg-slate-50">
          <div className="w-12 text-sm font-mono text-slate-500">{ev.blockNumber ?? '-'}</div>
          <div className="flex-1">
            <div className="text-sm font-semibold logo">{ev.name}</div>
            <div className="text-xs text-slate-500 truncate">{ev.txHash ? (<a href={`https://sepolia.basescan.org/tx/${ev.txHash}`} target="_blank" rel="noreferrer" className="logo">{ev.txHash}</a>) : '—'}</div>
            <div className="text-xs text-slate-600 mt-1">{ev.args ? JSON.stringify(ev.args) : ''}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}

// Transaction history component (BaseScan links for all events)
// ...existing code...
function TxHistory({ address }: { address: string }) {
  const [txs, setTxs] = useState<{ hash: string; method?: string; functionName?: string; timeStamp: string }[]>([]);
  useEffect(() => {
    async function fetchTxs() {
      // Use BaseScan API or public endpoint for demo (replace with your API key for production)
      const url = `https://api-sepolia.basescan.org/api?module=account&action=txlist&address=${address}&sort=asc`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.status === "1") setTxs(data.result);
      } catch {}
    }
    fetchTxs();
  }, [address]);
  if (!txs.length) return (
    <div className="flex flex-col items-center gap-2 text-gray-400 animate-fade-in">
      <span className="text-3xl">📄</span>
      <div>No transactions found.</div>
    </div>
  );
  return (
    <ul className="space-y-2">
      {txs.map(tx => (
        <li key={tx.hash} className="flex items-center gap-2 text-xs transition-all hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded p-1">
          <a href={`https://sepolia.basescan.org/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer" className="text-blue-700 dark:text-blue-300 hover:underline font-mono truncate max-w-xs">{tx.hash.slice(0, 10)}...{tx.hash.slice(-6)}</a>
          <span className="text-gray-500 dark:text-gray-300">{tx.method || tx.functionName || "Tx"}</span>
          <span className="text-gray-400">{new Date(Number(tx.timeStamp) * 1000).toLocaleString()}</span>
        </li>
      ))}
    </ul>
  );
}
