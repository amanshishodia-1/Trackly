import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Team from "../models/Team.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallbacksecret",
    );
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Role-based access control middleware
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied. Insufficient permissions." });
    }

    next();
  };
};

// Specific permission middlewares
export const requireAdmin = requireRole("Admin");

// Check if user is workspace admin or team lead
export const requireTeamLeadOrAdmin = async (req, res, next) => {
  try {
    console.log("=== requireTeamLeadOrAdmin DEBUG ===");
    console.log("User:", req.user);
    console.log("User role:", req.user.role);
    console.log("Params:", req.params);
    console.log("================================");

    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Workspace admins can always invite
    if (req.user.role === "Admin") {
      console.log("Workspace admin - granting permission");
      return next();
    }

    // Check if user is a team lead
    const teamId = req.params.teamId;
    if (!teamId) {
      return res.status(400).json({ message: "Team ID required" });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const userMember = team.members.find(
      (member) => member.user.toString() === req.user._id.toString(),
    );

    if (!userMember) {
      console.log("User not found in team members");
      return res.status(403).json({ message: "Not a member of this team" });
    }

    console.log("User role:", userMember.role);
    console.log("User ID:", req.user._id);
    console.log(
      "Team members:",
      team.members.map((m) => ({ user: m.user, role: m.role })),
    );

    // Check for both old and new role formats
    if (
      userMember.role === "lead" ||
      userMember.role === "Admin" ||
      userMember.role === "Lead"
    ) {
      console.log("Permission granted for role:", userMember.role);
      return next();
    }

    return res.status(403).json({
      message: "Only team leads and admins can send invites",
      debug: {
        userRole: userMember.role,
        userId: req.user._id,
        teamId: teamId,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const requireMember = requireRole("Admin", "Member"); // Admin and Member can create issues
export const requireViewer = requireRole("Admin", "Member", "Viewer"); // All can view
