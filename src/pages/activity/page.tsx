import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { activityFeedEvents, liveStats } from '@/mocks/activity';

const eventTypeConfig: Record<string, { icon: string; color: string; bg: string; label: string }> = {
  purchase: { icon: 'ri-shopping-cart-line', color: 'text-gold-400', bg: 'bg-gold-500/10', label: 'Robot Purchase' },
  milestone: { icon: 'ri-trophy-line', color: 'text-cyan-400', bg: 'bg-cyan-500/10', label: 'Milestone' },
  deployment: { icon: 'ri-rocket-line', color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Robot Deployed' },
  withdrawal: { icon: 'ri-wallet-3-line', color: 'text-sky-400', bg: 'bg-sky-500/10', label: 'Withdrawal' },
  referral: { icon: 'ri-user-add-line', color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Referral' },
};

export default function ActivityFeedPage() {
  const [feed, setFeed] = useState(activityFeedEvents);
  const [onlineCount, setOnlineCount] = useState(liveStats.onlineUsers);
  const [deployedCount, setDeployedCount] = useState(liveStats.robotsDeployedToday);
  const [earnings24h, setEarnings24h] = useState(liveStats.totalEarnings24h);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Live simulation — animate counters and occasionally simulate new events
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount((prev) => prev + Math.floor(Math.random() * 7) - 3);
      setDeployedCount((prev) => prev + Math.floor(Math.random() * 3));
      setEarnings24h((prev) => prev + Math.floor(Math.random() * 120));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Simulate a new random event every 8 seconds
  useEffect(() => {
    const sampleEvents = [
      { type: 'purchase', user: 'Maria G.', userHandle: '@maria_g', avatar: 'M', country: 'Mexico', robot: 'AlphaBot Pro', amount: 10000, time: 'Just now' },
      { type: 'milestone', user: 'Tom B.', userHandle: '@tom_b', avatar: 'T', country: 'Australia', milestone: 'First ₦10,000 earned', time: 'Just now' },
      { type: 'deployment', user: 'Ryan O\'Brien', userHandle: '@ryan_o', avatar: 'R', country: 'Ireland', robot: 'YieldMaster X', fleetSize: 4, time: 'Just now' },
      { type: 'withdrawal', user: 'Sophie D.', userHandle: '@sophie_d', avatar: 'S', country: 'France', amount: 560, method: 'USDT', time: 'Just now' },
      { type: 'referral', user: 'Ethan B.', userHandle: '@ethan_b', avatar: 'E', country: 'Netherlands', referredUser: 'Mia T.', bonusAmount: 45, time: 'Just now' },
    ];
    const interval = setInterval(() => {
      const evt = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
      const newEvent = { ...evt, id: Date.now(), timestamp: new Date().toISOString() } as any;
      setFeed((prev) => [newEvent, ...prev.slice(0, 24)]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [feed]);

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
            <Link to="/dashboard" className="hidden sm:flex text-sm text-white/60 hover:text-white transition-colors items-center gap-1 whitespace-nowrap">
              <i className="ri-dashboard-line w-4 h-4 flex items-center justify-center" /> Dashboard
            </Link>
            <Link to="/community" className="hidden sm:flex text-sm text-white/60 hover:text-white transition-colors items-center gap-1 whitespace-nowrap">
              <i className="ri-message-3-line w-4 h-4 flex items-center justify-center" /> Chat
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
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs text-emerald-400 font-medium">Live Feed</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Community Activity</h1>
            <p className="text-sm text-white/50">Real-time events from earners around the world.</p>
          </div>

          {/* Live Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <div className="bg-surface-card border border-dark-700/40 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                <i className="ri-user-3-line text-emerald-400 text-sm w-5 h-5 flex items-center justify-center" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">{onlineCount.toLocaleString()}</div>
                <div className="text-[10px] text-white/40">Online Now</div>
              </div>
            </div>
            <div className="bg-surface-card border border-dark-700/40 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center shrink-0">
                <i className="ri-robot-2-line text-gold-400 text-sm w-5 h-5 flex items-center justify-center" />
              </div>
              <div>
                <div className="text-lg font-bold text-gold-400">{deployedCount.toLocaleString()}</div>
                <div className="text-[10px] text-white/40">Robots Deployed Today</div>
              </div>
            </div>
            <div className="bg-surface-card border border-dark-700/40 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-sky-500/10 flex items-center justify-center shrink-0">
                <i className="ri-coins-line text-sky-400 text-sm w-5 h-5 flex items-center justify-center" />
              </div>
              <div>
                <div className="text-lg font-bold text-sky-400">₦{earnings24h.toLocaleString()}</div>
                <div className="text-[10px] text-white/40">Earnings (24h)</div>
              </div>
            </div>
            <div className="bg-surface-card border border-dark-700/40 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                <i className="ri-shopping-bag-3-line text-amber-400 text-sm w-5 h-5 flex items-center justify-center" />
              </div>
              <div>
                <div className="text-lg font-bold text-amber-400">{liveStats.newPurchasesToday}</div>
                <div className="text-[10px] text-white/40">New Purchases Today</div>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-surface-card border border-dark-700/40 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-dark-700/40 flex items-center justify-between">
              <h3 className="text-white font-semibold text-base">Recent Activity</h3>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[10px] text-emerald-400">Live</span>
              </div>
            </div>
            <div ref={scrollRef} className="max-h-[640px] overflow-y-auto">
              <div className="flex flex-col">
                {feed.map((event) => {
                  const cfg = eventTypeConfig[event.type] || eventTypeConfig.purchase;
                  return (
                    <div
                      key={event.id}
                      className="flex items-start gap-4 px-5 py-4 border-b border-dark-700/30 hover:bg-dark-800/20 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-full ${cfg.bg} flex items-center justify-center shrink-0`}>
                        <i className={`${cfg.icon} ${cfg.color} text-sm w-5 h-5 flex items-center justify-center`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-semibold text-white">{event.user}</span>
                          <span className="text-[10px] text-white/30">{event.userHandle}</span>
                          <span className="text-[10px] text-white/20">&middot; {event.country}</span>
                        </div>
                        <div className="text-sm text-white/70 mb-1">
                          {event.type === 'purchase' && (
                            <>Purchased <span className="text-gold-400 font-medium">{event.robot}</span> for ₦{event.amount}</>
                          )}
                          {event.type === 'milestone' && (
                            <>Reached milestone: <span className="text-cyan-400 font-medium">{event.milestone}</span></>
                          )}
                          {event.type === 'deployment' && (
                            <>Deployed <span className="text-emerald-400 font-medium">{event.robot}</span> — fleet now {event.fleetSize} robots</>
                          )}
                          {event.type === 'withdrawal' && (
                            <>Withdrew <span className="text-sky-400 font-medium">₦{event.amount}</span> via {event.method}</>
                          )}
                          {event.type === 'referral' && (
                            <>Referred <span className="text-amber-400 font-medium">{event.referredUser}</span> — earned ₦{event.bonusAmount} bonus</>
                          )}
                        </div>
                        <div className="text-[10px] text-white/30">{event.time}</div>
                      </div>
                      <div className="hidden sm:block shrink-0">
                        <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color} border-current`}>
                          {cfg.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-8 text-center">
            <p className="text-sm text-white/40 mb-3">Want to join the conversation?</p>
            <Link
              to="/community"
              className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-dark-900 font-semibold px-6 py-2.5 rounded-md transition-colors text-sm"
            >
              <i className="ri-message-3-line w-4 h-4 flex items-center justify-center" />
              Join Community Chat
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}