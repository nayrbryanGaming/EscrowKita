'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Menu,
  X,
  Home,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Settings,
  Bell,
  Search,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Clock,
  Eye,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// ============= TYPE DEFINITIONS =============
interface Transaction {
  id: string;
  buyer: string;
  seller: string;
  amount: number;
  status: 'pending' | 'in_progress' | 'released' | 'disputed';
  createdAt: Date;
  description: string;
}

interface DashboardStats {
  totalValue: number;
  activeTransactions: number;
  completedThisMonth: number;
  successRate: number;
  trends: {
    totalValue: number;
    activeTransactions: number;
    completedThisMonth: number;
    successRate: number;
  };
}

interface Activity {
  id: string;
  type: 'created' | 'released' | 'disputed' | 'completed';
  message: string;
  timestamp: Date;
}

// ============= SAMPLE DATA =============
const sampleTransactions: Transaction[] = [
  {
    id: 'ESC-2024-001',
    buyer: 'John Anderson',
    seller: 'Sarah Miller',
    amount: 15000,
    status: 'in_progress',
    createdAt: new Date('2024-01-28'),
    description: 'Website Development Project',
  },
  {
    id: 'ESC-2024-002',
    buyer: 'Michael Chen',
    seller: 'Emma Wilson',
    amount: 8500,
    status: 'pending',
    createdAt: new Date('2024-01-29'),
    description: 'Mobile App Design',
  },
  {
    id: 'ESC-2024-003',
    buyer: 'David Brown',
    seller: 'Olivia Davis',
    amount: 25000,
    status: 'released',
    createdAt: new Date('2024-01-25'),
    description: 'E-commerce Platform',
  },
  {
    id: 'ESC-2024-004',
    buyer: 'James Taylor',
    seller: 'Sophia Martinez',
    amount: 3200,
    status: 'disputed',
    createdAt: new Date('2024-01-27'),
    description: 'Logo Design Package',
  },
  {
    id: 'ESC-2024-005',
    buyer: 'Robert Johnson',
    seller: 'Isabella Garcia',
    amount: 12000,
    status: 'in_progress',
    createdAt: new Date('2024-01-26'),
    description: 'Marketing Campaign',
  },
  {
    id: 'ESC-2024-006',
    buyer: 'William White',
    seller: 'Mia Rodriguez',
    amount: 45000,
    status: 'released',
    createdAt: new Date('2024-01-20'),
    description: 'Full Stack Development',
  },
  {
    id: 'ESC-2024-007',
    buyer: 'Thomas Lee',
    seller: 'Charlotte Lopez',
    amount: 7800,
    status: 'pending',
    createdAt: new Date('2024-01-30'),
    description: 'SEO Optimization',
  },
  {
    id: 'ESC-2024-008',
    buyer: 'Daniel Harris',
    seller: 'Amelia Clark',
    amount: 18500,
    status: 'in_progress',
    createdAt: new Date('2024-01-24'),
    description: 'Video Production',
  },
  {
    id: 'ESC-2024-009',
    buyer: 'Matthew Lewis',
    seller: 'Harper Walker',
    amount: 5500,
    status: 'released',
    createdAt: new Date('2024-01-22'),
    description: 'Content Writing',
  },
  {
    id: 'ESC-2024-010',
    buyer: 'Christopher Hall',
    seller: 'Evelyn Allen',
    amount: 32000,
    status: 'in_progress',
    createdAt: new Date('2024-01-23'),
    description: 'Cloud Infrastructure Setup',
  },
];

const dashboardStats: DashboardStats = {
  totalValue: 172500,
  activeTransactions: 24,
  completedThisMonth: 18,
  successRate: 94.5,
  trends: {
    totalValue: 12.5,
    activeTransactions: -3.2,
    completedThisMonth: 8.7,
    successRate: 2.1,
  },
};

const recentActivities: Activity[] = [
  {
    id: '1',
    type: 'created',
    message: 'New escrow created by John Anderson',
    timestamp: new Date('2024-01-31T10:30:00'),
  },
  {
    id: '2',
    type: 'released',
    message: 'Funds released for ESC-2024-003',
    timestamp: new Date('2024-01-31T09:15:00'),
  },
  {
    id: '3',
    type: 'disputed',
    message: 'Dispute raised on ESC-2024-004',
    timestamp: new Date('2024-01-30T16:45:00'),
  },
  {
    id: '4',
    type: 'completed',
    message: 'Transaction ESC-2024-009 completed successfully',
    timestamp: new Date('2024-01-30T14:20:00'),
  },
];

