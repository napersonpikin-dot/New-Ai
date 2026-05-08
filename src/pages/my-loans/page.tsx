import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

interface Loan {
  id: number;
  amount: number;
  reason: string;
  duration_months: number;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export default function MyLoansPage() {
  const { user } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'paid'>('all');

  useEffect(() => {
    async function loadLoans() {
      if (!supabase) { setLoading(false); return; }
      setLoading(true);
      const uid = user?.id ?? 'demo-user-001';
      const { data, error } = await supabase
        .from('loans')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });
      if (!error && data) {
        setLoans(data as Loan[]);
      }
      setLoading(false);
    }
    loadLoans();
  }, [user?.id]);

  const filtered = loans.filter((l) =>
    filter === 'all' ? true : l.status === filter
  );

  const stats = {
    total: loans.length,
    pending: loans.filter((l) => l.status === 'pending').length,
    approved: loans.filter((l) => l.status === 'approved').length,
    totalAmount: loans.reduce((sum, l) => sum + Number(l.amount), 0),
    approvedAmount: loans
      .filter((l) => l.status === 'approved')
      .reduce((sum, l) => sum + Number(l.amount), 0),
  };

  const statusConfig: Record<string, { color: string; bg: string; border: string; label: string }> = {
    pending: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-400/20', label: 'Pending Review' },
    approved: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-400/20', label: 'Approved' },
    rejected: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-400/20', label: 'Rejected' },
    paid: { color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-400/20', label: 'Paid Off' },
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
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">My Loans</h1>
              <p className="text-sm text-white/50">Track your loan applications and repayment status.</p>
            </div>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center bg-gold-500 hover:bg-gold-600 text-dark-900 font-semibold px-5 py-2.5 rounded-md transition-colors text-sm whitespace-nowrap gap-2"
            >
              <i className="ri-hand-coin-line w-4 h-4 flex items-center justify-center" />
              Apply for Loan
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="bg-surface-card border border-dark-700/40 rounded-xl p-4 md:p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gold-500/5 rounded-full blur-xl translate-x-8 -translate-y-8" />
              <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Total Loans</div>
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
              <div className="absolute top-0 right-0 w-20 h-20 bg-violet-500/5 rounded-full blur-xl translate-x-8 -translate-y-8" />
              <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Total Approved Value</div>
              <div className="text-2xl font-bold text-white">
                ₦{loading ? '-' : stats.approvedAmount.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
            {(['all', 'pending', 'approved', 'rejected', 'paid'] as const).map((f) => (
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

          {/* Loans List */}
          {loading ? (
            <div className="text-center py-12 text-sm text-white/40">Loading your loans...</div>
          ) : filtered.length === 0 ? (
            <div className="bg-surface-card border border-dark-700/40 rounded-xl p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-dark-800 flex items-center justify-center mx-auto mb-3">
                <i className="ri-hand-coin-line text-white/20 text-2xl w-6 h-6 flex items-center justify-center" />
              </div>
              <p className="text-sm text-white/50 mb-1">No loan applications found.</p>
              <p className="text-xs text-white/30 mb-4">
                {filter !== 'all'
                  ? `No ${filter} loans. Try a different filter.`
                  : 'Apply for your first loan from your dashboard.'}
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
              {filtered.map((loan) => {
                const cfg = statusConfig[loan.status] || statusConfig.pending;
                return (
                  <div
                    key={loan.id}
                    className="bg-surface-card border border-dark-700/40 rounded-xl p-4 md:p-5 hover:border-dark-600 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                          <i className="ri-hand-coin-line text-violet-400 w-5 h-5 flex items-center justify-center" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">
                            ₦{Number(loan.amount).toLocaleString()}
                          </div>
                          <div className="text-[11px] text-white/40">
                            Applied on {new Date(loan.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border w-fit ${cfg.bg} ${cfg.color} ${cfg.border}`}
                      >
                        {cfg.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                      <div className="bg-dark-800/40 rounded-lg p-3 border border-dark-700/30">
                        <div className="text-[10px] text-white/40 mb-1">Duration</div>
                        <div className="text-sm text-white">{loan.duration_months} Month(s)</div>
                      </div>
                      <div className="bg-dark-800/40 rounded-lg p-3 border border-dark-700/30">
                        <div className="text-[10px] text-white/40 mb-1">Amount</div>
                        <div className="text-sm text-white">₦{Number(loan.amount).toLocaleString()}</div>
                      </div>
                      <div className="bg-dark-800/40 rounded-lg p-3 border border-dark-700/30 col-span-2 sm:col-span-1">
                        <div className="text-[10px] text-white/40 mb-1">Last Updated</div>
                        <div className="text-sm text-white">
                          {new Date(loan.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {loan.reason && (
                      <div className="text-xs text-white/50 bg-dark-800/30 rounded-md px-3 py-2 mb-2">
                        <span className="text-white/30">Reason: </span>
                        {loan.reason}
                      </div>
                    )}

                    {loan.admin_notes && (
                      <div className="text-xs text-gold-400/80 bg-gold-500/5 border border-gold-400/10 rounded-md px-3 py-2">
                        <span className="text-gold-400/50">Admin note: </span>
                        {loan.admin_notes}
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