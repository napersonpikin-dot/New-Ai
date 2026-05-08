import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '@/context/NotificationsContext';

const typeStyles: Record<string, { icon: string; bg: string; text: string }> = {
  withdrawal: { icon: 'ri-wallet-3-line', bg: 'bg-gold-500/10', text: 'text-gold-400' },
  robot: { icon: 'ri-robot-2-line', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  announcement: { icon: 'ri-megaphone-line', bg: 'bg-sky-500/10', text: 'text-sky-400' },
  system: { icon: 'ri-shield-check-line', bg: 'bg-purple-500/10', text: 'text-purple-400' },
  support: { icon: 'ri-customer-service-2-line', bg: 'bg-amber-500/10', text: 'text-amber-400' },
};

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, dismissNotification } = useNotifications();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors"
        aria-label="Notifications"
      >
        <i className="ri-notification-3-line text-lg w-5 h-5 flex items-center justify-center" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-80 sm:w-96 bg-surface-card border border-dark-700/50 rounded-xl overflow-hidden shadow-xl z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-dark-700/40">
            <h3 className="text-white font-semibold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-gold-400 hover:text-gold-500 transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-white/40">No notifications yet.</div>
            ) : (
              notifications.slice(0, 8).map((n) => {
                const style = typeStyles[n.type] || typeStyles.system;
                return (
                  <div
                    key={n.id}
                    onClick={() => { markAsRead(n.id); setOpen(false); }}
                    className={`px-4 py-3 border-b border-dark-700/30 hover:bg-dark-800/40 transition-colors cursor-pointer flex items-start gap-3 ${
                      n.read ? 'opacity-60' : ''
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full ${style.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <i className={`${style.icon} ${style.text} text-xs w-4 h-4 flex items-center justify-center`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm text-white font-medium truncate">{n.title}</h4>
                        <span className="text-[10px] text-white/30 shrink-0">{timeAgo(n.timestamp)}</span>
                      </div>
                      <p className="text-xs text-white/50 mt-0.5 line-clamp-2">{n.message}</p>
                    </div>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-gold-500 shrink-0 mt-2" />}
                  </div>
                );
              })
            )}
          </div>
          <div className="px-4 py-2.5 border-t border-dark-700/40 bg-dark-800/30">
            <div className="flex items-center justify-between">
              <Link
                to="/notifications"
                onClick={() => setOpen(false)}
                className="text-xs text-gold-400 hover:text-gold-500 transition-colors"
              >
                View all notifications
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="text-xs text-white/40 hover:text-white/60 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}