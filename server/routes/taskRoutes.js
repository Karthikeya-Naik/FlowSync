const express = require('express');

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats,
} = require('../controllers/taskController');

const {
  protect,
  authorize,
} = require('../middleware/authMiddleware');

const router = express.Router();

/*
========================================
Dashboard Stats
========================================
*/

router.get(
  '/stats/dashboard',
  protect,
  getTaskStats
);

/*
========================================
Tasks
========================================
*/

// Create Task (Admin only)
// Get All Tasks

router
  .route('/')
  .post(
    protect,
    authorize('admin'),
    createTask
  )
  .get(
    protect,
    getTasks
  );

/*
========================================
Single Task
========================================
*/

// Get Single Task
// Update Task
// Delete Task

router
  .route('/:id')
  .get(
    protect,
    getTaskById
  )
  .put(
    protect,
    updateTask
  )
  .delete(
    protect,
    authorize('admin'),
    deleteTask
  );

module.exports = router;