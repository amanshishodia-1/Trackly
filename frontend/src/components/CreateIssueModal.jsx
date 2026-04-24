import { useState, useEffect } from "react";
import { useTeams } from "../context/TeamsContext";
import { useIssues } from "../context/IssueContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  AlertCircle,
  Check,
  Loader2,
  Tag,
  User,
  Folder,
  Flag,
  Layers,
} from "lucide-react";

const PRIORITIES = ["No priority", "Low", "Medium", "High", "Urgent"];
const STATUSES = ["Todo", "In Progress", "Done"];

const PRIORITY_COLORS = {
  "No priority": "text-gray-400",
  Low: "text-blue-400",
  Medium: "text-yellow-400",
  High: "text-orange-400",
  Urgent: "text-red-400",
};

const CreateIssueModal = ({
  isOpen,
  onClose,
  defaultTeam = null,
  onIssueCreated,
}) => {
  const { teams, fetchTeams } = useTeams();
  const { createIssue, loading } = useIssues();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    teamId: defaultTeam || "",
    priority: "No priority",
    status: "Todo",
    assignee: "",
    project: "",
    labels: [],
  });
  const [labelInput, setLabelInput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  useEffect(() => {
    if (defaultTeam) {
      setFormData((prev) => ({ ...prev, teamId: defaultTeam }));
    }
  }, [defaultTeam]);

  // Removed early return to allow AnimatePresence to handle exit animations

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!formData.teamId) {
      setError("Please select a team");
      return;
    }

    try {
      const newIssue = await createIssue({
        title: formData.title.trim(),
        description: formData.description.trim(),
        teamId: formData.teamId,
        priority: formData.priority,
        status: formData.status,
        assignee: formData.assignee || null,
        project: formData.project || null,
        labels: formData.labels,
      });
      setSuccess(true);

      // Call callback to refetch issues list
      if (onIssueCreated) {
        onIssueCreated(newIssue);
      }

      setTimeout(() => {
        setSuccess(false);
        onClose();
        // Reset form
        setFormData({
          title: "",
          description: "",
          teamId: defaultTeam || "",
          priority: "No priority",
          status: "Todo",
          assignee: "",
          project: "",
          labels: [],
        });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create issue");
    }
  };

  const handleAddLabel = (e) => {
    if (e.key === "Enter" && labelInput.trim()) {
      e.preventDefault();
      if (!formData.labels.includes(labelInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          labels: [...prev.labels, labelInput.trim()],
        }));
      }
      setLabelInput("");
    }
  };

  const removeLabel = (labelToRemove) => {
    setFormData((prev) => ({
      ...prev,
      labels: prev.labels.filter((l) => l !== labelToRemove),
    }));
  };

  const selectedTeam = teams.find((t) => t._id === formData.teamId);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-[8vh]"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="bg-[#131518] rounded-xl border border-white/[0.08] w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/[0.04]">
          <h2 className="text-[15px] font-semibold text-[#E8E8E8]">New Issue</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        {success && (
          <div className="mx-4 mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2 text-green-400">
            <Check className="w-4 h-4" />
            <span className="text-sm">Issue created successfully!</span>
          </div>
        )}
        {error && (
          <div className="mx-4 mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Title */}
          <div>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Issue title"
              className="w-full bg-transparent text-white text-lg font-medium placeholder-gray-500 focus:outline-none"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Add description..."
              rows={4}
              className="w-full bg-transparent text-gray-300 text-sm placeholder-gray-500 focus:outline-none resize-none"
            />
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Team */}
            <div className="bg-white/[0.02] rounded-md p-4 border border-white/[0.04]">
              <label className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <Layers className="w-3 h-3" />
                Team
              </label>
              <select
                value={formData.teamId}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, teamId: e.target.value }))
                }
                className="w-full bg-transparent text-white text-sm focus:outline-none"
              >
                <option value="">Select team...</option>
                {teams.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="bg-white/[0.02] rounded-md p-4 border border-white/[0.04]">
              <label className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <Flag className="w-3 h-3" />
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full bg-transparent text-white text-sm focus:outline-none"
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div className="bg-white/[0.02] rounded-md p-4 border border-white/[0.04]">
              <label className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <Flag className="w-3 h-3" />
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, priority: e.target.value }))
                }
                className="w-full bg-transparent text-sm focus:outline-none"
              >
                {PRIORITIES.map((priority) => (
                  <option
                    key={priority}
                    value={priority}
                    className={PRIORITY_COLORS[priority]}
                  >
                    {priority}
                  </option>
                ))}
              </select>
            </div>

            {/* Assignee */}
            <div className="bg-white/[0.02] rounded-md p-4 border border-white/[0.04]">
              <label className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <User className="w-3 h-3" />
                Assignee
              </label>
              <select
                value={formData.assignee}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, assignee: e.target.value }))
                }
                className="w-full bg-transparent text-white text-sm focus:outline-none"
              >
                <option value="">No assignee</option>
                {selectedTeam?.members?.map((member) => (
                  <option
                    key={member.user._id || member.user}
                    value={member.user._id || member.user}
                  >
                    {member.user?.name || member.user?.email || "Unknown"}
                  </option>
                ))}
              </select>
            </div>

            {/* Project */}
            <div className="bg-[#0F1115] rounded-lg p-4 col-span-2">
              <label className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <Folder className="w-3 h-3" />
                Project (optional)
              </label>
              <input
                type="text"
                value={formData.project}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, project: e.target.value }))
                }
                placeholder="Select or create project..."
                className="w-full bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Labels */}
          <div className="bg-[#0F1115] rounded-lg p-4">
            <label className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <Tag className="w-3 h-3" />
              Labels
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.labels.map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs"
                >
                  {label}
                  <button
                    type="button"
                    onClick={() => removeLabel(label)}
                    className="hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={labelInput}
              onChange={(e) => setLabelInput(e.target.value)}
              onKeyDown={handleAddLabel}
              placeholder="Add label (press Enter)"
              className="w-full bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-4 pt-4 mt-2 border-t border-white/[0.04]">
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Create Issue"
              )}
            </motion.button>
          </div>
        </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateIssueModal;
