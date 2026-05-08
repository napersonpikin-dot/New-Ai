import { memberStats } from '../../../mocks/robots';

export default function MemberPortalSection() {
  return (
    <section id="member" className="bg-dark-900 py-16 md:py-24" aria-labelledby="member-title">
      <div className="px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-gold-400 text-xs font-medium tracking-widest uppercase mb-3 block">
            Member Portal
          </span>
          <h2 id="member-title" className="text-2xl md:text-4xl font-bold text-white mb-4">
            Everything You Need in One Place
          </h2>
          <p className="text-sm md:text-base text-white/50 max-w-xl mx-auto">
            Your personal command center. Manage your robot fleet, track earnings, withdraw funds, and grow your income.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* Left: stats */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {memberStats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-surface-card border border-dark-700/40 rounded-lg p-4 md:p-5 hover:border-gold-400/20 transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded bg-gold-500/10 flex items-center justify-center">
                    <i className={`${stat.icon} text-gold-400 text-sm w-4 h-4 flex items-center justify-center`} />
                  </div>
                </div>
                <div className="text-white font-bold text-lg md:text-2xl mb-1">{stat.value}</div>
                <div className="text-white/40 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Right: portal features list */}
          <div className="bg-surface-dark border border-dark-700/50 rounded-xl p-5 md:p-6">
            <h3 className="text-white font-semibold text-base mb-4">Portal Features</h3>
            <div className="flex flex-col gap-3">
              {[
                {
                  icon: 'ri-robot-2-line',
                  title: 'Robot Management',
                  desc: 'View, activate, and manage every robot in your fleet. See performance per robot.',
                },
                {
                  icon: 'ri-bar-chart-box-line',
                  title: 'Detailed Analytics',
                  desc: 'Historical earnings, ROI tracking, growth charts, and performance breakdowns.',
                },
                {
                  icon: 'ri-wallet-3-line',
                  title: 'Wallet & Withdrawals',
                  desc: 'Deposit funds, withdraw earnings, view transaction history, and set auto-withdrawals.',
                },
                {
                  icon: 'ri-user-add-line',
                  title: 'Referral Center',
                  desc: 'Get your unique referral link, track invited members, and collect bonus earnings.',
                },
                {
                  icon: 'ri-notification-3-line',
                  title: 'Smart Alerts',
                  desc: 'Get notified when your robot hits milestones, earnings thresholds, or needs attention.',
                },
                {
                  icon: 'ri-shield-user-line',
                  title: 'Account Security',
                  desc: 'Two-factor authentication, login history, and full control over your account.',
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-gold-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <i className={`${item.icon} text-gold-400 text-sm w-4 h-4 flex items-center justify-center`} />
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium mb-0.5">{item.title}</div>
                    <div className="text-white/40 text-xs leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}