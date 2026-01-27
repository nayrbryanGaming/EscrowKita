
"use client";
import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <header className="bg-white shadow p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/escrowkita-logo.svg" alt="Logo" className="w-10 h-10 rounded-xl" />
          <span className="font-bold text-xl text-blue-700">EscrowKita</span>
        </div>
        <nav className="flex gap-4">
          <a href="/" className="text-blue-700 font-semibold">Home</a>
          <a href="/create" className="text-blue-700 font-semibold">Create Escrow</a>
          <a href="/receipt/demo" className="text-blue-700 font-semibold">Receipt Demo</a>
        </nav>
      </header>
      <main className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-4 text-blue-900">Escrow IDR Onchain Untuk Event & Freelancer</h1>
        <p className="mb-8 text-lg text-gray-700">Aman, transparan, tanpa drama. Dana dijamin smart contract, workflow matang, audit-ready, dan bisa dicek publik di BaseScan.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="font-bold text-xl mb-2 text-blue-700">Aman & Transparan</h2>
            <p>Dana disimpan di smart contract, hanya bisa dicairkan sesuai workflow. Bukti transaksi onchain, bisa diverifikasi publik.</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="font-bold text-xl mb-2 text-blue-700">Workflow Matang</h2>
            <p>Create escrow, deposit, submit proof, approve, release. Semua terotomasi, role-based, event-driven, dan audit-ready.</p>
          </div>
        </div>
      </main>
      <footer className="bg-white text-gray-500 text-center py-4 mt-12 border-t">
        &copy; 2026 EscrowKita • Base Sepolia Testnet
      </footer>
    </div>
  );
}

