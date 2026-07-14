import { useState, useEffect } from 'react';
import { Menu, X, Github, Terminal, ArrowRight, Activity } from 'lucide-react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

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
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || location.pathname !== ROUTES.HOME ? 'bg-brand-dark/80 backdrop-blur-md border-b border-zinc-900' : 'bg-transparent'
      }`}
    >
      {/* Complete Desktop Navigation Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <div 
              onClick={() => navigate(ROUTES.HOME)} 
              className="flex items-center gap-2 cursor-pointer text-white font-sans font-bold text-lg tracking-tight"
            >
              <Terminal className="w-5 h-5 text-blue-500" />
              <span>CloudForge</span>
            </div>
            
            {isLanding && (
              <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
                <a href="#features" onClick={(e) => { e.preventDefault(); handleNavClick('features'); }} className="hover:text-white transition-colors">Features</a>
                <a href="#pricing" onClick={(e) => { e.preventDefault(); handleNavClick('pricing'); }} className="hover:text-white transition-colors">Pricing</a>
                <a href="#faq" onClick={(e) => { e.preventDefault(); handleNavClick('faq'); }} className="hover:text-white transition-colors">FAQ</a>
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {!isDashboard ? (
              <>
                <button 
                  onClick={() => navigate(ROUTES.LOGIN)}
                  className="text-sm font-medium text-gray-400 hover:text-white transition-colors px-3 py-1.5"
                >
                  Log In
                </button>
                <button 
                  onClick={() => navigate(ROUTES.SIGNUP)}
                  className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg px-4 py-2 transition-all shadow-sm active:scale-98"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <button 
                onClick={() => navigate(ROUTES.HOME)}
                className="text-sm font-medium text-gray-400 hover:text-white border border-zinc-800 bg-zinc-900/40 rounded-lg px-4 py-2 transition-colors"
              >
                Log Out
              </button>
            )}
          </div>

          {/* Mobile hamburger menu indicator */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-400 hover:text-white p-2"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Dropdown Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-brand-dark/95 backdrop-blur-lg border-b border-zinc-900 px-4 pt-4 pb-6 space-y-4 shadow-xl animate-fade-in">
          {isLanding && (
            <div className="flex flex-col space-y-3 border-b border-zinc-900 pb-4">
              <a 
                href="#features" 
                onClick={(e) => { e.preventDefault(); handleNavClick('features'); }}
                className="text-base font-medium text-gray-300 hover:text-white py-1 block"
              >
                Features
              </a>
              <a 
                href="#pricing" 
                onClick={(e) => { e.preventDefault(); handleNavClick('pricing'); }}
                className="text-base font-medium text-gray-300 hover:text-white py-1 block"
              >
                Pricing
              </a>
              <a 
                href="#faq" 
                onClick={(e) => { e.preventDefault(); handleNavClick('faq'); }}
                className="text-base font-medium text-gray-300 hover:text-white py-1 block"
              >
                FAQ
              </a>
            </div>
          )}

          <div className="flex flex-col space-y-3">
            {location.pathname !== ROUTES.DASHBOARD ? (
              <>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate(ROUTES.LOGIN);
                  }}
                  className="w-full text-center py-2.5 text-base font-medium text-gray-400 hover:text-white border border-zinc-800 bg-zinc-900/40 rounded-xl transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate(ROUTES.SIGNUP);
                  }}
                  className="w-full text-center py-2.5 text-base font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate(ROUTES.HOME);
                }}
                className="w-full text-center py-2.5 text-base font-medium text-gray-400 hover:text-white border border-zinc-800 bg-zinc-900/40 rounded-xl transition-colors"
              >
                Log Out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}