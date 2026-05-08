import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

interface OrderItem {
  id: number;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  final_price: number | null;
  subtotal: number | null;
  created_at: string;
}

interface Order {
  id: number;
  status: string | null;
  currency: string;
  subtotal_items: number | null;
  shipping_total: number | null;
  tax_total: number | null;
  discount_price: number | null;
  created_at: string;
  order_items: OrderItem[];
}

const statusConfig: Record<string, { label: string; classes: string; icon: string }> = {
  pending_payment: {
    label: 'Pending Payment',
    classes: 'bg-amber-500/10 text-amber-400 border border-amber-400/20',
    icon: 'ri-time-line',
  },
  paid: {
    label: 'Paid',
    classes: 'bg-emerald-500/10 text-emerald-400 border border-emerald-400/20',
    icon: 'ri-check-line',
  },
  processing: {
    label: 'Processing',
    classes: 'bg-sky-500/10 text-sky-400 border border-sky-400/20',
    icon: 'ri-loader-4-line',
  },
  shipped: {
    label: 'Shipped',
    classes: 'bg-violet-500/10 text-violet-400 border border-violet-400/20',
    icon: 'ri-truck-line',
  },
  delivered: {
    label: 'Delivered',
    classes: 'bg-emerald-500/10 text-emerald-400 border border-emerald-400/20',
    icon: 'ri-archive-line',
  },
  cancelled: {
    label: 'Cancelled',
    classes: 'bg-red-500/10 text-red-400 border border-red-400/20',
    icon: 'ri-close-circle-line',
  },
  refunded: {
    label: 'Refunded',
    classes: 'bg-white/5 text-white/40 border border-white/10',
    icon: 'ri-arrow-go-back-line',
  },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatMoney(amount: number | null, currency: string) {
  if (amount == null) return '—';
  return `${currency === 'USD' ? '$' : '₦'}${Number(amount).toLocaleString()}`;
}

export default function MyOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount-high' | 'amount-low'>('newest');

  useEffect(() => {
    async function loadOrders() {
      if (!supabase) { setLoading(false); return; }
      setLoading(true);
      const uid = user?.id ?? 'demo-user-001';
      const { data, error } = await supabase
        .from('order_headers')
        .select('*, order_items(*)')
        .eq('customer_id', uid)
        .order('created_at', { ascending: false });
      if (!error && data) {
        setOrders(data as Order[]);
      }
      setLoading(false);
    }
    loadOrders();
  }, [user?.id]);

  const filtered = orders
    .filter((o) => {
      const matchesSearch =
        o.order_items?.some((item) =>
          item.product_name.toLowerCase().includes(search.toLowerCase())
        ) ||
        String(o.id).includes(search);
      const matchesStatus = filterStatus === 'all' ? true : o.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      const aTotal = Number(a.subtotal_items || 0);
      const bTotal = Number(b.subtotal_items || 0);
      if (sortBy === 'amount-high') return bTotal - aTotal;
      if (sortBy === 'amount-low') return aTotal - bTotal;
      return 0;
    });

  const totalSpent = orders.reduce((sum, o) => sum + Number(o.subtotal_items || 0), 0);
  const totalItems = orders.reduce((sum, o) => sum + (o.order_items?.length || 0), 0);

  const allStatuses = Array.from(
    new Set(orders.map((o) => o.status).filter(Boolean))
  ) as string[];

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
        <div className="max-w-6xl mx-auto">
          {/* Title + Stats */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">My Orders</h1>
              <p className="text-sm text-white/50">Your complete purchase history</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-surface-card border border-dark-700/40 rounded-lg px-4 py-2 text-center">
                <div className="text-xs text-white/40">Orders</div>
                <div className="text-sm font-bold text-white">{orders.length}</div>
              </div>
              <div className="bg-surface-card border border-dark-700/40 rounded-lg px-4 py-2 text-center">
                <div className="text-xs text-white/40">Items</div>
                <div className="text-sm font-bold text-gold-400">{totalItems}</div>
              </div>
              <div className="bg-surface-card border border-dark-700/40 rounded-lg px-4 py-2 text-center">
                <div className="text-xs text-white/40">Total Spent</div>
                <div className="text-sm font-bold text-emerald-400">₦{totalSpent.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-xs w-4 h-4 flex items-center justify-center" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search orders by product name or order ID..."
                className="w-full bg-dark-800 border border-dark-700/50 rounded-md pl-9 pr-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-400/50 transition-colors"
            >
              <option value="all">All Status</option>
              {allStatuses.map((s) => (
                <option key={s} value={s}>
                  {statusConfig[s]?.label || s}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-400/50 transition-colors"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount-high">Amount: High to Low</option>
              <option value="amount-low">Amount: Low to High</option>
            </select>
          </div>

          {/* Orders List */}
          <div className="flex flex-col gap-4">
            {loading ? (
              <div className="bg-surface-card border border-dark-700/40 rounded-xl p-8 text-center text-sm text-white/40">
                Loading your orders...
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-surface-card border border-dark-700/40 rounded-xl p-8 text-center">
                <div className="w-14 h-14 rounded-full bg-dark-800 flex items-center justify-center mx-auto mb-3">
                  <i className="ri-shopping-bag-3-line text-white/30 text-xl w-7 h-7 flex items-center justify-center" />
                </div>
                <p className="text-sm text-white/40 mb-2">
                  {orders.length === 0
                    ? 'You have not placed any orders yet.'
                    : 'No orders match your filters.'}
                </p>
                {orders.length === 0 && (
                  <a
                    href="https://wa.me/2348145375816"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-gold-500 hover:bg-gold-600 text-dark-900 font-semibold px-5 py-2 rounded-md transition-colors text-sm mt-2"
                  >
                    <i className="ri-whatsapp-line w-4 h-4 flex items-center justify-center mr-1.5" />
                    Activate AI on WhatsApp
                  </a>
                )}
              </div>
            ) : (
              filtered.map((order) => {
                const cfg = statusConfig[order.status || ''] || {
                  label: order.status || 'Unknown',
                  classes: 'bg-white/5 text-white/40 border border-white/10',
                  icon: 'ri-question-line',
                };
                return (
                  <div
                    key={order.id}
                    className="bg-surface-card border border-dark-700/40 rounded-xl overflow-hidden hover:border-dark-700/60 transition-colors"
                  >
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-dark-700/30 bg-dark-800/30">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="text-xs text-white/30">Order #{order.id}</div>
                          <div className="text-xs text-white/50">{formatDate(order.created_at)}</div>
                        </div>
                        <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${cfg.classes}`}>
                          <i className={`${cfg.icon} w-3 h-3 flex items-center justify-center`} />
                          {cfg.label}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-white">
                          {formatMoney(order.subtotal_items, order.currency)}
                        </div>
                        <div className="text-[10px] text-white/30">{order.currency}</div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="px-5 py-4 flex flex-col gap-3">
                      {(order.order_items || []).map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md bg-dark-800 border border-dark-700/30 flex items-center justify-center shrink-0">
                            <i className="ri-robot-2-line text-white/30 w-5 h-5 flex items-center justify-center" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white font-medium truncate">{item.product_name}</p>
                            <p className="text-[10px] text-white/30">
                              Qty: {item.quantity} · Unit: {formatMoney(item.unit_price, order.currency)}
                              {item.final_price && item.final_price !== item.unit_price && (
                                <span className="text-emerald-400 ml-1">→ {formatMoney(item.final_price, order.currency)}</span>
                              )}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm text-gold-400 font-semibold">
                              {formatMoney(item.subtotal ?? (item.final_price || item.unit_price) * item.quantity, order.currency)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer */}
                    <div className="px-5 py-3 border-t border-dark-700/30 flex items-center justify-between bg-dark-800/20">
                      <div className="text-[10px] text-white/25">
                        {order.order_items?.length || 0} item{order.order_items?.length !== 1 ? 's' : ''}
                      </div>
                      <Link
                        to={`/my-orders/${order.id}`}
                        className="text-[10px] text-gold-400 hover:text-gold-300 transition-colors font-medium"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}