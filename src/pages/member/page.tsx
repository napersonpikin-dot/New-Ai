import { useParams, Link, useNavigate } from 'react-router-dom';
import { memberProfiles } from '@/mocks/members';
import { robots } from '@/mocks/robots';

const tierStyles: Record<string, string> = {
  Diamond: 'text-cyan-400 bg-cyan-500/10 border-cyan-400/20',
  Platinum: 'text-emerald-400 bg-emerald-500/10 border-emerald-400/20',
  Gold: 'text-gold-400 bg-gold-500/10 border-gold-400/20',
  Silver: 'text-gray-300 bg-gray-300/10 border-gray-300/20',
  Bronze: 'text-amber-600 bg-amber-600/10 border-amber-600/20',
};

export default function MemberProfilePage() {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();

  const profile = memberProfiles.find(
    (m) => m.handle.replace('@', '') === handle
  );

  if (!profile) {
    return (
      <div className="min-h-screen bg-dark-900 text-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-dark-800 flex items-center justify-center mx-auto mb-4">
            <i className="ri-error-warning-line text-gold-400 text-2xl w-6 h-6 flex items-center justify-center" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Member Not Found</h1>
          <p className="text-sm text-white/50 mb-6">
            This member profile does not exist or has been removed.
          </p>
          <Link
            to="/leaderboard"
            className="inline-flex items-center justify-center bg-gold-500 hover:bg-gold-600 text-dark-900 font-semibold px-6 py-2.5 rounded-md transition-colors text-sm"
          >
            <i className="ri-arrow-left-line w-4 h-4 flex items-center justify-center mr-1" />
            Back to Leaderboard
          </Link>
        </div>
      </div>
    );
  }

  const robotDetails = profile.robotsOwned.map((ro) => {
    const meta = robots.find((r) => r.id === ro.id);
    return { ...ro, image: meta?.image || '', dailyReturn: meta?.dailyReturn || 0, price: meta?.price || 0 };
  });

  const handleMessage = () => {
    navigate(`/community?dm=${encodeURIComponent(profile.name)}`);
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
            <Link
              to="/leaderboard"
              className="hidden sm:flex text-sm text-white/60 hover:text-white transition-colors whitespace-nowrap items-center gap-1"
            >
              <i className="ri-trophy-line w-4 h-4 flex items-center justify-center" />
              Leaderboard
            </Link>
            <Link
              to="/community"
              className="hidden sm:flex text-sm text-white/60 hover:text-white transition-colors whitespace-nowrap items-center gap-1"
            >
              <i className="ri-message-3-line w-4 h-4 flex items-center justify-center" />
              Community
            </Link>
            <Link
              to="/dashboard"
              className="hidden sm:flex text-sm text-white/60 hover:text-white transition-colors whitespace-nowrap items-center gap-1"
            >
              <i className="ri-dashboard-line w-4 h-4 flex items-center justify-center" />
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-white/40 mb-6">
            <Link to="/" className="hover:text-gold-400 transition-colors">Home</Link>
            <i className="ri-arrow-right-s-line w-3 h-3 flex items-center justify-center" />
            <Link to="/leaderboard" className="hover:text-gold-400 transition-colors">Leaderboard</Link>
            <i className="ri-arrow-right-s-line w-3 h-3 flex items-center justify-center" />
            <span className="text-white/60">{profile.name}</span>
          </div>

          {/* Profile Card */}
          <div className="bg-surface-card border border-dark-700/40 rounded-xl p-6 md:p-8 mb-8">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Avatar */}
              <div className="relative shrink-0 mx-auto md:mx-0">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gold-500/10 border-2 border-gold-400/20 flex items-center justify-center text-gold-400 text-3xl font-bold">
                  {profile.avatar}
                </div>
                {profile.online && (
                  <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-3 border-dark-900 rounded-full" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-white">{profile.name}</h1>
                  {profile.verified && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-sky-500/10 text-sky-400 border-sky-400/20">
                      <i className="ri-verified-badge-line w-3 h-3 flex items-center justify-center" />
                      Verified
                    </span>
                  )}
                  <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${tierStyles[profile.tier]}`}>
                    {profile.tier}
                  </span>
                </div>
                <div className="text-sm text-white/40 mb-3">
                  {profile.handle} &middot; {profile.country} &middot; Joined {profile.joined}
                </div>
                <p className="text-sm text-white/60 leading-relaxed max-w-xl">{profile.bio}</p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-5">
                  <button
                    onClick={handleMessage}
                    className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-dark-900 font-semibold px-5 py-2 rounded-md transition-colors text-sm"
                  >
                    <i className="ri-message-3-line w-4 h-4 flex items-center justify-center" />
                    Message
                  </button>
                  <Link
                    to="/referral"
                    className="flex items-center gap-2 bg-dark-800 hover:bg-dark-700 border border-dark-700/40 text-white/70 hover:text-white px-5 py-2 rounded-md transition-colors text-sm"
                  >
                    <i className="ri-user-add-line w-4 h-4 flex items-center justify-center" />
                    Invite
                  </Link>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3 shrink-0 min-w-[200px]">
                <div className="bg-dark-800/60 border border-dark-700/30 rounded-lg p-3 text-center">
                  <div className="text-gold-400 font-bold text-lg">₦{profile.totalEarned.toLocaleString()}</div>
                  <div className="text-[10px] text-white/40">Total Earned</div>
                </div>
                <div className="bg-dark-800/60 border border-dark-700/30 rounded-lg p-3 text-center">
                  <div className="text-emerald-400 font-bold text-lg">₦{profile.dailyAvg.toLocaleString()}</div>
                  <div className="text-[10px] text-white/40">Daily Avg</div>
                </div>
                <div className="bg-dark-800/60 border border-dark-700/30 rounded-lg p-3 text-center">
                  <div className="text-white font-bold text-lg">{profile.robotsOwned.length}</div>
                  <div className="text-[10px] text-white/40">Robots</div>
                </div>
                <div className="bg-dark-800/60 border border-dark-700/30 rounded-lg p-3 text-center">
                  <div className="text-white font-bold text-lg">{profile.referrals}</div>
                  <div className="text-[10px] text-white/40">Referrals</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            {[
              { label: 'Total Earned', value: `₦${profile.totalEarned.toLocaleString()}`, color: 'text-gold-400' },
              { label: 'Daily Average', value: `₦${profile.dailyAvg.toLocaleString()}`, color: 'text-emerald-400' },
              { label: 'Robots Owned', value: String(profile.robotsOwned.length), color: 'text-white' },
              { label: 'ROI %', value: `${profile.roi}%`, color: 'text-sky-400' },
              { label: 'Referral Bonus', value: `₦${profile.referralBonus.toLocaleString()}`, color: 'text-amber-400' },
              { label: 'Streak', value: `${profile.streak} days`, color: 'text-orange-400' },
            ].map((s) => (
              <div key={s.label} className="bg-surface-card border border-dark-700/40 rounded-xl p-4 text-center">
                <div className={`font-bold text-lg ${s.color}`}>{s.value}</div>
                <div className="text-[10px] text-white/40 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Robots Owned */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-white font-semibold text-lg">Robot Fleet</h3>
                <p className="text-xs text-white/40 mt-0.5">{profile.robotsOwned.length} robots actively earning</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {robotDetails.map((ro) => (
                <div key={ro.id} className="bg-surface-card border border-dark-700/40 rounded-xl overflow-hidden hover:border-gold-400/20 transition-all group">
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={ro.image}
                      alt={ro.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-2 left-2">
                      <span className="text-[10px] bg-dark-800/80 text-white/70 px-2 py-0.5 rounded-full border border-white/10">
                        {ro.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-semibold text-sm">{ro.name}</h4>
                      <div className="text-gold-400 text-xs font-medium">+₦{ro.dailyReturn.toLocaleString()}/day</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-dark-900/60 rounded-md px-2 py-1.5">
                        <div className="text-[10px] text-white/40">Purchased</div>
                        <div className="text-xs text-white">{ro.purchased}</div>
                      </div>
                      <div className="bg-dark-900/60 rounded-md px-2 py-1.5">
                        <div className="text-[10px] text-white/40">Earned</div>
                        <div className="text-xs text-gold-400 font-medium">₦{ro.earned.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 bg-dark-700/40 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full bg-gold-500 rounded-full"
                          style={{ width: `${Math.min((ro.earned / (ro.price * 4)) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-white/40">ROI</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Summary */}
          <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5 md:p-6">
            <h3 className="text-white font-semibold text-base mb-4">Activity Summary</h3>
            <div className="flex flex-col gap-3">
              {[
                { icon: 'ri-robot-2-line', color: 'text-gold-400', title: `Purchased ${profile.robotsOwned[0]?.name || 'first robot'}`, time: profile.robotsOwned[0]?.purchased || profile.joined },
                { icon: 'ri-coins-line', color: 'text-emerald-400', title: `Crossed ₦${Math.round(profile.totalEarned * 0.5).toLocaleString()} in total earnings`, time: '3 months ago' },
                { icon: 'ri-user-add-line', color: 'text-amber-400', title: `Reached ${profile.tier} tier with ${profile.referrals} referrals`, time: '2 months ago' },
                { icon: 'ri-fire-line', color: 'text-orange-400', title: `Hit ${profile.streak}-day earning streak`, time: 'Active now' },
              ].map((a, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-dark-700/30 last:border-0">
                  <div className="w-8 h-8 rounded-full bg-dark-800 border border-dark-700/40 flex items-center justify-center shrink-0">
                    <i className={`${a.icon} ${a.color} text-xs w-4 h-4 flex items-center justify-center`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white font-medium">{a.title}</div>
                  </div>
                  <div className="text-[10px] text-white/30 shrink-0">{a.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}