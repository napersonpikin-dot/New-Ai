import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface MemberRow {
  id: number;
  name: string;
  email: string;
  robots: number;
  earnings: string;
  status: string;
  joined: string;
}

interface DepositRow {
  id: number;
  user_name: string;
  user_email: string;
  amount: number;
  method: string;
  status: string;
  created_at: string;
}

interface WithdrawalRow {
  id: number;
  user_name: string;
  user_email: string;
  amount: number;
  method: string;
  status: string;
  created_at: string;
}

interface CouponRow {
  id: number;
  code: string;
  discount_percent: number;
  used_count: number;
  max_uses: number;
  valid_until: string;
  status: string;
}

type ReportType = 'members' | 'deposits' | 'withdrawals' | 'coupons' | 'transactions';

function downloadCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const reportCards: { id: ReportType; label: string; icon: string; desc: string }[] = [
  { id: 'members', label: 'Members Report', icon: 'ri-user-line', desc: 'Export all member data including status and earnings' },
  { id: 'deposits', label: 'Deposits Report', icon: 'ri-download-cloud-line', desc: 'Export all deposit records with statuses' },
  { id: 'withdrawals', label: 'Withdrawals Report', icon: 'ri-upload-cloud-line', desc: 'Export all withdrawal requests and approvals' },
  { id: 'coupons', label: 'Activation Code Usage Report', icon: 'ri-coupon-line', desc: 'Export activation codes with usage and expiry data' },
  { id: 'transactions', label: 'All Transactions', icon: 'ri-exchange-line', desc: 'Combined deposits + withdrawals in one sheet' },
];

