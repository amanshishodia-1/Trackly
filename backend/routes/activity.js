import express from "express";
import Activity from "../models/Activity.js";
import Comment from "../models/Comment.js";
import Issue from "../models/Issue.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Get activities for an issue
router.get("/issue/:issueId", protect, async (req, res) => {
  try {
    const { issueId } = req.params;

    // Verify issue exists and user has access
    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    if (issue.workspaceId.toString() !== req.user.workspaceId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const activities = await Activity.find({ issueId })
      .populate("user", "name email")
      .sort({ timestamp: -1 });

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get comments for an issue
router.get("/issue/:issueId/comments", protect, async (req, res) => {
  try {
    const { issueId } = req.params;

    // Verify issue exists and user has access
    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    if (issue.workspaceId.toString() !== req.user.workspaceId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const comments = await Comment.find({ issueId })
      .populate("user", "name email")
      .sort({ timestamp: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add comment to an issue
router.post("/issue/:issueId/comments", protect, async (req, res) => {
  try {
    const { issueId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Comment content is required" });
    }

    // Verify issue exists and user has access
    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    if (issue.workspaceId.toString() !== req.user.workspaceId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const comment = await Comment.create({
      issueId,
      user: req.user._id,
      content: content.trim(),
    });

    await comment.populate("user", "name email");

    // Emit socket event for new comment
    const io = req.app.get("io");
    io.to(`issue_${issueId}`).emit("comment_added", comment);
    io.to(`team_${issue.team}`).emit("issue_updated", {
      _id: issueId,
      hasNewComment: true,
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete comment
router.delete("/comments/:commentId", protect, async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Only comment author can delete
    if (comment.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    const issueId = comment.issueId;

    await Comment.findByIdAndDelete(commentId);

    // Emit socket event for deleted comment
    const io = req.app.get("io");
    io.to(`issue_${issueId}`).emit("comment_deleted", { commentId });

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
