const express = require('express');

const {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
} = require('../controllers/projectController');

const {
  protect,
  authorize,
} = require('../middleware/authMiddleware');

const router = express.Router();

/*
========================================
Projects
========================================
*/

// Create Project (Admin)
// Get All Projects

router
  .route('/')
  .post(
    protect,
    authorize('admin'),
    createProject
  )
  .get(
    protect,
    getProjects
  );

/*
========================================
Single Project
========================================
*/

// Update Project
// Delete Project

router
  .route('/:id')
  .put(
    protect,
    authorize('admin'),
    updateProject
  )
  .delete(
    protect,
    authorize('admin'),
    deleteProject
  );

/*
========================================
Project Members
========================================
*/

// Add Member To Project

router.post(
  '/:id/members',
  protect,
  authorize('admin'),
  addProjectMember
);
// Remove Member From Project

router.delete(
  '/:id/members/:memberId',
  protect,
  authorize('admin'),
  removeProjectMember
);
module.exports = router;