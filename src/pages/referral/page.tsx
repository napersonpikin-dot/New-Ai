import { useState } from 'react';
import { Link } from 'react-router-dom';
import { referralProgram, referralTiers, referralHistory } from '@/mocks/referrals';

export default function ReferralPage() {
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [search, setSearch] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(referralProgram.referralLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredReferrals = referralHistory.filter((r) => {
    if (filter === 'active' && r.status !== 'active') return false;
    if (filter === 'inactive' && r.status !== 'inactive') return false;
    if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

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
            <Link to="/affiliate" className="hidden sm:flex text-sm text-white/60 hover:text-white transition-colors items-center gap-1 whitespace-nowrap">
              <i className="ri-link-unlink-m w-4 h-4 flex items-center justify-center" /> Affiliate
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
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Referral Program</h1>
            <p className="text-sm text-white/50">Invite friends, earn a percentage of their robot earnings for life.</p>
          </div>

          {/* Referral Link Card */}
          <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5 md:p-8 mb-6">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-400/20 flex items-center justify-center mx-auto mb-3">
                <i className="ri-share-line text-gold-400 text-xl w-6 h-6 flex items-center justify-center" />
              </div>
              <h2 className="text-white font-semibold text-lg mb-1">Your Unique Referral Link</h2>
              <p className="text-sm text-white/40">Share this link and earn when your friends buy robots</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <div className="flex-1 bg-dark-800 border border-dark-700/50 rounded-lg px-4 py-3 text-sm text-white/70 font-mono truncate">
                {referralProgram.referralLink}
              </div>
              <button
                onClick={handleCopy}
                className={`px-5 py-3 rounded-lg text-sm font-semibold transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
                  copied
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-400/20'
                    : 'bg-gold-500 hover:bg-gold-600 text-dark-900'
                }`}
              >
                <i className={`${copied ? 'ri-check-line' : 'ri-file-copy-line'} w-4 h-4 flex items-center justify-center`} />
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {[
                { icon: 'ri-telegram-line', label: 'Telegram', color: 'text-sky-400 border-sky-400/20 bg-sky-400/5' },
                { icon: 'ri-twitter-x-line', label: 'X / Twitter', color: 'text-white/70 border-white/10 bg-white/5' },
                { icon: 'ri-whatsapp-line', label: 'WhatsApp', color: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5' },
                { icon: 'ri-mail-line', label: 'Email', color: 'text-amber-400 border-amber-400/20 bg-amber-400/5' },
              ].map((btn) => (
                <button
                  key={btn.label}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md border text-xs font-medium transition-all whitespace-nowrap ${btn.color}`}
                >
                  <i className={`${btn.icon} w-4 h-4 flex items-center justify-center`} />
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5">
              <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Total Invited</div>
              <div className="text-2xl font-bold text-white">{referralProgram.totalInvited}</div>
              <div className="text-xs text-emerald-400 mt-1">+2 this week</div>
            </div>
            <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5">
              <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Total Earned</div>
              <div className="text-2xl font-bold text-gold-400">₦{referralProgram.totalEarned.toLocaleString()}</div>
              <div className="text-xs text-white/40 mt-1">Lifetime referral bonus</div>
            </div>
            <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5">
              <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Pending</div>
              <div className="text-2xl font-bold text-white">₦{referralProgram.pendingEarnings}</div>
              <div className="text-xs text-white/40 mt-1">Next payout in 2 days</div>
            </div>
            <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5">
              <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Bonus Rate</div>
              <div className="text-2xl font-bold text-gold-400">{referralProgram.bonusRate}%</div>
              <div className="text-xs text-emerald-400 mt-1">Current {referralProgram.currentTier} tier</div>
            </div>
          </div>

          {/* Tier Progress */}
          <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5 md:p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold text-base">Tier Progress</h3>
                <p className="text-xs text-white/40 mt-0.5">
                  {referralProgram.currentTier} tier — invite {referralProgram.nextTierAt - referralProgram.totalInvited} more to reach {referralProgram.nextTier}
                </p>
              </div>
              <span className="text-xs text-gold-400 font-medium">{referralProgram.tierProgress}%</span>
            </div>
            <div className="w-full bg-dark-700/40 rounded-full h-2.5 mb-5">
              <div
                className="h-full rounded-full bg-gold-500"
                style={{ width: `${referralProgram.tierProgress}%` }}
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {referralTiers.map((tier) => {
                const isCurrent = tier.name === referralProgram.currentTier;
                const unlocked = referralProgram.totalInvites >= tier.minInvites;
                return (
                  <div
                    key={tier.name}
                    className={`relative rounded-lg border p-3 text-center transition-all ${
                      isCurrent
                        ? `${tier.bgColor} ${tier.borderColor} ring-1 ring-gold-400/20`
                        : unlocked
                        ? 'bg-dark-800/60 border-dark-700/40'
                        : 'bg-dark-800/30 border-dark-700/20 opacity-50'
                    }`}
                  >
                    {isCurrent && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] bg-gold-500 text-dark-900 font-bold px-2 py-0.5 rounded-full">
                        YOU
                      </div>
                    )}
                    <i className={`${tier.icon} ${tier.color} w-5 h-5 flex items-center justify-center mx-auto mb-1.5`} />
                    <div className={`text-sm font-semibold ${unlocked ? tier.color : 'text-white/40'}`}>{tier.name}</div>
                    <div className="text-[10px] text-white/40 mt-1">{tier.minInvites}+ invites</div>
                    <div className="text-xs font-medium mt-1 text-white/60">{tier.bonusPercent}% bonus</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Referral History */}
          <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-white font-semibold text-base">Your Referrals</h3>
                <p className="text-xs text-white/40 mt-0.5">Track everyone you have invited and their earnings</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name..."
                  className="bg-dark-800 border border-dark-700/50 rounded-md px-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors w-40"
                />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
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
                    <th className="px-4 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider">Their Earnings</th>
                    <th className="px-4 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider">Your Bonus</th>
                    <th className="px-4 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReferrals.map((r) => (
                    <tr key={r.id} className="border-b border-dark-700/30 hover:bg-dark-800/30 transition-colors">
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
                      <td className="px-4 py-3.5 text-sm text-white font-medium">{r.robots}</td>
                      <td className="px-4 py-3.5 text-sm text-emerald-400 font-medium">₦{r.earnings.toLocaleString()}</td>
                      <td className="px-4 py-3.5 text-sm text-gold-400 font-medium">+₦{r.bonusEarned.toFixed(2)}</td>
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
                    </tr>
                  ))}
                  {filteredReferrals.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-sm text-white/40">
                        No referrals found for this filter.
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