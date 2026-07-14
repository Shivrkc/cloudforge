import { useState } from 'react';
import { motion } from 'motion/react';
import { GitBranch, Zap, Terminal, Shield, Database, Cpu, ArrowRight, Layers, CheckCircle2, CloudLightning } from 'lucide-react';
import { FEATURES, TRUSTED_COMPANIES } from '../../data/mockData';

// Map icons manually to bypass dynamic import issues
const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'GitBranch': return <GitBranch className="w-6 h-6 text-blue-400" />;
    case 'Zap': return <Zap className="w-6 h-6 text-cyan-400" />;
    case 'Terminal': return <Terminal className="w-6 h-6 text-purple-400" />;
    case 'Shield': return <Shield className="w-6 h-6 text-indigo-400" />;
    case 'Database': return <Database className="w-6 h-6 text-teal-400" />;
    case 'Cpu': return <Cpu className="w-6 h-6 text-emerald-400" />;
    default: return <Layers className="w-6 h-6 text-gray-400" />;
  }
};

export default function Features() {
  const [activeStep, setActiveStep] = useState(0);

  const workflowSteps = [
    {
      title: '1. Connect & Push',
      subtitle: 'Write your code as usual in your local editor. When ready, execute git push to your GitHub branch.',
      details: ['Access to selective repositories only', 'Automatic branch targeting (main, staging)', 'Instant webhook recognition']
    },
    {
      title: '2. Intelligent Compilation',
      subtitle: 'CloudForge isolated micro-runners immediately wake up, pull your files, resolve dependencies, and compile.',
      details: ['Zero-configuration build environments', 'Automatic package lockfile audits', 'Multi-layer framework caching']
    },
    {
      title: '3. Global Edge Distribution',
      subtitle: 'The compiled static assets are atomic-versioned and deployed across our anycast edge nodes worldwide.',
      details: ['SSL updates in under 2 seconds', 'DDoS protection routing active', 'Serverless APIs activated instantly']
    }
  ];

  return (
    <section id="features" className="py-24 bg-brand-dark relative overflow-hidden">
      {/* Decorative Blur Backdrops */}
      <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-blue-900/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-1/4 left-0 w-[450px] h-[450px] bg-purple-900/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-28">

        {/* 1. Trusted By Section */}
        <div className="text-center space-y-6">
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">
            TRUSTED BY PRODUCT TEAMS AT LEADING STARTUPS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16 opacity-60 hover:opacity-85 transition-opacity">
            {TRUSTED_COMPANIES.map((company) => (
              <div key={company.name} className="flex items-center space-x-2.5 filter grayscale hover:grayscale-0 transition-all duration-300">
                <img src={company.logo} alt={company.name} className="w-6 h-6" referrerPolicy="no-referrer" />
                <span className="font-sans font-bold text-sm text-gray-300 tracking-tight">{company.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Core Bento Grid Features */}
        <div className="space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-xs font-mono text-blue-400 uppercase tracking-widest font-semibold">
              PLATFORM FEATS
            </h2>
            <h3 className="text-3xl sm:text-4xl font-sans font-extrabold text-white tracking-tight">
              An Complete Cloud Suite <br />
              For Rapid Shipping
            </h3>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Every infrastructure tool you need to launch static websites, micro-frontends, serverless APIs, or heavy databases, pre-configured securely out of the box.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feat) => (
              <div
                key={feat.title}
                className="bg-brand-card/70 border border-brand-border hover:border-zinc-800 rounded-2xl p-6.5 hover:shadow-xl hover:shadow-blue-950/20 transition-all duration-300 relative group overflow-hidden"
              >
                {/* Accent glow on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-xl bg-zinc-950 flex items-center justify-center border border-zinc-900 group-hover:scale-105 transition-transform duration-300">
                      {getIcon(feat.icon)}
                    </div>
                    <span className="text-[10px] font-mono tracking-widest font-semibold uppercase px-2 py-0.5 rounded bg-zinc-900 text-gray-400 group-hover:text-white border border-zinc-800 transition-colors">
                      {feat.badge}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-sans font-bold text-lg text-white group-hover:text-blue-400 transition-colors">
                      {feat.title}
                    </h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Interactive Deployment Workflow Diagram */}
        <div className="bg-brand-card/40 border border-brand-border rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <CloudLightning className="w-64 h-64 text-blue-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Steps Left Panel */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest">
                AUTOMATED PIPELINE
              </span>
              <h3 className="text-2xl sm:text-3xl font-sans font-extrabold text-white tracking-tight">
                Git-to-Edge Deployment Workflow
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                CloudForge intercepts code changes through deep GitHub integrations, handles production compiling in secure micro-environments, and serves the results on our low-latency cloud.
              </p>

              {/* Selector Buttons */}
              <div className="space-y-2 pt-2">
                {workflowSteps.map((step, idx) => (
                  <button
                    key={step.title}
                    type="button"
                    onClick={() => setActiveStep(idx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                      activeStep === idx
                        ? 'bg-zinc-950 border-blue-600/60 text-white shadow-md'
                        : 'bg-transparent border-zinc-900 text-gray-400 hover:border-zinc-800 hover:text-white'
                    }`}
                  >
                    <span className="text-sm font-sans font-semibold">{step.title}</span>
                    <ArrowRight className={`w-4 h-4 transition-transform ${activeStep === idx ? 'translate-x-1 text-blue-400' : 'text-gray-600'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Screen Right Panel */}
            <div className="lg:col-span-7">
              <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                  <span className="text-xs font-mono font-semibold text-gray-400">
                    {workflowSteps[activeStep].title}
                  </span>
                  <span className="text-[10px] bg-blue-950/50 text-blue-300 px-2 py-0.5 rounded border border-blue-900/30 font-mono">
                    active stage
                  </span>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-gray-300 leading-relaxed font-sans">
                    {workflowSteps[activeStep].subtitle}
                  </p>

                  <div className="space-y-2.5 pt-2">
                    {workflowSteps[activeStep].details.map((detail, dIdx) => (
                      <div key={dIdx} className="flex items-center gap-2.5 text-xs text-gray-400 font-mono bg-zinc-900/40 p-2.5 rounded-lg border border-zinc-900">
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Animated visual timeline representation */}
                <div className="flex items-center justify-between pt-4 border-t border-zinc-900/60">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${activeStep >= 0 ? 'bg-blue-500' : 'bg-zinc-800'}`}></div>
                    <div className={`h-1 w-10 sm:w-16 rounded-full ${activeStep >= 1 ? 'bg-blue-500' : 'bg-zinc-800'}`}></div>
                    <div className={`w-2 h-2 rounded-full ${activeStep >= 1 ? 'bg-blue-500' : 'bg-zinc-800'}`}></div>
                    <div className={`h-1 w-10 sm:w-16 rounded-full ${activeStep >= 2 ? 'bg-blue-500' : 'bg-zinc-800'}`}></div>
                    <div className={`w-2 h-2 rounded-full ${activeStep >= 2 ? 'bg-blue-500' : 'bg-zinc-800'}`}></div>
                  </div>
                  <span className="text-xs text-gray-500 font-mono">
                    CloudForge v1 Engine
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
