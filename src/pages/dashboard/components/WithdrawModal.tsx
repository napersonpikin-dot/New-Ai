import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

interface WalletBalance {
  earnings: number;
  balance: number;
  referral: number;
  welcome: number;
}

interface WithdrawalSetting {
  key: string;
  label: string;
  min_amount: number;
  enabled: boolean;
}

interface WithdrawModalProps {
  onClose: () => void;
  onSuccess: () => void;
  wallets: WalletBalance;
}

const sources = [
  {
    key: 'earnings' as const,
    label: 'Total Earnings',
    icon: 'ri-coins-line',
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-400/20',
    hover: 'hover:border-sky-400/30',
    accentBg: 'bg-sky-500/15',
    desc: 'Income from your active robots',
  },
  {
    key: 'balance' as const,
    label: 'Wallet Balance',
    icon: 'ri-wallet-3-line',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-400/20',
    hover: 'hover:border-emerald-400/30',
    accentBg: 'bg-emerald-500/15',
    desc: 'Funds available in your wallet',
  },
  {
    key: 'referral' as const,
    label: 'Referral Bonus',
    icon: 'ri-user-add-line',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-400/20',
    hover: 'hover:border-amber-400/30',
    accentBg: 'bg-amber-500/15',
    desc: 'Bonuses earned from referrals',
  },
  {
    key: 'welcome' as const,
    label: 'Welcome Bonus',
    icon: 'ri-gift-line',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-400/20',
    hover: 'hover:border-violet-400/30',
    accentBg: 'bg-violet-500/15',
    desc: 'Your welcome signup bonus',
  },
];

const methods = [
  { key: 'crypto', label: 'Crypto (USDT)', icon: 'ri-coin-line' },
  { key: 'bank', label: 'Bank Transfer / Naira', icon: 'ri-bank-card-line' },
  { key: 'paypal', label: 'PayPal', icon: 'ri-paypal-line' },
];

