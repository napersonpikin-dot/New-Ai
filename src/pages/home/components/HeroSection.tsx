import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onScroll = () => {
      const scrollY = window.scrollY;
      const img = hero.querySelector('.hero-bg') as HTMLElement;
      if (img) {
        img.style.transform = `translateY(${scrollY * 0.3}px)`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden"
      aria-label="Ai EARNERS platform introduction"
    >
      {/* Background image */}
      <div className="hero-bg absolute inset-0">
        <img
          src="https://readdy.ai/api/search-image?query=A%20futuristic%20golden%20and%20black%20AI%20robot%20with%20glowing%20amber%20eyes%20standing%20in%20a%20vast%20dark%20cybernetic%20environment%2C%20dramatic%20cinematic%20lighting%20with%20warm%20gold%20accents%2C%20dark%20moody%20atmosphere%2C%20high%20detail%203D%20render%2C%20abstract%20tech%20background%20with%20subtle%20circuit%20patterns%2C%20the%20robot%20appears%20powerful%20and%20intelligent%2C%20ultra%20modern%20aesthetic%2C%20dark%20tones%20with%20gold%20highlights&width=1440&height=800&seq=1&orientation=landscape"
          alt="Ai EARNERS hero background"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />
      </div>

      <div className="relative z-10 w-full px-4 md:px-6 py-24 md:py-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-400/30 rounded-full px-3 py-1.5 mb-6">
            <i className="ri-robot-2-line text-gold-400 text-sm w-4 h-4 flex items-center justify-center" />
            <span className="text-gold-400 text-xs font-medium">AI-Powered Passive Income Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            {isAuthenticated ? (
              <>
                Your Dashboard
                <br />
                <span className="text-gold-400">Awaits.</span>
              </>
            ) : (
              <>
                Own AI Robots.
                <br />
                <span className="text-gold-400">Earn Daily.</span>
              </>
            )}
          </h1>

          <p className="text-base md:text-lg text-white/70 leading-relaxed mb-4 max-w-xl">
            {isAuthenticated
              ? 'Manage your robots, track earnings in real time, and explore new opportunities from your personal dashboard.'
              : 'Purchase AI-powered robot packages that work 24/7 to generate passive income for you. No trading skills needed. No daily monitoring required. Just buy a robot and earn.'}
          </p>

          <ul className="flex flex-col gap-2 mb-8">
            <li className="flex items-center gap-2 text-sm text-white/60">
              <i className="ri-check-line text-gold-400 w-4 h-4 flex items-center justify-center" />
              One-time robot purchase — no recurring fees
            </li>
            <li className="flex items-center gap-2 text-sm text-white/60">
              <i className="ri-check-line text-gold-400 w-4 h-4 flex items-center justify-center" />
              Daily earnings deposited to your wallet
            </li>
            <li className="flex items-center gap-2 text-sm text-white/60">
              <i className="ri-check-line text-gold-400 w-4 h-4 flex items-center justify-center" />
              Instant withdrawals to any bank or crypto wallet
            </li>
            <li className="flex items-center gap-2 text-sm text-white/60">
              <i className="ri-check-line text-gold-400 w-4 h-4 flex items-center justify-center" />
              Stack robots — own multiple, compound your income
            </li>
          </ul>

          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="bg-gold-500 hover:bg-gold-600 text-dark-900 font-semibold px-6 py-3 rounded-md transition-all text-sm whitespace-nowrap flex items-center justify-center gap-2"
              >
                Go to Dashboard
                <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center" />
              </Link>
            ) : (
              <>
                <Link
                  to="/sign-up"
                  className="bg-gold-500 hover:bg-gold-600 text-dark-900 font-semibold px-6 py-3 rounded-md transition-all text-sm whitespace-nowrap flex items-center justify-center gap-2"
                >
                  Start Earning Today
                  <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center" />
                </Link>
                <Link
                  to="/how-it-works"
                  className="border border-white/20 hover:border-white/40 text-white px-6 py-3 rounded-md transition-all text-sm whitespace-nowrap flex items-center justify-center gap-2"
                >
                  See How It Works
                  <i className="ri-play-circle-line w-4 h-4 flex items-center justify-center" />
                </Link>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 md:gap-6" role="list">
            <div role="listitem">
              <div className="text-gold-400 font-bold text-lg md:text-xl">8,000+</div>
              <div className="text-white/40 text-xs">Active Members</div>
            </div>
            <div className="w-px h-8 bg-white/10 hidden sm:block" aria-hidden="true" />
            <div role="listitem">
              <div className="text-gold-400 font-bold text-lg md:text-xl">₦2.4M+</div>
              <div className="text-white/40 text-xs">Paid to Members</div>
            </div>
            <div className="w-px h-8 bg-white/10 hidden sm:block" aria-hidden="true" />
            <div role="listitem">
              <div className="text-gold-400 font-bold text-lg md:text-xl">12</div>
              <div className="text-white/40 text-xs">Robot Types</div>
            </div>
            <div className="w-px h-8 bg-white/10 hidden sm:block" aria-hidden="true" />
            <div role="listitem">
              <div className="text-gold-400 font-bold text-lg md:text-xl">24h</div>
              <div className="text-white/40 text-xs">Avg. Withdrawal</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
