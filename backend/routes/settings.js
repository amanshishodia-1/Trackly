import express from "express";
import User from "../models/User.js";
import Team from "../models/Team.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// GET /api/settings/profile - Get user profile settings
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      name: user.name,
      email: user.email,
      timezone: user.timezone || "UTC",
      defaultStartPage: user.defaultStartPage || "inbox",
      theme: user.theme || "system",
      density: user.density || "comfortable",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/settings/profile - Update user profile settings
router.patch("/profile", protect, async (req, res) => {
  try {
    console.log(
      "PATCH /api/settings/profile - User:",
      req.user._id,
      "Body:",
      req.body,
    );
    const { name, timezone, defaultStartPage } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update allowed fields
    if (name !== undefined) user.name = name;
    if (timezone !== undefined) user.timezone = timezone;
    if (defaultStartPage !== undefined)
      user.defaultStartPage = defaultStartPage;

    await user.save();
    console.log("Profile updated successfully for user:", req.user._id);

    res.json({
      name: user.name,
      email: user.email,
      timezone: user.timezone,
      defaultStartPage: user.defaultStartPage,
      theme: user.theme,
      density: user.density,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/settings/appearance - Get appearance settings
router.get("/appearance", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      theme: user.theme || "system",
      density: user.density || "comfortable",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/settings/appearance - Update appearance settings
router.patch("/appearance", protect, async (req, res) => {
  try {
    const { theme, density } = req.body;
    console.log(
      "PATCH /api/settings/appearance - User:",
      req.user._id,
      "Body:",
      req.body,
    );

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update allowed fields
    if (theme !== undefined) user.theme = theme;
    if (density !== undefined) user.density = density;

    await user.save();
    console.log("Appearance updated successfully:", {
      theme: user.theme,
      density: user.density,
    });

    res.json({
      theme: user.theme,
      density: user.density,
    });
  } catch (error) {
    console.error("Appearance update error:", error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/settings/notifications - Get notification settings
router.get("/notifications", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const notifications = user.notifications || {};
    res.json({
      issueAssigned: notifications.issueAssigned !== false,
      mentions: notifications.mentions !== false,
      invites: notifications.invites !== false,
      projectUpdates: notifications.projectUpdates !== false,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/settings/teams - Get teams user belongs to with roles
router.get("/teams", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find all teams where user is a member
    const teams = await Team.find({ "members.user": req.user._id })
      .select("name members description")
      .lean();

    // Map teams to include user's role
    const teamsWithRole = teams.map((team) => {
      const memberInfo = team.members.find(
        (m) => m.user.toString() === req.user._id.toString(),
      );
      return {
        _id: team._id,
        name: team.name,
        description: team.description,
        role: memberInfo?.role || "Member",
        joinedAt: memberInfo?.joinedAt,
      };
    });

    res.json(teamsWithRole);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/settings/notifications - Update notification settings
router.patch("/notifications", protect, async (req, res) => {
  try {
    const { issueAssigned, mentions, invites, projectUpdates } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Initialize notifications object if not exists
    if (!user.notifications) {
      user.notifications = {};
    }

    // Update allowed fields
    if (issueAssigned !== undefined)
      user.notifications.issueAssigned = issueAssigned;
    if (mentions !== undefined) user.notifications.mentions = mentions;
    if (invites !== undefined) user.notifications.invites = invites;
    if (projectUpdates !== undefined)
      user.notifications.projectUpdates = projectUpdates;

    await user.save();

    res.json({
      issueAssigned: user.notifications.issueAssigned,
      mentions: user.notifications.mentions,
      invites: user.notifications.invites,
      projectUpdates: user.notifications.projectUpdates,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/settings/password - Change user password
router.patch("/password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    console.log("PATCH /api/settings/password - User:", req.user._id);
    console.log("Request body keys:", Object.keys(req.body));
    console.log(
      "currentPassword exists:",
      !!currentPassword,
      "newPassword exists:",
      !!newPassword,
    );

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current password and new password are required" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    console.log("Password changed successfully for user:", req.user._id);
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
