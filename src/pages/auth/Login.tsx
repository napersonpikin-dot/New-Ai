import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, resetPassword } = useAuth();
  const [mode, setMode] = useState<'login' | 'forgot'>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [forgotEmail, setForgotEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      setStatus('error');
      return;
    }
    if (!formData.password) {
      setErrorMsg('Please enter your password.');
      setStatus('error');
      return;
    }

    setStatus('submitting');

    const result = await signIn(formData.email, formData.password);

    if (result.success) {
      setStatus('success');
      setFormData({ email: '', password: '', rememberMe: false });
      setTimeout(() => navigate('/dashboard'), 600);
      return;
    }

    // Fallback to form submission if Supabase is not connected
    const data = new URLSearchParams();
    data.append('email', formData.email);
    data.append('password', formData.password);

    try {
      const res = await fetch('https://readdy.ai/api/form/d7r3l9fb5ro7pimqgpa0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data.toString(),
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ email: '', password: '', rememberMe: false });
        setTimeout(() => navigate('/dashboard'), 600);
        return;
      } else {
        setStatus('error');
        setErrorMsg(result.error || 'Invalid email or password. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMsg(result.error || 'Something went wrong. Please try again.');
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    const result = await resetPassword(forgotEmail);

    if (result.success) {
      setStatus('success');
      setForgotEmail('');
    } else {
      setStatus('error');
      setErrorMsg(result.error || 'Failed to send reset email. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
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

        <div className="bg-surface-card border border-dark-700/50 rounded-xl p-6 md:p-8">
          {mode === 'forgot' ? (
            <>
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-full bg-gold-500/10 flex items-center justify-center mx-auto mb-4">
                  <i className="ri-lock-unlock-line text-gold-400 text-2xl w-6 h-6 flex items-center justify-center" />
                </div>
                <h1 className="text-xl md:text-2xl font-bold text-white mb-2">
                  Reset Password
                </h1>
                <p className="text-sm text-white/50">
                  Enter your email and we will send you a password reset link.
                </p>
              </div>

              {status === 'success' ? (
                <div className="text-center py-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <i className="ri-mail-send-line text-emerald-400 text-2xl w-6 h-6 flex items-center justify-center" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Email Sent!</h3>
                  <p className="text-sm text-white/50 mb-4">
                    Check your inbox for the password reset link.
                  </p>
                  <button
                    onClick={() => { setMode('login'); setStatus('idle'); }}
                    className="inline-flex items-center justify-center bg-gold-500 hover:bg-gold-600 text-dark-900 font-semibold px-6 py-2.5 rounded-md transition-colors text-sm"
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="flex flex-col gap-4">
                  {errorMsg && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2 text-xs text-red-400">
                      {errorMsg}
                    </div>
                  )}

                  <div>
                    <label htmlFor="forgotEmail" className="block text-xs text-white/60 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="forgotEmail"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full bg-gold-500 hover:bg-gold-600 disabled:opacity-60 text-dark-900 font-semibold py-2.5 rounded-md transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    {status === 'submitting' ? (
                      <>
                        <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center" />
                        Sending...
                      </>
                    ) : (
                      <>Send Reset Link</>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setMode('login'); setStatus('idle'); setErrorMsg(''); }}
                    className="text-center text-xs text-white/50 hover:text-gold-400 transition-colors"
                  >
                    Remembered your password? Sign In
                  </button>
                </form>
              )}
            </>
          ) : (
            <>
              <h1 className="text-xl md:text-2xl font-bold text-white text-center mb-2">
                Welcome Back
              </h1>
              <p className="text-sm text-white/50 text-center mb-6">
                Sign in to access your dashboard and robots.
              </p>

              {status === 'success' ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <i className="ri-check-line text-emerald-400 text-2xl w-6 h-6 flex items-center justify-center" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Signed In Successfully!</h3>
                  <p className="text-sm text-white/50 mb-4">
                    Redirecting to your dashboard...
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
                  id="login-form"
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
                      placeholder="Enter your password"
                      className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="rememberMe"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        className="w-4 h-4 accent-gold-500 cursor-pointer"
                      />
                      <label htmlFor="rememberMe" className="text-xs text-white/50 cursor-pointer">
                        Remember me
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setStatus('idle'); setErrorMsg(''); }}
                      className="text-xs text-gold-400 hover:text-gold-500 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full bg-gold-500 hover:bg-gold-600 disabled:opacity-60 text-dark-900 font-semibold py-2.5 rounded-md transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    {status === 'submitting' ? (
                      <>
                        <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center" />
                        Signing In...
                      </>
                    ) : (
                      <>Sign In</>
                    )}
                  </button>
                </form>
              )}

              <div className="mt-6 text-center">
                <p className="text-xs text-white/50">
                  Do not have an account?{' '}
                  <Link
                    to="/sign-up"
                    className="text-gold-400 hover:text-gold-500 transition-colors font-medium"
                  >
                    Create Free Account
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
