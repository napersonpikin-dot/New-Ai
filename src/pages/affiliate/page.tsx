import { useState } from 'react';
import { Link } from 'react-router-dom';
import { affiliateData, marketingAssets, affiliatePayoutHistory, affiliateReferrals } from '@/mocks/affiliate';

export default function AffiliatePage() {
  const [copied, setCopied] = useState(false);
  const [assetFilter, setAssetFilter] = useState<'all' | 'Banner' | 'Social' | 'Email' | 'Video'>('all');
  const [referralSearch, setReferralSearch] = useState('');
  const [referralStatus, setReferralStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('usdt');

  const handleCopy = () => {
    navigator.clipboard.writeText(affiliateData.affiliateLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredAssets = marketingAssets.filter(
    (a) => assetFilter === 'all' || a.type === assetFilter
  );

  const filteredReferrals = affiliateReferrals.filter((r) => {
    if (referralStatus === 'active' && r.status !== 'active') return false;
    if (referralStatus === 'inactive' && r.status !== 'inactive') return false;
    if (referralSearch && !r.name.toLowerCase().includes(referralSearch.toLowerCase())) return false;
    return true;
  });

  const handlePayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPayoutModal(false);
    setPayoutAmount('');
  };

  const currentTier = affiliateData.customPayouts.find((t) => t.tier === affiliateData.status.split(' ')[0]) || affiliateData.customPayouts[4];
  const nextTierIdx = affiliateData.customPayouts.findIndex((t) => t.tier === currentTier.tier) + 1;
  const nextTier = affiliateData.customPayouts[nextTierIdx];

  const tierColor: Record<string, string> = {
    Bronze: 'text-amber-600 border-amber-600/20 bg-amber-600/10',
    Silver: 'text-gray-300 border-gray-300/20 bg-gray-300/10',
    Gold: 'text-gold-400 border-gold-400/20 bg-gold-500/10',
    Platinum: 'text-emerald-400 border-emerald-400/20 bg-emerald-500/10',
    Diamond: 'text-cyan-400 border-cyan-400/20 bg-cyan-500/10',
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
            <Link to="/dashboard" className="hidden sm:flex text-sm text-white/60 hover:text-white transition-colors items-center gap-1 whitespace-nowrap">
              <i className="ri-dashboard-line w-4 h-4 flex items-center justify-center" /> Dashboard
            </Link>
            <Link to="/referral" className="hidden sm:flex text-sm text-white/60 hover:text-white transition-colors items-center gap-1 whitespace-nowrap">
              <i className="ri-share-line w-4 h-4 flex items-center justify-center" /> Referral
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
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${tierColor[affiliateData.status.split(' ')[0]] || 'text-white/40'}`}>
                {affiliateData.status}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Affiliate Partner Hub</h1>
            <p className="text-sm text-white/50">Exclusive tools, assets, and payouts for power referrers.</p>
          </div>

          {/* Affiliate Link Card */}
          <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5 md:p-8 mb-6">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center mx-auto mb-3">
                <i className="ri-link-unlink-m text-cyan-400 text-xl w-6 h-6 flex items-center justify-center" />
              </div>
              <h2 className="text-white font-semibold text-lg mb-1">Your Affiliate Link</h2>
              <p className="text-sm text-white/40">Track every click, signup, and commission in real time</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-6">
              <div className="flex-1 bg-dark-800 border border-dark-700/50 rounded-lg px-4 py-3 text-sm text-white/70 font-mono truncate">
                {affiliateData.affiliateLink}
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-dark-800/60 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-white">{affiliateData.lifetimeClicks.toLocaleString()}</div>
                <div className="text-[10px] text-white/40 mt-0.5">Lifetime Clicks</div>
              </div>
              <div className="bg-dark-800/60 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-gold-400">{affiliateData.conversionRate}%</div>
                <div className="text-[10px] text-white/40 mt-0.5">Conversion Rate</div>
              </div>
              <div className="bg-dark-800/60 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-emerald-400">{affiliateData.signupsThisMonth}</div>
                <div className="text-[10px] text-white/40 mt-0.5">Signups This Month</div>
              </div>
              <div className="bg-dark-800/60 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-cyan-400">{affiliateData.activePartners}</div>
                <div className="text-[10px] text-white/40 mt-0.5">Active Partners</div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5">
              <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Total Referred</div>
              <div className="text-2xl font-bold text-white">{affiliateData.totalReferred}</div>
              <div className="text-xs text-emerald-400 mt-1">+12 this month</div>
            </div>
            <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5">
              <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Total Commission</div>
              <div className="text-2xl font-bold text-gold-400">₦{affiliateData.totalCommission.toLocaleString()}</div>
              <div className="text-xs text-white/40 mt-1">Lifetime commissions</div>
            </div>
            <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5">
              <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Pending Commission</div>
              <div className="text-2xl font-bold text-white">₦{affiliateData.pendingCommission.toLocaleString()}</div>
              <div className="text-xs text-white/40 mt-1">Available for payout</div>
            </div>
            <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5">
              <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Payout Rate</div>
              <div className="text-2xl font-bold text-cyan-400">{currentTier.rate}%</div>
              <div className="text-xs text-emerald-400 mt-1">{affiliateData.status.split(' ')[0]} tier</div>
            </div>
          </div>

          {/* Custom Payout Tiers */}
          <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5 md:p-6 mb-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-white font-semibold text-base">Partner Payout Tiers</h3>
                <p className="text-xs text-white/40 mt-0.5">Commission rates increase as you grow your partner network</p>
              </div>
              {nextTier && (
                <div className="text-xs text-cyan-400 hidden sm:block">
                  {affiliateData.totalReferred} / {nextTier.threshold} to {nextTier.tier}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {affiliateData.customPayouts.map((tier) => {
                const isCurrent = tier.tier === affiliateData.status.split(' ')[0];
                const unlocked = affiliateData.totalReferred >= tier.threshold;
                return (
                  <div
                    key={tier.tier}
                    className={`relative rounded-lg border p-4 transition-all ${
                      isCurrent
                        ? `${tierColor[tier.tier]} ring-1 ring-gold-400/20`
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
                    <div className={`text-sm font-bold mb-1 ${unlocked ? tierColor[tier.tier].split(' ')[0] : 'text-white/40'}`}>{tier.tier}</div>
                    <div className="text-2xl font-bold text-white mb-2">{tier.rate}%</div>
                    <div className="text-[10px] text-white/40 mb-2">{tier.threshold}+ referred</div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-white/40">Volume Bonus</span>
                        <span className="text-gold-400 font-medium">+{tier.volumeBonus}%</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-white/40">Fast Payout</span>
                        <span className={tier.fastPayout ? 'text-emerald-400' : 'text-white/20'}>
                          {tier.fastPayout ? 'Enabled' : '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Marketing Assets */}
          <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5 md:p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-white font-semibold text-base">Marketing Assets</h3>
                <p className="text-xs text-white/40 mt-0.5">Pre-made creatives with your affiliate link embedded</p>
              </div>
              <div className="flex bg-dark-800/60 border border-dark-700/40 rounded-lg p-0.5">
                {(['all', 'Banner', 'Social', 'Email', 'Video'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setAssetFilter(f)}
                    className={`px-3 py-1.5 text-xs rounded-md transition-all whitespace-nowrap ${
                      assetFilter === f ? 'bg-gold-500 text-dark-900 font-semibold' : 'text-white/50'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAssets.map((asset) => (
                <div key={asset.id} className="bg-dark-800/60 border border-dark-700/40 rounded-xl overflow-hidden hover:border-gold-400/20 transition-all group">
                  <div className="relative h-32 overflow-hidden bg-dark-900">
                    <img
                      src={asset.url}
                      alt={asset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 text-[10px] bg-dark-900/80 text-white/70 px-2 py-0.5 rounded-full border border-dark-700/40">
                      {asset.type}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-white font-semibold text-sm mb-1">{asset.name}</div>
                    <div className="text-[10px] text-white/40 mb-3">{asset.size}</div>
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="text-white/40">{asset.clicks.toLocaleString()} clicks</span>
                      <span className="text-gold-400 font-medium">{asset.conversions} conv</span>
                    </div>
                    <button
                      onClick={handleCopy}
                      className="w-full flex items-center justify-center gap-1.5 bg-dark-700/40 hover:bg-dark-700/60 border border-dark-700/40 rounded-md py-2 text-xs text-white/60 hover:text-white transition-colors"
                    >
                      <i className="ri-download-line w-3.5 h-3.5 flex items-center justify-center" />
                      Download Asset
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Referrals Table + Payout History */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Referrals */}
            <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <h3 className="text-white font-semibold text-base">Partner Referrals</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={referralSearch}
                    onChange={(e) => setReferralSearch(e.target.value)}
                    placeholder="Search..."
                    className="bg-dark-800 border border-dark-700/50 rounded-md px-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors w-36"
                  />
                  <select
                    value={referralStatus}
                    onChange={(e) => setReferralStatus(e.target.value as any)}
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
                      <th className="px-3 py-2.5 text-[10px] text-white/40 font-medium uppercase">Member</th>
                      <th className="px-3 py-2.5 text-[10px] text-white/40 font-medium uppercase">Spent</th>
                      <th className="px-3 py-2.5 text-[10px] text-white/40 font-medium uppercase">Commission</th>
                      <th className="px-3 py-2.5 text-[10px] text-white/40 font-medium uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReferrals.map((r) => (
                      <tr key={r.id} className="border-b border-dark-700/30 hover:bg-dark-800/30 transition-colors">
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400 text-[10px] font-bold shrink-0">
                              {r.name.charAt(0)}
                            </div>
                            <div>
                              <div className="text-sm text-white font-medium">{r.name}</div>
                              <div className="text-[10px] text-white/40">{r.country}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-sm text-white/60">₦{r.spent.toLocaleString()}</td>
                        <td className="px-3 py-3 text-sm text-gold-400 font-medium">₦{r.commission.toLocaleString()}</td>
                        <td className="px-3 py-3">
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
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payout History */}
            <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5 md:p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-semibold text-base">Payout History</h3>
                <button
                  onClick={() => setShowPayoutModal(true)}
                  className="bg-gold-500 hover:bg-gold-600 text-dark-900 font-semibold px-3 py-1.5 rounded-md text-xs whitespace-nowrap"
                >
                  Request Payout
                </button>
              </div>
              <div className="flex flex-col gap-3 max-h-[360px] overflow-y-auto pr-1">
                {affiliatePayoutHistory.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 bg-dark-800/40 rounded-lg p-3 border border-dark-700/30">
                    <div className="w-9 h-9 rounded-full bg-gold-500/10 flex items-center justify-center shrink-0">
                      <i className="ri-wallet-3-line text-gold-400 text-xs w-4 h-4 flex items-center justify-center" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white font-medium">₦{p.amount.toLocaleString()}</div>
                      <div className="text-[10px] text-white/40">{p.method} &middot; {p.date}</div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-400/20">
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payout Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPayoutModal(false)} />
          <div className="relative bg-surface-card border border-dark-700/50 rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-white font-semibold text-lg mb-4">Request Payout</h3>
            <form onSubmit={handlePayoutSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Amount (₦)</label>
                <input
                  type="number"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  placeholder="Min ₦500"
                  min="500"
                  className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors"
                />
                <p className="text-[10px] text-white/30 mt-1">Available: ₦{affiliateData.pendingCommission.toLocaleString()} | Min: ₦500</p>
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Payout Method</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'usdt', label: 'USDT (TRC20)', icon: 'ri-coin-line' },
                    { key: 'bank', label: 'Bank Wire', icon: 'ri-bank-card-line' },
                    { key: 'wise', label: 'Wise Transfer', icon: 'ri-safe-line' },
                  ].map((m) => (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setPayoutMethod(m.key)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md border text-xs transition-all whitespace-nowrap ${
                        payoutMethod === m.key
                          ? 'bg-gold-500/10 border-gold-400/30 text-gold-400'
                          : 'bg-dark-800 border-dark-700/40 text-white/50 hover:text-white/70'
                      }`}
                    >
                      <i className={`${m.icon} w-3.5 h-3.5 flex items-center justify-center`} />
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-gold-500 hover:bg-gold-600 text-dark-900 font-semibold py-2.5 rounded-md transition-colors text-sm"
              >
                Submit Payout Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}