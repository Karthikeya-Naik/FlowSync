import React, {
  useState,
} from 'react';

import {
  Calendar,
  User,
  Edit2,
  Trash2,
  CheckCircle,
  Circle,
  Clock,
} from 'lucide-react';

import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';

import {
  updateTask,
  deleteTask,
} from '../api/taskApi';

const TaskCard = ({
  task,
  onUpdate,
  onDelete,
  onEdit,
}) => {
  const { isAdmin, user } =
    useAuth();

  const [isUpdating, setIsUpdating] =
    useState(false);

  const assignedUserId =
    user?._id || user?.id;

  const isAssignedToMe =
    task.assignedTo?._id ===
    assignedUserId;

  const canUpdateStatus =
    isAdmin || isAssignedToMe;

  const canEditFull = isAdmin;

  // Status Icon

  const getStatusIcon = (
    status
  ) => {
    switch (status) {
      case 'completed':
        return (
          <CheckCircle
            size={16}
            className="text-green-500"
          />
        );

      case 'in-progress':
        return (
          <Clock
            size={16}
            className="text-blue-500"
          />
        );

      default:
        return (
          <Circle
            size={16}
            className="text-yellow-500"
          />
        );
    }
  };

  // Status Badge

  const getStatusColor = (
    status
  ) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';

      case 'in-progress':
        return 'bg-blue-100 text-blue-700';

      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  // Priority Badge

  const getPriorityColor = (
    priority
  ) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';

      case 'medium':
        return 'bg-orange-100 text-orange-700';

      default:
        return 'bg-green-100 text-green-700';
    }
  };

  // Status Update

  const handleStatusChange =
    async (newStatus) => {
      try {
        setIsUpdating(true);

        const response =
          await updateTask(
            task._id,
            {
              status:
                newStatus,
            }
          );

        if (response.success) {
          toast.success(
            `Task marked as ${newStatus}`
          );

          onUpdate(
            response.task
          );
        }
      } catch (error) {
        toast.error(
          'Failed to update task status'
        );
      } finally {
        setIsUpdating(false);
      }
    };

  // Delete

  const handleDelete =
    async () => {
      const confirmed =
        window.confirm(
          `Are you sure you want to delete "${task.title}"?`
        );

      if (!confirmed) return;

      try {
        const response =
          await deleteTask(
            task._id
          );

        if (response.success) {
          toast.success(
            'Task deleted successfully'
          );

          onDelete(task._id);
        } else {
          toast.error(
            'Failed to delete task'
          );
        }
      } catch (error) {
        toast.error(
          'Something went wrong'
        );
      }
    };

  // Overdue

  const isOverdue =
    task.isOverdue ||
    (task.dueDate &&
      new Date(task.dueDate) <
        new Date() &&
      task.status !==
        'completed');

  // Date

  const formattedDate =
    task.dueDate
      ? new Date(
          task.dueDate
        ).toLocaleDateString()
      : 'No due date';

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-all duration-300 ${
        isOverdue
          ? 'border-red-200 bg-red-50/30'
          : 'border-gray-200'
      }`}
    >
      {/* Header */}

      <div className="flex justify-between items-start gap-3 mb-3">
        <div className="flex items-start space-x-2 flex-1 min-w-0">
          {getStatusIcon(
            task.status
          )}

          <h3 className="font-semibold text-gray-900 break-words line-clamp-2">
            {task.title}
          </h3>
        </div>

        {canEditFull && (
          <div className="flex space-x-1 flex-shrink-0">
            <button
              aria-label="Edit task"
              onClick={() => onEdit(task)}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Edit2 size={16} />
            </button>

            <button
              aria-label="Delete task"
              onClick={
                handleDelete
              }
              disabled={
                isUpdating
              }
              className="p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Description */}

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {task.description ||
          'No description provided'}
      </p>

      {/* Meta */}

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <User
            size={14}
            className="mr-2"
          />

          <span>
            Assigned to:
          </span>

          <span className="ml-1 font-medium text-gray-700">
            {task.assignedTo
              ?.name ||
              'Unassigned'}
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <Calendar
            size={14}
            className="mr-2"
          />

          <span>Due:</span>

          <span
            className={`ml-1 font-medium ${
              isOverdue
                ? 'text-red-600'
                : 'text-gray-700'
            }`}
          >
            {formattedDate}

            {isOverdue &&
              ' (Overdue)'}
          </span>
        </div>
      </div>

      {/* Badges */}

      <div className="flex flex-wrap gap-2 mb-4">
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
            task.status
          )}`}
        >
          {task.status
            ?.replace(
              '-',
              ' '
            )
            .toUpperCase()}
        </span>

        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(
            task.priority
          )}`}
        >
          {task.priority?.toUpperCase()}{' '}
          Priority
        </span>

        {task.project && (
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
            {
              task.project
                .title
            }
          </span>
        )}
      </div>

      {/* Actions */}

      {canUpdateStatus &&
        task.status !==
          'completed' && (
          <div className="flex gap-2 pt-3 border-t border-gray-100">
            {task.status !==
              'todo' && (
              <button
                onClick={() =>
                  handleStatusChange(
                    'todo'
                  )
                }
                disabled={
                  isUpdating
                }
                className="flex-1 text-xs py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Todo
              </button>
            )}

            {task.status !==
              'in-progress' && (
              <button
                onClick={() =>
                  handleStatusChange(
                    'in-progress'
                  )
                }
                disabled={
                  isUpdating
                }
                className="flex-1 text-xs py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors disabled:opacity-50"
              >
                In Progress
              </button>
            )}

            <button
              onClick={() =>
                handleStatusChange(
                  'completed'
                )
              }
              disabled={
                isUpdating
              }
              className="flex-1 text-xs py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors disabled:opacity-50"
            >
              Complete
            </button>
          </div>
        )}
    </div>
  );
};

export default TaskCard;