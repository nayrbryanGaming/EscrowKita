/**
 * EscrowKita — production constants
 * Base Sepolia (testnet) — Chain ID 84532
 */

export const BASE_SEPOLIA_CHAIN_ID = 84532;

export const BASESCAN_BASE_SEPOLIA = 'https://sepolia.basescan.org';

export function txUrl(txHash: string): string {
  return `${BASESCAN_BASE_SEPOLIA}/tx/${txHash}`;
}

export function addressUrl(address: string): string {
  return `${BASESCAN_BASE_SEPOLIA}/address/${address}`;
}

export const ESCROW_FACTORY_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'payer', type: 'address' },
      { internalType: 'address', name: 'payee', type: 'address' },
      { internalType: 'address', name: 'arbiter', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'createEscrow',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'allEscrows',
    outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const ESCROW_ABI = [
  { inputs: [], name: 'submitted', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'payer', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'payee', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'arbiter', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'amount', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'fundedAt', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'released', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'refunded', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'fund', outputs: [], stateMutability: 'payable', type: 'function' },
  { inputs: [{ internalType: 'string', name: 'proof', type: 'string' }], name: 'submitProof', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [], name: 'approve', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [], name: 'refund', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [{ internalType: 'uint256', name: 'timeoutSeconds', type: 'uint256' }], name: 'claimTimeout', outputs: [], stateMutability: 'nonpayable', type: 'function' },
] as const;

/** 30 days in seconds — matches Escrow.sol claimTimeout */
export const ESCROW_TIMEOUT_SECONDS = 30 * 24 * 60 * 60;

// ERC20-based escrow (IDRX)
export const ESCROW_ERC20_FACTORY_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'payer', type: 'address' },
      { internalType: 'address', name: 'payee', type: 'address' },
      { internalType: 'address', name: 'arbiter', type: 'address' },
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'createEscrowERC20',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'allEscrows',
    outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const ESCROW_ERC20_ABI = [
  { inputs: [], name: 'submitted', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'payer', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'payee', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'arbiter', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'token', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'amount', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'fundedAt', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'released', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'refunded', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'fund', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [{ internalType: 'string', name: 'proof', type: 'string' }], name: 'submitProof', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [], name: 'approve', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [], name: 'refund', outputs: [], stateMutability: 'nonpayable', type: 'function' },
] as const;

// Milestone (2 tahap) ERC20 escrow
export const ESCROW_MILESTONE_FACTORY_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'payer', type: 'address' },
      { internalType: 'address', name: 'payee', type: 'address' },
      { internalType: 'address', name: 'arbiter', type: 'address' },
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'uint256', name: 'totalAmount', type: 'uint256' },
      { internalType: 'uint256', name: 'm1Amount', type: 'uint256' },
      { internalType: 'uint256', name: 'm2Amount', type: 'uint256' },
    ],
    name: 'createEscrowMilestone',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  { inputs: [], name: 'allEscrowsLength', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
] as const;

export const ESCROW_MILESTONE_ABI = [
  { inputs: [{ internalType: 'uint256', name: 'index', type: 'uint256' }], name: 'fundMilestone', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [{ internalType: 'uint256', name: 'index', type: 'uint256' }, { internalType: 'string', name: 'proof', type: 'string' }], name: 'submitProofForMilestone', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [{ internalType: 'uint256', name: 'index', type: 'uint256' }], name: 'approveMilestone', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [{ internalType: 'uint256', name: 'index', type: 'uint256' }], name: 'refundMilestone', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], name: 'milestones', outputs: [
    { internalType: 'uint256', name: 'amount', type: 'uint256' },
    { internalType: 'bool', name: 'funded', type: 'bool' },
    { internalType: 'bool', name: 'submitted', type: 'bool' },
    { internalType: 'string', name: 'proof', type: 'string' },
    { internalType: 'bool', name: 'released', type: 'bool' },
  ], stateMutability: 'view', type: 'function' },
] as const;
