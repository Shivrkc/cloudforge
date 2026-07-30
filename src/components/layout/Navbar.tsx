import { useState, useEffect } from 'react';
import { Menu, X, Github } from 'lucide-react';
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import Logo from "../ui/Logo";

interface NavbarProps {
  scrollToSection?: (id: string) => void;
}

export default function Navbar({
  scrollToSection,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isLanding = location.pathname === ROUTES.HOME;
  const isLogin = location.pathname === ROUTES.LOGIN;
  const isSignup = location.pathname === ROUTES.SIGNUP;
  const isDashboard = location.pathname === ROUTES.DASHBOARD;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setIsMobileMenuOpen(false);
  
    if (!isLanding) {
      navigate(ROUTES.HOME);
  
      setTimeout(() => {
        scrollToSection?.(sectionId);
      }, 100);
    } else {
      scrollToSection?.(sectionId);
    }
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled || location.pathname !== ROUTES.HOME
          ? 'bg-[#050507]/80 backdrop-blur-md border-zinc-800/80 shadow-lg shadow-black/20'
          : 'bg-[#050507]/40 backdrop-blur-sm border-zinc-800/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Navigation Links */}
          <div className="flex items-center gap-10">
            <div 
              onClick={() => navigate(ROUTES.HOME)}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <Logo />
            </div>

            {/* Desktop Navigation */}
            {isLanding && (
              <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-400">
                <a
                  href="#features"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("features");
                  }}
                  className="hover:text-white transition-colors py-1"
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("pricing");
                  }}
                  className="hover:text-white transition-colors py-1"
                >
                  Pricing
                </a>
                <a
                  href="#faq"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("faq");
                  }}
                  className="hover:text-white transition-colors py-1"
                >
                  FAQ
                </a>
              </nav>
            )}
          </div>

          {/* Right Side Actions (GitHub, Login, CTA) */}
          <div className="hidden md:flex items-center gap-3">
            {/* GitHub Button */}
            <a
              href="https://github.com/Shivrkc/cloudforge"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Repository"
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-zinc-900/60"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>

            {!isDashboard ? (
              <>
                {/* Login Button */}
                <button 
                  onClick={() => navigate(ROUTES.LOGIN)}
                  className={`text-xs font-medium transition-all duration-200 px-3.5 py-1.5 rounded-lg border ${
                    isLogin 
                      ? "text-white bg-zinc-800/80 border-zinc-700" 
                      : "text-zinc-300 hover:text-white bg-zinc-900/60 hover:bg-zinc-800/80 border-zinc-800/80"
                  }`}
                >
                  Login
                </button>

                {/* Primary CTA Button */}
                <button 
                  onClick={() => navigate(ROUTES.SIGNUP)}
                  className="text-xs font-medium text-white bg-orange-600 hover:bg-orange-500 transition-all duration-200 px-4 py-1.5 rounded-lg shadow-sm shadow-orange-600/20 active:scale-[0.98] cursor-pointer"
                >
                  Start Deploying
                </button>
              </>
            ) : (
              <button 
                onClick={() => navigate(ROUTES.HOME)}
                className="text-xs font-medium text-zinc-300 hover:text-white border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/80 rounded-lg px-3.5 py-1.5 transition-colors"
              >
                Log Out
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-zinc-400 hover:text-white p-2 rounded-lg bg-zinc-900/50 border border-zinc-800/80"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0a0a0d]/95 backdrop-blur-xl border-b border-zinc-800/80 px-4 pt-4 pb-6 space-y-4 shadow-2xl">
          {isLanding && (
            <div className="flex flex-col space-y-2 border-b border-zinc-800/80 pb-4">
              <a 
                href="#features" 
                onClick={(e) => { e.preventDefault(); handleNavClick('features'); }}
                className="text-sm font-medium text-zinc-300 hover:text-white py-1.5 px-2 rounded-md hover:bg-zinc-900/50 transition-colors"
              >
                Features
              </a>
              <a 
                href="#pricing" 
                onClick={(e) => { e.preventDefault(); handleNavClick('pricing'); }}
                className="text-sm font-medium text-zinc-300 hover:text-white py-1.5 px-2 rounded-md hover:bg-zinc-900/50 transition-colors"
              >
                Pricing
              </a>
              <a 
                href="#faq" 
                onClick={(e) => { e.preventDefault(); handleNavClick('faq'); }}
                className="text-sm font-medium text-zinc-300 hover:text-white py-1.5 px-2 rounded-md hover:bg-zinc-900/50 transition-colors"
              >
                FAQ
              </a>
            </div>
          )}

          <div className="flex flex-col space-y-2.5 pt-1">
            <a
              href="https://github.com/Shivrkc/cloudforge"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2 text-xs font-medium text-zinc-300 border border-zinc-800/80 bg-zinc-900/40 rounded-lg hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>

            {!isDashboard ? (
              <>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate(ROUTES.LOGIN);
                  }}
                  className={`w-full py-2.5 text-xs font-medium transition-colors rounded-lg border ${
                    isLogin 
                      ? "text-white bg-zinc-800 border-zinc-700"
                      : "text-zinc-300 hover:text-white border-zinc-800 bg-zinc-900/40"
                  }`}
                >
                  Login
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate(ROUTES.SIGNUP);
                  }}
                  className="w-full py-2.5 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded-lg transition-colors shadow-sm shadow-orange-600/20"
                >
                  Start Deploying
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate(ROUTES.HOME);
                }}
                className="w-full py-2.5 text-xs font-medium text-zinc-300 hover:text-white border border-zinc-800 bg-zinc-900/40 rounded-lg transition-colors"
              >
                Log Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}