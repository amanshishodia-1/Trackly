import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  issueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Issue",
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: ["created", "status_changed", "assignee_changed", "priority_changed", "title_changed", "description_changed"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  oldValue: {
    type: String,
    default: null,
  },
  newValue: {
    type: String,
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient querying
activitySchema.index({ issueId: 1, timestamp: -1 });

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
