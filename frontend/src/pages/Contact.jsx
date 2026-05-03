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
      color: 'text-blue-400'
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'aman-shishodia',
      href: 'https://www.linkedin.com/in/aman-shishodia-231b11300/',
      color: 'text-indigo-400'
    },
    {
      icon: Github,
      label: 'GitHub',
      value: 'amanshishodia-1',
      href: 'https://github.com/amanshishodia-1',
      color: 'text-purple-400'
    },
    {
      icon: Globe,
      label: 'Website',
      value: 'trackly.app',
      href: '/',
      color: 'text-emerald-400'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-[#f5f5f5] flex flex-col items-center justify-center relative overflow-hidden px-6 py-12">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-purple-500/5 via-indigo-500/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
      
      {/* Back to Home */}
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-8 left-8 md:top-12 md:left-12"
      >
        <Link 
          to="/" 
          className="flex items-center gap-2 text-[13px] text-gray-500 hover:text-gray-200 transition-colors group font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Back to home
        </Link>
      </motion.div>

      <div className="w-full max-w-lg relative z-10 flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 flex justify-center"
          >
            <Logo size={40} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-semibold text-[#ffffff] mb-3 tracking-tight"
          >
            Get in touch
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[15px] text-gray-500 max-w-sm mx-auto leading-relaxed"
          >
            Connect with us for support, feedback, or to learn more about Trackly.
          </motion.p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 gap-3 w-full">
          {contactInfo.map((item, idx) => (
            <motion.a
              key={item.label}
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : '_self'}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.05 }}
              className="flex items-center justify-between p-4 rounded-xl bg-[#121214] border border-white/[0.03] hover:border-white/[0.1] hover:bg-[#161618] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg bg-white/[0.02] border border-white/[0.04] flex items-center justify-center ${item.color} group-hover:scale-105 transition-transform`}>
                  <item.icon className="w-4.5 h-4.5" />
                </div>
                <div className="text-left">
                  <div className="text-[11px] font-semibold text-gray-600 uppercase tracking-[0.05em] mb-0.5">
                    {item.label}
                  </div>
                  <div className="text-[14px] font-medium text-gray-300 group-hover:text-white transition-colors">
                    {item.value}
                  </div>
                </div>
              </div>
              <MessageSquare className="w-3.5 h-3.5 text-gray-700 group-hover:text-gray-400 transition-colors" />
            </motion.a>
          ))}
        </div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="text-[12px] text-gray-600 mb-1">
            © 2026 Trackly, Inc.
          </div>
          <div className="text-[10px] text-gray-800 uppercase tracking-widest font-medium">
            Designed for Performance
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
