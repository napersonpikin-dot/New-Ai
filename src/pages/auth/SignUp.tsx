import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const steps = [
  {
    icon: 'ri-robot-2-line',
    title: 'Choose a Robot',
    desc: 'Browse our marketplace and pick an AI robot that matches your earning goals.',
  },
  {
    icon: 'ri-shopping-cart-line',
    title: 'Purchase & Activate',
    desc: 'Add your robot to cart and complete payment securely via Stripe.',
  },
  {
    icon: 'ri-key-2-line',
    title: 'Get Your Code',
    desc: 'After purchase, you\'ll receive a unique activation code instantly.',
  },
  {
    icon: 'ri-coins-line',
    title: 'Sign Up & Earn',
    desc: 'Create your account using the code, then start earning daily passive income.',
  },
];

export default function SignUp() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
    activationCode: '',
    agreeTerms: false,
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      setStatus('error');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      setStatus('error');
      return;
    }
    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      setStatus('error');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      setStatus('error');
      return;
    }
    if (!formData.agreeTerms) {
      setErrorMsg('You must agree to the terms and conditions.');
      setStatus('error');
      return;
    }
    if (!formData.activationCode.trim()) {
      setErrorMsg('Activation code is required. Contact customer service on WhatsApp to get an activation code first.');
      setStatus('error');
      return;
    }

    setStatus('submitting');

    const result = await signUp(formData.email, formData.password, formData.fullName);

    if (result.success) {
      setStatus('success');
      setFormData({ fullName: '', email: '', password: '', confirmPassword: '', referralCode: '', activationCode: '', agreeTerms: false });
      setTimeout(() => navigate('/dashboard'), 600);
      return;
    }

    // Fallback to form submission if Supabase is not connected
    const data = new URLSearchParams();
    data.append('fullName', formData.fullName);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('referralCode', formData.referralCode);
    data.append('activationCode', formData.activationCode);

    try {
      const res = await fetch('https://readdy.ai/api/form/d7r3l9fb5ro7pimqgp9g', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data.toString(),
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ fullName: '', email: '', password: '', confirmPassword: '', referralCode: '', activationCode: '', agreeTerms: false });
        setTimeout(() => navigate('/dashboard'), 600);
        return;
      } else {
        setStatus('error');
        setErrorMsg(result.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMsg(result.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2">
            <img
              src="https://static.readdy.ai/image/e514fc972d3ac011ec046bb027a8bd60/05b8712378af54b96f49b8eeeac4fc04.png"
              alt="Ai EARNERS Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="text-white font-bold text-xl tracking-tight">
              Ai <span className="text-gold-400">EARNERS</span>
            </span>
          </Link>
        </div>

        {/* How It Works Walkthrough */}
        <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5 md:p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <i className="ri-lightbulb-line text-gold-400 w-5 h-5 flex items-center justify-center" />
            <h2 className="text-white font-semibold text-sm">How It Works — Get Started in 4 Steps</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {steps.map((step, idx) => (
              <div key={idx} className="relative bg-dark-800/40 border border-dark-700/30 rounded-lg p-3 md:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-gold-500/15 border border-gold-400/20 flex items-center justify-center text-gold-400 text-xs font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <i className={`${step.icon} text-gold-400/60 text-sm w-4 h-4 flex items-center justify-center`} />
                </div>
                <h3 className="text-white text-xs font-semibold mb-1">{step.title}</h3>
                <p className="text-white/40 text-[10px] leading-relaxed">{step.desc}</p>
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-[1px] bg-dark-700/50" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-2 items-center justify-between bg-dark-800/30 border border-dark-700/20 rounded-lg p-3">
            <p className="text-white/50 text-xs">
              Don't have an activation code yet?
            </p>
            <a
              href="https://wa.me/2348145375816"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gold-500 hover:bg-gold-600 text-dark-900 font-semibold text-xs px-4 py-2 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <i className="ri-whatsapp-line w-3 h-3 flex items-center justify-center" />
              Activate AI Robot
            </a>
          </div>
        </div>

        <div className="bg-surface-card border border-dark-700/50 rounded-xl p-6 md:p-8">
          <h1 className="text-xl md:text-2xl font-bold text-white text-center mb-2">
            Create Your Account
          </h1>
          <p className="text-sm text-white/50 text-center mb-6">
            Join thousands earning daily with AI robots.
          </p>

          {status === 'success' ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <i className="ri-check-line text-emerald-400 text-2xl w-6 h-6 flex items-center justify-center" />
              </div>
              <h3 className="text-white font-semibold mb-2">Account Created!</h3>
              <p className="text-sm text-white/50 mb-4">
                Welcome to Ai EARNERS. Redirecting to your dashboard...
              </p>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center bg-gold-500 hover:bg-gold-600 text-dark-900 font-semibold px-6 py-2.5 rounded-md transition-colors text-sm"
              >
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <form
              id="signup-form"
              data-readdy-form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2 text-xs text-red-400">
                  {errorMsg}
                </div>
              )}

              <div>
                <label htmlFor="fullName" className="block text-xs text-white/60 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs text-white/60 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs text-white/60 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-xs text-white/60 mb-1.5">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors"
                />
              </div>

              {/* Referral Code */}
              <div>
                <label htmlFor="referralCode" className="block text-xs text-white/60 mb-1.5">
                  Referral Code
                </label>
                <input
                  type="text"
                  id="referralCode"
                  name="referralCode"
                  value={formData.referralCode}
                  onChange={handleChange}
                  placeholder="Friend's referral code (optional)"
                  className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors uppercase"
                />
              </div>

              {/* Activation Code Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="activationCode" className="text-xs text-white/60">
                    Activation Code <span className="text-red-400">*</span>
                  </label>
                  <a
                    href="https://wa.me/2348145375816"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-gold-400 hover:text-gold-500 transition-colors flex items-center gap-1"
                  >
                    <i className="ri-whatsapp-line w-3 h-3 flex items-center justify-center" />
                    Activate AI via WhatsApp
                  </a>
                </div>
                <input
                  type="text"
                  id="activationCode"
                  name="activationCode"
                  value={formData.activationCode}
                  onChange={handleChange}
                  placeholder="Enter activation code (required)"
                  className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors uppercase"
                />
                <p className="text-[10px] text-white/30 mt-1">
                  You must have a valid activation code to create an account.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="mt-0.5 w-4 h-4 accent-gold-500 cursor-pointer"
                />
                <label htmlFor="agreeTerms" className="text-xs text-white/50 leading-relaxed">
                  I agree to the{' '}
                  <a href="/contact" className="text-gold-400 hover:text-gold-500 transition-colors">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/contact" className="text-gold-400 hover:text-gold-500 transition-colors">
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full bg-gold-500 hover:bg-gold-600 disabled:opacity-60 text-dark-900 font-semibold py-2.5 rounded-md transition-colors text-sm flex items-center justify-center gap-2"
              >
                {status === 'submitting' ? (
                  <>
                    <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center" />
                    Creating Account...
                  </>
                ) : (
                  <>Create Free Account</>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-xs text-white/50">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-gold-400 hover:text-gold-500 transition-colors font-medium"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}