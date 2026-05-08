import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

interface DepositModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function DepositModal({ onClose, onSuccess }: DepositModalProps) {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('crypto');
  const [txHash, setTxHash] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const numAmount = Number(amount);
    if (!amount || numAmount <= 0) {
      setErrorMsg('Please enter a valid amount.');
      setStatus('error');
      return;
    }
    if (!txHash.trim()) {
      setErrorMsg('Please enter your transaction hash / reference ID.');
      setStatus('error');
      return;
    }

    setStatus('submitting');

    const { error } = await supabase.from('deposits').insert({
      user_id: user?.id ?? 'demo-user-001',
      user_name: user?.user_metadata?.full_name ?? 'Demo User',
      user_email: user?.email ?? 'demo@example.com',
      amount: numAmount,
      method: method === 'crypto' ? 'Crypto (USDT)' : method === 'bank' ? 'Bank Transfer / Naira' : 'PayPal',
      status: 'pending',
      tx_hash: txHash.trim(),
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
    }, 1800);
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
            <h3 className="text-white font-semibold mb-2">Deposit Submitted!</h3>
            <p className="text-sm text-white/50">
              Your deposit request is pending admin approval. You will be notified once confirmed.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-lg">Deposit Funds</h3>
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
                <label className="block text-xs text-white/50 mb-1.5">Amount (₦)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter deposit amount"
                  min="10"
                  className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors"
                />
                <p className="text-[10px] text-white/30 mt-1">Min: ₦10</p>
              </div>

              <div>
                <label className="block text-xs text-white/50 mb-1.5">Deposit Method</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'crypto', label: 'Crypto (USDT)', icon: 'ri-coin-line' },
                    { key: 'bank', label: 'Bank Transfer / Naira', icon: 'ri-bank-card-line' },
                    { key: 'paypal', label: 'PayPal', icon: 'ri-paypal-line' },
                  ].map((m) => (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setMethod(m.key)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md border text-xs transition-all whitespace-nowrap ${
                        method === m.key
                          ? 'bg-gold-500/10 border-gold-400/30 text-gold-400'
                          : 'bg-dark-800 border-dark-700/40 text-white/50 hover:text-white/70'
                      }`}
                    >
                      <i className={`${m.icon} w-3.5 h-3.5 flex items-center justify-center`} />
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/50 mb-1.5">
                  Transaction Hash / Reference ID
                </label>
                <input
                  type="text"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  placeholder="e.g. 0x7f...a3b2 or TRX-88291"
                  className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors"
                />
                <p className="text-[10px] text-white/30 mt-1">
                  Provide proof of payment so admin can verify your deposit.
                </p>
              </div>

              <div className="bg-gold-500/5 border border-gold-400/10 rounded-md p-3">
                <p className="text-xs text-white/50">
                  Deposits require admin approval before reflecting in your balance. Update your wallet details in{' '}
                  <Link to="/dashboard/settings" className="text-gold-400 hover:underline">Settings</Link>.
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
                  <>Confirm Deposit</>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}