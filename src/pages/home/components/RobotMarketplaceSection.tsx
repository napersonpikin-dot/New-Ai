import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { robots } from '../../../mocks/robots';

export default function RobotMarketplaceSection() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const { addItem } = useCart();
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());

  const availableRobots = robots.filter((r) => !r.comingSoon);
  const comingSoonRobots = robots.filter((r) => r.comingSoon);

  const handleAdd = (robot: typeof robots[0]) => {
    addItem(robot);
    setAddedIds((prev) => new Set(prev).add(robot.id));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(robot.id);
        return next;
      });
    }, 1500);
  };

  return (
    <section id="robots" className="bg-dark-900 py-16 md:py-24" aria-labelledby="robots-title">
      <div className="px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-gold-400 text-xs font-medium tracking-widest uppercase mb-3 block">
            Robot Marketplace
          </span>
          <h2 id="robots-title" className="text-2xl md:text-4xl font-bold text-white mb-4">
            Choose Your AI Robot
          </h2>
          <p className="text-sm md:text-base text-white/50 max-w-xl mx-auto">
            Every robot is a one-time purchase. Once activated, the AI robot works autonomously and deposits earnings to your wallet daily.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {[...availableRobots, ...comingSoonRobots].map((robot) => (
            <div
              key={robot.id}
              className={`group bg-surface-card border rounded-xl overflow-hidden transition-all duration-300 ${
                robot.comingSoon
                  ? 'border-dark-700/20 opacity-70'
                  : 'border-dark-700/40 hover:border-gold-400/30'
              }`}
              onMouseEnter={() => setHoveredId(robot.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Image area */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={robot.image}
                  alt={robot.name}
                  className={`w-full h-full object-cover object-top transition-transform duration-500 ${
                    robot.comingSoon ? '' : 'group-hover:scale-105'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent" />

                {/* Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                    robot.comingSoon
                      ? 'bg-white/10 text-white/50 border border-white/10'
                      : robot.badge === 'Best Seller'
                      ? 'bg-gold-500 text-dark-900'
                      : robot.badge === 'Top Earner'
                      ? 'bg-emerald-500/90 text-white'
                      : robot.badge === 'Elite Pick'
                      ? 'bg-orange-500/90 text-white'
                      : 'bg-dark-800/90 text-gold-400 border border-gold-400/30'
                  }`}>
                    {robot.badge}
                  </span>
                </div>

                {robot.comingSoon && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                    <div className="bg-dark-800/90 border border-white/10 rounded-lg px-4 py-2 text-center">
                      <i className="ri-time-line text-white/50 text-lg w-5 h-5 flex items-center justify-center mx-auto mb-1" />
                      <span className="text-white/70 text-xs font-medium">Coming Soon</span>
                    </div>
                  </div>
                )}

                {/* Category */}
                <div className="absolute bottom-3 left-3">
                  <span className="text-[10px] text-white/60 bg-dark-800/80 px-2 py-0.5 rounded-full border border-white/10">
                    {robot.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 md:p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className={`font-semibold text-sm md:text-base ${robot.comingSoon ? 'text-white/50' : 'text-white'}`}>{robot.name}</h3>
                  <div className="flex items-center gap-1 shrink-0">
                    <i className="ri-star-fill text-gold-400 text-[10px] w-3 h-3 flex items-center justify-center" />
                    <span className="text-gold-400 text-xs font-medium">{robot.rating}</span>
                    <span className="text-white/30 text-[10px]">({robot.reviews})</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {robot.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className={`text-[10px] md:text-xs bg-dark-800/60 border border-dark-700/30 px-2 py-0.5 rounded ${
                        robot.comingSoon ? 'text-white/30' : 'text-white/50'
                      }`}
                    >
                      {feat}
                    </span>
                  ))}
                </div>

                <div className="flex items-end justify-between mb-4">
                  <div>
                    <div className="text-white/40 text-[10px] mb-0.5">Daily Return</div>
                    <div className={`font-bold text-base md:text-lg ${robot.comingSoon ? 'text-white/30' : 'text-gold-400'}`}>
                      ₦{robot.dailyReturn.toLocaleString()}<span className="text-white/40 text-xs font-normal">/day</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white/40 text-[10px] mb-0.5">ROI</div>
                    <div className={`text-xs font-medium ${robot.comingSoon ? 'text-white/30' : 'text-emerald-400'}`}>{robot.roiDays} days</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-dark-700/40">
                  <div>
                    <span className="text-white/40 text-[10px]">Robot Price</span>
                    <div className={`font-bold text-lg ${robot.comingSoon ? 'text-white/30' : 'text-white'}`}>
                      {robot.comingSoon ? '—' : `₦${robot.price.toLocaleString()}`}
                    </div>
                  </div>
                  {robot.comingSoon ? (
                    <span className="bg-dark-800/80 text-white/40 font-semibold text-xs px-4 py-2 rounded-md whitespace-nowrap flex items-center gap-1 border border-white/10">
                      <i className="ri-time-line w-3 h-3 flex items-center justify-center" />
                      Coming Soon
                    </span>
                  ) : (
                    <button
                      onClick={() => handleAdd(robot)}
                      className={`font-semibold text-xs px-4 py-2 rounded-md transition-colors whitespace-nowrap flex items-center gap-1 ${
                        addedIds.has(robot.id)
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gold-500 hover:bg-gold-600 text-dark-900'
                      }`}
                    >
                      {addedIds.has(robot.id) ? (
                        <>
                          <i className="ri-check-line w-3 h-3 flex items-center justify-center" />
                          Added
                        </>
                      ) : (
                        <>
                          Add to Cart
                          <i className="ri-shopping-cart-line w-3 h-3 flex items-center justify-center" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}