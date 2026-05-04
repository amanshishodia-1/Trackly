import { useEffect, useState } from "react";
import { useProjects } from "../../context/ProjectContext";
import { useTeams } from "../../context/TeamsContext";
import {
  FolderKanban,
  Plus,
  MoreHorizontal,
  CheckCircle2,
  Circle,
  Loader2,
  AlertCircle,
  X,
  Target,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Projects = () => {
  const { projects, loading, error, fetchProjects, createProject } =
    useProjects();
  const { teams } = useTeams();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    teamId: "",
  });

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateProject = async (name, description, teamId) => {
    try {
      await createProject({ name, description, teamId });
      setShowCreateModal(false);
    } catch (err) {
      console.error("Failed to create project:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-500/20 text-green-400";
      case "Completed":
        return "bg-blue-500/20 text-blue-400";
      case "Archived":
        return "bg-gray-500/20 text-gray-400";
      default:
        return "bg-yellow-500/20 text-yellow-400";
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 20) return "bg-yellow-500";
    return "bg-gray-500";
  };

  if (loading && projects.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] p-5 shadow-sm"
          >
            <div className="flex items-start justify-between mb-5">
              <div className="w-10 h-10 bg-[var(--skeleton-bg)] rounded-xl animate-pulse" />
              <div className="w-4 h-4 bg-[var(--skeleton-bg)] rounded animate-pulse" />
            </div>
            <div className="w-2/3 h-5 bg-[var(--skeleton-bg)] rounded-[4px] animate-pulse mb-2" />
            <div className="w-full h-4 bg-[var(--skeleton-bg)] rounded-[4px] animate-pulse mb-1.5" />
            <div className="w-4/5 h-4 bg-[var(--skeleton-bg)] rounded-[4px] animate-pulse mb-6" />

            <div className="w-full h-1.5 bg-[var(--skeleton-bg)] rounded-full animate-pulse mb-6" />

            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-primary)]">
              <div className="w-1/4 h-4 bg-[var(--skeleton-bg)] rounded-[4px] animate-pulse" />
              <div className="w-16 h-5 bg-[var(--skeleton-bg)] rounded-full animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">Projects</h1>
          <p className="text-[var(--text-tertiary)] text-[13px] mt-0.5">Manage and track your workspace projects</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <motion.div
            key={project._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] p-5 hover:border-[var(--accent-primary)]/50 transition-all cursor-pointer group shadow-sm"
          >
            <div className="flex items-start justify-between mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center">
                <FolderKanban className="w-5 h-5 text-[var(--accent-primary)]" />
              </div>
              <button className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors p-1 rounded-md hover:bg-[var(--hover-bg)]">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-[var(--text-primary)] font-semibold text-[15px] mb-1.5 group-hover:text-[var(--accent-primary)] transition-colors">
              {project.name}
            </h3>
            <p className="text-[var(--text-tertiary)] text-[13px] mb-6 line-clamp-2 min-h-[40px]">
              {project.description || "No description provided for this project."}
            </p>

            {/* Progress Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-[12px] mb-2">
                <span className="text-[var(--text-tertiary)] font-medium">Progress</span>
                <span className="text-[var(--text-primary)] font-semibold">
                  {project.progress || 0}%
                </span>
              </div>
              <div className="h-1.5 bg-[var(--hover-bg)] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress || 0}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`h-full ${getProgressColor(project.progress || 0)}`}
                />
              </div>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500/70" />
                  <span className="text-[11px] text-[var(--text-tertiary)] font-medium">{project.doneIssues || 0} done</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-blue-500/70" />
                  <span className="text-[11px] text-[var(--text-tertiary)] font-medium">{project.totalIssues || 0} total</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-primary)]">
              <div className="flex items-center gap-2 text-[var(--text-tertiary)]">
                <Users className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium truncate max-w-[100px]">
                  {project.team?.name}
                </span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(project.status)}`}
              >
                {project.status}
              </span>
            </div>
          </motion.div>
        ))}

        {projects.length === 0 && !loading && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center bg-[var(--bg-secondary)] border border-dashed border-[var(--border-primary)] rounded-2xl">
            <div className="w-12 h-12 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-primary)] flex items-center justify-center mb-4 shadow-sm">
              <FolderKanban className="w-5 h-5 text-[var(--text-tertiary)]" />
            </div>
            <h3 className="text-[var(--text-primary)] text-[15px] font-medium mb-1">
              No projects yet
            </h3>
            <p className="text-[var(--text-tertiary)] text-[13px] max-w-sm mb-6">
              Organize your issues into projects to track progress and hit milestones.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-secondary"
            >
              <Plus className="w-4 h-4" />
              Create your first project
            </button>
          </div>
        )}

        {/* Add New Project Card */}
        {!loading && projects.length > 0 && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="border border-dashed border-[var(--border-primary)] rounded-xl p-6 flex flex-col items-center justify-center text-[var(--text-tertiary)] hover:border-[var(--accent-primary)]/50 hover:bg-[var(--hover-bg)] hover:text-[var(--accent-primary)] transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-[var(--bg-primary)] border border-[var(--border-primary)] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-[13px] font-medium">Add Project</span>
          </button>
        )}
      </div>

      {/* Create Project Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex items-start justify-center z-50 p-4 pt-[10vh]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-primary)]">
                <h2 className="text-[15px] font-semibold text-[var(--text-primary)]">
                  Create New Project
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-[#8A8F98] hover:text-white transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label>Project Name</label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) =>
                      setNewProject({ ...newProject, name: e.target.value })
                    }
                    placeholder="Enter project name..."
                    className="input-field"
                    autoFocus
                  />
                </div>

                <div>
                  <label>Description</label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        description: e.target.value,
                      })
                    }
                    placeholder="What's this project about?"
                    rows={3}
                    className="input-field py-3 h-auto resize-none"
                  />
                </div>

                <div>
                  <label>Team</label>
                  <div className="relative">
                    <select
                      value={newProject.teamId}
                      onChange={(e) =>
                        setNewProject({ ...newProject, teamId: e.target.value })
                      }
                      className="input-field appearance-none"
                    >
                      <option value="">Select a team</option>
                      {teams.map((team) => (
                        <option key={team._id} value={team._id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#8A8F98]">
                      <Plus className="w-3.5 h-3.5 rotate-45" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (newProject.name && newProject.teamId) {
                        handleCreateProject(
                          newProject.name,
                          newProject.description,
                          newProject.teamId,
                        );
                        setNewProject({ name: "", description: "", teamId: "" });
                      }
                    }}
                    disabled={!newProject.name || !newProject.teamId}
                    className="flex-1 btn-primary"
                  >
                    Create Project
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
