import { useState, FormEvent } from 'react';
import { Mail, Lock, Eye, EyeOff, Github, Chrome, Terminal, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { login } from "../services/auth.service";
import { Rocket, Bot, BarChart3 } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
  
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all security fields.");
      return;
    }
  
    if (!email.includes("@")) {
      setError("Please insert a valid email address.");
      return;
    }
  
    try {
      setIsLoading(true);
  
      await login({
        email,
        password,
      });
  
      navigate(ROUTES.DASHBOARD);
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
        "Invalid email or password."
      );
    } finally {
      setIsLoading(false);
    }
  };;

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
            <h2 className="text-2xl font-sans font-extrabold text-white tracking-tight">Welcome back</h2>
            <p className="text-xs text-gray-400 font-sans">
            Sign in to continue deploying your projects.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-xl text-xs text-red-400 font-mono">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-850 focus:borderblue--600 rounded-xl text-xs text-white placeholder-gray-600 outline-none transition-all font-sans"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block">Password</label>
                <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-[11px] font-sans text-orange-400 hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-zinc-950 border border-zinc-850 focus:border-orange-500 rounded-xl text-xs text-white placeholder-gray-600 outline-none transition-all font-mono"
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
                  className="rounded bg-zinc-950 border-zinc-800 text-orange-500 accent-orange-500 focus:ring-0"
                />
                Keep me signed in
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-500 disabled:bg-orange-800 text-white font-semibold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 mt-2 cursor-pointer"
            >
              
              {isLoading ? 'Signing you in...' : 'Log In'}
            </button>
          </form>

          <div className="relative my-6 text-center">
            <span className="absolute inset-x-0 top-1/2 h-px bg-zinc-900 -translate-y-1/2"></span>
            <span className="relative bg-[#0b0b0c] px-3 text-[10px] font-mono text-gray-500 uppercase tracking-widest">or continue with</span>
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
          Don't have an account?{' '}
            <button onClick={() => navigate(ROUTES.SIGNUP)} className="text-orange-400 hover:underline font-medium">Sign Up</button>
          </p>
        </div>

        {/* Right Side Content - Marketing Data Info Panel */}
        <div className="hidden md:flex flex-col justify-center h-full bg-zinc-950/60 border border-zinc-900 rounded-2xl p-8 space-y-8">

  {/* Deploy with confidence */}
  <div className="flex items-start gap-4">
    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-900/40 flex items-center justify-center flex-shrink-0">
      <Rocket className="w-5 h-5 text-orange-400" />
    </div>

    <div>
      <h3 className="text-lg font-bold text-white">
        Deploy with confidence
      </h3>

      <p className="mt-2 text-sm text-gray-400 leading-7">
        Deploy directly from your Git repository with a clean, guided
        workflow. Build, monitor, and manage your applications from one
        place.
      </p>
    </div>
  </div>

  <div className="border-t border-zinc-800"></div>

  {/* AI Assistant */}
  <div className="flex items-start gap-4">
    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-900/40 flex items-center justify-center flex-shrink-0">
      <Bot className="w-5 h-5 text-orange-400" />
    </div>

    <div>
      <h3 className="text-lg font-bold text-white">
        AI that helps, not confuses
      </h3>

      <p className="mt-2 text-sm text-gray-400 leading-7">
        HAVN explains deployment errors in plain English, suggests fixes,
        and helps you move faster whether you're just starting or already
        experienced.
      </p>
    </div>
  </div>

  <div className="border-t border-zinc-800"></div>

  {/* Build & Grow */}
  <div className="flex items-start gap-4">
    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-900/40 flex items-center justify-center flex-shrink-0">
      <BarChart3 className="w-5 h-5 text-orange-400" />
    </div>

    <div>
      <h3 className="text-lg font-bold text-white">
        Build and grow
      </h3>

      <p className="mt-2 text-sm text-gray-400 leading-7">
        Track deployments, monitor project history, and keep every release
        organized as your applications evolve.
      </p>
    </div>
  </div>

</div>


      </div>
    </main>
  );
}