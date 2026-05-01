import { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useInvites } from "../context/InviteContext";
import {
  Mail,
  Users,
  ArrowRight,
  Check,
  X,
  AlertCircle,
  Loader2,
} from "lucide-react";

const AcceptInvite = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { getInviteByToken, acceptInvite, declineInvite, loading } =
    useInvites();
  const [invite, setInvite] = useState(null);
  const [error, setError] = useState("");
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const fetchInvite = async () => {
      try {
        const data = await getInviteByToken(token);
        setInvite(data);
      } catch (err) {
        setError(err.response?.data?.message || "Invite not found or expired");
      }
    };
    fetchInvite();
  }, [token, getInviteByToken]);

  const handleAccept = async () => {
    try {
      await acceptInvite(token);
      setAccepted(true);
      setTimeout(() => {
        navigate("/app/teams");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to accept invite");
    }
  };

  const handleDecline = async () => {
    try {
      await declineInvite(token);
      navigate("/app/teams");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to decline invite");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F1115]">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  // If no user is logged in, redirect to login with return URL
  if (!user) {
    return <Navigate to={`/login?redirect=/invite/${token}`} replace />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F1115] px-4">
        <div className="bg-[#161922] rounded-xl border border-[#1F2328] p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Invite Error
          </h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate("/teams")}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Go to Teams
          </button>
        </div>
      </div>
    );
  }

  if (accepted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F1115] px-4">
        <div className="bg-[#161922] rounded-xl border border-[#1F2328] p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">You're in!</h2>
          <p className="text-gray-400 mb-6">
            You've successfully joined {invite?.teamId?.name}
          </p>
          <button
            onClick={() => navigate("/teams")}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Go to Teams
          </button>
        </div>
      </div>
    );
  }

  if (!invite) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F1115]">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F1115] px-4">
      <div className="bg-[#161922] rounded-xl border border-[#1F2328] p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-purple-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Team Invitation
          </h2>
          <p className="text-gray-400">You've been invited to join a team</p>
        </div>

        {/* Invite Details */}
        <div className="bg-[#0F1115] rounded-lg p-4 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <span className="text-purple-400 font-bold text-sm">
                {invite.teamId?.key}
              </span>
            </div>
            <div>
              <h3 className="text-white font-medium">{invite.teamId?.name}</h3>
              <p className="text-gray-500 text-sm">{invite.teamId?.key}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-4 h-4" />
              <span>Invited by {invite.invitedBy?.name}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                {invite.role}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={handleAccept}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Accept Invitation
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <button
            onClick={handleDecline}
            disabled={loading}
            className="w-full bg-transparent hover:bg-[#1A1D24] text-gray-400 font-medium py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Decline
          </button>
        </div>

        {/* Note */}
        <p className="text-center text-gray-500 text-xs mt-6">
          This invite will expire in 7 days
        </p>
      </div>
    </div>
  );
};

export default AcceptInvite;
