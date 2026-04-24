import { Crown, MoreVertical, Trash2 } from 'lucide-react';
import { useState } from 'react';

const MemberCard = ({ member, currentUserId, canManageTeams, onRemoveMember }) => {
  const [showActions, setShowActions] = useState(false);

  const handleRemoveMember = () => {
    if (window.confirm(`Are you sure you want to remove ${member.user.name} from the team?`)) {
      onRemoveMember(member.user._id);
    }
    setShowActions(false);
  };

  const isCurrentUser = member.user._id === currentUserId;
  const isAdmin = member.role === 'Admin';
  const isLead = member.role === 'lead';

  return (
    <div className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-8 h-8 bg-gradient-to-br from-[#5E6AD2] to-[#8C98F2] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
          <span className="text-white font-semibold text-xs leading-none">
            {member.user.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")}
          </span>
        </div>
        
        {/* Member Info */}
        <div>
          <div className="flex items-center gap-2">
            <p className="text-[#E8E8E8] text-[13px] font-medium leading-none">
              {member.user.name}
              {isCurrentUser && (
                <span className="text-[#8A8F98] text-[11px] ml-2">(You)</span>
              )}
            </p>
            {(isAdmin || isLead) && (
              <Crown className="w-3.5 h-3.5 text-yellow-400" />
            )}
          </div>
          <p className="text-[#8A8F98] text-[11px] mt-1">{member.user.email}</p>
        </div>
      </div>

      {/* Role and Actions */}
      <div className="flex items-center gap-4">
        {/* Role Badge */}
        <span
          className={`inline-flex items-center px-2 py-1 rounded-[4px] text-[11px] font-medium border ${
            isAdmin || isLead
              ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
              : member.role === 'Member'
              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
              : "bg-gray-500/10 text-gray-400 border-gray-500/20"
          }`}
        >
          {member.role}
        </span>

        {/* Actions Menu */}
        {canManageTeams && !isCurrentUser && (
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-1 text-[#8A8F98] hover:text-[#E8E8E8] transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {showActions && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowActions(false)}
                />
                
                {/* Dropdown */}
                <div className="absolute right-0 top-8 bg-[#161922] border border-[#1F2328] rounded-lg shadow-lg z-20 min-w-[150px]">
                  <button
                    onClick={handleRemoveMember}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberCard;
