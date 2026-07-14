import { useState, FormEvent } from 'react';
import { Mail, Lock, Eye, EyeOff, Github, Chrome, Terminal, ArrowRight, User, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export default function Signup() {
  const navigate = useNavigate();
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
      setError('You must consent to the terms.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate(ROUTES.DASHBOARD);
    }, 1500);
  };

  return (
    <main id="signup-container" className="min-h-screen bg-brand-dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#09090a]/60 border border-zinc-900 rounded-3xl p-6 sm:p-10 backdrop-blur-xl relative z-10">
        
        {/* Left Side Content - Form Panel */}
        <div className="space-y-6 w-full">
          <div className="space-y-2">
            <h2 className="text-2xl font-sans font-extrabold text-white tracking-tight">Provision Grid Account</h2>
            <p className="text-xs text-gray-400 font-sans">
              Deploy serverless applications at global edge points instantly.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-xl text-xs text-red-400 font-mono">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Mercer"
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-850 focus:border-blue-600 rounded-xl text-xs text-white placeholder-gray-600 outline-none transition-all font-sans"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block">Developer Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-850 focus:border-blue-600 rounded-xl text-xs text-white placeholder-gray-600 outline-none transition-all font-sans"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block">Passkey</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-850 focus:border-blue-600 rounded-xl text-xs text-white placeholder-gray-600 outline-none transition-all font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block">Confirm Passkey</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-850 focus:border-blue-600 rounded-xl text-xs text-white placeholder-gray-600 outline-none transition-all font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-start gap-2.5 text-xs text-gray-400 font-sans select-none cursor-pointer leading-normal">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded mt-0.5 bg-zinc-950 border-zinc-800 text-blue-600 accent-blue-600 focus:ring-0"
                />
                <span>I accept automated edge provisioning terms and data safety rules</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 mt-2 cursor-pointer"
            >
              {isLoading ? 'Allocating grid shards...' : 'Create Provision Account'}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="relative my-4 text-center">
            <span className="absolute inset-x-0 top-1/2 h-px bg-zinc-900 -translate-y-1/2"></span>
            <span className="relative bg-[#0b0b0c] px-3 text-[10px] font-mono text-gray-500 uppercase tracking-widest">or integrate via</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 border border-zinc-800 bg-zinc-950/40 text-xs text-white font-medium rounded-xl hover:bg-zinc-950 transition-all cursor-pointer"
            >
              <Github className="w-4 h-4" /> GitHub
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 border border-zinc-800 bg-zinc-950/40 text-xs text-white font-medium rounded-xl hover:bg-zinc-950 transition-all cursor-pointer"
            >
              <Chrome className="w-4 h-4" /> Google
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 font-sans">
            Already registered?{' '}
            <button onClick={() => navigate(ROUTES.LOGIN)} className="text-blue-400 hover:underline font-medium">Authenticate passkey</button>
          </p>
        </div>

        {/* Right Side Content - Marketing Data Info Panel */}
        <div className="hidden md:flex flex-col justify-between h-full bg-zinc-950/60 border border-zinc-900 rounded-2xl p-6 space-y-10">
          <div className="space-y-4">
            <div className="w-8 h-8 rounded-lg bg-purple-600/10 border border-purple-900/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <h2 className="text-2xl font-sans font-extrabold text-white tracking-tight leading-tight">
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
      </div>
    </main>
  );
}