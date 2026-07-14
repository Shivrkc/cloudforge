import { useState, FormEvent } from 'react';
import { Mail, Lock, Eye, EyeOff, Github, Chrome, Terminal, ArrowRight, ShieldCheck } from 'lucide-react';
import { ActiveView } from '../types';

interface LoginProps {
  setView: (view: ActiveView) => void;
}

export default function Login({ setView }: LoginProps) {
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
      setView('dashboard');
    }, 1500);
  };

  const handleOAuthLogin = (provider: 'google' | 'github') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setView('dashboard');
    }, 1200);
  };

  return (
    <main id="login-container" className="min-h-screen bg-brand-dark flex flex-col lg:flex-row relative pt-20">
      
      {/* Glow Backdrops */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Left panel: Authenticate form */}
      <section className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-12 py-12 z-10">
        <div className="w-full max-w-md bg-brand-card/85 border border-brand-border rounded-2xl p-8 sm:p-10 shadow-2xl relative">
          
          <div className="space-y-6">
            {/* Logo details */}
            <div className="flex flex-col items-center text-center space-y-2">
              <div
                className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 cursor-pointer"
                onClick={() => setView('landing')}
              >
                <Terminal className="w-5.5 h-5.5 text-white" />
              </div>
              <h1 className="text-2xl font-sans font-extrabold text-white tracking-tight mt-2">
                Sign in to CloudForge
              </h1>
              <p className="text-gray-400 text-sm">
                Deploy, monitor and scale with ease
              </p>
            </div>

            {/* Error banner */}
            {error && (
              <div className="p-3.5 bg-red-950/40 border border-red-900/60 text-red-300 rounded-xl text-xs font-mono">
                {error}
              </div>
            )}

            {/* Core input Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-400 uppercase tracking-widest font-semibold flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none transition-all hover:bg-white/10"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-gray-400 uppercase tracking-widest font-semibold flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Password reset directions have been logged! Check your simulated inbox.')}
                    className="text-xs font-sans text-blue-400 hover:underline hover:text-blue-300"
                    disabled={isLoading}
                  >
                    Forgot Password?
                  </button>
                </div>
                
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-xl pl-4 pr-11 py-3 text-sm text-white placeholder-gray-500 focus:outline-none transition-all hover:bg-white/10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-white transition-colors"
                    disabled={isLoading}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* Remember me check */}
              <div className="flex items-center">
                <input
                  id="remember-me-checkbox"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-white/5 border-white/10 text-blue-600 focus:ring-blue-500/20"
                />
                <label htmlFor="remember-me-checkbox" className="ml-2.5 text-xs text-gray-400 select-none cursor-pointer">
                  Keep me authenticated for 30 days
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-950/40 active:scale-98 transition-all mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Terminal className="w-4.5 h-4.5 animate-spin" /> Authenticating...
                  </>
                ) : (
                  <>
                    Sign In with Email <ArrowRight className="w-4.5 h-4.5" />
                  </>
                )}
              </button>
            </form>

            {/* Separator */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <span className="relative bg-[#0d0d0d] px-4 text-xs font-mono text-gray-500 uppercase tracking-widest leading-none">
                or sign in with
              </span>
            </div>

            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleOAuthLogin('github')}
                className="bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white text-gray-300 py-2.5 px-4 rounded-xl text-xs font-medium font-sans flex items-center justify-center gap-2 cursor-pointer transition-colors"
                disabled={isLoading}
              >
                <Github className="w-4 h-4" /> GitHub
              </button>
              <button
                type="button"
                onClick={() => handleOAuthLogin('google')}
                className="bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white text-gray-300 py-2.5 px-4 rounded-xl text-xs font-medium font-sans flex items-center justify-center gap-2 cursor-pointer transition-colors"
                disabled={isLoading}
              >
                <Chrome className="w-4 h-4 text-red-400" /> Google
              </button>
            </div>

            {/* Create Account route links */}
            <p className="text-center text-xs text-gray-400">
              New to CloudForge?{' '}
              <button
                type="button"
                onClick={() => setView('signup')}
                className="text-blue-400 hover:underline font-semibold"
                disabled={isLoading}
              >
                Create an account
              </button>
            </p>

          </div>
        </div>
      </section>

      {/* Right panel: Marketing promo graphics */}
      <section className="hidden lg:flex flex-1 bg-zinc-950 border-l border-brand-border items-center justify-center p-12 relative overflow-hidden">
        {/* Glow behind stats */}
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-md space-y-8 relative z-10 text-left">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 bg-blue-950/40 border border-blue-900/40 rounded-full px-3 py-1 text-xs text-blue-300 font-mono">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Enterprise Standard Compliance</span>
            </div>
            <h2 className="text-3xl font-sans font-extrabold text-white tracking-tight leading-tight">
              One Command to Launch. <br />
              Zero Server Infrastructure config.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Experience atomic edge deployments where security and high availability are pre-configured by default. Join thousands of cloud-native developers on the global grid.
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
      </section>

    </main>
  );
}
