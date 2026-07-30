import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Check, 
  Rocket, 
  RefreshCw, 
  Plus, 
  Home, 
  FolderGit2, 
  Layers, 
  FileText, 
  Bot, 
  Settings, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown 
} from 'lucide-react';
import { ROUTES } from '../../constants/routes';

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

const STATS = [
  { label: 'Projects', value: '6', change: '+ 2 this month', isPositive: true },
  { label: 'Deployments', value: '14', change: '+ 5 this month', isPositive: true },
  { label: 'Successful', value: '12', change: '80%', isPositive: true, showArrow: true },
  { label: 'Failed', value: '2', change: '16%', isPositive: false, showArrow: true },
];

const RECENT_DEPLOYMENTS = [
  { id: '1', name: 'my-portfolio', branch: 'main', time: '2m ago', status: 'Success', icon: 'P' },
  { id: '2', name: 'api-server', branch: 'dev', time: '15m ago', status: 'Success', icon: 'R' },
  { id: '3', name: 'blog-site', branch: 'main', time: '32m ago', status: 'Failed', icon: 'R' },
  { id: '4', name: 'landing-page', branch: 'main', time: '1h ago', status: 'Success', icon: 'R' },
  { id: '5', name: 'dashboard', branch: 'main', time: '2h ago', status: 'Success', icon: 'R' },
];

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section id="hero" className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-[#050507] text-white">
      {/* Background Ambient Glows & Sparkles */}
     

      {/* Decorative background grid texture */}
      <div 
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Background Decorative Sparkle Graphics */}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 items-center">
          
          {/* Left Column: Hero Copy & Actions */}
          <motion.div 
            className="lg:col-span-5 space-y-7 text-left"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-950/80 border border-orange-500/30 text-xs font-medium text-orange-400 shadow-sm backdrop-blur-md">
              <Rocket className="w-3.5 h-3.5 text-orange-500" />
              <span>Deploy with Confidence</span>
            </div>

            {/* Headline */}
            <div className="space-y-1">
              <h1 className="text-5xl sm:text-6xl xl:text-7xl font-extrabold text-white tracking-tight leading-[1.05]">
                HAVN
              </h1>
              <div className="relative inline-block text-5xl sm:text-6xl xl:text-7xl font-extrabold text-white tracking-tight leading-[1.05]">
                <span>From </span>
                <span className="text-orange-500">Cöde</span>
                <span> to Cloud</span>
                <span className="text-orange-500">.</span>
                
                {/* Underline Curved Swoosh */}
                <svg className="absolute -bottom-2.5 left-0 w-full h-4 text-orange-500/90 pointer-events-none" viewBox="0 0 300 16" fill="none">
                  <path d="M 2 10 C 80 2, 200 2, 298 12" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Description */}
            <p className="text-zinc-400 text-sm sm:text-base max-w-md font-sans leading-relaxed">
              Deploy applications with confidence. Understand every build. Manage everything from one <span className="text-orange-500 font-medium">calm</span> workspace.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                onClick={() => navigate(ROUTES.SIGNUP)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-6 py-3.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 active:scale-[0.98] cursor-pointer"
              >
                <span>Start Deploying</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-zinc-950 hover:bg-zinc-900 text-white border border-zinc-800 text-sm font-semibold px-5 py-3.5 rounded-xl flex items-center gap-2.5 transition-all active:scale-[0.98]"
              >
                <GithubIcon className="w-4 h-4 fill-current" />
                <span>View on GitHub</span>
              </a>
            </div>

            {/* Feature Checkmarks */}
            <div className="flex flex-wrap items-center gap-5 pt-3 text-xs font-medium text-zinc-300">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-orange-500/60 flex items-center justify-center text-orange-500 bg-orange-500/10">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>Self-hosted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-orange-500/60 flex items-center justify-center text-orange-500 bg-orange-500/10">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>Developer-first</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-orange-500/60 flex items-center justify-center text-orange-500 bg-orange-500/10">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>Built for you</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Premium Deployment Dashboard Preview */}
          <motion.div 
            className="lg:col-span-7 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Outer Container with Glowing Orange Border */}
            <div className="relative bg-[#09090c] border-2 border-orange-500/70 rounded-2xl shadow-[0_0_50px_rgba(249,115,22,0.18)] overflow-hidden text-zinc-300 text-xs font-sans">
              <div className="flex flex-col md:flex-row min-h-[460px]">
                
                {/* Sidebar */}
                <aside className="w-full md:w-44 bg-[#070709] border-b md:border-b-0 md:border-r border-zinc-800/80 p-3.5 flex flex-col justify-between shrink-0">
                  <div className="space-y-4">
                    {/* Brand Icon Box */}
                    <div className="px-1 pt-0.5">
                      <div className="w-8 h-8 rounded-lg bg-[#0d0d12] border-2 border-orange-500 flex items-center justify-center font-bold text-orange-500 text-sm shadow-md">
                        H
                      </div>
                    </div>

                    {/* Nav List */}
                    <nav className="space-y-1">
                      <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-orange-500 text-white font-semibold text-xs shadow-md shadow-orange-500/20">
                        <Home className="w-3.5 h-3.5" />
                        <span>Overview</span>
                      </button>
                      <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 transition-colors text-xs">
                        <FolderGit2 className="w-3.5 h-3.5" />
                        <span>Projects</span>
                      </button>
                      <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 transition-colors text-xs">
                        <Layers className="w-3.5 h-3.5" />
                        <span>Deployments</span>
                      </button>
                      <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 transition-colors text-xs">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Logs</span>
                      </button>
                      <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 transition-colors text-xs">
                        <Bot className="w-3.5 h-3.5" />
                        <span>AI Assistant</span>
                      </button>
                      <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 transition-colors text-xs">
                        <Settings className="w-3.5 h-3.5" />
                        <span>Settings</span>
                      </button>
                    </nav>
                  </div>

                  {/* User Profile */}
                  <div className="pt-3 border-t border-zinc-900 flex items-center gap-2.5 px-1">
                    <div className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-200 flex items-center justify-center font-bold text-[10px] border border-zinc-700">
                      JD
                    </div>
                    <div className="overflow-hidden text-left">
                      <p className="text-[11px] font-semibold text-white leading-none">John Doe</p>
                      <p className="text-[9px] text-zinc-500 leading-tight mt-0.5">Pro Plan</p>
                    </div>
                  </div>
                </aside>

                {/* Main Dashboard Area */}
                <main className="flex-1 p-4 sm:p-5 space-y-4 overflow-hidden bg-[#0a0a0e]">
                  
                  {/* Dashboard Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/60 pb-3">
                    <div className="text-left">
                      <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                        Welcome back, Developer <span>👋</span>
                      </h2>
                      <p className="text-[10px] text-zinc-400">Here's what's happening with your projects</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-zinc-400 flex items-center gap-1">
                        Last updated 2m ago
                        <RefreshCw className="w-2.5 h-2.5" />
                      </span>
                      <button 
                        onClick={() => navigate(ROUTES.DASHBOARD)}
                        className="bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1 shadow transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>New Project</span>
                      </button>
                    </div>
                  </div>

                  {/* 4 Stats Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {STATS.map((stat) => (
                      <div key={stat.label} className="bg-zinc-900/60 border border-zinc-800/80 p-2.5 rounded-xl text-left">
                        <p className="text-[10px] text-zinc-400 font-medium">{stat.label}</p>
                        <p className="text-base font-extrabold text-white mt-0.5">{stat.value}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          {stat.showArrow && (
                            stat.isPositive ? (
                              <TrendingUp className="w-2.5 h-2.5 text-emerald-400" />
                            ) : (
                              <TrendingDown className="w-2.5 h-2.5 text-rose-500" />
                            )
                          )}
                          <span className={`text-[9px] font-bold ${stat.isPositive ? 'text-emerald-400' : 'text-rose-500'}`}>
                            {stat.change}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Lower Grid Split */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-0.5">
                    
                    {/* Left: Recent Deployments & AI Banner */}
                    <div className="sm:col-span-7 bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-3 space-y-2.5 text-left">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[11px] font-bold text-white">Recent Deployments</h3>
                        <button onClick={() => navigate(ROUTES.DASHBOARD)} className="text-[9px] text-zinc-400 hover:text-zinc-200">
                          View all
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        {RECENT_DEPLOYMENTS.map((dep) => (
                          <div 
                            key={dep.id} 
                            className="flex items-center justify-between p-1.5 rounded-lg hover:bg-zinc-800/40 transition-colors text-[10px]"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className={`w-4 h-4 rounded flex items-center justify-center font-bold text-[9px] shrink-0 ${
                                dep.status === 'Success' 
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              }`}>
                                {dep.icon}
                              </div>
                              <span className="font-semibold text-zinc-200 truncate">{dep.name}</span>
                              <span className="text-zinc-500 text-[9px]">{dep.branch}</span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-zinc-500 text-[9px]">{dep.time}</span>
                              <span className={`flex items-center gap-1 font-semibold text-[9px] ${
                                dep.status === 'Success' ? 'text-emerald-400' : 'text-rose-400'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${dep.status === 'Success' ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                                {dep.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* AI Assistant Box */}
                      <div className="mt-2 bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 rounded-lg p-2 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-left">
                          <div className="w-6 h-6 rounded-md bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                            <Bot className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-white leading-none">AI Assistant</p>
                            <p className="text-[9px] text-zinc-400 mt-0.5">Hi! I'm HAVN AI</p>
                            <p className="text-[8px] text-zinc-500">Here to help you deploy better.</p>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                      </div>
                    </div>

                    {/* Right: Build Overview & Quick Notes */}
                    <div className="sm:col-span-5 space-y-3">
                      
                      {/* Graph Card */}
                      <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-3 text-left space-y-2">
                        <h3 className="text-[11px] font-bold text-white">Build Overview</h3>
                        
                        <div className="relative h-24 w-full flex items-center">
                          {/* Y-axis labels */}
                          <div className="flex flex-col justify-between h-full text-[8px] text-zinc-500 pr-1 select-none">
                            <span>30</span>
                            <span>20</span>
                            <span>10</span>
                            <span>0</span>
                          </div>

                          {/* Chart SVG */}
                          <div className="relative flex-1 h-full">
                            <svg className="w-full h-full overflow-visible" viewBox="0 0 160 80" fill="none" preserveAspectRatio="none">
                              {/* Grid lines */}
                              <line x1="0" y1="0" x2="160" y2="0" stroke="#27272a" strokeDasharray="2 2" strokeWidth="0.5" />
                              <line x1="0" y1="26" x2="160" y2="26" stroke="#27272a" strokeDasharray="2 2" strokeWidth="0.5" />
                              <line x1="0" y1="53" x2="160" y2="53" stroke="#27272a" strokeDasharray="2 2" strokeWidth="0.5" />
                              <line x1="0" y1="80" x2="160" y2="80" stroke="#27272a" strokeDasharray="2 2" strokeWidth="0.5" />

                              {/* Glowing Line path */}
                              <path
                                d="M 10 60 Q 30 20 50 30 T 90 42 T 130 28 L 150 12"
                                stroke="#f97316"
                                strokeWidth="2"
                                fill="none"
                              />

                              {/* Nodes on chart */}
                              <circle cx="10" cy="60" r="2.5" fill="#f97316" />
                              <circle cx="45" cy="28" r="2.5" fill="#f97316" />
                              <circle cx="80" cy="42" r="2.5" fill="#f97316" />
                              <circle cx="115" cy="32" r="2.5" fill="#f97316" />
                              <circle cx="150" cy="12" r="3" fill="#f97316" className="animate-pulse" />
                            </svg>
                          </div>
                        </div>

                        {/* X-axis labels */}
                        <div className="flex justify-between text-[8px] text-zinc-500 pl-4 pt-1 border-t border-zinc-900">
                          <span>May 20</span>
                          <span>May 21</span>
                          <span>May 22</span>
                          <span>May 23</span>
                          <span>May 24</span>
                        </div>
                      </div>

                      {/* Quick Notes Card */}
                      <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-3 text-left space-y-1">
                        <h3 className="text-[11px] font-bold text-white">Quick Notes</h3>
                        <p className="text-[10px] text-zinc-400 leading-tight">
                          Remember to set environment variables before deploying to production.
                        </p>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[8px] text-zinc-500">2m ago</span>
                          <ChevronRight className="w-3 h-3 text-zinc-400" />
                        </div>
                      </div>

                    </div>

                  </div>

                </main>

              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}