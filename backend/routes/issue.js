import express from "express";
import Issue from "../models/Issue.js";
import Team from "../models/Team.js";
import Activity from "../models/Activity.js";
import { protect, requireMember } from "../middleware/auth.js";

const router = express.Router();

// Get all issues for user's workspace
router.get("/", protect, async (req, res) => {
  try {
    const { teamId, status, assignee, project } = req.query;
    const filter = { workspaceId: req.user.workspaceId };

    if (teamId) filter.team = teamId;
    if (status) filter.status = status;
    if (assignee) filter.assignee = assignee;
    if (project) filter.project = project;

    const issues = await Issue.find(filter)
      .populate("team", "name key")
      .populate("assignee", "name email")
      .populate("project", "name")
      .populate("creator", "name")
      .sort({ createdAt: -1 });

    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single issue by ID
router.get("/:id", protect, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate("team", "name key")
      .populate("assignee", "name email")
      .populate("project", "name")
      .populate("creator", "name");

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // Check authorization
    if (issue.workspaceId.toString() !== req.user.workspaceId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new issue - Admin and Member can create
router.post("/", protect, requireMember, async (req, res) => {
  try {
    const { title, description, teamId, priority, assignee, project, labels } =
      req.body;

    console.log("Creating issue with teamId:", teamId);

    // Verify team exists and user is member
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const isMember = team.members.some(
      (m) => m.user.toString() === req.user._id.toString(),
    );
    if (!isMember) {
      return res
        .status(403)
        .json({ message: "Not authorized to create issues in this team" });
    }

    const issue = await Issue.create({
      title,
      description: description || "",
      team: teamId, // Maps to team field in Issue model
      priority: priority || "No priority",
      assignee: assignee && assignee !== "" ? assignee : null,
      project: project && project !== "" ? project : null,
      labels: labels || [],
      workspaceId: req.user.workspaceId,
      creator: req.user._id,
    });

    await issue.populate("team", "name key");
    await issue.populate("assignee", "name email");
    await issue.populate("creator", "name");

    // Log activity for issue creation
    await Activity.create({
      issueId: issue._id,
      action: "created",
      user: req.user._id,
    });

    console.log("Created issue:", {
      _id: issue._id,
      identifier: issue.identifier,
      team: issue.team,
    });

    // Emit socket event for new issue
    const io = req.app.get("io");
    io.to(`team_${teamId}`).emit("issue_created", issue);

    res.status(201).json(issue);
  } catch (error) {
    console.error("Error creating issue:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// Update issue - Admin and Member can update
router.put("/:id", protect, requireMember, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    if (issue.workspaceId.toString() !== req.user.workspaceId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, description, status, priority, assignee, project, labels } =
      req.body;

    // Track changes for activity log
    const activities = [];

    if (title !== undefined && title !== issue.title) {
      activities.push({
        issueId: issue._id,
        action: "title_changed",
        user: req.user._id,
        oldValue: issue.title,
        newValue: title,
      });
      issue.title = title;
    }

    if (description !== undefined && description !== issue.description) {
      activities.push({
        issueId: issue._id,
        action: "description_changed",
        user: req.user._id,
      });
      issue.description = description;
    }

    if (status !== undefined && status !== issue.status) {
      activities.push({
        issueId: issue._id,
        action: "status_changed",
        user: req.user._id,
        oldValue: issue.status,
        newValue: status,
      });
      issue.status = status;
    }

    if (priority !== undefined && priority !== issue.priority) {
      activities.push({
        issueId: issue._id,
        action: "priority_changed",
        user: req.user._id,
        oldValue: issue.priority,
        newValue: priority,
      });
      issue.priority = priority;
    }

    if (assignee !== undefined && assignee !== issue.assignee?.toString()) {
      activities.push({
        issueId: issue._id,
        action: "assignee_changed",
        user: req.user._id,
        oldValue: issue.assignee?.toString() || null,
        newValue: assignee || null,
      });
      issue.assignee = assignee;
    }

    if (project !== undefined) issue.project = project;
    if (labels !== undefined) issue.labels = labels;

    await issue.save();

    // Log all activities
    if (activities.length > 0) {
      await Activity.insertMany(activities);
    }
    await issue.populate("team", "name key");
    await issue.populate("assignee", "name email");
    await issue.populate("project", "name");

    // Emit socket event for issue update
    const io = req.app.get("io");
    io.to(`team_${issue.team}`).emit("issue_updated", issue);
    io.to(`issue_${issue._id}`).emit("issue_updated", issue);

    // Emit activity events
    if (activities.length > 0) {
      io.to(`issue_${issue._id}`).emit("activities_updated", activities);
    }

    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete issue
router.delete("/:id", protect, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    if (issue.workspaceId.toString() !== req.user.workspaceId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Only creator or team lead can delete
    const team = await Team.findById(issue.team);
    const isLead = team?.members.some(
      (m) => m.user.toString() === req.user._id.toString() && m.role === "lead",
    );

    if (issue.creator.toString() !== req.user._id.toString() && !isLead) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this issue" });
    }

    // Get teamId before deletion for socket emit
    const teamId = issue.team;
    const issueId = issue._id;

    await Issue.findByIdAndDelete(req.params.id);

    // Emit socket event for issue deletion
    const io = req.app.get("io");
    io.to(`team_${teamId}`).emit("issue_deleted", { issueId });
    io.to(`issue_${issueId}`).emit("issue_deleted", { issueId });

    res.json({ message: "Issue deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get my assigned issues
router.get("/my/assigned", protect, async (req, res) => {
  try {
    const issues = await Issue.find({
      assignee: req.user._id,
      workspaceId: req.user.workspaceId,
    })
      .populate("team", "name key")
      .populate("project", "name")
      .sort({ createdAt: -1 });

    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get issues created by me
router.get("/my/created", protect, async (req, res) => {
  try {
    const issues = await Issue.find({
      creator: req.user._id,
      workspaceId: req.user.workspaceId,
    })
      .populate("team", "name key")
      .populate("assignee", "name email")
      .populate("project", "name")
      .sort({ createdAt: -1 });

    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
