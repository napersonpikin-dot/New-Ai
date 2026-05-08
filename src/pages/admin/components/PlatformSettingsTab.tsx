import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Setting {
  id: number;
  key: string;
  value: string;
  description: string;
}

const SETTING_LABELS: Record<string, string> = {
  min_withdrawal: 'Minimum Withdrawal (₦)',
  referral_rate_percent: 'Referral Rate (%)',
  robot_base_price: 'Robot Base Price (₦)',
  daily_earnings_multiplier: 'Daily Earnings Multiplier',
  max_robots_per_user: 'Max Robots Per User',
  withdrawal_fee_percent: 'Withdrawal Fee (%)',
  signup_bonus: 'Signup Bonus (₦)',
  kyc_required_for_withdrawal: 'KYC Required for Withdrawal',
};

const SETTING_TYPES: Record<string, 'number' | 'boolean' | 'text'> = {
  min_withdrawal: 'number',
  referral_rate_percent: 'number',
  robot_base_price: 'number',
  daily_earnings_multiplier: 'number',
  max_robots_per_user: 'number',
  withdrawal_fee_percent: 'number',
  signup_bonus: 'number',
  kyc_required_for_withdrawal: 'boolean',
};

export default function PlatformSettingsTab() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; show: boolean }>({ msg: '', show: false });

  const showNotification = (msg: string) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast({ msg: '', show: false }), 3000);
  };

  const loadSettings = async () => {
    if (!supabase) return;
    const { data, error } = await supabase.from('platform_settings').select('*').order('key');
    if (error) showNotification('Failed to load settings.');
    else setSettings((data as Setting[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const updateSetting = (id: number, newValue: string) => {
    setSettings((prev) => prev.map((s) => (s.id === id ? { ...s, value: newValue } : s)));
  };

  const saveAll = async () => {
    if (!supabase) return;
    setSaving(true);
    try {
      for (const s of settings) {
        await supabase
          .from('platform_settings')
          .update({ value: s.value, updated_at: new Date().toISOString() })
          .eq('id', s.id);
      }
      showNotification('Platform settings saved successfully.');
    } catch {
      showNotification('Failed to save some settings.');
    } finally {
      setSaving(false);
    }
  };

  const renderInput = (s: Setting) => {
    const type = SETTING_TYPES[s.key] || 'text';
    if (type === 'boolean') {
      return (
        <select
          value={s.value}
          onChange={(e) => updateSetting(s.id, e.target.value)}
          className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400/50 transition-colors"
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      );
    }
    if (type === 'number') {
      return (
        <input
          type="number"
          value={s.value}
          onChange={(e) => updateSetting(s.id, e.target.value)}
          step={s.key.includes('multiplier') ? '0.1' : '1'}
          className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors"
        />
      );
    }
    return (
      <input
        type="text"
        value={s.value}
        onChange={(e) => updateSetting(s.id, e.target.value)}
        className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors"
      />
    );
  };

  return (
    <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5 md:p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-white font-semibold text-base">Platform Settings</h3>
          <p className="text-xs text-white/40 mt-0.5">
            Configure site-wide parameters that affect all members
          </p>
        </div>
        <button
          onClick={saveAll}
          disabled={saving || loading}
          className="bg-gold-500 hover:bg-gold-600 disabled:opacity-40 text-dark-900 font-semibold px-4 py-2 rounded-md transition-colors text-sm flex items-center gap-2 whitespace-nowrap"
        >
          <i className="ri-save-line w-4 h-4 flex items-center justify-center" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-white/40 py-8 text-center">Loading settings...</div>
      ) : settings.length === 0 ? (
        <div className="text-sm text-white/40 py-8 text-center">
          No settings found. Run the seed script to populate defaults.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {settings.map((s) => (
            <div key={s.id} className="bg-dark-800/40 border border-dark-700/30 rounded-lg p-4">
              <label className="block text-sm text-white font-medium mb-1">
                {SETTING_LABELS[s.key] || s.key}
              </label>
              <p className="text-[10px] text-white/40 mb-2.5">{s.description}</p>
              {renderInput(s)}
            </div>
          ))}
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 bg-surface-card border border-gold-400/30 rounded-lg px-4 py-3 flex items-center gap-2 shadow-lg">
          <i className="ri-check-line text-gold-400 w-4 h-4 flex items-center justify-center" />
          <span className="text-sm text-white">{toast.msg}</span>
        </div>
      )}
    </div>
  );
}