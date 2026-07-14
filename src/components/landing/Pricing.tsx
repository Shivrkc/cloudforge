import { useState } from 'react';
import { Check, Info, Sparkles } from 'lucide-react';
import { PRICING_PLANS } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export default function Pricing() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');

  const handlePlanSelection = (planId: string) => {
    if (planId === 'enterprise') {
      alert('Your Enterprise Sales request is logged in this preview! We would love to chat. Opening registration form.');
    }
    navigate(ROUTES.SIGNUP);
  };

  return (
    <section id="pricing" className="py-24 bg-brand-dark/90 border-t border-zinc-900/40 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-purple-900/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header content block */}
        <div className="text-center max-w-2xl mx-auto space-y-5">
          <span className="text-xs font-mono text-purple-400 font-semibold tracking-wider uppercase">Flexible Scale Infrastructure</span>
          <h2 className="text-3xl sm:text-5xl font-sans font-extrabold text-white tracking-tight">
            Predictable resource bounds.
          </h2>
          <p className="text-gray-400 text-sm font-sans leading-relaxed">
            From isolated testing hobby microenvironments to production global routing layers, lock down transparent cloud spending with zero surprise adjustments.
          </p>
          
          {/* Toggle buttons for monthly or annual tracking */}
          <div className="inline-flex items-center p-1 bg-zinc-950 border border-zinc-900 rounded-xl relative z-10">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`text-xs px-4 py-2 font-medium rounded-lg transition-all ${
                billingCycle === 'monthly' ? 'bg-zinc-900 text-white shadow' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Monthly billing
            </button>
            <button
              onClick={() => setBillingCycle('annually')}
              className={`text-xs px-4 py-2 font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                billingCycle === 'annually' ? 'bg-zinc-900 text-white shadow' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Annually save 20%
              <span className="bg-green-950 text-green-400 border border-green-900 text-[9px] px-1 rounded font-bold uppercase leading-normal">Save</span>
            </button>
          </div>
        </div>

        {/* Pricing Option Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto relative z-10">
          {PRICING_PLANS?.map((plan: any) => {
            const priceDisplay = billingCycle === 'annually' ? Math.floor(plan.price * 0.8) : plan.price;
            return (
              <div
                key={plan.id}
                className={`rounded-2xl bg-[#09090a]/80 border p-6 flex flex-col justify-between relative transition-all duration-300 hover:border-zinc-700 ${
                  plan.popular ? 'border-blue-600/60 shadow-xl shadow-blue-950/10' : 'border-zinc-800/80'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-6 -translate-y-1/2 bg-blue-600 border border-blue-500 text-white text-[10px] tracking-wider font-mono uppercase px-2.5 py-0.5 rounded-full font-bold shadow flex items-center gap-1">
                    <Sparkles className="w-3 h-3 fill-white/20" /> Most Popular Choice
                  </div>
                )}

                <div className="space-y-5">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white font-sans">{plan.name}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed min-h-8 font-sans">{plan.description}</p>
                  </div>
                  <div className="flex items-baseline gap-1 py-2 border-b border-zinc-900">
                    <span className="text-3xl font-extrabold text-white font-mono">${priceDisplay}</span>
                    <span className="text-xs text-gray-500 font-sans">/ month</span>
                  </div>
                  <ul className="space-y-3 pt-2 text-xs text-gray-300 font-sans">
                    {plan.features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <button
                    onClick={() => handlePlanSelection(plan.id)}
                    className={`w-full py-3 px-4 rounded-xl font-medium text-sm transition-all cursor-pointer ${
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
            Need a custom deployment layout or looking to migrate a high-volume application? We offer customized micro-vms, dedicated VPC clusters, and custom data processing parameters. <a href="#contact" onClick={(e) => { e.preventDefault(); navigate(ROUTES.SIGNUP); }} className="text-blue-400 hover:underline font-medium">Contact Enterprise Sales</a>
          </p>
        </div>
      </div>
    </section>
  );
}