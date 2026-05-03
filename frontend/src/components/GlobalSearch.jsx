import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, FileText, FolderKanban, Command } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/axios";

const GlobalSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ issues: [], projects: [] });
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  // Handle keyboard shortcut (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      // Escape to close
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Search when query changes
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.trim().length === 0) {
        setResults({ issues: [], projects: [] });
        return;
      }

      setLoading(true);
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
        setResults(res.data);
        setSelectedIndex(0);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 150);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  // Calculate total items for keyboard navigation
  const allItems = [
    ...results.issues.map((issue) => ({ type: "issue", item: issue })),
    ...results.projects.map((project) => ({ type: "project", item: project })),
  ];

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % allItems.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + allItems.length) % allItems.length,
        );
      } else if (e.key === "Enter" && allItems.length > 0) {
        e.preventDefault();
        const selected = allItems[selectedIndex];
        handleSelect(selected.type, selected.item);
      }
    },
    [isOpen, allItems, selectedIndex],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleSelect = (type, item) => {
    setIsOpen(false);
    setQuery("");
    setResults({ issues: [], projects: [] });

    if (type === "issue") {
      navigate(`/app/teams/${item.team._id}?issue=${item._id}`);
    } else if (type === "project") {
      navigate(`/app/projects/${item._id}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Todo":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      case "In Progress":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Done":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Urgent":
        return "text-red-400";
      case "High":
        return "text-orange-400";
      case "Medium":
        return "text-yellow-400";
      case "Low":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 p-2 md:px-4 md:py-2 bg-[var(--bg-secondary)] hover:bg-[var(--hover-bg)] border border-[var(--border-primary)] rounded-md text-[var(--text-tertiary)] text-sm transition-colors shadow-sm"
      >
        <Search className="w-4 h-4 md:w-4 md:h-4" />
        <span className="hidden md:inline">Search...</span>
        <div className="hidden md:flex items-center gap-1 ml-2 text-xs opacity-60">
          <Command className="w-3 h-3" />
          <span>K</span>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Search Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="relative top-[15vh] w-[600px] max-w-[90vw] h-fit bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl shadow-2xl overflow-hidden"
            >
              {/* Search Input */}
              <div className="flex items-center gap-4 p-4 border-b border-[var(--border-primary)]">
                <Search className="w-5 h-5 text-[var(--text-tertiary)]" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search issues, projects..."
                  className="flex-1 bg-transparent text-[var(--text-primary)] text-base placeholder-[var(--text-tertiary)] focus:outline-none"
                  autoFocus
                />
                {loading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[var(--accent-primary)]" />
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-[var(--hover-bg)] rounded transition-colors"
                >
                  <X className="w-4 h-4 text-[var(--text-tertiary)]" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[400px] overflow-y-auto">
                {/* Issues Section */}
                {results.issues.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wide bg-[var(--bg-primary)]/50">
                      Issues ({results.issues.length})
                    </div>
                    {results.issues.map((issue, index) => {
                      const globalIndex = index;
                      const isSelected = globalIndex === selectedIndex;

                      return (
                        <button
                          key={issue._id}
                          onClick={() => handleSelect("issue", issue)}
                          className={`w-full flex items-center gap-4 px-4 py-4 text-left transition-colors ${
                            isSelected
                              ? "bg-[var(--accent-primary)]/10"
                              : "hover:bg-[var(--hover-bg)]"
                          }`}
                        >
                          <FileText className="w-4 h-4 text-[var(--text-tertiary)] flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[var(--text-tertiary)] font-mono text-xs">
                                {issue.identifier}
                              </span>
                              <span className="text-[var(--text-primary)] text-sm truncate">
                                {issue.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className={`text-xs px-2 py-1 rounded border ${getStatusColor(issue.status)}`}
                              >
                                {issue.status}
                              </span>
                              <span
                                className={`text-xs ${getPriorityColor(issue.priority)}`}
                              >
                                {issue.priority}
                              </span>
                              <span className="text-[var(--text-tertiary)] text-xs">
                                {issue.team?.name}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Projects Section */}
                {results.projects.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wide bg-[var(--bg-primary)]/50">
                      Projects ({results.projects.length})
                    </div>
                    {results.projects.map((project, index) => {
                      const globalIndex = results.issues.length + index;
                      const isSelected = globalIndex === selectedIndex;

                      return (
                        <button
                          key={project._id}
                          onClick={() => handleSelect("project", project)}
                          className={`w-full flex items-center gap-4 px-4 py-4 text-left transition-colors ${
                            isSelected
                              ? "bg-[var(--accent-primary)]/10"
                              : "hover:bg-[var(--hover-bg)]"
                          }`}
                        >
                          <FolderKanban className="w-4 h-4 text-[var(--accent-primary)] flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <span className="text-[var(--text-primary)] text-sm font-medium">
                              {project.name}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[var(--text-tertiary)] text-xs">
                                {project.team?.name}
                              </span>
                              <span
                                className={`text-xs px-2 py-1 rounded border ${
                                  project.status === "Active"
                                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                                    : project.status === "Archived"
                                      ? "bg-gray-500/20 text-gray-400 border-gray-500/30"
                                      : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                }`}
                              >
                                {project.status}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* No Results */}
                {query.trim().length > 0 &&
                  !loading &&
                  results.issues.length === 0 &&
                  results.projects.length === 0 && (
                    <div className="px-4 py-8 text-center">
                      <p className="text-gray-500 text-sm">
                        No results found for &quot;{query}&quot;
                      </p>
                    </div>
                  )}

                {/* Empty State */}
                {query.trim().length === 0 && (
                  <div className="px-4 py-8 text-center">
                    <Search className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">
                      Start typing to search...
                    </p>
                    <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-600">
                      <span>↑↓ to navigate</span>
                      <span>↵ to select</span>
                      <span>esc to close</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GlobalSearch;
