import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const steps = [
  {
    num: '01',
    icon: 'ri-user-add-line',
    title: 'Create Your Account',
    desc: 'Sign up for free in under 60 seconds. No credit card required. Provide your email, set a secure password, and you are ready to explore the platform.',
    tip: 'Use a strong password and enable 2FA for extra security.',
  },
  {
    num: '02',
    icon: 'ri-robot-2-line',
    title: 'Browse & Choose a Robot',
    desc: 'Visit the Robot Marketplace to compare 12 different AI robots. Each robot has a daily return rate, ROI timeline, and verified user reviews to help you decide.',
    tip: 'Start with a Starter Pick robot if you are new. You can always upgrade later.',
  },
  {
    num: '03',
    icon: 'ri-shopping-cart-line',
    title: 'Purchase Your Robot',
    desc: 'Click Buy Robot on any card you like. Pay with Bank Transfer, Crypto, PayPal, Stripe, Wise, or USDT. The robot is yours permanently — no recurring fees.',
    tip: 'Crypto and USDT payments are confirmed within minutes.',
  },
  {
    num: '04',
    icon: 'ri-wallet-3-line',
    title: 'Connect Your Wallet',
    desc: 'Go to Dashboard Settings and add your preferred withdrawal method. You can link a crypto wallet, bank account, or PayPal. This is where your daily earnings will be sent.',
    tip: 'Double-check your wallet address — withdrawals cannot be reversed.',
  },
  {
    num: '05',
    icon: 'ri-flashlight-line',
    title: 'Robot Starts Earning',
    desc: 'Once purchased, your robot activates automatically within 24 hours. It runs 24/7 using AI algorithms to generate passive income. You do not need to do anything.',
    tip: 'Monitor your live earnings on the Dashboard anytime.',
  },
  {
    num: '06',
    icon: 'ri-money-dollar-circle-line',
    title: 'Withdraw Your Earnings',
    desc: 'Your daily earnings appear in your Available Balance. Withdraw anytime to your connected wallet or bank. Crypto withdrawals are instant; bank transfers complete within 24 hours.',
    tip: 'There are zero withdrawal fees. Keep your balance to compound over time.',
  },
];

