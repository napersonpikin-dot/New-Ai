import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useNotifications } from '@/context/NotificationsContext';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import DepositModal from './components/DepositModal';
import WithdrawModal from './components/WithdrawModal';
import LoanModal from './components/LoanModal';

interface UserRobot {
  id: number;
  robot_id: number;
  robot_name: string;
  category: string;
  price: number;
  daily_return: number;
  image: string;
  purchased_at: string;
  total_earned: number;
  active: boolean;
}

interface ProfileData {
  full_name?: string;
  welcome_bonus?: number;
  total_earnings?: number;
  robots_owned?: number;
  status?: string;
}

export default function MemberDashboard() {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  const { clearCart } = useCart();

  const [searchParams, setSearchParams] = useSearchParams();
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  // Real data states
  const [userRobots, setUserRobots] = useState<UserRobot[]>([]);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [referralBonus, setReferralBonus] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [loading, setLoading] = useState(true);

  const totalDailyIncome = userRobots.reduce(
    (sum, r) => sum + (r.active ? Number(r.daily_return) : 0),
    0
  );

  const robotsOwned = userRobots.length;
  const activeRobots = userRobots.filter((r) => r.active).length;

  // Wallet balances for withdrawal
  const walletBalances = {
    earnings: Math.max(0, totalEarned),
    balance: Math.max(0, profile?.total_earnings || 0),
    referral: Math.max(0, referralBonus),
    welcome: Math.max(0, Math.round(profile?.welcome_bonus || 0)),
  };

  // Detect checkout success
  useEffect(() => {
    if (searchParams.get('checkout') === 'success') {
      setShowSuccessBanner(true);
      clearCart();
      // Remove query param without reload
      const next = new URLSearchParams(searchParams);
      next.delete('checkout');
      setSearchParams(next, { replace: true });
      // Auto-hide after 6 seconds
      const timer = setTimeout(() => setShowSuccessBanner(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, setSearchParams, clearCart]);

  // Load all user data from Supabase
  useEffect(() => {
    async function loadUserData() {
      if (!supabase) { setLoading(false); return; }
      setLoading(true);
      const uid = user?.id ?? 'demo-user-001';

      const [robotsRes, profileRes, referralsRes] = await Promise.all([
        supabase
          .from('user_robots')
          .select('*')
          .eq('user_id', uid)
          .order('purchased_at', { ascending: false }),
        supabase
          .from('profiles')
          .select('*')
          .eq('user_id', uid)
          .maybeSingle(),
        supabase
          .from('referrals')
          .select('bonus_earned')
          .eq('referrer_id', uid)
          .eq('status', 'completed'),
      ]);

      if (!robotsRes.error && robotsRes.data) {
        setUserRobots(robotsRes.data as UserRobot[]);
        const earned = robotsRes.data.reduce(
          (sum: number, r: any) => sum + Number(r.total_earned || 0),
          0
        );
        setTotalEarned(earned);
      }

      if (!profileRes.error && profileRes.data) {
        setProfile(profileRes.data as ProfileData);
      }

      if (!referralsRes.error && referralsRes.data) {
        const totalBonus = (referralsRes.data as any[]).reduce(
          (sum, r) => sum + Number(r.bonus_earned || 0),
          0
        );
        setReferralBonus(totalBonus);
      }

      setLoading(false);
    }
    loadUserData();
  }, [user?.id]);

  const handleLoanSuccess = () => {
    addNotification({
      type: 'system',
      title: 'Loan Application Sent',
      message: 'Your loan request is now under review.',
      read: false,
    });
  };

  const handleWithdrawSuccess = () => {
    addNotification({
      type: 'withdrawal',
      title: 'Withdrawal Requested',
      message: 'Your withdrawal request has been submitted for admin approval.',
      read: false,
    });
    // Refresh data after a short delay
    setTimeout(() => {
      if (supabase && user?.id) {
        supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle().then(({ data }) => {
          if (data) setProfile(data as ProfileData);
        });
      }
    }, 1500);
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
              to="/my-orders"
              className="hidden sm:flex text-sm text-white/60 hover:text-white transition-colors whitespace-nowrap items-center gap-1"
            >
              <i className="ri-shopping-bag-3-line w-4 h-4 flex items-center justify-center" />
              My Orders
            </Link>
            <Link
              to="/referral"
              className="hidden sm:flex text-sm text-white/60 hover:text-white transition-colors whitespace-nowrap items-center gap-1"
            >
              <i className="ri-share-line w-4 h-4 flex items-center justify-center" />
              Referral
            </Link>
            <Link
              to="/leaderboard"
              className="hidden sm:flex text-sm text-white/60 hover:text-white transition-colors whitespace-nowrap items-center gap-1"
            >
              <i className="ri-trophy-line w-4 h-4 flex items-center justify-center" />
              Leaderboard
            </Link>
            <Link
              to="/dashboard/settings"
              className="hidden sm:flex text-sm text-white/60 hover:text-white transition-colors whitespace-nowrap items-center gap-1"
            >
              <i className="ri-settings-3-line w-4 h-4 flex items-center justify-center" />
              Settings
            </Link>
            <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 text-xs font-bold">
              {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Success Banner */}
      {showSuccessBanner && (
        <div className="px-4 md:px-6 pt-4">
          <div className="max-w-6xl mx-auto bg-emerald-500/10 border border-emerald-400/25 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
              <i className="ri-check-double-line text-emerald-400 text-base w-5 h-5 flex items-center justify-center" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold">Payment Successful!</p>
              <p className="text-white/50 text-xs mt-0.5">
                Your robots have been activated. You can view them in My Orders.
              </p>
            </div>
            <Link
              to="/my-orders"
              className="shrink-0 bg-emerald-500 hover:bg-emerald-600 text-dark-900 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors whitespace-nowrap"
            >
              View Orders
            </Link>
            <button
              onClick={() => setShowSuccessBanner(false)}
              className="shrink-0 w-6 h-6 flex items-center justify-center text-white/40 hover:text-white transition-colors"
              aria-label="Dismiss"
            >
              <i className="ri-close-line w-4 h-4 flex items-center justify-center" />
            </button>
          </div>
        </div>
      )}

      <div className="px-4 md:px-6 py-6 md:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Banner */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
              Welcome back, {profile?.full_name || 'Member'}
            </h1>
            <p className="text-sm text-white/50">
              Here is your dashboard overview for today.
            </p>
          </div>

          {/* Modern Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-8">
            {/* Active Robots */}
            <div className="bg-surface-card border border-dark-700/40 rounded-xl p-4 md:p-5 relative overflow-hidden group hover:border-gold-400/20 transition-all">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gold-500/5 rounded-full blur-xl translate-x-8 -translate-y-8 group-hover:bg-gold-500/10 transition-colors" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-gold-500/10 flex items-center justify-center">
                    <i className="ri-robot-2-line text-gold-400 text-base w-5 h-5 flex items-center justify-center" />
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium">{activeRobots} active</span>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-0.5">
                  {loading ? '-' : robotsOwned}
                </div>
                <div className="text-[11px] text-white/40">Active Robots</div>
              </div>
            </div>

            {/* Daily Revenue */}
            <div className="bg-surface-card border border-dark-700/40 rounded-xl p-4 md:p-5 relative overflow-hidden group hover:border-emerald-400/20 transition-all">
              <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl translate-x-8 -translate-y-8 group-hover:bg-emerald-500/10 transition-colors" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <i className="ri-line-chart-line text-emerald-400 text-base w-5 h-5 flex items-center justify-center" />
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-0.5">
                  ₦{loading ? '-' : totalDailyIncome.toLocaleString()}
                </div>
                <div className="text-[11px] text-white/40">Daily Revenue</div>
              </div>
            </div>

            {/* Total Earnings */}
            <div className="bg-surface-card border border-dark-700/40 rounded-xl p-4 md:p-5 relative overflow-hidden group hover:border-sky-400/20 transition-all">
              <div className="absolute top-0 right-0 w-20 h-20 bg-sky-500/5 rounded-full blur-xl translate-x-8 -translate-y-8 group-hover:bg-sky-500/10 transition-colors" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-sky-500/10 flex items-center justify-center">
                    <i className="ri-coins-line text-sky-400 text-base w-5 h-5 flex items-center justify-center" />
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-0.5">
                  ₦{loading ? '-' : totalEarned.toLocaleString()}
                </div>
                <div className="text-[11px] text-white/40">Total Earnings</div>
              </div>
            </div>

            {/* Referral Bonus */}
            <div className="bg-surface-card border border-dark-700/40 rounded-xl p-4 md:p-5 relative overflow-hidden group hover:border-amber-400/20 transition-all">
              <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-full blur-xl translate-x-8 -translate-y-8 group-hover:bg-amber-500/10 transition-colors" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <i className="ri-user-add-line text-amber-400 text-base w-5 h-5 flex items-center justify-center" />
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-0.5">
                  ₦{loading ? '-' : referralBonus.toLocaleString()}
                </div>
                <div className="text-[11px] text-white/40">Referral Bonus</div>
              </div>
            </div>

            {/* Welcome Bonus */}
            <div className="bg-surface-card border border-dark-700/40 rounded-xl p-4 md:p-5 relative overflow-hidden group hover:border-violet-400/20 transition-all">
              <div className="absolute top-0 right-0 w-20 h-20 bg-violet-500/5 rounded-full blur-xl translate-x-8 -translate-y-8 group-hover:bg-violet-500/10 transition-colors" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center">
                    <i className="ri-gift-line text-violet-400 text-base w-5 h-5 flex items-center justify-center" />
                  </div>
                  <span className="text-[10px] text-violet-400 font-medium">Bonus</span>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-0.5">
                  ₦{loading ? '-' : Math.round(profile?.welcome_bonus || 0).toLocaleString()}
                </div>
                <div className="text-[11px] text-white/40">Welcome Bonus</div>
              </div>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5 md:p-6 max-w-md">
            <h3 className="text-white font-semibold text-base mb-1">Quick Actions</h3>
            <p className="text-[11px] text-white/40 mb-5">Manage your funds instantly</p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setShowDepositModal(true)}
                className="flex items-center gap-3 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-400/20 text-emerald-400 px-4 py-3 rounded-lg transition-all text-sm font-medium"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <i className="ri-arrow-down-circle-line text-emerald-400 w-5 h-5 flex items-center justify-center" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium">Deposit</div>
                  <div className="text-[10px] text-emerald-400/60">Add funds to wallet</div>
                </div>
              </button>

              <button
                onClick={() => setShowWithdrawModal(true)}
                className="flex items-center gap-3 bg-red-500/10 hover:bg-red-500/15 border border-red-400/20 text-red-400 px-4 py-3 rounded-lg transition-all text-sm font-medium"
              >
                <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <i className="ri-arrow-up-circle-line text-red-400 w-5 h-5 flex items-center justify-center" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium">Withdraw</div>
                  <div className="text-[10px] text-red-400/60">Choose which wallet to cash out from</div>
                </div>
              </button>

              <button
                onClick={() => setShowLoanModal(true)}
                className="flex items-center gap-3 bg-violet-500/10 hover:bg-violet-500/15 border border-violet-400/20 text-violet-400 px-4 py-3 rounded-lg transition-all text-sm font-medium"
              >
                <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <i className="ri-hand-coin-line text-violet-400 w-5 h-5 flex items-center justify-center" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium">Apply for Loan</div>
                  <div className="text-[10px] text-violet-400/60">Request credit advance</div>
                </div>
              </button>

              <Link
                to="/my-orders"
                className="flex items-center gap-3 bg-dark-800/60 hover:bg-dark-800 border border-dark-700/40 text-white/70 hover:text-white px-4 py-3 rounded-lg transition-all text-sm"
              >
                <div className="w-9 h-9 rounded-lg bg-dark-700/40 flex items-center justify-center">
                  <i className="ri-shopping-bag-3-line text-white/50 w-5 h-5 flex items-center justify-center" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium">My Orders</div>
                  <div className="text-[10px] text-white/40">View purchase history</div>
                </div>
              </Link>

              <Link
                to="/my-withdrawals"
                className="flex items-center gap-3 bg-dark-800/60 hover:bg-dark-800 border border-dark-700/40 text-white/70 hover:text-white px-4 py-3 rounded-lg transition-all text-sm"
              >
                <div className="w-9 h-9 rounded-lg bg-dark-700/40 flex items-center justify-center">
                  <i className="ri-refund-line text-white/50 w-5 h-5 flex items-center justify-center" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium">My Withdrawals</div>
                  <div className="text-[10px] text-white/40">Track cashout requests</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showWithdrawModal && (
        <WithdrawModal
          onClose={() => setShowWithdrawModal(false)}
          onSuccess={handleWithdrawSuccess}
          wallets={walletBalances}
        />
      )}

      {showDepositModal && (
        <DepositModal
          onClose={() => setShowDepositModal(false)}
          onSuccess={() => {
            addNotification({
              type: 'deposit',
              title: 'Deposit Submitted',
              message: 'Your deposit request is pending admin approval.',
              read: false,
            });
          }}
        />
      )}

      {showLoanModal && (
        <LoanModal onClose={() => setShowLoanModal(false)} onSuccess={handleLoanSuccess} />
      )}
    </div>
  );
}