import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTeams } from "../../context/TeamsContext";
import { useAuth } from "../../context/AuthContext";
import {
  Users,
  Plus,
  Hash,
  Search,
  MoreHorizontal,
  Check,
  Filter,
  ArrowUpDown,
} from "lucide-react";

const Teams = () => {
  const { teams, fetchTeams, loading } = useTeams();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name"); // 'name', 'key', 'members'
  const [filterJoined, setFilterJoined] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const isUserMember = (team) => {
    return team.members?.some(
      (m) => m.user._id === user?.id || m.user === user?.id,
    );
  };

  const processedTeams = teams
    .filter((team) => {
      const matchesSearch =
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.key.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = !filterJoined || isUserMember(team);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "key") return a.key.localeCompare(b.key);
      if (sortBy === "members")
        return (b.members?.length || 0) - (a.members?.length || 0);
      return 0;
    });

  const filteredTeams = processedTeams;

  const getTeamIcon = (key) => {
    // Different icons/colors based on team key
    const icons = {
      AMA: { color: "bg-green-500/20", text: "text-green-400", icon: "🟢" },
      FRO: { color: "bg-blue-500/20", text: "text-blue-400", icon: "⚡" },
      DEV: { color: "bg-purple-500/20", text: "text-purple-400", icon: "🔧" },
      DES: { color: "bg-pink-500/20", text: "text-pink-400", icon: "🎨" },
    };
    return (
      icons[key] || {
        color: "bg-purple-500/20",
        text: "text-purple-400",
        icon: "#",
      }
    );
  };


  const renderAvatarStack = (members) => {
    const maxVisible = 3;
    const visibleMembers = members?.slice(0, maxVisible) || [];
    const remaining = (members?.length || 0) - maxVisible;

    return (
      <div className="flex items-center">
        <div className="flex -space-x-2">
          {visibleMembers.map((member, idx) => (
            <div
              key={idx}
              className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-medium border-2 border-[#161922]"
              title={member.user?.name || member.user?.email}
            >
              {(member.user?.name || member.user?.email || "?")
                .charAt(0)
                .toUpperCase()}
            </div>
          ))}
        </div>
        {remaining > 0 && (
          <span className="ml-2 text-gray-500 text-xs">+{remaining}</span>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-semibold text-[var(--text-primary)]">Teams</h1>
            <button className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[var(--text-tertiary)] text-sm">{filteredTeams.length} teams</p>
        </div>
        <button
          onClick={() => navigate("/app/teams/new")}
          className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[var(--text-tertiary)]" />
          <input
            type="text"
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg py-2 pl-9 pr-4 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--accent-primary)] transition-colors"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg p-0.5 shadow-sm shrink-0">
            <button 
              onClick={() => setFilterJoined(false)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${!filterJoined ? 'bg-white/5 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilterJoined(true)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filterJoined ? 'bg-white/5 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Joined
            </button>
          </div>

          <div className="relative shrink-0">
            <button 
              onClick={() => setShowSortMenu(!showSortMenu)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-xs font-medium ${
                showSortMenu 
                  ? "border-indigo-500/50 bg-indigo-500/5 text-indigo-400" 
                  : "border-[var(--border-primary)] bg-[var(--bg-secondary)] text-gray-400 hover:text-gray-200"
              }`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Sort: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}</span>
              <span className="xs:hidden">Sort</span>
            </button>

            {showSortMenu && (
              <>
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setShowSortMenu(false)} 
                />
                <div className="absolute right-0 mt-2 w-40 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl shadow-2xl py-1.5 z-40 animate-in fade-in zoom-in duration-150 origin-top-right">
                  {[
                    { id: "name", label: "Name" },
                    { id: "key", label: "Key" },
                    { id: "members", label: "Members Count" },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setSortBy(option.id);
                        setShowSortMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                        sortBy === option.id 
                          ? "text-indigo-400 bg-indigo-500/5" 
                          : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]"
                      }`}
                    >
                      {option.label}
                      {sortBy === option.id && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Teams Table/Cards */}
      {loading ? (
        <div className="flex flex-col w-full bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)] overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-4 py-4 border-b border-[var(--border-primary)] last:border-0"
            >
              <div className="flex items-center gap-4 w-1/3">
                <div className="w-6 h-6 rounded bg-[var(--skeleton-bg)] animate-pulse" />
                <div className="w-24 h-4 rounded-[4px] bg-[var(--skeleton-bg)] animate-pulse" />
              </div>
              <div className="hidden md:block w-16 h-4 rounded-[4px] bg-[var(--skeleton-bg)] animate-pulse" />
              <div className="w-16 h-6 rounded-full bg-[var(--skeleton-bg)] animate-pulse ml-4" />
              <div className="hidden sm:block w-8 h-4 rounded-[4px] bg-[var(--skeleton-bg)] animate-pulse ml-8" />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)] overflow-hidden">
          {/* Desktop View */}
          <table className="w-full hidden md:table">
            <thead>
              <tr className="border-b border-[var(--border-primary)] bg-[var(--bg-primary)]">
                <th className="text-left py-4 px-4 text-[var(--text-tertiary)] text-xs font-medium uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left py-4 px-4 text-[var(--text-tertiary)] text-xs font-medium uppercase tracking-wider">
                  Membership
                </th>
                <th className="text-left py-4 px-4 text-[var(--text-tertiary)] text-xs font-medium uppercase tracking-wider">
                  Members
                </th>
                <th className="text-left py-4 px-4 text-[var(--text-tertiary)] text-xs font-medium uppercase tracking-wider">
                  Active projects
                </th>
                <th className="py-4 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {filteredTeams.map((team) => {
                const iconStyle = getTeamIcon(team.key);
                const isMember = isUserMember(team);

                return (
                  <tr
                    key={team._id}
                    className="border-b border-[var(--border-primary)] hover:bg-[var(--hover-bg)] transition-colors cursor-pointer"
                    onClick={() => navigate(`/app/teams/${team._id}`)}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-6 h-6 ${iconStyle.color} rounded flex items-center justify-center`}
                        >
                          <span
                            className={`${iconStyle.text} text-xs font-bold`}
                          >
                            {team.key.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <span className="text-[var(--text-primary)] text-sm font-medium">
                            {team.name}
                          </span>
                          <span className="text-[var(--text-tertiary)] text-xs ml-2 font-mono">
                            {team.key}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {isMember && (
                        <span className="inline-flex items-center gap-1 text-gray-400 text-xs">
                          <Check className="w-3 h-3" />
                          Joined
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {renderAvatarStack(team.members)}
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-500 text-xs">0</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        className="text-gray-500 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Mobile View */}
          <div className="flex flex-col md:hidden divide-y divide-[var(--border-primary)]">
            {filteredTeams.map((team) => {
              const iconStyle = getTeamIcon(team.key);
              const isMember = isUserMember(team);

              return (
                <div
                  key={team._id}
                  className="p-4 hover:bg-[var(--hover-bg)] transition-colors cursor-pointer flex flex-col gap-3"
                  onClick={() => navigate(`/app/teams/${team._id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 ${iconStyle.color} rounded flex items-center justify-center flex-shrink-0`}
                      >
                        <span className={`${iconStyle.text} text-xs font-bold`}>
                          {team.key.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-[var(--text-primary)] text-[14px] font-medium leading-none">
                          {team.name}
                        </h4>
                        <span className="text-[var(--text-tertiary)] text-[11px] mt-1 block font-mono">
                          {team.key}
                        </span>
                      </div>
                    </div>
                    {isMember && (
                      <span className="inline-flex items-center gap-1 text-[var(--accent-primary)] text-[11px] font-medium bg-[var(--accent-primary)]/10 px-2 py-0.5 rounded-full border border-[var(--accent-primary)]/20">
                        Joined
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Members</span>
                        {renderAvatarStack(team.members)}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Projects</span>
                        <span className="text-gray-300 text-xs font-medium">0</span>
                      </div>
                    </div>
                    <button
                      className="p-2 text-gray-500 hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!loading && filteredTeams.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-12 h-12 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] flex items-center justify-center mb-4 shadow-sm">
            <Hash className="w-5 h-5 text-[var(--text-tertiary)]" />
          </div>
          <h3 className="text-[var(--text-primary)] text-[15px] font-medium mb-1">
            No teams found
          </h3>
          <p className="text-[var(--text-tertiary)] text-[13px] max-w-sm mb-4">
            {searchQuery
              ? "Try adjusting your search query."
              : "You haven't joined or created any teams yet."}
          </p>
          <button
            onClick={() => navigate("/app/teams/new")}
            className="btn-secondary"
          >
            Create your first team
          </button>
        </div>
      )}
    </div>
  );
};

export default Teams;
