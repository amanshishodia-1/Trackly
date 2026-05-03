import { useState } from "react";
import Logo from "../components/Logo";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, ArrowRight, Check, Eye, EyeOff, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#08090A] text-[#EAEAEA] selection:bg-white/10 selection:text-white">
      {/* Left Column - Brand & Messaging */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-20 border-r border-white/[0.03] bg-[#08090A] relative overflow-hidden">
        {/* Subtle Ambient Background */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full" />
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-24"
          >
            <Logo size={28} />
            <span className="text-[18px] font-bold tracking-tight text-white">Trackly</span>
          </motion.div>

          <div className="max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-5xl font-semibold text-white mb-8 tracking-tight leading-[1.1]">
                Focus on what <br />
                <span className="text-gray-500">matters most.</span>
              </h1>
              <p className="text-lg text-gray-500 font-light leading-relaxed mb-16 max-w-sm">
                The high-performance workspace to plan, track, and ship software with speed and clarity.
              </p>
            </motion.div>

            <div className="space-y-8">
              {[
                { title: "Keyboard first", desc: "Every action is a shortcut away." },
                { title: "Real-time sync", desc: "Collaborate without the friction." },
                { title: "Deep integrations", desc: "Works with the tools you love." }
              ].map((item, i) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  key={i}
                  className="flex gap-4"
                >
                  <div className="mt-1 w-5 h-5 rounded-md bg-white/[0.03] border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-200 mb-1">{item.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 text-[11px] font-medium text-gray-700 tracking-widest uppercase">
          © 2026 Trackly Inc.
        </div>
      </div>

      {/* Right Column - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 relative overflow-hidden bg-[#0C0D0F] lg:rounded-l-[64px] border-l border-white/[0.03] shadow-[-20px_0_80px_rgba(0,0,0,0.5)]">
        {/* Exact Landing Page Grid Pattern */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.25) 1px, transparent 1px),
              linear-gradient(45deg, transparent 49.5%, rgba(255, 255, 255, 0.15) 49.5%, rgba(255, 255, 255, 0.15) 50.5%, transparent 50.5%),
              linear-gradient(-45deg, transparent 49.5%, rgba(255, 255, 255, 0.15) 49.5%, rgba(255, 255, 255, 0.15) 50.5%, transparent 50.5%)
            `,
            backgroundSize: "40px 40px, 40px 40px, 20px 20px, 20px 20px",
          }}
        />

        <div className="w-full max-w-[360px] relative z-10">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-12">
            <Logo size={32} />
            <span className="font-bold text-xl text-white">Trackly</span>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-white tracking-tight mb-2">Sign in</h2>
              <p className="text-[14px] text-gray-500 font-medium">
                Enter your credentials to access your account.
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-medium flex items-center gap-2"
              >
                <div className="w-1 h-1 rounded-full bg-red-400" />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[12px] font-medium text-gray-500 ml-1">Email address</label>
                <div className="relative group">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 text-[14px] text-white placeholder-gray-700 focus:outline-none focus:border-white/[0.15] focus:bg-white/[0.04] transition-all"
                    placeholder="name@company.com"
                  />
                  <Mail size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-gray-500 transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[12px] font-medium text-gray-500">Password</label>
                  <Link to="/forgot-password" size="sm" className="text-[11px] text-gray-600 hover:text-gray-400 transition-colors">
                    Forgot?
                  </Link>
                </div>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 text-[14px] text-white placeholder-gray-700 focus:outline-none focus:border-white/[0.15] focus:bg-white/[0.04] transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 hover:text-gray-500 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-white hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-white text-black rounded-xl text-[14px] font-semibold transition-all flex items-center justify-center gap-2 mt-4 active:scale-[0.99]"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-12 pt-8 border-t border-white/[0.03]">
              <p className="text-[13px] text-gray-600 text-center">
                New to Trackly?{" "}
                <Link to="/register" className="text-gray-300 hover:text-white transition-colors font-semibold ml-1">
                  Create an account
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
