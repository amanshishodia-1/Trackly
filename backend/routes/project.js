import express from 'express';
import Project from '../models/Project.js';
import Issue from '../models/Issue.js';
import Team from '../models/Team.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get all projects for user's workspace
router.get('/', protect, async (req, res) => {
  try {
    const { teamId } = req.query;
    const filter = { workspaceId: req.user.workspaceId };
    
    if (teamId) filter.team = teamId;

    const projects = await Project.find(filter)
      .populate('team', 'name key')
      .populate('creator', 'name')
      .sort({ createdAt: -1 });

    // Calculate progress for each project
    const projectsWithStats = await Promise.all(
      projects.map(async (project) => {
        const totalIssues = await Issue.countDocuments({ project: project._id });
        const doneIssues = await Issue.countDocuments({ project: project._id, status: 'Done' });
        const progress = totalIssues > 0 ? Math.round((doneIssues / totalIssues) * 100) : 0;
        
        return {
          ...project.toObject(),
          totalIssues,
          doneIssues,
          progress
        };
      })
    );

    res.json(projectsWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single project by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('team', 'name key')
      .populate('creator', 'name');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.workspaceId.toString() !== req.user.workspaceId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Get project stats
    const totalIssues = await Issue.countDocuments({ project: project._id });
    const doneIssues = await Issue.countDocuments({ project: project._id, status: 'Done' });
    const progress = totalIssues > 0 ? Math.round((doneIssues / totalIssues) * 100) : 0;

    res.json({
      ...project.toObject(),
      totalIssues,
      doneIssues,
      progress
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new project
router.post('/', protect, async (req, res) => {
  try {
    const { name, description, teamId } = req.body;

    // Verify team exists and user is member
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const isMember = team.members.some(m => 
      m.user.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized to create projects in this team' });
    }

    const project = await Project.create({
      name,
      description: description || '',
      team: teamId,
      workspaceId: req.user.workspaceId,
      creator: req.user._id
    });

    await project.populate('team', 'name key');
    await project.populate('creator', 'name');

    res.status(201).json({
      ...project.toObject(),
      totalIssues: 0,
      doneIssues: 0,
      progress: 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update project
router.put('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.workspaceId.toString() !== req.user.workspaceId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { name, description, status } = req.body;

    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;
    if (status !== undefined) project.status = status;

    await project.save();
    await project.populate('team', 'name key');
    await project.populate('creator', 'name');

    // Get updated stats
    const totalIssues = await Issue.countDocuments({ project: project._id });
    const doneIssues = await Issue.countDocuments({ project: project._id, status: 'Done' });
    const progress = totalIssues > 0 ? Math.round((doneIssues / totalIssues) * 100) : 0;

    res.json({
      ...project.toObject(),
      totalIssues,
      doneIssues,
      progress
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete project
router.delete('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.workspaceId.toString() !== req.user.workspaceId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Only creator can delete
    if (project.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    // Unlink all issues from this project
    await Issue.updateMany(
      { project: req.params.id },
      { $set: { project: null } }
    );

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get issues for a project
router.get('/:id/issues', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.workspaceId.toString() !== req.user.workspaceId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const issues = await Issue.find({ project: req.params.id })
      .populate('assignee', 'name email')
      .populate('team', 'name key')
      .sort({ createdAt: -1 });

    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
