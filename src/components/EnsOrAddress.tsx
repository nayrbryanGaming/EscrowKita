"use client";
import React from 'react';

export function EnsOrAddress({ address }: { address: string }) {
  if (!address) return <span>-</span>;
  const short = `${address.slice(0, 6)}...${address.slice(-4)}`;
  return <a href={`https://sepolia.basescan.org/address/${address}`} target="_blank" rel="noreferrer" className="text-brand-500">{short}</a>;
}

export default EnsOrAddress;
