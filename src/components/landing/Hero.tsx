import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Terminal, ArrowRight, CheckCircle2, RefreshCw, GitBranch, Shield, Zap, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const FRAMEWORKS = [
  { id: 'react', name: 'React (Vite)', icon: '⚛️', repo: 'github.com/dev-master/react-dashboard-ui', cmd: 'vite build' },
  { id: 'next', name: 'Next.js App Router', icon: '▲', repo: 'github.com/dev-master/ecommerce-portal', cmd: 'next build' },
  { id: 'node', name: 'Node.js Express', icon: '🟢', repo: 'github.com/dev-master/nest-graphql-api', cmd: 'node server.js' },
  { id: 'python', name: 'FastAPI Python', icon: '🐍', repo: 'github.com/dev-master/fastapi-prediction-model', cmd: 'uvicorn main:app' }
];

export default function Hero() {
  const navigate = useNavigate();
  const [selectedFramework, setSelectedFramework] = useState(FRAMEWORKS[0]);
  const [repoInput, setRepoInput] = useState(FRAMEWORKS[0].repo);
  const [deployState, setDeployState] = useState<'idle' | 'cloning' | 'building' | 'deploying' | 'success'>('success');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);

  return (
    <section id="hero" className="relative pt-32 pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Main Headline Messaging Details */}
          <div className="space-y-6 text-left relative z-10">
            <div className="inline-flex items-center gap-2 bg-blue-950/40 border border-blue-900/60 rounded-full px-3 py-1 text-xs text-blue-400 font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Global Anycast Edge Network Engine</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-sans font-extrabold text-white tracking-tight leading-[1.1]">
              Deploy your Git projects <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                to the global edge grid.
              </span>
            </h1>
            <p className="text-gray-400 text-base max-w-xl font-sans leading-relaxed">
              CloudForge coordinates autonomous micro-VM pipelines directly from your production repository layouts, ensuring zero-latency cold starts across 114 distributed global PoPs.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                onClick={() => navigate(ROUTES.SIGNUP)} 
                className="bg-white hover:bg-gray-100 text-black font-semibold text-sm px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-md group cursor-pointer active:scale-98"
              >
                Start Free Deployments
                <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Interactive Console Sandbox Architecture Preview */}
          <div className="relative z-10">
            <div className="bg-[#0b0b0c] border border-zinc-800/80 rounded-2xl shadow-2xl overflow-hidden p-5 space-y-4 font-mono">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-red-500/80 rounded-full"></span>
                  <span className="w-2.5 h-2.5 bg-yellow-500/80 rounded-full"></span>
                  <span className="w-2.5 h-2.5 bg-green-500/80 rounded-full"></span>
                  <span className="ml-1.5 font-medium text-gray-400">cloudforge-terminal-v2.sh</span>
                </div>
                <span className="text-[10px] bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">sandbox cluster</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {FRAMEWORKS.map((fw) => (
                  <button
                    key={fw.id}
                    onClick={() => {
                      setSelectedFramework(fw);
                      setRepoInput(fw.repo);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedFramework.id === fw.id
                        ? 'bg-blue-950/20 border-blue-700/80 text-white'
                        : 'bg-zinc-950/40 border-zinc-900 hover:border-zinc-800 text-gray-400'
                    }`}
                  >
                    <span className="block text-sm mb-1">{fw.icon}</span>
                    <span className="block text-[10px] font-bold truncate leading-none">{fw.name}</span>
                  </button>
                ))}
              </div>

              {deployState !== 'idle' && (
                <div className="mt-4">
                  <AnimatePresence>
                    {deployState === 'success' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-white">Deployment Live</p>
                            <a
                              href="#live"
                              onClick={(e) => {
                                e.preventDefault();
                                navigate(ROUTES.DASHBOARD);
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
                          onClick={() => navigate(ROUTES.DASHBOARD)}
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
    </section>
  );
}