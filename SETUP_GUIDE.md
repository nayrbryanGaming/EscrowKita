# SETUP GUIDE - Escrow Kit

## 📦 Step-by-Step Setup (Bahasa Indonesia)

### 1. Prasyarat
- Node.js 18+
- Git
- Vercel account (optional)

### 2. Instalasi
```bash
npm install
cp .env.example .env.local
```

### 3. Jalankan Development Server
```bash
npm run dev
```

### 4. Struktur File
- src/app/page.tsx (Landing page)
- src/app/dashboard/page.tsx (Dashboard)
- src/app/layout.tsx (Root layout)
- src/app/globals.css (Global styles)
- src/lib/utils.ts (Utility functions)
- src/types/index.ts (TypeScript types)

### 5. Customisasi
- Ganti warna di tailwind.config.ts
- Update nama app di .env.local
- Ganti logo di page.tsx/dashboard.tsx

### 6. Deploy ke Vercel
- Push ke GitHub
- Import ke Vercel
- Deploy!

### 7. Troubleshooting
- Lihat FAQ di README.md

### 8. Dokumentasi Lain
- QUICK_START.md (setup cepat)
- FILE_INDEX.md (referensi file)
- DEPLOYMENT.md (panduan deploy)
- README.md (dokumentasi lengkap)
