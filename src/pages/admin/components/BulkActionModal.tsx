import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface BulkActionModalProps {
  isOpen: boolean;
  selectedIds: number[];
  onClose: () => void;
  onDone: () => void;
}

const ACTIONS = [
  { id: 'suspend', label: 'Mass Suspend', icon: 'ri-user-unfollow-line', color: 'text-red-400', desc: 'Suspend all selected members.' },
  { id: 'activate', label: 'Mass Activate', icon: 'ri-user-follow-line', color: 'text-emerald-400', desc: 'Activate all selected members.' },
  { id: 'credit_welcome', label: 'Credit Welcome Bonus', icon: 'ri-gift-line', color: 'text-violet-400', desc: 'Add welcome bonus to each selected member.' },
  { id: 'credit_referral', label: 'Credit Referral Bonus', icon: 'ri-group-line', color: 'text-amber-400', desc: 'Add referral bonus to each selected member.' },
  { id: 'credit_balance', label: 'Credit Balance', icon: 'ri-wallet-3-line', color: 'text-gold-400', desc: 'Add balance to each selected member.' },
];

export default function BulkActionModal({ isOpen, selectedIds, onClose, onDone }: BulkActionModalProps) {
  const [action, setAction] = useState('');
  const [amount, setAmount] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const needsAmount = action === 'credit_welcome' || action === 'credit_referral' || action === 'credit_balance';
  const selectedAction = ACTIONS.find((a) => a.id === action);

  const reset = () => {
    setAction('');
    setAmount('');
    setConfirmText('');
    setError('');
    setSuccess('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleExecute = async () => {
    if (!supabase) { setError('Supabase is not connected.'); return; }
    if (!action) { setError('Please select an action.'); return; }
    if (needsAmount && (!amount || Number(amount) <= 0)) { setError('Please enter a valid amount.'); return; }
    if (confirmText.trim().toLowerCase() !== 'confirm') { setError('Type "confirm" to proceed.'); return; }

    setProcessing(true);
    setError('');
    setSuccess('');

    try {
      if (action === 'suspend' || action === 'activate') {
        const status = action === 'suspend' ? 'suspended' : 'active';
        const { error: upErr } = await supabase
          .from('profiles')
          .update({ status, updated_at: new Date().toISOString() })
          .in('id', selectedIds);
        if (upErr) throw upErr;

        // Audit log
        const auditRows = selectedIds.map((id) => ({
          target_profile_id: id,
          action_type: action === 'suspend' ? 'bulk_suspend' : 'bulk_activate',
          field_name: 'status',
          new_value: status,
          details: { affected_ids: selectedIds },
        }));
        await supabase.from('admin_audit_log').insert(auditRows);

        setSuccess(`${selectedIds.length} members ${status === 'suspended' ? 'suspended' : 'activated'}.`);
      } else {
        // Fetch current values for audit
        const colMap: Record<string, string> = {
          credit_welcome: 'welcome_bonus',
          credit_referral: 'referral_bonus',
          credit_balance: 'balance',
        };
        const col = colMap[action];

        const { data: current } = await supabase
          .from('profiles')
          .select(`id, ${col}`)
          .in('id', selectedIds);

        if (!current) throw new Error('Failed to fetch current values.');

        const amt = Number(amount);
        const updates = current.map((r: any) => ({
          id: r.id,
          [col]: (Number(r[col]) || 0) + amt,
        }));

        // Update each individually since Supabase .update().in() doesn't support per-row expressions
        for (const u of updates) {
          const { error: uErr } = await supabase.from('profiles').update({ [col]: u[col], updated_at: new Date().toISOString() }).eq('id', u.id);
          if (uErr) throw uErr;
        }

        // Audit log
        const auditMap: Record<string, string> = {
          credit_welcome: 'bulk_credit_welcome',
          credit_referral: 'bulk_credit_referral',
          credit_balance: 'bulk_credit_balance',
        };
        const auditRows = current.map((r: any) => ({
          target_profile_id: r.id,
          action_type: auditMap[action],
          field_name: col,
          old_value: String(Number(r[col]) || 0),
          new_value: String((Number(r[col]) || 0) + amt),
          details: { increment: amt },
        }));
        await supabase.from('admin_audit_log').insert(auditRows);

        setSuccess(`₦${amt.toLocaleString()} credited to ${selectedIds.length} members.`);
      }

      setTimeout(() => {
        onDone();
        reset();
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Bulk action failed.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-dark-900 border border-dark-700/50 rounded-xl w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b border-dark-700/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gold-500/10 flex items-center justify-center">
              <i className="ri-stack-line text-gold-400 w-4 h-4 flex items-center justify-center" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-sm">Bulk Actions</h2>
              <p className="text-[10px] text-white/30">{selectedIds.length} member{selectedIds.length !== 1 ? 's' : ''} selected</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors"
          >
            <i className="ri-close-line w-5 h-5 flex items-center justify-center" />
          </button>
        </div>

        <div className="px-5 py-5 flex flex-col gap-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2 text-xs text-red-400">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-md px-3 py-2 text-xs text-emerald-400 flex items-center gap-1.5">
              <i className="ri-check-line w-3 h-3 flex items-center justify-center" />
              {success}
            </div>
          )}

          {/* Action Grid */}
          <div className="grid grid-cols-1 gap-2">
            {ACTIONS.map((a) => (
              <button
                key={a.id}
                onClick={() => { setAction(a.id); setError(''); setSuccess(''); }}
                className={`flex items-center gap-3 text-left px-3 py-2.5 rounded-md border transition-all ${
                  action === a.id
                    ? 'border-gold-400/50 bg-gold-500/5'
                    : 'border-dark-700/40 bg-dark-800/40 hover:border-dark-600'
                }`}
              >
                <i className={`${a.icon} ${a.color} w-4 h-4 flex items-center justify-center text-sm`} />
                <div>
                  <div className="text-xs text-white font-medium">{a.label}</div>
                  <div className="text-[10px] text-white/40">{a.desc}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Amount input for credit actions */}
          {needsAmount && (
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Amount to credit (₦)</label>
              <input
                type="number"
                min={1}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 5000"
                className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors"
              />
            </div>
          )}

          {/* Confirmation */}
          <div>
            <label className="block text-xs text-white/50 mb-1.5">
              Type <span className="text-gold-400 font-semibold">confirm</span> to execute
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="confirm"
              className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors"
            />
          </div>
        </div>

        <div className="px-5 py-4 border-t border-dark-700/50 flex items-center justify-end gap-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-md text-xs text-white/60 hover:text-white border border-white/10 hover:border-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExecute}
            disabled={processing || !action || confirmText.trim().toLowerCase() !== 'confirm'}
            className="px-5 py-2 rounded-md text-xs font-semibold bg-gold-500 hover:bg-gold-600 text-dark-900 transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            {processing && <i className="ri-loader-4-line animate-spin w-3 h-3 flex items-center justify-center" />}
            Execute
          </button>
        </div>
      </div>
    </div>
  );
}