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
    <section id="pricing" className="py-24 sm:py-32 bg-[#060608] border-t border-zinc-800/40 relative overflow-hidden">
      {/* Subtle HAVN signature background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[160px] pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Header content block */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium text-orange-400 bg-orange-500/10 border border-orange-500/20 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>FLEXIBLE SCALE INFRASTRUCTURE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-sans">
            Predictable resource bounds.
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-sans leading-relaxed max-w-2xl mx-auto">
            From isolated testing hobby microenvironments to production global routing layers, lock down transparent cloud spending with zero surprise adjustments.
          </p>
          
          {/* Toggle buttons for monthly or annual billing */}
          <div className="pt-3 flex justify-center">
            <div className="inline-flex items-center p-1 bg-zinc-950/90 border border-zinc-800 rounded-2xl shadow-inner backdrop-blur-md">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`text-xs px-4 py-2 font-medium rounded-xl transition-all duration-200 cursor-pointer ${
                  billingCycle === 'monthly' 
                    ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/60' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Monthly billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annually')}
                className={`text-xs px-4 py-2 font-medium rounded-xl transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  billingCycle === 'annually' 
                    ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/60' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>Annually save 20%</span>
                <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                  Save
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Option Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {PRICING_PLANS?.map((plan: any) => {
            const priceDisplay = billingCycle === 'annually' ? Math.floor(plan.price * 0.8) : plan.price;
            const isPopular = plan.popular;

            return (
              <div
                key={plan.id}
                className={`rounded-3xl bg-[#09090c]/90 p-8 flex flex-col justify-between relative transition-all duration-300 hover:border-zinc-700/90 backdrop-blur-sm ${
                  isPopular
                    ? 'border-2 border-orange-500/50 shadow-[0_0_40px_rgba(249,115,22,0.12)] bg-gradient-to-b from-[#111116] to-[#09090c] md:-translate-y-2'
                    : 'border border-zinc-800/80 shadow-lg'
                }`}
              >
                {isPopular && (
                  <div className="absolute top-0 right-6 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-amber-500 border border-orange-400/30 text-white text-[10px] tracking-wider font-mono uppercase px-3 py-1 rounded-full font-bold shadow-md shadow-orange-500/20 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 fill-white/20 text-white" /> Most Popular Choice
                  </div>
                )}

                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white font-sans">{plan.name}</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed min-h-[40px] font-sans">{plan.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1.5 py-3 border-b border-zinc-800/80">
                    <span className="text-4xl font-extrabold text-white font-sans tracking-tight">${priceDisplay}</span>
                    <span className="text-xs text-zinc-500 font-sans font-medium">/ month</span>
                  </div>

                  <ul className="space-y-3.5 text-xs text-zinc-300 font-sans">
                    {plan.features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className={`p-0.5 rounded-full mt-0.5 flex-shrink-0 ${
                          isPopular 
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' 
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700/60'
                        }`}>
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span className="leading-tight text-zinc-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8 space-y-3">
                  <button
                    type="button"
                    onClick={() => handlePlanSelection(plan.id)}
                    className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                      isPopular
                        ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 active:scale-98'
                        : 'bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 text-zinc-200 active:scale-98'
                    }`}
                  >
                    {plan.cta}
                  </button>
                  <p className="text-[10px] text-zinc-500 font-mono text-center">
                    {plan.id === 'hobby' ? 'No credit card required' : 'Cancel anytime, instantly'}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

        {/* Enterprise info banner */}
        <div className="bg-zinc-950/60 border border-zinc-800/80 max-w-4xl mx-auto rounded-2xl p-5 flex items-start gap-4 backdrop-blur-sm">
          <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex-shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            Need a custom deployment layout or looking to migrate a high-volume application? We offer customized micro-vms, dedicated VPC clusters, and custom data processing parameters.{' '}
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                navigate(ROUTES.SIGNUP);
              }}
              className="text-orange-400 hover:text-orange-300 font-medium underline underline-offset-4 decoration-orange-500/30 hover:decoration-orange-400 transition-colors"
            >
              Contact Enterprise Sales
            </a>
          </p>
        </div>

      </div>
    </section>
  );
}