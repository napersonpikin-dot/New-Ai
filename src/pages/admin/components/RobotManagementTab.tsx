import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface UserRobotRow {
  id: number;
  user_id: string;
  robot_id: number;
  robot_name: string;
  category: string;
  price: number;
  daily_return: number;
  image: string;
  purchased_at: string;
  total_earned: number;
  active: boolean;
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

export default function RobotManagementTab() {
  const [robots, setRobots] = useState<UserRobotRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [toast, setToast] = useState<{ msg: string; show: boolean }>({ msg: '', show: false });

  const showNotification = (msg: string) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast({ msg: '', show: false }), 3000);
  };

  const loadRobots = async () => {
    setLoading(true);
    if (!supabase) {
      showNotification('Supabase not connected.');
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('user_robots')
      .select('*')
      .order('purchased_at', { ascending: false });
    if (error) {
      showNotification('Failed to load robots.');
    } else {
      setRobots((data as UserRobotRow[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadRobots();
  }, []);

  const toggleRobotStatus = async (id: number, currentActive: boolean, name: string) => {
    if (!supabase) return;
    const { error } = await supabase
      .from('user_robots')
      .update({ active: !currentActive, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      showNotification(`Failed to update ${name}.`);
      return;
    }
    setRobots((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !currentActive } : r))
    );
    showNotification(`${name} is now ${!currentActive ? 'Active' : 'Inactive'}.`);
  };

  const filtered = robots.filter((r) => {
    const matchesSearch =
      r.robot_name.toLowerCase().includes(search.toLowerCase()) ||
      r.user_id.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'active'
        ? r.active
        : !r.active;
    return matchesSearch && matchesStatus;
  });

  const activeCount = robots.filter((r) => r.active).length;
  const inactiveCount = robots.filter((r) => !r.active).length;
  const totalDaily = robots.reduce((sum, r) => sum + (r.active ? Number(r.daily_return) : 0), 0);

  return (
    <div className="flex flex-col gap-6">
      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Robots', value: robots.length.toLocaleString(), icon: 'ri-robot-2-line', color: 'bg-gold-500/10 text-gold-400' },
          { label: 'Active', value: activeCount.toLocaleString(), icon: 'ri-check-line', color: 'bg-emerald-500/10 text-emerald-400' },
          { label: 'Inactive', value: inactiveCount.toLocaleString(), icon: 'ri-close-line', color: 'bg-red-500/10 text-red-400' },
          { label: 'Daily Return', value: `₦${totalDaily.toLocaleString()}`, icon: 'ri-money-dollar-circle-line', color: 'bg-sky-500/10 text-sky-400' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-surface-card border border-dark-700/40 rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${kpi.color}`}>
                <i className={`${kpi.icon} text-lg w-5 h-5 flex items-center justify-center`} />
              </div>
            </div>
            <div className="text-white font-bold text-xl mb-1">{kpi.value}</div>
            <div className="text-xs text-white/40">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-surface-card border border-dark-700/40 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-dark-700/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-white font-semibold text-base">All User Robots</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <i className="ri-search-line absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30 text-xs w-4 h-4 flex items-center justify-center" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search robots or users..."
                className="bg-dark-800 border border-dark-700/50 rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors w-40 sm:w-56"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="bg-dark-800 border border-dark-700/50 rounded-md px-2 py-1.5 text-xs text-white focus:outline-none focus:border-gold-400/50 transition-colors"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-dark-700/40">
                <th className="px-5 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider">Robot</th>
                <th className="px-5 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider hidden sm:table-cell">Owner</th>
                <th className="px-5 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider">Price</th>
                <th className="px-5 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider hidden md:table-cell">Daily</th>
                <th className="px-5 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider hidden md:table-cell">Purchased</th>
                <th className="px-5 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider hidden lg:table-cell">Earned</th>
                <th className="px-5 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-sm text-white/40">
                    Loading robots...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-sm text-white/40">
                    No robots found.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="border-b border-dark-700/30 hover:bg-dark-800/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={r.image}
                          alt={r.robot_name}
                          className="w-10 h-10 rounded-md object-cover object-top shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-sm text-white font-medium truncate">{r.robot_name}</div>
                          <div className="text-[10px] text-white/40">{r.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-white/50 hidden sm:table-cell font-mono truncate max-w-[140px]">
                      {r.user_id.slice(0, 12)}...
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gold-400 font-medium">₦{Number(r.price).toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-sm text-emerald-400 hidden md:table-cell">+₦{r.daily_return}/day</td>
                    <td className="px-5 py-3.5 text-[10px] text-white/40 hidden md:table-cell">
                      <div>{new Date(r.purchased_at).toLocaleDateString()}</div>
                      <div className="text-white/25">{timeAgo(r.purchased_at)}</div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-white/60 hidden lg:table-cell">
                      ₦{Number(r.total_earned).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          r.active
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-400/20'
                            : 'bg-red-500/10 text-red-400 border-red-400/20'
                        }`}
                      >
                        {r.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => toggleRobotStatus(r.id, r.active, r.robot_name)}
                        className={`text-[10px] font-medium px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                          r.active
                            ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                        }`}
                      >
                        {r.active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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