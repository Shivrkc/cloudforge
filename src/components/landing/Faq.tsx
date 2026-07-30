import { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { FAQ_ITEMS } from '../../data/mockData';

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 sm:py-32 bg-[#060608] border-t border-zinc-800/40 relative overflow-hidden">
      {/* Background ambient HAVN orange glow */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-[140px] pointer-events-none -z-0" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16 relative z-10">
        
        {/* Header Block */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium text-orange-400 bg-orange-500/10 border border-orange-500/20 shadow-sm">
            <HelpCircle className="w-3.5 h-3.5 text-orange-400" />
            <span>FAQ DATABASE</span>
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-sans">
            Frequently Answered Concerns
          </h2>
          
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-sans">
            Everything you need to know about setting up integrations, automatic builds, bandwidth limitations, and high-performance serverless computations.
          </p>
        </div>

        {/* Expandable Accordion Cards List */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {FAQ_ITEMS.map((faq: any, index: number) => {
            const isOpen = openIndex === index;
            
            return (
              <div
                key={index}
                className={`rounded-2xl transition-all duration-300 border overflow-hidden backdrop-blur-sm ${
                  isOpen 
                    ? 'bg-[#0d0d12] border-zinc-700/80 shadow-lg shadow-orange-500/5' 
                    : 'bg-[#09090c]/90 border-zinc-800/80 hover:border-zinc-700/60'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer group transition-colors"
                >
                  <span className={`font-sans font-semibold text-base sm:text-lg leading-snug transition-colors ${
                    isOpen ? 'text-orange-400' : 'text-white group-hover:text-zinc-200'
                  }`}>
                    {faq.question}
                  </span>
                  <span className={`ml-4 p-2 rounded-xl border flex-shrink-0 transition-all duration-300 ${
                    isOpen 
                      ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 group-hover:border-zinc-700 group-hover:text-zinc-200'
                  }`}>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </span>
                </button>

                {/* Smooth Grid-based Collapse Helper */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 pt-2 text-sm sm:text-base text-zinc-400 leading-relaxed font-sans border-t border-zinc-800/40">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Developer Help Banner */}
        <div className="text-center pt-2">
          <div className="inline-block bg-zinc-950/60 border border-zinc-800/80 rounded-2xl px-6 py-4 backdrop-blur-sm">
            <p className="text-xs sm:text-sm text-zinc-400 font-sans">
              Have a technical query not listed in our database?{' '}
              <a
                href="#docs"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Support channel is active in this mockup! Click Register or login to view active chat channels.');
                }}
                className="text-orange-400 hover:text-orange-300 font-medium underline underline-offset-4 decoration-orange-500/30 hover:decoration-orange-400 transition-colors"
              >
                Reach out to our Core Developers
              </a>
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}