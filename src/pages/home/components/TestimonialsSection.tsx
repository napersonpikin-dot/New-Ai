import { testimonials } from '../../../mocks/robots';

export default function TestimonialsSection() {
  return (
    <section className="bg-dark-800 py-16 md:py-24" aria-labelledby="testimonials-title">
      <div className="px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-gold-400 text-xs font-medium tracking-widest uppercase mb-3 block">
            Member Voices
          </span>
          <h2 id="testimonials-title" className="text-2xl md:text-4xl font-bold text-white mb-4">
            What Our Members Say
          </h2>
          <p className="text-sm md:text-base text-white/50 max-w-xl mx-auto">
            Real feedback from verified Ai EARNERS members around the world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 max-w-5xl mx-auto">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-surface-card border border-dark-700/40 rounded-xl p-5 md:p-6 hover:border-gold-400/20 transition-all"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <i
                    key={i}
                    className="ri-star-fill text-gold-400 text-xs w-3 h-3 flex items-center justify-center"
                  />
                ))}
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-5 italic">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gold-500/20 border border-gold-400/30 flex items-center justify-center text-gold-400 font-semibold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-white text-sm font-medium">{t.name}</div>
                  <div className="text-white/40 text-xs">{t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}