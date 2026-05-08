import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

interface LoanModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function LoanModal({ onClose, onSuccess }: LoanModalProps) {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState('1');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const numAmount = Number(amount);
    if (!amount || numAmount <= 0) {
      setErrorMsg('Please enter a valid loan amount.');
      setStatus('error');
      return;
    }
    if (!reason.trim()) {
      setErrorMsg('Please provide a reason for the loan.');
      setStatus('error');
      return;
    }

    setStatus('submitting');

    const { error } = await supabase.from('loans').insert({
      user_id: user?.id ?? 'demo-user-001',
      user_name: user?.user_metadata?.full_name ?? 'Demo User',
      user_email: user?.email ?? 'demo@example.com',
      amount: numAmount,
      reason: reason.trim(),
      duration_months: Number(duration),
      status: 'pending',
    });

    if (error) {
      setStatus('error');
      setErrorMsg(error.message);
      return;
    }

    setStatus('success');
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-card border border-dark-700/50 rounded-xl p-6 md:p-8 w-full max-w-md">
        {status === 'success' ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <i className="ri-check-line text-emerald-400 text-2xl w-6 h-6 flex items-center justify-center" />
            </div>
            <h3 className="text-white font-semibold mb-2">Loan Application Submitted!</h3>
            <p className="text-sm text-white/50">
              Your loan request is under review. You will be notified once it is approved.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-gold-500/10 flex items-center justify-center">
                  <i className="ri-hand-coin-line text-gold-400 text-lg w-5 h-5 flex items-center justify-center" />
                </div>
                <h3 className="text-white font-semibold text-lg">Apply for Loan</h3>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors"
              >
                <i className="ri-close-line w-5 h-5 flex items-center justify-center" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2 text-xs text-red-400">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs text-white/50 mb-1.5">Loan Amount (₦)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 5000"
                  min="100"
                  className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors"
                />
                <p className="text-[10px] text-white/30 mt-1">Min: ₦100 | Max depends on your account standing</p>
              </div>

              <div>
                <label className="block text-xs text-white/50 mb-1.5">Repayment Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400/50 transition-colors"
                >
                  <option value="1">1 Month</option>
                  <option value="2">2 Months</option>
                  <option value="3">3 Months</option>
                  <option value="6">6 Months</option>
                  <option value="12">12 Months</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-white/50 mb-1.5">Reason for Loan</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Briefly describe why you need this loan..."
                  maxLength={500}
                  rows={3}
                  className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors resize-none"
                />
                <p className="text-[10px] text-white/30 mt-1">{reason.length}/500 characters</p>
              </div>

              <div className="bg-gold-500/5 border border-gold-400/10 rounded-md p-3">
                <p className="text-xs text-white/50">
                  Loan requests are reviewed within 24-48 hours. Approved loans are credited directly to your wallet.
                </p>
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
                  <>Submit Loan Application</>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}