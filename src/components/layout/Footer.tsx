import { useState, FormEvent } from 'react';
import { Github, Twitter, MessageSquare, Send, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export default function Footer() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer id="main-footer" className="bg-[#030303]/60 border-t border-white/5 pt-24 pb-12 relative overflow-hidden w-full">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl -z-10 animate-pulse-slow" style={{ animationDelay: '4s' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 pb-16 border-b border-white/5">
          <div className="lg:col-span-2 space-y-5">
            <div onClick={() => navigate(ROUTES.HOME)} className="flex items-center gap-2 text-white font-bold text-lg tracking-tight cursor-pointer">
              <span>CloudForge</span>
            </div>
            <p className="text-xs text-gray-500 font-sans leading-relaxed max-w-sm">
              Autonomous global deployment engine delivering automated serverless scale architecture, Anycast static network replication, and secure micro-VM edge isolation configurations.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-mono text-white uppercase tracking-wider">Infrastructure</h4>
            <ul className="space-y-2.5 text-xs text-gray-400 font-sans">
              <li><a href="#features" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Edge Nodes</a></li>
              <li><button onClick={() => navigate(ROUTES.LOGIN)} className="hover:text-white transition-colors text-left">Cluster Login</button></li>
              <li><button onClick={() => navigate(ROUTES.SIGNUP)} className="hover:text-white transition-colors text-left">Registration</button></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-mono text-white uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5 text-xs text-gray-400 font-sans">
              <li><a href="#about" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">System Metrics</a></li>
              <li><a href="#security" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Security Guard</a></li>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-mono text-white uppercase tracking-wider">Newsletter Pipeline</h4>
            <form onSubmit={handleSubscribe} className="relative max-w-sm">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@domain.com"
                className="w-full bg-zinc-950 border border-zinc-850 focus:border-blue-600 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 outline-none transition-all font-sans"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-zinc-900 border border-zinc-800 text-gray-400 hover:text-white p-1.5 rounded-lg transition-colors"
                aria-label="Subscribe"
              >
                {subscribed ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Send className="w-3.5 h-3.5" />}
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-gray-500">
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span>All Systems Operational</span>
            </div>
            <span>Global Edge: 114 Nodes</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Privacy</a>
            <a href="#security" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Security</a>
            <a href="#api" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">API Reference</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1 text-white opacity-80" aria-label="GitHub">
              <Github className="w-3.5 h-3.5" />
              <span className="font-bold text-xs">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}