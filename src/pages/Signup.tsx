import { useState, FormEvent } from 'react';
import { Mail, Lock, Eye, EyeOff, Github, Chrome, Terminal, ArrowRight, User, ShieldCheck, Sparkles } from 'lucide-react';
import { ActiveView } from '../types';

interface SignupProps {
  setView: (view: ActiveView) => void;
}

export default function Signup({ setView }: SignupProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Comprehensive validation checks
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all requested fields.');
      return;
    }

    if (!email.includes('@')) {
      setError('Please provide a valid company or developer email.');
      return;
    }

    if (password.length < 8) {
      setError('Security policy requires passwords of at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password fields do not match. Please re-type.');
      return;
    }

    if (!agreeTerms) {
      setError('You must consent to the terms of service and SLA policies.');
      return;
    }

    setIsLoading(true);

    // Simulate real registration handshake
    setTimeout(() => {
      setIsLoading(false);
      setView('dashboard');
    }, 1500);
  };

  const handleOAuthSignup = (provider: 'google' | 'github') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setView('dashboard');
    }, 1200);
  };

  return (
    <main id="signup-container" className="min-h-screen bg-brand-dark flex flex-col lg:flex-row relative pt-20">
      
      {/* Decorative Blur lights */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Left panel: Form fields */}
      <section className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-12 py-12 z-10">
        <div className="w-full max-w-md bg-brand-card/85 border border-brand-border rounded-2xl p-8 sm:p-10 shadow-2xl relative">
          
          <div className="space-y-6">
            
            {/* Header info */}
            <div className="flex flex-col items-center text-center space-y-2">
              <div
                className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 cursor-pointer"
                onClick={() => setView('landing')}
              >
                <Terminal className="w-5.5 h-5.5 text-white" />
              </div>
              <h1 className="text-2xl font-sans font-extrabold text-white tracking-tight mt-2">
                Create your CloudForge profile
              </h1>
              <p className="text-gray-400 text-sm">
                Get started with 100 GB global bandwidth free
              </p>
            </div>

            {/* Error notifications */}
            {error && (
              <div className="p-3.5 bg-red-950/40 border border-red-900/60 text-red-300 rounded-xl text-xs font-mono">
                {error}
              </div>
            )}

            {/* Core Sign-up Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-400 uppercase tracking-widest font-semibold flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Alex Mercer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-all hover:bg-white/10"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-400 uppercase tracking-widest font-semibold flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="alex@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-all hover:bg-white/10"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-400 uppercase tracking-widest font-semibold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> Set Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Min 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-xl pl-4 pr-11 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-all hover:bg-white/10"
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

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-400 uppercase tracking-widest font-semibold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> Confirm Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-type password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-all hover:bg-white/10"
                  disabled={isLoading}
                />
              </div>

              {/* SLA & Terms Checkbox */}
              <div className="flex items-start pt-1.5">
                <input
                  id="agree-terms-checkbox"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 rounded bg-white/5 border-white/10 text-blue-600 focus:ring-blue-500/20 mt-0.5"
                />
                <label htmlFor="agree-terms-checkbox" className="ml-2.5 text-xs text-gray-400 select-none cursor-pointer leading-relaxed">
                  I agree to the CloudForge <a href="#terms" onClick={(e) => { e.preventDefault(); alert('Terms of Service are active.'); }} className="text-blue-400 hover:underline">Terms of Service</a> and consent to standard <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('Privacy Policies active.'); }} className="text-blue-400 hover:underline">Privacy Policy</a> criteria.
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-950/40 active:scale-98 transition-all mt-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Terminal className="w-4.5 h-4.5 animate-spin" /> Provisioning Workspace...
                  </>
                ) : (
                  <>
                    Create Free Account <ArrowRight className="w-4.5 h-4.5" />
                  </>
                )}
              </button>
            </form>

            {/* Split divider */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <span className="relative bg-[#0d0d0d] px-4 text-xs font-mono text-gray-500 uppercase tracking-widest leading-none">
                or sign up with
              </span>
            </div>

            {/* OAuth buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleOAuthSignup('github')}
                className="bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white text-gray-300 py-2.5 px-4 rounded-xl text-xs font-medium font-sans flex items-center justify-center gap-2 cursor-pointer transition-colors"
                disabled={isLoading}
              >
                <Github className="w-4 h-4" /> GitHub
              </button>
              <button
                type="button"
                onClick={() => handleOAuthSignup('google')}
                className="bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white text-gray-300 py-2.5 px-4 rounded-xl text-xs font-medium font-sans flex items-center justify-center gap-2 cursor-pointer transition-colors"
                disabled={isLoading}
              >
                <Chrome className="w-4 h-4 text-red-400" /> Google
              </button>
            </div>

            {/* Swap to Login route */}
            <p className="text-center text-xs text-gray-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setView('login')}
                className="text-blue-400 hover:underline font-semibold"
                disabled={isLoading}
              >
                Log In
              </button>
            </p>

          </div>
        </div>
      </section>

      {/* Right panel: split-view info panels */}
      <section className="hidden lg:flex flex-1 bg-zinc-950 border-l border-brand-border items-center justify-center p-12 relative overflow-hidden">
        {/* Glow behind graphic */}
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-md space-y-8 relative z-10 text-left">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 bg-purple-950/40 border border-purple-900/40 rounded-full px-3 py-1 text-xs text-purple-300 font-mono">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Hobby Tier Included Forever</span>
            </div>
            <h2 className="text-3xl font-sans font-extrabold text-white tracking-tight leading-tight">
              Get Started for Free. <br />
              Add credit details only when scaling.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Every Hobby account features 3 personal projects, full access to custom redirect headers, wildcard Let’s Encrypt domain SSL certifications, and 100 GB premium edge data limits.
            </p>
          </div>

          {/* Testimonial preview badge */}
          <div className="bg-brand-card/75 border border-brand-border p-5 rounded-2xl space-y-3 relative overflow-hidden">
            <p className="text-xs text-gray-300 italic font-sans leading-relaxed">
              "We migrated all of our heavy client panels over to CloudForge Edge. In under 24 hours, our static asset load speeds saw a global drop of 40%, and our devops pipeline is finally completely automated."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white">
                M
              </div>
              <div>
                <span className="block text-xs font-bold text-white">Marcus Vance</span>
                <span className="block text-[10px] font-mono text-gray-500">Lead Architect, Linear Labs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
