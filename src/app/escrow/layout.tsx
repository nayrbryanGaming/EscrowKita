"use client";
import React from 'react';

export const dynamic = 'force-dynamic';

export default function EscrowLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
}
