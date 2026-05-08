import { useState } from 'react';
import { Link } from 'react-router-dom';
import { leaderboardData } from '@/mocks/referrals';

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<'all' | 'month' | 'week'>('all');
  const [search, setSearch] = useState('');

  const filtered = leaderboardData.filter((u) => {
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.handle.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  const topThree = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  const tierStyles: Record<string, string> = {
    Diamond: 'text-cyan-400 bg-cyan-500/10 border-cyan-400/20',
    Platinum: 'text-emerald-400 bg-emerald-500/10 border-emerald-400/20',
    Gold: 'text-gold-400 bg-gold-500/10 border-gold-400/20',
    Silver: 'text-gray-300 bg-gray-300/10 border-gray-300/20',
    Bronze: 'text-amber-600 bg-amber-600/10 border-amber-600/20',
  };

  const podiumOrder = [1, 0, 2];

  return (
    <div className="min-h-screen bg-dark-900 text-white">
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
            <Link to="/dashboard" className="text-sm text-white/60 hover:text-white transition-colors whitespace-nowrap flex items-center gap-1">
              <i className="ri-dashboard-line w-4 h-4 flex items-center justify-center" /> Dashboard
            </Link>
            <Link to="/activity" className="hidden sm:flex text-sm text-white/60 hover:text-white transition-colors whitespace-nowrap items-center gap-1">
              <i className="ri-pulse-line w-4 h-4 flex items-center justify-center" /> Activity
            </Link>
            <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 text-xs font-bold">
              MT
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 py-6 md:py-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Top Earners Leaderboard</h1>
            <p className="text-sm text-white/50">See who is earning the most across the platform. Climb the ranks.</p>
          </div>

          {/* Period Tabs + Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
            <div className="flex bg-dark-800/60 border border-dark-700/40 rounded-lg p-0.5">
              {([
                { key: 'all', label: 'All Time' },
                { key: 'month', label: 'This Month' },
                { key: 'week', label: 'This Week' },
              ] as const).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setPeriod(tab.key)}
                  className={`px-4 py-2 text-xs rounded-md transition-all whitespace-nowrap ${
                    period === tab.key ? 'bg-gold-500 text-dark-900 font-semibold' : 'text-white/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4 flex items-center justify-center" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search top earners..."
                className="bg-dark-800 border border-dark-700/50 rounded-md pl-9 pr-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors w-full sm:w-56"
              />
            </div>
          </div>

          {/* Podium */}
          <div className="flex items-end justify-center gap-3 md:gap-6 mb-10">
            {podiumOrder.map((idx) => {
              const user = topThree[idx];
              if (!user) return null;
              const isFirst = idx === 1;
              const isSecond = idx === 0;
              const heightClass = isFirst ? 'h-48 md:h-56' : isSecond ? 'h-40 md:h-48' : 'h-36 md:h-44';
              const crownColor = isFirst ? 'text-gold-400' : isSecond ? 'text-gray-300' : 'text-amber-600';
              const borderColor = isFirst ? 'border-gold-400/30' : isSecond ? 'border-gray-300/20' : 'border-amber-600/20';
              const bgColor = isFirst ? 'bg-gold-500/5' : isSecond ? 'bg-white/3' : 'bg-amber-600/5';

              return (
                <div key={user.rank} className={`flex flex-col items-center ${heightClass} w-full max-w-[200px]`}>
                  <div className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full border-2 ${borderColor} ${bgColor} flex items-center justify-center mb-3`}>
                    {isFirst && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <i className={`ri-vip-crown-fill ${crownColor} text-lg w-5 h-5 flex items-center justify-center`} />
                      </div>
                    )}
                    <span className="text-xl md:text-2xl font-bold text-white">{user.avatar}</span>
                  </div>
                  <div className="text-white font-semibold text-sm text-center leading-tight">{user.name}</div>
                  <div className="text-[10px] text-white/40 mb-1">{user.handle}</div>
                  <div className="text-gold-400 font-bold text-sm md:text-base">₦{user.totalEarned.toLocaleString()}</div>
                  <div className="text-[10px] text-white/30 mt-0.5">{user.robots} robots</div>
                  <div className={`mt-2 w-full rounded-t-xl flex-1 ${bgColor} border-t ${borderColor} flex items-center justify-center`}>
                    <span className={`text-lg md:text-xl font-bold ${crownColor}`}>#{user.rank}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rankings Table */}
          <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5 md:p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold text-base">Full Rankings</h3>
              <span className="text-xs text-white/40">{filtered.length} members</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-dark-700/40">
                    <th className="px-3 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider">Rank</th>
                    <th className="px-3 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider">Member</th>
                    <th className="px-3 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider">Robots</th>
                    <th className="px-3 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider">Total Earned</th>
                    <th className="px-3 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider hidden sm:table-cell">Daily Avg</th>
                    <th className="px-3 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider hidden md:table-cell">ROI</th>
                    <th className="px-3 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider hidden md:table-cell">Referral</th>
                    <th className="px-3 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider hidden sm:table-cell">Tier</th>
                    <th className="px-3 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider">Streak</th>
                  </tr>
                </thead>
                <tbody>
                  {rest.map((u) => (
                    <tr key={u.rank} className="border-b border-dark-700/30 hover:bg-dark-800/30 transition-colors">
                      <td className="px-3 py-3.5">
                        <span className="text-sm text-white/50 font-medium">#{u.rank}</span>
                      </td>
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400 text-[10px] font-bold shrink-0">
                            {u.avatar}
                          </div>
                          <div>
                            <Link to={`/member/${u.handle.replace('@', '')}`} className="text-sm text-white font-medium hover:text-gold-400 transition-colors">{u.name}</Link>
                            <div className="text-[10px] text-white/40">{u.handle} &middot; {u.country}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-sm text-white/60">{u.robots}</td>
                      <td className="px-3 py-3.5 text-sm text-gold-400 font-semibold">₦{u.totalEarned.toLocaleString()}</td>
                      <td className="px-3 py-3.5 text-sm text-emerald-400 font-medium hidden sm:table-cell">₦{u.dailyAvg.toLocaleString()}/d</td>
                      <td className="px-3 py-3.5 text-sm text-white/50 hidden md:table-cell">{u.roi}%</td>
                      <td className="px-3 py-3.5 text-sm text-white/50 hidden md:table-cell">+₦{u.referralBonus.toLocaleString()}</td>
                      <td className="px-3 py-3.5 hidden sm:table-cell">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tierStyles[u.tier] || 'text-white/40 bg-white/5 border-white/10'}`}>
                          {u.tier}
                        </span>
                      </td>
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-1">
                          <i className="ri-fire-line w-3.5 h-3.5 flex items-center justify-center text-orange-400" />
                          <span className="text-sm text-white/60">{u.streak}d</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {rest.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-sm text-white/40">
                        No members found for this search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}