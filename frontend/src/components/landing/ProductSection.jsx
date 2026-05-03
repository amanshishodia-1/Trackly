import React from 'react';
import { motion } from 'framer-motion';
import { CircleDot, Users, FolderKanban, Inbox } from 'lucide-react';

const ProductSection = () => {
  const highlights = [
    {
      icon: CircleDot,
      title: "Issue Tracking",
      description: "Fast, keyboard-first issue tracking. Create, assign, and prioritize work in seconds.",
    },
    {
      icon: Users,
      title: "Teams",
      description: "Shared backlogs and views. Collaborate seamlessly across different team structures.",
    },
    {
      icon: FolderKanban,
      title: "Projects",
      description: "Group related issues into large initiatives. Track progress and set milestones.",
    },
    {
      icon: Inbox,
      title: "My Issues",
      description: "A dedicated view for your personal work. Never lose track of what you need to do.",
    }
  ];

  // Mock Components for Visuals
  const MockIssueList = () => (
    <div className="space-y-4">
      {[
        { title: "Support for multi-factor auth", status: "In Progress", color: "bg-blue-500/20 text-blue-400" },
        { title: "Refactor database migrations", status: "Backlog", color: "bg-gray-500/20 text-gray-400" },
        { title: "Update documentation for API v2", status: "Todo", color: "bg-purple-500/20 text-purple-400" }
      ].map((item, i) => (
        <div key={i} className="h-16 bg-white/[0.01] border border-white/[0.04] rounded-xl flex items-center px-5 gap-4 hover:bg-white/[0.02] transition-colors group/row">
          <div className="w-5 h-5 rounded-md border border-gray-700 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-gray-800" />
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="text-sm text-[#f5f5f5] font-medium tracking-tight">{item.title}</div>
            <div className="flex items-center gap-3">
              <span className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-semibold ${item.color}`}>
                {item.status}
              </span>
              <div className="w-1 h-1 rounded-full bg-white/[0.1]" />
              <span className="text-[10px] text-gray-600 font-medium uppercase tracking-wider">TRI-12{i}</span>
            </div>
          </div>
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-white/[0.05]" />
            <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-white/[0.05]" />
          </div>
        </div>
      ))}
    </div>
  );

  const MockSidebar = () => (
    <div className="flex gap-8 h-full">
      <div className="w-24 space-y-5 border-r border-white/[0.03] pr-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/[0.05]" />
        <div className="space-y-3 pt-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-full h-2 bg-white/[0.03] rounded-full" />
          ))}
        </div>
      </div>
      <div className="flex-1 space-y-8 pt-2">
        <div className="flex items-center justify-between">
          <div className="h-5 bg-white/[0.05] rounded-md w-1/3" />
          <div className="w-8 h-8 rounded-full bg-white/[0.02] border border-white/[0.05]" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-2 bg-white/[0.02] rounded-full w-full" />
              <div className="h-2 bg-white/[0.01] rounded-full w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const MockTableRows = () => (
    <div className="space-y-px bg-white/[0.01] rounded-2xl border border-white/[0.04] overflow-hidden shadow-2xl">
      <div className="h-12 bg-white/[0.02] border-b border-white/[0.04] flex items-center px-6 gap-8">
        <div className="w-4 h-4 bg-white/[0.1] rounded" />
        <div className="w-1/3 h-2 bg-white/[0.05] rounded-full" />
        <div className="w-20 h-2 bg-white/[0.05] rounded-full ml-auto" />
      </div>
      {[
        { t: "Frontend Dashboard", p: "High", s: "Active" },
        { t: "Mobile App Alpha", p: "Low", s: "Paused" },
        { t: "API Integration", p: "Med", s: "Active" },
        { t: "Design System", p: "High", s: "Active" }
      ].map((item, i) => (
        <div key={i} className="h-14 border-b border-white/[0.02] flex items-center px-6 gap-8 hover:bg-white/[0.01] transition-colors">
          <div className="w-4 h-4 bg-white/[0.05] rounded border border-white/[0.1]" />
          <div className="flex-1 text-sm text-gray-400 font-medium">{item.t}</div>
          <div className="flex items-center gap-4 ml-auto">
            <span className="text-[10px] text-gray-600 font-semibold uppercase">{item.p}</span>
            <div className="w-20 h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
              <div className="h-full bg-purple-500/30 w-2/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const visuals = [
    <MockIssueList />,
    <MockSidebar />,
    <MockTableRows />,
    <MockIssueList /> // Reusing issue list for "My Issues"
  ];

  return (
    <section id="product" className="relative z-10 py-32 px-4 sm:px-6 lg:px-8 bg-[#0F1115] border-t border-white/[0.02] overflow-hidden">
      {/* Local Background Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.25]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      <div className="max-w-7xl mx-auto space-y-40 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-semibold text-white mb-6 tracking-tight"
          >
            Built for focus
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed"
          >
            Everything you need to ship high-quality products, faster than ever before.
          </motion.p>
        </div>

        {/* Feature Rows */}
        {highlights.map((item, idx) => (
          <div
            key={item.title}
            className={`flex flex-col lg:flex-row items-center gap-16 lg:gap-32 ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
          >
            {/* Text Side */}
            <motion.div
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1 space-y-6"
            >
              <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-center text-gray-400">
                <item.icon className="w-5 h-5" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-medium text-[#f5f5f5] tracking-tight">{item.title}</h3>
                <p className="text-[#8A8F98] leading-relaxed text-lg max-w-md">
                  {item.description}
                </p>
              </div>
            </motion.div>

            {/* Visual Side (Mock UI) */}
            <motion.div
              initial={{ opacity: 0, x: idx % 2 === 0 ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              whileHover={{ y: -8 }}
              viewport={{ once: true }}
              className="flex-1 w-full transition-all duration-500"
            >
              <div className="relative group cursor-default">
                <div className="absolute -inset-4 bg-white/[0.01] rounded-3xl blur-2xl -z-10 group-hover:bg-white/[0.03] transition-colors" />
                <div className="relative bg-[#111113] border border-white/[0.03] group-hover:border-white/[0.1] rounded-2xl p-8 shadow-2xl overflow-hidden min-h-[320px] flex flex-col justify-center transition-all duration-500">
                  {visuals[idx]}
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductSection;
