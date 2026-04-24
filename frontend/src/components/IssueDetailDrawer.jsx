import { useState, useEffect } from "react";
import { X, MessageSquare, History, Send, Trash2 } from "lucide-react";
import api from "../lib/axios";
import { useSocket } from "../context/SocketContext";

const IssueDetailDrawer = ({ issue, isOpen, onClose, onIssueUpdated }) => {
  const [activeTab, setActiveTab] = useState("comments");
  const [comments, setComments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const {
    joinIssue,
    leaveIssue,
    onCommentAdded,
    onCommentDeleted,
    onActivitiesUpdated,
  } = useSocket();

  useEffect(() => {
    if (isOpen && issue) {
      fetchComments();
      fetchActivities();
    }
  }, [isOpen, issue?._id]);

  // Socket.IO: Join issue room and listen for real-time updates
  useEffect(() => {
    if (isOpen && issue) {
      joinIssue(issue._id);

      // Listen for new comments
      const unsubscribeComment = onCommentAdded((newComment) => {
        console.log("Socket: Comment added:", newComment);
        setComments((prev) => [newComment, ...prev]);
      });

      // Listen for deleted comments
      const unsubscribeCommentDeleted = onCommentDeleted(({ commentId }) => {
        console.log("Socket: Comment deleted:", commentId);
        setComments((prev) => prev.filter((c) => c._id !== commentId));
      });

      // Listen for activity updates
      const unsubscribeActivities = onActivitiesUpdated((newActivities) => {
        console.log("Socket: Activities updated:", newActivities);
        setActivities((prev) => [...newActivities, ...prev]);
      });

      return () => {
        leaveIssue(issue._id);
        unsubscribeComment();
        unsubscribeCommentDeleted();
        unsubscribeActivities();
      };
    }
  }, [
    isOpen,
    issue?._id,
    joinIssue,
    leaveIssue,
    onCommentAdded,
    onCommentDeleted,
    onActivitiesUpdated,
  ]);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/activity/issue/${issue._id}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  const fetchActivities = async () => {
    try {
      const res = await api.get(`/activity/issue/${issue._id}`);
      setActivities(res.data);
    } catch (err) {
      console.error("Failed to fetch activities:", err);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await api.post(`/activity/issue/${issue._id}/comments`, {
        content: newComment.trim(),
      });
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/activity/comments/${commentId}`);
      fetchComments();
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  const getActionText = (activity) => {
    const userName = activity.user?.name || "Unknown";

    switch (activity.action) {
      case "created":
        return `${userName} created this issue`;
      case "status_changed":
        return `${userName} changed status from "${activity.oldValue}" to "${activity.newValue}"`;
      case "assignee_changed":
        const oldAssignee = activity.oldValue ? "someone" : "unassigned";
        const newAssignee = activity.newValue ? "someone" : "unassigned";
        return `${userName} changed assignee from ${oldAssignee} to ${newAssignee}`;
      case "priority_changed":
        return `${userName} changed priority from "${activity.oldValue}" to "${activity.newValue}"`;
      case "title_changed":
        return `${userName} updated the title`;
      case "description_changed":
        return `${userName} updated the description`;
      default:
        return `${userName} made a change`;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Urgent":
        return "text-red-400";
      case "High":
        return "text-orange-400";
      case "Medium":
        return "text-yellow-400";
      case "Low":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Todo":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      case "In Progress":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Done":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen || !issue) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-[500px] bg-[#0F1115] border-l border-[#1F2328] z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1F2328]">
          <div className="flex items-center gap-4">
            <span className="text-gray-500 font-mono text-sm">
              {issue.identifier}
            </span>
            <button
              onClick={onClose}
              className="p-1 hover:bg-[#1A1D24] rounded-md transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Issue Info */}
        <div className="p-4 border-b border-[#1F2328]">
          <h2 className="text-white text-lg font-semibold mb-4">
            {issue.title}
          </h2>
          <div className="flex items-center gap-4 flex-wrap">
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full border ${getStatusColor(issue.status)}`}
            >
              {issue.status}
            </span>
            <span className={`text-xs ${getPriorityColor(issue.priority)}`}>
              {issue.priority}
            </span>
            {issue.assignee && (
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">
                    {issue.assignee.name?.charAt(0) || "?"}
                  </span>
                </div>
                <span className="text-gray-400 text-xs">
                  {issue.assignee.name}
                </span>
              </div>
            )}
          </div>
          {issue.description && (
            <p className="text-gray-400 text-sm mt-4">{issue.description}</p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#1F2328]">
          <button
            onClick={() => setActiveTab("comments")}
            className={`flex items-center gap-2 px-4 py-4 text-sm font-medium transition-colors ${
              activeTab === "comments"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Comments ({comments.length})
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`flex items-center gap-2 px-4 py-4 text-sm font-medium transition-colors ${
              activeTab === "activity"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <History className="w-4 h-4" />
            Activity
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "comments" ? (
            <div className="space-y-4">
              {/* Comment Input */}
              <form onSubmit={handleSubmitComment} className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 bg-[#161922] border border-[#1F2328] rounded-lg px-4 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim() || submitting}
                  className="p-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </form>

              {/* Comments List */}
              {comments.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">
                  No comments yet
                </p>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="bg-[#161922] rounded-lg p-4 border border-[#1F2328]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">
                            {comment.user?.name?.charAt(0) || "?"}
                          </span>
                        </div>
                        <span className="text-white text-sm font-medium">
                          {comment.user?.name}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {formatTimestamp(comment.timestamp)}
                        </span>
                        {comment.edited && (
                          <span className="text-gray-500 text-xs">
                            (edited)
                          </span>
                        )}
                      </div>
                      {/* Delete button - only show for own comments */}
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="p-1 hover:bg-red-500/20 rounded transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3 h-3 text-red-400" />
                      </button>
                    </div>
                    <p className="text-gray-300 text-sm mt-2 ml-8">
                      {comment.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {activities.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">
                  No activity yet
                </p>
              ) : (
                activities.map((activity) => (
                  <div key={activity._id} className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-semibold">
                        {activity.user?.name?.charAt(0) || "?"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-300 text-sm">
                        {getActionText(activity)}
                      </p>
                      <span className="text-gray-500 text-xs">
                        {formatTimestamp(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default IssueDetailDrawer;
