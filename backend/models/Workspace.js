import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    defaultIssueStatuses: [
      {
        name: { type: String, required: true },
        color: { type: String, default: "#6B7280" },
        default: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Default statuses if none set
workspaceSchema.pre("save", function (next) {
  if (
    this.isNew &&
    (!this.defaultIssueStatuses || this.defaultIssueStatuses.length === 0)
  ) {
    this.defaultIssueStatuses = [
      { name: "Backlog", color: "#6B7280", default: false },
      { name: "Todo", color: "#3B82F6", default: true },
      { name: "In Progress", color: "#F59E0B", default: false },
      { name: "Done", color: "#10B981", default: false },
    ];
  }
  next();
});

const Workspace = mongoose.model("Workspace", workspaceSchema);
export default Workspace;
