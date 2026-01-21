"use client";

import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { useState } from 'react';

export function MultiWalletConnect() {
  const { connectors, connect, status } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [wcLoading, setWcLoading] = useState(false);

  async function handleWalletConnect() {
    if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
      console.warn('No WalletConnect project id set. Set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID');
      return;
    }
    setWcLoading(true);
    try {
      const { EthereumProvider } = await import('@walletconnect/ethereum-provider');
      const provider = await EthereumProvider.init({
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
        showQrModal: true,
        optionalChains: [84532],
      });
      await provider.enable();
      (window as any).ethereum = provider;
      const injectedConnector = connectors.find((c) => c.id === 'injected');
      if (injectedConnector) await connect({ connector: injectedConnector });
    } catch (err) {
      console.error('WalletConnect init error', err);
    } finally {
      setWcLoading(false);
    }
  }

  return (
    <div className="w-full flex flex-col items-center gap-2 animate-fade-in">
      {isConnected ? (
        <div className="flex flex-col items-center gap-2 w-full">
          <div className="flex items-center gap-2 font-mono text-xs px-3 py-1 rounded shadow bg-green-100 text-green-800">
            <span className="font-bold">Connected:</span>
            <span className="ml-1">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
          </div>
          <button className="btn btn-ghost w-full" onClick={() => disconnect()}>Disconnect</button>
        </div>
      ) : (
        <>
          <div className="mb-2 text-xs text-slate-500 text-center">Connect your wallet</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full">
            {connectors.map((connector) => (
              <button
                key={connector.id}
                className="btn btn-primary flex items-center gap-2 justify-center shadow transition-transform hover:scale-105"
                onClick={() => connect({ connector })}
                disabled={status === 'pending'}
              >
                <span className="font-semibold">{connector.name}</span>
                {status === 'pending' && <span className="ml-2">⏳</span>}
              </button>
            ))}
          </div>
          <div className="mt-2 text-xs text-slate-400 text-center">
            <span className="inline-flex items-center px-2 py-1 rounded bg-brand-100 text-brand-500 text-xs font-semibold shadow">Supported</span>
            <div className="mt-1 text-xs text-slate-500">MetaMask · Trust Wallet · Coinbase Wallet · WalletConnect · Binance</div>
            <div className="mt-1 text-xs text-brand-500">If your wallet is not listed, try WalletConnect.</div>
          </div>
        </>
      )}
    </div>
  );
}

export default MultiWalletConnect;
