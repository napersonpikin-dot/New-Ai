import { useState } from 'react';
import { earningsData, weeklyEarningsData } from '../../../mocks/robots';

export default function DashboardSection() {
  const [period, setPeriod] = useState<'daily' | 'weekly'>('daily');
  const data = period === 'daily' ? earningsData : weeklyEarningsData;
  const maxVal = Math.max(...data.map((d) => d.earnings));

  return (
    <section id="dashboard" className="bg-dark-800 py-16 md:py-24" aria-labelledby="dashboard-title">
      <div className="px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-gold-400 text-xs font-medium tracking-widest uppercase mb-3 block">
            Earnings Dashboard
          </span>
          <h2 id="dashboard-title" className="text-2xl md:text-4xl font-bold text-white mb-4">
            Track Your Income in Real Time
          </h2>
          <p className="text-sm md:text-base text-white/50 max-w-xl mx-auto">
            A live preview of the member dashboard. See exactly how your robot fleet performs and how much you earn every day.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Dashboard mock card */}
          <div className="bg-surface-dark border border-dark-700/50 rounded-xl overflow-hidden">
            {/* Dashboard header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b border-dark-700/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-gold-500/10 flex items-center justify-center">
                  <i className="ri-dashboard-line text-gold-400 w-4 h-4 flex items-center justify-center" />
                </div>
                <span className="text-white font-semibold text-sm">Dashboard Preview</span>
              </div>
              <div className="flex gap-1 bg-dark-800 rounded-md p-0.5">
                <button
                  onClick={() => setPeriod('daily')}
                  className={`text-xs px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                    period === 'daily' ? 'bg-gold-500 text-dark-900 font-medium' : 'text-white/50 hover:text-white'
                  }`}
                >
                  Daily
                </button>
                <button
                  onClick={() => setPeriod('weekly')}
                  className={`text-xs px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                    period === 'weekly' ? 'bg-gold-500 text-dark-900 font-medium' : 'text-white/50 hover:text-white'
                  }`}
                >
                  Weekly
                </button>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-5">
              {[
                { label: 'Today\'s Earnings', value: '₦45.00', change: '+12%', positive: true },
                { label: 'This Week', value: '₦312.00', change: '+8%', positive: true },
                { label: 'This Month', value: '₦1,248.00', change: '+15%', positive: true },
                { label: 'Total Earnings', value: '₦8,420.00', change: '+22%', positive: true },
              ].map((stat, i) => (
                <div key={i} className="bg-dark-800/60 rounded-lg p-4 border border-dark-700/30">
                  <div className="text-white/40 text-xs mb-1">{stat.label}</div>
                  <div className="text-white font-bold text-lg md:text-xl mb-1">{stat.value}</div>
                  <div className={`text-xs ${stat.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stat.positive ? '+' : ''}{stat.change} vs last {period}
                  </div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="px-5 pb-5">
              <div className="text-white/40 text-xs mb-3">Earnings ({period})</div>
              <div className="flex items-end gap-2 h-40 md:h-48">
                {data.map((item, idx) => {
                  const height = (item.earnings / maxVal) * 100;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
                      <div className="relative w-full flex items-end justify-center">
                        <div
                          className="w-full max-w-[48px] bg-gold-500/60 rounded-t transition-all duration-500 hover:bg-gold-500"
                          style={{ height: `${height}%`, minHeight: '8px' }}
                        />
                        <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity bg-dark-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap border border-dark-700/50">
                          ₦{item.earnings}
                        </div>
                      </div>
                      <span className="text-white/30 text-[10px] md:text-xs">{item.day || item.week}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}