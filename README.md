# EscrowKita

**Escrow IDR onchain berbasis IDRX untuk event & freelancer Indonesia — aman, transparan, tanpa drama.**

Get paid safely. Without trusting anyone. Smart contract escrow: funds are locked onchain and released only when the work is done.

---

## Problem

- **Rekber manual / platform tradisional:** Uang dipegang pihak ketiga; risiko kabur, dispute, dan tidak transparan.
- **Freelancer & event organizer:** Butuh jaminan dana aman sampai pekerjaan selesai, tanpa bergantung pada kepercayaan buta.

## Solution

EscrowKita memindahkan escrow ke **smart contract di Base (chain Ethereum L2)**. Dana dikunci on-chain; hanya bisa dilepas ketika payer/arbiter menyetujui. Platform **tidak pernah menyentuh uang** — non-custodial.

## Why Onchain

| | Rekber / platform biasa | EscrowKita |
|--|------------------------|------------|
| Siapa pegang dana? | Middleman / platform | Smart contract |
| Bisa kabur? | Mungkin | Tidak — kita tidak custody |
| Bisa diverifikasi? | Tidak | Ya — setiap langkah di BaseScan |

## Architecture

- **Frontend:** Next.js (App Router), Tailwind, Framer Motion, ethers.js. Connect wallet (MetaMask, Coinbase, WalletConnect) → Base Sepolia (Chain ID 84532).
- **Smart contracts:** Escrow.sol + EscrowFactory.sol (Solidity). Payer creates escrow → funds → payee submits proof → payer/arbiter approve → release (or refund / timeout claim).
- **Deployment:** Frontend on Vercel; contracts on Base Sepolia.

## Demo steps

1. **Connect wallet** (MetaMask/Coinbase) and switch to **Base Sepolia** (Chain ID 84532).
2. **Create Secure Deal:** Home → Create Secure Deal → Your role (payer) → Payee wallet address → Amount (ETH) → Review & lock funds. Two tx: create escrow, then fund.
3. **Deal dashboard:** Open deal by address (Deals → enter contract address). Status: Waiting for deposit → **Funds Locked** (waiting for delivery) → **Ready to release** → **Released** (or Refunded).
4. **Payee:** Submit proof (URL). **Payer/arbiter:** Release to payee or Refund to payer. All tx visible on BaseScan.

## Contract addresses (Base Sepolia)

Set in your `.env` / Vercel:

- `NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS` — example escrow or factory (for footer link).
- `NEXT_PUBLIC_ESCROW_FACTORY_ADDRESS` — **required** for Create flow.

Deploy your own:

```bash
cd contracts
npm install
npx hardhat run scripts/deploy.ts --network baseSepolia
```

Then set the returned factory (and optional escrow) address in env.

## Live URL

- **Production:** Set in Vercel or use the Vercel deployment URL after connecting this repo.
- **Optional:** `NEXT_PUBLIC_APP_URL` for Open Graph / metadata (e.g. `https://escrowkita.vercel.app`).

## Environment variables

Copy `.env.example` to `.env.local` and fill:

- `NEXT_PUBLIC_BASE_RPC` — Base Sepolia RPC (or use `NEXT_PUBLIC_ALCHEMY_API_KEY` for Alchemy Base Sepolia).
- `NEXT_PUBLIC_ESCROW_FACTORY_ADDRESS` — Factory contract (required for Create).
- `NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS` — (Optional) for footer “Smart Contract Verified” link.
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` — (Optional) WalletConnect.
- `NEXT_PUBLIC_APP_URL` — (Optional) for metadata.

## Run locally

```bash
npm install
cp .env.example .env.local
# Edit .env.local with RPC and factory address
npm run dev
```

Build for production (same as Vercel):

```bash
npm run build
npm start
```

## Roadmap

- [x] Single-payout escrow (create → fund → submit proof → approve → release) on Base Sepolia.
- [x] Deal dashboard with real chain data, status, countdown, BaseScan links.
- [x] Trust-centric UI (design system: Primary #0052FF, no dummy data).
- [ ] Milestone escrow (e.g. DP 30% + pelunasan 70%) and/or ERC20 (MockIDRX) support.
- [ ] Receipt page (public, shareable, tx links).
- [ ] Mainnet (Base mainnet + IDRX when ready).

## License

See [LICENSE](LICENSE).
