'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { ESCROW_ABI, ESCROW_ERC20_ABI } from '../lib/constants';
import { getJsonRpcProvider } from '../lib/web3';

export type EscrowStatus =
  | 'idle'       // not loaded
  | 'loading'    // fetching
  | 'created'    // contract exists, not funded
  | 'funded'     // funds locked, waiting for delivery / proof
  | 'submitted'  // payee submitted proof, awaiting approval
  | 'released'   // funds sent to payee
  | 'refunded'   // funds returned to payer
  | 'error';

export interface EscrowState {
  status: EscrowStatus;
  amount?: string;
  payer?: string;
  payee?: string;
  arbiter?: string;
  fundedAt?: number | null;
  released?: boolean;
  refunded?: boolean;
  error?: string | null;
  isErc20?: boolean;
  tokenAddress?: string | null;
  milestones?: { amount: string; funded: boolean; submitted: boolean; proof?: string | null; released: boolean }[];
}

export function useEscrow(contractAddress: string | undefined): EscrowState {
  const [state, setState] = useState<EscrowState>({ status: 'idle' });

  useEffect(() => {
    if (!contractAddress || !ethers.isAddress(contractAddress)) {
      setState({ status: 'idle' });
      return;
    }

    let mounted = true;
    setState((s) => (s.status === 'idle' ? { ...s, status: 'loading' } : s));

    async function load() {
      try {
        const provider = getJsonRpcProvider();
        const contract = new ethers.Contract(contractAddress as string, ESCROW_ABI as any, provider);
        const [amount, payer, payee, arbiter, fundedAt, released, refunded, submitted] = await Promise.all([
          contract.amount().then((v: bigint) => v.toString()),
          contract.payer(),
          contract.payee(),
          contract.arbiter(),
          contract.fundedAt().then((v: bigint) => (v ? Number(v) : null)),
          contract.released(),
          contract.refunded(),
          contract.submitted ? contract.submitted() : Promise.resolve(false),
        ]);

        if (!mounted) return;

        let status: EscrowStatus = 'created';
        if (released) status = 'released';
        else if (refunded) status = 'refunded';
        else if (fundedAt && Number(amount) > 0 && submitted) status = 'submitted';
        else if (fundedAt && Number(amount) > 0) status = 'funded';

        let tokenAddress: string | null = null;
        let milestonesData: { amount: string; funded: boolean; submitted: boolean; proof?: string | null; released: boolean }[] | undefined;
        try {
          const erc20c = new ethers.Contract(contractAddress as string, ESCROW_ERC20_ABI as any, provider);
          tokenAddress = await erc20c.token();
        } catch {
          tokenAddress = null;
        }
        if (tokenAddress) {
          try {
            const milestoneAbi = [
              { inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], name: 'milestones', outputs: [
                { internalType: 'uint256', name: 'amount', type: 'uint256' },
                { internalType: 'bool', name: 'funded', type: 'bool' },
                { internalType: 'bool', name: 'submitted', type: 'bool' },
                { internalType: 'string', name: 'proof', type: 'string' },
                { internalType: 'bool', name: 'released', type: 'bool' },
              ], stateMutability: 'view', type: 'function' },
            ] as const;
            const m = new ethers.Contract(contractAddress as string, milestoneAbi as any, provider);
            const m0 = await m.milestones(0);
            const m1 = await m.milestones(1);
            milestonesData = [m0, m1].map((x: any) => ({ amount: x.amount.toString(), funded: x.funded, submitted: x.submitted, proof: x.proof, released: x.released }));
          } catch {}
        }

        setState({
          status,
          amount,
          payer,
          payee,
          arbiter,
          fundedAt,
          released,
          refunded,
          error: null,
          isErc20: !!tokenAddress,
          tokenAddress,
          milestones: milestonesData,
        });
      } catch (err: any) {
        if (!mounted) return;
        setState({ status: 'error', error: err?.message || String(err) });
      }
    }

    load();
    const interval = setInterval(load, 15_000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [contractAddress]);

  return state;
}
