import { motion } from 'motion/react';
import { 
  GitBranch, 
  Rocket, 
  Container, 
  Bot, 
  Terminal, 
  KeyRound,
  ArrowUpRight
} from 'lucide-react';

const TECH_STACK = [
  { name: 'React', label: 'React' },
  { name: 'Node.js', label: 'Node.js' },
  { name: 'Docker', label: 'Docker' },
  { name: 'PostgreSQL', label: 'PostgreSQL' },
  { name: 'Prisma', label: 'Prisma' },
  { name: 'GitHub', label: 'GitHub' },
  { name: 'AWS', label: 'AWS (Soon)' }
];

const FEATURES = [
  {
    icon: GitBranch,
    title: 'GitHub Integration',
    description: 'Organize, sync, and deploy your repositories automatically on every commit and pull request.',
    tag: 'CI/CD Pipelines'
  },
  {
    icon: Rocket,
    title: 'One-click Deployments',
    description: 'Build, deploy, and monitor applications with zero configuration or complex pipeline setup.',
    tag: 'Zero Friction'
  },
  {
    icon: Container,
    title: 'Docker Builder',
    description: 'Isolated micro-VM container builds with automatic package caching and fast cold starts.',
    tag: 'Containerized'
  },
  {
    icon: Bot,
    title: 'AI Deployment Assistant',
    description: 'Your smart companion for analyzing stdout logs, diagnosing errors, and suggesting fixes.',
    tag: 'HAVN AI'
  },
  {
    icon: Terminal,
    title: 'Deployment Logs',
    description: 'Stream live build and server logs with full context, search, filtering, and execution history.',
    tag: 'Real-time'
  },
  {
    icon: KeyRound,
    title: 'Environment Variables',
    description: 'Encrypted secret storage with pre-flight schema validation to prevent missing env variables.',
    tag: 'Security'
  }
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-[#050507] text-white relative overflow-hidden border-t border-zinc-900/60">
      {/* Background Glow Overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-orange-600/5 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-24">
        
        {/* Trusted By / Tech Stack Banner */}
        <motion.div 
          className="space-y-6 text-center"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[11px] font-mono font-medium text-zinc-500 uppercase tracking-widest">
            Trusted & Supported Ecosystems
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-70 hover:opacity-100 transition-opacity">
            {TECH_STACK.map((tech) => (
              <div 
                key={tech.name} 
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors duration-200 text-xs font-medium"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500/80" />
                <span>{tech.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Features Header & Grid */}
        <div className="space-y-12">
          {/* Section Header */}
          <motion.div 
            className="text-center max-w-2xl mx-auto space-y-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1 text-[11px] text-orange-400 font-medium">
              <span>Platform Capabilities</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Everything You Need to Deploy Better
            </h2>
            
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Designed for modern development workflows. High-performance infrastructure without the ops complexity.
            </p>
          </motion.div>

          {/* 6 Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="group relative bg-[#0b0b0e]/90 hover:bg-[#0e0e12] border border-zinc-800/80 hover:border-orange-500/40 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm"
                >
                  {/* Subtle Accent Glow on Hover */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="space-y-4">
                    {/* Top Row: Icon & Tag */}
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 group-hover:scale-105 transition-transform duration-300">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono font-medium text-zinc-500 bg-zinc-900/80 border border-zinc-800 px-2 py-0.5 rounded-md group-hover:text-zinc-300 group-hover:border-zinc-700 transition-colors">
                        {feature.tag}
                      </span>
                    </div>

                    {/* Body: Title & Concise Description */}
                    <div className="space-y-2 text-left">
                      <h3 className="text-base font-semibold text-white group-hover:text-orange-400 transition-colors flex items-center justify-between">
                        <span>{feature.title}</span>
                        <ArrowUpRight className="w-4 h-4 text-zinc-600 opacity-0 group-hover:opacity-100 group-hover:text-orange-400 transition-all -translate-x-1 group-hover:translate-x-0" />
                      </h3>
                      <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}