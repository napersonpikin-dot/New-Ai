import { useState, useEffect } from 'react';

interface Toast {
  id: number;
  type: 'purchase' | 'milestone' | 'deployment' | 'withdrawal' | 'referral';
  user: string;
  detail: string;
  time: string;
}

const eventTypeConfig: Record<string, { icon: string; color: string; border: string; bg: string }> = {
  purchase: { icon: 'ri-shopping-cart-line', color: 'text-gold-400', border: 'border-gold-400/20', bg: 'bg-gold-500/5' },
  milestone: { icon: 'ri-trophy-line', color: 'text-cyan-400', border: 'border-cyan-400/20', bg: 'bg-cyan-500/5' },
  deployment: { icon: 'ri-rocket-line', color: 'text-emerald-400', border: 'border-emerald-400/20', bg: 'bg-emerald-500/5' },
  withdrawal: { icon: 'ri-wallet-3-line', color: 'text-sky-400', border: 'border-sky-400/20', bg: 'bg-sky-500/5' },
  referral: { icon: 'ri-user-add-line', color: 'text-amber-400', border: 'border-amber-400/20', bg: 'bg-amber-500/5' },
};

const sampleEvents = [
  { type: 'purchase' as const, user: 'Elena R.', detail: 'Purchased AlphaBot Pro for ₦10,000' },
  { type: 'milestone' as const, user: 'Alex Mercer', detail: 'Hit ₦50,000 total earnings' },
  { type: 'deployment' as const, user: 'Nina Petrova', detail: 'Deployed YieldMaster X' },
  { type: 'withdrawal' as const, user: 'David Chen', detail: 'Withdrew ₦1,250 via USDT' },
  { type: 'referral' as const, user: 'Sarah Lee', detail: 'Referred Amara Okafor — ₦72 bonus' },
  { type: 'purchase' as const, user: 'James Kim', detail: 'Purchased CryptoMiner AI for ₦50,000' },
  { type: 'milestone' as const, user: 'Kenji Tanaka', detail: '30-day earning streak unlocked' },
  { type: 'withdrawal' as const, user: 'Carlos Mendez', detail: 'Withdrew ₦340 via Bank Transfer' },
  { type: 'referral' as const, user: 'Michael Turner', detail: 'Referred David R. — ₦35 bonus' },
  { type: 'purchase' as const, user: 'Maria Gonzalez', detail: 'Purchased ArbitrageBot Elite for ₦799' },
];

export default function ActivityToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    // Show first toast after 4 seconds
    const firstTimeout = setTimeout(() => {
      const evt = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
      const toast: Toast = {
        id: Date.now(),
        type: evt.type,
        user: evt.user,
        detail: evt.detail,
        time: 'Just now',
      };
      setToasts((prev) => [toast, ...prev.slice(0, 2)]);
    }, 4000);

    // Then every 12-18 seconds
    const interval = setInterval(() => {
      const evt = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
      const toast: Toast = {
        id: Date.now(),
        type: evt.type,
        user: evt.user,
        detail: evt.detail,
        time: 'Just now',
      };
      setToasts((prev) => [toast, ...prev.slice(0, 2)]);
    }, 14000);

    return () => {
      clearTimeout(firstTimeout);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      setToasts((prev) => prev.slice(0, -1));
    }, 4000);
    return () => clearTimeout(timer);
  }, [toasts]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 max-w-xs w-full pointer-events-none">
      {toasts.map((toast) => {
        const cfg = eventTypeConfig[toast.type];
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto ${cfg.bg} border ${cfg.border} rounded-lg p-3 flex items-start gap-2.5 animate-in slide-in-from-right fade-in duration-300`}
          >
            <div className={`w-8 h-8 rounded-full ${cfg.bg} flex items-center justify-center shrink-0 border ${cfg.border}`}>
              <i className={`${cfg.icon} ${cfg.color} text-xs w-4 h-4 flex items-center justify-center`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-white font-medium truncate">{toast.user}</div>
              <div className="text-[11px] text-white/60 truncate">{toast.detail}</div>
              <div className="text-[10px] text-white/30 mt-0.5">{toast.time}</div>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="w-5 h-5 flex items-center justify-center text-white/20 hover:text-white/50 transition-colors shrink-0"
            >
              <i className="ri-close-line w-3 h-3 flex items-center justify-center" />
            </button>
          </div>
        );
      })}
    </div>
  );
}