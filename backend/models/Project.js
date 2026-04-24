import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
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
  },
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Archived'],
    default: 'Active'
  }
}, {
  timestamps: true
});

// Index for queries
projectSchema.index({ team: 1 });
projectSchema.index({ workspaceId: 1 });

// Virtual for progress percentage
projectSchema.virtual('progress').get(function() {
  return this.totalIssues > 0 ? Math.round((this.doneIssues / this.totalIssues) * 100) : 0;
});

// Virtual for total issues count
projectSchema.virtual('totalIssues', {
  ref: 'Issue',
  localField: '_id',
  foreignField: 'project',
  count: true
});

// Virtual for done issues count
projectSchema.virtual('doneIssues', {
  ref: 'Issue',
  localField: '_id',
  foreignField: 'project',
  count: true,
  match: { status: 'Done' }
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
