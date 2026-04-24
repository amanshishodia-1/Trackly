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
  MoreVertical,
  LayoutGrid,
  List,
} from "lucide-react";
import KanbanBoard from "../../components/KanbanBoard";

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

  const fetchTeamIssues = useCallback(async () => {
    if (!teamId) return;

    setIssuesLoading(true);
    try {
      console.log("Fetching issues for team:", teamId);
      const res = await api.get(`/teams/${teamId}/issues`);
      console.log("Issues response:", res.data);
      console.log("Issues type:", typeof res.data);
      console.log("Is array:", Array.isArray(res.data));
      console.log(
        "Issues count:",
        Array.isArray(res.data) ? res.data.length : "not array",
      );
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
        navigate("/teams");
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => navigate("/teams")}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
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

        <div className="flex items-center gap-3">
          {!isMember ? (
            <button
              onClick={handleJoin}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Join Team
            </button>
          ) : (
            <>
              {canManageThisTeam() && (
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Invite Member
                </button>
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
        <div className="bg-[#161922] rounded-xl border border-[#1F2328] p-4">
          <div className="flex items-center gap-3">
            <CircleDot className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-xl font-bold text-white">0</p>
              <p className="text-gray-400 text-sm">Open Issues</p>
            </div>
          </div>
        </div>
        <div className="bg-[#161922] rounded-xl border border-[#1F2328] p-4">
          <div className="flex items-center gap-3">
            <FolderKanban className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-xl font-bold text-white">0</p>
              <p className="text-gray-400 text-sm">Projects</p>
            </div>
          </div>
        </div>
        <div className="bg-[#161922] rounded-xl border border-[#1F2328] p-4">
          <div className="flex items-center gap-3">
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
              className={`flex items-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
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
      <div className="bg-[#161922] rounded-xl border border-[#1F2328]">
        {activeTab === "issues" && (
          <div className="p-4">
            {issuesLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500" />
              </div>
            ) : issues.length === 0 ? (
              <div className="p-8 text-center">
                <CircleDot className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No issues yet</p>
                {canCreateIssues && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="mt-4 text-purple-400 hover:text-purple-300 font-medium"
                  >
                    Create first issue
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* View Toggle */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400 text-sm">
                    {issues.length} issues
                  </span>
                  <div className="flex items-center gap-2 bg-[#0F1115] rounded-lg p-1">
                    <button
                      onClick={() => setIssuesView("list")}
                      className={`p-2 rounded-md transition-colors ${
                        issuesView === "list"
                          ? "bg-[#1A1D24] text-white"
                          : "text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIssuesView("kanban")}
                      className={`p-2 rounded-md transition-colors ${
                        issuesView === "kanban"
                          ? "bg-[#1A1D24] text-white"
                          : "text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {issuesView === "kanban" ? (
                  <KanbanBoard
                    issues={issues}
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
                    {issues.map((issue) => (
                      <div
                        key={issue._id}
                        className="flex items-center gap-3 p-3 hover:bg-[#1A1D24] rounded-lg transition-colors cursor-pointer"
                      >
                        <div className="flex-shrink-0">
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full border ${
                              issue.status === "Todo"
                                ? "bg-gray-500/20 text-gray-400 border-gray-500/30"
                                : issue.status === "In Progress"
                                  ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                  : "bg-green-500/20 text-green-400 border-green-500/30"
                            }`}
                          >
                            {issue.status}
                          </span>
                        </div>
                        <div className="flex-shrink-0 text-gray-500 text-sm font-mono">
                          {issue.identifier}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">
                            {issue.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {issue.priority && (
                            <span
                              className={`text-xs ${
                                issue.priority === "Urgent"
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
                            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-semibold">
                                {issue.assignee.name?.charAt(0) || "?"}
                              </span>
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
              <div className="p-8 text-center">
                <FolderKanban className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No projects yet</p>
                <button className="mt-4 text-purple-400 hover:text-purple-300 font-medium">
                  Create first project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    className="bg-[#0F1115] rounded-lg p-4 border border-[#1F2328] hover:border-purple-500/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-white font-medium">{project.name}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          project.status === "Active"
                            ? "bg-green-500/20 text-green-400"
                            : project.status === "Completed"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {project.description || "No description"}
                    </p>
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-500">Progress</span>
                        <span className="text-white font-medium">
                          {project.progress || 0}%
                        </span>
                      </div>
                      <div className="h-2 bg-[#1A1D24] rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            (project.progress || 0) >= 80
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
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "members" && (
          <div className="divide-y divide-[#1F2328]">
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
              <div className="p-8 text-center text-gray-400">
                No members yet
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
