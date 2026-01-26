"use client";
import { useEffect } from 'react';



import { createPublicClient, http, Log } from "viem";
import { baseSepolia } from "viem/chains";


// Strongly typed event structure for Escrow events
export type EscrowEvent = {
  name: string;
  decoded?: { args?: Record<string, unknown> } | Record<string, unknown>;
  log?: Log;
};

export function useEscrowEvents<TAbi = any>(
  contractAddress: string,
  abi: TAbi[],
  onEvent?: (ev: EscrowEvent) => void
) {
  useEffect(() => {
    if (!contractAddress || !abi) return;
    const rpc = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC || process.env.BASE_SEPOLIA_RPC || "https://base-sepolia.g.alchemy.com/v2/1SMOMr-qJJbullsuZdLED";
    const client = createPublicClient({ chain: baseSepolia, transport: http(rpc) });

    let cancelled = false;
    async function pollEvents() {
      try {
        const latest = await client.getBlockNumber();
        const fromBlock = latest > 10000n ? latest - 10000n : 0n;
        const logs = await client.getLogs({
          address: contractAddress as `0x${string}`,
          fromBlock,
          toBlock: latest,
          events: (abi as any[]).filter((x: any) => x.type === "event"),
        });
        // For each log, just pass the log object to onEvent for now
        if (!cancelled && onEvent) {
          logs.forEach(log => onEvent({
            name: log.eventName || 'Unknown',
            decoded: log,
            log: log,
          }));
        }
      } catch (err) {
        // ignore errors for now
      }
    }
    pollEvents();
    const interval = setInterval(pollEvents, 15000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [contractAddress, abi, onEvent]);
}

export default useEscrowEvents;
