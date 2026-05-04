import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTeams } from "../context/TeamsContext";
import { useInvites } from "../context/InviteContext";
import CreateIssueModal from "./CreateIssueModal";
import {
  Inbox,
  CircleDot,
  FolderKanban,
  Users,
  Search,
  Command,
  Settings,
  LogOut,
  Plus,
  Hash,
  ChevronDown,
} from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { teams, fetchTeams } = useTeams();
  const {
    pendingInvites,
    fetchPendingInvites,
    fetchInboxInvites,
    inviteCount,
  } = useInvites();
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTeams();
      fetchInboxInvites();
    }
  }, [user, fetchTeams, fetchInboxInvites]);

  const navItems = [
    { to: "/app/inbox", icon: Inbox, label: "Inbox", badge: inviteCount },
    { to: "/app/my-issues", icon: CircleDot, label: "My Issues" },
    { to: "/app/projects", icon: FolderKanban, label: "Projects" },
    { to: "/app/teams", icon: Users, label: "Teams" },
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[var(--bg-secondary)] border-r border-[var(--border-primary)] flex flex-col font-sans transition-transform duration-300 ease-in-out transform ${isOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 md:z-20 shadow-[4px_0_24px_rgba(0,0,0,0.05)]`}>
      {/* Mobile Close Button */}
      {isOpen && (
        <button
          onClick={onClose}
          className="absolute top-4 right-[-40px] p-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] border-l-0 rounded-r-md text-[var(--text-secondary)] md:hidden shadow-lg animate-in fade-in slide-in-from-left-2 duration-200"
        >
          <ChevronDown className="w-4 h-4 rotate-90" />
        </button>
      )}

      {/* Workspace Header */}
      <div className="p-4 border-b border-[var(--border-primary)]">
        <div className="flex items-center gap-2.5 px-2 py-2 mb-4 hover:bg-[var(--hover-bg)] rounded-md cursor-pointer transition-colors group">
          <Logo size={22} className="flex-shrink-0" />
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h2 className="text-[var(--text-primary)] font-medium text-[13px] truncate leading-tight group-hover:text-indigo-400 transition-colors">
              {user?.workspaceId?.name || "Workspace"}
            </h2>
            <p className="text-[var(--text-tertiary)] text-[11px] truncate leading-tight mt-1">
              {user?.name}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <button className="w-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] rounded-md py-2 px-2 flex items-center gap-2 text-[#8A8F98] text-[13px] transition-all shadow-sm">
          <Search className="w-3.5 h-3.5 text-[#8A8F98]" />
          <span className="flex-1 text-left font-medium">Search</span>
          <div className="flex items-center gap-1 text-[10px] font-medium text-[#8A8F98] border border-white/[0.05] bg-white/[0.02] px-2 py-1 rounded">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="mb-4 px-1">
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full bg-[#5E6AD2] hover:bg-[#6F7BF7] text-white font-medium py-2 px-4 rounded-md transition-all shadow-sm flex items-center justify-center gap-2 text-[13px]"
          >
            <Plus className="w-3.5 h-3.5" />
            New issue
          </button>
        </div>

        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex items-center gap-2 px-2 py-2 rounded-md text-[13px] font-medium transition-colors ${isActive
                    ? "bg-white/5 text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]"
                  }`
                }
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge > 0 && (
                  <span className="bg-[#5E6AD2] text-white text-[10px] font-semibold px-2 py-1 rounded-full leading-none">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Your Teams Section */}
        <div className="mt-5 mx-2 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
          <div className="flex items-center justify-between px-2 mb-2 group cursor-pointer">
            <div className="flex items-center gap-1.5 text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors">
              <ChevronDown className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold uppercase tracking-wider">
                Your Teams
              </span>
            </div>
            <NavLink
              to="/app/teams"
              className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] opacity-0 group-hover:opacity-100 transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              <Plus className="w-3.5 h-3.5" />
            </NavLink>
          </div>
          <ul className="space-y-0.5">
            {teams.map((team) => (
              <li key={team._id}>
                <NavLink
                  to={`/app/teams/${team._id}`}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] font-medium transition-colors ${isActive
                      ? "bg-white/5 text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]"
                    }`
                  }
                >
                  <div className="w-4 h-4 rounded-[4px] flex items-center justify-center flex-shrink-0 bg-white/[0.03] border border-[var(--border-primary)] group-hover:border-white/10 transition-colors">
                    <Hash className="w-2.5 h-2.5 text-current opacity-70 group-hover:opacity-100" />
                  </div>
                  <span className="truncate flex-1">{team.name}</span>
                </NavLink>
              </li>
            ))}
            {teams.length === 0 && (
              <li className="px-2 py-2 text-[13px] text-[#8A8F98] font-medium">
                No teams yet
              </li>
            )}
          </ul>
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-[var(--border-primary)]">
        <div className="mx-0 p-2 rounded-lg bg-[var(--hover-bg)] border border-[var(--border-primary)]">
          <NavLink
            to="/app/settings"
            onClick={onClose}
            className={({ isActive }) =>
              `w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] font-medium transition-colors mb-0.5 ${isActive
                ? "bg-white/5 text-[var(--text-primary)]"
                : "text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]"
              }`
            }
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            <span>Settings</span>
          </NavLink>
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] font-medium text-[var(--text-secondary)] hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Create Issue Modal */}
      <CreateIssueModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </aside>
  );
};

export default Sidebar;
