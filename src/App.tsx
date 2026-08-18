import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ROUTES } from "./constants/routes";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Hero from "./components/landing/Hero";
import Features from "./components/landing/Features";
import Pricing from "./components/landing/Pricing";
import Faq from "./components/landing/Faq";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";

export default function App() {
  const location = useLocation();

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
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-brand-dark text-gray-100 flex flex-col relative overflow-hidden selection:bg-blue-600/30 selection:text-white">
      {/* Decorative Background Glows */}
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Universal Responsive Navbar */}
      <Navbar scrollToSection={scrollToSection} />

      {/* Render Active View via React Router v7 */}
      <Routes>
        <Route
          path={ROUTES.HOME}
          element={
            <div className="flex flex-col">
              <Hero />
              <Features />
              <Pricing />
              <Faq />
              <Footer />
            </div>
          }
        />

        <Route
          path={ROUTES.LOGIN}
          element={
            <div className="flex flex-col flex-grow">
              <Login />
            </div>
          }
        />

        <Route
          path={ROUTES.SIGNUP}
          element={
            <div className="flex flex-col flex-grow">
              <Signup />
            </div>
          }
        />
        <Route
  path="/verify-email"
  element={
    <div className="flex flex-col flex-grow">
      <VerifyEmail />
    </div>
  }
/>

        <Route
          path={ROUTES.DASHBOARD}
          element={
           <ProtectedRoute>
            <Dashboard />
            </ProtectedRoute>
           }
        />
      </Routes>
    </div>
  );
}