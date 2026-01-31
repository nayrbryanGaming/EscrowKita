# Checklist Eksekusi — EscrowKita Live

## ✅ Sudah dieksekusi (otomatis)

- [x] **Build production** — `npm run build` berhasil (9 halaman, siap Vercel)
- [x] **Design system** — Warna (#0052FF, #0B1C2D, #22C55E, #F59E0B, #EF4444, #F8FAFC), Inter + JetBrains Mono
- [x] **Landing** — Hero, How It Works, Why EscrowKita, Footer dengan BaseScan & GitHub
- [x] **Create Deal** — Wizard 4 langkah, progress bar, create + fund on-chain
- [x] **Deal Dashboard** — Status (Funds Locked, Waiting for delivery, Ready to release, Released), amount mono, countdown, contract copy, BaseScan
- [x] **README** — Problem, Solution, Why Onchain, Demo steps, Contract addresses, Live URL, Roadmap
- [x] **GitHub Actions** — Deploy frontend ke Vercel dari root repo (bukan ./frontend)
- [x] **Deploy script** — Menulis factory address ke `.env.local` di root (bukan frontend/)

---

## Yang Anda lakukan manual

### 1. Deploy kontrak ke Base Sepolia (sekali)

```powershell
cd contracts
npm install
# Pastikan .env di contracts/ atau root punya:
# BASE_SEPOLIA_RPC=https://base-sepolia.g.alchemy.com/v2/YOUR_KEY
# DEPLOYER_PRIVATE_KEY=0x...
npx hardhat run scripts/deploy.ts --network baseSepolia
```

- Catat alamat **EscrowFactory** yang dicetak.
- Script akan coba append ke `.env.local` di root; kalau belum ada, salin manual:
  - `NEXT_PUBLIC_ESCROW_FACTORY_ADDRESS=<alamat_factory>`

### 2. Set env di Vercel

1. [vercel.com](https://vercel.com) → Project EscrowKita → **Settings** → **Environment Variables**
2. Tambahkan (isi dari `.env` / `.env.local` Anda):
   - `NEXT_PUBLIC_BASE_RPC` atau `NEXT_PUBLIC_ALCHEMY_API_KEY`
   - `NEXT_PUBLIC_ESCROW_FACTORY_ADDRESS` (wajib untuk Create Deal)
   - Opsional: `NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
3. **Redeploy** (Deployments → ⋮ → Redeploy)

### 3. Connect repo ke Vercel (jika belum)

1. Vercel → **Add New** → **Project** → Import dari GitHub
2. Pilih repo **EscrowKita**, root directory **.** (default)
3. Isi env vars seperti di atas → **Deploy**

### 4. (Opsional) GitHub Actions deploy otomatis

Di GitHub repo → **Settings** → **Secrets and variables** → **Actions**, tambah:

- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- `NEXT_PUBLIC_BASE_RPC`, `NEXT_PUBLIC_ESCROW_FACTORY_ADDRESS` (agar build CI pakai env yang sama)

Setelah itu, setiap push ke `main` akan trigger deploy ke Vercel.

---

## Cek setelah live

1. Buka **Live URL** (Vercel) → Connect wallet (Base Sepolia).
2. **Create Secure Deal** → isi payee & amount → Review & lock → 2 tx (create + fund).
3. **Deals** → masukkan alamat kontrak escrow → cek status, amount, countdown, link BaseScan.
4. Semua transaksi terlihat di [sepolia.basescan.org](https://sepolia.basescan.org).

---

## Jalankan lokal (testing)

```powershell
cd "e:\000VSCODE PROJECT MULAI DARI DESEMBER 2025\EscrowKita"
npm run dev
```

Buka http://localhost:3000. Pastikan `.env.local` berisi `NEXT_PUBLIC_ESCROW_FACTORY_ADDRESS` (dan RPC) agar Create Deal jalan.
