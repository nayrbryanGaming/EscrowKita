# Deploy EscrowKita ke Vercel

## 1. Siapkan environment variables

Di Vercel Dashboard → Project → Settings → Environment Variables, tambahkan (gunakan nilai dari `.env` / `.env.local` Anda):

| Variable | Wajib | Contoh / Keterangan |
|----------|--------|----------------------|
| `NEXT_PUBLIC_BASE_RPC` | Ya* | `https://base-sepolia.g.alchemy.com/v2/YOUR_KEY` atau RPC Base Sepolia lain |
| `NEXT_PUBLIC_ALCHEMY_API_KEY` | Alternatif | Jika pakai Alchemy Base Sepolia (akan dipakai untuk RPC) |
| `NEXT_PUBLIC_ESCROW_FACTORY_ADDRESS` | Ya | Alamat Factory setelah deploy ke Base Sepolia |
| `NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS` | Opsional | Untuk link "Smart Contract Verified" di footer |
| `NEXT_PUBLIC_APP_URL` | Opsional | URL production, e.g. `https://escrowkita.vercel.app` (untuk metadata) |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Opsional | WalletConnect project ID |

*Minimal salah satu: `NEXT_PUBLIC_BASE_RPC` atau `NEXT_PUBLIC_ALCHEMY_API_KEY`.

## 2. Deploy dari GitHub

1. Push repo ke GitHub (branch `main`).
2. Di [vercel.com](https://vercel.com): New Project → Import Git Repository → pilih repo EscrowKita.
3. Framework Preset: **Next.js** (auto-detect). Root Directory: **.** (repo root).
4. Tambahkan env vars seperti di atas (atau import dari .env).
5. Deploy. Setelah selesai, dapat Production URL (e.g. `https://escrowkita.vercel.app`).

## 3. (Opsional) GitHub Actions ke Vercel

Workflow `.github/workflows/deploy-frontend-vercel.yml` deploy ke Vercel setiap push ke `main`.

Di GitHub repo → Settings → Secrets and variables → Actions, tambahkan:

- `VERCEL_TOKEN` — dari Vercel → Settings → Tokens.
- `VERCEL_ORG_ID` — dari Vercel project settings (.vercel/project.json atau Team/Project settings).
- `VERCEL_PROJECT_ID` — id project Vercel.
- `NEXT_PUBLIC_BASE_RPC`, `NEXT_PUBLIC_ESCROW_FACTORY_ADDRESS`, dll. (agar build di CI pakai env yang sama).

## 4. Deploy smart contract (Base Sepolia)

Agar Create Deal jalan, Factory harus sudah di-deploy:

```bash
cd contracts
npm install
# Set BASE_SEPOLIA_RPC dan DEPLOYER_PRIVATE_KEY di .env
npx hardhat run scripts/deploy.ts --network baseSepolia
```

Masukkan alamat Factory yang di-return ke `NEXT_PUBLIC_ESCROW_FACTORY_ADDRESS` di Vercel (dan di .env lokal).

## 5. Cek setelah deploy

- Buka Live URL → Connect wallet (Base Sepolia).
- Create Secure Deal → isi payee & amount → Review & lock funds.
- Buka Deals → masukkan alamat kontrak escrow → cek status (Funds Locked, Release, BaseScan link).

Semua transaksi harus terlihat di [BaseScan (Base Sepolia)](https://sepolia.basescan.org).
