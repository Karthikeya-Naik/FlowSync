const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error(
      'Get all users error:',
      error
    );

    res.status(500).json({
      success: false,
      message:
        'Server error fetching users',
    });
  }
};

// @desc    Get teammates
// @route   GET /api/users/teammates
// @access  Private
const getTeammates = async (
  req,
  res
) => {
  try {
    // Projects where user is creator or member
    const userProjects =
      await Project.find({
        $or: [
          {
            createdBy:
              req.user.id,
          },
          {
            members:
              req.user.id,
          },
        ],
      })
        .populate(
          'createdBy',
          'name email'
        )
        .populate(
          'members',
          'name email'
        );

    // Store unique IDs
    const teammateIds =
      new Set();

    teammateIds.add(
      req.user.id
    );

    userProjects.forEach(
      (project) => {
        // Creator
        if (
          project.createdBy
            ?._id
        ) {
          teammateIds.add(
            project.createdBy._id.toString()
          );
        }

        // Members
        project.members.forEach(
          (member) => {
            if (
              member?._id
            ) {
              teammateIds.add(
                member._id.toString()
              );
            }
          }
        );
      }
    );

    const teammates =
      await User.find({
        _id: {
          $in: Array.from(
            teammateIds
          ),
        },
      }).select(
        '-password'
      );

    res.status(200).json({
      success: true,
      count:
        teammates.length,
      users: teammates,
    });
  } catch (error) {
    console.error(
      'Get teammates error:',
      error
    );

    res.status(500).json({
      success: false,
      message:
        'Server error fetching teammates',
    });
  }
};

// @desc    Get user stats
// @route   GET /api/users/:id/stats
// @access  Private/Admin
const getUserStats = async (
  req,
  res
) => {
  try {
    const userId =
      req.params.id;

    const user =
      await User.findById(
        userId
      );

    if (!user) {
      return res.status(
        404
      ).json({
        success: false,
        message:
          'User not found',
      });
    }

    // Tasks
    const tasks =
      await Task.find({
        assignedTo:
          userId,
      });

    const totalTasks =
      tasks.length;

    const completedTasks =
      tasks.filter(
        (t) =>
          t.status ===
          'completed'
      ).length;

    const inProgressTasks =
      tasks.filter(
        (t) =>
          t.status ===
          'in-progress'
      ).length;

    const todoTasks =
      tasks.filter(
        (t) =>
          t.status ===
          'todo'
      ).length;

    const overdueTasks =
      tasks.filter(
        (t) =>
          t.status !==
            'completed' &&
          new Date(
            t.dueDate
          ) < new Date()
      ).length;

    // Projects
    const projects =
      await Project.find({
        $or: [
          {
            createdBy:
              userId,
          },
          {
            members:
              userId,
          },
        ],
      }).select('title');

    res.status(200).json({
      success: true,
      stats: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        todoTasks,
        overdueTasks,
        completionRate:
          totalTasks > 0
            ? (
                (completedTasks /
                  totalTasks) *
                100
              ).toFixed(1)
            : 0,
      },

      projects:
        projects.map(
          (project) => ({
            id: project._id,
            title:
              project.title,
          })
        ),
    });
  } catch (error) {
    console.error(
      'Get user stats error:',
      error
    );

    res.status(500).json({
      success: false,
      message:
        'Server error fetching user stats',
    });
  }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const updateUserRole =
  async (req, res) => {
    try {
      const { role } =
        req.body;

      const userId =
        req.params.id;

      // Validate role
      if (
        ![
          'admin',
          'member',
        ].includes(role)
      ) {
        return res.status(
          400
        ).json({
          success: false,
          message:
            'Invalid role',
        });
      }

      // Prevent self role change
      if (
        userId ===
        req.user.id
      ) {
        return res.status(
          400
        ).json({
          success: false,
          message:
            'You cannot change your own role',
        });
      }

      const user =
        await User.findByIdAndUpdate(
          userId,
          { role },
          {
            new: true,
          }
        ).select(
          '-password'
        );

      if (!user) {
        return res.status(
          404
        ).json({
          success: false,
          message:
            'User not found',
        });
      }

      res.status(200).json({
        success: true,
        message: `User role updated to ${role}`,
        user,
      });
    } catch (error) {
      console.error(
        'Update role error:',
        error
      );

      res.status(500).json({
        success: false,
        message:
          'Server error updating role',
      });
    }
  };

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (
  req,
  res
) => {
  try {
    const userId =
      req.params.id;

    // Prevent self delete
    if (
      userId ===
      req.user.id
    ) {
      return res.status(
        400
      ).json({
        success: false,
        message:
          'You cannot delete your own account',
      });
    }

    const user =
      await User.findById(
        userId
      );

    if (!user) {
      return res.status(
        404
      ).json({
        success: false,
        message:
          'User not found',
      });
    }

    // Remove from projects
    await Project.updateMany(
      {
        members: userId,
      },
      {
        $pull: {
          members:
            userId,
        },
      }
    );

    // Unassign tasks
    await Task.updateMany(
      {
        assignedTo:
          userId,
      },
      {
        assignedTo: null,
      }
    );

    // Delete user
    await user.deleteOne();

    res.status(200).json({
      success: true,
      message:
        'User deleted successfully',
    });
  } catch (error) {
    console.error(
      'Delete user error:',
      error
    );

    res.status(500).json({
      success: false,
      message:
        'Server error deleting user',
    });
  }
};

module.exports = {
  getAllUsers,
  getTeammates,
  getUserStats,
  updateUserRole,
  deleteUser,
};