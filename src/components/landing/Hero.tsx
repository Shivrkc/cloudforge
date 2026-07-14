import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Terminal, ArrowRight, CheckCircle2, RefreshCw, GitBranch, Shield, Zap, Sparkles } from 'lucide-react';
import { ActiveView } from '../../types';

interface HeroProps {
  setView: (view: ActiveView) => void;
}

const FRAMEWORKS = [
  { id: 'react', name: 'React (Vite)', icon: '⚛️', repo: 'github.com/dev-master/react-dashboard-ui', cmd: 'vite build' },
  { id: 'next', name: 'Next.js App Router', icon: '▲', repo: 'github.com/dev-master/ecommerce-portal', cmd: 'next build' },
  { id: 'node', name: 'Node.js Express', icon: '🟢', repo: 'github.com/dev-master/nest-graphql-api', cmd: 'node server.js' },
  { id: 'python', name: 'FastAPI Python', icon: '🐍', repo: 'github.com/dev-master/fastapi-prediction-model', cmd: 'uvicorn main:app' }
];

export default function Hero({ setView }: HeroProps) {
  const [selectedFramework, setSelectedFramework] = useState(FRAMEWORKS[0]);
  const [repoInput, setRepoInput] = useState(FRAMEWORKS[0].repo);
  const [deployState, setDeployState] = useState<'idle' | 'cloning' | 'building' | 'deploying' | 'success'>('idle');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  // Sync repo input when changing framework
  const selectFramework = (fw: typeof FRAMEWORKS[0]) => {
    if (deployState === 'idle' || deployState === 'success') {
      setSelectedFramework(fw);
      setRepoInput(fw.repo);
      setDeployState('idle');
      setConsoleLogs([]);
      setProgress(0);
    }
  };

  const handleSimulateDeploy = () => {
    if (deployState !== 'idle' && deployState !== 'success') return;
    
    setDeployState('cloning');
    setConsoleLogs([
      `[14:10:01] Preparing isolated build workspace...`,
      `[14:10:02] Establishing handshake with GitHub OAuth provider...`,
      `[14:10:03] Cloning repository ${repoInput} [branch: main]...`
    ]);
    setProgress(15);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (deployState === 'cloning') {
      timer = setTimeout(() => {
        setDeployState('building');
        setConsoleLogs(prev => [
          ...prev,
          `[14:10:05] Clone completed (Size: 12.8MB).`,
          `[14:10:06] Caching layer optimized. Resolving lockfile dependencies...`,
          `[14:10:08] Run command: ${selectedFramework.cmd}`
        ]);
        setProgress(45);
      }, 1800);
    } else if (deployState === 'building') {
      timer = setTimeout(() => {
        setDeployState('deploying');
        setConsoleLogs(prev => [
          ...prev,
          `[14:10:11] Transpiling typescript assets... ready.`,
          `[14:10:12] Bundling assets to static Edge-Distribution directory "dist/"...`,
          `[14:10:13] Provisioning automatic Let's Encrypt wildcard SSL certificates...`,
          `[14:10:14] Spreading static assets onto 100+ global CloudForge edge POP nodes...`
        ]);
        setProgress(85);
      }, 2500);
    } else if (deployState === 'deploying') {
      timer = setTimeout(() => {
        setDeployState('success');
        setConsoleLogs(prev => [
          ...prev,
          `[14:10:16] Edge routers updated in 12ms.`,
          `[14:10:17] Health checks passed securely.`,
          `[14:10:18] SUCCESS! Service is LIVE and scaling automatically at cloudforge.app/live`
        ]);
        setProgress(100);
      }, 2200);
    }
    return () => clearTimeout(timer);
  }, [deployState, selectedFramework]);

  return (
    <section id="hero" className="relative pt-32 pb-24 overflow-hidden bg-grid-pattern min-h-screen flex items-center">
      {/* Visual background lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none -z-10 animate-pulse-slow"></div>
      <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-slow" style={{ animationDelay: '3s' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Text Content Block */}
          <div className="lg:col-span-5 space-y-8 text-center lg:text-left flex flex-col justify-center">
            {/* Promo Pill */}
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-blue-400 text-xs font-semibold mb-6 w-fit mx-auto lg:mx-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span>v2.0 Deployments Now Live</span>
            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-[76px] font-extrabold tracking-tighter leading-[0.95] bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent text-left">
              From Code<br/>to Cloud.
            </h1>

            <p className="text-lg text-gray-400 leading-relaxed max-w-md mx-auto lg:mx-0 text-left">
              CloudForge is the modern deployment engine for high-performance teams. Connect your repo, push code, and we handle the rest. Global edge networking included.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => setView('signup')}
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl text-md font-bold transition-all flex items-center shadow-2xl shadow-blue-600/30 group cursor-pointer"
              >
                Start Deploying Now
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('features');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-8 py-4 rounded-xl text-md font-bold transition-all cursor-pointer"
              >
                Book a Demo
              </button>
            </div>

            {/* Key Value indicators */}
            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-zinc-900/60 max-w-md mx-auto lg:mx-0">
              <div>
                <span className="block text-2xl font-bold font-sans text-white">99.99%</span>
                <span className="text-xs text-gray-500 font-mono tracking-wider">Uptime SLA</span>
              </div>
              <div>
                <span className="block text-2xl font-bold font-sans text-white">&lt; 15ms</span>
                <span className="text-xs text-gray-500 font-mono tracking-wider">Cold Starts</span>
              </div>
              <div>
                <span className="block text-2xl font-bold font-sans text-white">100+</span>
                <span className="text-xs text-gray-500 font-mono tracking-wider">Edge Nodes</span>
              </div>
            </div>

            {/* Trusted By Section (Small) */}
            <div className="mt-16 text-left">
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-4">Trusted by modern engineering teams</p>
              <div className="flex flex-wrap gap-8 opacity-40 grayscale contrast-125">
                <div className="font-black text-xl tracking-tighter text-white">GITHUB</div>
                <div className="font-black text-xl tracking-tighter text-white">STRIKE</div>
                <div className="font-black text-xl tracking-tighter text-white">VERCEL</div>
                <div className="font-black text-xl tracking-tighter text-white">RAILWAY</div>
              </div>
            </div>
          </div>

          {/* Interactive Live Demo Component Block */}
          <div className="lg:col-span-7 w-full">
            <div className="bg-brand-card border border-brand-border rounded-2xl shadow-2xl relative overflow-hidden glow-blue">
              {/* Header card rail */}
              <div className="glass-header px-5 py-3.5 flex items-center justify-between border-b border-brand-border">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  <span className="text-xs font-mono text-gray-500 pl-2">cloudforge-deploy-wizard --v1.0</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                  <span className="text-xs font-mono text-blue-400">interactive sandbox</span>
                </div>
              </div>

              {/* Form elements inside simulator */}
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-3">
                    1. Select Application Framework
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {FRAMEWORKS.map((fw) => (
                      <button
                        key={fw.id}
                        type="button"
                        onClick={() => selectFramework(fw)}
                        className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-sans transition-all text-left ${
                          selectedFramework.id === fw.id
                            ? 'bg-blue-950/50 border-blue-600/80 text-white font-medium shadow-md shadow-blue-950/50'
                            : 'bg-zinc-950/40 border-zinc-800/80 text-gray-400 hover:border-zinc-700 hover:text-white'
                        }`}
                        disabled={deployState !== 'idle' && deployState !== 'success'}
                      >
                        <span className="text-sm">{fw.icon}</span>
                        <span className="truncate">{fw.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2.5">
                    2. Connect Git Repository
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                        <GitBranch className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={repoInput}
                        onChange={(e) => setRepoInput(e.target.value)}
                        placeholder="github.com/username/repository"
                        className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-blue-500 font-mono"
                        disabled={deployState !== 'idle' && deployState !== 'success'}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSimulateDeploy}
                      disabled={deployState !== 'idle' && deployState !== 'success'}
                      className={`px-6 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        deployState !== 'idle' && deployState !== 'success'
                          ? 'bg-zinc-900 border border-zinc-800 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 active:scale-95 shadow-md shadow-blue-950'
                      }`}
                    >
                      {deployState === 'success' ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin-once" /> Deploy Again
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current" /> Trigger Deploy
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Simulated build progress and live console */}
                {deployState !== 'idle' && (
                  <div className="space-y-4 pt-4 border-t border-zinc-900/60">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="flex items-center gap-1.5 text-gray-400">
                        {deployState === 'success' ? (
                          <span className="text-green-400 flex items-center gap-1 font-semibold">
                            <CheckCircle2 className="w-4 h-4" /> COMPLETED
                          </span>
                        ) : (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                            BUILD PROGRESS: {progress}%
                          </>
                        )}
                      </span>
                      <span className="text-gray-500">Running on Edge Node cf-sea-02</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-500 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>

                    {/* Simulated terminal console */}
                    <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-900/60 h-44 overflow-y-auto font-mono text-xs text-gray-400 space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-zinc-950">
                      {consoleLogs.map((log, index) => (
                        <div
                          key={index}
                          className={`leading-relaxed ${
                            log.includes('SUCCESS') || log.includes('SUCCESSFUL')
                              ? 'text-green-400 font-bold'
                              : log.includes('Run command') || log.includes('Cloning')
                              ? 'text-blue-300'
                              : 'text-gray-400'
                          }`}
                        >
                          {log}
                        </div>
                      ))}
                    </div>

                    {/* Deployment live link overlay */}
                    <AnimatePresence>
                      {deployState === 'success' && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-green-950/20 border border-green-900/40 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-green-900/30 flex items-center justify-center text-green-400">
                              <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="block text-xs font-semibold text-green-400 uppercase tracking-wider font-mono">Live Deployment url</span>
                              <a
                                href="#live"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setView('dashboard');
                                }}
                                className="text-sm font-medium text-white hover:underline flex items-center gap-1 font-sans"
                              >
                                cloudforge.app/live-sandbox
                                <span className="text-[10px] bg-green-900/50 text-green-300 border border-green-800 px-1.5 py-0.5 rounded font-mono font-medium leading-none ml-1">
                                  visit demo console
                                </span>
                              </a>
                            </div>
                          </div>
                          <button
                            onClick={() => setView('dashboard')}
                            className="text-xs bg-green-500 hover:bg-green-400 text-black font-semibold px-4 py-2.5 rounded-lg shadow-sm font-sans transition-all w-full sm:w-auto"
                          >
                            Explore Complete Console
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
