import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

interface Withdrawal {
  id: number;
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
  cancelled: { label: 'Cancelled', color: 'text-white/40', bg: 'bg-dark-800/40', border: 'border-dark-700/30' },
};

export default function MyWithdrawalsPage() {
  const { user } = useAuth();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'completed'>('all');

  useEffect(() => {
    async function loadWithdrawals() {
      if (!supabase) { setLoading(false); return; }
      setLoading(true);
      const uid = user?.id ?? 'demo-user-001';
      const { data, error } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });
      if (!error && data) {
        setWithdrawals(data as Withdrawal[]);
      }
      setLoading(false);
    }
    loadWithdrawals();
  }, [user?.id]);

  const filtered = withdrawals.filter((w) =>
    filter === 'all' ? true : w.status === filter
  );

  const stats = {
    total: withdrawals.length,
    pending: withdrawals.filter((w) => w.status === 'pending').length,
    completed: withdrawals.filter((w) => w.status === 'completed').length,
    totalAmount: withdrawals.reduce((sum, w) => sum + Number(w.amount), 0),
    completedAmount: withdrawals.filter((w) => w.status === 'completed').reduce((sum, w) => sum + Number(w.amount), 0),
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Header */}
      <div className="border-b border-dark-700/50">
        <div className="flex items-center justify-between px-4 md:px-6 py-4">
          <Link to="/" className="inline-flex items-center gap-2 shrink-0">
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
              to="/dashboard"
              className="text-sm text-white/60 hover:text-white transition-colors whitespace-nowrap flex items-center gap-1"
            >
              <i className="ri-dashboard-line w-4 h-4 flex items-center justify-center" />
              Dashboard
            </Link>
            <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 text-xs font-bold">
              {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 py-6 md:py-8">
        <div className="max-w-5xl mx-auto">
          {/* Title + CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">My Withdrawals</h1>
              <p className="text-sm text-white/50">Track all your cashout requests and their status.</p>
            </div>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center bg-gold-500 hover:bg-gold-600 text-dark-900 font-semibold px-5 py-2.5 rounded-md transition-colors text-sm whitespace-nowrap gap-2"
            >
              <i className="ri-arrow-up-circle-line w-4 h-4 flex items-center justify-center" />
              New Withdrawal
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
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
              <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Completed</div>
              <div className="text-2xl font-bold text-emerald-400">{loading ? '-' : stats.completed}</div>
            </div>
            <div className="bg-surface-card border border-dark-700/40 rounded-xl p-4 md:p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-violet-500/5 rounded-full blur-xl translate-x-8 -translate-y-8" />
              <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Total Withdrawn</div>
              <div className="text-2xl font-bold text-white">
                ₦{loading ? '-' : stats.completedAmount.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
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

          {/* Withdrawals List */}
          {loading ? (
            <div className="text-center py-12 text-sm text-white/40">Loading your withdrawals...</div>
          ) : filtered.length === 0 ? (
            <div className="bg-surface-card border border-dark-700/40 rounded-xl p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-dark-800 flex items-center justify-center mx-auto mb-3">
                <i className="ri-refund-line text-white/20 text-2xl w-6 h-6 flex items-center justify-center" />
              </div>
              <p className="text-sm text-white/50 mb-1">No withdrawal requests found.</p>
              <p className="text-xs text-white/30 mb-4">
                {filter !== 'all'
                  ? `No ${filter} withdrawals. Try a different filter.`
                  : 'Start by requesting your first withdrawal from your dashboard.'}
              </p>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center bg-gold-500 hover:bg-gold-600 text-dark-900 font-semibold px-5 py-2 rounded-md transition-colors text-xs"
              >
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((w) => {
                const sc = statusConfig[w.status] || statusConfig.pending;
                const src = sourceConfig[w.withdrawal_source || 'earnings'] || sourceConfig.earnings;
                return (
                  <div
                    key={w.id}
                    className="bg-surface-card border border-dark-700/40 rounded-xl p-4 md:p-5 hover:border-dark-600 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${src.bg} flex items-center justify-center border ${src.border}`}>
                          <i className={`${src.icon} ${src.color} w-5 h-5 flex items-center justify-center`} />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">
                            ₦{Number(w.amount).toLocaleString()}
                          </div>
                          <div className="text-[11px] text-white/40">
                            {new Date(w.created_at).toLocaleDateString()} &middot; {w.method}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border w-fit ${sc.bg} ${sc.color} ${sc.border}`}
                      >
                        {sc.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                      <div className="bg-dark-800/40 rounded-lg p-3 border border-dark-700/30">
                        <div className="text-[10px] text-white/40 mb-1">Withdrawn From</div>
                        <div className="text-sm text-white flex items-center gap-1.5">
                          <i className={`${src.icon} ${src.color} w-3.5 h-3.5 flex items-center justify-center`} />
                          {src.label}
                        </div>
                      </div>
                      <div className="bg-dark-800/40 rounded-lg p-3 border border-dark-700/30">
                        <div className="text-[10px] text-white/40 mb-1">Method</div>
                        <div className="text-sm text-white">{w.method}</div>
                      </div>
                      <div className="bg-dark-800/40 rounded-lg p-3 border border-dark-700/30 col-span-2 sm:col-span-1">
                        <div className="text-[10px] text-white/40 mb-1">Last Updated</div>
                        <div className="text-sm text-white">
                          {new Date(w.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {w.wallet_address && (
                      <div className="text-xs text-white/50 bg-dark-800/30 rounded-md px-3 py-2 mb-2 flex items-center gap-1.5">
                        <i className="ri-wallet-line text-white/30 w-3.5 h-3.5 flex items-center justify-center" />
                        {w.wallet_address}
                      </div>
                    )}

                    {w.admin_notes && (
                      <div className="text-xs text-gold-400/80 bg-gold-500/5 border border-gold-400/10 rounded-md px-3 py-2">
                        <span className="text-gold-400/50">Admin note: </span>
                        {w.admin_notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}