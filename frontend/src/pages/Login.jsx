import { useState } from "react";
import Logo from "../components/Logo";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, ArrowRight, Check, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const pageVariants = {
    initial: {
      rotateY: 45,
      opacity: 0,
      x: 50,
    },
    animate: {
      rotateY: 0,
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.23, 1, 0.32, 1],
      },
    },
    exit: {
      rotateY: -45,
      opacity: 0,
      x: -50,
      transition: {
        duration: 0.4,
        ease: [0.23, 1, 0.32, 1],
      },
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.hasCompletedOnboarding === false) {
        navigate("/welcome");
      } else {
        navigate("/app");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen flex bg-[#0d0d0f] bg-grid-pattern text-[#EAEAEA] relative overflow-hidden selection:bg-indigo-500/30"
      style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
    >
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Left Column - Brand & Messaging */}
      <div className="hidden lg:flex lg:w-[42%] flex-col justify-between p-16 border-r border-white/[0.05] relative overflow-hidden bg-[#0d0d0f] rounded-r-[48px] z-20 shadow-[20px_0_60px_rgba(0,0,0,0.3)]">
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 text-white font-bold text-xl mb-24"
          >
            <Logo size={32} />
            <span className="tracking-tight">Trackly</span>
          </motion.div>
          
          <div className="max-w-md">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-6xl font-bold text-white mb-8 tracking-tighter leading-[1.05]"
            >
              The power to <span className="text-indigo-400">ship</span> faster.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-[18px] text-gray-400 font-light leading-relaxed mb-16"
            >
              Streamline your workflow with a beautiful, high-performance interface designed for modern software teams.
            </motion.p>

            <ul className="space-y-6">
              {[
                "Instant issue tracking",
                "Automated project cycles",
                "Real-time team sync"
              ].map((bullet, i) => (
                <motion.li 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + (i * 0.1) }}
                  key={i} 
                  className="flex items-center gap-5 text-gray-300"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center">
                    <Check className="w-4 h-4 text-indigo-400" />
                  </div>
                  <span className="text-[15px] font-medium tracking-tight">{bullet}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="relative z-10 text-xs font-medium text-gray-600 tracking-widest uppercase">
          © {new Date().getFullYear()} Trackly Inc. All rights reserved.
        </div>
      </div>

      {/* Right Column - Auth Form */}
      <div className="w-full lg:w-[58%] flex flex-col items-center justify-center p-6 lg:p-16 relative">
        <div className="w-full max-w-[390px] relative z-10">
          <div className="flex lg:hidden items-center justify-center gap-2 text-white font-bold text-xl mb-12">
            <Logo size={32} />
            Trackly
          </div>

          <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[48px] p-7 lg:p-9 border border-white/[0.08] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] relative overflow-hidden group/card">
            {/* Subtle Noise Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150 mix-blend-overlay"></div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative z-10 text-center lg:text-left mb-10 space-y-2.5"
            >
              <h2 className="text-3xl font-bold text-white tracking-tight">Welcome back</h2>
              <p className="text-[15px] text-gray-500 font-medium">Continue to your dashboard</p>
            </motion.div>

            <div className="space-y-8 relative z-10">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold text-center uppercase tracking-wider"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2.5"
                >
                  <label className="text-[12px] font-bold text-gray-500 uppercase tracking-[0.15em] ml-1">Email address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-gray-600 group-focus-within:text-indigo-400 transition-colors duration-300">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-16 pr-4 py-4 bg-black/20 border border-white/[0.05] rounded-2xl text-white placeholder-gray-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all duration-300 text-[15px] group-hover:border-white/10 shadow-inner"
                      placeholder="name@company.com"
                    />
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2.5"
                >
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-[12px] font-bold text-gray-500 uppercase tracking-[0.15em]">Password</label>
                    <Link to="/forgot-password" size="sm" className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-widest transition-colors">
                      Reset?
                    </Link>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-gray-600 group-focus-within:text-indigo-400 transition-colors duration-300">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-16 pr-12 py-4 bg-black/20 border border-white/[0.05] rounded-2xl text-white placeholder-gray-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all duration-300 text-[15px] group-hover:border-white/10 shadow-inner"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-600 hover:text-gray-400 transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-5 px-6 bg-white hover:bg-[#F2F2F2] disabled:opacity-50 disabled:cursor-not-allowed text-black rounded-2xl font-bold shadow-[0_20px_40px_-12px_rgba(255,255,255,0.15)] transition-all duration-300 active:scale-[0.97] text-[14px] mt-4 group relative overflow-hidden"
                >
                  {/* Button Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine pointer-events-none"></div>
                  
                  <span className="tracking-[0.1em] relative z-10">{loading ? "AUTHENTICATING..." : "SIGN IN"}</span>
                  {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform relative z-10" />}
                </motion.button>
              </form>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="pt-8 border-t border-white/[0.05] text-center"
              >
                <p className="text-sm text-gray-500 font-medium tracking-tight">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-white hover:text-indigo-400 transition-all font-bold ml-1 border-b border-white/10 hover:border-indigo-400 pb-0.5">
                    Create one for free
                  </Link>
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
