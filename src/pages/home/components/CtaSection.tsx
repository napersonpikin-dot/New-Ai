import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function CtaSection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="bg-dark-800 py-16 md:py-24" aria-labelledby="cta-title">
      <div className="px-4 md:px-6">
        <div className="max-w-3xl mx-auto bg-surface-dark border border-dark-700/50 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gold-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-400/30 rounded-full px-3 py-1.5 mb-6">
              <i className="ri-robot-2-line text-gold-400 text-sm w-4 h-4 flex items-center justify-center" />
              <span className="text-gold-400 text-xs font-medium">Join 8,000+ Members Worldwide</span>
            </div>

            <h2 id="cta-title" className="text-2xl md:text-4xl font-bold text-white mb-4">
              {isAuthenticated ? 'Welcome Back!' : 'Ready to Start Earning Daily?'}
            </h2>
            <p className="text-sm md:text-base text-white/50 max-w-lg mx-auto mb-8">
              {isAuthenticated
                ? 'Head to your dashboard to manage your robots, track earnings, and explore new features.'
                : 'Create your free account in under 2 minutes, browse the robot marketplace, and buy your first income-generating robot today.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
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
                    Create Free Account
                    <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center" />
                  </Link>
                  <Link
                    to="/login"
                    className="border border-white/20 hover:border-white/40 text-white px-6 py-3 rounded-md transition-all text-sm whitespace-nowrap flex items-center justify-center gap-2"
                  >
                    Sign In
                    <i className="ri-login-box-line w-4 h-4 flex items-center justify-center" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
