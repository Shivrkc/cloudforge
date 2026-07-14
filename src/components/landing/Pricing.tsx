import { useState } from 'react';
import { Check, Info, Sparkles, HelpCircle } from 'lucide-react';
import { PRICING_PLANS } from '../../data/mockData';
import { ActiveView } from '../../types';

interface PricingProps {
  setView: (view: ActiveView) => void;
}

export default function Pricing({ setView }: PricingProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');

  const handlePlanSelection = (planId: string) => {
    if (planId === 'enterprise') {
      alert('Your Enterprise Sales request is logged in this preview! We would love to chat. Opening registration form.');
    }
    setView('signup');
  };

  return (
    <section id="pricing" className="py-24 bg-brand-dark/90 border-t border-zinc-900/40 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-purple-900/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header content block */}
        <div className="text-center max-w-2xl mx-auto space-y-5">
          <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-widest bg-purple-950/40 px-3 py-1 rounded-full border border-purple-900/40">
            TRANSPARENT BILLING
          </span>
          <h2 className="text-3xl sm:text-4xl font-sans font-extrabold text-white tracking-tight">
            Plans Built for Projects of All Scales
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Start completely free with zero commitment, then scale seamlessly with predictable, flat-rate tiers as your bandwidth and active operations scale.
          </p>

          {/* Billing Switcher Toggle */}
          <div className="flex items-center justify-center pt-4">
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-1.5 flex items-center gap-2 relative">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 text-xs font-sans font-semibold rounded-lg transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Bill Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annually')}
                className={`px-4 py-2 text-xs font-sans font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  billingCycle === 'annually'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Bill Annually
                <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-900/60 font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded leading-none">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {PRICING_PLANS.map((plan) => {
            const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceAnnually;
            
            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  plan.popular
                    ? 'bg-brand-card border-2 border-blue-600 shadow-2xl shadow-blue-950/25 scale-102 z-10 glow-purple'
                    : 'bg-brand-card/60 border border-brand-border hover:border-zinc-800'
                }`}
              >
                {/* Popular Badge Label Ribbon */}
                {plan.popular && (
                  <div className="absolute top-0 right-8 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-mono uppercase tracking-widest font-bold px-3 py-1 rounded-full shadow flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Most Popular
                  </div>
                )}

                {/* Upper portion */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-sans font-bold text-white flex items-center gap-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-400 text-xs font-sans leading-relaxed mt-1.5">
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Pricing Rate Label */}
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-sans font-extrabold text-white">
                      ${price}
                    </span>
                    <span className="text-gray-500 text-xs font-mono">
                      / month {billingCycle === 'annually' && 'billed annually'}
                    </span>
                  </div>

                  <div className="h-px bg-zinc-900/80"></div>

                  {/* Feature Limits check indicators */}
                  <div className="space-y-4">
                    <span className="block text-[10px] font-mono uppercase text-gray-500 tracking-wider font-bold">
                      INCLUDED IN {plan.name}:
                    </span>
                    <ul className="space-y-3">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-3 text-sm text-gray-300 leading-normal">
                          <Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA Lower portion */}
                <div className="pt-8 mt-8 border-t border-zinc-900/60">
                  <button
                    type="button"
                    onClick={() => handlePlanSelection(plan.id)}
                    className={`w-full py-3 px-4 rounded-xl text-sm font-semibold font-sans transition-all cursor-pointer ${
                      plan.popular
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-blue-600/10 active:scale-98'
                        : 'bg-zinc-950 border border-zinc-800 hover:border-zinc-700 hover:text-white text-gray-300 active:scale-98'
                    }`}
                  >
                    {plan.cta}
                  </button>
                  <p className="text-[10px] text-gray-500 font-mono text-center mt-3">
                    {plan.id === 'hobby' ? 'No credit card required' : 'Cancel anytime, instantly'}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

        {/* Extra disclaimer info indicator */}
        <div className="bg-zinc-950/40 border border-zinc-900/80 max-w-4xl mx-auto rounded-xl p-4.5 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-400 leading-relaxed font-sans">
            Need a custom deployment layout or looking to migrate a high-volume application? We offer customized micro-vms, dedicated VPC clusters, and custom data processing parameters. <a href="#contact" onClick={(e) => { e.preventDefault(); setView('signup'); }} className="text-blue-400 hover:underline font-semibold">Contact our solution architects</a> to design a tailormade stack.
          </p>
        </div>

      </div>
    </section>
  );
}
