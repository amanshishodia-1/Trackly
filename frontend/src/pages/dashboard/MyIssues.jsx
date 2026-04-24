import { useState, useEffect } from "react";
import { useIssues } from "../../context/IssueContext";
import { useAuth } from "../../context/AuthContext";
import {
  CircleDot,
  Calendar,
  Filter,
  Search,
  User,
  PenTool,
  Bell,
  Clock,
  ChevronDown,
} from "lucide-react";

const TABS = [
  { id: "assigned", label: "Assigned", icon: User },
  { id: "created", label: "Created", icon: PenTool },
  { id: "subscribed", label: "Subscribed", icon: Bell },
  { id: "activity", label: "Activity", icon: Clock },
];

const MyIssues = () => {
  const { user } = useAuth();
  const { fetchIssues, fetchMyAssigned, fetchMyCreated, issues, loading } =
    useIssues();
  const [activeTab, setActiveTab] = useState("assigned");
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadIssues();
  }, [activeTab]);

  useEffect(() => {
    filterIssues();
  }, [issues, searchQuery, statusFilter]);

  const loadIssues = async () => {
    switch (activeTab) {
      case "assigned":
        await fetchMyAssigned();
        break;
      case "created":
        await fetchMyCreated();
        break;
      case "subscribed":
        // For subscribed, fetch all and filter (placeholder)
        await fetchIssues();
        break;
      case "activity":
        // For activity, fetch recent updates (placeholder)
        await fetchIssues();
        break;
      default:
        await fetchMyAssigned();
    }
  };

  const filterIssues = () => {
    let filtered = [...issues];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (issue) =>
          issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          issue.identifier?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((issue) => issue.status === statusFilter);
    }

    setFilteredIssues(filtered);
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

  const getPriorityIcon = (priority) => {
    const color = getPriorityColor(priority);
    return (
      <svg
        className={`w-4 h-4 ${color}`}
        viewBox="0 0 16 16"
        fill="currentColor"
      >
        {priority === "Urgent" && <polygon points="8,0 16,16 0,16" />}
        {priority === "High" && (
          <rect x="2" y="2" width="12" height="12" transform="rotate(45 8 8)" />
        )}
        {priority === "Medium" && <rect x="3" y="3" width="10" height="10" />}
        {priority === "Low" && <circle cx="8" cy="8" r="5" />}
        {priority === "No priority" && <circle cx="8" cy="8" r="3" />}
      </svg>
    );
  };

  return (
    <div className="h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-white">My Issues</h1>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1A1D24] hover:bg-[#2D3139] text-gray-400 hover:text-white rounded-lg text-sm transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-[#1F2328]">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-4 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Filters Row */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search issues..."
            className="w-full bg-[#0F1115] border border-[#1F2328] rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-purple-500 transition-colors"
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none bg-[#0F1115] border border-[#1F2328] rounded-lg py-2 pl-4 pr-10 text-sm text-white focus:border-purple-500 transition-colors cursor-pointer"
          >
            <option value="all">All statuses</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Issues List */}
      <div className="bg-[#161922] rounded-xl border border-[#1F2328] overflow-hidden">
        {loading ? (
          <div className="flex flex-col w-full">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-4 py-4 border-b border-white/[0.04] last:border-0"
              >
                <div className="w-16 h-5 rounded-[4px] bg-white/[0.04] animate-pulse" />
                <div className="w-12 h-4 rounded-[4px] bg-white/[0.04] animate-pulse" />
                <div className="flex-1 h-4 rounded-[4px] bg-white/[0.04] animate-pulse" />
                <div className="w-20 h-5 rounded-[4px] bg-white/[0.04] animate-pulse" />
                <div className="w-6 h-6 rounded-full bg-white/[0.04] animate-pulse ml-auto" />
              </div>
            ))}
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center mb-4 shadow-sm">
              <CircleDot className="w-5 h-5 text-[#8A8F98]" />
            </div>
            <h3 className="text-[#E8E8E8] text-[15px] font-medium mb-1">
              No issues found
            </h3>
            <p className="text-[#8A8F98] text-[13px] max-w-sm">
              {searchQuery
                ? "Try adjusting your search or filters to find what you're looking for."
                : "You don't have any issues in this view yet."}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1F2328] bg-[#0F1115]">
                <th className="text-left py-4 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">
                  Issue
                </th>
                <th className="text-left py-4 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider w-32">
                  Status
                </th>
                <th className="text-left py-4 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider w-28">
                  Priority
                </th>
                <th className="text-left py-4 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">
                  Team
                </th>
                <th className="text-left py-4 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredIssues.map((issue) => (
                <tr
                  key={issue._id}
                  className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group cursor-pointer"
                >
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                        {getPriorityIcon(issue.priority)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[#E8E8E8] font-medium text-[13px] truncate">
                          {issue.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[#8A8F98] text-[11px] font-mono">
                            {issue.identifier}
                          </span>
                          {issue.labels?.length > 0 && (
                            <span className="text-[#8A8F98] text-[11px]">
                              +{issue.labels.length} labels
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-[4px] text-[11px] font-medium border ${getStatusColor(issue.status).replace("bg-", "bg-opacity-10 bg-").replace("border-", "border-opacity-20 border-")}`}
                    >
                      {issue.status}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <div
                      className={`flex items-center gap-1 w-fit px-2 py-1 rounded-[4px] border border-transparent group-hover:border-white/[0.06] transition-colors ${getPriorityColor(issue.priority)}`}
                    >
                      {getPriorityIcon(issue.priority)}
                      <span className="text-[11px] font-medium leading-none tracking-tight">
                        {issue.priority}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-2 w-fit px-2 py-1 rounded-[4px] border border-transparent group-hover:border-white/[0.06] transition-colors">
                      <div className="w-4 h-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded flex items-center justify-center">
                        <span className="text-purple-400 text-[9px] font-bold">
                          {issue.team?.key?.charAt(0) || "?"}
                        </span>
                      </div>
                      <span className="text-[#8A8F98] text-[11px] font-medium">
                        {issue.team?.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 px-4 text-[#8A8F98] text-[11px] font-medium">
                    {new Date(issue.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MyIssues;
