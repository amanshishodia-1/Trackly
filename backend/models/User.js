import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      default: null,
    },
    role: {
      type: String,
      enum: ["Admin", "Member", "Viewer"],
      default: "Member",
    },
    timezone: {
      type: String,
      default: "UTC",
    },
    defaultStartPage: {
      type: String,
      enum: ["inbox", "my-issues", "projects", "teams"],
      default: "inbox",
    },
    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "system",
    },
    density: {
      type: String,
      enum: ["compact", "comfortable"],
      default: "comfortable",
    },
    notifications: {
      issueAssigned: { type: Boolean, default: true },
      mentions: { type: Boolean, default: true },
      invites: { type: Boolean, default: true },
      projectUpdates: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
