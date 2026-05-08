import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import NotificationsBell from './NotificationsBell';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { user, signOut, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navScrollLinks = [
    { label: 'Home', id: 'home' },
    { label: 'Features', id: 'features' },
    { label: 'Dashboard', id: 'dashboard' },
    { label: 'Member Portal', id: 'member' },
    { label: 'Support', id: 'support' },
    { label: 'Robots', id: 'robots' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-dark-900/95 backdrop-blur-md border-b border-dark-700/50' : 'bg-transparent'
      }`}
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        <Link
          to="/"
          className="flex items-center gap-2 shrink-0"
        >
          <img
            src="https://static.readdy.ai/image/e514fc972d3ac011ec046bb027a8bd60/05b8712378af54b96f49b8eeeac4fc04.png"
            alt="Ai EARNERS Logo"
            className="w-8 h-8 object-contain"
          />
          <span className="text-white font-bold text-lg tracking-tight whitespace-nowrap">
            Ai <span className="text-gold-400">EARNERS</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {isHome ? (
            <>
              <button
                onClick={() => scrollTo('home')}
                className="text-sm text-white/70 hover:text-gold-400 transition-colors whitespace-nowrap"
              >
                Home
              </button>
              <Link
                to="/how-it-works"
                className="text-sm text-white/70 hover:text-gold-400 transition-colors whitespace-nowrap"
              >
                How It Works
              </Link>
              {navScrollLinks.slice(1).map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="text-sm text-white/70 hover:text-gold-400 transition-colors whitespace-nowrap"
                >
                  {link.label}
                </button>
              ))}
            </>
          ) : (
            <>
              <Link to="/" className="text-sm text-white/70 hover:text-gold-400 transition-colors whitespace-nowrap">Home</Link>
              <Link to="/how-it-works" className="text-sm text-white/70 hover:text-gold-400 transition-colors whitespace-nowrap">How It Works</Link>
              <Link to="/#features" className="text-sm text-white/70 hover:text-gold-400 transition-colors whitespace-nowrap">Features</Link>
              <Link to="/#dashboard" className="text-sm text-white/70 hover:text-gold-400 transition-colors whitespace-nowrap">Dashboard</Link>
              <Link to="/#robots" className="text-sm text-white/70 hover:text-gold-400 transition-colors whitespace-nowrap">Robots</Link>
            </>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <NotificationsBell />
              <Link
                to="/dashboard"
                className="text-sm text-white/70 hover:text-gold-400 transition-colors whitespace-nowrap flex items-center gap-1"
              >
                <i className="ri-dashboard-line w-4 h-4 flex items-center justify-center" />
                Dashboard
              </Link>
              <Link
                to="/leaderboard"
                className="text-sm text-white/70 hover:text-gold-400 transition-colors whitespace-nowrap flex items-center gap-1"
              >
                <i className="ri-trophy-line w-4 h-4 flex items-center justify-center" />
                Leaderboard
              </Link>
              <Link
                to="/referral"
                className="text-sm text-white/70 hover:text-gold-400 transition-colors whitespace-nowrap flex items-center gap-1"
              >
                <i className="ri-share-line w-4 h-4 flex items-center justify-center" />
                Referral
              </Link>
              <Link
                to="/my-referrals"
                className="text-sm text-white/70 hover:text-gold-400 transition-colors whitespace-nowrap flex items-center gap-1"
              >
                <i className="ri-user-add-line w-4 h-4 flex items-center justify-center" />
                My Referrals
              </Link>
              <Link
                to="/my-orders"
                className="text-sm text-white/70 hover:text-gold-400 transition-colors whitespace-nowrap flex items-center gap-1"
              >
                <i className="ri-shopping-bag-line w-4 h-4 flex items-center justify-center" />
                My Orders
              </Link>
              <Link
                to="/my-loans"
                className="text-sm text-white/70 hover:text-gold-400 transition-colors whitespace-nowrap flex items-center gap-1"
              >
                <i className="ri-hand-coin-line w-4 h-4 flex items-center justify-center" />
                My Loans
              </Link>
              <Link
                to="/my-withdrawals"
                className="text-sm text-white/70 hover:text-gold-400 transition-colors whitespace-nowrap flex items-center gap-1"
              >
                <i className="ri-refund-line w-4 h-4 flex items-center justify-center" />
                My Withdrawals
              </Link>
              <Link
                to="/activity"
                className="text-sm text-white/70 hover:text-gold-400 transition-colors whitespace-nowrap flex items-center gap-1"
              >
                <i className="ri-pulse-line w-4 h-4 flex items-center justify-center" />
                Activity
              </Link>
              <Link
                to="/community"
                className="text-sm text-white/70 hover:text-gold-400 transition-colors whitespace-nowrap flex items-center gap-1"
              >
                <i className="ri-message-3-line w-4 h-4 flex items-center justify-center" />
                Community
              </Link>
              <Link
                to="/contact"
                className="text-sm text-white/70 hover:text-gold-400 transition-colors whitespace-nowrap flex items-center gap-1"
              >
                <i className="ri-customer-service-2-line w-4 h-4 flex items-center justify-center" />
                Support
              </Link>
              <div className="flex items-center gap-2 bg-gold-500/10 border border-gold-400/20 rounded-full px-3 py-1">
                <div className="w-6 h-6 rounded-full bg-gold-500 flex items-center justify-center text-dark-900 text-[10px] font-bold">
                  {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
                <span className="text-gold-400 text-xs font-medium hidden lg:inline">
                  {user?.full_name || user?.email?.split('@')[0] || 'Member'}
                </span>
              </div>
              <button
                onClick={() => signOut()}
                className="text-sm text-white/50 hover:text-red-400 transition-colors whitespace-nowrap flex items-center gap-1"
              >
                <i className="ri-logout-box-r-line w-4 h-4 flex items-center justify-center" />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/leaderboard"
                className="text-sm text-white/70 hover:text-gold-400 transition-colors whitespace-nowrap flex items-center gap-1"
              >
                <i className="ri-trophy-line w-4 h-4 flex items-center justify-center" />
                Leaderboard
              </Link>
              <Link
                to="/login"
                className="text-sm text-white/70 hover:text-gold-400 transition-colors whitespace-nowrap flex items-center gap-1"
              >
                <i className="ri-login-box-line w-4 h-4 flex items-center justify-center" />
                Sign In
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden w-8 h-8 flex items-center justify-center text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle mobile menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <i className="ri-close-line text-xl w-5 h-5 flex items-center justify-center" />
          ) : (
            <i className="ri-menu-line text-xl w-5 h-5 flex items-center justify-center" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-dark-900/98 backdrop-blur-md border-t border-dark-700/50 px-4 py-4">
          <div className="flex flex-col gap-3">
            {isHome ? (
              <>
                <button onClick={() => scrollTo('home')} className="text-left text-white/70 hover:text-gold-400 py-2 transition-colors">Home</button>
                <Link to="/how-it-works" onClick={() => setMobileOpen(false)} className="text-white/70 hover:text-gold-400 py-2 transition-colors">How It Works</Link>
                {navScrollLinks.slice(1).map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollTo(link.id)}
                    className="text-left text-white/70 hover:text-gold-400 py-2 transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
              </>
            ) : (
              <>
                <Link to="/" onClick={() => setMobileOpen(false)} className="text-white/70 hover:text-gold-400 py-2 transition-colors">Home</Link>
                <Link to="/how-it-works" onClick={() => setMobileOpen(false)} className="text-white/70 hover:text-gold-400 py-2 transition-colors">How It Works</Link>
                <Link to="/#features" onClick={() => setMobileOpen(false)} className="text-white/70 hover:text-gold-400 py-2 transition-colors">Features</Link>
                <Link to="/#dashboard" onClick={() => setMobileOpen(false)} className="text-white/70 hover:text-gold-400 py-2 transition-colors">Dashboard</Link>
                <Link to="/#robots" onClick={() => setMobileOpen(false)} className="text-white/70 hover:text-gold-400 py-2 transition-colors">Robots</Link>
              </>
            )}
            <div className="flex flex-col gap-2 pt-3 border-t border-dark-700/50">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-white/70 hover:text-gold-400 py-2 flex items-center gap-2">
                    <i className="ri-dashboard-line w-4 h-4 flex items-center justify-center" /> Dashboard
                  </Link>
                  <Link to="/leaderboard" onClick={() => setMobileOpen(false)} className="text-white/70 hover:text-gold-400 py-2 flex items-center gap-2">
                    <i className="ri-trophy-line w-4 h-4 flex items-center justify-center" /> Leaderboard
                  </Link>
                  <Link to="/referral" onClick={() => setMobileOpen(false)} className="text-white/70 hover:text-gold-400 py-2 flex items-center gap-2">
                    <i className="ri-share-line w-4 h-4 flex items-center justify-center" /> Referral
                  </Link>
                  <Link to="/my-referrals" onClick={() => setMobileOpen(false)} className="text-white/70 hover:text-gold-400 py-2 flex items-center gap-2">
                    <i className="ri-user-add-line w-4 h-4 flex items-center justify-center" /> My Referrals
                  </Link>
                  <Link to="/my-orders" onClick={() => setMobileOpen(false)} className="text-white/70 hover:text-gold-400 py-2 flex items-center gap-2">
                    <i className="ri-shopping-bag-line w-4 h-4 flex items-center justify-center" /> My Orders
                  </Link>
                  <Link to="/my-loans" onClick={() => setMobileOpen(false)} className="text-white/70 hover:text-gold-400 py-2 flex items-center gap-2">
                    <i className="ri-hand-coin-line w-4 h-4 flex items-center justify-center" /> My Loans
                  </Link>
                  <Link to="/my-withdrawals" onClick={() => setMobileOpen(false)} className="text-white/70 hover:text-gold-400 py-2 flex items-center gap-2">
                    <i className="ri-refund-line w-4 h-4 flex items-center justify-center" /> My Withdrawals
                  </Link>
                  <Link to="/activity" onClick={() => setMobileOpen(false)} className="text-white/70 hover:text-gold-400 py-2 flex items-center gap-2">
                    <i className="ri-pulse-line w-4 h-4 flex items-center justify-center" /> Activity
                  </Link>
                  <Link to="/community" onClick={() => setMobileOpen(false)} className="text-white/70 hover:text-gold-400 py-2 flex items-center gap-2">
                    <i className="ri-message-3-line w-4 h-4 flex items-center justify-center" /> Community
                  </Link>
                  <Link to="/contact" onClick={() => setMobileOpen(false)} className="text-white/70 hover:text-gold-400 py-2 flex items-center gap-2">
                    <i className="ri-customer-service-2-line w-4 h-4 flex items-center justify-center" /> Support
                  </Link>
                  <button
                    onClick={() => { signOut(); setMobileOpen(false); }}
                    className="text-left text-white/50 hover:text-red-400 py-2 flex items-center gap-2"
                  >
                    <i className="ri-logout-box-r-line w-4 h-4 flex items-center justify-center" /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/leaderboard" onClick={() => setMobileOpen(false)} className="text-white/70 hover:text-gold-400 py-2 flex items-center gap-2">
                    <i className="ri-trophy-line w-4 h-4 flex items-center justify-center" /> Leaderboard
                  </Link>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="text-white/70 hover:text-gold-400 py-2 flex items-center gap-2">
                    <i className="ri-login-box-line w-4 h-4 flex items-center justify-center" /> Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
