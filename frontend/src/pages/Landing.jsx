import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../components/Logo";
import {
  ArrowRight,
  Sparkles,
  Check,
  Layout,
  Users,
  TrendingUp,
  Zap,
  Inbox,
  CircleDot,
  FolderKanban,
  Star,
  CheckCircle2,
  Clock,
  Settings,
  LogOut,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";
import BackgroundPattern from "../components/landing/BackgroundPattern";
import ProductSection from "../components/landing/ProductSection";

const Landing = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  const features = [
    {
      icon: Layout,
      title: "Plan with clarity",
      description:
        "Break down work, set priorities, and keep everyone aligned.",
    },
    {
      icon: Users,
      title: "Work together",
      description:
        "Collaborate in context and keep conversations moving forward.",
    },
    {
      icon: TrendingUp,
      title: "Track progress",
      description: "Get real-time visibility and ship with confidence.",
    },
    {
      icon: Zap,
      title: "Built for speed",
      description:
        "Fast, reliable, and designed to help your team move faster.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0F1115] text-gray-100 relative">
      {/* Background Pattern */}
      <BackgroundPattern />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F1115]/80 backdrop-blur-md border-b border-[#1F2328]/60">
        <div className="flex items-center justify-between h-[68px] px-8 sm:px-12 lg:px-16">
          <div className="flex items-center gap-3">
            <Logo size={32} />
            <span className="font-bold text-[20px] text-gray-100 tracking-tight">Trackly</span>
          </div>
          <div className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            <Link
              to="#product"
              className="text-[18px] text-gray-400 hover:text-gray-200 transition-colors"
            >
              Product
            </Link>
            <Link
              to="#pricing"
              className="text-[18px] text-gray-400 hover:text-gray-200 transition-colors"
            >
              Pricing
            </Link>
            <Link
              to="/contact"
              className="text-[18px] text-gray-400 hover:text-gray-200 transition-colors"
            >
              Contact
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-[15px] text-gray-400 hover:text-gray-200 transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-white text-[#0F1115] text-[15px] font-medium rounded-md hover:bg-gray-100 transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full pt-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left pt-12">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A1D24] border border-[#1F2328] mb-6">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-300">
                  Built for high-performing teams
                </span>
              </div>

              {/* Headline */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-4xl sm:text-5xl lg:text-[64px] font-semibold text-white mb-8 tracking-tight leading-[1.05]"
              >
                The issue tracking
                <br />
                system teams{" "}
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                  love
                </span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                className="text-lg sm:text-xl text-gray-400 mb-10 max-w-lg leading-relaxed font-light"
              >
                Trackly is the easiest way to manage your software projects. Fast,
                beautiful, and built for high-performance teams.
              </motion.p>

              {/* CTAs */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="flex items-center gap-4 mb-12"
              >
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0F1115] text-[15px] font-semibold rounded-xl hover:bg-gray-100 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                >
                  Get started for free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="#product"
                  className="px-8 py-4 bg-white/[0.03] border border-white/[0.08] text-white text-[15px] font-medium rounded-xl hover:bg-white/[0.06] transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  View demo
                </Link>
              </motion.div>

              {/* Trust badges */}
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>No credit card</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>

            {/* Product Preview - Full App Mockup */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="relative lg:scale-[1.35] origin-center"
            >
              <div className="bg-[#0F1115] rounded-2xl border border-white/[0.08] overflow-hidden shadow-[0_32px_120px_rgba(0,0,0,0.6)]">
                {/* App Mockup Header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1F2328] bg-[#161922]">
                  <Logo size={20} />
                  <span className="text-sm font-medium text-gray-200">
                    Trackly
                  </span>
                  <ChevronDown className="w-3 h-3 text-gray-500 ml-1" />
                  <div className="flex-1"></div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>02/145</span>
                    <CheckCircle2 className="w-4 h-4" />
                    <MoreHorizontal className="w-4 h-4" />
                  </div>
                </div>

                {/* App Content - Two Column */}
                <div className="flex">
                  {/* Sidebar */}
                  <div className="w-44 bg-[#0F1115] border-r border-[#1F2328] p-3 hidden sm:block">
                    <nav className="space-y-0.5">
                      <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-300 hover:bg-[#1A1D24] rounded cursor-pointer">
                        <Inbox className="w-4 h-4 text-gray-500" />
                        <span>Inbox</span>
                        <span className="ml-auto text-xs text-gray-600">
                          20
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-300 hover:bg-[#1A1D24] rounded cursor-pointer">
                        <CircleDot className="w-4 h-4 text-gray-500" />
                        <span>My issues</span>
                        <ChevronDown className="w-3 h-3 text-gray-600 ml-auto" />
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-300 hover:bg-[#1A1D24] rounded cursor-pointer">
                        <FolderKanban className="w-4 h-4 text-gray-500" />
                        <span>Projects</span>
                        <ChevronDown className="w-3 h-3 text-gray-600 ml-auto" />
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-300 hover:bg-[#1A1D24] rounded cursor-pointer">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span>Teams</span>
                        <ChevronDown className="w-3 h-3 text-gray-600 ml-auto" />
                      </div>
                    </nav>

                    <div className="mt-4 pt-4 border-t border-[#1F2328]">
                      <div className="flex items-center gap-1.5 px-2 mb-2">
                        <ChevronDown className="w-3 h-3 text-gray-600" />
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Favorites
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-300 hover:bg-[#1A1D24] rounded cursor-pointer">
                          <Star className="w-3.5 h-3.5 text-yellow-500/70 fill-yellow-500/70" />
                          <span>Faster app launch</span>
                        </div>
                        <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-400 hover:bg-[#1A1D24] rounded cursor-pointer">
                          <div className="w-3.5 h-3.5 rounded bg-red-500/20 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-red-400"></div>
                          </div>
                          <span>UI Refresh</span>
                        </div>
                        <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-400 hover:bg-[#1A1D24] rounded cursor-pointer">
                          <div className="w-3.5 h-3.5 rounded bg-blue-500/20 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                          </div>
                          <span>Agent tasks</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto pt-4">
                      <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-500 hover:text-gray-300 cursor-pointer">
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-500 hover:text-gray-300 cursor-pointer">
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </div>
                    </div>
                  </div>

                  {/* Issue Detail */}
                  <div className="flex-1 p-4 bg-[#0F1115] min-w-0">
                    {/* Issue Header */}
                    <div className="flex items-center gap-2 mb-4">
                      <h2 className="text-lg font-semibold text-gray-200">
                        Faster app launch
                      </h2>
                      <Star className="w-4 h-4 text-yellow-500/70 fill-yellow-500/70" />
                    </div>

                    <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                      Render UI before vehicle_state sync when minimum required
                      state is present, instead of blocking on full refresh
                      during iOS startup.
                    </p>

                    {/* Activity */}
                    <div className="mb-6">
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                        Activity
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs text-purple-400">T</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-400">
                              <span className="text-gray-300">Trackly</span>{" "}
                              created the issue via Web
                            </span>
                            <span className="text-gray-600 ml-2">2m ago</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs text-blue-400">T</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-400">
                              <span className="text-gray-300">
                                Triage intelligence
                              </span>{" "}
                              added the label{" "}
                              <span className="text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
                                Performance
                              </span>
                            </span>
                            <span className="text-gray-600 ml-2">2m ago</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs text-orange-400">k</span>
                          </div>
                          <div className="text-sm flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-gray-300 font-medium">
                                karri
                              </span>
                              <span className="text-gray-600 text-xs">
                                5m ago
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm">
                              Right now we show a spinner forever, which makes
                              it look like the car disappeared...
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs text-green-400">j</span>
                          </div>
                          <div className="text-sm flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-gray-300 font-medium">
                                jori
                              </span>
                              <span className="text-gray-600 text-xs">
                                just now
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm">
                              <span className="text-blue-400">@karri</span> can
                              you take a stab at this?
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs text-pink-400">j</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-400">
                              <span className="text-gray-300">jori</span>{" "}
                              connected{" "}
                              <span className="text-purple-400">Cursor</span>
                            </span>
                            <span className="text-gray-600 ml-2">just now</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Panel - Issue Meta */}
                  <div className="w-48 bg-[#0F1115] border-l border-[#1F2328] p-4 hidden lg:block">
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </span>
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                          <span className="text-sm text-gray-300">
                            In Progress
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Priority
                        </span>
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          <span className="text-sm text-gray-300">High</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Assignee
                        </span>
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                            <span className="text-xs text-purple-400">k</span>
                          </div>
                          <span className="text-sm text-gray-300">karri</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Followers
                        </span>
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <span className="text-xs text-blue-400">C</span>
                          </div>
                          <span className="text-sm text-gray-300">Cursor</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Team
                        </span>
                        <div className="space-y-1.5 mt-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                              <span className="text-xs text-purple-400">M</span>
                            </div>
                            <span className="text-sm text-gray-300">
                              Mobile
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                              <span className="text-xs text-blue-400">P</span>
                            </div>
                            <span className="text-sm text-gray-300">
                              Platform
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estimate
                        </span>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-300">2h</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Subtle glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 rounded-2xl blur-xl -z-10"></div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] text-gray-600 uppercase tracking-[0.2em] font-medium">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-4 h-4 text-gray-700" />
          </motion.div>
        </motion.div>
      </section>

      <ProductSection />

            {/* Features Section */}
      <section
        id="features"
        className="relative z-10 py-48 px-4 sm:px-6 lg:px-8 border-t border-white/[0.02]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-sm font-semibold text-purple-400 uppercase tracking-[0.2em] mb-4">Features</h2>
            <p className="text-4xl font-medium text-white tracking-tight">Everything you need to ship faster</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-10 rounded-2xl bg-white/[0.01] border border-white/[0.03] hover:border-white/[0.1] hover:bg-white/[0.02] transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-5 h-5 text-gray-300 group-hover:text-white" />
                </div>
                <h3 className="text-lg font-medium text-[#f5f5f5] mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#8A8F98] leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 pt-16 pb-8 px-4 sm:px-6 lg:px-8 bg-[#0A0C0F] border-t border-white/[0.03]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <Logo size={28} />
                <span className="font-semibold text-white text-xl tracking-tight">Trackly</span>
              </div>
              <p className="text-gray-500 text-[15px] leading-relaxed max-w-xs mb-8">
                The issue tracking system for high-performance teams. 
                Fast, beautiful, and built for clarity.
              </p>
              <div className="flex items-center gap-4">
                 <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-center hover:bg-white/[0.08] transition-colors cursor-pointer">
                    <div className="w-4 h-4 bg-gray-500" /> {/* Social Placeholder */}
                 </div>
                 <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-center hover:bg-white/[0.08] transition-colors cursor-pointer">
                    <div className="w-4 h-4 bg-gray-500" /> {/* Social Placeholder */}
                 </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-white mb-6 uppercase tracking-wider">Product</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><Link to="#product" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Integrations</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Changelog</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Docs</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-6 uppercase tracking-wider">Company</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><Link to="#" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div className="col-span-2">
              <h4 className="text-sm font-semibold text-white mb-6 uppercase tracking-wider">Stay Updated</h4>
              <p className="text-sm text-gray-500 mb-6">Get the latest news and updates from our team.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email address"
                  className="flex-1 bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/30 transition-colors"
                />
                <button className="bg-white text-[#0A0C0F] px-5 py-3 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/[0.03] flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-sm text-gray-600">
              © 2026 Trackly Inc. All rights reserved.
            </div>
            <div className="flex items-center gap-8 text-sm text-gray-600">
              <Link to="#" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
              <Link to="#" className="hover:text-gray-400 transition-colors">Terms of Service</Link>
              <Link to="#" className="hover:text-gray-400 transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
