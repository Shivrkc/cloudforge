import { useState, useEffect } from 'react';
import { Menu, X, Github, Terminal, ArrowRight, Activity } from 'lucide-react';
import { ActiveView } from '../../types';

interface NavbarProps {
  currentView: ActiveView;
  setView: (view: ActiveView) => void;
  scrollToSection: (id: string) => void;
}

export default function Navbar({ currentView, setView, scrollToSection }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    if (currentView !== 'landing') {
      setView('landing');
      // Delay scrolling slightly to allow rendering
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    } else {
      scrollToSection(sectionId);
    }
  };

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || currentView !== 'landing'
          ? 'glass-header py-4 shadow-lg'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            id="navbar-logo-container"
            onClick={() => setView('landing')}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-all duration-300">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-bold text-xl tracking-tight text-white flex items-center gap-1.5 leading-none">
                CloudForge
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-blue-400 bg-blue-950/40 px-1.5 py-0.5 rounded border border-blue-900/40">
                  v2.0
                </span>
              </span>
              <span className="text-[10px] font-mono tracking-wider text-gray-500 group-hover:text-gray-400 transition-colors leading-none mt-1">
                From Code to Cloud
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          {currentView === 'landing' ? (
            <div id="desktop-nav-links" className="hidden md:flex items-center space-x-8">
              <button
                id="nav-link-features"
                onClick={() => handleNavClick('features')}
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                Features
              </button>
              <button
                id="nav-link-pricing"
                onClick={() => handleNavClick('pricing')}
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                Pricing
              </button>
              <button
                id="nav-link-faq"
                onClick={() => handleNavClick('faq')}
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                FAQ
              </button>
              <a
                id="nav-link-docs"
                href="#docs"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Documentation is being generated as part of our interactive walkthrough! Check back soon.');
                }}
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Docs
              </a>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-3">
              <button
                id="nav-link-back-home"
                onClick={() => setView('landing')}
                className="text-xs font-mono text-gray-400 hover:text-white transition-colors bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg"
              >
                ← Back to Landing
              </button>
            </div>
          )}

          {/* User Auth CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              id="nav-github-icon"
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="GitHub Repository"
            >
              <Github className="w-5 h-5" />
            </a>

            {currentView !== 'dashboard' ? (
              <>
                <button
                  id="nav-btn-login"
                  onClick={() => setView('login')}
                  className="text-sm font-medium text-gray-400 hover:text-white px-4 py-2 cursor-pointer transition-colors"
                >
                  Login
                </button>
                <button
                  id="nav-btn-signup"
                  onClick={() => setView('signup')}
                  className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-all shadow-xl shadow-white/5 cursor-pointer"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <button
                id="nav-btn-logout"
                onClick={() => setView('landing')}
                className="text-sm font-medium text-gray-400 hover:text-white px-4 py-2 border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 rounded-xl transition-colors cursor-pointer"
              >
                Log Out
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div id="mobile-nav-drawer" className="md:hidden absolute top-full left-0 right-0 glass shadow-2xl border-t border-zinc-900 py-6 px-4 space-y-4">
          {currentView === 'landing' && (
            <div className="flex flex-col space-y-3 pb-4 border-b border-zinc-800">
              <button
                onClick={() => handleNavClick('features')}
                className="text-left py-2 text-base font-medium text-gray-400 hover:text-white transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => handleNavClick('pricing')}
                className="text-left py-2 text-base font-medium text-gray-400 hover:text-white transition-colors"
              >
                Pricing
              </button>
              <button
                onClick={() => handleNavClick('faq')}
                className="text-left py-2 text-base font-medium text-gray-400 hover:text-white transition-colors"
              >
                FAQ
              </button>
              <a
                href="#docs"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Documentation available in next phase!');
                }}
                className="py-2 text-base font-medium text-gray-400 hover:text-white transition-colors"
              >
                Docs
              </a>
            </div>
          )}

          <div className="flex flex-col space-y-3">
            {currentView !== 'dashboard' ? (
              <>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setView('login');
                  }}
                  className="w-full text-center py-2.5 text-base font-medium text-gray-400 hover:text-white border border-zinc-800 bg-zinc-900/40 rounded-xl transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setView('signup');
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
                  setView('landing');
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
