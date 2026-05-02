import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Todo', 'In Progress', 'Done'],
    default: 'Todo'
  },
  priority: {
    type: String,
    enum: ['No priority', 'Low', 'Medium', 'High', 'Urgent'],
    default: 'No priority'
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    default: null
  },
  labels: [{
    type: String,
    trim: true
  }],
  identifier: {
    type: String,
    unique: true
  },
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Generate identifier (e.g., FRO-123) before saving
issueSchema.pre('save', async function (next) {
  if (!this.isNew) return next();

  const Team = mongoose.model('Team');
  const team = await Team.findById(this.team);

  if (team) {
    // Count existing issues for this team to generate number
    const count = await mongoose.model('Issue').countDocuments({ team: this.team });
    this.identifier = `${team.key}-${count + 1}`;
  }

  next();
});

// Indexes for common queries
issueSchema.index({ team: 1, status: 1 });
issueSchema.index({ assignee: 1 });
issueSchema.index({ workspaceId: 1 });

const Issue = mongoose.model('Issue', issueSchema);
export default Issue;
