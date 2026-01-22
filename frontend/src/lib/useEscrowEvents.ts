"use client";
import { useEffect } from 'react';


import { createPublicClient, http, parseEventLogs, getContractEvents } from "viem";
import { baseSepolia } from "viem/chains";

export function useEscrowEvents(contractAddress: string, abi: any, onEvent?: (ev: any) => void) {
  useEffect(() => {
    if (!contractAddress || !abi) return;
    const rpc = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC || process.env.BASE_SEPOLIA_RPC || "https://base-sepolia.g.alchemy.com/v2/1SMOMr-qJJbullsuZdLED";
    const client = createPublicClient({ chain: baseSepolia, transport: http(rpc) });

    let cancelled = false;
    async function pollEvents() {
      try {
        // Get latest block
        const latest = await client.getBlockNumber();
        // Query last 10000 blocks for EscrowCreated events
        const fromBlock = latest > 10000n ? latest - 10000n : 0n;
        const logs = await client.getLogs({
          address: contractAddress as `0x${string}`,
          fromBlock,
          toBlock: latest,
          events: abi.filter((x: any) => x.type === "event"),
        });
        const events = parseEventLogs({ abi, logs });
        if (!cancelled && onEvent) {
          events.forEach(ev => onEvent(ev));
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
