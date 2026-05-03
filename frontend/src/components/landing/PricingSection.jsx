import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, Zap, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingSection = ({ showHeader = true }) => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: "Free",
      price: "0",
      description: "Perfect for individuals and small projects.",
      features: [
        "Unlimited issues",
        "Up to 3 active teams",
        "Basic project views",
        "Community support",
        "Standard integrations"
      ],
      buttonText: "Start for free",
      highlight: false,
      icon: Zap,
      color: "from-blue-500/20 to-cyan-500/20"
    },
    {
      name: "Pro",
      price: billingCycle === 'monthly' ? "8" : "6",
      description: "For teams that need more power and flexibility.",
      features: [
        "Everything in Free",
        "Advanced custom workflows",
        "Priority support & SLAs",
        "Unlimited teams",
        "Advanced analytics",
        "Custom fields"
      ],
      buttonText: "Get Started",
      highlight: true,
      icon: Sparkles,
      color: "from-purple-500/20 to-pink-500/20"
    },
    {
      name: "Enterprise",
      price: billingCycle === 'monthly' ? "15" : "12",
      description: "Advanced security and control for large organizations.",
      features: [
        "Everything in Pro",
        "SSO & SAML authentication",
        "Admin security controls",
        "Audit logs",
        "Dedicated account manager",
        "Custom contract terms"
      ],
      buttonText: "Contact Sales",
      highlight: false,
      icon: Shield,
      color: "from-orange-500/20 to-red-500/20"
    }
  ];

  return (
    <section id="pricing" className="relative z-10 py-32 px-4 sm:px-6 lg:px-8 bg-[#0F1115] border-t border-white/[0.02]">
      {/* Background Decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-purple-500/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {showHeader && (
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-6"
            >
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Pricing</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl font-semibold text-white mb-6 tracking-tight"
            >
              The right plan for your team
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed"
            >
              Choose a plan that fits your current needs and upgrade as you grow. 
              No hidden fees, cancel anytime.
            </motion.p>

            {/* Billing Toggle */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-12 flex items-center justify-center gap-4"
            >
              <span className={`text-sm ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-500'} transition-colors`}>Monthly</span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="relative w-14 h-7 bg-white/[0.05] border border-white/[0.1] rounded-full p-1 transition-colors hover:border-white/[0.2]"
              >
                <motion.div
                  animate={{ x: billingCycle === 'monthly' ? 0 : 28 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="w-5 h-5 bg-white rounded-full shadow-lg"
                />
              </button>
              <span className={`text-sm ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-500'} transition-colors`}>
                Yearly
                <span className="ml-2 inline-block px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 text-[10px] font-bold">SAVE 20%</span>
              </span>
            </motion.div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`relative group flex flex-col p-8 rounded-3xl border transition-all duration-500 ${
                plan.highlight 
                  ? 'bg-white/[0.03] border-white/[0.15] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] scale-105 z-20' 
                  : 'bg-white/[0.01] border-white/[0.05] hover:border-white/[0.1] z-10'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-[10px] font-bold text-white uppercase tracking-widest shadow-xl">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-6 border border-white/[0.05]`}>
                  <plan.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-gray-600 text-sm">/per user /mo</span>
                </div>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-3">
                    <div className="mt-1 w-4 h-4 rounded-full bg-white/[0.03] border border-white/[0.1] flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 text-gray-400" />
                    </div>
                    <span className="text-sm text-gray-400 leading-tight">{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                to={plan.name === "Enterprise" ? "/contact" : "/register"}
                className={`w-full py-4 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 group/btn ${
                  plan.highlight
                    ? 'bg-white text-[#0F1115] hover:bg-gray-200'
                    : 'bg-white/[0.03] border border-white/[0.1] text-white hover:bg-white/[0.06] hover:border-white/[0.2]'
                }`}
              >
                {plan.buttonText}
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Comparison link or extra info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-gray-600">
            Have more than 50 members? <Link to="/contact" className="text-gray-400 hover:text-white transition-colors underline underline-offset-4">Talk to us</Link> for custom pricing.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