export default function ReportsTab() {
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [deposits, setDeposits] = useState<DepositRow[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRow[]>([]);
  const [coupons, setCoupons] = useState<CouponRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; show: boolean }>({ msg: '', show: false });

  const showNotification = (msg: string) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast({ msg: '', show: false }), 3000);
  };

  const loadAll = async () => {
    setLoading(true);
    try {
      if (!supabase) {
        showNotification('Supabase not connected.');
        return;
      }
      const [{ data: m }, { data: d }, { data: w }, { data: c }] = await Promise.all([
        supabase.from('deposits').select('*').order('created_at', { ascending: false }),
        supabase.from('withdrawals').select('*').order('created_at', { ascending: false }),
        supabase.from('coupons').select('*').order('created_at', { ascending: false }),
        supabase.from('platform_settings').select('*'),
      ]);
      setDeposits((d as DepositRow[]) || []);
      setWithdrawals((w as WithdrawalRow[]) || []);
      setCoupons((c as CouponRow[]) || []);
      // Members from mock for now since no users table; still allow export
      const mockMembers: MemberRow[] = [
        { id: 1, name: 'Michael Turner', email: 'mike.turner@email.com', robots: 3, earnings: '₦3,420', status: 'active', joined: '2025-01-15' },
        { id: 2, name: 'Sarah Lee', email: 'sarah.lee@email.com', robots: 5, earnings: '₦12,100', status: 'active', joined: '2025-02-03' },
        { id: 3, name: 'James Kim', email: 'james.kim@email.com', robots: 2, earnings: '₦1,840', status: 'active', joined: '2025-02-20' },
        { id: 4, name: 'Elena Rossi', email: 'elena.r@email.com', robots: 1, earnings: '₦520', status: 'pending', joined: '2025-04-28' },
        { id: 5, name: 'David Chen', email: 'dchen@email.com', robots: 7, earnings: '₦28,400', status: 'active', joined: '2024-11-10' },
        { id: 6, name: 'Amara Okafor', email: 'amara.o@email.com', robots: 0, earnings: '₦0', status: 'suspended', joined: '2025-03-12' },
        { id: 7, name: 'Liam Johnson', email: 'liam.j@email.com', robots: 4, earnings: '₦7,200', status: 'active', joined: '2025-01-28' },
        { id: 8, name: 'Priya Patel', email: 'priya.p@email.com', robots: 2, earnings: '₦2,100', status: 'active', joined: '2025-03-05' },
        { id: 9, name: 'Carlos Mendez', email: 'carlos.m@email.com', robots: 1, earnings: '₦380', status: 'pending', joined: '2025-04-30' },
        { id: 10, name: 'Anna Kowalski', email: 'anna.k@email.com', robots: 6, earnings: '₦15,600', status: 'active', joined: '2024-12-18' },
      ];
      setMembers(mockMembers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleExport = (type: ReportType) => {
    if (type === 'members') {
      const headers = ['ID', 'Name', 'Email', 'Robots', 'Earnings', 'Status', 'Joined'];
      const rows = members.map((u) => [
        u.id,
        u.name,
        u.email,
        u.robots,
        u.earnings,
        u.status,
        u.joined,
      ]);
      downloadCSV('members.csv', headers, rows);
      showNotification('Members report downloaded.');
    }
    if (type === 'deposits') {
      const headers = ['ID', 'User', 'Email', 'Amount', 'Method', 'Status', 'Date'];
      const rows = deposits.map((d) => [
        d.id,
        d.user_name || '',
        d.user_email || '',
        d.amount,
        d.method,
        d.status,
        d.created_at ? new Date(d.created_at).toLocaleString() : '',
      ]);
      downloadCSV('deposits.csv', headers, rows);
      showNotification('Deposits report downloaded.');
    }
    if (type === 'withdrawals') {
      const headers = ['ID', 'User', 'Email', 'Amount', 'Method', 'Status', 'Date'];
      const rows = withdrawals.map((w) => [
        w.id,
        w.user_name || '',
        w.user_email || '',
        w.amount,
        w.method,
        w.status,
        w.created_at ? new Date(w.created_at).toLocaleString() : '',
      ]);
      downloadCSV('withdrawals.csv', headers, rows);
      showNotification('Withdrawals report downloaded.');
    }
    if (type === 'coupons') {
      const headers = ['Code', 'Discount %', 'Used', 'Max', 'Valid Until', 'Status'];
      const rows = coupons.map((c) => [
        c.code,
        c.discount_percent,
        c.used_count,
        c.max_uses,
        c.valid_until || '',
        c.status,
      ]);
      downloadCSV('activation-codes.csv', headers, rows);
      showNotification('Activation codes report downloaded.');
    }
    if (type === 'transactions') {
      const headers = ['Type', 'ID', 'User', 'Email', 'Amount', 'Method', 'Status', 'Date'];
      const depRows = deposits.map((d) => [
        'Deposit',
        d.id,
        d.user_name || '',
        d.user_email || '',
        d.amount,
        d.method,
        d.status,
        d.created_at ? new Date(d.created_at).toLocaleString() : '',
      ]);
      const withRows = withdrawals.map((w) => [
        'Withdrawal',
        w.id,
        w.user_name || '',
        w.user_email || '',
        w.amount,
        w.method,
        w.status,
        w.created_at ? new Date(w.created_at).toLocaleString() : '',
      ]);
      downloadCSV('all-transactions.csv', headers, [...depRows, ...withRows]);
      showNotification('All transactions report downloaded.');
    }
  };

  return (
    <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5 md:p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-white font-semibold text-base">Reports &amp; Exports</h3>
          <p className="text-xs text-white/40 mt-0.5">
            Download CSV reports for members, transactions, and activation code usage
          </p>
        </div>
        {loading && (
          <span className="text-xs text-white/40 animate-pulse">Loading data...</span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportCards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleExport(card.id)}
            className="bg-dark-800/40 border border-dark-700/30 hover:border-gold-400/20 rounded-lg p-5 text-left transition-colors group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-400">
                <i className={`${card.icon} text-lg w-5 h-5 flex items-center justify-center`} />
              </div>
              <i className="ri-download-2-line w-5 h-5 flex items-center justify-center text-white/20 group-hover:text-gold-400 transition-colors" />
            </div>
            <h4 className="text-sm text-white font-medium mb-1">{card.label}</h4>
            <p className="text-[11px] text-white/40">{card.desc}</p>
          </button>
        ))}
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