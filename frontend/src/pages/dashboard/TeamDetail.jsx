import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTeams } from "../../context/TeamsContext";
import { useAuth } from "../../context/AuthContext";
import { useProjects } from "../../context/ProjectContext";
import { useSocket } from "../../context/SocketContext";
import api from "../../lib/axios";
import InviteModal from "../../components/InviteModal";
import MemberCard from "../../components/MemberCard";
import CreateIssueModal from "../../components/CreateIssueModal";
import {
  Hash,
  Users,
  FolderKanban,
  CircleDot,
  ArrowLeft,
  Settings,
  UserPlus,
  Crown,
  Trash2,
  LogOut,
  LayoutGrid,
  List,
  ArrowUpDown,
  Check,
} from "lucide-react";
import KanbanBoard from "../../components/KanbanBoard";
import { motion } from "framer-motion";

const TeamDetail = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { user, canCreateIssues, canManageTeams } = useAuth();
  const {
    currentTeam,
    fetchTeam,
    joinTeam,
    removeMember,
    deleteTeam,
    loading,
  } = useTeams();
  const {
    joinTeam: joinTeamSocket,
    leaveTeam: leaveTeamSocket,
    onIssueCreated,
    onIssueUpdated,
    onIssueDeleted,
  } = useSocket();
  const [activeTab, setActiveTab] = useState("issues");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [issues, setIssues] = useState([]);
  const [issuesLoading, setIssuesLoading] = useState(false);
  const [issuesView, setIssuesView] = useState("kanban"); // 'list' or 'kanban'
  const [filterOpen, setFilterOpen] = useState(true);
  const [sortBy, setSortBy] = useState("newest"); // 'newest', 'priority', 'status'
  const [showSortMenu, setShowSortMenu] = useState(false);

  const { projects, fetchProjects } = useProjects();

  // Check if user can manage this team (lead or admin)
  const canManageThisTeam = () => {
    if (canManageTeams) return true; // Workspace admin

    if (!currentTeam?.members || !user?.id) return false;

    const userMember = currentTeam.members.find(
      (member) => member.user._id === user.id || member.user === user.id,
    );

    return (
      userMember &&
      (userMember.role === "lead" ||
        userMember.role === "Lead" ||
        userMember.role === "Admin")
    );
  };

  const getProcessedIssues = useCallback(() => {
    let processed = [...issues];
    
    // Filter
    if (filterOpen) {
      processed = processed.filter(i => i.status !== "Done");
    }
    
    // Sort
    processed.sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "priority") {
        const priorityMap = { 'Urgent': 4, 'High': 3, 'Medium': 2, 'Low': 1, 'None': 0 };
        return (priorityMap[b.priority] || 0) - (priorityMap[a.priority] || 0);
      }
      if (sortBy === "status") return a.status.localeCompare(b.status);
      return 0;
    });
    
    return processed;
  }, [issues, filterOpen, sortBy]);

  const filteredIssues = getProcessedIssues();

  const fetchTeamIssues = useCallback(async () => {
    if (!teamId) return;

    setIssuesLoading(true);
    try {
      const res = await api.get(`/teams/${teamId}/issues`);
      setIssues(res.data || []);
    } catch (err) {
      console.error("Failed to fetch team issues:", err);
      setIssues([]);
    } finally {
      setIssuesLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    if (teamId) {
      fetchTeam(teamId);
      fetchTeamIssues();
      fetchProjects(teamId);
    }
  }, [teamId, fetchTeam, fetchProjects, fetchTeamIssues]);

  // Socket.IO: Join team room and listen for real-time updates
  useEffect(() => {
    if (teamId) {
      joinTeamSocket(teamId);

      // Listen for new issues
      const unsubscribeCreated = onIssueCreated((newIssue) => {
        console.log("Socket: Issue created:", newIssue);
        setIssues((prev) => [newIssue, ...prev]);
      });

      // Listen for updated issues
      const unsubscribeUpdated = onIssueUpdated((updatedIssue) => {
        console.log("Socket: Issue updated:", updatedIssue);
        setIssues((prev) =>
          prev.map((issue) =>
            issue._id === updatedIssue._id ? updatedIssue : issue,
          ),
        );
      });

      // Listen for deleted issues
      const unsubscribeDeleted = onIssueDeleted(({ issueId }) => {
        console.log("Socket: Issue deleted:", issueId);
        setIssues((prev) => prev.filter((issue) => issue._id !== issueId));
      });

      return () => {
        leaveTeamSocket(teamId);
        unsubscribeCreated();
        unsubscribeUpdated();
        unsubscribeDeleted();
      };
    }
  }, [
    teamId,
    joinTeamSocket,
    leaveTeamSocket,
    onIssueCreated,
    onIssueUpdated,
    onIssueDeleted,
  ]);

  const isMember = currentTeam?.members?.some((m) => m.user._id === user?.id);
  const isLead = currentTeam?.members?.some(
    (m) => m.user._id === user?.id && m.role === "lead",
  );

  const handleJoin = async () => {
    try {
      await joinTeam(teamId);
    } catch (err) {
      console.error("Failed to join team:", err);
    }
  };

  const handleLeave = async () => {
    try {
      await removeMember(teamId, user.id);
    } catch (err) {
      console.error("Failed to leave team:", err);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this team?")) {
      try {
        await deleteTeam(teamId);
        navigate("/app/teams");
      } catch (err) {
        console.error("Failed to delete team:", err);
      }
    }
  };

  const tabs = [
    { id: "issues", label: "Issues", icon: CircleDot },
    { id: "projects", label: "Projects", icon: FolderKanban },
    { id: "members", label: "Members", icon: Users },
  ];

  if (loading || !currentTeam) {
    return (
      <div className="animate-pulse space-y-8 mt-2">
        <div className="w-24 h-4 bg-white/[0.04] rounded-[4px]" />
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/[0.04] rounded-xl" />
            <div className="space-y-4">
              <div className="w-48 h-7 bg-white/[0.04] rounded-[4px]" />
              <div className="w-32 h-4 bg-white/[0.04] rounded-[4px]" />
            </div>
          </div>
          <div className="w-32 h-9 bg-white/[0.04] rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-white/[0.04] rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => navigate("/app/teams")}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 mt-1 md:mt-0 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back to teams</span>
      </button>

      {/* Team Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center">
            <span className="text-purple-400 font-bold text-xl">
              {currentTeam.key}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {currentTeam.name}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {currentTeam.description || "No description"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {!isMember ? (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleJoin}
              className="btn-primary"
            >
              <UserPlus className="w-4 h-4" />
              Join Team
            </motion.button>
          ) : (
            <>
              {canManageThisTeam() && (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowInviteModal(true)}
                  className="btn-primary"
                >
                  <UserPlus className="w-4 h-4" />
                  Invite Member
                </motion.button>
              )}
              <button className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-[#1A1D24] transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              {canManageTeams ? (
                <button
                  onClick={handleDelete}
                  className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleLeave}
                  className="text-gray-400 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/[0.02] rounded-md border border-white/[0.06] p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <CircleDot className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-xl font-bold text-white">
                {issues.filter((i) => i.status !== "Done").length}
              </p>
              <p className="text-gray-400 text-sm">Open Issues</p>
            </div>
          </div>
        </div>
        <div className="bg-white/[0.02] rounded-md border border-white/[0.06] p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <FolderKanban className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-xl font-bold text-white">{projects.length}</p>
              <p className="text-gray-400 text-sm">Projects</p>
            </div>
          </div>
        </div>
        <div className="bg-white/[0.02] rounded-md border border-white/[0.06] p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <Users className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-xl font-bold text-white">
                {currentTeam.members?.length || 0}
              </p>
              <p className="text-gray-400 text-sm">Members</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#1F2328] mb-6">
        <nav className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                  ? "text-purple-400 border-purple-400"
                  : "text-gray-400 border-transparent hover:text-gray-200"
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white/[0.02] rounded-md border border-white/[0.06] shadow-sm overflow-hidden">
        {activeTab === "issues" && (
          <div className="p-4">
            {issuesLoading ? (
              <div className="flex flex-col w-full">
                {[1, 2, 3].map((i) => (
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
            ) : issues.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center mb-4 shadow-sm">
                  <CircleDot className="w-5 h-5 text-[#8A8F98]" />
                </div>
                <h3 className="text-[#E8E8E8] text-[15px] font-medium mb-1">
                  No issues yet
                </h3>
                <p className="text-[#8A8F98] text-[13px] max-w-sm mb-4">
                  There are no issues assigned to this team.
                </p>
                {canCreateIssues && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-secondary"
                  >
                    Create first issue
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* View Toggle & Filters */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400 text-sm">
                      {filteredIssues.length} issues
                    </span>
                    
                    <div className="flex items-center bg-[#0F1115] border border-[var(--border-primary)] rounded-lg p-0.5 shadow-sm">
                      <button 
                        onClick={() => setFilterOpen(false)}
                        className={`px-3 py-1 text-[11px] font-medium rounded-md transition-all ${!filterOpen ? 'bg-white/5 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        All
                      </button>
                      <button 
                        onClick={() => setFilterOpen(true)}
                        className={`px-3 py-1 text-[11px] font-medium rounded-md transition-all ${filterOpen ? 'bg-white/5 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        Open
                      </button>
                    </div>

                    <div className="relative">
                      <button 
                        onClick={() => setShowSortMenu(!showSortMenu)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-lg border transition-all text-[11px] font-medium ${
                          showSortMenu 
                            ? "border-indigo-500/50 bg-indigo-500/5 text-indigo-400" 
                            : "border-[var(--border-primary)] bg-[#0F1115] text-gray-400 hover:text-gray-200"
                        }`}
                      >
                        <ArrowUpDown className="w-3 h-3" />
                        <span>Sort: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}</span>
                      </button>

                      {showSortMenu && (
                        <>
                          <div 
                            className="fixed inset-0 z-30" 
                            onClick={() => setShowSortMenu(false)} 
                          />
                          <div className="absolute left-0 mt-2 w-40 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl shadow-2xl py-1.5 z-40 animate-in fade-in zoom-in duration-150 origin-top-left">
                            {[
                              { id: "newest", label: "Newest First" },
                              { id: "priority", label: "Priority" },
                              { id: "status", label: "Status" },
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

                  <div className="flex items-center gap-2 bg-[#0F1115] border border-[var(--border-primary)] rounded-lg p-1 shadow-sm">
                    <button
                      onClick={() => setIssuesView("list")}
                      className={`p-2 rounded-md transition-colors ${issuesView === "list"
                          ? "bg-white/5 text-white"
                          : "text-gray-400 hover:text-gray-200"
                        }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIssuesView("kanban")}
                      className={`p-2 rounded-md transition-colors ${issuesView === "kanban"
                          ? "bg-white/5 text-white"
                          : "text-gray-400 hover:text-gray-200"
                        }`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {issuesView === "kanban" ? (
                  <KanbanBoard
                    issues={filteredIssues}
                    onStatusChange={async (issueId, newStatus) => {
                      try {
                        await api.put(`/issues/${issueId}`, {
                          status: newStatus,
                        });
                        setIssues((prev) =>
                          prev.map((i) =>
                            i._id === issueId ? { ...i, status: newStatus } : i,
                          ),
                        );
                      } catch (err) {
                        console.error("Failed to update issue status:", err);
                      }
                    }}
                  />
                ) : (
                  <div className="space-y-2">
                    {filteredIssues.map((issue) => (
                      <div
                        key={issue._id}
                        className="flex items-center gap-4 p-2 border border-transparent hover:bg-white/[0.02] hover:border-white/[0.04] rounded-md transition-colors cursor-pointer group"
                      >
                        <div className="flex-shrink-0">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-[4px] text-[11px] font-medium border ${issue.status === "Todo"
                                ? "bg-gray-500/10 text-gray-400 border-gray-500/20"
                                : issue.status === "In Progress"
                                  ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                  : "bg-green-500/10 text-green-400 border-green-500/20"
                              }`}
                          >
                            {issue.status}
                          </span>
                        </div>
                        <div className="flex-shrink-0 text-[#8A8F98] text-[11px] font-mono w-16">
                          {issue.identifier}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[#E8E8E8] text-[13px] font-medium truncate">
                            {issue.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {issue.priority && (
                            <span
                              className={`flex items-center px-2 py-1 rounded-[4px] border border-transparent group-hover:border-white/[0.06] transition-colors text-[11px] font-medium leading-none tracking-tight ${issue.priority === "Urgent"
                                  ? "text-red-400"
                                  : issue.priority === "High"
                                    ? "text-orange-400"
                                    : issue.priority === "Medium"
                                      ? "text-yellow-400"
                                      : issue.priority === "Low"
                                        ? "text-blue-400"
                                        : "text-gray-400"
                                }`}
                            >
                              {issue.priority}
                            </span>
                          )}
                          {issue.assignee && (
                            <div className="flex items-center gap-2 px-2 py-1 rounded-[4px] border border-transparent group-hover:border-white/[0.06] transition-colors">
                              <div className="w-4 h-4 bg-gradient-to-br from-[#5E6AD2] to-[#8C98F2] rounded-full flex items-center justify-center shadow-sm">
                                <span className="text-white text-[9px] font-bold">
                                  {issue.assignee.name?.charAt(0) || "?"}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === "projects" && (
          <div className="p-4">
            {projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center mb-4 shadow-sm">
                  <FolderKanban className="w-5 h-5 text-[#8A8F98]" />
                </div>
                <h3 className="text-[#E8E8E8] text-[15px] font-medium mb-1">
                  No projects yet
                </h3>
                <p className="text-[#8A8F98] text-[13px] max-w-sm mb-4">
                  There are no active projects for this team.
                </p>
                <button className="btn-secondary">Create first project</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project) => (
                  <motion.div
                    key={project._id}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.15 }}
                    className="bg-[#131518] rounded-md p-4 border border-white/[0.06] hover:bg-white/[0.02] hover:border-white/[0.12] shadow-sm cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-white font-medium">{project.name}</h3>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-[4px] text-[11px] font-medium border ${project.status === "Active"
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : project.status === "Completed"
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                              : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                          }`}
                      >
                        {project.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {project.description || "No description"}
                    </p>
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-500">Progress</span>
                        <span className="text-white font-medium">
                          {project.progress || 0}%
                        </span>
                      </div>
                      <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                        <div
                          className={`h-full ${(project.progress || 0) >= 80
                              ? "bg-green-500"
                              : (project.progress || 0) >= 50
                                ? "bg-blue-500"
                                : (project.progress || 0) >= 20
                                  ? "bg-yellow-500"
                                  : "bg-gray-500"
                            } transition-all duration-300`}
                          style={{ width: `${project.progress || 0}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{project.totalIssues || 0} issues</span>
                      <span>{project.doneIssues || 0} done</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "members" && (
          <div className="divide-y divide-white/[0.04]">
            {currentTeam.members?.map((member) => (
              <MemberCard
                key={member.user._id}
                member={member}
                currentUserId={user?.id}
                canManageTeams={canManageTeams}
                onRemoveMember={(userId) => removeMember(teamId, userId)}
              />
            ))}
            {currentTeam.members?.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center mb-4 shadow-sm">
                  <Users className="w-5 h-5 text-[#8A8F98]" />
                </div>
                <h3 className="text-[#E8E8E8] text-[15px] font-medium mb-1">
                  No members
                </h3>
                <p className="text-[#8A8F98] text-[13px]">
                  This team currently has no members.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Invite Modal - Lead and Admin only */}
      {canManageThisTeam() && (
        <InviteModal
          team={currentTeam}
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
        />
      )}

      {/* Create Issue Modal - Admin and Member only */}
      {canCreateIssues && (
        <CreateIssueModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          defaultTeam={teamId}
          onIssueCreated={() => fetchTeamIssues()}
        />
      )}
    </div>
  );
};

export default TeamDetail;
