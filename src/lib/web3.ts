import { ethers } from 'ethers';

/**
 * Lightweight web3 helper: prefers injected wallet (for signer), falls back to RPC provider set in env.
 * Requires NEXT_PUBLIC_BASE_RPC or NEXT_PUBLIC_ALCHEMY_API_KEY to be configured for reliable JSON-RPC access.
 */

export function getJsonRpcProvider(): ethers.Provider {
  const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
  const rpc = process.env.NEXT_PUBLIC_BASE_RPC;
  if (alchemyKey) {
    const url = `https://base-sepolia.g.alchemy.com/v2/${alchemyKey}`;
    return new ethers.JsonRpcProvider(url, 84532);
  }
  if (rpc) {
    return new ethers.JsonRpcProvider(rpc, 84532);
  }
  throw new Error('Missing RPC configuration. Set NEXT_PUBLIC_BASE_RPC or NEXT_PUBLIC_ALCHEMY_API_KEY in .env');
}

export function getBrowserProvider(): ethers.BrowserProvider | null {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    try {
      return new (ethers as any).BrowserProvider((window as any).ethereum);
    } catch (e) {
      return null;
    }
  }
  return null;
}

export function getProviderOrSigner(needsSigner = false) {
  const browser = getBrowserProvider();
  if (browser) {
    if (needsSigner) return browser.getSigner();
    return browser;
  }
  // fallback to JSON-RPC provider (readonly)
  return getJsonRpcProvider();
}