export default function WithdrawModal({ onClose, onSuccess, wallets }: WithdrawModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<'source' | 'details' | 'success'>('source');
  const [selectedSource, setSelectedSource] = useState<keyof WalletBalance>('earnings');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('crypto');
  const [walletAddress, setWalletAddress] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [settings, setSettings] = useState<Record<string, WithdrawalSetting>>();
  const [settingsLoading, setSettingsLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      if (!supabase) { setSettingsLoading(false); return; }
      const { data, error } = await supabase.from('withdrawal_settings').select('*');
      if (!error && data) {
        const map: Record<string, WithdrawalSetting> = {};
        (data as WithdrawalSetting[]).forEach((s) => { map[s.key] = s; });
        setSettings(map);
      }
      setSettingsLoading(false);
    }
    loadSettings();
  }, []);

  const activeSource = sources.find((s) => s.key === selectedSource)!;
  const setting = settings[selectedSource];
  const minAmount = setting?.min_amount || 10;
  const maxAmount = Math.max(0, wallets[selectedSource] || 0);

  const handleSelectSource = (key: keyof WalletBalance) => {
    const s = settings[key as string];
    if (s && !s.enabled) return;
    setSelectedSource(key);
    setAmount('');
    setErrorMsg('');
    setStep('details');
  };

  const handleBack = () => {
    setStep('source');
    setAmount('');
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const numAmount = Number(amount);
    if (!amount || numAmount <= 0) {
      setErrorMsg('Please enter a valid amount.');
      return;
    }
    if (numAmount > maxAmount) {
      setErrorMsg(`Insufficient ${activeSource.label.toLowerCase()}. Max available: ₦${maxAmount.toLocaleString()}`);
      return;
    }
    if (numAmount < minAmount) {
      setErrorMsg(`Minimum withdrawal for ${activeSource.label} is ₦${minAmount.toLocaleString()}.`);
      return;
    }
    if (!walletAddress.trim()) {
      setErrorMsg('Please enter your wallet address or account details.');
      return;
    }

    setStatus('submitting');

    const { error } = await supabase.from('withdrawals').insert({
      user_id: user?.id ?? 'demo-user-001',
      user_name: user?.user_metadata?.full_name ?? 'Demo User',
      user_email: user?.email ?? 'demo@example.com',
      amount: numAmount,
      withdrawal_source: selectedSource,
      method: method === 'crypto' ? 'Crypto (USDT)' : method === 'bank' ? 'Bank Transfer / Naira' : 'PayPal',
      status: 'pending',
      wallet_address: walletAddress.trim(),
    });

    if (error) {
      setStatus('idle');
      setErrorMsg(error.message);
      return;
    }

    setStep('success');
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 2000);
  };

  if (settingsLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-surface-card border border-dark-700/50 rounded-xl p-8 w-full max-w-lg text-center">
          <i className="ri-loader-4-line animate-spin text-gold-400 text-2xl w-6 h-6 flex items-center justify-center mx-auto mb-3" />
          <p className="text-sm text-white/50">Loading withdrawal settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-card border border-dark-700/50 rounded-xl p-6 md:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {step === 'details' && (
              <button
                onClick={handleBack}
                className="w-8 h-8 rounded-lg bg-dark-800 flex items-center justify-center text-white/50 hover:text-white transition-colors"
              >
                <i className="ri-arrow-left-line w-4 h-4 flex items-center justify-center" />
              </button>
            )}
            <h3 className="text-white font-semibold text-lg">
              {step === 'source' && 'Withdraw Funds'}
              {step === 'details' && 'Enter Details'}
              {step === 'success' && 'Success!'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors"
          >
            <i className="ri-close-line w-5 h-5 flex items-center justify-center" />
          </button>
        </div>

        {/* Step 1: Select Source */}
        {step === 'source' && (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-white/50 mb-1">
              Select which wallet you want to withdraw from.
            </p>
            {sources.map((s) => {
              const available = wallets[s.key] || 0;
              const hasFunds = available > 0;
              const st = settings[s.key];
              const isEnabled = st?.enabled !== false;
              const min = st?.min_amount || 10;

              if (!isEnabled) return null; // Hide disabled sources

              return (
                <button
                  key={s.key}
                  onClick={() => hasFunds && handleSelectSource(s.key)}
                  disabled={!hasFunds}
                  className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                    hasFunds
                      ? `${s.bg} ${s.border} ${s.hover} cursor-pointer`
                      : 'bg-dark-800/40 border-dark-700/30 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg ${s.accentBg} flex items-center justify-center shrink-0`}>
                    <i className={`${s.icon} ${s.color} text-base w-5 h-5 flex items-center justify-center`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">{s.label}</span>
                      <span className={`text-sm font-bold ${s.color}`}>
                        ₦{available.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/40 mt-0.5">
                      {s.desc} &middot; Min: ₦{min.toLocaleString()}
                    </p>
                  </div>
                  {hasFunds && (
                    <div className="w-6 h-6 rounded-full bg-dark-700/50 flex items-center justify-center shrink-0">
                      <i className="ri-arrow-right-line text-white/40 text-xs w-4 h-4 flex items-center justify-center" />
                    </div>
                  )}
                  {!hasFunds && (
                    <span className="text-[10px] text-white/30 shrink-0">Empty</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Step 2: Details */}
        {step === 'details' && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Source summary bar */}
            <div className={`flex items-center gap-3 p-3 rounded-lg border ${activeSource.bg} ${activeSource.border}`}>
              <div className={`w-8 h-8 rounded-lg ${activeSource.accentBg} flex items-center justify-center`}>
                <i className={`${activeSource.icon} ${activeSource.color} w-4 h-4 flex items-center justify-center`} />
              </div>
              <div>
                <p className="text-xs text-white/70">Withdrawing from <span className={`font-medium ${activeSource.color}`}>{activeSource.label}</span></p>
                <p className="text-[11px] text-white/40">Available: ₦{maxAmount.toLocaleString()} &middot; Min: ₦{minAmount.toLocaleString()}</p>
              </div>
            </div>

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2 text-xs text-red-400">
                {errorMsg}
              </div>
            )}

            {/* Amount */}
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Amount (₦)</label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`Min ₦${minAmount.toLocaleString()}`}
                  min={minAmount}
                  max={maxAmount}
                  className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 pr-20 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setAmount(String(maxAmount))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gold-400 hover:text-gold-300 font-medium px-2 py-1 rounded bg-gold-500/10 transition-colors"
                >
                  MAX
                </button>
              </div>
              <p className="text-[10px] text-white/30 mt-1">
                Available: ₦{maxAmount.toLocaleString()} &middot; Min: ₦{minAmount.toLocaleString()}
              </p>
            </div>

            {/* Method */}
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Withdrawal Method</label>
              <div className="grid grid-cols-3 gap-2">
                {methods.map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setMethod(m.key)}
                    className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-lg border text-[11px] transition-all ${
                      method === m.key
                        ? 'bg-gold-500/10 border-gold-400/30 text-gold-400'
                        : 'bg-dark-800 border-dark-700/40 text-white/50 hover:text-white/70'
                    }`}
                  >
                    <i className={`${m.icon} w-4 h-4 flex items-center justify-center`} />
                    <span className="text-center leading-tight">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Wallet / Account */}
            <div>
              <label className="block text-xs text-white/50 mb-1.5">
                {method === 'crypto'
                  ? 'Wallet Address'
                  : method === 'bank'
                  ? 'Bank Account / IBAN'
                  : 'PayPal Email'}
              </label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder={
                  method === 'crypto'
                    ? 'e.g. 0x7f...a3b2'
                    : method === 'bank'
                    ? 'Enter account number or IBAN'
                    : 'you@example.com'
                }
                className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors"
              />
            </div>

            {/* Info */}
            <div className="bg-gold-500/5 border border-gold-400/10 rounded-md p-3">
              <p className="text-xs text-white/50">
                Withdrawals are processed within 24 hours. Ensure your details are correct in{' '}
                <Link to="/dashboard/settings" className="text-gold-400 hover:underline" onClick={onClose}>
                  Settings
                </Link>
                .
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
                <>Confirm Withdrawal</>
              )}
            </button>
          </form>
        )}

        {/* Step 3: Success */}
        {step === 'success' && (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <i className="ri-check-line text-emerald-400 text-2xl w-6 h-6 flex items-center justify-center" />
            </div>
            <h3 className="text-white font-semibold mb-2">Withdrawal Submitted!</h3>
            <p className="text-sm text-white/50">
              Your ₦{Number(amount).toLocaleString()} withdrawal from {activeSource.label} is pending admin approval.
              Processing typically takes 24 hours.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}