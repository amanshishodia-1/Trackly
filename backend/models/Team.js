import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  key: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['lead', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Ensure key is unique within a workspace
teamSchema.index({ key: 1, workspaceId: 1 }, { unique: true });

const Team = mongoose.model('Team', teamSchema);
export default Team;
