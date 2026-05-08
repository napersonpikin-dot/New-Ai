import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAnnouncements } from '@/context/AnnouncementsContext';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  platformGrowth,
  dailyActiveUsers,
  revenueBreakdown,
  topRobotsByRevenue,
  tierDistribution,
  earningsDistribution,
} from '@/mocks/analytics';
import FinanceTab from './components/FinanceTab';
import CouponsTab from './components/CouponsTab';
import ReportsTab from './components/ReportsTab';
import PlatformSettingsTab from './components/PlatformSettingsTab';
import RobotManagementTab from './components/RobotManagementTab';
import LoansTab from './components/LoansTab';
import UserEditModal from './components/UserEditModal';
import BulkActionModal from './components/BulkActionModal';
import AuditLogTab from './components/AuditLogTab';
import WithdrawalsReviewTab from './components/WithdrawalsReviewTab';
import WithdrawalSettingsTab from './components/WithdrawalSettingsTab';
import { supabase } from '@/lib/supabase';

const CHART_COLORS = ['#D4AF37', '#34D399', '#06B6D4', '#A1A1AA', '#B45309'];

const adminStats = [
  { label: 'Total Members', value: '8,247', change: '+124 this week', icon: 'ri-user-line', color: 'bg-gold-500/10 text-gold-400' },
  { label: 'Active Robots', value: '14,302', change: '+89 this week', icon: 'ri-robot-2-line', color: 'bg-emerald-500/10 text-emerald-400' },
  { label: 'Total Earnings Paid', value: '₦2.47M', change: '+₦18.2K today', icon: 'ri-money-dollar-circle-line', color: 'bg-sky-500/10 text-sky-400' },
  { label: 'Pending Withdrawals', value: '32', change: '₦8,450 total', icon: 'ri-time-line', color: 'bg-amber-500/10 text-amber-400' },
];

