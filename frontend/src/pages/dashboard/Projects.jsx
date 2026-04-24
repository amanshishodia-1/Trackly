import { useEffect, useState } from "react";
import { useProjects } from "../../context/ProjectContext";
import {
  FolderKanban,
  Plus,
  MoreHorizontal,
  CheckCircle2,
  Circle,
  Loader2,
  AlertCircle,
} from "lucide-react";

const Projects = () => {
  const { projects, loading, error, fetchProjects, createProject } =
    useProjects();
  const [showCreateModal, setShowCreateModal] = useState(false);

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#131518] rounded-xl border border-white/[0.06] p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-white/[0.04] rounded-xl animate-pulse" />
              <div className="w-5 h-5 bg-white/[0.04] rounded animate-pulse" />
            </div>
            <div className="w-3/4 h-6 bg-white/[0.04] rounded-[4px] animate-pulse mb-4" />
            <div className="w-full h-4 bg-white/[0.04] rounded-[4px] animate-pulse mb-2" />
            <div className="w-5/6 h-4 bg-white/[0.04] rounded-[4px] animate-pulse mb-6" />
            <div className="w-full h-2 bg-white/[0.04] rounded-full animate-pulse mb-4" />
            <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
              <div className="w-1/3 h-4 bg-white/[0.04] rounded-[4px] animate-pulse" />
              <div className="w-16 h-5 bg-white/[0.04] rounded-full animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-gray-400 mt-1">Manage your workspace projects</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project._id}
            className="bg-[#161922] rounded-xl border border-[#1F2328] p-6 hover:border-purple-500/30 transition-colors cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <FolderKanban className="w-6 h-6 text-white" />
              </div>
              <button className="text-gray-500 hover:text-white transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-purple-400 transition-colors">
              {project.name}
            </h3>
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {project.description || "No description"}
            </p>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-400">Progress</span>
                <span className="text-white font-medium">
                  {project.progress || 0}%
                </span>
              </div>
              <div className="h-2 bg-[#0F1115] rounded-full overflow-hidden">
                <div
                  className={`h-full ${getProgressColor(project.progress || 0)} transition-all duration-300`}
                  style={{ width: `${project.progress || 0}%` }}
                />
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-green-400" />
                  <span>{project.doneIssues || 0} done</span>
                </div>
                <div className="flex items-center gap-1">
                  <Circle className="w-3 h-3 text-gray-400" />
                  <span>{project.totalIssues || 0} total</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#1F2328]">
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <span className="text-xs">Team:</span>
                <span className="font-medium text-gray-300">
                  {project.team?.name}
                </span>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}
              >
                {project.status}
              </span>
            </div>
          </div>
        ))}
        
        {projects.length === 0 && !loading && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center mb-4 shadow-sm">
              <FolderKanban className="w-5 h-5 text-[#8A8F98]" />
            </div>
            <h3 className="text-[#E8E8E8] text-[15px] font-medium mb-1">No projects yet</h3>
            <p className="text-[#8A8F98] text-[13px] max-w-sm mb-4">
              Get started by creating a new project for your workspace.
            </p>
          </div>
        )}

        {/* Add New Project Card */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="border-2 border-dashed border-[#1F2328] rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:border-purple-500 hover:text-purple-400 transition-colors min-h-[200px]"
        >
          <Plus className="w-10 h-10 mb-4" />
          <span className="font-medium">Create New Project</span>
        </button>
      </div>
    </div>
  );
};

export default Projects;
