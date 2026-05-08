import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Loan {
  id: number;
  user_id: string;
  user_name: string;
  user_email: string;
  amount: number;
  reason: string;
  duration_months: number;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export default function LoansTab() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'paid'>('all');
  const [search, setSearch] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [actionId, setActionId] = useState<number | null>(null);
  const [rejectNote, setRejectNote] = useState('');

  async function loadLoans() {
    if (!supabase) { setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from('loans')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      setLoans(data as Loan[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadLoans();
  }, []);

  const filtered = loans.filter((l) => {
    const matchesFilter = filter === 'all' ? true : l.status === filter;
    const matchesSearch =
      (l.user_name?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (l.user_email?.toLowerCase() || '').includes(search.toLowerCase()) ||
      String(l.id).includes(search);
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: loans.length,
    pending: loans.filter((l) => l.status === 'pending').length,
    approved: loans.filter((l) => l.status === 'approved').length,
    rejected: loans.filter((l) => l.status === 'rejected').length,
    totalValue: loans.reduce((sum, l) => sum + Number(l.amount), 0),
    pendingValue: loans.filter((l) => l.status === 'pending').reduce((sum, l) => sum + Number(l.amount), 0),
  };

  const statusConfig: Record<string, { color: string; bg: string; border: string; label: string }> = {
    pending: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-400/20', label: 'Pending' },
    approved: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-400/20', label: 'Approved' },
    rejected: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-400/20', label: 'Rejected' },
    paid: { color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-400/20', label: 'Paid Off' },
  };

  const handleApprove = async (id: number) => {
    if (!supabase) return;
    const { error } = await supabase
      .from('loans')
      .update({ status: 'approved', admin_notes: null, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      showToastMsg('Failed to approve loan.');
      return;
    }
    // Add notification to user
    const loan = loans.find((l) => l.id === id);
    if (loan) {
      await supabase.from('user_notifications').insert({
        user_id: loan.user_id,
        type: 'system',
        title: 'Loan Approved',
        message: `Your loan request of ₦${Number(loan.amount).toLocaleString()} has been approved. Funds will be credited shortly.`,
        read: false,
      });
    }
    showToastMsg('Loan approved successfully.');
    loadLoans();
  };

  const handleReject = async (id: number) => {
    if (!supabase) return;
    const note = rejectNote.trim();
    const { error } = await supabase
      .from('loans')
      .update({ status: 'rejected', admin_notes: note || null, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      showToastMsg('Failed to reject loan.');
      return;
    }
    const loan = loans.find((l) => l.id === id);
    if (loan) {
      await supabase.from('user_notifications').insert({
        user_id: loan.user_id,
        type: 'system',
        title: 'Loan Rejected',
        message: note
          ? `Your loan request of ₦${Number(loan.amount).toLocaleString()} was rejected. Reason: ${note}`
          : `Your loan request of ₦${Number(loan.amount).toLocaleString()} was not approved at this time.`,
        read: false,
      });
    }
    setActionId(null);
    setRejectNote('');
    showToastMsg('Loan rejected.');
    loadLoans();
  };

  const handleMarkPaid = async (id: number) => {
    if (!supabase) return;
    const { error } = await supabase
      .from('loans')
      .update({ status: 'paid', updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      showToastMsg('Failed to update loan.');
      return;
    }
    showToastMsg('Loan marked as paid off.');
    loadLoans();
  };

  const showToastMsg = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Requests', value: stats.total, color: 'text-white', icon: 'ri-hand-coin-line' },
          { label: 'Pending Review', value: stats.pending, color: 'text-amber-400', icon: 'ri-time-line' },
          { label: 'Approved', value: stats.approved, color: 'text-emerald-400', icon: 'ri-check-double-line' },
          { label: 'Pending Value', value: `₦${stats.pendingValue.toLocaleString()}`, color: 'text-white', icon: 'ri-money-dollar-circle-line' },
        ].map((s) => (
          <div key={s.label} className="bg-surface-card border border-dark-700/40 rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gold-500/5 rounded-full blur-xl translate-x-8 -translate-y-8" />
            <div className="flex items-center gap-2 mb-2">
              <i className={`${s.icon} text-gold-400 w-4 h-4 flex items-center justify-center`} />
              <span className="text-[10px] text-white/40 uppercase tracking-wider">{s.label}</span>
            </div>
            <div className={`text-2xl font-bold ${s.color}`}>
              {loading ? '-' : s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Filter + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
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
        <div className="relative">
          <i className="ri-search-line absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30 text-xs w-4 h-4 flex items-center justify-center" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or ID..."
            className="bg-dark-800 border border-dark-700/50 rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors w-full sm:w-64"
          />
        </div>
      </div>

      {/* Loans Table */}
      <div className="bg-surface-card border border-dark-700/40 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-dark-700/40">
                <th className="px-5 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider">Applicant</th>
                <th className="px-5 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider">Amount</th>
                <th className="px-5 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider hidden sm:table-cell">Duration</th>
                <th className="px-5 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider hidden md:table-cell">Applied</th>
                <th className="px-5 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-white/40">Loading loans...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-white/40">
                    No loan requests found.
                  </td>
                </tr>
              ) : (
                filtered.map((loan) => {
                  const cfg = statusConfig[loan.status] || statusConfig.pending;
                  return (
                    <tr key={loan.id} className="border-b border-dark-700/30 hover:bg-dark-800/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 text-xs font-bold shrink-0">
                            {loan.user_name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm text-white font-medium truncate">{loan.user_name || 'Unknown'}</div>
                            <div className="text-[10px] text-white/40 truncate">{loan.user_email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-white font-semibold">
                        ₦{Number(loan.amount).toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-white/60 hidden sm:table-cell">
                        {loan.duration_months} Month(s)
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[10px] text-white/40 hidden md:table-cell">
                        {new Date(loan.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {loan.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            {actionId === loan.id ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={rejectNote}
                                  onChange={(e) => setRejectNote(e.target.value)}
                                  placeholder="Reason (optional)"
                                  className="bg-dark-800 border border-dark-700/50 rounded px-2 py-1 text-[10px] text-white placeholder-white/30 focus:outline-none w-28"
                                />
                                <button
                                  onClick={() => handleReject(loan.id)}
                                  className="bg-red-500/10 hover:bg-red-500/20 border border-red-400/20 text-red-400 text-[10px] font-medium px-2 py-1 rounded transition-colors"
                                >
                                  Confirm Reject
                                </button>
                                <button
                                  onClick={() => { setActionId(null); setRejectNote(''); }}
                                  className="text-white/30 hover:text-white/60 text-[10px]"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleApprove(loan.id)}
                                  className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-400/20 text-emerald-400 text-[10px] font-medium px-2.5 py-1 rounded transition-colors"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => setActionId(loan.id)}
                                  className="bg-red-500/10 hover:bg-red-500/20 border border-red-400/20 text-red-400 text-[10px] font-medium px-2.5 py-1 rounded transition-colors"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        ) : loan.status === 'approved' ? (
                          <button
                            onClick={() => handleMarkPaid(loan.id)}
                            className="bg-sky-500/10 hover:bg-sky-500/20 border border-sky-400/20 text-sky-400 text-[10px] font-medium px-2.5 py-1 rounded transition-colors"
                          >
                            Mark Paid
                          </button>
                        ) : (
                          <span className="text-[10px] text-white/30">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-surface-card border border-gold-400/30 rounded-lg px-4 py-3 flex items-center gap-2 shadow-lg">
          <i className="ri-check-line text-gold-400 w-4 h-4 flex items-center justify-center" />
          <span className="text-sm text-white">{toastMsg}</span>
        </div>
      )}
    </div>
  );
}