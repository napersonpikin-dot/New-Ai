import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Deposit {
  id: number;
  user_name: string;
  user_email: string;
  amount: number;
  method: string;
  status: string;
  created_at: string;
}

interface Withdrawal {
  id: number;
  user_name: string;
  user_email: string;
  amount: number;
  method: string;
  status: string;
  created_at: string;
}

function timeAgo(dateStr: string) {
  const d = new Date(dateStr);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function FinanceTab() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; show: boolean }>({ msg: '', show: false });

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
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      if (de) showNotification('Failed to load deposits.');
      else setDeposits((d as Deposit[]) || []);

      const { data: w, error: we } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('status', 'pending')
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

  const confirmDeposit = async (id: number, name: string, amount: number) => {
    if (!supabase) return;
    const { error } = await supabase
      .from('deposits')
      .update({ status: 'confirmed', updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      showNotification('Failed to confirm deposit.');
      return;
    }
    setDeposits((prev) => prev.filter((x) => x.id !== id));
    showNotification(`Deposit of ₦${amount} from ${name} confirmed.`);
  };

  const rejectDeposit = async (id: number, name: string) => {
    if (!supabase) return;
    const { error } = await supabase
      .from('deposits')
      .update({ status: 'rejected', updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      showNotification('Failed to reject deposit.');
      return;
    }
    setDeposits((prev) => prev.filter((x) => x.id !== id));
    showNotification(`Deposit from ${name} rejected.`);
  };

  const approveWithdrawal = async (id: number, name: string, amount: number) => {
    if (!supabase) return;
    const { error } = await supabase
      .from('withdrawals')
      .update({ status: 'approved', updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      showNotification('Failed to approve withdrawal.');
      return;
    }
    setWithdrawals((prev) => prev.filter((x) => x.id !== id));
    showNotification(`Withdrawal of ₦${amount} to ${name} approved.`);
  };

  const denyWithdrawal = async (id: number, name: string) => {
    if (!supabase) return;
    const { error } = await supabase
      .from('withdrawals')
      .update({ status: 'denied', updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      showNotification('Failed to deny withdrawal.');
      return;
    }
    setWithdrawals((prev) => prev.filter((x) => x.id !== id));
    showNotification(`Withdrawal from ${name} denied.`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Deposits */}
      <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5 md:p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-white font-semibold text-base">Pending Deposits</h3>
            <p className="text-xs text-white/40 mt-0.5">Review and confirm member deposits</p>
          </div>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full border border-emerald-400/20">
            {deposits.length} Pending
          </span>
        </div>
        {loading ? (
          <div className="text-sm text-white/40 py-8 text-center">Loading deposits...</div>
        ) : deposits.length === 0 ? (
          <div className="text-sm text-white/40 py-8 text-center">No pending deposits.</div>
        ) : (
          <div className="flex flex-col gap-2">
            {deposits.map((d) => (
              <div
                key={d.id}
                className="flex items-center gap-3 bg-dark-800/40 rounded-lg p-3 border border-dark-700/30"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-xs font-bold shrink-0">
                  {d.user_name ? d.user_name.charAt(0) : '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white font-medium truncate">{d.user_name || 'Unknown'}</div>
                  <div className="text-[10px] text-white/40">
                    {d.method} &middot; {timeAgo(d.created_at)}
                  </div>
                </div>
                <div className="text-sm text-emerald-400 font-semibold whitespace-nowrap">+₦{d.amount}</div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => confirmDeposit(d.id, d.user_name || '', d.amount)}
                    className="w-7 h-7 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-400/20 flex items-center justify-center transition-colors"
                    title="Confirm"
                  >
                    <i className="ri-check-line text-emerald-400 text-xs w-4 h-4 flex items-center justify-center" />
                  </button>
                  <button
                    onClick={() => rejectDeposit(d.id, d.user_name || '')}
                    className="w-7 h-7 rounded-md bg-red-500/10 hover:bg-red-500/20 border border-red-400/20 flex items-center justify-center transition-colors"
                    title="Reject"
                  >
                    <i className="ri-close-line text-red-400 text-xs w-4 h-4 flex items-center justify-center" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Withdrawals */}
      <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5 md:p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-white font-semibold text-base">Pending Withdrawals</h3>
            <p className="text-xs text-white/40 mt-0.5">Review and approve withdrawal requests</p>
          </div>
          <span className="text-[10px] bg-sky-500/10 text-sky-400 px-2 py-1 rounded-full border border-sky-400/20">
            {withdrawals.length} Pending
          </span>
        </div>
        {loading ? (
          <div className="text-sm text-white/40 py-8 text-center">Loading withdrawals...</div>
        ) : withdrawals.length === 0 ? (
          <div className="text-sm text-white/40 py-8 text-center">No pending withdrawals.</div>
        ) : (
          <div className="flex flex-col gap-2">
            {withdrawals.map((w) => (
              <div
                key={w.id}
                className="flex items-center gap-3 bg-dark-800/40 rounded-lg p-3 border border-dark-700/30"
              >
                <div className="w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400 text-xs font-bold shrink-0">
                  {w.user_name ? w.user_name.charAt(0) : '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white font-medium truncate">{w.user_name || 'Unknown'}</div>
                  <div className="text-[10px] text-white/40">
                    {w.method} &middot; {timeAgo(w.created_at)}
                  </div>
                </div>
                <div className="text-sm text-sky-400 font-semibold whitespace-nowrap">-₦{w.amount}</div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => approveWithdrawal(w.id, w.user_name || '', w.amount)}
                    className="w-7 h-7 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-400/20 flex items-center justify-center transition-colors"
                    title="Approve"
                  >
                    <i className="ri-check-line text-emerald-400 text-xs w-4 h-4 flex items-center justify-center" />
                  </button>
                  <button
                    onClick={() => denyWithdrawal(w.id, w.user_name || '')}
                    className="w-7 h-7 rounded-md bg-red-500/10 hover:bg-red-500/20 border border-red-400/20 flex items-center justify-center transition-colors"
                    title="Deny"
                  >
                    <i className="ri-close-line text-red-400 text-xs w-4 h-4 flex items-center justify-center" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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