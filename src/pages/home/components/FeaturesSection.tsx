import { features } from '../../../mocks/robots';

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-dark-900 py-16 md:py-24" aria-labelledby="features-title">
      <div className="px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-gold-400 text-xs font-medium tracking-widest uppercase mb-3 block">
            Why Ai EARNERS
          </span>
          <h2 id="features-title" className="text-2xl md:text-4xl font-bold text-white mb-4">
            Key Features That Set Us Apart
          </h2>
          <p className="text-sm md:text-base text-white/50 max-w-xl mx-auto">
            Every tool, security measure, and convenience feature designed to maximize your passive income journey.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group bg-surface-card border border-dark-700/40 rounded-lg p-5 md:p-6 hover:border-gold-400/30 hover:bg-surface-hover transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center mb-4 group-hover:bg-gold-500/20 transition-colors">
                <i className={`${feature.icon} text-gold-400 text-lg w-5 h-5 flex items-center justify-center`} />
              </div>
              <h3 className="text-white font-semibold text-sm md:text-base mb-2">{feature.title}</h3>
              <p className="text-white/50 text-xs md:text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}