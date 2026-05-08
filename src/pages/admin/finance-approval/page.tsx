import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface Deposit {
  id: number;
  user_id: string;
  user_name: string;
  user_email: string;
  amount: number;
  method: string;
  status: string;
  tx_hash: string;
  admin_notes: string;
  created_at: string;
  updated_at: string;
}

interface Withdrawal {
  id: number;
  user_id: string;
  user_name: string;
  user_email: string;
  amount: number;
  method: string;
  status: string;
  wallet_address: string;
  admin_notes: string;
  created_at: string;
  updated_at: string;
}

type TxnType = 'deposits' | 'withdrawals';
type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

function formatDate(dateStr: string) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function timeAgo(dateStr: string) {
  const d = new Date(dateStr);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function FinanceApprovalPage() {
  const [activeType, setActiveType] = useState<TxnType>('deposits');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; show: boolean }>({ msg: '', show: false });
  const [detailItem, setDetailItem] = useState<Deposit | Withdrawal | null>(null);
  const [detailType, setDetailType] = useState<TxnType>('deposits');
  const [adminNote, setAdminNote] = useState('');
  const [processing, setProcessing] = useState(false);

  const showNotification = (msg: string) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast({ msg: '', show: false }), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      if (!supabase) {
        showNotification('Supabase not connected.');
        setLoading(false);
        return;
      }
      const { data: d, error: de } = await supabase
        .from('deposits')
        .select('*')
        .order('created_at', { ascending: false });
      if (de) showNotification('Failed to load deposits.');
      else setDeposits((d as Deposit[]) || []);

      const { data: w, error: we } = await supabase
        .from('withdrawals')
        .select('*')
        .order('created_at', { ascending: false });
      if (we) showNotification('Failed to load withdrawals.');
      else setWithdrawals((w as Withdrawal[]) || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredDeposits = deposits.filter((d) => {
    const matchesSearch =
      (d.user_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.user_email || '').toLowerCase().includes(search.toLowerCase()) ||
      String(d.id).includes(search);
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'pending'
        ? d.status === 'pending'
        : statusFilter === 'approved'
        ? d.status === 'confirmed'
        : d.status === 'rejected';
    return matchesSearch && matchesStatus;
  });

  const filteredWithdrawals = withdrawals.filter((w) => {
    const matchesSearch =
      (w.user_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (w.user_email || '').toLowerCase().includes(search.toLowerCase()) ||
      String(w.id).includes(search);
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'pending'
        ? w.status === 'pending'
        : statusFilter === 'approved'
        ? w.status === 'approved'
        : w.status === 'denied';
    return matchesSearch && matchesStatus;
  });

  const currentList = activeType === 'deposits' ? filteredDeposits : filteredWithdrawals;

  const pendingDeposits = deposits.filter((d) => d.status === 'pending').length;
  const pendingWithdrawals = withdrawals.filter((w) => w.status === 'pending').length;
  const totalApprovedToday = [...deposits, ...withdrawals].filter((t) => {
    const today = new Date().toDateString();
    const updated = new Date(t.updated_at || t.created_at).toDateString();
    return updated === today && (t.status === 'confirmed' || t.status === 'approved');
  }).length;
  const totalRejectedToday = [...deposits, ...withdrawals].filter((t) => {
    const today = new Date().toDateString();
    const updated = new Date(t.updated_at || t.created_at).toDateString();
    return updated === today && (t.status === 'rejected' || t.status === 'denied');
  }).length;

  const openDetail = (item: Deposit | Withdrawal, type: TxnType) => {
    setDetailItem(item);
    setDetailType(type);
    setAdminNote(item.admin_notes || '');
  };

  const closeDetail = () => {
    setDetailItem(null);
    setAdminNote('');
    setProcessing(false);
  };

  const approveItem = async () => {
    if (!supabase || !detailItem) return;
    setProcessing(true);
    const table = detailType === 'deposits' ? 'deposits' : 'withdrawals';
    const newStatus = detailType === 'deposits' ? 'confirmed' : 'approved';
    const { error } = await supabase
      .from(table)
      .update({ status: newStatus, admin_notes: adminNote.trim(), updated_at: new Date().toISOString() })
      .eq('id', detailItem.id);
    if (error) {
      showNotification('Failed to approve. Please try again.');
      setProcessing(false);
      return;
    }
    showNotification(`${detailType === 'deposits' ? 'Deposit' : 'Withdrawal'} approved successfully.`);
    closeDetail();
    loadData();
  };

  const rejectItem = async () => {
    if (!supabase || !detailItem) return;
    setProcessing(true);
    const table = detailType === 'deposits' ? 'deposits' : 'withdrawals';
    const newStatus = detailType === 'deposits' ? 'rejected' : 'denied';
    const { error } = await supabase
      .from(table)
      .update({ status: newStatus, admin_notes: adminNote.trim(), updated_at: new Date().toISOString() })
      .eq('id', detailItem.id);
    if (error) {
      showNotification('Failed to reject. Please try again.');
      setProcessing(false);
      return;
    }
    showNotification(`${detailType === 'deposits' ? 'Deposit' : 'Withdrawal'} rejected.`);
    closeDetail();
    loadData();
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: 'bg-amber-500/10 text-amber-400 border border-amber-400/20',
      confirmed: 'bg-emerald-500/10 text-emerald-400 border border-emerald-400/20',
      approved: 'bg-emerald-500/10 text-emerald-400 border border-emerald-400/20',
      rejected: 'bg-red-500/10 text-red-400 border border-red-400/20',
      denied: 'bg-red-500/10 text-red-400 border border-red-400/20',
    };
    return map[status] || 'bg-dark-800/60 text-white/40 border border-dark-700/30';
  };

  const statusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Header */}
      <div className="border-b border-dark-700/50">
        <div className="flex items-center justify-between px-4 md:px-6 py-4">
          <Link to="/admin" className="inline-flex items-center gap-2 shrink-0">
            <img
              src="https://static.readdy.ai/image/e514fc972d3ac011ec046bb027a8bd60/05b8712378af54b96f49b8eeeac4fc04.png"
              alt="Ai EARNERS Logo"
              className="w-8 h-8 object-contain"
            />
            <span className="text-white font-bold text-lg tracking-tight whitespace-nowrap">
              Ai <span className="text-gold-400">EARNERS</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1"
            >
              <i className="ri-arrow-left-line w-4 h-4 flex items-center justify-center" />
              Back to Admin
            </Link>
            <div className="flex items-center gap-2 bg-gold-500/10 border border-gold-400/20 rounded-full px-3 py-1">
              <div className="w-6 h-6 rounded-full bg-gold-500 flex items-center justify-center text-dark-900 text-[10px] font-bold">
                A
              </div>
              <span className="text-gold-400 text-xs font-medium hidden sm:inline">Admin</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Title */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Finance Approval</h1>
            <p className="text-sm text-white/50">
              Review, approve, or reject all deposits and withdrawals in one place.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
            <div className="bg-surface-card border border-dark-700/40 rounded-xl p-4 md:p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <i className="ri-time-line text-amber-400 text-sm w-4 h-4 flex items-center justify-center" />
                </div>
                <span className="text-[10px] text-white/30 bg-dark-800/60 px-2 py-0.5 rounded-full">Now</span>
              </div>
              <div className="text-white font-bold text-xl">{pendingDeposits}</div>
              <div className="text-xs text-white/40">Pending Deposits</div>
            </div>
            <div className="bg-surface-card border border-dark-700/40 rounded-xl p-4 md:p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
                  <i className="ri-time-line text-sky-400 text-sm w-4 h-4 flex items-center justify-center" />
                </div>
                <span className="text-[10px] text-white/30 bg-dark-800/60 px-2 py-0.5 rounded-full">Now</span>
              </div>
              <div className="text-white font-bold text-xl">{pendingWithdrawals}</div>
              <div className="text-xs text-white/40">Pending Withdrawals</div>
            </div>
            <div className="bg-surface-card border border-dark-700/40 rounded-xl p-4 md:p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <i className="ri-check-double-line text-emerald-400 text-sm w-4 h-4 flex items-center justify-center" />
                </div>
                <span className="text-[10px] text-white/30 bg-dark-800/60 px-2 py-0.5 rounded-full">Today</span>
              </div>
              <div className="text-white font-bold text-xl">{totalApprovedToday}</div>
              <div className="text-xs text-white/40">Approved Today</div>
            </div>
            <div className="bg-surface-card border border-dark-700/40 rounded-xl p-4 md:p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <i className="ri-close-circle-line text-red-400 text-sm w-4 h-4 flex items-center justify-center" />
                </div>
                <span className="text-[10px] text-white/30 bg-dark-800/60 px-2 py-0.5 rounded-full">Today</span>
              </div>
              <div className="text-white font-bold text-xl">{totalRejectedToday}</div>
              <div className="text-xs text-white/40">Rejected Today</div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
            {/* Type Toggle */}
            <div className="flex items-center gap-1 bg-dark-800/60 border border-dark-700/40 rounded-lg p-1 w-fit">
              <button
                onClick={() => setActiveType('deposits')}
                className={`px-4 py-2 text-xs rounded-md transition-all whitespace-nowrap ${
                  activeType === 'deposits'
                    ? 'bg-gold-500 text-dark-900 font-semibold'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                Deposits
              </button>
              <button
                onClick={() => setActiveType('withdrawals')}
                className={`px-4 py-2 text-xs rounded-md transition-all whitespace-nowrap ${
                  activeType === 'withdrawals'
                    ? 'bg-gold-500 text-dark-900 font-semibold'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                Withdrawals
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400/50 transition-colors"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              {/* Search */}
              <div className="relative">
                <i className="ri-search-line absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30 text-xs w-4 h-4 flex items-center justify-center" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search user or ID..."
                  className="bg-dark-800 border border-dark-700/50 rounded-md pl-8 pr-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors w-44 sm:w-52"
                />
              </div>

              <button
                onClick={loadData}
                className="w-8 h-8 rounded-md bg-dark-800 border border-dark-700/40 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                title="Refresh"
              >
                <i className="ri-refresh-line w-4 h-4 flex items-center justify-center" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-surface-card border border-dark-700/40 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-dark-700/40">
                    <th className="px-4 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider">User</th>
                    <th className="px-4 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider hidden sm:table-cell">Method</th>
                    <th className="px-4 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider hidden md:table-cell">Date</th>
                    <th className="px-4 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-sm text-white/40">
                        <i className="ri-loader-4-line animate-spin w-5 h-5 inline-flex items-center justify-center mr-2" />
                        Loading transactions...
                      </td>
                    </tr>
                  ) : currentList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-sm text-white/40">
                        <i className="ri-inbox-line w-8 h-8 inline-flex items-center justify-center mr-2 text-white/15" />
                        No transactions found.
                      </td>
                    </tr>
                  ) : (
                    currentList.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-dark-700/30 hover:bg-dark-800/30 transition-colors cursor-pointer"
                        onClick={() => openDetail(item, activeType)}
                      >
                        <td className="px-4 py-3.5">
                          <span className="text-xs text-white/40 font-mono">#{item.id}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-dark-700 flex items-center justify-center text-white/60 text-[10px] font-bold shrink-0">
                              {(item.user_name || '?').charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm text-white font-medium truncate">{item.user_name || 'Unknown'}</div>
                              <div className="text-[10px] text-white/40 truncate">{item.user_email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 hidden sm:table-cell">
                          <span className="text-xs text-white/60">{item.method}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`text-sm font-semibold ${activeType === 'deposits' ? 'text-emerald-400' : 'text-sky-400'}`}>
                            {activeType === 'deposits' ? '+' : '-'}₦{item.amount}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 hidden md:table-cell">
                          <div className="text-xs text-white/40">{timeAgo(item.created_at)}</div>
                          <div className="text-[10px] text-white/25">{formatDate(item.created_at)}</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusBadge(item.status)}`}>
                            {statusLabel(item.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openDetail(item, activeType);
                            }}
                            className="text-xs text-gold-400 hover:text-gold-300 transition-colors whitespace-nowrap"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer count */}
            <div className="px-4 py-3 border-t border-dark-700/40 text-[10px] text-white/30">
              Showing {currentList.length} {activeType} {statusFilter !== 'all' ? `(${statusFilter})` : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Detail / Action Modal */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeDetail} />
          <div className="relative bg-surface-card border border-dark-700/50 rounded-xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold text-lg">
                {detailType === 'deposits' ? 'Deposit' : 'Withdrawal'} Review
              </h3>
              <button
                onClick={closeDetail}
                className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors"
              >
                <i className="ri-close-line w-5 h-5 flex items-center justify-center" />
              </button>
            </div>

            <div className="flex flex-col gap-4 mb-5">
              {/* User */}
              <div className="bg-dark-800/40 border border-dark-700/30 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center text-white/60 text-sm font-bold shrink-0">
                    {(detailItem.user_name || '?').charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm text-white font-medium">{detailItem.user_name || 'Unknown'}</div>
                    <div className="text-xs text-white/40">{detailItem.user_email}</div>
                    <div className="text-[10px] text-white/25 font-mono mt-0.5">UID: {detailItem.user_id.slice(0, 12)}...</div>
                  </div>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-dark-800/40 border border-dark-700/30 rounded-lg p-3">
                  <div className="text-[10px] text-white/40 mb-0.5">Amount</div>
                  <div className={`text-lg font-bold ${detailType === 'deposits' ? 'text-emerald-400' : 'text-sky-400'}`}>
                    {detailType === 'deposits' ? '+' : '-'}₦{detailItem.amount}
                  </div>
                </div>
                <div className="bg-dark-800/40 border border-dark-700/30 rounded-lg p-3">
                  <div className="text-[10px] text-white/40 mb-0.5">Status</div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusBadge(detailItem.status)}`}>
                    {statusLabel(detailItem.status)}
                  </span>
                </div>
                <div className="bg-dark-800/40 border border-dark-700/30 rounded-lg p-3">
                  <div className="text-[10px] text-white/40 mb-0.5">Method</div>
                  <div className="text-sm text-white font-medium">{detailItem.method}</div>
                </div>
                <div className="bg-dark-800/40 border border-dark-700/30 rounded-lg p-3">
                  <div className="text-[10px] text-white/40 mb-0.5">Submitted</div>
                  <div className="text-sm text-white">{formatDate(detailItem.created_at)}</div>
                </div>
              </div>

              {/* Extra detail */}
              {'tx_hash' in detailItem && detailItem.tx_hash && (
                <div className="bg-dark-800/40 border border-dark-700/30 rounded-lg p-3">
                  <div className="text-[10px] text-white/40 mb-0.5">Transaction Hash / Reference</div>
                  <div className="text-xs text-gold-400 font-mono break-all">{detailItem.tx_hash}</div>
                </div>
              )}
              {'wallet_address' in detailItem && detailItem.wallet_address && (
                <div className="bg-dark-800/40 border border-dark-700/30 rounded-lg p-3">
                  <div className="text-[10px] text-white/40 mb-0.5">Wallet / Account</div>
                  <div className="text-xs text-gold-400 font-mono break-all">{detailItem.wallet_address}</div>
                </div>
              )}

              {/* Admin Notes */}
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Admin Notes</label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Add internal notes about this transaction..."
                  maxLength={500}
                  rows={3}
                  className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors resize-none"
                />
                <p className="text-[10px] text-white/25 mt-1 text-right">{adminNote.length}/500</p>
              </div>
            </div>

            {/* Actions */}
            {detailItem.status === 'pending' ? (
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={approveItem}
                  disabled={processing}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-md transition-colors text-sm flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center" />
                  ) : (
                    <i className="ri-check-line w-4 h-4 flex items-center justify-center" />
                  )}
                  {processing ? 'Processing...' : 'Approve'}
                </button>
                <button
                  onClick={rejectItem}
                  disabled={processing}
                  className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-md transition-colors text-sm flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center" />
                  ) : (
                    <i className="ri-close-line w-4 h-4 flex items-center justify-center" />
                  )}
                  {processing ? 'Processing...' : 'Reject'}
                </button>
                <button
                  onClick={closeDetail}
                  disabled={processing}
                  className="flex-1 border border-white/20 hover:border-white/40 text-white py-2.5 rounded-md transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="bg-dark-800/40 border border-dark-700/30 rounded-lg p-3">
                  <p className="text-xs text-white/40">
                    This transaction has already been <span className="text-white/60">{detailItem.status}</span>.
                    Admin notes can still be updated by saving above.
                  </p>
                </div>
                <button
                  onClick={closeDetail}
                  className="w-full border border-white/20 hover:border-white/40 text-white py-2.5 rounded-md transition-colors text-sm"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 bg-surface-card border border-gold-400/30 rounded-lg px-4 py-3 flex items-center gap-2 shadow-lg">
          <i className="ri-check-line text-gold-400 w-4 h-4 flex items-center justify-center" />
          <span className="text-sm text-white">{toast.msg}</span>
        </div>
      )}
    </div>
  );
}