import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Globe, ArrowLeft, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

const Contact = () => {
  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'amanshishodia@example.com',
      href: 'mailto:amanshishodia@example.com',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'aman-shishodia',
      href: 'https://www.linkedin.com/in/aman-shishodia-231b11300/',
    },
    {
      icon: Github,
      label: 'GitHub',
      value: 'amanshishodia-1',
      href: 'https://github.com/amanshishodia-1',
    },
    {
      icon: Globe,
      label: 'Website',
      value: 'trackly.app',
      href: '/',
    }
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-[#f5f5f5] flex flex-col items-center justify-center relative overflow-hidden px-6 py-12">
      {/* Background Ambient Glow - Extremely subtle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] rounded-full blur-[140px] pointer-events-none" />
      
      {/* Back to Home */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-8 left-8 md:top-12 md:left-12"
      >
        <Link 
          to="/" 
          className="flex items-center gap-2 text-[12px] text-gray-600 hover:text-gray-300 transition-colors group font-medium uppercase tracking-wider"
        >
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          Home
        </Link>
      </motion.div>

      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-10 flex justify-center opacity-80"
          >
            <Logo size={36} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-medium text-white mb-3 tracking-tight"
          >
            Contact
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[14px] text-gray-600 max-w-xs mx-auto leading-relaxed"
          >
            Minimalist support and developer inquiries for the Trackly workspace.
          </motion.p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 gap-2.5 w-full mb-10">
          {contactInfo.map((item, idx) => (
            <motion.a
              key={item.label}
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : '_self'}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.05 }}
              className="flex items-center justify-between p-4 rounded-lg bg-[#111113] border border-white/[0.02] hover:border-white/[0.08] hover:bg-[#141416] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded bg-white/[0.01] border border-white/[0.03] flex items-center justify-center text-gray-500 group-hover:text-gray-200 transition-colors">
                  <item.icon className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-semibold text-gray-700 uppercase tracking-widest mb-0.5">
                    {item.label}
                  </div>
                  <div className="text-[13px] font-medium text-gray-400 group-hover:text-white transition-colors">
                    {item.value}
                  </div>
                </div>
              </div>
              <ArrowLeft className="w-3 h-3 text-gray-800 rotate-180 group-hover:text-gray-500 transition-colors" />
            </motion.a>
          ))}
        </div>

        {/* Off-white CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full"
        >
          <Link
            to="/"
            className="w-full flex items-center justify-center h-11 bg-[#f5f5f5] hover:bg-white text-[#0d0d0f] text-[13px] font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-white/5"
          >
            Return to Workspace
          </Link>
        </motion.div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-16 text-center"
        >
          <div className="text-[11px] text-gray-700 tracking-tight">
            © 2026 Trackly · Built for Focus
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
