import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTeams } from "../../context/TeamsContext";
import { ArrowLeft, Hash, Users, FileText, AlertCircle } from "lucide-react";

const CreateTeam = () => {
  const navigate = useNavigate();
  const { createTeam, loading } = useTeams();
  const [formData, setFormData] = useState({
    name: "",
    key: "",
    description: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    console.log("Form submitted with:", formData);

    if (!formData.name.trim() || !formData.key.trim()) {
      setError("Team name and key are required");
      return;
    }

    try {
      console.log("Calling createTeam...");
      const team = await createTeam({
        name: formData.name.trim(),
        key: formData.key.trim().toUpperCase(),
        description: formData.description.trim(),
      });
      console.log("Team created:", team);
      navigate(`/teams/${team._id}`);
    } catch (err) {
      console.error("Create team error:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to create team",
      );
    }
  };

  const handleKeyChange = (e) => {
    const value = e.target.value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 5);
    setFormData((prev) => ({ ...prev, key: value }));
  };

  return (
    <div className="max-w-2xl">
      {/* Back Button */}
      <button
        onClick={() => navigate("/teams")}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back to teams</span>
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Create Team</h1>
        <p className="text-gray-400 mt-1">
          Create a new team in your workspace
        </p>
      </div>

      <div className="bg-[#161922] rounded-xl border border-[#1F2328] p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Team Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full bg-[#0F1115] border border-[#1F2328] rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-purple-500 transition-colors"
                placeholder="e.g., Frontend Team"
                required
              />
            </div>
          </div>

          {/* Team Key */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Team Key <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={formData.key}
                onChange={handleKeyChange}
                className="w-full bg-[#0F1115] border border-[#1F2328] rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-purple-500 transition-colors uppercase"
                placeholder="e.g., FRO"
                maxLength={5}
                required
              />
            </div>
            <p className="text-gray-500 text-sm mt-2">
              A unique identifier for your team (2-5 characters). Used for issue
              keys like FRO-123.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full bg-[#0F1115] border border-[#1F2328] rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-purple-500 transition-colors resize-none"
                placeholder="What does this team work on?"
                rows={4}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#1F2328]">
            <button
              type="button"
              onClick={() => navigate("/teams")}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              ) : (
                "Create Team"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeam;
