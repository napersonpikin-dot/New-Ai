import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { robots } from '@/mocks/robots';
import CartDrawer from '@/components/CartDrawer';

type SortOption = 'default' | 'price-low' | 'price-high' | 'daily-high';

export default function ActivateAIPage() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'review' | 'payment' | 'success'>('review');
  const [stripeLoading, setStripeLoading] = useState(false);
  const [stripeError, setStripeError] = useState('');

  const { items, addItem, removeItem, total, count, setIsOpen } = useCart();

  const availableRobots = robots.filter((r) => !r.comingSoon);
  const comingSoonRobots = robots.filter((r) => r.comingSoon);

  const sortedAvailable = [...availableRobots].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'daily-high') return b.dailyReturn - a.dailyReturn;
    return 0;
  });

  const displayRobots = [...sortedAvailable, ...comingSoonRobots];

  const { user } = useAuth();

  const handleAdd = useCallback((robot: typeof robots[0]) => {
    addItem(robot);
    setAddedIds((prev) => new Set(prev).add(robot.id));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(robot.id);
        return next;
      });
    }, 1500);
  }, [addItem]);

  const handleCheckout = async () => {
    setStripeError('');
    setStripeLoading(true);
    try {
      // 1) Write order to Supabase before redirecting to Stripe
      const uid = user?.id ?? null;
      const currency = 'USD';
      const subtotal = items.reduce((s, i) => s + i.robot.price * i.quantity, 0);

      if (supabase) {
        const { data: orderData, error: orderErr } = await supabase
          .from('order_headers')
          .insert({
            customer_id: uid,
            status: 'pending_payment',
            currency,
            subtotal_items: subtotal,
            payment_provider: 'stripe',
          })
          .select('id')
          .single();

        if (!orderErr && orderData) {
          await supabase.from('order_items').insert(
            items.map((i) => ({
              order_id: orderData.id,
              product_id: String(i.robot.id),
              product_name: i.robot.name,
              quantity: i.quantity,
              unit_price: i.robot.price,
              final_price: i.robot.price,
              subtotal: i.robot.price * i.quantity,
            }))
          );
        }
      }

      // 2) Call Stripe Edge Function
      const res = await fetch(
        `${import.meta.env.VITE_PUBLIC_SUPABASE_URL?.replace(/\/+$/, '')}/functions/v1/create-stripe-checkout`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: items.map((i) => ({ id: i.robot.id, name: i.robot.name, price: i.robot.price, quantity: i.quantity })),
            currency: 'ngn',
          }),
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err.error || 'Payment setup failed. Please try again.');
      }
      const { url, sessionId } = await res.json();
      if (url) {
        localStorage.setItem('aiearners_pending_checkout', sessionId || '');
        window.location.href = url;
        return;
      }
      throw new Error('No checkout URL returned.');
    } catch (err: any) {
      setStripeError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setStripeLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <CartDrawer />

      {/* Checkout Modal */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => { if (!stripeLoading) { setCheckoutOpen(false); setCheckoutStep('review'); } }} />
          <div className="relative bg-dark-900 border border-dark-700/50 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-dark-700/50">
              <div className="flex items-center gap-2">
                <i className="ri-secure-payment-line text-gold-400 w-5 h-5 flex items-center justify-center" />
                <h2 className="text-white font-semibold text-base">Complete Purchase</h2>
              </div>
              <button
                onClick={() => { setCheckoutOpen(false); setCheckoutStep('review'); }}
                disabled={stripeLoading}
                className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white transition-colors disabled:opacity-40"
                aria-label="Close checkout"
              >
                <i className="ri-close-line w-5 h-5 flex items-center justify-center" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-5 py-5">
              {checkoutStep === 'review' && (
                <div className="flex flex-col gap-5">
                  <div>
                    <h3 className="text-white/70 text-xs font-medium uppercase tracking-wider mb-3">Order Summary</h3>
                    <div className="flex flex-col gap-3">
                      {items.map((item) => (
                        <div key={item.robot.id} className="flex items-center gap-3 bg-dark-800/50 border border-dark-700/30 rounded-lg p-3">
                          <img src={item.robot.image} alt={item.robot.name} className="w-12 h-12 rounded-md object-cover object-top shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">{item.robot.name}</p>
                            <p className="text-white/40 text-[10px]">{item.robot.category} · Daily ₦{item.robot.dailyReturn.toLocaleString()}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-gold-400 text-sm font-semibold">₦{(item.robot.price * item.quantity).toLocaleString()}</p>
                            <button
                              onClick={() => removeItem(item.robot.id)}
                              className="text-white/30 hover:text-red-400 text-[10px] mt-0.5 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-dark-800/40 border border-dark-700/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white/50 text-xs">Subtotal</span>
                      <span className="text-white/70 text-xs">₦{total.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-dark-700/30">
                      <span className="text-white text-sm font-medium">Total</span>
                      <span className="text-gold-400 text-lg font-bold">₦{total.toLocaleString()}</span>
                    </div>
                  </div>

                  {stripeError && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2 text-xs text-red-400">
                      {stripeError}
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setCheckoutStep('payment')}
                      className="w-full bg-gold-500 hover:bg-gold-600 text-dark-900 font-semibold py-2.5 rounded-md text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      Continue to Payment
                      <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center" />
                    </button>
                    <button
                      onClick={() => { setCheckoutOpen(false); setIsOpen(true); }}
                      className="w-full border border-white/15 hover:border-white/30 text-white/70 py-2 rounded-md text-xs transition-colors"
                    >
                      Back to Cart
                    </button>
                  </div>
                </div>
              )}

              {checkoutStep === 'payment' && (
                <div className="flex flex-col gap-5">
                  <div className="bg-dark-800/40 border border-dark-700/30 rounded-lg p-4">
                    <p className="text-white/50 text-xs mb-1">Total to Pay</p>
                    <p className="text-gold-400 text-2xl font-bold">₦{total.toLocaleString()}</p>
                  </div>

                  <div>
                    <h3 className="text-white/70 text-xs font-medium uppercase tracking-wider mb-3">Select Payment Method</h3>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={handleCheckout}
                        disabled={stripeLoading}
                        className="flex items-center gap-3 bg-dark-800/60 border border-dark-700/40 hover:border-gold-400/30 rounded-lg p-3 transition-colors text-left disabled:opacity-60"
                      >
                        <div className="w-10 h-10 rounded-md bg-white flex items-center justify-center shrink-0">
                          <i className="ri-bank-card-line text-dark-900 text-lg w-5 h-5 flex items-center justify-center" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">Credit / Debit Card</p>
                          <p className="text-white/40 text-[10px]">Powered by Stripe — secure & encrypted</p>
                        </div>
                        {stripeLoading && <i className="ri-loader-4-line animate-spin text-gold-400 w-4 h-4 flex items-center justify-center" />}
                      </button>

                      <div className="flex items-center gap-3 bg-dark-800/30 border border-dark-700/20 rounded-lg p-3 opacity-60 cursor-not-allowed">
                        <div className="w-10 h-10 rounded-md bg-white/10 flex items-center justify-center shrink-0">
                          <i className="ri-bit-coin-line text-white/40 text-lg w-5 h-5 flex items-center justify-center" />
                        </div>
                        <div>
                          <p className="text-white/50 text-sm font-medium">Crypto (USDT)</p>
                          <p className="text-white/30 text-[10px]">Coming soon</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {stripeError && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2 text-xs text-red-400">
                      {stripeError}
                    </div>
                  )}

                  <button
                    onClick={() => setCheckoutStep('review')}
                    disabled={stripeLoading}
                    className="text-white/50 hover:text-white text-xs transition-colors text-center"
                  >
                    ← Back to order review
                  </button>

                  <p className="text-white/25 text-[10px] text-center">
                    By completing this purchase, you agree to our Terms of Service.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
            <button
              onClick={() => setIsOpen(true)}
              className="relative flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
            >
              <i className="ri-shopping-cart-line w-4 h-4 flex items-center justify-center" />
              Cart
              {count > 0 && (
                <span className="bg-gold-500 text-dark-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                  {count}
                </span>
              )}
            </button>
            <Link
              to="/dashboard"
              className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1"
            >
              <i className="ri-dashboard-line w-4 h-4 flex items-center justify-center" />
              Dashboard
            </Link>
            <Link
              to="/login"
              className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1"
            >
              <i className="ri-user-line w-4 h-4 flex items-center justify-center" />
              Sign In
            </Link>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-10 md:mb-14">
            <div className="inline-flex items-center gap-2 bg-gold-500/15 border border-gold-400/25 rounded-full px-3 py-1.5 mb-5">
              <i className="ri-robot-2-line text-gold-400 text-sm w-4 h-4 flex items-center justify-center" />
              <span className="text-gold-400 text-xs font-medium">Robot Marketplace</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-3">
              Activate Your AI
            </h1>
            <p className="text-sm md:text-base text-white/50 max-w-lg mx-auto">
              Each robot purchase activates an AI that earns for you daily. One-time payment, lifetime earnings.
            </p>
          </div>

          {/* WhatsApp Support Banner */}
          <div className="bg-[#25D366]/10 border border-[#25D366]/25 rounded-xl p-4 md:p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#25D366]/20 flex items-center justify-center shrink-0">
                <i className="ri-whatsapp-line text-[#25D366] text-xl w-6 h-6 flex items-center justify-center" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">
                  Need Help Activating an AI?
                </h3>
                <p className="text-white/50 text-xs mt-0.5">
                  Chat with our customer service team on WhatsApp for instant support.
                </p>
              </div>
            </div>
            <a
              href="https://wa.me/2348145375816"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#1EBE57] text-white font-semibold px-5 py-2.5 rounded-md text-sm whitespace-nowrap flex items-center gap-2 transition-colors shrink-0"
            >
              <i className="ri-whatsapp-line w-4 h-4 flex items-center justify-center" />
              Chat on WhatsApp
            </a>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40">Sort by:</span>
              <div className="flex bg-dark-800/60 border border-dark-700/40 rounded-lg p-0.5">
                {[
                  { key: 'default' as SortOption, label: 'Default' },
                  { key: 'price-low' as SortOption, label: 'Price: Low' },
                  { key: 'price-high' as SortOption, label: 'Price: High' },
                  { key: 'daily-high' as SortOption, label: 'Daily Return' },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setSortBy(opt.key)}
                    className={`px-3 py-1.5 text-xs rounded-md transition-all whitespace-nowrap ${
                      sortBy === opt.key
                        ? 'bg-gold-500 text-dark-900 font-semibold'
                        : 'text-white/50 hover:text-white/80'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <span className="text-xs text-white/40">{availableRobots.length} available</span>
          </div>

          {/* Robot Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-10">
            {displayRobots.map((robot) => (
              <div
                key={robot.id}
                className={`group bg-surface-card border rounded-xl overflow-hidden transition-all duration-300 ${
                  robot.comingSoon
                    ? 'border-dark-700/20 opacity-70'
                    : 'border-dark-700/40 hover:border-gold-400/30'
                }`}
                onMouseEnter={() => setHoveredId(robot.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={robot.image}
                    alt={robot.name}
                    className={`w-full h-full object-cover object-top transition-transform duration-500 ${
                      robot.comingSoon ? '' : 'group-hover:scale-105'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                      robot.comingSoon
                        ? 'bg-white/10 text-white/50 border border-white/10'
                        : robot.badge === 'Best Seller'
                        ? 'bg-gold-500 text-dark-900'
                        : robot.badge === 'Top Earner'
                        ? 'bg-emerald-500/90 text-white'
                        : robot.badge === 'Elite Pick'
                        ? 'bg-orange-500/90 text-white'
                        : 'bg-dark-800/90 text-gold-400 border border-gold-400/30'
                    }`}>
                      {robot.badge}
                    </span>
                  </div>
                  {robot.comingSoon && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                      <div className="bg-dark-800/90 border border-white/10 rounded-lg px-4 py-2 text-center">
                        <i className="ri-time-line text-white/50 text-lg w-5 h-5 flex items-center justify-center mx-auto mb-1" />
                        <span className="text-white/70 text-xs font-medium">Coming Soon</span>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3">
                    <span className="text-[10px] text-white/60 bg-dark-800/80 px-2 py-0.5 rounded-full border border-white/10">
                      {robot.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 md:p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className={`font-semibold text-sm md:text-base ${robot.comingSoon ? 'text-white/50' : 'text-white'}`}>{robot.name}</h3>
                    <div className="flex items-center gap-1 shrink-0">
                      <i className="ri-star-fill text-gold-400 text-[10px] w-3 h-3 flex items-center justify-center" />
                      <span className="text-gold-400 text-xs font-medium">{robot.rating}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {robot.features.map((feat, idx) => (
                      <span
                        key={idx}
                        className={`text-[10px] md:text-xs bg-dark-800/60 border border-dark-700/30 px-2 py-0.5 rounded ${
                          robot.comingSoon ? 'text-white/30' : 'text-white/50'
                        }`}
                      >
                        {feat}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <div className="text-white/40 text-[10px] mb-0.5">Daily Return</div>
                      <div className={`font-bold text-base md:text-lg ${robot.comingSoon ? 'text-white/30' : 'text-gold-400'}`}>
                        ₦{robot.dailyReturn.toLocaleString()}<span className="text-white/40 text-xs font-normal">/day</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white/40 text-[10px] mb-0.5">ROI</div>
                      <div className={`text-xs font-medium ${robot.comingSoon ? 'text-white/30' : 'text-emerald-400'}`}>{robot.roiDays} days</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-dark-700/40">
                    <div>
                      <span className="text-white/40 text-[10px]">Robot Price</span>
                      <div className={`font-bold text-lg ${robot.comingSoon ? 'text-white/30' : 'text-white'}`}>
                        {robot.comingSoon ? '—' : `₦${robot.price.toLocaleString()}`}
                      </div>
                    </div>
                    {robot.comingSoon ? (
                      <span className="bg-dark-800/80 text-white/40 font-semibold text-xs px-4 py-2 rounded-md whitespace-nowrap flex items-center gap-1 border border-white/10">
                        <i className="ri-time-line w-3 h-3 flex items-center justify-center" />
                        Coming Soon
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAdd(robot)}
                        className={`font-semibold text-xs px-4 py-2 rounded-md transition-colors whitespace-nowrap flex items-center gap-1 ${
                          addedIds.has(robot.id)
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gold-500 hover:bg-gold-600 text-dark-900'
                        }`}
                      >
                        {addedIds.has(robot.id) ? (
                          <>
                            <i className="ri-check-line w-3 h-3 flex items-center justify-center" />
                            Added
                          </>
                        ) : (
                          <>
                            Add to Cart
                            <i className="ri-shopping-cart-line w-3 h-3 flex items-center justify-center" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Floating Cart Summary Bar */}
          {count > 0 && (
            <div className="sticky bottom-4 z-30 bg-dark-900/95 backdrop-blur-md border border-gold-400/20 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg shadow-black/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold-500/15 flex items-center justify-center">
                  <i className="ri-shopping-cart-line text-gold-400 w-5 h-5 flex items-center justify-center" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{count} robot{count > 1 ? 's' : ''} in cart</p>
                  <p className="text-gold-400 text-xs font-semibold">₦{total.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setIsOpen(true)}
                  className="flex-1 sm:flex-none border border-white/15 hover:border-white/30 text-white/70 px-4 py-2 rounded-md text-xs transition-colors"
                >
                  View Cart
                </button>
                <button
                  onClick={() => { setCheckoutOpen(true); setCheckoutStep('review'); }}
                  className="flex-1 sm:flex-none bg-gold-500 hover:bg-gold-600 text-dark-900 font-semibold px-5 py-2 rounded-md text-xs transition-colors flex items-center justify-center gap-1"
                >
                  Complete Purchase
                  <i className="ri-arrow-right-line w-3 h-3 flex items-center justify-center" />
                </button>
              </div>
            </div>
          )}

          <div className="bg-surface-card border border-dark-700/40 rounded-xl p-6 md:p-8 text-center mt-10">
            <h3 className="text-white font-semibold text-lg mb-2">
              Ready to Start Earning?
            </h3>
            <p className="text-sm text-white/50 mb-5 max-w-md mx-auto">
              Contact our customer service on WhatsApp to activate your AI robot and start earning daily passive income.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://wa.me/2348145375816"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gold-500 hover:bg-gold-600 text-dark-900 font-semibold px-6 py-2.5 rounded-md transition-colors text-sm whitespace-nowrap flex items-center justify-center gap-2"
              >
                <i className="ri-whatsapp-line w-4 h-4 flex items-center justify-center" />
                Activate AI on WhatsApp
              </a>
              <Link
                to="/sign-up"
                className="border border-white/20 hover:border-white/40 text-white px-6 py-2.5 rounded-md transition-colors text-sm whitespace-nowrap flex items-center justify-center gap-2"
              >
                Create Account
                <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}