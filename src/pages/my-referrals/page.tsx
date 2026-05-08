import { useState } from 'react';
import { Link } from 'react-router-dom';
import { myReferralsData } from '@/mocks/referrals';

export default function MyReferralsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const maxBonus = Math.max(...myReferralsData.monthlyBonusTrend.map((d) => d.bonus));

  const filteredReferrals = myReferralsData.referrals.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.country.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && r.status === 'active') ||
      (statusFilter === 'inactive' && r.status === 'inactive');
    return matchesSearch && matchesStatus;
  });

  const activeCount = myReferralsData.referrals.filter((r) => r.status === 'active').length;
  const inactiveCount = myReferralsData.referrals.filter((r) => r.status === 'inactive').length;
  const totalRobotPurchases = myReferralsData.referrals.reduce((sum, r) => sum + r.robotsPurchased, 0);
  const avgBonusPerReferral = myReferralsData.totalBonusEarned / myReferralsData.totalSignups;

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
            <Link to="/referral" className="hidden sm:flex text-sm text-white/60 hover:text-white transition-colors whitespace-nowrap items-center gap-1">
              <i className="ri-share-line w-4 h-4 flex items-center justify-center" /> Referral
            </Link>
            <Link to="/affiliate" className="hidden sm:flex text-sm text-white/60 hover:text-white transition-colors whitespace-nowrap items-center gap-1">
              <i className="ri-link-unlink-m w-4 h-4 flex items-center justify-center" /> Affiliate
            </Link>
            <Link to="/dashboard" className="text-sm text-white/60 hover:text-white transition-colors whitespace-nowrap flex items-center gap-1">
              <i className="ri-dashboard-line w-4 h-4 flex items-center justify-center" /> Dashboard
            </Link>
            <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 text-xs font-bold">
              MT
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 py-6 md:py-10">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">My Referrals</h1>
            <p className="text-sm text-white/50">Track everyone who signed up with your code and monitor your bonus earnings.</p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5">
              <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Total Signups</div>
              <div className="text-2xl font-bold text-white">{myReferralsData.totalSignups}</div>
              <div className="text-xs text-emerald-400 mt-1">+3 this month</div>
            </div>
            <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5">
              <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Active Referrals</div>
              <div className="text-2xl font-bold text-emerald-400">{activeCount}</div>
              <div className="text-xs text-white/40 mt-1">Earning & purchasing</div>
            </div>
            <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5">
              <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Inactive</div>
              <div className="text-2xl font-bold text-white/50">{inactiveCount}</div>
              <div className="text-xs text-white/40 mt-1">No activity yet</div>
            </div>
            <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5">
              <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Total Bonus</div>
              <div className="text-2xl font-bold text-gold-400">${myReferralsData.totalBonusEarned.toLocaleString()}</div>
              <div className="text-xs text-white/40 mt-1">Lifetime referral bonus</div>
            </div>
            <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5">
              <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Avg / Referral</div>
              <div className="text-2xl font-bold text-white">${avgBonusPerReferral.toFixed(1)}</div>
              <div className="text-xs text-emerald-400 mt-1">+12% vs last month</div>
            </div>
          </div>

          {/* Bonus Trend Chart */}
          <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5 md:p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-white font-semibold text-base">Monthly Bonus Trend</h3>
                <p className="text-xs text-white/40 mt-0.5">How your referral bonus has grown over time</p>
              </div>
              <div className="text-xs text-gold-400 font-medium">${myReferralsData.pendingBonus} pending</div>
            </div>
            <div className="flex items-end justify-between gap-3 md:gap-5 h-40 md:h-48 px-2">
              {myReferralsData.monthlyBonusTrend.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="relative w-full flex items-end justify-center">
                    <div
                      className="w-full max-w-[48px] rounded-t-md bg-gold-500/70 hover:bg-gold-400 transition-all cursor-pointer relative"
                      style={{ height: `${(d.bonus / maxBonus) * 100}%` }}
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-dark-800 border border-dark-700/50 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        ${d.bonus}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-white/40">{d.month}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-dark-700/40">
              <span className="flex items-center gap-1.5 text-xs text-white/50">
                <span className="w-2.5 h-2.5 rounded-sm bg-gold-500/70" />
                Bonus Earned ($)
              </span>
              <span className="text-xs text-white/40">2026</span>
            </div>
          </div>

          {/* Robot Purchases Summary */}
          <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5 md:p-6 mb-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-white font-semibold text-base">Referral Purchase Impact</h3>
                <p className="text-xs text-white/40 mt-0.5">Robots bought by your referrals and your cut</p>
              </div>
              <div className="text-xs text-gold-400 font-medium">{totalRobotPurchases} robots sold</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Total Spent by Referrals', value: `$${myReferralsData.referrals.reduce((s, r) => s + r.totalSpent, 0).toLocaleString()}`, icon: 'ri-shopping-cart-line', color: 'text-emerald-400' },
                { label: 'Total Earnings Generated', value: `$${myReferralsData.referrals.reduce((s, r) => s + r.totalEarnings, 0).toLocaleString()}`, icon: 'ri-bar-chart-box-line', color: 'text-sky-400' },
                { label: 'Your Bonus from Purchases', value: `$${myReferralsData.totalBonusEarned.toLocaleString()}`, icon: 'ri-coin-line', color: 'text-gold-400' },
              ].map((s) => (
                <div key={s.label} className="bg-dark-800/40 border border-dark-700/30 rounded-lg p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-dark-700/60 flex items-center justify-center ${s.color}`}>
                    <i className={`${s.icon} w-5 h-5 flex items-center justify-center`} />
                  </div>
                  <div>
                    <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
                    <div className="text-[10px] text-white/40">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Referrals Table */}
          <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-white font-semibold text-base">Your Referral Network</h3>
                <p className="text-xs text-white/40 mt-0.5">{myReferralsData.totalSignups} people signed up with your code</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, email, country..."
                  className="bg-dark-800 border border-dark-700/50 rounded-md px-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors w-48 sm:w-56"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-dark-800 border border-dark-700/50 rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:border-gold-400/50 transition-colors"
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
                    <th className="px-4 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider">Member</th>
                    <th className="px-4 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider">Joined</th>
                    <th className="px-4 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider">Robots</th>
                    <th className="px-4 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider">Spent</th>
                    <th className="px-4 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider">Their Earnings</th>
                    <th className="px-4 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider">Your Bonus</th>
                    <th className="px-4 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider">Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReferrals.map((r) => (
                    <>
                      <tr
                        key={r.id}
                        className="border-b border-dark-700/30 hover:bg-dark-800/30 transition-colors cursor-pointer"
                        onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                      >
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400 text-xs font-bold shrink-0">
                              {r.name.charAt(0)}
                            </div>
                            <div>
                              <div className="text-sm text-white font-medium">{r.name}</div>
                              <div className="text-[10px] text-white/40">{r.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-white/60">{r.joined}</td>
                        <td className="px-4 py-3.5 text-sm text-white font-medium">{r.robotsPurchased}</td>
                        <td className="px-4 py-3.5 text-sm text-white/60">${r.totalSpent.toLocaleString()}</td>
                        <td className="px-4 py-3.5 text-sm text-emerald-400 font-medium">${r.totalEarnings.toLocaleString()}</td>
                        <td className="px-4 py-3.5 text-sm text-gold-400 font-medium">+${r.myBonus.toFixed(2)}</td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                              r.status === 'active'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-400/20'
                                : 'bg-white/5 text-white/40 border-white/10'
                            }`}
                          >
                            {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-white/40">{r.lastActive}</td>
                      </tr>
                      {expandedId === r.id && r.purchaseHistory.length > 0 && (
                        <tr>
                          <td colSpan={8} className="px-4 py-3 bg-dark-800/40 border-b border-dark-700/30">
                            <div className="pl-10">
                              <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Purchase History</div>
                              <div className="flex flex-col gap-1.5">
                                {r.purchaseHistory.map((p, idx) => (
                                  <div key={idx} className="flex items-center gap-3 text-xs">
                                    <span className="text-white/70 w-32 truncate">{p.robot}</span>
                                    <span className="text-white/40">{p.date}</span>
                                    <span className="text-white/60">${p.price}</span>
                                    <span className="text-gold-400 ml-auto">+${p.myBonus.toFixed(2)} bonus</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                  {filteredReferrals.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-sm text-white/40">
                        No referrals match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-8 bg-gold-500/5 border border-gold-400/10 rounded-xl p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-white font-semibold text-base mb-1">Grow Your Network</h3>
              <p className="text-xs text-white/50">Share your referral link and invite more members to maximize your bonus earnings.</p>
            </div>
            <Link
              to="/referral"
              className="bg-gold-500 hover:bg-gold-600 text-dark-900 font-semibold px-5 py-2.5 rounded-md transition-colors text-sm whitespace-nowrap flex items-center gap-2"
            >
              <i className="ri-share-line w-4 h-4 flex items-center justify-center" />
              Go to Referral Hub
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}