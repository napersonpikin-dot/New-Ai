import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function DashboardSettings() {
  const [tab, setTab] = useState<'profile' | 'security' | 'withdrawal' | 'verification'>('profile');
  const [saved, setSaved] = useState(false);

  // Profile
  const [profile, setProfile] = useState({
    fullName: 'Michael Turner',
    displayName: 'mike_t',
    email: 'mike.turner@email.com',
    phone: '+44 7700 900123',
    country: 'United Kingdom',
    timezone: 'Europe/London',
    bio: 'Early adopter and passive income enthusiast. Building my robot fleet since 2025.',
  });

  // Security
  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirm: '',
    twoFA: false,
  });

  // Withdrawal
  const [withdrawal, setWithdrawal] = useState({
    primaryMethod: 'crypto',
    cryptoAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f8dEeF',
    cryptoNetwork: 'Ethereum (ERC-20)',
    bankName: 'Barclays Bank',
    accountNumber: '**** **** **** 4521',
    swiftCode: 'BARCGB22',
    minWithdrawal: '50',
    autoWithdraw: false,
    autoThreshold: '200',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const tabs = [
    { key: 'profile' as const, label: 'Profile', icon: 'ri-user-line' },
    { key: 'security' as const, label: 'Security', icon: 'ri-shield-keyhole-line' },
    { key: 'withdrawal' as const, label: 'Withdrawal', icon: 'ri-wallet-3-line' },
    { key: 'verification' as const, label: 'Verification', icon: 'ri-shield-check-line' },
  ];

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
              to="/admin"
              className="hidden sm:flex text-sm text-white/60 hover:text-white transition-colors whitespace-nowrap items-center gap-1"
            >
              <i className="ri-dashboard-line w-4 h-4 flex items-center justify-center" />
              Admin
            </Link>
            <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 text-xs font-bold">
              MT
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Account Settings</h1>
            <p className="text-sm text-white/50">Manage your profile, security, and withdrawal preferences.</p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-dark-800/60 border border-dark-700/40 rounded-lg p-1 mb-8 w-fit">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-all whitespace-nowrap ${
                  tab === t.key
                    ? 'bg-gold-500 text-dark-900 font-semibold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <i className={`${t.icon} w-4 h-4 flex items-center justify-center`} />
                {t.label}
              </button>
            ))}
          </div>

          {/* Success Toast */}
          {saved && (
            <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-3 flex items-center gap-2">
              <i className="ri-check-line text-emerald-400 w-4 h-4 flex items-center justify-center" />
              <span className="text-sm text-emerald-400">Changes saved successfully.</span>
            </div>
          )}

          {/* Profile Tab */}
          {tab === 'profile' && (
            <div className="bg-surface-card border border-dark-700/40 rounded-xl p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
                <div className="w-20 h-20 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 text-xl font-bold shrink-0">
                  MT
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">{profile.fullName}</h3>
                  <p className="text-sm text-white/40">@{profile.displayName}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className="text-[10px] bg-gold-500/10 text-gold-400 border border-gold-400/20 px-2 py-0.5 rounded-full">
                      Verified Member
                    </span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-400/20 px-2 py-0.5 rounded-full">
                      Active Robots: 3
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Display Name</label>
                  <input
                    type="text"
                    value={profile.displayName}
                    onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                    className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Phone</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Country</label>
                  <input
                    type="text"
                    value={profile.country}
                    onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                    className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Timezone</label>
                  <select
                    value={profile.timezone}
                    onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                    className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400/50 transition-colors"
                  >
                    <option>Europe/London</option>
                    <option>America/New_York</option>
                    <option>America/Los_Angeles</option>
                    <option>Asia/Tokyo</option>
                    <option>Asia/Dubai</option>
                    <option>Australia/Sydney</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs text-white/50 mb-1.5">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={3}
                  maxLength={500}
                  className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400/50 transition-colors resize-none"
                />
                <p className="text-[10px] text-white/30 mt-1">{profile.bio.length}/500</p>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button className="text-sm text-white/50 hover:text-white transition-colors px-4 py-2">
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-gold-500 hover:bg-gold-600 text-dark-900 font-semibold px-5 py-2 rounded-md transition-colors text-sm flex items-center gap-2"
                >
                  <i className="ri-save-line w-4 h-4 flex items-center justify-center" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {tab === 'security' && (
            <div className="bg-surface-card border border-dark-700/40 rounded-xl p-6 md:p-8">
              <div className="mb-8">
                <h3 className="text-white font-semibold text-lg mb-1">Change Password</h3>
                <p className="text-sm text-white/40">Update your password to keep your account secure.</p>
              </div>

              <div className="flex flex-col gap-4 mb-8 max-w-md">
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Current Password</label>
                  <input
                    type="password"
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400/50 transition-colors"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">New Password</label>
                  <input
                    type="password"
                    value={passwords.newPass}
                    onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                    className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400/50 transition-colors"
                    placeholder="Min. 8 characters"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400/50 transition-colors"
                    placeholder="Repeat new password"
                  />
                </div>
              </div>

              <div className="border-t border-dark-700/40 pt-8 mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold text-base mb-1">Two-Factor Authentication</h3>
                    <p className="text-sm text-white/40">Add an extra layer of security to your account.</p>
                  </div>
                  <button
                    onClick={() => setPasswords({ ...passwords, twoFA: !passwords.twoFA })}
                    className={`w-12 h-6 rounded-full transition-all relative ${
                      passwords.twoFA ? 'bg-gold-500' : 'bg-dark-700'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${
                        passwords.twoFA ? 'left-6' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
                {passwords.twoFA && (
                  <div className="mt-4 bg-gold-500/5 border border-gold-400/10 rounded-md p-3">
                    <p className="text-xs text-gold-400/80">
                      Two-Factor Authentication is enabled. You will receive a verification code via email each time you sign in from a new device.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3">
                <button className="text-sm text-white/50 hover:text-white transition-colors px-4 py-2">
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-gold-500 hover:bg-gold-600 text-dark-900 font-semibold px-5 py-2 rounded-md transition-colors text-sm flex items-center gap-2"
                >
                  <i className="ri-save-line w-4 h-4 flex items-center justify-center" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Verification Tab */}
          {tab === 'verification' && (
            <div className="bg-surface-card border border-dark-700/40 rounded-xl p-6 md:p-8">
              <div className="flex flex-col items-center text-center py-8">
                <div className="w-16 h-16 rounded-full bg-sky-500/10 border border-sky-400/20 flex items-center justify-center mb-4">
                  <i className="ri-shield-check-line text-sky-400 text-2xl w-6 h-6 flex items-center justify-center" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-1">Identity Verification</h3>
                <p className="text-sm text-white/50 mb-6 max-w-md">
                  Verify your identity to unlock higher withdrawal limits, receive a verified badge on your profile, and access premium platform features.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg mb-6">
                  <div className="bg-dark-800/40 border border-dark-700/30 rounded-lg p-3 text-center">
                    <div className="text-sm text-white font-medium mb-0.5">Higher Limits</div>
                    <div className="text-[10px] text-white/40">Up to ₦50K / withdrawal</div>
                  </div>
                  <div className="bg-dark-800/40 border border-dark-700/30 rounded-lg p-3 text-center">
                    <div className="text-sm text-white font-medium mb-0.5">Verified Badge</div>
                    <div className="text-[10px] text-white/40">Trust &amp; credibility</div>
                  </div>
                  <div className="bg-dark-800/40 border border-dark-700/30 rounded-lg p-3 text-center">
                    <div className="text-sm text-white font-medium mb-0.5">Priority Support</div>
                    <div className="text-[10px] text-white/40">Faster ticket resolution</div>
                  </div>
                </div>
                <Link
                  to="/kyc"
                  className="bg-gold-500 hover:bg-gold-600 text-dark-900 font-semibold px-6 py-2.5 rounded-md transition-colors text-sm flex items-center gap-2"
                >
                  <i className="ri-shield-user-line w-4 h-4 flex items-center justify-center" />
                  Start Verification
                </Link>
              </div>
            </div>
          )}

          {/* Withdrawal Tab */}
          {tab === 'withdrawal' && (
            <div className="bg-surface-card border border-dark-700/40 rounded-xl p-6 md:p-8">
              <div className="mb-8">
                <h3 className="text-white font-semibold text-lg mb-1">Withdrawal Preferences</h3>
                <p className="text-sm text-white/40">Configure how and where you receive your robot earnings.</p>
              </div>

              {/* Primary Method */}
              <div className="mb-6">
                <label className="block text-xs text-white/50 mb-2">Primary Withdrawal Method</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'crypto', label: 'Crypto Wallet', icon: 'ri-coin-line' },
                    { key: 'bank', label: 'Bank Transfer', icon: 'ri-bank-card-line' },
                    { key: 'paypal', label: 'PayPal', icon: 'ri-paypal-line' },
                  ].map((m) => (
                    <button
                      key={m.key}
                      onClick={() => setWithdrawal({ ...withdrawal, primaryMethod: m.key })}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md border text-sm transition-all whitespace-nowrap ${
                        withdrawal.primaryMethod === m.key
                          ? 'bg-gold-500/10 border-gold-400/30 text-gold-400'
                          : 'bg-dark-800 border-dark-700/40 text-white/50 hover:text-white/70'
                      }`}
                    >
                      <i className={`${m.icon} w-4 h-4 flex items-center justify-center`} />
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Crypto Details */}
              {withdrawal.primaryMethod === 'crypto' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-white/50 mb-1.5">Wallet Address</label>
                    <input
                      type="text"
                      value={withdrawal.cryptoAddress}
                      onChange={(e) => setWithdrawal({ ...withdrawal, cryptoAddress: e.target.value })}
                      className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Network</label>
                    <select
                      value={withdrawal.cryptoNetwork}
                      onChange={(e) => setWithdrawal({ ...withdrawal, cryptoNetwork: e.target.value })}
                      className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400/50 transition-colors"
                    >
                      <option>Ethereum (ERC-20)</option>
                      <option>BNB Smart Chain (BEP-20)</option>
                      <option>Tron (TRC-20)</option>
                      <option>Polygon</option>
                      <option>Solana</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Min. Auto-Withdraw</label>
                    <input
                      type="text"
                      value={withdrawal.minWithdrawal}
                      onChange={(e) => setWithdrawal({ ...withdrawal, minWithdrawal: e.target.value })}
                      className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400/50 transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Bank Details */}
              {withdrawal.primaryMethod === 'bank' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Bank Name</label>
                    <input
                      type="text"
                      value={withdrawal.bankName}
                      onChange={(e) => setWithdrawal({ ...withdrawal, bankName: e.target.value })}
                      className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Account Number</label>
                    <input
                      type="text"
                      value={withdrawal.accountNumber}
                      onChange={(e) => setWithdrawal({ ...withdrawal, accountNumber: e.target.value })}
                      className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">SWIFT / BIC Code</label>
                    <input
                      type="text"
                      value={withdrawal.swiftCode}
                      onChange={(e) => setWithdrawal({ ...withdrawal, swiftCode: e.target.value })}
                      className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Min. Withdrawal ($)</label>
                    <input
                      type="text"
                      value={withdrawal.minWithdrawal}
                      onChange={(e) => setWithdrawal({ ...withdrawal, minWithdrawal: e.target.value })}
                      className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400/50 transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Auto Withdraw */}
              <div className="border-t border-dark-700/40 pt-6 mb-8">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-white font-medium text-sm mb-0.5">Auto-Withdrawal</h4>
                    <p className="text-xs text-white/40">Automatically withdraw when balance reaches threshold.</p>
                  </div>
                  <button
                    onClick={() => setWithdrawal({ ...withdrawal, autoWithdraw: !withdrawal.autoWithdraw })}
                    className={`w-12 h-6 rounded-full transition-all relative ${
                      withdrawal.autoWithdraw ? 'bg-gold-500' : 'bg-dark-700'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${
                        withdrawal.autoWithdraw ? 'left-6' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
                {withdrawal.autoWithdraw && (
                  <div className="max-w-xs">
                    <label className="block text-xs text-white/50 mb-1.5">Auto-Withdraw Threshold ($)</label>
                    <input
                      type="text"
                      value={withdrawal.autoThreshold}
                      onChange={(e) => setWithdrawal({ ...withdrawal, autoThreshold: e.target.value })}
                      className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400/50 transition-colors"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3">
                <button className="text-sm text-white/50 hover:text-white transition-colors px-4 py-2">
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-gold-500 hover:bg-gold-600 text-dark-900 font-semibold px-5 py-2 rounded-md transition-colors text-sm flex items-center gap-2"
                >
                  <i className="ri-save-line w-4 h-4 flex items-center justify-center" />
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}