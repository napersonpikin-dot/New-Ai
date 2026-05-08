import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Setting {
  id: number;
  key: string;
  label: string;
  min_amount: number;
  enabled: boolean;
  description: string;
  updated_at: string;
}

const sourceConfig: Record<string, { icon: string; color: string; bg: string }> = {
  earnings: { icon: 'ri-coins-line', color: 'text-sky-400', bg: 'bg-sky-500/10' },
  balance: { icon: 'ri-wallet-3-line', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  referral: { icon: 'ri-user-add-line', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  welcome: { icon: 'ri-gift-line', color: 'text-violet-400', bg: 'bg-violet-500/10' },
};

export default function WithdrawalSettingsTab() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; show: boolean }>({ msg: '', show: false });

  const showNotification = (msg: string) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast({ msg: '', show: false }), 3000);
  };

  const loadSettings = async () => {
    if (!supabase) { setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from('withdrawal_settings')
      .select('*')
      .order('id');
    if (error) {
      showNotification('Failed to load settings.');
    } else {
      setSettings((data as Setting[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const updateSetting = async (id: number, updates: Partial<Setting>) => {
    if (!supabase) return;
    setSaving(true);
    const { error } = await supabase
      .from('withdrawal_settings')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      showNotification('Failed to save setting.');
    } else {
      setSettings((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
      );
      showNotification('Setting saved successfully.');
    }
    setSaving(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5 md:p-6">
        <div className="mb-5">
          <h3 className="text-white font-semibold text-base">Withdrawal Settings</h3>
          <p className="text-xs text-white/40 mt-0.5">
            Configure minimum withdrawal amounts and enable/disable withdrawal sources.
          </p>
        </div>

        {loading ? (
          <div className="text-sm text-white/40 py-8 text-center">Loading settings...</div>
        ) : (
          <div className="flex flex-col gap-4">
            {settings.map((s) => {
              const cfg = sourceConfig[s.key] || sourceConfig.earnings;
              return (
                <div
                  key={s.id}
                  className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border transition-all ${
                    s.enabled ? 'border-dark-700/40 bg-dark-800/30' : 'border-dark-700/20 bg-dark-800/10 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-[180px]">
                    <div className={`w-10 h-10 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0`}>
                      <i className={`${cfg.icon} ${cfg.color} w-5 h-5 flex items-center justify-center`} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{s.label}</div>
                      <div className="text-[11px] text-white/40">{s.description}</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/50 whitespace-nowrap">Min Amount (₦)</span>
                      <input
                        type="number"
                        value={s.min_amount}
                        onChange={(e) =>
                          setSettings((prev) =>
                            prev.map((x) =>
                              x.id === s.id ? { ...x, min_amount: Number(e.target.value) } : x
                            )
                          )
                        }
                        onBlur={() => updateSetting(s.id, { min_amount: s.min_amount })}
                        min={1}
                        className="w-24 bg-dark-800 border border-dark-700/50 rounded-md px-2 py-1.5 text-sm text-white focus:outline-none focus:border-gold-400/50 transition-colors"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={s.enabled}
                          onChange={(e) => updateSetting(s.id, { enabled: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-dark-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
                      </label>
                      <span className={`text-xs ${s.enabled ? 'text-emerald-400' : 'text-white/40'}`}>
                        {s.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>

                  <div className="text-[10px] text-white/25 shrink-0 sm:text-right">
                    Updated {new Date(s.updated_at).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {saving && (
          <div className="mt-4 flex items-center gap-2 text-xs text-gold-400">
            <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center" />
            Saving...
          </div>
        )}
      </div>

      <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5 md:p-6">
        <h3 className="text-white font-semibold text-base mb-3">How These Settings Work</h3>
        <div className="flex flex-col gap-2 text-sm text-white/50">
          <p>
            <strong className="text-white/70">Minimum Amount:</strong> Members cannot request a withdrawal lower than this value from the selected wallet.
          </p>
          <p>
            <strong className="text-white/70">Enable/Disable:</strong> When disabled, the wallet type will not appear in the withdrawal modal. Members can still see their balance, but cannot withdraw from it.
          </p>
          <p>
            <strong className="text-white/70">Global Rules:</strong> A withdrawal must satisfy both the minimum amount rule AND have sufficient balance in the selected wallet.
          </p>
        </div>
      </div>

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