// ============= LOGO COMPONENT =============
const EscrowKitLogo = ({ size = 'default' }: { size?: 'small' | 'default' | 'large' }) => {
  const sizes = {
    small: 32,
    default: 40,
    large: 64,
  };
  const px = sizes[size] || sizes.default;
  return (
    <div className="flex items-center gap-3">
      <img src="/escrowkita-logo.svg" alt="EscrowKita" width={px} height={px} className="rounded-xl shadow-md" />
      {size !== 'small' && (
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-slate-800">EscrowKita</h1>
          <p className="text-xs text-slate-500">Onchain Escrow Platform</p>
        </div>
      )}
    </div>
  );
};

// ============= MAIN DASHBOARD COMPONENT =============
export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = sampleTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sampleTransactions.length / itemsPerPage);

  const menuItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: ShieldCheck, label: 'Active Escrows', badge: '24' },
    { icon: CheckCircle, label: 'Completed', badge: '18' },
    { icon: AlertTriangle, label: 'Disputes', badge: '2' },
    { icon: BarChart3, label: 'Analytics' },
    { icon: Settings, label: 'Settings' },
  ];

  const getStatusColor = (status: Transaction['status']) => {
    const colors = {
      pending: 'bg-amber-100 text-amber-800 border-amber-200',
      in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
      released: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      disputed: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status];
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'created':
        return <Plus className="w-4 h-4" />;
      case 'released':
        return <CheckCircle className="w-4 h-4" />;
      case 'disputed':
        return <AlertTriangle className="w-4 h-4" />;
      case 'completed':
        return <ShieldCheck className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* SIDEBAR - Desktop */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white border-r border-slate-200 transition-all duration-300 z-30 hidden lg:block ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-slate-200">
            {sidebarOpen ? (
              <EscrowKitLogo />
            ) : (
              <div className="flex justify-center">
                <EscrowKitLogo size="small" />
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  item.active
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg shadow-indigo-200'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="px-2 py-1 text-xs font-semibold bg-white/20 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            ))}
          </nav>

          {/* Total Balance Widget */}
          {sidebarOpen && (
            <div className="p-4 m-4 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-xl text-white">
              <p className="text-sm opacity-90">Total Balance</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(dashboardStats.totalValue)}</p>
              <div className="flex items-center gap-1 mt-2 text-xs">
                <TrendingUp className="w-3 h-3" />
                <span>+{dashboardStats.trends.totalValue}% this month</span>
              </div>
            </div>
          )}

          {/* Toggle Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-4 border-t border-slate-200 text-slate-600 hover:bg-slate-100"
          >
            {sidebarOpen ? <ChevronLeft className="w-5 h-5 mx-auto" /> : <ChevronRight className="w-5 h-5 mx-auto" />}
          </button>
        </div>
      </aside>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <EscrowKitLogo />
                <button onClick={() => setMobileMenuOpen(false)} className="text-slate-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      item.active
                        ? 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="flex-1 text-left font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="px-2 py-1 text-xs font-semibold bg-white/20 rounded-full">{item.badge}</span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </aside>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* HEADER */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
            {/* Left side */}
            <div className="flex items-center gap-4">
              <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden text-slate-600">
                <Menu className="w-6 h-6" />
              </button>
              <div className="lg:hidden">
                <EscrowKitLogo size="small" />
              </div>
              <div className="hidden sm:block relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-200">
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-800">Alex Johnson</p>
                  <p className="text-xs text-slate-500">Admin</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  AJ
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN DASHBOARD CONTENT */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Selamat datang kembali 👋</h2>
            <p className="text-slate-600 mt-1">Ringkasan escrow dan transaksi Anda hari ini.</p>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {/* Card 1 - Total Escrow Value */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-emerald-600">
                  <TrendingUp className="w-4 h-4" />
                  {dashboardStats.trends.totalValue}%
                </div>
              </div>
              <h3 className="text-sm font-medium text-slate-600 mb-1">Total Escrow Value</h3>
              <p className="text-2xl font-bold text-slate-800">{formatCurrency(dashboardStats.totalValue)}</p>
            </div>

            {/* Card 2 - Active Transactions */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg">
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-red-600">
                  <TrendingDown className="w-4 h-4" />
                  {Math.abs(dashboardStats.trends.activeTransactions)}%
                </div>
              </div>
              <h3 className="text-sm font-medium text-slate-600 mb-1">Active Transactions</h3>
              <p className="text-2xl font-bold text-slate-800">{dashboardStats.activeTransactions}</p>
            </div>

            {/* Card 3 - Completed This Month */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-emerald-100 to-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-emerald-600">
                  <TrendingUp className="w-4 h-4" />
                  {dashboardStats.trends.completedThisMonth}%
                </div>
              </div>
              <h3 className="text-sm font-medium text-slate-600 mb-1">Completed This Month</h3>
              <p className="text-2xl font-bold text-slate-800">{dashboardStats.completedThisMonth}</p>
            </div>

            {/* Card 4 - Success Rate */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-emerald-600">
                  <TrendingUp className="w-4 h-4" />
                  {dashboardStats.trends.successRate}%
                </div>
              </div>
              <h3 className="text-sm font-medium text-slate-600 mb-1">Success Rate</h3>
              <p className="text-2xl font-bold text-slate-800">{dashboardStats.successRate}%</p>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-white">
                <h3 className="text-xl font-bold mb-1">Aksi Cepat</h3>
                <p className="text-indigo-100 text-sm">Kelola escrow dan transaksi dengan mudah</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/create" className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 font-semibold rounded-lg hover:shadow-lg transition-all">
                  <Plus className="w-4 h-4" />
                  Buat Escrow
                </Link>
                <a href="/escrow" className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-all backdrop-blur-sm">
                  Lihat Semua
                </a>
              </div>
            </div>
          </div>

          {/* MAIN GRID - Transactions & Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* TRANSACTION TABLE */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-800">Transaksi Terbaru</h3>
                    <Link href="/escrow" className="text-sm text-indigo-600 font-semibold hover:text-indigo-700">Lihat Semua</Link>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider hidden md:table-cell">
                          Parties
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider hidden lg:table-cell">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {currentTransactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-slate-800">{transaction.id}</span>
                          </td>
                          <td className="px-6 py-4 hidden md:table-cell">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-slate-400" />
                              <div className="text-sm">
                                <p className="font-medium text-slate-800">{transaction.buyer}</p>
                                <p className="text-slate-500">→ {transaction.seller}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-bold text-slate-800">
                              {formatCurrency(transaction.amount)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                                transaction.status
                              )}`}
                            >
                              {transaction.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                            <div className="flex items-center gap-1 text-sm text-slate-600">
                              <Clock className="w-4 h-4" />
                              {formatDate(transaction.createdAt)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Link href="/escrow" className="p-1 text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="Lihat detail">
                                <Eye className="w-4 h-4" />
                              </Link>
                              <button className="p-1 text-slate-600 hover:bg-slate-100 rounded transition-colors">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-200 flex items-center justify-between">
                  <div className="text-sm text-slate-600">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sampleTransactions.length)} of{' '}
                    {sampleTransactions.length} transactions
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-3 py-1 border rounded-lg text-sm font-medium transition-all ${
                          currentPage === index + 1
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTIVITY FEED */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-800">Aktivitas Terbaru</h3>
              </div>
              <div className="p-6 space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex gap-4">
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'created'
                          ? 'bg-blue-100 text-blue-600'
                          : activity.type === 'released'
                          ? 'bg-emerald-100 text-emerald-600'
                          : activity.type === 'disputed'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-purple-100 text-purple-600'
                      }`}
                    >
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">{activity.message}</p>
                      <p className="text-xs text-slate-500 mt-1">{formatTime(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-slate-200">
                <Link href="/escrow" className="block w-full text-center text-sm text-indigo-600 font-semibold hover:text-indigo-700">
                  Lihat Semua Aktivitas
                </Link>
              </div>
            </div>
          </div>

          {/* CHARTS SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Transaction Volume Chart */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Transaction Volume</h3>
              <div className="h-64 flex items-end justify-between gap-2">
                {[65, 45, 78, 52, 88, 72, 95, 68, 82, 76, 90, 85].map((height, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-gradient-to-t from-indigo-600 to-blue-500 rounded-t-lg hover:from-indigo-700 hover:to-blue-600 transition-all cursor-pointer" style={{ height: `${height}%` }}></div>
                    <span className="text-xs text-slate-500">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Distribution */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Status Distribution</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">In Progress</span>
                    <span className="text-sm font-bold text-slate-800">40%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Released</span>
                    <span className="text-sm font-bold text-slate-800">35%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Pending</span>
                    <span className="text-sm font-bold text-slate-800">20%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Disputed</span>
                    <span className="text-sm font-bold text-slate-800">5%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-red-500 to-red-600 h-full rounded-full" style={{ width: '5%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* FOOTER */}
        <footer className="bg-white border-t border-slate-200 mt-12">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-slate-600">© {new Date().getFullYear()} EscrowKita. Semua hak dilindungi.</p>
              <div className="flex gap-6">
                <Link href="/how-it-works" className="text-sm text-slate-600 hover:text-indigo-600">Cara Kerja</Link>
                <Link href="/" className="text-sm text-slate-600 hover:text-indigo-600">Beranda</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
