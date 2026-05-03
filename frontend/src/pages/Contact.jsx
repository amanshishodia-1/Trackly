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
      value: 'linkedin.com/in/amanshishodia',
      href: 'https://linkedin.com/in/amanshishodia',
      color: 'text-indigo-400'
    },
    {
      icon: Github,
      label: 'GitHub',
      value: 'github.com/amanshishodia-1',
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
    <div className="min-h-screen bg-[#0F1115] text-gray-100 flex flex-col items-center justify-center relative overflow-hidden px-6 py-12">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-purple-500/10 via-indigo-500/5 to-transparent rounded-full blur-[100px] pointer-events-none" />
      
      {/* Back to Home */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-8 left-8 md:top-12 md:left-12"
      >
        <Link 
          to="/" 
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-200 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to home
        </Link>
      </motion.div>

      <div className="w-full max-w-xl relative z-10 flex flex-col items-center">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <Logo size={48} />
        </motion.div>

        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight"
          >
            Get in touch
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-400 max-w-md mx-auto leading-relaxed"
          >
            Have questions about Trackly? Reach out to our team or connect with the developer directly.
          </motion.p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 gap-4 w-full">
          {contactInfo.map((item, idx) => (
            <motion.a
              key={item.label}
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : '_self'}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              className="flex items-center justify-between p-5 rounded-2xl bg-[#161922]/50 border border-[#1F2328]/60 hover:border-[#2F3438] hover:bg-[#1A1D24] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">
                    {item.label}
                  </div>
                  <div className="text-[15px] font-medium text-gray-200 group-hover:text-white transition-colors">
                    {item.value}
                  </div>
                </div>
              </div>
              <MessageSquare className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
            </motion.a>
          ))}
        </div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="text-sm text-gray-600 mb-2">
            © 2026 Trackly, Inc.
          </div>
          <div className="text-xs text-gray-700">
            Built for high-performing teams.
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
