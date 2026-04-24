import express from "express";
import crypto from "crypto";
import Invite from "../models/Invite.js";
import Team from "../models/Team.js";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Generate unique invite token
const generateToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Send invite
router.post("/", protect, async (req, res) => {
  try {
    const { email, teamId, role = "member" } = req.body;

    // Check if team exists
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Check if user is team lead or member
    const isMember = team.members.some(
      (m) => m.user.toString() === req.user._id.toString(),
    );
    if (!isMember) {
      return res
        .status(403)
        .json({ message: "Not authorized to invite to this team" });
    }

    // Check if user already in team
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const alreadyMember = team.members.some(
        (m) => m.user.toString() === existingUser._id.toString(),
      );
      if (alreadyMember) {
        return res
          .status(400)
          .json({ message: "User is already a member of this team" });
      }
    }

    // Check if pending invite already exists
    const existingInvite = await Invite.findOne({
      email: email.toLowerCase(),
      teamId,
      status: "pending",
    });

    if (existingInvite) {
      return res
        .status(400)
        .json({ message: "Pending invite already exists for this email" });
    }

    // Create invite
    const invite = await Invite.create({
      email: email.toLowerCase(),
      workspaceId: req.user.workspaceId,
      teamId,
      invitedBy: req.user._id,
      role,
      token: generateToken(),
    });

    await invite.populate("teamId", "name key");
    await invite.populate("invitedBy", "name");

    res.status(201).json(invite);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all invites sent by user
router.get("/sent", protect, async (req, res) => {
  try {
    const invites = await Invite.find({ invitedBy: req.user._id })
      .populate("teamId", "name key")
      .populate("invitedBy", "name")
      .sort({ createdAt: -1 });

    res.json(invites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get pending invites for current user (by email)
router.get("/pending", protect, async (req, res) => {
  try {
    const invites = await Invite.find({
      email: req.user.email.toLowerCase(),
      status: "pending",
    })
      .populate("teamId", "name key")
      .populate("workspaceId", "name")
      .populate("invitedBy", "name")
      .sort({ createdAt: -1 });

    res.json(invites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all pending invites for workspace (for team leads)
router.get("/team/:teamId", protect, async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const isMember = team.members.some(
      (m) => m.user.toString() === req.user._id.toString(),
    );
    if (!isMember) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const invites = await Invite.find({
      teamId: req.params.teamId,
      status: "pending",
    })
      .populate("invitedBy", "name")
      .sort({ createdAt: -1 });

    res.json(invites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Accept invite
router.post("/accept/:token", protect, async (req, res) => {
  try {
    const invite = await Invite.findOne({
      token: req.params.token,
      status: "pending",
    });

    if (!invite) {
      return res
        .status(404)
        .json({ message: "Invite not found or already processed" });
    }

    // Check if invite is for this user
    if (invite.email.toLowerCase() !== req.user.email.toLowerCase()) {
      return res
        .status(403)
        .json({ message: "This invite is for a different email address" });
    }

    // Check if expired
    if (invite.expiresAt < new Date()) {
      invite.status = "expired";
      await invite.save();
      return res.status(400).json({ message: "Invite has expired" });
    }

    // Add user to team
    const team = await Team.findById(invite.teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Check if already member
    const alreadyMember = team.members.some(
      (m) => m.user.toString() === req.user._id.toString(),
    );

    if (!alreadyMember) {
      team.members.push({
        user: req.user._id,
        role: invite.role,
      });
      await team.save();
    }

    // Update invite status
    invite.status = "accepted";
    await invite.save();

    await team.populate("members.user", "name email");
    res.json({ invite, team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Decline invite
router.post("/decline/:token", protect, async (req, res) => {
  try {
    const invite = await Invite.findOne({
      token: req.params.token,
      status: "pending",
    });

    if (!invite) {
      return res
        .status(404)
        .json({ message: "Invite not found or already processed" });
    }

    if (invite.email.toLowerCase() !== req.user.email.toLowerCase()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    invite.status = "declined";
    await invite.save();

    res.json({ message: "Invite declined", invite });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel invite
router.delete("/:id", protect, async (req, res) => {
  try {
    const invite = await Invite.findById(req.params.id);

    if (!invite) {
      return res.status(404).json({ message: "Invite not found" });
    }

    // Only inviter can cancel
    if (invite.invitedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Invite.findByIdAndDelete(req.params.id);
    res.json({ message: "Invite cancelled" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get invite by token (public, for checking invite details)
router.get("/token/:token", async (req, res) => {
  try {
    const invite = await Invite.findOne({
      token: req.params.token,
      status: "pending",
    })
      .populate("teamId", "name key")
      .populate("workspaceId", "name")
      .populate("invitedBy", "name");

    if (!invite) {
      return res.status(404).json({ message: "Invite not found or expired" });
    }

    if (invite.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invite has expired" });
    }

    res.json(invite);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Accept invite by ID
router.post("/:inviteId/accept", protect, async (req, res) => {
  try {
    const { inviteId } = req.params;

    // Find invite by ID
    const invite = await Invite.findById(inviteId)
      .populate("teamId", "name key")
      .populate("invitedBy", "name email");

    if (!invite) {
      return res.status(404).json({ message: "Invite not found" });
    }

    // Check if invite is expired
    if (invite.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invite has expired" });
    }

    // Check if invite is already processed
    if (invite.status !== "pending" && invite.status !== "Pending") {
      return res
        .status(400)
        .json({ message: "Invite has already been processed" });
    }

    // Add user to team
    const team = await Team.findById(invite.teamId._id);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Check if user is already a member
    const alreadyMember = team.members.some(
      (m) => m.user.toString() === req.user._id.toString(),
    );

    if (!alreadyMember) {
      // Add user to team using $push
      team.members.push({
        user: req.user._id,
        role: invite.role,
      });
      await team.save();
    }

    // Update invite status to "Accepted"
    invite.status = "Accepted";
    await invite.save();

    await team.populate("members.user", "name email");

    res.json({
      message: "Invite accepted successfully",
      invite,
      team,
    });
  } catch (error) {
    console.error("Error accepting invite:", error);
    res.status(500).json({ message: error.message });
  }
});

// Decline invite by ID
router.post("/:inviteId/decline", protect, async (req, res) => {
  try {
    const { inviteId } = req.params;

    // Find invite by ID
    const invite = await Invite.findById(inviteId)
      .populate("teamId", "name key")
      .populate("invitedBy", "name email");

    if (!invite) {
      return res.status(404).json({ message: "Invite not found" });
    }

    // Check if invite is expired
    if (invite.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invite has expired" });
    }

    // Check if invite is already processed
    if (invite.status !== "pending" && invite.status !== "Pending") {
      return res
        .status(400)
        .json({ message: "Invite has already been processed" });
    }

    // Update invite status to "Declined"
    invite.status = "Declined";
    await invite.save();

    res.json({
      message: "Invite declined successfully",
      invite,
    });
  } catch (error) {
    console.error("Error declining invite:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
