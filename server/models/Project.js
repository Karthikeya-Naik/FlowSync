const mongoose = require('mongoose');

const projectSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,

        required: [
          true,
          'Project title is required',
        ],

        trim: true,

        minlength: [
          3,
          'Title must be at least 3 characters',
        ],

        maxlength: [
          100,
          'Title cannot exceed 100 characters',
        ],
      },

      description: {
        type: String,

        required: [
          true,
          'Project description is required',
        ],

        trim: true,

        maxlength: [
          500,
          'Description cannot exceed 500 characters',
        ],
      },

      createdBy: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: 'User',

        required: true,
      },

      members: [
        {
          type:
            mongoose.Schema.Types
              .ObjectId,

          ref: 'User',
        },
      ],
    },
    {
      timestamps: true,
    }
  );

// Virtual for tasks

projectSchema.virtual('tasks', {
  ref: 'Task',

  localField: '_id',

  foreignField: 'project',
});

// Include virtuals

projectSchema.set('toJSON', {
  virtuals: true,
});

projectSchema.set('toObject', {
  virtuals: true,
});

const Project =
  mongoose.model(
    'Project',
    projectSchema
  );

module.exports = Project;