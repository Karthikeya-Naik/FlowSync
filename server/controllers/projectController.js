const Project = require('../models/Project');
const User = require('../models/User');
const Task = require('../models/Task');

// @desc Create Project
// @route POST /api/projects
// @access Private/Admin
const createProject = async (req, res) => {
  try {
    const { title, description, members } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required',
      });
    }

    // Create Project
    const project = await Project.create({
      title,
      description,
      createdBy: req.user._id,
      members: members || [],
    });

    const populatedProject = await Project.findById(project._id)
      .populate('createdBy', 'name email role')
      .populate('members', 'name email role');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project: populatedProject,
    });
  } catch (error) {
    console.error('Create Project Error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// @desc Get All Projects
// @route GET /api/projects
// @access Private
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('createdBy', 'name email role')
      .populate('members', 'name email role')
      .populate({
        path: 'tasks',
        select: 'title status priority',
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error('Get Projects Error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// @desc Update Project
// @route PUT /api/projects/:id
// @access Private/Admin
const updateProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    project.title = title || project.title;
    project.description = description || project.description;

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('createdBy', 'name email role')
      .populate('members', 'name email role');

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      project: updatedProject,
    });
  } catch (error) {
    console.error('Update Project Error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// @desc Delete Project
// @route DELETE /api/projects/:id
// @access Private/Admin
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Delete related tasks
    await Task.deleteMany({ project: project._id });

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('Delete Project Error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// @desc Add Member To Project
// @route POST /api/projects/:id/members
// @access Private/Admin
// @desc Add Member To Project
// @route POST /api/projects/:id/members
// @access Private/Admin
const addProjectMember = async (req, res) => {
  try {
    const { userId } = req.body;

    // Validate userId
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    // Find project
    const project = await Project.findById(
      req.params.id
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Find user
    const user = await User.findById(
      userId
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Only members allowed
    if (user.role !== 'member') {
      return res.status(400).json({
        success: false,
        message:
          'Only members can be added to projects',
      });
    }

    // Prevent duplicates
    const alreadyMember =
      project.members.some(
        (memberId) =>
          memberId.toString() ===
          userId
      );

    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        message:
          'User already added to project',
      });
    }

    // Add member
    project.members.push(userId);

    await project.save();
    // Populate updated project
    const updatedProject =
      await Project.findById(
        project._id
      )
        .populate(
          'createdBy',
          'name email role'
        )
        .populate(
          'members',
          'name email role'
        )
        .populate({
          path: 'tasks',
          select:
            'title status priority',
        });

    res.status(200).json({
      success: true,
      message:
        'Member added successfully',
      project: updatedProject,
    });
  } catch (error) {
    console.error(
      'Add Member Error:',
      error.message
    );

    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// @desc Remove Member From Project
// @route DELETE /api/projects/:id/members/:memberId
// @access Private/Admin

const removeProjectMember =
  async (req, res) => {
    try {
      const {
        id,
        memberId,
      } = req.params;

      // Find project
      const project =
        await Project.findById(
          id
        );

      if (!project) {
        return res.status(404).json({
          success: false,
          message:
            'Project not found',
        });
      }

      // Check member exists in project
      const memberExists =
        project.members.some(
          (member) =>
            member.toString() ===
            memberId
        );

      if (!memberExists) {
        return res.status(404).json({
          success: false,
          message:
            'Member not found in project',
        });
      }

      // Remove member
      project.members =
        project.members.filter(
          (member) =>
            member.toString() !==
            memberId
        );

      // Remove member tasks from this project
      await Task.deleteMany({
        project: id,
        assignedTo:
          memberId,
      });

      await project.save();

      // Populate updated project
      const updatedProject =
        await Project.findById(
          project._id
        )
          .populate(
            'createdBy',
            'name email role'
          )
          .populate(
            'members',
            'name email role'
          )
          .populate({
            path: 'tasks',
            select:
              'title status priority',
          });

      res.status(200).json({
        success: true,
        message:
          'Member removed successfully',
        project:
          updatedProject,
      });
    } catch (error) {
      console.error(
        'Remove Member Error:',
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          'Server Error',
      });
    }
  };

module.exports = {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
};