const paymentIcons = [
  { name: 'Bank Transfer', icon: 'ri-bank-card-line' },
  { name: 'Crypto Wallet', icon: 'ri-coin-line' },
  { name: 'PayPal', icon: 'ri-paypal-line' },
  { name: 'Stripe', icon: 'ri-bank-card-2-line' },
  { name: 'Wise', icon: 'ri-safe-line' },
  { name: 'USDT / USDC', icon: 'ri-bit-coin-line' },
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const { isAuthenticated } = useAuth();

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
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="hidden sm:flex text-sm text-white/60 hover:text-white transition-colors whitespace-nowrap items-center gap-1"
                >
                  <i className="ri-dashboard-line w-4 h-4 flex items-center justify-center" />
                  Dashboard
                </Link>
                <Link
                  to="/login"
                  className="text-sm text-white/60 hover:text-white transition-colors whitespace-nowrap"
                >
                  Sign Out
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                className="text-sm text-white/60 hover:text-white transition-colors whitespace-nowrap flex items-center gap-1"
              >
                <i className="ri-login-box-line w-4 h-4 flex items-center justify-center" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold-500/5 to-transparent" />
        <div className="relative px-4 md:px-6 py-16 md:py-24 text-center">
          <span className="text-gold-400 text-xs font-medium tracking-widest uppercase mb-3 block">
            Getting Started
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            How Ai <span className="text-gold-400">EARNERS</span> Works
          </h1>
          <p className="text-sm md:text-base text-white/50 max-w-xl mx-auto">
            From sign-up to your first withdrawal, here is the complete step-by-step guide to start earning with AI robots.
          </p>
        </div>
      </section>

      {/* Timeline Steps */}
      <section className="px-4 md:px-6 pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Desktop Timeline */}
          <div className="hidden md:block relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-dark-700/60" />

            <div className="flex flex-col gap-10">
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-6 relative">
                  {/* Number circle */}
                  <button
                    onClick={() => setActiveStep(idx)}
                    className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center shrink-0 border-2 transition-all cursor-pointer ${
                      activeStep === idx
                        ? 'bg-gold-500 border-gold-500 text-dark-900'
                        : 'bg-dark-800 border-dark-600 text-white/60 hover:border-gold-400/50'
                    }`}
                  >
                    <i className={`${step.icon} text-xl w-6 h-6 flex items-center justify-center`} />
                  </button>

                  {/* Content card */}
                  <div
                    className={`flex-1 bg-surface-card border rounded-xl p-6 transition-all cursor-pointer ${
                      activeStep === idx
                        ? 'border-gold-400/30'
                        : 'border-dark-700/40 hover:border-dark-600'
                    }`}
                    onClick={() => setActiveStep(idx)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-gold-400 text-xs font-bold">{step.num}</span>
                      <h3 className="text-white font-semibold text-lg">{step.title}</h3>
                    </div>
                    <p className="text-sm text-white/50 leading-relaxed mb-3">{step.desc}</p>
                    <div className="flex items-start gap-2 bg-gold-500/5 border border-gold-400/10 rounded-md px-3 py-2">
                      <i className="ri-lightbulb-line text-gold-400 text-xs w-4 h-4 flex items-center justify-center shrink-0 mt-0.5" />
                      <span className="text-xs text-gold-400/80">{step.tip}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Accordion */}
          <div className="md:hidden flex flex-col gap-3">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className={`bg-surface-card border rounded-xl overflow-hidden transition-all ${
                  activeStep === idx ? 'border-gold-400/30' : 'border-dark-700/40'
                }`}
              >
                <button
                  onClick={() => setActiveStep(activeStep === idx ? -1 : idx)}
                  className="w-full flex items-center gap-3 p-4 text-left"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      activeStep === idx ? 'bg-gold-500 text-dark-900' : 'bg-dark-800 text-white/60'
                    }`}
                  >
                    <i className={`${step.icon} text-sm w-4 h-4 flex items-center justify-center`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-gold-400 text-[10px] font-bold block">{step.num}</span>
                    <h3 className="text-white font-semibold text-sm">{step.title}</h3>
                  </div>
                  <i
                    className={`ri-arrow-down-s-line text-white/40 w-5 h-5 flex items-center justify-center transition-transform ${
                      activeStep === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeStep === idx && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-white/50 leading-relaxed mb-3">{step.desc}</p>
                    <div className="flex items-start gap-2 bg-gold-500/5 border border-gold-400/10 rounded-md px-3 py-2">
                      <i className="ri-lightbulb-line text-gold-400 text-xs w-4 h-4 flex items-center justify-center shrink-0 mt-0.5" />
                      <span className="text-xs text-gold-400/80">{step.tip}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Methods Strip */}
      <section className="px-4 md:px-6 pb-16 md:pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-white font-semibold text-base md:text-lg mb-6">
            Supported Payment Methods
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {paymentIcons.map((pm) => (
              <div
                key={pm.name}
                className="flex items-center gap-2 bg-dark-800/60 border border-dark-700/40 rounded-lg px-4 py-2.5"
              >
                <i className={`${pm.icon} text-gold-400 text-sm w-4 h-4 flex items-center justify-center`} />
                <span className="text-white/70 text-xs whitespace-nowrap">{pm.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Mini */}
      <section className="px-4 md:px-6 pb-16 md:pb-20">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-white font-semibold text-base md:text-lg text-center mb-6">
            Common Questions
          </h3>
          <div className="flex flex-col gap-3">
            {[
              {
                q: 'Do I need technical knowledge?',
                a: 'Not at all. Every robot is fully automated. You simply purchase it and the AI handles everything.',
              },
              {
                q: 'How long until I see earnings?',
                a: 'Most robots begin generating returns within 24 hours of activation.',
              },
              {
                q: 'Can I sell or transfer my robot?',
                a: 'Currently robots are non-transferable. However, you can own multiple robots and scale your fleet.',
              },
              {
                q: 'Is there a refund policy?',
                a: 'We offer a 7-day satisfaction guarantee on your first robot purchase.',
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-surface-card border border-dark-700/40 rounded-lg p-4">
                <h4 className="text-white font-medium text-sm mb-1">{item.q}</h4>
                <p className="text-xs text-white/50">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 md:px-6 pb-20 md:pb-28">
        <div className="max-w-xl mx-auto text-center bg-surface-card border border-gold-400/20 rounded-2xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gold-500/10 rounded-full blur-3xl" />
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-gold-500/20 flex items-center justify-center mx-auto mb-4">
              <i className="ri-rocket-line text-gold-400 text-2xl w-6 h-6 flex items-center justify-center" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
              {isAuthenticated ? 'Welcome Back!' : 'Ready to Start Earning?'}
            </h2>
            <p className="text-sm text-white/50 mb-6 max-w-sm mx-auto">
              {isAuthenticated
                ? 'Head to your dashboard to manage your robots and track earnings.'
                : 'Join 8,000+ members who are already earning daily passive income with AI robots.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="bg-gold-500 hover:bg-gold-600 text-dark-900 font-semibold px-6 py-2.5 rounded-md transition-colors text-sm whitespace-nowrap flex items-center justify-center gap-2"
                >
                  Go to Dashboard
                  <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/sign-up"
                    className="bg-gold-500 hover:bg-gold-600 text-dark-900 font-semibold px-6 py-2.5 rounded-md transition-colors text-sm whitespace-nowrap flex items-center justify-center gap-2"
                  >
                    Create Free Account
                    <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center" />
                  </Link>
                  <Link
                    to="/login"
                    className="border border-white/20 hover:border-white/40 text-white px-6 py-2.5 rounded-md transition-colors text-sm whitespace-nowrap flex items-center justify-center gap-2"
                  >
                    Sign In
                    <i className="ri-login-box-line w-4 h-4 flex items-center justify-center" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
