import { useState, FormEvent } from 'react';
import { Mail, Lock, Eye, EyeOff, Github, Chrome, Terminal, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Form simple validation
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all security fields.');
      return;
    }

    if (!email.includes('@')) {
      setError('Please insert a valid email address.');
      return;
    }

    setIsLoading(true);

    // Simulate real authenticating request
    setTimeout(() => {
      setIsLoading(false);
      navigate(ROUTES.DASHBOARD);
    }, 1500);
  };

  const handleOAuthLogin = (provider: 'google' | 'github') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate(ROUTES.DASHBOARD);
    }, 1200);
  };

  return (
    <main id="login-container" className="min-h-screen bg-brand-dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#09090a]/60 border border-zinc-900 rounded-3xl p-6 sm:p-10 backdrop-blur-xl relative z-10">
        
        {/* Left Side Content - Form Panel */}
        <div className="space-y-6 w-full">
          <div className="space-y-2">
            <h2 className="text-2xl font-sans font-extrabold text-white tracking-tight">Access Developer Cluster</h2>
            <p className="text-xs text-gray-400 font-sans">
              Enter your authentication criteria to manage high-availability workflows.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-xl text-xs text-red-400 font-mono">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block">Developer Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-850 focus:border-blue-600 rounded-xl text-xs text-white placeholder-gray-600 outline-none transition-all font-sans"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block">Cluster Key</label>
                <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-[11px] font-sans text-blue-400 hover:underline">Recover passkey?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-zinc-950 border border-zinc-850 focus:border-blue-600 rounded-xl text-xs text-white placeholder-gray-600 outline-none transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-gray-400 font-sans select-none cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-zinc-950 border-zinc-800 text-blue-600 accent-blue-600 focus:ring-0"
                />
                Keep environment session authorized
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 mt-2 cursor-pointer"
            >
              {isLoading ? 'Decrypting credentials...' : 'Authenticate Environment'}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="relative my-6 text-center">
            <span className="absolute inset-x-0 top-1/2 h-px bg-zinc-900 -translate-y-1/2"></span>
            <span className="relative bg-[#0b0b0c] px-3 text-[10px] font-mono text-gray-500 uppercase tracking-widest">or bridge connection</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleOAuthLogin('github')}
              className="flex items-center justify-center gap-2 py-2.5 border border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 hover:bg-zinc-950 text-xs text-white font-medium rounded-xl transition-all active:scale-98 cursor-pointer"
            >
              <Github className="w-4 h-4" /> GitHub
            </button>
            <button
              type="button"
              onClick={() => handleOAuthLogin('google')}
              className="flex items-center justify-center gap-2 py-2.5 border border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 hover:bg-zinc-950 text-xs text-white font-medium rounded-xl transition-all active:scale-98 cursor-pointer"
            >
              <Chrome className="w-4 h-4" /> Google
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 font-sans pt-2">
            New infrastructure architect?{' '}
            <button onClick={() => navigate(ROUTES.SIGNUP)} className="text-blue-400 hover:underline font-medium">Create provision link</button>
          </p>
        </div>

        {/* Right Side Content - Marketing Data Info Panel */}
        <div className="hidden md:flex flex-col justify-between h-full bg-zinc-950/60 border border-zinc-900 rounded-2xl p-6 space-y-10">
          <div className="space-y-4">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-900/40 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
            </div>
            <h3 className="text-sm font-bold text-white font-sans">Isolated Provision Guards</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              All dashboard configurations utilize automated strict mutually verified client authentication, backed by SOC2 Type II log compliance frameworks configured by default. Join thousands of cloud-native developers on the global grid.
            </p>
          </div>

          {/* Mini active graph layout decoration */}
          <div className="bg-brand-card/75 border border-brand-border p-6 rounded-2xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <span className="text-xs font-mono text-gray-400 font-medium">LIVE COMPUTE METRIC</span>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-gray-500">Global Cold Start Latency:</span>
                <span className="text-white font-bold">11.4ms (p99)</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-gray-500">Anycast Edge Nodes:</span>
                <span className="text-blue-400 font-bold">108 Active POPs</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-gray-500">Monthly SSL renewals:</span>
                <span className="text-purple-400 font-bold">100% Automated</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}