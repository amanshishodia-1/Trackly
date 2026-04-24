import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Home,
  Inbox,
  FolderKanban,
  Users,
  Plus,
  Settings,
  Command,
  FileText,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTeams } from "../context/TeamsContext";

const CommandPalette = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { teams } = useTeams();

  const commands = [
    {
      id: "home",
      label: "Go to Home",
      icon: Home,
      shortcut: "G H",
      action: () => navigate("/inbox"),
    },
    {
      id: "inbox",
      label: "Go to Inbox",
      icon: Inbox,
      shortcut: "G I",
      action: () => navigate("/inbox"),
    },
    {
      id: "my-issues",
      label: "Go to My Issues",
      icon: FileText,
      shortcut: "G M",
      action: () => navigate("/my-issues"),
    },
    {
      id: "projects",
      label: "Go to Projects",
      icon: FolderKanban,
      shortcut: "G P",
      action: () => navigate("/projects"),
    },
    {
      id: "teams",
      label: "Go to Teams",
      icon: Users,
      shortcut: "G T",
      action: () => navigate("/teams"),
    },
    {
      id: "create-team",
      label: "Create New Team",
      icon: Plus,
      shortcut: "C T",
      action: () => navigate("/teams/new"),
    },
    ...teams.map((team) => ({
      id: `team-${team._id}`,
      label: `Go to ${team.name}`,
      icon: Users,
      action: () => navigate(`/teams/${team._id}`),
    })),
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase()),
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex(
            (prev) =>
              (prev - 1 + filteredCommands.length) % filteredCommands.length,
          );
          break;
        case "Enter":
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
            onClose();
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    },
    [isOpen, filteredCommands, selectedIndex, onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Command Palette */}
      <div className="relative w-full max-w-2xl mx-4 bg-[#0F1115] border border-[#1F2328] rounded-xl shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-[#1F2328]">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-white text-lg placeholder-gray-500 focus:outline-none"
            autoFocus
          />
          <div className="flex items-center gap-1">
            <kbd className="px-2 py-1 text-xs font-mono text-gray-400 bg-[#1A1D24] rounded border border-[#2D3139]">
              ESC
            </kbd>
          </div>
        </div>

        {/* Commands List */}
        <div className="max-h-[400px] overflow-y-auto py-2">
          {filteredCommands.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              No commands found
            </div>
          ) : (
            filteredCommands.map((cmd, index) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    index === selectedIndex
                      ? "bg-purple-500/20 text-white"
                      : "text-gray-300 hover:bg-[#1A1D24]"
                  }`}
                >
                  <Icon className="w-5 h-5 text-gray-400" />
                  <span className="flex-1">{cmd.label}</span>
                  {cmd.shortcut && (
                    <div className="flex items-center gap-1">
                      {cmd.shortcut.split(" ").map((key, i) => (
                        <kbd
                          key={i}
                          className="px-2 py-0.5 text-xs font-mono text-gray-400 bg-[#1A1D24] rounded border border-[#2D3139]"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#161922] border-t border-[#1F2328] text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 font-mono bg-[#1A1D24] rounded border border-[#2D3139]">
                ↑↓
              </kbd>
              to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 font-mono bg-[#1A1D24] rounded border border-[#2D3139]">
                ↵
              </kbd>
              to select
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Command className="w-3 h-3" />+ K to open
          </span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
