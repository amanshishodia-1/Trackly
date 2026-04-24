import express from "express";
import Issue from "../models/Issue.js";
import Project from "../models/Project.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Global search across issues and projects
router.get("/", protect, async (req, res) => {
  try {
    const { q } = req.query;
    const workspaceId = req.user.workspaceId;

    if (!q || q.trim().length === 0) {
      return res.json({ issues: [], projects: [] });
    }

    const searchRegex = new RegExp(q.trim(), "i");

    // Search issues by title
    const issues = await Issue.find({
      workspaceId,
      title: { $regex: searchRegex },
    })
      .populate("team", "name key")
      .populate("assignee", "name email")
      .limit(10)
      .sort({ updatedAt: -1 });

    // Search projects by name
    const projects = await Project.find({
      workspaceId,
      name: { $regex: searchRegex },
    })
      .populate("team", "name key")
      .limit(5)
      .sort({ updatedAt: -1 });

    res.json({ issues, projects });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
