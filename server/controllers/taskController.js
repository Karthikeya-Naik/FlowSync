const Task = require('../models/Task');
const Project = require('../models/Project');

/*
========================================
Create Task
POST /api/tasks
Private/Admin
========================================
*/

const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      project,
      assignedTo,
    } = req.body;

    // Check project

    const projectExists = await Project.findById(project);

    if (!projectExists) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const memberIds =
      projectExists.members.map(
        (memberId) =>
          memberId.toString()
      );

    if (
      assignedTo &&
      !memberIds.includes(
        assignedTo.toString()
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Assigned user does not belong to this project',
      });
    }
    // Create task

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      project,
      assignedTo,
      createdBy: req.user._id,
    });

    // Populate task

    const populatedTask = await Task.findById(task._id)
      .populate('project', 'title')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    // Add overdue flag

    const taskObj = populatedTask.toObject();

    taskObj.isOverdue =
      taskObj.dueDate &&
      new Date(taskObj.dueDate) < new Date() &&
      taskObj.status !== 'completed';

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: taskObj,
    });
  } catch (error) {
    console.error('Create Task Error:', error);

    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

/*
========================================
Get All Tasks
GET /api/tasks
Private
========================================
*/

const getTasks = async (req, res) => {
  try {
    const filters = {};

    // Filters

    if (req.query.status) {
      filters.status = req.query.status;
    }

    if (req.query.priority) {
      filters.priority = req.query.priority;
    }

    if (req.query.project) {
      filters.project = req.query.project;
    }
    if (req.user.role === 'member') {
      // Find member projects
      const memberProjects =
        await Project.find({
          members: req.user._id,
        }).select('_id');

      const projectIds =
        memberProjects.map(
          (project) =>
            project._id
        );

      // Member can only see:
      // - tasks assigned to them
      // - tasks from their projects

      filters.$or = [
        {
          assignedTo:
            req.user._id,
        },
        {
          project: {
            $in: projectIds,
          },
        },
      ];
    }
    // Get tasks

    const tasks = await Task.find(filters)
      .lean()
      .populate('project', 'title')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({
        createdAt: -1,
      });

    // Add overdue flag

    const tasksWithOverdue = tasks.map((task) => {
      const taskObj = { ...task };

      taskObj.isOverdue =
        taskObj.dueDate &&
        new Date(taskObj.dueDate) < new Date() &&
        taskObj.status !== 'completed';

      return taskObj;
    });

    res.status(200).json({
      success: true,
      count: tasksWithOverdue.length,
      tasks: tasksWithOverdue,
    });
  } catch (error) {
    console.error('Get Tasks Error:', error);

    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

/*
========================================
Get Single Task
GET /api/tasks/:id
Private
========================================
*/

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .lean()
      .populate('project', 'title')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const taskObj = { ...task };

    taskObj.isOverdue =
      taskObj.dueDate &&
      new Date(taskObj.dueDate) < new Date() &&
      taskObj.status !== 'completed';

    res.status(200).json({
      success: true,
      task: taskObj,
    });
  } catch (error) {
    console.error('Get Task Error:', error);

    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

/*
========================================
Update Task
PUT /api/tasks/:id
Private
========================================
*/

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    if (req.body.assignedTo) {
      const projectData =
        await Project.findById(
          req.body.project ||
          task.project
        );

      if (!projectData) {
        return res.status(404).json({
          success: false,
          message:
            'Project not found',
        });
      }

      const memberIds =
        projectData.members.map(
          (memberId) =>
            memberId.toString()
        );

      if (
        !memberIds.includes(
          req.body.assignedTo.toString()
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Assigned user does not belong to this project',
        });
      }
    }
    // Update fields

    task.title = req.body.title || task.title;

    task.description =
      req.body.description || task.description;

    task.status = req.body.status || task.status;

    task.priority =
      req.body.priority || task.priority;

    task.dueDate =
      req.body.dueDate || task.dueDate;

    task.assignedTo =
      req.body.assignedTo || task.assignedTo;

    task.project =
      req.body.project || task.project;

    await task.save();

    // Populate updated task

    const updatedTask = await Task.findById(task._id)
      .populate('project', 'title')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    const taskObj = updatedTask.toObject();

    taskObj.isOverdue =
      taskObj.dueDate &&
      new Date(taskObj.dueDate) < new Date() &&
      taskObj.status !== 'completed';

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task: taskObj,
    });
  } catch (error) {
    console.error('Update Task Error:', error);

    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

/*
========================================
Delete Task
DELETE /api/tasks/:id
Private/Admin
========================================
*/

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('Delete Task Error:', error);

    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

/*
========================================
Dashboard Stats
GET /api/tasks/stats/dashboard
Private
========================================
*/

const getTaskStats = async (req, res) => {
  try {
    const tasks = await Task.find()
      .lean()
      .populate('project', 'title')
      .populate('assignedTo', 'name email');

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
      (task) => task.status === 'completed'
    ).length;

    const inProgressTasks = tasks.filter(
      (task) => task.status === 'in-progress'
    ).length;

    const todoTasks = tasks.filter(
      (task) => task.status === 'todo'
    ).length;

    const overdueTasks = tasks.filter(
      (task) =>
        task.dueDate &&
        new Date(task.dueDate) < new Date() &&
        task.status !== 'completed'
    ).length;

    const completionRate =
      totalTasks > 0
        ? Math.round(
            (completedTasks / totalTasks) * 100
          )
        : 0;

    const priorityBreakdown = {
      high: tasks.filter(
        (task) => task.priority === 'high'
      ).length,

      medium: tasks.filter(
        (task) => task.priority === 'medium'
      ).length,

      low: tasks.filter(
        (task) => task.priority === 'low'
      ).length,
    };

    /*
    ========================================
    Member Workspace
    ========================================
    */

    let memberProject = null;

    let memberTasks = [];

    // If logged in user is member
    if (req.user.role === 'member') {
      // Find member project
      memberProject =
        await Project.findOne({
          members: req.user._id,
        })
          .populate(
            'createdBy',
            'name email'
          )
          .populate(
            'members',
            'name email role'
          );

      // Member assigned tasks
      memberTasks = tasks
        .filter(
          (task) =>
            task.assignedTo &&
            task.assignedTo._id.toString() ===
              req.user._id.toString()
        )
        .sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        )
        .slice(0, 5)
        .map((task) => {
          const taskObj =
            { ...task };

          taskObj.isOverdue =
            taskObj.dueDate &&
            new Date(taskObj.dueDate) <
              new Date() &&
            taskObj.status !==
              'completed';

          return taskObj;
        });
    }

    /*
    ========================================
    Admin Activity Feed
    ========================================
    */

    let recentActivity = [];

    if (req.user.role === 'admin') {
      recentActivity = [...tasks]
        .sort(
          (a, b) =>
            new Date(
              b.updatedAt
            ) -
            new Date(
              a.updatedAt
            )
        )
        .slice(0, 6)
        .map((task) => ({
          id: task._id,

          title: task.title,

          status: task.status,

          project:
            task.project?.title,

          assignedTo:
            task.assignedTo
              ?.name || 'Unknown',

          updatedAt:
            task.updatedAt,
        }));
    }
    
    const recentTasks = [...tasks]
      .sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      )
      .slice(0, 5)
      .map((task) => {
        const taskObj = { ...task };

        taskObj.isOverdue =
          taskObj.dueDate &&
          new Date(taskObj.dueDate) < new Date() &&
          taskObj.status !== 'completed';

        return taskObj;
      });

    res.status(200).json({
      success: true,

      stats: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        todoTasks,
        overdueTasks,
        completionRate,
        priorityBreakdown,
      },

      recentTasks,
      memberProject,
      memberTasks,
      recentActivity,
    });
  } catch (error) {
    console.error(
      'Dashboard Stats Error:',
      error
    );

    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats,
};