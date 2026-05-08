import { useState } from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'withdrawal', label: 'Withdrawal Issue' },
  { value: 'robot', label: 'Robot / Purchase Help' },
  { value: 'account', label: 'Account / Login' },
  { value: 'billing', label: 'Billing / Payment' },
  { value: 'bug', label: 'Report a Bug' },
  { value: 'feature', label: 'Feature Request' },
];

const priorities = [
  { value: 'low', label: 'Low — General question' },
  { value: 'medium', label: 'Medium — Needs attention soon' },
  { value: 'high', label: 'High — Urgent issue' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'general',
    priority: 'medium',
    subject: '',
    message: '',
    agree: false,
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Please enter your name.');
      setStatus('error');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      setStatus('error');
      return;
    }
    if (!formData.subject.trim()) {
      setErrorMsg('Please enter a subject.');
      setStatus('error');
      return;
    }
    if (!formData.message.trim() || formData.message.length < 10) {
      setErrorMsg('Please enter a message (at least 10 characters).');
      setStatus('error');
      return;
    }
    if (!formData.agree) {
      setErrorMsg('You must agree to be contacted.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    const data = new URLSearchParams();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('category', formData.category);
    data.append('priority', formData.priority);
    data.append('subject', formData.subject);
    data.append('message', formData.message);

    fetch('https://readdy.ai/api/form/d7r4f0kdj3knvn2p2dt0', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: data.toString(),
    })
      .then((res) => {
        if (res.ok) {
          setStatus('success');
          setFormData({
            name: '',
            email: '',
            category: 'general',
            priority: 'medium',
            subject: '',
            message: '',
            agree: false,
          });
        } else {
          setStatus('error');
          setErrorMsg('Something went wrong. Please try again.');
        }
      })
      .catch(() => {
        setStatus('error');
        setErrorMsg('Something went wrong. Please try again.');
      });
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
              to="/dashboard"
              className="hidden sm:flex text-sm text-white/60 hover:text-white transition-colors whitespace-nowrap items-center gap-1"
            >
              <i className="ri-dashboard-line w-4 h-4 flex items-center justify-center" />
              Dashboard
            </Link>
            <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 text-xs font-bold">
              MT
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-10">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Contact & Support</h1>
            <p className="text-sm text-white/50 max-w-lg mx-auto">
              Need help? Submit a ticket below and our team will get back to you within 2 hours.
            </p>
          </div>

          {status === 'success' ? (
            <div className="bg-surface-card border border-dark-700/40 rounded-xl p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <i className="ri-check-line text-emerald-400 text-3xl w-8 h-8 flex items-center justify-center" />
              </div>
              <h3 className="text-white font-semibold text-xl mb-2">Ticket Submitted!</h3>
              <p className="text-sm text-white/50 mb-2">
                We have received your support request and will respond shortly.
              </p>
              <p className="text-xs text-gold-400 mb-6">Ticket ID: AE-{Math.floor(Math.random() * 90000 + 10000)}</p>
              <div className="flex items-center justify-center gap-3">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center bg-gold-500 hover:bg-gold-600 text-dark-900 font-semibold px-6 py-2.5 rounded-md transition-colors text-sm"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => setStatus('idle')}
                  className="inline-flex items-center justify-center bg-dark-800 hover:bg-dark-700 border border-dark-700/40 text-white font-medium px-6 py-2.5 rounded-md transition-colors text-sm"
                >
                  Submit Another
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-surface-card border border-dark-700/40 rounded-xl p-6 md:p-8">
              <form
                id="support-ticket"
                data-readdy-form
                onSubmit={handleSubmit}
                className="flex flex-col gap-5"
              >
                {errorMsg && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2 text-xs text-red-400">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs text-white/60 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-xs text-white/60 mb-1.5">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400/50 transition-colors"
                    >
                      {categories.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="priority" className="block text-xs text-white/60 mb-1.5">
                      Priority
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400/50 transition-colors"
                    >
                      {priorities.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs text-white/60 mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Brief summary of your issue"
                    className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs text-white/60 mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    maxLength={500}
                    placeholder="Describe your issue or question in detail..."
                    className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors resize-none"
                  />
                  <p className="text-[10px] text-white/30 mt-1">{formData.message.length}/500</p>
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="agree"
                    name="agree"
                    checked={formData.agree}
                    onChange={handleChange}
                    className="mt-0.5 w-4 h-4 accent-gold-500 cursor-pointer"
                  />
                  <label htmlFor="agree" className="text-xs text-white/50 leading-relaxed">
                    I agree to be contacted by Ai EARNERS support regarding this ticket.
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
                      Submitting...
                    </>
                  ) : (
                    <>Submit Support Ticket</>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5 text-center">
              <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center mx-auto mb-3">
                <i className="ri-mail-line text-gold-400 w-5 h-5 flex items-center justify-center" />
              </div>
              <h4 className="text-white font-medium text-sm mb-1">Email Us</h4>
              <p className="text-xs text-white/40">support@aiearners.com</p>
              <p className="text-[10px] text-emerald-400 mt-1">Avg response: 2 hrs</p>
            </div>
            <a
              href="https://wa.me/2348145375816"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-surface-card border border-dark-700/40 rounded-xl p-5 text-center hover:border-emerald-400/30 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-emerald-500/20 transition-colors">
                <i className="ri-whatsapp-line text-emerald-400 w-5 h-5 flex items-center justify-center" />
              </div>
              <h4 className="text-white font-medium text-sm mb-1">WhatsApp</h4>
              <p className="text-xs text-white/40">+234 814 537 5816</p>
              <p className="text-[10px] text-emerald-400 mt-1">Usually instant</p>
            </a>
            <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5 text-center">
              <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center mx-auto mb-3">
                <i className="ri-message-3-line text-gold-400 w-5 h-5 flex items-center justify-center" />
              </div>
              <h4 className="text-white font-medium text-sm mb-1">Live Chat</h4>
              <p className="text-xs text-white/40">Available in dashboard</p>
              <p className="text-[10px] text-emerald-400 mt-1">24/7 online</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}