import { ActiveView } from "./types";
import { useState, useEffect } from "react";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Hero from "./components/landing/Hero";
import Features from "./components/landing/Features";
import Pricing from "./components/landing/Pricing";
import Faq from "./components/landing/Faq";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [currentView, setView] = useState<ActiveView>('landing');

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Reset scroll position on view transitions
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  return (
    <div className="min-h-screen bg-brand-dark text-gray-100 flex flex-col relative overflow-hidden selection:bg-blue-600/30 selection:text-white">
      {/* Decorative Background Glows */}
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Universal Responsive Navbar */}
      <Navbar currentView={currentView} setView={setView} scrollToSection={scrollToSection} />

      {/* Render Active View */}
      {currentView === 'landing' && (
        <div className="flex flex-col">
          <Hero setView={setView} />
          <Features />
          <Pricing setView={setView} />
          <Faq />
          <Footer setView={setView} />
        </div>
      )}

      {currentView === 'login' && (
        <div className="flex flex-col flex-grow">
          <Login setView={setView} />
          <Footer setView={setView} />
        </div>
      )}

      {currentView === 'signup' && (
        <div className="flex flex-col flex-grow">
          <Signup setView={setView} />
          <Footer setView={setView} />
        </div>
      )}

      {currentView === 'dashboard' && (
        <div className="flex flex-col flex-grow">
          <Dashboard />
        </div>
      )}
    </div>
  );
}
