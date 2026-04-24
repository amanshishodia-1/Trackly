import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    recipientEmail: {
      type: String,
      required: true,
      lowercase: true,
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Member", "Viewer", "lead", "member"],
      default: "Member",
    },
    status: {
      type: String,
      enum: ["Pending", "pending", "accepted", "declined", "expired"],
      default: "Pending",
    },
    type: {
      type: String,
      enum: ["team_invite"],
      default: "team_invite",
      required: true,
    },
    token: {
      type: String,
      unique: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  },
  {
    timestamps: true,
  },
);

// Index for quick lookups - token is already indexed via unique: true in schema
inviteSchema.index({ email: 1, teamId: 1 });

const Invite = mongoose.model("Invite", inviteSchema);
export default Invite;
