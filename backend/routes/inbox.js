import express from "express";
import Invite from "../models/Invite.js";
import Team from "../models/Team.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Get inbox invitations for logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const invitations = await Invite.find({
      recipientEmail: req.user.email,
      status: "Pending",
    })
      .populate("team", "name key")
      .populate("sender", "name email")
      .populate("invitedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(invitations);
  } catch (error) {
    console.error("Error fetching inbox:", error);
    res.status(500).json({ message: error.message });
  }
});

// Accept invitation
router.post("/accept/:inviteId", protect, async (req, res) => {
  try {
    console.log("=== INVITE ACCEPTANCE STARTED ===");
    console.log("Invite ID:", req.params.inviteId);
    console.log("User:", req.user.email, req.user._id);

    const { inviteId } = req.params;

    const invite = await Invite.findOne({
      _id: inviteId,
      recipientEmail: req.user.email,
      status: "Pending",
    }).populate("team");

    if (!invite) {
      return res
        .status(404)
        .json({ message: "Invite not found or already processed" });
    }

    // Check if expired
    if (invite.expiresAt < new Date()) {
      invite.status = "expired";
      await invite.save();
      return res.status(400).json({ message: "Invite has expired" });
    }

    // Add user to team
    const team = await Team.findById(invite.team._id);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Check if already member
    const alreadyMember = team.members.some(
      (m) => m.user.toString() === req.user._id.toString(),
    );

    if (!alreadyMember) {
      // Map invite role to team member role
      console.log("=== DEBUG: Role Mapping ===");
      console.log("Original invite role:", invite.role);
      console.log("Invite role type:", typeof invite.role);

      const teamRole =
        invite.role === "Member"
          ? "member"
          : invite.role === "Lead"
            ? "lead"
            : invite.role === "Admin"
              ? "lead" // Admin invites become team leads
              : "member"; // default to member

      console.log("Mapped team role:", teamRole);
      console.log("==========================");

      team.members.push({
        user: req.user._id,
        role: teamRole,
      });
      await team.save();
    }

    // Update invite status
    invite.status = "accepted";
    await invite.save();

    await team.populate("members.user", "name email");
    res.json({
      message: "Invite accepted successfully",
      team,
      invite,
    });
  } catch (error) {
    console.error("Error accepting invite:", error);
    res.status(500).json({ message: error.message });
  }
});

// Decline invitation
router.post("/decline/:inviteId", protect, async (req, res) => {
  try {
    const { inviteId } = req.params;

    const invite = await Invite.findOne({
      _id: inviteId,
      recipientEmail: req.user.email,
      status: "Pending",
    });

    if (!invite) {
      return res
        .status(404)
        .json({ message: "Invite not found or already processed" });
    }

    invite.status = "declined";
    await invite.save();

    res.json({
      message: "Invite declined",
      invite,
    });
  } catch (error) {
    console.error("Error declining invite:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
