import { useState, FormEvent } from 'react';
import { Github, Twitter, MessageSquare, Terminal, Send, Check } from 'lucide-react';

interface FooterProps {
  setView: (view: string) => void;
}

export default function Footer({ setView }: FooterProps) {
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
    <footer id="main-footer" className="bg-[#030303]/60 border-t border-white/5 pt-24 pb-12 relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl -z-10 animate-pulse-slow" style={{ animationDelay: '4s' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 pb-16">
          
          {/* Logo & Newsletter Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setView('landing')}>
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 shadow-md">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-sans font-bold text-lg text-white tracking-tight">CloudForge</span>
            </div>
            
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              Supercharge your shipping cycles. Connect your repository, write code, and let CloudForge handle global compilation, distribution, and instant edge-node autoscaling.
            </p>

            <div className="space-y-3">
              <span className="block text-xs font-semibold text-gray-400 uppercase tracking-widest">Subscribe to changelogs</span>
              <form onSubmit={handleSubscribe} className="relative max-w-sm">
                <input
                  type="email"
                  placeholder="name@company.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all pr-12"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bg-white/10 hover:bg-blue-600 p-2 rounded-lg transition-all text-white flex items-center justify-center cursor-pointer"
                  aria-label="Subscribe"
                >
                  {subscribed ? <Check className="w-4 h-4 text-green-400" /> : <Send className="w-4 h-4" />}
                </button>
              </form>
              {subscribed && (
                <span className="text-xs text-green-400 block transition-opacity duration-300">
                  Subscription successful! Welcome to CloudForge weekly.
                </span>
              )}
            </div>
          </div>

          {/* Directory Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-gray-200 uppercase tracking-wider">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Deployment</a></li>
              <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Edge Network</a></li>
              <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Serverless DB</a></li>
              <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Billing Plans</a></li>
              <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">CLI Tooling</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-gray-200 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#docs" onClick={(e) => { e.preventDefault(); alert('Docs coming soon!'); }} className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#guides" onClick={(e) => { e.preventDefault(); alert('Guides coming soon!'); }} className="text-gray-400 hover:text-white transition-colors">Framework Guides</a></li>
              <li><a href="#status" onClick={(e) => { e.preventDefault(); alert('All Edge systems are operational.'); }} className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5">System Status <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span></a></li>
              <li><a href="#api" onClick={(e) => { e.preventDefault(); alert('API is currently in v1-beta.'); }} className="text-gray-400 hover:text-white transition-colors">REST API Docs</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-gray-200 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#about" onClick={(e) => { e.preventDefault(); }} className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#careers" onClick={(e) => { e.preventDefault(); }} className="text-gray-400 hover:text-white transition-colors">Careers <span className="text-[10px] bg-blue-950 text-blue-400 border border-blue-900 px-1.5 py-0.5 rounded ml-1">We're hiring</span></a></li>
              <li><a href="#blog" onClick={(e) => { e.preventDefault(); }} className="text-gray-400 hover:text-white transition-colors">SaaS Blog</a></li>
              <li><a href="#press" onClick={(e) => { e.preventDefault(); }} className="text-gray-400 hover:text-white transition-colors">Brand Assets</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-gray-200 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#terms" onClick={(e) => { e.preventDefault(); }} className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#privacy" onClick={(e) => { e.preventDefault(); }} className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#security" onClick={(e) => { e.preventDefault(); }} className="text-gray-400 hover:text-white transition-colors">Security Audit</a></li>
              <li><a href="#sla" onClick={(e) => { e.preventDefault(); }} className="text-gray-400 hover:text-white transition-colors">Uptime SLA</a></li>
            </ul>
          </div>

        </div>

        {/* Lower Section status row */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-gray-500">
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
