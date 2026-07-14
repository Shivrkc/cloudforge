import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { FAQ_ITEMS } from '../../data/mockData';

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-brand-dark/95 border-t border-zinc-900/40 relative">
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-blue-900/5 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Block */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-zinc-950/80 border border-zinc-900 rounded-full px-3 py-1">
            <HelpCircle className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-mono font-medium text-gray-400 tracking-wide">FAQ DATABASE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-sans font-extrabold text-white tracking-tight">
            Frequently Answered Concerns
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xl mx-auto">
            Everything you need to know about setting up integrations, automatic builds, bandwidth limitations, and high-performance serverless computations.
          </p>
        </div>

        {/* Expandable Cards list */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <div
                key={index}
                className="bg-brand-card/70 border border-brand-border hover:border-zinc-800 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:text-white transition-colors cursor-pointer"
                >
                  <span className="font-sans font-semibold text-white text-base leading-snug">
                    {faq.question}
                  </span>
                  <span className="ml-4 p-1.5 bg-zinc-950 rounded-lg text-gray-400 border border-zinc-900 flex-shrink-0">
                    {isOpen ? <ChevronUp className="w-4.5 h-4.5 text-blue-400" /> : <ChevronDown className="w-4.5 h-4.5" />}
                  </span>
                </button>

                {/* Animated collapse helper */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-60 border-t border-zinc-900/60' : 'max-h-0'
                  }`}
                >
                  <p className="p-6 text-sm text-gray-400 leading-relaxed font-sans bg-zinc-950/20">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA help card */}
        <div className="text-center pt-8">
          <p className="text-sm text-gray-400 font-sans">
            Have a technical query not listed in our database?{' '}
            <a
              href="#docs"
              onClick={(e) => {
                e.preventDefault();
                alert('Support channel is active in this mockup! Click Register or login to view active chat channels.');
              }}
              className="text-blue-400 hover:underline font-semibold"
            >
              Reach out to our Core Developers
            </a>
          </p>
        </div>

      </div>
    </section>
  );
}
