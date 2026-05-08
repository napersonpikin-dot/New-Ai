import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface UserRow {
  id: number;
  name: string;
  email: string;
  status: string;
  role?: string | null;
  robots: number;
  earnings: string;
  welcome_bonus: string;
  balance: string;
  referral_bonus: string;
  joined: string;
}

interface UserEditModalProps {
  user: UserRow | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

function parseNaira(value: string | number | null | undefined): number {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const cleaned = String(value).replace(/[^\d.]/g, '');
  return parseFloat(cleaned) || 0;
}

export default function UserEditModal({ user, isOpen, onClose, onSaved }: UserEditModalProps) {
  const [form, setForm] = useState<Partial<UserRow>>();
  const [original, setOriginal] = useState<Record<string, any>>();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        status: user.status || 'active',
        role: user.role || 'user',
        robots: user.robots ?? 0,
        earnings: parseNaira(user.earnings),
        welcome_bonus: parseNaira(user.welcome_bonus),
        balance: parseNaira(user.balance),
        referral_bonus: parseNaira(user.referral_bonus),
      });
      // Track original values for audit
      setOriginal({
        full_name: user.name || '',
        email: user.email || '',
        status: user.status || 'active',
        role: user.role || 'user',
        robots_owned: user.robots ?? 0,
        total_earnings: parseNaira(user.earnings),
        welcome_bonus: parseNaira(user.welcome_bonus),
        balance: parseNaira(user.balance),
        referral_bonus: parseNaira(user.referral_bonus),
      });
    }
    setError('');
    setShowSaved(false);
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleChange = (field: keyof UserRow, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!supabase) {
      setError('Supabase is not connected.');
      return;
    }
    setSaving(true);
    setError('');

    const updatePayload = {
      full_name: form.name || null,
      email: form.email || null,
      status: form.status || null,
      role: form.role || null,
      robots_owned: Number(form.robots) || 0,
      total_earnings: Number(form.earnings) || 0,
      welcome_bonus: Number(form.welcome_bonus) || 0,
      balance: Number(form.balance) || 0,
      referral_bonus: Number(form.referral_bonus) || 0,
      updated_at: new Date().toISOString(),
    };

    const { error: saveErr } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', user.id);

    if (saveErr) {
      setSaving(false);
      setError(saveErr.message || 'Failed to save changes.');
      return;
    }

    // Build audit entries for changed fields
    const auditEntries: any[] = [];
    const fieldMap: Record<string, { old: any; new: any }> = {
      full_name: { old: original.full_name, new: updatePayload.full_name },
      email: { old: original.email, new: updatePayload.email },
      status: { old: original.status, new: updatePayload.status },
      role: { old: original.role, new: updatePayload.role },
      robots_owned: { old: original.robots_owned, new: updatePayload.robots_owned },
      total_earnings: { old: original.total_earnings, new: updatePayload.total_earnings },
      welcome_bonus: { old: original.welcome_bonus, new: updatePayload.welcome_bonus },
      balance: { old: original.balance, new: updatePayload.balance },
      referral_bonus: { old: original.referral_bonus, new: updatePayload.referral_bonus },
    };

    for (const [field, vals] of Object.entries(fieldMap)) {
      const oldVal = vals.old ?? '';
      const newVal = vals.new ?? '';
      if (String(oldVal) !== String(newVal)) {
        auditEntries.push({
          target_profile_id: user.id,
          target_user_email: user.email || null,
          action_type: 'edit_profile',
          field_name: field,
          old_value: String(oldVal),
          new_value: String(newVal),
        });
      }
    }

    if (auditEntries.length > 0) {
      await supabase.from('admin_audit_log').insert(auditEntries);
    }

    setSaving(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2500);
    onSaved();
  };

  const fieldClass =
    'w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors';
  const labelClass = 'block text-xs text-white/50 mb-1.5';

  const sectionTitle = (text: string) => (
    <div className="flex items-center gap-2 mb-3">
      <div className="h-px flex-1 bg-dark-700/40" />
      <span className="text-[10px] text-white/30 uppercase tracking-wider font-medium">{text}</span>
      <div className="h-px flex-1 bg-dark-700/40" />
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-dark-900 border border-dark-700/50 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-dark-700/50 sticky top-0 bg-dark-900 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gold-500/10 flex items-center justify-center">
              <i className="ri-user-settings-line text-gold-400 w-4 h-4 flex items-center justify-center" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-sm">Edit Member</h2>
              <p className="text-[10px] text-white/30">{user.name || 'Unknown'} · ID: {user.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors"
            aria-label="Close"
          >
            <i className="ri-close-line w-5 h-5 flex items-center justify-center" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 flex flex-col gap-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2 text-xs text-red-400">
              {error}
            </div>
          )}

          {showSaved && (
            <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-md px-3 py-2 text-xs text-emerald-400 flex items-center gap-1.5">
              <i className="ri-check-line w-3 h-3 flex items-center justify-center" />
              Changes saved successfully.
            </div>
          )}

          {/* Basic Info */}
          {sectionTitle('Basic Info')}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Full Name</label>
              <input
                type="text"
                value={form.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                className={fieldClass}
              />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                value={form.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                className={fieldClass}
              />
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select
                value={form.status || 'active'}
                onChange={(e) => handleChange('status', e.target.value)}
                className={fieldClass}
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Role</label>
              <select
                value={form.role || 'user'}
                onChange={(e) => handleChange('role', e.target.value)}
                className={fieldClass}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Financials */}
          {sectionTitle('Financials')}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Balance (₦)</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.balance ?? 0}
                onChange={(e) => handleChange('balance', parseFloat(e.target.value) || 0)}
                className={fieldClass}
              />
            </div>
            <div>
              <label className={labelClass}>Total Earnings (₦)</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.earnings ?? 0}
                onChange={(e) => handleChange('earnings', parseFloat(e.target.value) || 0)}
                className={fieldClass}
              />
            </div>
            <div>
              <label className={labelClass}>Welcome Bonus (₦)</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.welcome_bonus ?? 0}
                onChange={(e) => handleChange('welcome_bonus', parseFloat(e.target.value) || 0)}
                className={fieldClass}
              />
            </div>
            <div>
              <label className={labelClass}>Referral Bonus (₦)</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.referral_bonus ?? 0}
                onChange={(e) => handleChange('referral_bonus', parseFloat(e.target.value) || 0)}
                className={fieldClass}
              />
            </div>
          </div>

          {/* Stats */}
          {sectionTitle('Stats')}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Robots Owned</label>
              <input
                type="number"
                min={0}
                step={1}
                value={form.robots ?? 0}
                onChange={(e) => handleChange('robots', parseInt(e.target.value, 10) || 0)}
                className={fieldClass}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-dark-700/50 flex items-center justify-end gap-2 sticky bottom-0 bg-dark-900 z-10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-xs text-white/60 hover:text-white border border-white/10 hover:border-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-md text-xs font-semibold bg-gold-500 hover:bg-gold-600 text-dark-900 transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            {saving && <i className="ri-loader-4-line animate-spin w-3 h-3 flex items-center justify-center" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}