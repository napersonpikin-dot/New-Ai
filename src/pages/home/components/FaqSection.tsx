import { useState } from 'react';
import { faqItems } from '../../../mocks/robots';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="bg-dark-900 py-16 md:py-24" aria-labelledby="faq-title">
      <div className="px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-gold-400 text-xs font-medium tracking-widest uppercase mb-3 block">
            Questions Answered
          </span>
          <h2 id="faq-title" className="text-2xl md:text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-sm md:text-base text-white/50 max-w-xl mx-auto">
            Everything you need to know before joining Ai EARNERS and starting your passive income journey.
          </p>
        </div>

        <div className="max-w-2xl mx-auto flex flex-col gap-3">
          {faqItems.map((item, idx) => (
            <div
              key={idx}
              className="bg-surface-card border border-dark-700/40 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-surface-hover transition-colors"
                aria-expanded={openIndex === idx}
              >
                <span className="text-white text-sm font-medium">{item.question}</span>
                <i
                  className={`ri-${openIndex === idx ? 'indeterminate' : 'add'}-line text-gold-400 text-sm w-4 h-4 flex items-center justify-center shrink-0 transition-transform`}
                />
              </button>
              {openIndex === idx && (
                <div className="px-5 pb-4">
                  <p className="text-white/60 text-sm leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}