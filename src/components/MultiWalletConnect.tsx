"use client";

import { useConnect, useAccount, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi';
import { useState } from 'react';
import { useNotification } from '@/app/providers';

function MultiWalletConnect() {
  const { connectors, connect, status } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { switchNetwork, isLoading: isSwitching } = useSwitchNetwork();
  const [wcLoading, setWcLoading] = useState(false);
  const { notify } = useNotification();

  async function handleWalletConnect() {
    if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
      notify('error', 'No WalletConnect project id set. Set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID');
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
      notify('success', 'WalletConnect connected!');
    } catch (err) {
      notify('error', 'WalletConnect init error');
    } finally {
      setWcLoading(false);
    }
  }

  // Network awareness
  const isBaseSepolia = chain?.id === 84532;
  return (
    <div className="w-full flex flex-col items-center gap-2 animate-fade-in">
      {isConnected ? (
        <div className="flex flex-col items-center gap-2 w-full">
          <div className="flex items-center gap-2 font-mono text-xs px-3 py-1 rounded shadow bg-green-100 text-green-800">
            <span className="font-bold">Connected:</span>
            <span className="ml-1">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
            <span className="ml-2 px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">{chain?.name || 'Unknown'}</span>
          </div>
          {!isBaseSepolia && (
            <button
              className="btn btn-warning w-full mt-2 animate-bounce-in"
              onClick={() => switchNetwork && switchNetwork(84532)}
              disabled={isSwitching}
              aria-label="Switch to Base Sepolia"
            >
              {isSwitching ? 'Switching...' : 'Switch to Base Sepolia'}
            </button>
          )}
          <button className="btn btn-ghost w-full mt-2" onClick={() => disconnect()} aria-label="Disconnect wallet">Disconnect</button>
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
                disabled={status === 'loading'}
                aria-label={`Connect ${connector.name}`}
              >
                {/* Wallet icons */}
                {connector.name === 'MetaMask' && <img src="/wallets/metamask.svg" alt="MetaMask" className="w-5 h-5" />}
                {connector.name === 'Coinbase Wallet' && <img src="/wallets/coinbase.svg" alt="Coinbase" className="w-5 h-5" />}
                {connector.name === 'WalletConnect' && <img src="/wallets/walletconnect.svg" alt="WalletConnect" className="w-5 h-5" />}
                {connector.name === 'Trust Wallet' && <img src="/wallets/trustwallet.svg" alt="Trust Wallet" className="w-5 h-5" />}
                {connector.name === 'Binance' && <img src="/wallets/binance.svg" alt="Binance" className="w-5 h-5" />}
                <span className="font-semibold">{connector.name}</span>
                {status === 'loading' && <span className="ml-2">⏳</span>}
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
