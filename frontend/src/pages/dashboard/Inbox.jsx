import { useState, useEffect } from "react";
import {
  Bell,
  Check,
  Clock,
  MessageSquare,
  Users,
  X,
  UserPlus,
} from "lucide-react";
import api from "../../lib/axios";
import { useTeams } from "../../context/TeamsContext";

const Inbox = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchTeamMembers, getTeamMembers } = useTeams();

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const response = await api.get("/inbox");
      setInvitations(response.data);
    } catch (error) {
      console.error("Error fetching invitations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (inviteId) => {
    try {
      // Find the invitation to get team ID
      const invitation = invitations.find((inv) => inv._id === inviteId);

      const response = await api.post(`/inbox/accept/${inviteId}`);

      // Refetch inbox to get updated list (pending invite disappears)
      await fetchInvitations();

      // Refresh team members to show the new member (updates assignee dropdown)
      if (invitation?.team?._id) {
        await fetchTeamMembers(invitation.team._id);
        // Alternative: Use more efficient members-only fetch
        // await getTeamMembers(invitation.team._id);
      }
    } catch (error) {
      console.error("Error accepting invitation:", error);
    }
  };

  const handleDecline = async (inviteId) => {
    try {
      await api.post(`/inbox/decline/${inviteId}`);

      // Refetch inbox to get updated list (declined invite disappears)
      await fetchInvitations();
    } catch (error) {
      console.error("Error declining invitation:", error);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  const getIcon = (type) => {
    switch (type) {
      case "issue":
        return (
          <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
            <Bell className="w-4 h-4 text-blue-400" />
          </div>
        );
      case "comment":
        return (
          <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-green-400" />
          </div>
        );
      case "reminder":
        return (
          <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
            <Clock className="w-4 h-4 text-yellow-400" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Inbox</h1>
          <p className="text-gray-400 mt-1">
            Team invitations and notifications
          </p>
        </div>
      </div>

      <div className="bg-[#161922] rounded-xl border border-[#1F2328]">
        {loading ? (
          <div className="flex flex-col w-full">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4 p-4 border-b border-white/[0.04] last:border-0">
                <div className="w-8 h-8 rounded-full bg-white/[0.04] animate-pulse flex-shrink-0" />
                <div className="flex-1">
                  <div className="w-1/3 h-4 rounded-[4px] bg-white/[0.04] animate-pulse mb-2" />
                  <div className="w-1/4 h-3 rounded-[4px] bg-white/[0.04] animate-pulse mb-4" />
                  <div className="flex gap-2">
                    <div className="w-20 h-7 rounded-md bg-white/[0.04] animate-pulse" />
                    <div className="w-20 h-7 rounded-md bg-white/[0.04] animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : invitations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center mb-4 shadow-sm">
              <UserPlus className="w-5 h-5 text-[#8A8F98]" />
            </div>
            <h3 className="text-[#E8E8E8] text-[15px] font-medium mb-1">Inbox zero</h3>
            <p className="text-[#8A8F98] text-[13px] max-w-sm">
              You don't have any pending team invitations.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#1F2328]">
            {invitations.map((invitation) => (
              <div
                key={invitation._id}
                className="p-4 hover:bg-[#1A1D24] transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-medium">
                        {invitation.sender?.name || "Someone"} invited you to{" "}
                        {invitation.team?.name}
                      </h3>
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">
                      Role: {invitation.role} •{" "}
                      {formatTime(invitation.createdAt)}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAccept(invitation._id)}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        Accept
                      </button>
                      <button
                        onClick={() => handleDecline(invitation._id)}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
