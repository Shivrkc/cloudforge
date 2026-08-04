import { useState, FormEvent } from 'react';
import {Mail,Lock,Eye,EyeOff,Github,Chrome,User,Rocket,Bot,BarChart3,} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { register } from "../services/auth.service";

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
  
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Please fill in all requested fields.");
      return;
    }
  
    if (!email.includes("@")) {
      setError("Please provide a valid company or email.");
      return;
    }
  
    if (password.length < 8) {
      setError("Security policy requires passwords of at least 8 characters.");
      return;
    }
  
    if (password !== confirmPassword) {
      setError("Password fields do not match. Please re-type.");
      return;
    }
  
    if (!agreeTerms) {
      setError("You must consent to the terms.");
      return;
    }
  
    try {
      setIsLoading(true);
  
      await register({
        name,
        email,
        password,
      });
  
      navigate(ROUTES.LOGIN);
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };;

  return (
    <main id="signup-container" className="min-h-screen bg-brand-dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#09090a]/60 border border-zinc-900 rounded-3xl p-6 sm:p-10 backdrop-blur-xl relative z-10">
        
        {/* Left Side Content - Form Panel */}
        <div className="space-y-6 w-full">
          <div className="space-y-2">
            <h2 className="text-2xl font-sans font-extrabold text-white tracking-tight">Create your account</h2>
            <p className="text-xs text-gray-400 font-sans">
            Create an account to start deploying your projects.
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
                  placeholder="Shiv Gupta"
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-850 focus:border-orange-500 rounded-xl text-xs text-white placeholder-gray-600 outline-none transition-all font-sans"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block"> Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Maishivhoon@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-850 focus:border-orange-500 rounded-xl text-xs text-white placeholder-gray-600 outline-none transition-all font-sans"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-850 focus:border-orange-500 rounded-xl text-xs text-white placeholder-gray-600 outline-none transition-all font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-850 focus:border-orange-500 rounded-xl text-xs text-white placeholder-gray-600 outline-none transition-all font-mono"
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
                  className="rounded mt-0.5 bg-zinc-950 border-zinc-800 text-orange-500 accent-orange-500 focus:ring-0"
                />
                <span>I agree to the Terms of Service and Privacy Policy.</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-500 disabled:bg-orange-800 text-white font-semibold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 mt-2 cursor-pointer"
            >
              {isLoading ? 'Creating your account...' : 'Create Account'}
            </button>
          </form>

          <div className="relative my-4 text-center">
            <span className="absolute inset-x-0 top-1/2 h-px bg-zinc-900 -translate-y-1/2"></span>
            <span className="relative bg-[#0b0b0c] px-3 text-[10px] font-mono text-gray-500 uppercase tracking-widest">or integrate with</span>
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
          Already have an account?{' '}
            <button onClick={() => navigate(ROUTES.LOGIN)} className="text-orange-400 hover:underline font-medium">Log in</button>
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