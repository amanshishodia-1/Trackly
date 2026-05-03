import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import Logo from "../components/Logo";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const slides = [
  {
    headline: "Welcome to Trackly",
    description: "Manage issues, teams and projects in one fast workspace.",
    mock: null
  },
  {
    headline: "Track work with Issues",
    description: "Create tasks, assign owners, set priorities and move work forward.",
    mock: (
      <div className="mt-10 bg-[#161922] border border-[#2A2E37] rounded-xl p-5 w-full max-w-[400px] shadow-2xl flex items-center justify-between mx-auto transform hover:scale-[1.02] transition-transform duration-300">
        <div className="flex flex-col gap-2 text-left">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]"></div>
            <span className="text-[11px] font-semibold text-gray-500 tracking-wider">TRACK-12</span>
          </div>
          <span className="text-[15px] font-medium text-white">Design new onboarding flow</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold border border-purple-500/30">A</div>
        </div>
      </div>
    )
  },
  {
    headline: "Collaborate with Teams",
    description: "Structure your work with clear team ownership, manage shared backlogs, and collaborate seamlessly with members.",
    mock: (
      <div className="mt-8 bg-[#161922] border border-[#2A2E37] rounded-xl p-4 w-full max-w-[420px] shadow-2xl mx-auto transform hover:scale-[1.02] transition-transform duration-300">
        <div className="flex items-center justify-between border-b border-[#2A2E37] pb-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold">FR</div>
            <div className="text-left">
              <div className="text-[14px] font-medium text-white">Frontend Team</div>
              <div className="text-[11px] text-gray-500">Shared Backlog</div>
            </div>
          </div>
          <span className="text-[11px] text-gray-400 bg-white/[0.04] border border-white/[0.04] px-2 py-0.5 rounded">Ownership</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-gray-400 font-medium">3 Members</span>
          <div className="flex -space-x-1.5">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 border border-[#161922] flex items-center justify-center text-[9px] text-white font-bold">A</div>
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 border border-[#161922] flex items-center justify-center text-[9px] text-white font-bold">K</div>
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 border border-[#161922] flex items-center justify-center text-[9px] text-white font-bold">S</div>
          </div>
        </div>
      </div>
    )
  },
  {
    headline: "Organize work into Projects",
    description: "Group related issues together. Track progress, set milestones, and deliver large initiatives on time.",
    mock: (
      <div className="mt-8 bg-[#161922] border border-[#2A2E37] rounded-xl p-4 w-full max-w-[420px] shadow-2xl mx-auto transform hover:scale-[1.02] transition-transform duration-300">
        <div className="flex items-center gap-3 border-b border-[#2A2E37] pb-3 mb-3">
          <div className="w-4 h-4 text-indigo-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <span className="text-[14px] font-medium text-white">Q3 Mobile App Launch</span>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-12 h-1.5 bg-[#1F2328] rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-3/4"></div>
            </div>
            <span className="text-[11px] text-gray-500">75%</span>
          </div>
        </div>
        <div className="space-y-2 text-left">
          <div className="flex items-center gap-3 bg-[#1A1D24] p-2.5 rounded-lg border border-[#2A2E37]/50">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
             <span className="text-[12px] text-gray-300 truncate">Design system updates</span>
          </div>
          <div className="flex items-center gap-3 bg-[#1A1D24] p-2.5 rounded-lg border border-[#2A2E37]/50">
             <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]"></div>
             <span className="text-[12px] text-gray-300 truncate">Push notification service</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "command-menu",
    title: "Navigate instantly",
    description:
      "Use the command menu to jump to issues, teams, projects, and create work in seconds.",
    shortcut: "⌘ K / Ctrl K",
    bullets: [
      "Search issues",
      "Jump between teams",
      "Open projects instantly",
      "Create a new issue faster"
    ],
    mock: (
      <div className="mt-6 bg-[#161922] border border-[#2A2E37] rounded-xl p-4 w-full max-w-[420px] shadow-2xl mx-auto transform hover:scale-[1.02] transition-transform duration-300 text-left">
        <div className="flex items-center gap-3 border-b border-[#2A2E37] pb-3 mb-3 text-gray-500 text-sm">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          Search commands...
        </div>
        <div className="space-y-1">
          <div className="px-2 py-1.5 text-[13px] text-gray-300 hover:bg-[#1A1D24] rounded-md transition-colors flex items-center justify-between">
            <span>Create Issue</span>
            <span className="text-[10px] bg-white/[0.04] border border-white/[0.04] px-1.5 rounded text-gray-500">C</span>
          </div>
          <div className="px-2 py-1.5 text-[13px] text-gray-300 hover:bg-[#1A1D24] rounded-md transition-colors">Go to My Issues</div>
          <div className="px-2 py-1.5 text-[13px] text-gray-300 hover:bg-[#1A1D24] rounded-md transition-colors">Open Teams</div>
          <div className="px-2 py-1.5 text-[13px] text-gray-300 hover:bg-[#1A1D24] rounded-md transition-colors">Settings</div>
        </div>
      </div>
    )
  },
  {
    headline: "You're good to go",
    description: "Welcome to your new workspace.",
    mock: (
      <div className="mt-8 flex flex-col gap-3 w-full max-w-[420px] mx-auto text-left">
        <div className="bg-[#161922] border border-[#2A2E37] rounded-xl p-4 flex items-center gap-4 hover:border-purple-500/30 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>
          </div>
          <div>
            <div className="text-[14px] font-medium text-white">Invite your team</div>
            <div className="text-[12px] text-gray-500">Bring everyone aboard</div>
          </div>
        </div>
        <div className="bg-[#161922] border border-[#2A2E37] rounded-xl p-4 flex items-center gap-4 hover:border-purple-500/30 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
          </div>
          <div>
            <div className="text-[14px] font-medium text-white">Create your first issue</div>
            <div className="text-[12px] text-gray-500">Track a new task</div>
          </div>
        </div>
        <div className="bg-[#161922] border border-[#2A2E37] rounded-xl p-4 flex items-center gap-4 hover:border-purple-500/30 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><path d="M6 8h.001"></path><path d="M10 8h.001"></path><path d="M14 8h.001"></path><path d="M18 8h.001"></path><path d="M8 12h.001"></path><path d="M12 12h.001"></path><path d="M16 12h.001"></path><path d="M7 16h10"></path></svg>
          </div>
          <div>
            <div className="text-[14px] font-medium text-white">Explore keyboard shortcuts</div>
            <div className="text-[12px] text-gray-500">Work at the speed of thought</div>
          </div>
        </div>
      </div>
    )
  }
];

const Welcome = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleNext = async () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      await completeOnboarding();
    }
  };

  const completeOnboarding = async () => {
    try {
      setLoading(true);
      await api.patch('/settings/profile', { hasCompletedOnboarding: true });
      navigate("/app");
    } catch (err) {
      console.error("Failed to complete onboarding:", err);
      // Fallback navigate anyway or show error
      navigate("/app");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1115] bg-grid-pattern flex flex-col items-center justify-center relative overflow-hidden px-6">
      
      {/* Top Navigation */}
      {currentSlide < slides.length - 1 && (
        <div className="absolute top-8 right-8 md:top-10 md:right-12 z-50">
          <button 
            onClick={completeOnboarding}
            disabled={loading}
            className="text-[14px] font-medium text-[#8A8F98] hover:text-[#EDEDED] transition-colors"
          >
            Skip
          </button>
        </div>
      )}

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-purple-500/10 via-indigo-500/5 to-transparent rounded-full blur-[100px] pointer-events-none" />

      {/* Content Container */}
      <div className="w-full max-w-2xl relative z-10 flex flex-col items-center text-center">
        
        {/* Logo */}
        <div className="mb-10 transform hover:scale-105 transition-transform duration-300">
          <Logo size={56} />
        </div>

        {/* Content */}
        <div className="flex flex-col items-center justify-start mb-8 min-h-[220px]">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-[1.1] transition-opacity duration-300">
            {slides[currentSlide].headline || slides[currentSlide].title}
          </h1>
          <p className="text-[17px] md:text-lg text-[#8A8F98] leading-relaxed max-w-lg transition-opacity duration-300">
            {slides[currentSlide].description}
          </p>
          
          {slides[currentSlide].shortcut && (
            <div className="mt-5 mb-2 inline-flex items-center justify-center px-3 py-1.5 bg-[#1A1D24] border border-[#2A2E37] rounded-lg text-sm font-medium text-gray-300 shadow-sm">
              {slides[currentSlide].shortcut}
            </div>
          )}
          
          {slides[currentSlide].bullets && (
            <ul className="text-left text-[#8A8F98] text-[14px] md:text-[15px] space-y-2 mt-4 max-w-sm mx-auto">
              {slides[currentSlide].bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/80"></div>
                  {bullet}
                </li>
              ))}
            </ul>
          )}

          {slides[currentSlide].mock && slides[currentSlide].mock}
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center gap-3 mb-10">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-8 bg-white' : 'w-2 bg-white/20'}`}
            />
          ))}
        </div>

        {/* Premium Button */}
        <button
          onClick={handleNext}
          disabled={loading}
          className="bg-[#EDEDED] hover:bg-white text-[#111111] font-medium h-12 rounded-lg px-8 flex items-center justify-center gap-2 text-[15px] transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-lg shadow-sm"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#111111]"></div>
          ) : currentSlide === slides.length - 1 ? (
            <>
              Open Trackly <ArrowRight className="w-4 h-4 ml-1" />
            </>
          ) : (
            <>
              Next <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>

      </div>
    </div>
  );
};

export default Welcome;
