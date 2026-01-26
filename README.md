
# EscrowKita

> **Production-grade Onchain Escrow for Indonesia**

EscrowKita is a world-class, onchain escrow platform built on Base (Base Sepolia) using IDRX (IDR-pegged token). It enables secure, transparent, and auditable payments for events, freelance, and business deals. All funds are locked in smart contracts and released only after proof of completion and approval. Every transaction is verifiable on BaseScan.

---

## Features

- **Multi-wallet support:** MetaMask, Trust Wallet, Coinbase, WalletConnect, Binance, and more
- **Network auto-switch:** Seamless Base Sepolia onboarding
- **Role-based workflow:** Payer, Payee, Arbiter, with event-driven state
- **Milestone payments:** Split escrow into multiple deliverables
- **Proof upload:** Submit and verify proof URLs for each milestone
- **Onchain audit trail:** All actions/events visible on BaseScan
- **Global notifications:** Real-time feedback for every action
- **Modern UI/UX:** Fintech-grade, responsive, accessible, and mobile-ready

---

## Workflow

1. **Create Escrow:**
	- Enter payee address, amount (IDRX), timeout, and milestones
	- Deploys a new escrow contract on Base
2. **Deposit (Fund Escrow):**
	- Payer funds the contract
	- Funds are locked until workflow completes
3. **Submit Proof:**
	- Payee submits proof URL for each milestone
4. **Approve & Release:**
	- Arbiter reviews proof and releases funds to payee
5. **Refund/Timeout:**
	- Arbiter can refund payer if needed
	- Payer can claim refund after timeout
6. **Audit:**
	- All actions and transactions are visible on [BaseScan](https://sepolia.basescan.org/)

---

## Deployment

- **Frontend:** Next.js (App Router), deployed on Vercel
- **Contracts:** Solidity, deployed on Base Sepolia
- **Wallet Integration:** wagmi, viem, OnchainKit
- **Styling:** Tailwind CSS

---

## Quick Start

1. `git clone https://github.com/nayrbryanGaming/EscrowKita.git`
2. `cd EscrowKita`
3. `npm install`
4. `npm run dev`

---

## Live Demo

- [Production App](https://escrowkita.vercel.app)
- [BaseScan Explorer](https://sepolia.basescan.org/)

---

## License

MIT
