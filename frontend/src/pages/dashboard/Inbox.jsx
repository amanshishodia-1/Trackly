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
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading invitations...</p>
          </div>
        ) : invitations.length === 0 ? (
          <div className="p-12 text-center">
            <UserPlus className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No pending invitations</p>
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
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        Accept
                      </button>
                      <button
                        onClick={() => handleDecline(invitation._id)}
                        className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
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
