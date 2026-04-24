import { useState } from "react";
import { X, Mail, UserPlus, AlertCircle, Check } from "lucide-react";
import api from "../lib/axios";

const InviteModal = ({ team, isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !team) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email.trim()) {
      setError("Please enter an email address");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/teams/${team._id}/invite`, {
        email: email.trim(),
        role: role,
      });

      setSuccess(true);
      setEmail("");
      setRole("Member");
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Error sending invite:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to send invite";

      // Handle specific error cases
      if (errorMessage.includes("already pending")) {
        setError("An invite for this email is already pending for this team");
      } else if (errorMessage.includes("already a member")) {
        setError("This user is already a member of the team");
      } else if (errorMessage.includes("authorized")) {
        setError("You are not authorized to invite members to this team");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#161922] rounded-xl border border-[#1F2328] w-full max-w-md p-6 m-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-white">Invite to team</h2>
            <p className="text-gray-400 text-sm mt-1">
              Invite members to <span className="text-white">{team.name}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2 text-green-400">
            <Check className="w-4 h-4" />
            <span className="text-sm">Invite sent successfully!</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@example.com"
                className="w-full bg-[#0F1115] border border-[#1F2328] rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:border-purple-500 transition-colors text-sm"
                required
              />
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole("Member")}
                className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-colors ${
                  role === "Member"
                    ? "bg-purple-500/20 border-purple-500 text-purple-400"
                    : "bg-[#0F1115] border-[#1F2328] text-gray-400 hover:text-white"
                }`}
              >
                Member
              </button>
              <button
                type="button"
                onClick={() => setRole("Admin")}
                className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-colors ${
                  role === "Admin"
                    ? "bg-purple-500/20 border-purple-500 text-purple-400"
                    : "bg-[#0F1115] border-[#1F2328] text-gray-400 hover:text-white"
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => setRole("Viewer")}
                className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-colors ${
                  role === "Viewer"
                    ? "bg-purple-500/20 border-purple-500 text-purple-400"
                    : "bg-[#0F1115] border-[#1F2328] text-gray-400 hover:text-white"
                }`}
              >
                Viewer
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2 text-sm"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Send invite
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteModal;
