import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const ACTION_LABELS: Record<string, string> = {
  edit_profile: 'Profile Edit',
  bulk_suspend: 'Bulk Suspend',
  bulk_activate: 'Bulk Activate',
  bulk_credit_welcome: 'Bulk Welcome Bonus',
  bulk_credit_referral: 'Bulk Referral Bonus',
  bulk_credit_balance: 'Bulk Balance Credit',
  single_suspend: 'Suspend',
  single_activate: 'Activate',
};

const ACTION_COLORS: Record<string, string> = {
  edit_profile: 'bg-sky-500/10 text-sky-400 border-sky-400/20',
  bulk_suspend: 'bg-red-500/10 text-red-400 border-red-400/20',
  bulk_activate: 'bg-emerald-500/10 text-emerald-400 border-emerald-400/20',
  bulk_credit_welcome: 'bg-violet-500/10 text-violet-400 border-violet-400/20',
  bulk_credit_referral: 'bg-amber-500/10 text-amber-400 border-amber-400/20',
  bulk_credit_balance: 'bg-gold-500/10 text-gold-400 border-gold-400/20',
  single_suspend: 'bg-red-500/10 text-red-400 border-red-400/20',
  single_activate: 'bg-emerald-500/10 text-emerald-400 border-emerald-400/20',
};

interface AuditEntry {
  id: number;
  admin_email: string | null;
  target_user_email: string | null;
  action_type: string;
  field_name: string | null;
  old_value: string | null;
  new_value: string | null;
  details: any;
  created_at: string;
}

export default function AuditLogTab() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 25;

  useEffect(() => {
    loadAuditLog();
  }, []);

  async function loadAuditLog() {
    if (!supabase) { setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from('admin_audit_log')
      .select('id, admin_email, target_user_email, action_type, field_name, old_value, new_value, details, created_at')
      .order('created_at', { ascending: false })
      .limit(500);
    if (!error && data) {
      setEntries(data as AuditEntry[]);
    }
    setLoading(false);
  }

  const filtered = entries.filter((e) => {
    const q = search.toLowerCase();
    const matchesSearch =
      (e.admin_email || '').toLowerCase().includes(q) ||
      (e.target_user_email || '').toLowerCase().includes(q) ||
      (e.action_type || '').toLowerCase().includes(q) ||
      (e.field_name || '').toLowerCase().includes(q);
    const matchesAction = filterAction === 'all' || e.action_type === filterAction;
    return matchesSearch && matchesAction;
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const actionTypes = Array.from(new Set(entries.map((e) => e.action_type)));

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <i className="ri-search-line absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30 text-xs w-4 h-4 flex items-center justify-center" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              placeholder="Search admin, member, action..."
              className="bg-dark-800 border border-dark-700/50 rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors w-48 sm:w-60"
            />
          </div>
          <select
            value={filterAction}
            onChange={(e) => { setFilterAction(e.target.value); setPage(0); }}
            className="bg-dark-800 border border-dark-700/50 rounded-md px-2 py-1.5 text-xs text-white focus:outline-none focus:border-gold-400/50 transition-colors"
          >
            <option value="all">All Actions</option>
            {actionTypes.map((a) => (
              <option key={a} value={a}>{ACTION_LABELS[a] || a}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/30">{filtered.length} entries</span>
          <button
            onClick={loadAuditLog}
            className="text-[10px] font-medium px-2 py-1 rounded bg-dark-800 border border-dark-700/40 text-white/50 hover:text-white transition-colors"
          >
            <i className="ri-refresh-line w-3 h-3 flex items-center justify-center" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-card border border-dark-700/40 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-dark-700/40">
                <th className="px-5 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider">Time</th>
                <th className="px-5 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider">Admin</th>
                <th className="px-5 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider">Action</th>
                <th className="px-5 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider">Member</th>
                <th className="px-5 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider">Field</th>
                <th className="px-5 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider">Old</th>
                <th className="px-5 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider">New</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-sm text-white/40">
                    Loading audit log...
                  </td>
                </tr>
              ) : paged.map((e) => (
                <tr key={e.id} className="border-b border-dark-700/30 hover:bg-dark-800/20 transition-colors">
                  <td className="px-5 py-3 text-[11px] text-white/50 whitespace-nowrap">
                    {new Date(e.created_at).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-[11px] text-white/70">
                    {e.admin_email || '—'}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${ACTION_COLORS[e.action_type] || 'bg-white/5 text-white/50 border-white/10'}`}>
                      {ACTION_LABELS[e.action_type] || e.action_type}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[11px] text-white/70">
                    {e.target_user_email || '—'}
                  </td>
                  <td className="px-5 py-3 text-[11px] text-white/50">
                    {e.field_name || '—'}
                  </td>
                  <td className="px-5 py-3 text-[11px] text-white/40">
                    {e.old_value ?? '—'}
                  </td>
                  <td className="px-5 py-3 text-[11px] text-gold-400 font-medium">
                    {e.new_value ?? '—'}
                  </td>
                </tr>
              ))}
              {paged.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-sm text-white/40">
                    No audit entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-dark-700/40">
            <span className="text-[10px] text-white/30">
              Page {page + 1} of {pageCount}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="w-7 h-7 rounded bg-dark-800 border border-dark-700/40 flex items-center justify-center text-white/40 hover:text-white disabled:opacity-30 transition-colors"
              >
                <i className="ri-arrow-left-s-line w-4 h-4 flex items-center justify-center" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                disabled={page >= pageCount - 1}
                className="w-7 h-7 rounded bg-dark-800 border border-dark-700/40 flex items-center justify-center text-white/40 hover:text-white disabled:opacity-30 transition-colors"
              >
                <i className="ri-arrow-right-s-line w-4 h-4 flex items-center justify-center" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}