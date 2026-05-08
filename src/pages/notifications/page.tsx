import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications, type NotificationType } from '@/context/NotificationsContext';

const typeStyles: Record<NotificationType, { icon: string; bg: string; text: string }> = {
  withdrawal: { icon: 'ri-wallet-3-line', bg: 'bg-gold-500/10', text: 'text-gold-400' },
  robot: { icon: 'ri-robot-2-line', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  announcement: { icon: 'ri-megaphone-line', bg: 'bg-sky-500/10', text: 'text-sky-400' },
  system: { icon: 'ri-shield-check-line', bg: 'bg-amber-500/10', text: 'text-amber-400' },
  support: { icon: 'ri-customer-service-2-line', bg: 'bg-purple-500/10', text: 'text-purple-400' },
};

const filterOptions: { key: 'all' | NotificationType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'withdrawal', label: 'Withdrawals' },
  { key: 'robot', label: 'Robots' },
  { key: 'announcement', label: 'Announcements' },
  { key: 'system', label: 'System' },
  { key: 'support', label: 'Support' },
];

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
}

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, dismissNotification, unreadCount } = useNotifications();
  const [filter, setFilter] = useState<'all' | NotificationType>('all');
  const [search, setSearch] = useState('');

  const filtered = notifications.filter((n) => {
    const matchesType = filter === 'all' || n.type === filter;
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.message.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

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
              to="/dashboard"
              className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1 whitespace-nowrap"
            >
              <i className="ri-dashboard-line w-4 h-4 flex items-center justify-center" />
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Notifications</h1>
              <p className="text-sm text-white/50">
                {unreadCount > 0 ? (
                  <span className="text-gold-400">{unreadCount} unread</span>
                ) : (
                  'All caught up'
                )}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="bg-dark-800 hover:bg-dark-700 border border-dark-700/40 text-white/70 hover:text-white text-xs px-4 py-2 rounded-md transition-colors whitespace-nowrap"
              >
                Mark All as Read
              </button>
            )}
          </div>

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-xs w-4 h-4 flex items-center justify-center" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notifications..."
                className="w-full bg-dark-800 border border-dark-700/50 rounded-md pl-9 pr-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors"
              />
            </div>
            <div className="flex items-center gap-1 bg-dark-800/60 border border-dark-700/40 rounded-lg p-0.5 overflow-x-auto">
              {filterOptions.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-3 py-1.5 text-xs rounded-md transition-all whitespace-nowrap ${
                    filter === f.key
                      ? 'bg-gold-500 text-dark-900 font-semibold'
                      : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notification List */}
          <div className="bg-surface-card border border-dark-700/40 rounded-xl overflow-hidden">
            {filtered.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="w-12 h-12 rounded-full bg-dark-800 flex items-center justify-center mx-auto mb-3">
                  <i className="ri-notification-off-line text-white/30 text-xl w-6 h-6 flex items-center justify-center" />
                </div>
                <p className="text-sm text-white/50">
                  {search || filter !== 'all'
                    ? 'No notifications match your filter.'
                    : 'No notifications yet.'}
                </p>
              </div>
            ) : (
              <div className="flex flex-col">
                {filtered.map((n, idx) => {
                  const style = typeStyles[n.type] || typeStyles.system;
                  return (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`flex items-start gap-4 px-5 py-4 border-b border-dark-700/30 hover:bg-dark-800/30 transition-colors cursor-pointer ${
                        n.read ? 'opacity-60' : ''
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full ${style.bg} flex items-center justify-center shrink-0 mt-0.5`}
                      >
                        <i className={`${style.icon} ${style.text} text-sm w-5 h-5 flex items-center justify-center`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm text-white font-medium">{n.title}</h4>
                          <span className="text-[10px] text-white/30 shrink-0">{timeAgo(n.timestamp)}</span>
                        </div>
                        <p className="text-xs text-white/50 mt-1 leading-relaxed">{n.message}</p>
                        {n.actionUrl && (
                          <Link
                            to={n.actionUrl}
                            className="inline-flex items-center gap-1 text-xs text-gold-400 hover:text-gold-500 mt-2 transition-colors"
                          >
                            View details
                            <i className="ri-arrow-right-line w-3 h-3 flex items-center justify-center" />
                          </Link>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        {!n.read && <span className="w-2 h-2 rounded-full bg-gold-500 mt-2" />}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissNotification(n.id);
                          }}
                          className="w-6 h-6 flex items-center justify-center text-white/20 hover:text-red-400 transition-colors"
                          title="Dismiss"
                        >
                          <i className="ri-close-line w-4 h-4 flex items-center justify-center" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
