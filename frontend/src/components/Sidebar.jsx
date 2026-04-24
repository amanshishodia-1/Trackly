import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTeams } from "../context/TeamsContext";
import { useInvites } from "../context/InviteContext";
import CreateIssueModal from "./CreateIssueModal";
import { useEffect } from "react";
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
    { to: "/inbox", icon: Inbox, label: "Inbox", badge: inviteCount },
    { to: "/my-issues", icon: CircleDot, label: "My Issues" },
    { to: "/projects", icon: FolderKanban, label: "Projects" },
    { to: "/teams", icon: Users, label: "Teams" },
  ];

  return (
    <aside className="w-64 h-screen bg-[#0F1115] border-r border-[#1F2328] flex flex-col">
      {/* Workspace Header */}
      <div className="p-4 border-b border-[#1F2328]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">W</span>
          </div>
          <div className="flex-1">
            <h2 className="text-white font-semibold text-sm truncate">
              {user?.workspaceId?.name || "Workspace"}
            </h2>
            <p className="text-gray-500 text-xs">{user?.name}</p>
          </div>
        </div>

        {/* Search Bar */}
        <button className="w-full bg-[#1A1D24] hover:bg-[#2D3139] rounded-lg py-2 px-3 flex items-center gap-2 text-gray-400 text-sm transition-colors">
          <Search className="w-4 h-4" />
          <span className="flex-1 text-left">Search</span>
          <div className="flex items-center gap-1 text-xs">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <div className="mb-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mb-4"
          >
            <Plus className="w-4 h-4" />
            New issue
          </button>
        </div>

        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-[#2D3139] text-white"
                      : "text-gray-400 hover:bg-[#1A1D24] hover:text-gray-200"
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="flex-1">{item.label}</span>
                {item.badge > 0 && (
                  <span className="bg-purple-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Your Teams Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Your Teams
            </span>
            <NavLink
              to="/teams"
              className="text-gray-500 hover:text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
            </NavLink>
          </div>
          <ul className="space-y-1">
            {teams.map((team) => (
              <li key={team._id}>
                <NavLink
                  to={`/teams/${team._id}`}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-[#2D3139] text-white"
                        : "text-gray-400 hover:bg-[#1A1D24] hover:text-gray-200"
                    }`
                  }
                >
                  <div className="w-5 h-5 rounded bg-purple-500/20 flex items-center justify-center">
                    <Hash className="w-3 h-3 text-purple-400" />
                  </div>
                  <span className="truncate">{team.name}</span>
                </NavLink>
              </li>
            ))}
            {teams.length === 0 && (
              <li className="px-3 py-2 text-sm text-gray-500">No teams yet</li>
            )}
          </ul>
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="p-2 border-t border-[#1F2328]">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-[#1A1D24] hover:text-gray-200 transition-colors mb-1">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-[#1A1D24] hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
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