const users = [
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

const recentActivity = [
  { action: 'Robot Purchased', detail: 'YieldMaster X by Sarah Lee', time: '2 min ago', icon: 'ri-shopping-cart-line' },
  { action: 'Withdrawal Processed', detail: '₦450 to Michael Turner (Crypto)', time: '12 min ago', icon: 'ri-wallet-3-line' },
  { action: 'New Signup', detail: 'Elena Rossi from Italy', time: '25 min ago', icon: 'ri-user-add-line' },
  { action: 'Account Suspended', detail: 'Amara Okafor — fraud alert', time: '1 hr ago', icon: 'ri-alert-line' },
  { action: 'Robot Activated', detail: 'AlphaBot Pro for David Chen', time: '2 hr ago', icon: 'ri-flashlight-line' },
  { action: 'Support Ticket', detail: 'Resolved — wallet connection issue', time: '3 hr ago', icon: 'ri-customer-service-2-line' },
];

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'members', label: 'Members' },
  { id: 'finance', label: 'Finance' },
  { id: 'withdrawals', label: 'Withdrawals' },
  { id: 'withdrawal-settings', label: 'Withdrawal Settings' },
  { id: 'loans', label: 'Loans' },
  { id: 'coupons', label: 'Activation Codes' },
  { id: 'reports', label: 'Reports' },
  { id: 'settings', label: 'Settings' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'robot-management', label: 'Robot Management' },
  { id: 'audit', label: 'Audit Log' },
];

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-card border border-dark-700/50 rounded-lg px-3 py-2 shadow-lg">
      <p className="text-xs text-white/60 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-xs text-white font-medium">
          <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: p.color }} />
          {p.name}: {typeof p.value === 'number' && p.value > 999 ? p.value.toLocaleString() : p.value}
        </p>
      ))}
    </div>
  );
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending' | 'suspended'>('all');
  const [userList, setUserList] = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showBulkModal, setShowBulkModal] = useState(false);

  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [announceText, setAnnounceText] = useState('');
  const { broadcast, broadcasts } = useAnnouncements();

  const activeEditUser = useMemo(
    () => (editUserId ? userList.find((u) => u.id === editUserId) || null : null),
    [editUserId, userList]
  );

  // Load real members from Supabase profiles
  useEffect(() => {
    async function loadMembers() {
      if (!supabase) { setLoadingMembers(false); return; }
      setLoadingMembers(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, user_id, full_name, email, status, role, robots_owned, total_earnings, welcome_bonus, balance, referral_bonus, created_at')
        .order('created_at', { ascending: false });
      if (!error && data) {
        const mapped = data.map((p: any) => ({
          id: p.id,
          name: p.full_name || 'Unknown',
          email: p.email || '',
          robots: p.robots_owned || 0,
          earnings: `₦${(p.total_earnings || 0).toLocaleString()}`,
          welcome_bonus: `₦${(p.welcome_bonus || 0).toLocaleString()}`,
          balance: `₦${(p.balance || 0).toLocaleString()}`,
          referral_bonus: `₦${(p.referral_bonus || 0).toLocaleString()}`,
          status: p.status || 'active',
          joined: p.created_at ? new Date(p.created_at).toLocaleDateString() : '—',
        }));
        setUserList(mapped);
      } else {
        setUserList(users);
      }
      setLoadingMembers(false);
    }
    loadMembers();
  }, []);

  const filteredUsers = userList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || u.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const toggleUserStatus = async (id: number) => {
    const user = userList.find((u) => u.id === id);
    if (!user) return;
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';

    if (supabase) {
      const { error } = await supabase
        .from('profiles')
        .update({ status: nextStatus, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) {
        setToastMsg(`Failed to update ${user.name}.`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }

      // Audit log for single status toggle
      await supabase.from('admin_audit_log').insert({
        target_profile_id: id,
        target_user_email: user.email || null,
        action_type: nextStatus === 'active' ? 'single_activate' : 'single_suspend',
        field_name: 'status',
        old_value: user.status,
        new_value: nextStatus,
      });
    }

    setUserList((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: nextStatus } : u))
    );
    const verb = nextStatus === 'active' ? 'activated' : 'suspended';
    setToastMsg(`User ${user.name} has been ${verb}.`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const showNotification = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announceText.trim()) return;
    broadcast(announceText.trim(), 'Admin');
    showNotification('Announcement broadcasted to all groups.');
    setAnnounceText('');
    setShowAnnounceModal(false);
  };

  const handleEditSaved = () => {
    // Refresh the list so updated values reflect immediately
    setLoadingMembers(true);
    if (supabase) {
      supabase
        .from('profiles')
        .select('id, user_id, full_name, email, status, role, robots_owned, total_earnings, welcome_bonus, balance, referral_bonus, created_at')
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (!error && data) {
            const mapped = data.map((p: any) => ({
              id: p.id,
              name: p.full_name || 'Unknown',
              email: p.email || '',
              robots: p.robots_owned || 0,
              earnings: `₦${(p.total_earnings || 0).toLocaleString()}`,
              welcome_bonus: `₦${(p.welcome_bonus || 0).toLocaleString()}`,
              balance: `₦${(p.balance || 0).toLocaleString()}`,
              referral_bonus: `₦${(p.referral_bonus || 0).toLocaleString()}`,
              status: p.status || 'active',
              joined: p.created_at ? new Date(p.created_at).toLocaleDateString() : '—',
            }));
            setUserList(mapped);
          }
          setLoadingMembers(false);
        });
    } else {
      setLoadingMembers(false);
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAllVisible = () => {
    const ids = filteredUsers.map((u) => u.id);
    const allSelected = ids.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...ids])));
    }
  };

  const clearSelection = () => setSelectedIds([]);

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
              to="/dashboard/settings"
              className="hidden sm:flex text-sm text-white/60 hover:text-white transition-colors whitespace-nowrap items-center gap-1"
            >
              <i className="ri-settings-3-line w-4 h-4 flex items-center justify-center" />
              Settings
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
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Admin Control Center</h1>
            <p className="text-sm text-white/50">Manage members, finance, activation codes, and platform analytics in one place.</p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-dark-800/60 border border-dark-700/40 rounded-lg p-1 mb-8 w-fit overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-2 text-xs rounded-md transition-all whitespace-nowrap ${
                  activeTab === t.id
                    ? 'bg-gold-500 text-dark-900 font-semibold'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ---------- Overview Tab ---------- */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {adminStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-surface-card border border-dark-700/40 rounded-xl p-5 hover:border-dark-600 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                        <i className={`${stat.icon} text-lg w-5 h-5 flex items-center justify-center`} />
                      </div>
                      <span className="text-[10px] text-white/30 bg-dark-800/60 px-2 py-0.5 rounded-full">Today</span>
                    </div>
                    <div className="text-white font-bold text-xl mb-1">{stat.value}</div>
                    <div className="text-xs text-white/40">{stat.change}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-surface-card border border-dark-700/40 rounded-xl overflow-hidden">
                  <div className="p-5 border-b border-dark-700/40">
                    <h3 className="text-white font-semibold text-base">Recent Activity</h3>
                  </div>
                  <div className="p-5">
                    <div className="flex flex-col gap-4">
                      {recentActivity.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-dark-800 border border-dark-700/40 flex items-center justify-center shrink-0">
                            <i className={`${item.icon} text-gold-400 text-xs w-4 h-4 flex items-center justify-center`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-white font-medium">{item.action}</div>
                            <div className="text-xs text-white/40 truncate">{item.detail}</div>
                            <div className="text-[10px] text-white/25 mt-0.5">{item.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5">
                  <h3 className="text-white font-semibold text-base mb-4">Quick Actions</h3>
                  <div className="flex flex-col gap-2.5">
                    <button
                      onClick={() => setShowAnnounceModal(true)}
                      className="flex items-center gap-2 bg-dark-800 hover:bg-dark-700 border border-dark-700/40 rounded-md px-4 py-2.5 text-sm text-white/70 hover:text-white transition-colors"
                    >
                      <i className="ri-mail-send-line w-4 h-4 flex items-center justify-center text-gold-400" />
                      Send Announcement
                    </button>
                    <Link
                      to="/admin/finance-approval"
                      className="flex items-center gap-2 bg-dark-800 hover:bg-dark-700 border border-dark-700/40 rounded-md px-4 py-2.5 text-sm text-white/70 hover:text-white transition-colors"
                    >
                      <i className="ri-secure-payment-line w-4 h-4 flex items-center justify-center text-gold-400" />
                      Review Payments
                    </Link>
                    <button
                      onClick={() => setActiveTab('reports')}
                      className="flex items-center gap-2 bg-dark-800 hover:bg-dark-700 border border-dark-700/40 rounded-md px-4 py-2.5 text-sm text-white/70 hover:text-white transition-colors"
                    >
                      <i className="ri-file-list-3-line w-4 h-4 flex items-center justify-center text-gold-400" />
                      Export User Report
                    </button>
                    <button className="flex items-center gap-2 bg-dark-800 hover:bg-dark-700 border border-dark-700/40 rounded-md px-4 py-2.5 text-sm text-white/70 hover:text-white transition-colors">
                      <i className="ri-shield-check-line w-4 h-4 flex items-center justify-center text-gold-400" />
                      Run Security Audit
                    </button>
                    <button
                      onClick={() => setActiveTab('analytics')}
                      className="flex items-center gap-2 bg-dark-800 hover:bg-dark-700 border border-dark-700/40 rounded-md px-4 py-2.5 text-sm text-white/70 hover:text-white transition-colors"
                    >
                      <i className="ri-bar-chart-grouped-fill w-4 h-4 flex items-center justify-center text-gold-400" />
                      View Full Analytics
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-white font-semibold text-base">Announcement Broadcaster</h3>
                    <p className="text-xs text-white/40 mt-0.5">Push system messages to all community groups instantly</p>
                  </div>
                  <button
                    onClick={() => setShowAnnounceModal(true)}
                    className="bg-gold-500 hover:bg-gold-600 text-dark-900 font-semibold px-4 py-2 rounded-md transition-colors text-xs flex items-center gap-2 whitespace-nowrap"
                  >
                    <i className="ri-broadcast-line w-4 h-4 flex items-center justify-center" />
                    New Broadcast
                  </button>
                </div>
                {broadcasts.length === 0 ? (
                  <div className="text-center py-6 text-sm text-white/30">
                    <i className="ri-broadcast-line w-8 h-8 flex items-center justify-center mx-auto mb-2 text-white/15" />
                    No announcements broadcasted yet.
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {broadcasts.slice(0, 5).map((b) => (
                      <div key={b.id} className="flex items-start gap-3 bg-dark-800/40 rounded-lg p-3 border border-dark-700/30">
                        <div className="w-8 h-8 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400 text-xs font-bold shrink-0">
                          <i className="ri-shield-check-line w-4 h-4 flex items-center justify-center" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm text-white font-medium">{b.sender}</span>
                            <span className="text-[10px] text-white/30">{new Date(b.timestamp).toLocaleString()}</span>
                          </div>
                          <div className="text-sm text-white/70">{b.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ---------- Members Tab ---------- */}
          {activeTab === 'members' && (
            <div className="flex flex-col gap-4">
              <div className="bg-surface-card border border-dark-700/40 rounded-xl overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-dark-700/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-white font-semibold text-base">All Members</h3>
                    {selectedIds.length > 0 && (
                      <span className="text-[10px] font-semibold text-gold-400 bg-gold-500/10 border border-gold-400/20 px-2 py-0.5 rounded-full">
                        {selectedIds.length} selected
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedIds.length > 0 && (
                      <div className="flex items-center gap-2 mr-2">
                        <button
                          onClick={() => setShowBulkModal(true)}
                          className="flex items-center gap-1.5 bg-gold-500 hover:bg-gold-600 text-dark-900 font-semibold px-3 py-1.5 rounded-md transition-colors text-[11px] whitespace-nowrap"
                        >
                          <i className="ri-stack-line w-3 h-3 flex items-center justify-center" />
                          Bulk Actions
                        </button>
                        <button
                          onClick={clearSelection}
                          className="text-[10px] text-white/40 hover:text-white/70 transition-colors px-2 py-1"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                    <div className="relative">
                      <i className="ri-search-line absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30 text-xs w-4 h-4 flex items-center justify-center" />
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search members..."
                        className="bg-dark-800 border border-dark-700/50 rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors w-40 sm:w-48"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                      className="bg-dark-800 border border-dark-700/50 rounded-md px-2 py-1.5 text-xs text-white focus:outline-none focus:border-gold-400/50 transition-colors"
                    >
                      <option value="all">All</option>
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-dark-700/40">
                        <th className="px-3 py-3 w-8">
                          <button
                            onClick={selectAllVisible}
                            className="w-4 h-4 rounded border border-white/20 flex items-center justify-center transition-colors"
                            title="Select all visible"
                          >
                            {filteredUsers.length > 0 && filteredUsers.every((u) => selectedIds.includes(u.id)) ? (
                              <i className="ri-check-line text-gold-400 text-[10px] w-3 h-3 flex items-center justify-center" />
                            ) : filteredUsers.some((u) => selectedIds.includes(u.id)) ? (
                              <div className="w-2 h-2 rounded-sm bg-gold-400/60" />
                            ) : null}
                          </button>
                        </th>
                        <th className="px-5 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider">Member</th>
                        <th className="px-5 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider hidden sm:table-cell">Robots</th>
                        <th className="px-5 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider hidden md:table-cell">Earnings</th>
                        <th className="px-5 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider hidden md:table-cell">Balance</th>
                        <th className="px-5 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider hidden lg:table-cell">Welcome</th>
                        <th className="px-5 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider hidden lg:table-cell">Referral</th>
                        <th className="px-5 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider">Status</th>
                        <th className="px-5 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider hidden xl:table-cell">Joined</th>
                        <th className="px-5 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingMembers ? (
                        <tr>
                          <td colSpan={10} className="px-5 py-8 text-center text-sm text-white/40">
                            Loading members...
                          </td>
                        </tr>
                      ) : filteredUsers.map((u) => (
                        <tr key={u.id} className="border-b border-dark-700/30 hover:bg-dark-800/30 transition-colors">
                          <td className="px-3 py-3.5">
                            <button
                              onClick={() => toggleSelect(u.id)}
                              className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                selectedIds.includes(u.id)
                                  ? 'border-gold-400 bg-gold-500/20'
                                  : 'border-white/20 hover:border-white/40'
                              }`}
                            >
                              {selectedIds.includes(u.id) && (
                                <i className="ri-check-line text-gold-400 text-[10px] w-3 h-3 flex items-center justify-center" />
                              )}
                            </button>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center text-white/60 text-xs font-bold shrink-0">
                                {u.name.split(' ').map((n: string) => n[0]).join('')}
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm text-white font-medium truncate">{u.name}</div>
                                <div className="text-[10px] text-white/40 truncate">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-sm text-white/60 hidden sm:table-cell">{u.robots}</td>
                          <td className="px-5 py-3.5 text-sm text-gold-400 hidden md:table-cell">{u.earnings}</td>
                          <td className="px-5 py-3.5 text-sm text-white/60 hidden md:table-cell">{u.balance}</td>
                          <td className="px-5 py-3.5 text-sm text-violet-400 hidden lg:table-cell">{u.welcome_bonus}</td>
                          <td className="px-5 py-3.5 text-sm text-amber-400 hidden lg:table-cell">{u.referral_bonus}</td>
                          <td className="px-5 py-3.5">
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                u.status === 'active'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-400/20'
                                  : u.status === 'pending'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-400/20'
                                  : 'bg-red-500/10 text-red-400 border border-red-400/20'
                              }`}
                            >
                              {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-[10px] text-white/40 hidden xl:table-cell">{u.joined}</td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => toggleUserStatus(u.id)}
                                className={`text-[10px] font-medium px-2 py-1 rounded transition-colors whitespace-nowrap ${
                                  u.status === 'active'
                                    ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                    : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                                }`}
                              >
                                {u.status === 'active' ? 'Suspend' : 'Activate'}
                              </button>
                              <button
                                onClick={() => { setEditUserId(u.id); setShowEditModal(true); }}
                                className="text-[10px] font-medium px-2 py-1 rounded transition-colors whitespace-nowrap bg-dark-700/40 text-white/50 hover:text-white hover:bg-dark-700"
                              >
                                <i className="ri-pencil-line w-3 h-3 flex items-center justify-center" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredUsers.length === 0 && (
                        <tr>
                          <td colSpan={10} className="px-5 py-8 text-center text-sm text-white/40">
                            No members found matching your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ---------- Finance Tab ---------- */}
          {activeTab === 'finance' && <FinanceTab />}

          {/* ---------- Withdrawals Review Tab ---------- */}
          {activeTab === 'withdrawals' && <WithdrawalsReviewTab />}

          {/* ---------- Withdrawal Settings Tab ---------- */}
          {activeTab === 'withdrawal-settings' && <WithdrawalSettingsTab />}

          {/* ---------- Activation Codes Tab ---------- */}
          {activeTab === 'coupons' && <CouponsTab />}

          {/* ---------- Reports Tab ---------- */}
          {activeTab === 'reports' && <ReportsTab />}

          {/* ---------- Settings Tab ---------- */}
          {activeTab === 'settings' && <PlatformSettingsTab />}

          {/* ---------- Analytics Tab ---------- */}
          {activeTab === 'analytics' && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Users', value: '8,247', change: '+5.8%', icon: 'ri-user-line', color: 'bg-gold-500/10 text-gold-400' },
                  { label: 'Active Robots', value: '14,302', change: '+3.2%', icon: 'ri-robot-2-line', color: 'bg-emerald-500/10 text-emerald-400' },
                  { label: 'Monthly Revenue', value: '₦489K', change: '+12.4%', icon: 'ri-money-dollar-circle-line', color: 'bg-sky-500/10 text-sky-400' },
                  { label: 'Avg Daily Earnings', value: '₦14.2', change: '+8.1%', icon: 'ri-line-chart-line', color: 'bg-amber-500/10 text-amber-400' },
                ].map((kpi) => (
                  <div key={kpi.label} className="bg-surface-card border border-dark-700/40 rounded-xl p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${kpi.color}`}>
                        <i className={`${kpi.icon} text-lg w-5 h-5 flex items-center justify-center`} />
                      </div>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-400/20">{kpi.change}</span>
                    </div>
                    <div className="text-white font-bold text-xl mb-1">{kpi.value}</div>
                    <div className="text-xs text-white/40">{kpi.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5 md:p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-white font-semibold text-base">Platform Growth</h3>
                    <p className="text-xs text-white/40 mt-0.5">Users, robots deployed, and revenue over time</p>
                  </div>
                </div>
                <div className="h-72 md:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={platformGrowth} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorRobots" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#34D399" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2A2518" />
                      <XAxis dataKey="month" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v: number) => (v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v))} />
                      <Tooltip content={<ChartTooltip />} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#ffffff80' }} />
                      <Area type="monotone" dataKey="users" name="Users" stroke="#D4AF37" fill="url(#colorUsers)" strokeWidth={2} dot={{ r: 3, fill: '#D4AF37' }} />
                      <Area type="monotone" dataKey="robots" name="Robots" stroke="#34D399" fill="url(#colorRobots)" strokeWidth={2} dot={{ r: 3, fill: '#34D399' }} />
                      <Area type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#06B6D4" fill="url(#colorRevenue)" strokeWidth={2} dot={{ r: 3, fill: '#06B6D4' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5 md:p-6">
                  <h3 className="text-white font-semibold text-base mb-1">Daily Active Users</h3>
                  <p className="text-xs text-white/40 mb-5">DAU vs new signups this week</p>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dailyActiveUsers} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2A2518" />
                        <XAxis dataKey="day" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip content={<ChartTooltip />} />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#ffffff80' }} />
                        <Bar dataKey="dau" name="DAU" fill="#D4AF37" radius={[4, 4, 0, 0]} barSize={24} />
                        <Bar dataKey="newUsers" name="New Users" fill="#34D399" radius={[4, 4, 0, 0]} barSize={24} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5 md:p-6">
                  <h3 className="text-white font-semibold text-base mb-1">Revenue Breakdown</h3>
                  <p className="text-xs text-white/40 mb-5">Revenue sources and their share</p>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={revenueBreakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={85}
                          paddingAngle={3}
                          dataKey="amount"
                          nameKey="source"
                          stroke="none"
                        >
                          {revenueBreakdown.map((_, i) => (
                            <Cell key={`cell-${i}`} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<ChartTooltip />} />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#ffffff80' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5 md:p-6">
                  <h3 className="text-white font-semibold text-base mb-1">Tier Distribution</h3>
                  <p className="text-xs text-white/40 mb-5">Members by tier level</p>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={tierDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={80}
                          paddingAngle={4}
                          dataKey="value"
                          nameKey="name"
                          stroke="none"
                          label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelStyle={{ fontSize: '11px', fill: '#ffffff90' }}
                        >
                          {tierDistribution.map((entry, i) => (
                            <Cell key={`cell-${i}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<ChartTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {tierDistribution.map((t) => (
                      <div key={t.name} className="bg-dark-800/40 border border-dark-700/30 rounded-lg p-2 text-center">
                        <div className="text-sm font-bold" style={{ color: t.color }}>{t.value.toLocaleString()}</div>
                        <div className="text-[10px] text-white/40">{t.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5 md:p-6">
                <h3 className="text-white font-semibold text-base mb-1">Earnings Distribution</h3>
                <p className="text-xs text-white/40 mb-5">How many members earn in each range</p>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={earningsDistribution} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2A2518" />
                      <XAxis dataKey="range" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar dataKey="count" name="Members" fill="#D4AF37" radius={[4, 4, 0, 0]} barSize={36} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* ---------- Audit Log Tab ---------- */}
          {activeTab === 'audit' && <AuditLogTab />}

          {/* ---------- Robot Management Tab ---------- */}
          {activeTab === 'robot-management' && <RobotManagementTab />}

          {/* ---------- Loans Tab ---------- */}
          {activeTab === 'loans' && <LoansTab />}
        </div>
      </div>

      {/* Edit Member Modal */}
      <UserEditModal
        user={activeEditUser}
        isOpen={showEditModal}
        onClose={() => { setShowEditModal(false); setEditUserId(null); }}
        onSaved={handleEditSaved}
      />

      {/* Bulk Actions Modal */}
      <BulkActionModal
        isOpen={showBulkModal}
        selectedIds={selectedIds}
        onClose={() => setShowBulkModal(false)}
        onDone={() => {
          setShowBulkModal(false);
          setSelectedIds([]);
          handleEditSaved();
          setToastMsg('Bulk action completed successfully.');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }}
      />

      {/* Announcement Modal */}
      {showAnnounceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAnnounceModal(false)} />
          <div className="relative bg-surface-card border border-dark-700/50 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold text-lg">Broadcast Announcement</h3>
              <button
                onClick={() => setShowAnnounceModal(false)}
                className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors"
              >
                <i className="ri-close-line w-5 h-5 flex items-center justify-center" />
              </button>
            </div>
            <form onSubmit={handleBroadcast} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Message *</label>
                <textarea
                  value={announceText}
                  onChange={(e) => setAnnounceText(e.target.value)}
                  placeholder="Type your announcement here..."
                  maxLength={500}
                  rows={4}
                  className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors resize-none"
                />
                <p className="text-[10px] text-white/25 mt-1 text-right">{announceText.length}/500</p>
              </div>
              <div className="bg-gold-500/5 border border-gold-400/10 rounded-md p-3">
                <p className="text-xs text-white/50">
                  This will push a system message to all community groups simultaneously. Members will see it as a gold "System" message in every group chat.
                </p>
              </div>
              <button
                type="submit"
                disabled={!announceText.trim()}
                className="w-full bg-gold-500 hover:bg-gold-600 disabled:opacity-40 text-dark-900 font-semibold py-2.5 rounded-md transition-colors text-sm"
              >
                <span className="flex items-center justify-center gap-2">
                  <i className="ri-broadcast-line w-4 h-4 flex items-center justify-center" />
                  Broadcast to All Groups
                </span>
              </button>
            </form>
          </div>
        </div>
      )}

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