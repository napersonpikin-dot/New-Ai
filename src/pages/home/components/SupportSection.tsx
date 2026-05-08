import { paymentMethods, supportChannels } from '../../../mocks/robots';

export default function SupportSection() {
  return (
    <section id="support" className="bg-dark-800 py-16 md:py-24" aria-labelledby="support-title">
      <div className="px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-gold-400 text-xs font-medium tracking-widest uppercase mb-3 block">
            Payment & Support
          </span>
          <h2 id="support-title" className="text-2xl md:text-4xl font-bold text-white mb-4">
            Flexible Payments. World-Class Support.
          </h2>
          <p className="text-sm md:text-base text-white/50 max-w-xl mx-auto">
            We support every major payment method and offer 24/7 support across multiple channels. Your experience matters.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 max-w-5xl mx-auto">
          {/* Payment Methods */}
          <div className="bg-surface-dark border border-dark-700/50 rounded-xl p-5 md:p-6">
            <h3 className="text-white font-semibold text-base mb-5 flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-gold-500/10 flex items-center justify-center">
                <i className="ri-wallet-3-line text-gold-400 text-sm w-4 h-4 flex items-center justify-center" />
              </div>
              Supported Payment Methods
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {paymentMethods.map((method, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 bg-dark-800/60 border border-dark-700/30 rounded-lg px-3 py-2.5 hover:border-gold-400/20 transition-colors"
                >
                  <i className={`${method.icon} text-gold-400 text-sm w-4 h-4 flex items-center justify-center`} />
                  <span className="text-white/70 text-xs font-medium">{method.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Support Channels */}
          <div className="bg-surface-dark border border-dark-700/50 rounded-xl p-5 md:p-6">
            <h3 className="text-white font-semibold text-base mb-5 flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-gold-500/10 flex items-center justify-center">
                <i className="ri-customer-service-2-line text-gold-400 text-sm w-4 h-4 flex items-center justify-center" />
              </div>
              Support Channels
            </h3>
            <div className="flex flex-col gap-3">
              {supportChannels.map((channel, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-dark-800/60 border border-dark-700/30 rounded-lg px-4 py-3 hover:border-gold-400/20 transition-colors"
                >
                  <div className="w-9 h-9 rounded bg-gold-500/10 flex items-center justify-center shrink-0">
                    <i className={`${channel.icon} text-gold-400 text-sm w-4 h-4 flex items-center justify-center`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-white text-sm font-medium">{channel.name}</span>
                      <span className="text-gold-400 text-[10px] font-medium bg-gold-500/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {channel.available}
                      </span>
                    </div>
                    <div className="text-white/40 text-xs mt-0.5">{channel.desc}</div>
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