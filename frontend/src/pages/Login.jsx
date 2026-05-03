import { useState } from "react";
import Logo from "../components/Logo";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, ArrowRight, Check, Eye, EyeOff } from "lucide-react";

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
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)] bg-grid-pattern relative">
      {/* Left Column - Brand & Messaging */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 border-r border-[var(--border-primary)] relative overflow-hidden">
        {/* Ambient background effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-[var(--text-primary)] font-bold text-xl mb-16">
            <Logo size={32} />
            Trackly
          </div>
          
          <div className="max-w-md">
            <h1 className="text-5xl font-extrabold text-[var(--text-primary)] mb-6 tracking-tight leading-[1.1]">
              Focused work starts here.
            </h1>
            <p className="text-[17px] text-[var(--text-secondary)] leading-relaxed mb-12">
              Manage projects, track issues, and collaborate with your team in a seamless, premium environment designed for high-performance teams.
            </p>

            <ul className="space-y-5">
              {[
                "Track issues fast",
                "Collaborate with teams",
                "Ship projects clearly"
              ].map((bullet, i) => (
                <li key={i} className="flex items-center gap-4 text-[var(--text-primary)]">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--hover-bg)] flex items-center justify-center border border-[var(--border-primary)]">
                    <Check className="w-3.5 h-3.5 text-indigo-500" />
                  </div>
                  <span className="text-[15px]">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="relative z-10 text-sm text-[var(--text-tertiary)]">
          © {new Date().getFullYear()} Trackly. All rights reserved.
        </div>
      </div>

      {/* Right Column - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 relative">
        
        <div className="w-full max-w-md relative z-10">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center justify-center gap-2 text-[var(--text-primary)] font-bold text-xl mb-10 mt-8 sm:mt-0">
            <Logo size={32} />
            Trackly
          </div>

          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2.5 tracking-tight">Welcome back</h2>
            <p className="text-[15px] text-[var(--text-tertiary)]">Sign in to your workspace</p>
          </div>

          <div className="bg-[var(--bg-secondary)] rounded-[24px] p-8 sm:p-12 border border-[var(--border-primary)] shadow-[0_8px_40px_rgb(0,0,0,0.06)] transition-shadow duration-200 ease-out hover:shadow-[0_8px_50px_rgb(0,0,0,0.12)]">
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label>
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field input-field-icon"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label>
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field input-field-icon pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-[#EDEDED] hover:bg-white text-[#111111] font-medium h-11 rounded-lg px-4 flex items-center justify-center gap-2 text-[14px] transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-md w-full mt-6 shadow-sm"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#111111]"></div>
                ) : (
                  <>
                    Log in <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6">
              <Link
                to="/register"
                className="flex items-center justify-center w-full h-11 rounded-lg text-[14px] font-medium text-gray-400 hover:text-white hover:bg-white/[0.04] transition-colors border border-transparent hover:border-white/[0.08]"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
