import express from "express";
import Workspace from "../models/Workspace.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Get current user's workspace
router.get("/me", protect, async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.user.workspaceId)
      .populate("owner", "name email")
      .populate("members", "name email");

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.json(workspace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update workspace (PUT)
router.put("/:id", protect, async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Only owner can update
    if (workspace.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    workspace.name = req.body.name || workspace.name;
    await workspace.save();

    res.json(workspace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update workspace (PATCH) - supports partial updates including defaultIssueStatuses
router.patch("/:id", protect, async (req, res) => {
  try {
    console.log(
      "PATCH /api/workspace/:id - User:",
      req.user._id,
      "Body:",
      req.body,
    );
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Only owner can update
    if (workspace.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { name, defaultIssueStatuses } = req.body;

    if (name !== undefined) workspace.name = name;
    if (defaultIssueStatuses !== undefined)
      workspace.defaultIssueStatuses = defaultIssueStatuses;

    await workspace.save();
    console.log("Workspace updated successfully:", workspace._id);

    res.json(workspace);
  } catch (error) {
    console.error("Workspace update error:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
