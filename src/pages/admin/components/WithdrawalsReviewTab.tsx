import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

interface Withdrawal {
  id: number;
  user_id: string;
  user_name: string;
  user_email: string;
  amount: number;
  method: string;
  status: string;
  withdrawal_source: string;
  wallet_address: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

const sourceConfig: Record<string, { label: string; icon: string; color: string; bg: string; border: string }> = {
  earnings: { label: 'Earnings', icon: 'ri-coins-line', color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-400/20' },
  balance: { label: 'Balance', icon: 'ri-wallet-3-line', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-400/20' },
  referral: { label: 'Referral Bonus', icon: 'ri-user-add-line', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-400/20' },
  welcome: { label: 'Welcome Bonus', icon: 'ri-gift-line', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-400/20' },
};

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  pending: { label: 'Pending Review', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-400/20' },
  approved: { label: 'Approved', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-400/20' },
  processing: { label: 'Processing', color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-400/20' },
  completed: { label: 'Completed', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-400/20' },
  rejected: { label: 'Rejected', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-400/20' },
  denied: { label: 'Denied', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-400/20' },
};

function timeAgo(dateStr: string) {
  const d = new Date(dateStr);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function WithdrawalsReviewTab() {
  const { user: adminUser } = useAuth();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'completed' | 'rejected'>('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount_high' | 'amount_low'>('newest');
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notesAction, setNotesAction] = useState<'approve' | 'reject'>('approve');
  const [notesTargetId, setNotesTargetId] = useState<number | null>(null);
  const [notesText, setNotesText] = useState('');
  const [toast, setToast] = useState<{ msg: string; show: boolean }>({ msg: '', show: false });

  const showNotification = (msg: string) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast({ msg: '', show: false }), 3000);
  };

  const loadData = async () => {
    if (!supabase) { setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from('withdrawals')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      showNotification('Failed to load withdrawals.');
    } else {
      setWithdrawals((data as Withdrawal[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = withdrawals
    .filter((w) => {
      const matchesFilter = filter === 'all' ? true : w.status === filter;
      const matchesSearch =
        !search ||
        (w.user_name || '').toLowerCase().includes(search.toLowerCase()) ||
        (w.user_email || '').toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortBy === 'amount_high') return b.amount - a.amount;
      if (sortBy === 'amount_low') return a.amount - b.amount;
      return 0;
    });

  const stats = {
    total: withdrawals.length,
    pending: withdrawals.filter((w) => w.status === 'pending').length,
    approved: withdrawals.filter((w) => w.status === 'approved' || w.status === 'completed').length,
    rejected: withdrawals.filter((w) => w.status === 'rejected' || w.status === 'denied').length,
    totalAmount: withdrawals.reduce((sum, w) => sum + Number(w.amount), 0),
    pendingAmount: withdrawals.filter((w) => w.status === 'pending').reduce((sum, w) => sum + Number(w.amount), 0),
  };

  const sendUserNotification = async (targetUserId: string, title: string, message: string, actionUrl?: string) => {
    if (!supabase) return;
    await supabase.from('user_notifications').insert({
      user_id: targetUserId,
      type: 'withdrawal',
      title,
      message,
      read: false,
      action_url: actionUrl || null,
    });
  };

  const handleApprove = async (id: number, targetUserId: string, name: string, amount: number) => {
    if (!supabase) return;
    setProcessingId(id);
    const { error } = await supabase
      .from('withdrawals')
      .update({
        status: 'approved',
        admin_notes: notesText.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    if (error) {
      showNotification('Failed to approve withdrawal.');
      setProcessingId(null);
      return;
    }

    // Audit log
    await supabase.from('admin_audit_log').insert({
      admin_user_id: adminUser?.id || null,
      admin_user_email: adminUser?.email || null,
      target_profile_id: null,
      target_user_email: name || null,
      action_type: 'withdrawal_approve',
      field_name: 'status',
      old_value: 'pending',
      new_value: 'approved',
    });

    // In-app notification
    await sendUserNotification(
      targetUserId,
      'Withdrawal Approved',
      `Your ₦${amount.toLocaleString()} withdrawal has been approved.`,
      '/my-withdrawals'
    );

    setWithdrawals((prev) => prev.map((w) => (w.id === id ? { ...w, status: 'approved' } : w)));
    showNotification(`Withdrawal of ₦${amount.toLocaleString()} approved.`);
    setProcessingId(null);
    setNotesText('');
  };

  const handleReject = async (id: number, targetUserId: string, name: string, amount: number) => {
    if (!supabase) return;
    setProcessingId(id);
    const { error } = await supabase
      .from('withdrawals')
      .update({
        status: 'rejected',
        admin_notes: notesText.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    if (error) {
      showNotification('Failed to reject withdrawal.');
      setProcessingId(null);
      return;
    }

    // Audit log
    await supabase.from('admin_audit_log').insert({
      admin_user_id: adminUser?.id || null,
      admin_user_email: adminUser?.email || null,
      target_profile_id: null,
      target_user_email: name || null,
      action_type: 'withdrawal_reject',
      field_name: 'status',
      old_value: 'pending',
      new_value: 'rejected',
    });

    // In-app notification
    await sendUserNotification(
      targetUserId,
      'Withdrawal Rejected',
      `Your ₦${amount.toLocaleString()} withdrawal was rejected. ${notesText.trim() || ''}`,
      '/my-withdrawals'
    );

    setWithdrawals((prev) => prev.map((w) => (w.id === id ? { ...w, status: 'rejected' } : w)));
    showNotification(`Withdrawal of ₦${amount.toLocaleString()} rejected.`);
    setProcessingId(null);
    setNotesText('');
  };

  const openNotesModal = (id: number, action: 'approve' | 'reject') => {
    setNotesTargetId(id);
    setNotesAction(action);
    setNotesText('');
    setShowNotesModal(true);
  };

  const confirmNotesAction = () => {
    if (!notesTargetId) return;
    const w = withdrawals.find((x) => x.id === notesTargetId);
    if (!w) return;
    setShowNotesModal(false);
    if (notesAction === 'approve') {
      handleApprove(w.id, w.user_id, w.user_name || '', w.amount);
    } else {
      handleReject(w.id, w.user_id, w.user_name || '', w.amount);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
        <div className="bg-surface-card border border-dark-700/40 rounded-xl p-4 md:p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gold-500/5 rounded-full blur-xl translate-x-8 -translate-y-8" />
          <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Total Requests</div>
          <div className="text-2xl font-bold text-white">{loading ? '-' : stats.total}</div>
        </div>
        <div className="bg-surface-card border border-dark-700/40 rounded-xl p-4 md:p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-full blur-xl translate-x-8 -translate-y-8" />
          <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Pending</div>
          <div className="text-2xl font-bold text-amber-400">{loading ? '-' : stats.pending}</div>
        </div>
        <div className="bg-surface-card border border-dark-700/40 rounded-xl p-4 md:p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl translate-x-8 -translate-y-8" />
          <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Approved</div>
          <div className="text-2xl font-bold text-emerald-400">{loading ? '-' : stats.approved}</div>
        </div>
        <div className="bg-surface-card border border-dark-700/40 rounded-xl p-4 md:p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/5 rounded-full blur-xl translate-x-8 -translate-y-8" />
          <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Rejected</div>
          <div className="text-2xl font-bold text-red-400">{loading ? '-' : stats.rejected}</div>
        </div>
        <div className="bg-surface-card border border-dark-700/40 rounded-xl p-4 md:p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-violet-500/5 rounded-full blur-xl translate-x-8 -translate-y-8" />
          <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Pending Value</div>
          <div className="text-2xl font-bold text-white">₦{loading ? '-' : stats.pendingAmount.toLocaleString()}</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-surface-card border border-dark-700/40 rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          {(['all', 'pending', 'approved', 'completed', 'rejected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all whitespace-nowrap ${
                filter === f
                  ? 'bg-gold-500/10 border-gold-400/30 text-gold-400 font-medium'
                  : 'border-dark-700/40 text-white/50 hover:text-white/80'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-dark-800 border border-dark-700/50 rounded-md px-2 py-1.5 text-xs text-white focus:outline-none focus:border-gold-400/50"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="amount_high">Amount: High to Low</option>
            <option value="amount_low">Amount: Low to High</option>
          </select>
          <div className="relative">
            <i className="ri-search-line absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30 text-xs w-4 h-4 flex items-center justify-center" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user..."
              className="bg-dark-800 border border-dark-700/50 rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 w-36 sm:w-44"
            />
          </div>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-sm text-white/40">Loading withdrawals...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface-card border border-dark-700/40 rounded-xl p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-dark-800 flex items-center justify-center mx-auto mb-3">
            <i className="ri-refund-line text-white/20 text-2xl w-6 h-6 flex items-center justify-center" />
          </div>
          <p className="text-sm text-white/50 mb-1">No withdrawal requests found.</p>
          <p className="text-xs text-white/30">
            {filter !== 'all' ? `No ${filter} withdrawals.` : 'Requests will appear here when members submit them.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((w) => {
            const sc = statusConfig[w.status] || statusConfig.pending;
            const src = sourceConfig[w.withdrawal_source || 'earnings'] || sourceConfig.earnings;
            const isPending = w.status === 'pending';
            return (
              <div
                key={w.id}
                className={`bg-surface-card border rounded-xl p-4 md:p-5 transition-all ${
                  isPending ? 'border-amber-400/20' : 'border-dark-700/40'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center text-white/60 text-xs font-bold shrink-0">
                      {w.user_name ? w.user_name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm text-white font-medium truncate">{w.user_name || 'Unknown'}</div>
                      <div className="text-[11px] text-white/40">{w.user_email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${sc.bg} ${sc.color} ${sc.border}`}
                    >
                      {sc.label}
                    </span>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${src.bg} ${src.color} ${src.border}`}
                    >
                      <i className={`${src.icon} w-3 h-3 flex items-center justify-center inline mr-1`} />
                      {src.label}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                  <div className="bg-dark-800/40 rounded-lg p-3 border border-dark-700/30">
                    <div className="text-[10px] text-white/40 mb-1">Amount</div>
                    <div className="text-lg font-bold text-white">₦{Number(w.amount).toLocaleString()}</div>
                  </div>
                  <div className="bg-dark-800/40 rounded-lg p-3 border border-dark-700/30">
                    <div className="text-[10px] text-white/40 mb-1">Method</div>
                    <div className="text-sm text-white">{w.method}</div>
                  </div>
                  <div className="bg-dark-800/40 rounded-lg p-3 border border-dark-700/30">
                    <div className="text-[10px] text-white/40 mb-1">Requested</div>
                    <div className="text-sm text-white">{timeAgo(w.created_at)}</div>
                  </div>
                  <div className="bg-dark-800/40 rounded-lg p-3 border border-dark-700/30">
                    <div className="text-[10px] text-white/40 mb-1">Wallet / Account</div>
                    <div className="text-sm text-white truncate" title={w.wallet_address}>
                      {w.wallet_address || '—'}
                    </div>
                  </div>
                </div>

                {w.admin_notes && (
                  <div className="text-xs text-gold-400/80 bg-gold-500/5 border border-gold-400/10 rounded-md px-3 py-2 mb-3">
                    <span className="text-gold-400/50">Admin note: </span>
                    {w.admin_notes}
                  </div>
                )}

                {isPending && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => openNotesModal(w.id, 'approve')}
                      disabled={processingId === w.id}
                      className="flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-400/20 text-emerald-400 px-3 py-1.5 rounded-md transition-colors text-xs font-medium disabled:opacity-40"
                    >
                      {processingId === w.id && notesAction === 'approve' ? (
                        <i className="ri-loader-4-line animate-spin w-3 h-3 flex items-center justify-center" />
                      ) : (
                        <i className="ri-check-line w-3 h-3 flex items-center justify-center" />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => openNotesModal(w.id, 'reject')}
                      disabled={processingId === w.id}
                      className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-400/20 text-red-400 px-3 py-1.5 rounded-md transition-colors text-xs font-medium disabled:opacity-40"
                    >
                      {processingId === w.id && notesAction === 'reject' ? (
                        <i className="ri-loader-4-line animate-spin w-3 h-3 flex items-center justify-center" />
                      ) : (
                        <i className="ri-close-line w-3 h-3 flex items-center justify-center" />
                      )}
                      Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Admin Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowNotesModal(false)} />
          <div className="relative bg-surface-card border border-dark-700/50 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold text-lg">
                {notesAction === 'approve' ? 'Approve Withdrawal' : 'Reject Withdrawal'}
              </h3>
              <button
                onClick={() => setShowNotesModal(false)}
                className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors"
              >
                <i className="ri-close-line w-5 h-5 flex items-center justify-center" />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs text-white/50 mb-1.5">
                  Admin Note (optional)
                </label>
                <textarea
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  placeholder={
                    notesAction === 'reject'
                      ? 'e.g. Insufficient verification, wallet address invalid...'
                      : 'e.g. Verified and processed via USDT...'
                  }
                  maxLength={300}
                  rows={3}
                  className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors resize-none"
                />
                <p className="text-[10px] text-white/25 mt-1 text-right">{notesText.length}/300</p>
              </div>
              <div className={`rounded-md p-3 border ${
                notesAction === 'approve'
                  ? 'bg-emerald-500/5 border-emerald-400/10'
                  : 'bg-red-500/5 border-red-400/10'
              }`}>
                <p className="text-xs text-white/50">
                  {notesAction === 'approve'
                    ? 'The member will be notified that their withdrawal has been approved. The note will be visible in their withdrawal history.'
                    : 'The member will be notified that their withdrawal was rejected. Include a reason in the note for transparency.'}
                </p>
              </div>
              <button
                onClick={confirmNotesAction}
                disabled={processingId !== null}
                className={`w-full font-semibold py-2.5 rounded-md transition-colors text-sm flex items-center justify-center gap-2 ${
                  notesAction === 'approve'
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-dark-900'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                {processingId !== null ? (
                  <>
                    <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center" />
                    Processing...
                  </>
                ) : (
                  <>
                    <i className={`${notesAction === 'approve' ? 'ri-check-line' : 'ri-close-line'} w-4 h-4 flex items-center justify-center`} />
                    Confirm {notesAction === 'approve' ? 'Approval' : 'Rejection'}
                  </>
                )}
              </button>
            </div>
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