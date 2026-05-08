import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { robots } from '@/mocks/robots';

const robotBreakdowns = [
  { robotId: 1, robotName: 'AlphaBot Pro', totalEarned: 1842, avgDaily: 12, activeDays: 153, lastEarning: '2026-05-02', roiProgress: 84 },
  { robotId: 2, robotName: 'YieldMaster X', totalEarned: 4536, avgDaily: 28, activeDays: 162, lastEarning: '2026-05-02', roiProgress: 91 },
  { robotId: 3, robotName: 'CryptoMiner AI', totalEarned: 462, avgDaily: 7, activeDays: 66, lastEarning: '2026-05-02', roiProgress: 31 },
];

const dailyHistory = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    date: date.toISOString().split('T')[0],
    alphaBot: Math.round(10 + Math.random() * 4),
    yieldMaster: Math.round(24 + Math.random() * 8),
    cryptoMiner: Math.round(5 + Math.random() * 4),
  };
});

export default function EarningsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [selectedRobot, setSelectedRobot] = useState<number | null>(null);

  const filteredHistory = useMemo(() => {
    if (timeRange === '7d') return dailyHistory.slice(-7);
    if (timeRange === '30d') return dailyHistory.slice(-30);
    if (timeRange === '90d') return dailyHistory.slice(-90);
    return dailyHistory;
  }, [timeRange]);

  const totals = useMemo(() => {
    return filteredHistory.reduce(
      (acc, d) => ({
        alphaBot: acc.alphaBot + d.alphaBot,
        yieldMaster: acc.yieldMaster + d.yieldMaster,
        cryptoMiner: acc.cryptoMiner + d.cryptoMiner,
        total: acc.total + d.alphaBot + d.yieldMaster + d.cryptoMiner,
      }),
      { alphaBot: 0, yieldMaster: 0, cryptoMiner: 0, total: 0 }
    );
  }, [filteredHistory]);

  const maxDaily = Math.max(...filteredHistory.map((d) => d.alphaBot + d.yieldMaster + d.cryptoMiner));

  const downloadCSV = () => {
    const headers = 'Date,AlphaBot Pro (₦),YieldMaster X (₦),CryptoMiner AI (₦),Total (₦)\n';
    const rows = filteredHistory
      .map(
        (d) =>
          `${d.date},${d.alphaBot},${d.yieldMaster},${d.cryptoMiner},${d.alphaBot + d.yieldMaster + d.cryptoMiner}`
      )
      .join('\n');
    const csv = headers + rows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `earnings-report-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
            <Link to="/dashboard" className="hidden sm:flex text-sm text-white/60 hover:text-white transition-colors whitespace-nowrap items-center gap-1">
              <i className="ri-dashboard-line w-4 h-4 flex items-center justify-center" />
              Dashboard
            </Link>
            <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 text-xs font-bold">
              MT
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 py-6 md:py-10">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Earnings Details</h1>
              <p className="text-sm text-white/50">Per-robot breakdowns and downloadable reports.</p>
            </div>
            <button
              onClick={downloadCSV}
              className="bg-gold-500 hover:bg-gold-600 text-dark-900 font-semibold px-5 py-2.5 rounded-md transition-colors text-sm flex items-center gap-2 whitespace-nowrap"
            >
              <i className="ri-download-line w-4 h-4 flex items-center justify-center" />
              Download CSV
            </button>
          </div>

          {/* Robot Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {robotBreakdowns.map((robot) => {
              const robotInfo = robots.find((r) => r.id === robot.robotId);
              const isSelected = selectedRobot === robot.robotId;
              return (
                <button
                  key={robot.robotId}
                  onClick={() => setSelectedRobot(isSelected ? null : robot.robotId)}
                  className={`text-left bg-surface-card border rounded-xl p-5 transition-all ${
                    isSelected ? 'border-gold-400/40' : 'border-dark-700/40 hover:border-dark-600'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={robotInfo?.image}
                      alt={robot.robotName}
                      className="w-12 h-12 rounded-lg object-cover object-top shrink-0"
                    />
                    <div>
                      <h3 className="text-white font-semibold text-sm">{robot.robotName}</h3>
                      <p className="text-[10px] text-white/40">{robotInfo?.category}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-dark-800/60 rounded-md px-2 py-1.5">
                      <div className="text-[10px] text-white/40">Total Earned</div>
                      <div className="text-sm text-gold-400 font-bold">₦{robot.totalEarned.toLocaleString()}</div>
                    </div>
                    <div className="bg-dark-800/60 rounded-md px-2 py-1.5">
                      <div className="text-[10px] text-white/40">Avg Daily</div>
                      <div className="text-sm text-white font-medium">₦{robot.avgDaily}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 bg-dark-700/40 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-gold-500 rounded-full"
                        style={{ width: `${robot.roiProgress}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-white/40">{robot.roiProgress}% ROI</span>
                  </div>
                  <div className="text-[10px] text-white/30 mt-1">Active {robot.activeDays} days · Last earning {robot.lastEarning}</div>
                </button>
              );
            })}
          </div>

          {/* Filter + Chart */}
          <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5 md:p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-white font-semibold text-base">Daily Earnings Trend</h3>
                <p className="text-xs text-white/40 mt-0.5">Combined and per-robot daily earnings</p>
              </div>
              <div className="flex bg-dark-800/60 border border-dark-700/40 rounded-lg p-0.5">
                {(['7d', '30d', '90d', 'all'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setTimeRange(r)}
                    className={`px-3 py-1.5 text-xs rounded-md transition-all whitespace-nowrap ${
                      timeRange === r ? 'bg-gold-500 text-dark-900 font-semibold' : 'text-white/50'
                    }`}
                  >
                    {r === 'all' ? 'All Time' : r}
                  </button>
                ))}
              </div>
            </div>

            {/* Stacked bar chart */}
            <div className="flex items-end justify-between gap-1.5 h-52 md:h-64 px-1 overflow-x-auto">
              {filteredHistory.map((d, i) => {
                const total = d.alphaBot + d.yieldMaster + d.cryptoMiner;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 min-w-[20px] group">
                    <div className="relative w-full flex items-end justify-center" style={{ height: `${(total / maxDaily) * 100}%` }}>
                      <div className="w-full max-w-[28px] flex flex-col-reverse rounded-t-md overflow-hidden">
                        <div className="bg-amber-500/70 hover:bg-amber-400 transition-all" style={{ height: `${(d.alphaBot / total) * 100}%` }} />
                        <div className="bg-gold-500/80 hover:bg-gold-400 transition-all" style={{ height: `${(d.yieldMaster / total) * 100}%` }} />
                        <div className="bg-emerald-500/70 hover:bg-emerald-400 transition-all" style={{ height: `${(d.cryptoMiner / total) * 100}%` }} />
                      </div>
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-dark-800 border border-dark-700/50 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        ₦{total}
                      </div>
                    </div>
                    <span className="text-[9px] text-white/30">{d.date.slice(5)}</span>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-dark-700/40">
              <span className="flex items-center gap-1.5 text-xs text-white/50">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/70" />
                AlphaBot Pro
              </span>
              <span className="flex items-center gap-1.5 text-xs text-white/50">
                <span className="w-2.5 h-2.5 rounded-sm bg-gold-500/80" />
                YieldMaster X
              </span>
              <span className="flex items-center gap-1.5 text-xs text-white/50">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/70" />
                CryptoMiner AI
              </span>
              <div className="ml-auto text-xs text-white/40">
                Total: <span className="text-gold-400 font-medium">₦{totals.total}</span> over {filteredHistory.length} days
              </div>
            </div>
          </div>

          {/* Summary Table */}
          <div className="bg-surface-card border border-dark-700/40 rounded-xl p-5 md:p-6">
            <h3 className="text-white font-semibold text-base mb-5">Earnings Summary</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-dark-700/40">
                    <th className="px-4 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider">Robot</th>
                    <th className="px-4 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider text-right">Period Earnings</th>
                    <th className="px-4 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider text-right">Avg Daily</th>
                    <th className="px-4 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider text-right">Projected Monthly</th>
                    <th className="px-4 py-3 text-[10px] text-white/40 font-medium uppercase tracking-wider text-right">ROI Progress</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-dark-700/30 hover:bg-dark-800/30 transition-colors">
                    <td className="px-4 py-3.5 text-sm text-white font-medium">AlphaBot Pro</td>
                    <td className="px-4 py-3.5 text-sm text-gold-400 text-right">₦{totals.alphaBot}</td>
                    <td className="px-4 py-3.5 text-sm text-white/60 text-right">₦{(totals.alphaBot / filteredHistory.length).toFixed(1)}</td>
                    <td className="px-4 py-3.5 text-sm text-white/60 text-right">₦{Math.round((totals.alphaBot / filteredHistory.length) * 30)}</td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 bg-dark-700/40 rounded-full h-1.5 overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: '84%' }} />
                        </div>
                        <span className="text-xs text-white/40">84%</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-dark-700/30 hover:bg-dark-800/30 transition-colors">
                    <td className="px-4 py-3.5 text-sm text-white font-medium">YieldMaster X</td>
                    <td className="px-4 py-3.5 text-sm text-gold-400 text-right">₦{totals.yieldMaster}</td>
                    <td className="px-4 py-3.5 text-sm text-white/60 text-right">₦{(totals.yieldMaster / filteredHistory.length).toFixed(1)}</td>
                    <td className="px-4 py-3.5 text-sm text-white/60 text-right">₦{Math.round((totals.yieldMaster / filteredHistory.length) * 30)}</td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 bg-dark-700/40 rounded-full h-1.5 overflow-hidden">
                          <div className="h-full bg-gold-500 rounded-full" style={{ width: '91%' }} />
                        </div>
                        <span className="text-xs text-white/40">91%</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-dark-700/30 hover:bg-dark-800/30 transition-colors">
                    <td className="px-4 py-3.5 text-sm text-white font-medium">CryptoMiner AI</td>
                    <td className="px-4 py-3.5 text-sm text-gold-400 text-right">₦{totals.cryptoMiner}</td>
                    <td className="px-4 py-3.5 text-sm text-white/60 text-right">₦{(totals.cryptoMiner / filteredHistory.length).toFixed(1)}</td>
                    <td className="px-4 py-3.5 text-sm text-white/60 text-right">₦{Math.round((totals.cryptoMiner / filteredHistory.length) * 30)}</td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 bg-dark-700/40 rounded-full h-1.5 overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: '31%' }} />
                        </div>
                        <span className="text-xs text-white/40">31%</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="bg-dark-800/30">
                    <td className="px-4 py-3.5 text-sm text-white font-bold">Total</td>
                    <td className="px-4 py-3.5 text-sm text-gold-400 font-bold text-right">₦{totals.total}</td>
                    <td className="px-4 py-3.5 text-sm text-white font-bold text-right">${(totals.total / filteredHistory.length).toFixed(1)}</td>
                    <td className="px-4 py-3.5 text-sm text-white font-bold text-right">${Math.round((totals.total / filteredHistory.length) * 30)}</td>
                    <td className="px-4 py-3.5" />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}