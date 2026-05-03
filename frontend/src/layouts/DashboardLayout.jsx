import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import GlobalSearch from "../components/GlobalSearch";
import { Menu, X } from "lucide-react";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] relative overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 bg-dashboard-grid z-0 pointer-events-none" />
      
      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-[800px] h-[800px] bg-purple-500/[0.02] rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-[800px] h-[800px] bg-indigo-500/[0.02] rounded-full blur-[120px] pointer-events-none z-0" />
      
      {/* Content Layer */}
      <div className="relative z-10 flex w-full h-full">
        {/* Sidebar Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        <div className="flex-1 flex flex-col overflow-hidden w-full">
          {/* Header with Global Search */}
          <header className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-[var(--border-primary)] bg-[var(--bg-primary)] relative z-20">
            <div className="flex items-center gap-3 flex-1">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 -ml-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] md:hidden transition-all bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-md shadow-sm active:scale-95"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <GlobalSearch />
            </div>
            <div className="flex items-center gap-4">
              {/* Can add notifications, user menu here */}
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <div className="p-4 md:p-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
