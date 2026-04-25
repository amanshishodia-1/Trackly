import { NavLink } from "react-router-dom";
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

const Sidebar = () => {
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
    <aside className="w-64 h-screen bg-[#0F1115] border-r border-[#1F2328] flex flex-col font-sans">
      {/* Workspace Header */}
      <div className="p-4 border-b border-white/[0.04]">
        <div className="flex items-center gap-2 px-2 py-2 mb-4 hover:bg-white/[0.04] rounded-md cursor-pointer transition-colors group">
          <div className="w-5 h-5 bg-gradient-to-br from-[#5E6AD2] to-[#8C98F2] rounded flex items-center justify-center flex-shrink-0 shadow-sm border border-white/10">
            <span className="text-white font-medium text-[11px] leading-none">
              W
            </span>
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h2 className="text-[#E8E8E8] font-medium text-[13px] truncate leading-tight group-hover:text-white transition-colors">
              {user?.workspaceId?.name || "Workspace"}
            </h2>
            <p className="text-[#8A8F98] text-[11px] truncate leading-tight mt-1">
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
                className={({ isActive }) =>
                  `group flex items-center gap-2 px-2 py-2 rounded-md text-[13px] font-medium transition-colors ${
                    isActive
                      ? "bg-white/[0.06] text-[#E8E8E8]"
                      : "text-[#8A8F98] hover:bg-white/[0.04] hover:text-[#D1D5DB]"
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
        <div className="mt-6">
          <div className="flex items-center justify-between px-2 mb-1 group cursor-pointer">
            <div className="flex items-center gap-1 text-[#8A8F98] group-hover:text-[#D1D5DB] transition-colors">
              <ChevronDown className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold uppercase tracking-wider">
                Your Teams
              </span>
            </div>
            <NavLink
              to="/app/teams"
              className="text-[#8A8F98] hover:text-[#D1D5DB] opacity-0 group-hover:opacity-100 transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              <Plus className="w-3.5 h-3.5" />
            </NavLink>
          </div>
          <ul className="space-y-1 mt-2">
            {teams.map((team) => (
              <li key={team._id}>
                <NavLink
                  to={`/app/teams/${team._id}`}
                  className={({ isActive }) =>
                    `group flex items-center gap-2 px-2 py-2 rounded-md text-[13px] font-medium transition-colors ${
                      isActive
                        ? "bg-white/[0.06] text-[#E8E8E8]"
                        : "text-[#8A8F98] hover:bg-white/[0.04] hover:text-[#D1D5DB]"
                    }`
                  }
                >
                  <div className="w-4 h-4 rounded-[4px] flex items-center justify-center flex-shrink-0 bg-white/[0.03] border border-white/[0.06] group-hover:border-white/[0.12] transition-colors">
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
      <div className="p-4 border-t border-white/[0.04]">
        <NavLink
          to="/app/settings"
          className={({ isActive }) =>
            `w-full flex items-center gap-2 px-2 py-2 rounded-md text-[13px] font-medium transition-colors mb-1 ${
              isActive
                ? "bg-white/[0.06] text-[#E5E7EB]"
                : "text-[#8A8F98] hover:bg-white/[0.04] hover:text-[#D1D5DB]"
            }`
          }
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          <span>Settings</span>
        </NavLink>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-2 py-2 rounded-md text-[13px] font-medium text-[#8A8F98] hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span>Logout</span>
        </button>
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
