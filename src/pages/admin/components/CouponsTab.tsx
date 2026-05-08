import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Coupon {
  id: number;
  code: string;
  discount_percent: number;
  max_uses: number;
  used_count: number;
  valid_from: string;
  valid_until: string;
  applies_to: string;
  status: string;
}

export default function CouponsTab() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState(20);
  const [maxUses, setMaxUses] = useState(100);
  const [validFrom, setValidFrom] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [appliesTo, setAppliesTo] = useState('both');
  const [toast, setToast] = useState<{ msg: string; show: boolean }>({ msg: '', show: false });

  const showNotification = (msg: string) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast({ msg: '', show: false }), 3000);
  };

  const loadCoupons = async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) showNotification('Failed to load activation codes.');
    else setCoupons((data as Coupon[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    if (!code.trim()) {
      showNotification('Activation code is required.');
      return;
    }
    const { error } = await supabase.from('coupons').insert({
      code: code.trim().toUpperCase(),
      discount_percent: discount,
      max_uses: maxUses,
      valid_from: validFrom || new Date().toISOString().split('T')[0],
      valid_until: validUntil || null,
      applies_to: appliesTo,
      status: 'active',
    });
    if (error) {
      showNotification('Failed to generate activation code. Code may already exist.');
      return;
    }
    showNotification(`Activation code ${code.trim().toUpperCase()} generated successfully!`);
    setCode('');
    setDiscount(20);
    setMaxUses(100);
    setValidFrom('');
    setValidUntil('');
    setAppliesTo('both');
    loadCoupons();
  };

  const downloadCouponCSV = () => {
    const headers = ['Code', 'Discount %', 'Used', 'Max Uses', 'Valid From', 'Valid Until', 'Applies To', 'Status'];
    const rows = coupons.map((c) => [
      c.code,
      String(c.discount_percent),
      String(c.used_count),
      String(c.max_uses),
      c.valid_from || '',
      c.valid_until || '',
      c.applies_to,
      c.status,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'activation-codes.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generator */}
        <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5 md:p-6">
          <h3 className="text-white font-semibold text-base mb-1">Generate New Activation Code</h3>
          <p className="text-xs text-white/40 mb-5">Create and manage promotional activation codes for signups and purchases</p>
          <form onSubmit={handleGenerate} className="flex flex-col gap-3">
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Activation Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="WELCOME25"
                className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors uppercase"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Discount (%)</label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  min={1}
                  max={100}
                  className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Max Uses</label>
                <input
                  type="number"
                  value={maxUses}
                  onChange={(e) => setMaxUses(Number(e.target.value))}
                  min={1}
                  className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Valid From</label>
                <input
                  type="date"
                  value={validFrom}
                  onChange={(e) => setValidFrom(e.target.value)}
                  className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Valid Until</label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400/50 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Applies To</label>
              <select
                value={appliesTo}
                onChange={(e) => setAppliesTo(e.target.value)}
                className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400/50 transition-colors"
              >
                <option value="signup">Signup Bonus</option>
                <option value="purchase">Robot Purchase</option>
                <option value="both">Both</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-gold-500 hover:bg-gold-600 text-dark-900 font-semibold py-2.5 rounded-md transition-colors text-sm"
            >
              Generate Activation Code
            </button>
          </form>
        </div>

        {/* Active Activation Codes */}
        <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5 md:p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-white font-semibold text-base mb-1">Active Activation Codes</h3>
              <p className="text-xs text-white/40">All generated promo codes and their usage</p>
            </div>
            <button
              onClick={downloadCouponCSV}
              className="text-xs text-gold-400 hover:text-gold-300 transition-colors flex items-center gap-1"
            >
              <i className="ri-download-2-line w-4 h-4 flex items-center justify-center" />
              Export CSV
            </button>
          </div>
          {loading ? (
            <div className="text-sm text-white/40 py-8 text-center">Loading activation codes...</div>
          ) : coupons.length === 0 ? (
            <div className="text-sm text-white/40 py-8 text-center">No activation codes found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-dark-700/40">
                    <th className="px-3 py-2.5 text-[10px] text-white/40 font-medium uppercase">Code</th>
                    <th className="px-3 py-2.5 text-[10px] text-white/40 font-medium uppercase">Discount</th>
                    <th className="px-3 py-2.5 text-[10px] text-white/40 font-medium uppercase">Uses</th>
                    <th className="px-3 py-2.5 text-[10px] text-white/40 font-medium uppercase">Expires</th>
                    <th className="px-3 py-2.5 text-[10px] text-white/40 font-medium uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c) => (
                    <tr key={c.id} className="border-b border-dark-700/30 hover:bg-dark-800/30 transition-colors">
                      <td className="px-3 py-3 text-sm text-white font-mono">{c.code}</td>
                      <td className="px-3 py-3 text-sm text-gold-400 font-medium">{c.discount_percent}%</td>
                      <td className="px-3 py-3 text-sm text-white/60">
                        {c.used_count}/{c.max_uses}
                      </td>
                      <td className="px-3 py-3 text-sm text-white/40">{c.valid_until || 'No expiry'}</td>
                      <td className="px-3 py-3">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            c.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-400/20'
                              : 'bg-red-500/10 text-red-400 border-red-400/20'
                          }`}
                        >
                          {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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