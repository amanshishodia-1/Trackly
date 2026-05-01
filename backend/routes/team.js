import express from "express";
import crypto from "crypto";
import Team from "../models/Team.js";
import Issue from "../models/Issue.js";
import Invite from "../models/Invite.js";
import {
  protect,
  requireAdmin,
  requireMember,
  requireTeamLeadOrAdmin,
} from "../middleware/auth.js";

const router = express.Router();

// Get all teams for current user (where user is a member)
router.get("/", protect, async (req, res) => {
  try {
    console.log("=== TEAMS API DEBUG ===");
    console.log("User ID:", req.user._id);
    console.log("User Email:", req.user.email);
    console.log("Workspace ID:", req.user.workspaceId);

    const teams = await Team.find({
      "members.user": req.user._id,
    })
      .populate("members.user", "name email")
      .populate("workspaceId", "name")
      .sort({ createdAt: -1 });

    console.log("Teams found:", teams.length);
    console.log(
      "Team IDs:",
      teams.map((t) => ({
        id: t._id,
        name: t.name,
        members: t.members.map((m) => ({
          userId: m.user._id,
          userEmail: m.user.email,
        })),
      })),
    );
    console.log("=====================");

    res.json(teams);
  } catch (error) {
    console.error("Teams API error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get single team by ID
router.get("/:id", protect, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate("members.user", "name email")
      .populate("workspaceId", "name");

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Check if user belongs to same workspace
    if (team.workspaceId._id.toString() !== req.user.workspaceId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new team - Any authenticated user
router.post("/", protect, async (req, res) => {
  try {
    // Any authenticated user can create a team

    const { name, key, description } = req.body;

    // Check if key already exists in workspace
    const existingTeam = await Team.findOne({
      key: key.toUpperCase(),
      workspaceId: req.user.workspaceId,
    });

    if (existingTeam) {
      return res
        .status(400)
        .json({ message: "Team with this key already exists" });
    }

    const team = await Team.create({
      name,
      key: key.toUpperCase(),
      workspaceId: req.user.workspaceId,
      description: description || "",
      members: [
        {
          user: req.user._id,
          role: "lead",
        },
      ],
    });

    await team.populate("members.user", "name email");
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update team - Admin only
router.put("/:id", protect, requireAdmin, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Check if user is team lead or workspace owner
    const isLead = team.members.some(
      (m) => m.user.toString() === req.user._id.toString() && m.role === "lead",
    );

    if (
      !isLead &&
      team.workspaceId.toString() !== req.user.workspaceId.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    team.name = req.body.name || team.name;
    team.description =
      req.body.description !== undefined
        ? req.body.description
        : team.description;

    await team.save();
    await team.populate("members.user", "name email");

    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete team - Admin only
router.delete("/:id", protect, requireAdmin, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Check if user is team lead
    const isLead = team.members.some(
      (m) => m.user.toString() === req.user._id.toString() && m.role === "lead",
    );

    if (!isLead) {
      return res
        .status(403)
        .json({ message: "Only team lead can delete team" });
    }

    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: "Team deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Join team (add member)
router.post("/:id/join", protect, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Check if user belongs to same workspace
    if (team.workspaceId.toString() !== req.user.workspaceId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Check if already a member
    const isMember = team.members.some(
      (m) => m.user.toString() === req.user._id.toString(),
    );

    if (isMember) {
      return res.status(400).json({ message: "Already a member of this team" });
    }

    team.members.push({
      user: req.user._id,
      role: "member",
    });

    await team.save();
    await team.populate("members.user", "name email");

    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove member from team
router.post("/:id/remove-member", protect, async (req, res) => {
  try {
    const { userId } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Check if requester is lead
    const isLead = team.members.some(
      (m) => m.user.toString() === req.user._id.toString() && m.role === "lead",
    );

    if (!isLead && userId !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    team.members = team.members.filter((m) => m.user.toString() !== userId);
    await team.save();
    await team.populate("members.user", "name email");

    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get issues for a team
router.get("/:teamId/issues", protect, async (req, res) => {
  try {
    const { teamId } = req.params;

    // Verify team exists
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Check user is team member
    const isMember = team.members.some(
      (m) => m.user.toString() === req.user._id.toString(),
    );
    if (!isMember) {
      return res
        .status(403)
        .json({ message: "Not authorized to view team issues" });
    }

    const issues = await Issue.find({ team: teamId })
      .populate("assignee", "name email")
      .populate("creator", "name")
      .populate("project", "name")
      .sort({ createdAt: -1 });

    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send invite to team - Lead and Admin only
router.post(
  "/:teamId/invite",
  protect,
  requireTeamLeadOrAdmin,
  async (req, res) => {
    try {
      const { email, role } = req.body;
      const { teamId } = req.params;

      // Validate email
      if (!email || !email.includes("@")) {
        return res.status(400).json({ message: "Valid email is required" });
      }

      // Validate role
      if (!role || !["Admin", "Member", "Viewer"].includes(role)) {
        return res
          .status(400)
          .json({ message: "Role must be 'Admin', 'Member', or 'Viewer'" });
      }

      // Check if team exists and user has access
      const team = await Team.findById(teamId);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }

      if (team.workspaceId.toString() !== req.user.workspaceId.toString()) {
        return res
          .status(403)
          .json({ message: "Not authorized to invite to this team" });
      }

      // Check if user is already a member
      const existingMember = team.members.find(
        (m) => m.user.email === email.toLowerCase(),
      );
      if (existingMember) {
        return res
          .status(400)
          .json({ message: "User is already a member of this team" });
      }

      // Check for existing pending invite (block duplicates)
      console.log("=== DEBUG: Checking for duplicate invite ===");
      console.log("Email:", email.toLowerCase());
      console.log("Team ID:", teamId);

      // More precise query to avoid false positives
      const existingInvite = await Invite.findOne({
        $and: [
          {
            $or: [
              { email: email.toLowerCase() },
              { recipientEmail: email.toLowerCase() },
            ],
          },
          {
            $or: [{ teamId: teamId }, { team: teamId }],
          },
          { status: { $in: ["pending", "Pending"] } },
          { expiresAt: { $gt: new Date() } },
        ],
      });

      console.log("Existing invite found:", existingInvite);
      console.log("========================================");

      if (existingInvite) {
        return res.status(400).json({
          message: "An invite for this email is already pending for this team",
          debug: {
            existingInviteId: existingInvite._id,
            existingInviteStatus: existingInvite.status,
            existingInviteEmail: existingInvite.email,
            existingInviteRecipientEmail: existingInvite.recipientEmail,
            existingInviteTeamId: existingInvite.teamId,
            existingInviteTeam: existingInvite.team,
            queryEmail: email.toLowerCase(),
            queryTeamId: teamId,
          },
        });
      }

      // Generate invite token
      console.log("Creating invite token...");
      const token = crypto.randomBytes(32).toString("hex");
      console.log("Token generated successfully");

      // Create invite with required fields
      console.log("Creating invite document...");
      const invite = await Invite.create({
        recipientEmail: email.toLowerCase(),
        sender: req.user._id,
        team: teamId,
        role: role,
        status: "Pending",
        type: "team_invite",
        workspaceId: req.user.workspaceId,
        invitedBy: req.user._id,
        token: token,
        email: email.toLowerCase(), // Keep for backward compatibility
        teamId: teamId, // Keep for backward compatibility
      });
      console.log("Invite created successfully:", invite._id);

      // Populate invite details for response
      console.log("Populating invite details...");
      await invite.populate("team", "name key");
      console.log("Team populated");
      await invite.populate("sender", "name email");
      console.log("Sender populated");
      await invite.populate("invitedBy", "name email");
      console.log("InvitedBy populated");

      // TODO: Send email with invite link (implement email service later)
      const frontendUrl = process.env.CLIENT_URL || "http://localhost:5173";
      console.log(`Invite link: ${frontendUrl}/invite/${token}`);

      res.status(201).json({
        message: "Invite sent successfully",
        invite: {
          _id: invite._id,
          recipientEmail: invite.recipientEmail,
          role: invite.role,
          team: invite.team,
          sender: invite.sender,
          status: invite.status,
          type: invite.type,
          createdAt: invite.createdAt,
          expiresAt: invite.expiresAt,
        },
      });
    } catch (error) {
      console.error("=== ERROR SENDING INVITE ===");
      console.error("Error details:", error);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      console.error("Request data:", {
        email: req.body?.email,
        role: req.body?.role,
        teamId: req.params?.teamId,
        user: req.user?._id,
      });
      console.error("===========================");

      res.status(500).json({
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  },
);

// Get team members
router.get("/:teamId/members", protect, async (req, res) => {
  try {
    console.log("=== TEAM MEMBERS API DEBUG ===");
    console.log("Team ID:", req.params.teamId);
    console.log("User ID:", req.user._id);
    console.log("User Email:", req.user.email);

    const { teamId } = req.params;

    const team = await Team.findById(teamId)
      .populate("members.user", "name email")
      .select("members");

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    console.log("Team workspace ID:", team.workspaceId);
    console.log("User workspace ID:", req.user.workspaceId);

    if (team.workspaceId.toString() !== req.user.workspaceId.toString()) {
      console.log("WORKSPACE ACCESS DENIED");
      return res
        .status(403)
        .json({ message: "Not authorized to access this team" });
    }

    console.log(
      "Team members:",
      team.members.map((m) => ({
        userId: m.user._id,
        userEmail: m.user.email,
      })),
    );

    // Check if user is a member of this team
    const isMember = team.members.some(
      (member) => member.user._id.toString() === req.user._id.toString(),
    );

    console.log("Is user a member:", isMember);

    if (!isMember) {
      console.log("TEAM MEMBER ACCESS DENIED");
      return res.status(403).json({ message: "Not a member of this team" });
    }

    console.log("ACCESS GRANTED - returning team members");

    res.json(team.members);
  } catch (error) {
    console.error("Error fetching team members:", error);
    res.status(500).json({ message: error.message });
  }
});

// Leave a team (remove self as member)
router.post("/:teamId/leave", protect, async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Check if user is a member
    const isMember = team.members.some(
      (member) => member.user.toString() === req.user._id.toString(),
    );

    if (!isMember) {
      return res
        .status(400)
        .json({ message: "You are not a member of this team" });
    }

    // Remove user from members
    team.members = team.members.filter(
      (member) => member.user.toString() !== req.user._id.toString(),
    );

    await team.save();

    res.json({ message: "Left team successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Test route to verify team lead permissions
router.get(
  "/:teamId/test-permission",
  protect,
  requireTeamLeadOrAdmin,
  async (req, res) => {
    res.json({ message: "Team lead permissions working!", user: req.user });
  },
);

export default router;
