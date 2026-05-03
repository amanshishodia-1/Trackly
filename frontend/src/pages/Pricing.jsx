import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import PricingSection from '../components/landing/PricingSection';

const Pricing = () => {
  return (
    <div className="min-h-screen bg-[#0F1115] text-[#f5f5f5] flex flex-col relative overflow-x-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-white/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Top Navigation Bar */}
      <nav className="relative z-50 flex items-center justify-between h-[68px] px-8 sm:px-12 lg:px-16 border-b border-white/[0.03] bg-[#0F1115]/50 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-3 group">
          <Logo size={28} />
          <span className="font-bold text-[18px] text-gray-100 tracking-tight group-hover:text-white transition-colors">Trackly</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors font-medium">Log in</Link>
          <Link to="/register" className="px-4 py-1.5 bg-white text-[#0F1115] text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors">Sign up</Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 pt-12">
        <PricingSection showHeader={true} />
      </main>

      {/* Standard Footer for Landing Pages */}
      <footer className="relative z-10 py-12 px-8 border-t border-white/[0.03] bg-[#0A0C0F]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <Logo size={24} />
            <span className="font-semibold text-white tracking-tight">Trackly</span>
          </div>
          <div className="flex items-center gap-8 text-xs text-gray-600 font-medium">
            <Link to="/" className="hover:text-gray-400 transition-colors">Product</Link>
            <Link to="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
            <Link to="#" className="hover:text-gray-400 transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-gray-400 transition-colors">Terms</Link>
          </div>
          <div className="text-[11px] text-gray-700 tracking-tight">
            © 2026 Trackly Inc. · Built for high-performance teams.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
