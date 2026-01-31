"use client";


import React, { createContext, useContext, useState } from 'react';
import NotificationToaster from '../components/NotificationToaster';
// Notification Context
type Notification = { type: string; message: string };
type NotificationContextType = {
  notify: (type: string, message: string) => void;
};
const NotificationContext = createContext<NotificationContextType>({ notify: () => {} });

export function useNotification() {
  return useContext(NotificationContext);
}

function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  function notify(type: string, message: string) {
    setNotifications((prev) => [...prev, { type, message }]);
    setTimeout(() => setNotifications((prev) => prev.slice(1)), 4000);
  }
  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <NotificationToaster notifications={notifications} />
    </NotificationContext.Provider>
  );
}



import { ethers } from 'ethers';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
// OnchainKit temporarily disabled to satisfy type-check; WagmiProvider handles chain config
// @walletconnect/ethereum-provider dynamic import will be used for WalletConnect
// Coinbase Wallet SDK will be dynamically imported when requested

// Lightweight wallet provider using window.ethereum + ethers
type WalletState = {
  address?: string | null;
  chainId?: number | null;
  // Use loose any types to be compatible across ethers v5/v6 differences
  provider?: any | null;
  signer?: any | null;
  connect?: () => Promise<void>;
  disconnect?: () => void;
  connectWalletConnect?: () => Promise<void>;
  connectCoinbase?: () => Promise<void>;
};

const WalletContext = React.createContext<WalletState>({});

export function useWallet() {
  return React.useContext(WalletContext);
}

function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = React.useState<string | null>(null);
  const [chainId, setChainId] = React.useState<number | null>(null);
  const [provider, setProvider] = React.useState<any | null>(null);
  const [signer, setSigner] = React.useState<any | null>(null);

  React.useEffect(() => {
    const handleAccounts = (accounts: string[]) => {
      if (accounts && accounts.length > 0) setAddress(accounts[0]);
      else {
        setAddress(null);
        setSigner(null);
        setProvider(null);
      }
    };
    const handleChainChanged = (chainHex: string) => {
      const id = parseInt(chainHex, 16);
      setChainId(id);
    };

    if (typeof (window as any).ethereum !== 'undefined') {
      const eth = (window as any).ethereum;
      eth.request({ method: 'eth_accounts' }).then((accounts: string[]) => handleAccounts(accounts)).catch(() => {});
      eth.request({ method: 'eth_chainId' }).then((c: string) => handleChainChanged(c)).catch(() => {});
      eth.on('accountsChanged', handleAccounts);
      eth.on('chainChanged', handleChainChanged);
      return () => {
        try { eth.removeListener('accountsChanged', handleAccounts); } catch (e) {}
        try { eth.removeListener('chainChanged', handleChainChanged); } catch (e) {}
      };
    }
    return () => {};
  }, []);

  const BASE_SEPOLIA_CHAIN_ID = 84532;

  async function connect() {
    if (typeof (window as any).ethereum === 'undefined') {
      alert('No injected wallet found. Please install MetaMask or use Coinbase Wallet.');
      return;
    }
    const eth = (window as any).ethereum;
    try {
      const chainHex = await eth.request({ method: 'eth_chainId' });
      let chainId = parseInt(chainHex, 16);
      if (chainId !== BASE_SEPOLIA_CHAIN_ID) {
        try {
          await eth.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x14a34' }],
          });
          chainId = BASE_SEPOLIA_CHAIN_ID;
        } catch (switchErr: any) {
          if (switchErr?.code === 4902) {
            try {
              await eth.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: '0x14a34',
                  chainName: 'Base Sepolia',
                  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                  rpcUrls: [process.env.NEXT_PUBLIC_BASE_RPC || 'https://sepolia.base.org'],
                  blockExplorerUrls: ['https://sepolia.basescan.org'],
                }],
              });
              chainId = BASE_SEPOLIA_CHAIN_ID;
            } catch (addErr) {
              console.error('Add chain error', addErr);
            }
          }
        }
      }
      const accounts: string[] = await eth.request({ method: 'eth_requestAccounts' });
      const acc = accounts[0];
      const web3Provider = new (ethers as any).BrowserProvider(eth as any);
      const signerLocal = await web3Provider.getSigner();
      setProvider(web3Provider);
      setSigner(signerLocal);
      setAddress(acc);
      setChainId(chainId);
    } catch (err) {
      console.error('connect error', err);
    }
  }

  // Connect using WalletConnect (QR modal)
  async function connectWalletConnect() {
    try {
      const { EthereumProvider } = await import('@walletconnect/ethereum-provider');
      const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
      const rpcUrl = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
        ? `https://base-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
        : (process.env.NEXT_PUBLIC_BASE_RPC || 'https://sepolia.base.org');
      const providerWC = await EthereumProvider.init({
        projectId: projectId || 'demo',
        chains: [84532],
        optionalChains: [84532],
        rpcMap: { 84532: rpcUrl },
        showQrModal: true,
        metadata: {
          name: 'EscrowKita',
          description: 'Onchain escrow on Base',
          url: typeof window !== 'undefined' ? window.location.origin : 'https://escrowkita.vercel.app',
          icons: ['https://escrowkita.vercel.app/escrowkita-logo.svg'],
        },
      });
      await providerWC.enable();
      (window as any).ethereum = providerWC;
      await connect();
    } catch (err) {
      console.error('WalletConnect connect error', err);
    }
  }

  // Connect using Coinbase Wallet SDK (WalletLink) if available
  async function connectCoinbase() {
    try {
      const { CoinbaseWalletSDK } = await import('@coinbase/wallet-sdk');
      const APP_NAME = 'EscrowKita';
      const coinbase = new (CoinbaseWalletSDK as any)({
        appName: APP_NAME,
        darkMode: false,
      });
      const providerCb = coinbase.makeWeb3Provider(process.env.NEXT_PUBLIC_BASE_RPC || process.env.BASE_SEPOLIA_RPC, 84532);
      await providerCb.request({ method: 'eth_requestAccounts' });
      (window as any).ethereum = providerCb;
      await connect();
    } catch (err) {
      console.error('Coinbase connect error', err);
    }
  }

  function disconnect() {
    setAddress(null);
    setProvider(null);
    setSigner(null);
    setChainId(null);
  }

  const value: WalletState = {
    address,
    chainId,
    provider,
    signer,
    connect,
    disconnect,
    connectWalletConnect,
    connectCoinbase,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const rpc = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
    ? `https://base-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    : (process.env.NEXT_PUBLIC_BASE_RPC || 'https://sepolia.base.org');
  const wagmiConfig = createConfig({ chains: [baseSepolia], transports: { [baseSepolia.id]: http(rpc) } });
  return (
    <NotificationProvider>
      <WagmiProvider config={wagmiConfig}>
        <WalletProvider>{children}</WalletProvider>
      </WagmiProvider>
    </NotificationProvider>
  );
}

export default Providers;
