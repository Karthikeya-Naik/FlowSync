import React from 'react';

import { Calendar } from 'lucide-react';

const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-700';

    case 'in-progress':
      return 'bg-blue-100 text-blue-700';

    default:
      return 'bg-yellow-100 text-yellow-700';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'completed':
      return 'Completed';

    case 'in-progress':
      return 'In Progress';

    default:
      return 'Todo';
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':
      return 'bg-red-50 text-red-600';

    case 'medium':
      return 'bg-orange-50 text-orange-600';

    default:
      return 'bg-green-50 text-green-600';
  }
};

const formatDate = (date) => {
  if (!date) return 'N/A';

  const parsedDate = new Date(date);

  if (isNaN(parsedDate)) {
    return 'Invalid Date';
  }

  return parsedDate.toLocaleDateString();
};

const isOverdue = (task) => {
  return (
    task.status !== 'completed' &&
    new Date(task.dueDate) < new Date()
  );
};

const RecentTasksTable = ({
  tasks = [],
}) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No recent tasks to display
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        {/* Header */}

        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
              Task
            </th>

            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
              Project
            </th>

            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
              Status
            </th>

            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
              Priority
            </th>

            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
              Due Date
            </th>
          </tr>
        </thead>

        {/* Body */}

        <tbody className="divide-y divide-gray-200 bg-white">
          {tasks.map((task) => (
            <tr
              key={task._id}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              {/* Task */}

              <td className="px-4 py-4">
                <div className="max-w-xs">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {task.title}
                  </div>

                  <div className="text-xs text-gray-500 truncate mt-1">
                    {task.description ||
                      'No description'}
                  </div>
                </div>
              </td>

              {/* Project */}

              <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                {task.project?.title || 'N/A'}
              </td>

              {/* Status */}

              <td className="px-4 py-4 whitespace-nowrap">
                <span
                  className={`px-2.5 py-1 text-xs rounded-full font-medium ${getStatusColor(
                    task.status
                  )}`}
                >
                  {getStatusText(task.status)}
                </span>
              </td>

              {/* Priority */}

              <td className="px-4 py-4 whitespace-nowrap">
                <span
                  className={`px-2.5 py-1 text-xs rounded-full font-medium ${getPriorityColor(
                    task.priority
                  )}`}
                >
                  {task.priority?.toUpperCase() ||
                    'LOW'}
                </span>
              </td>

              {/* Due Date */}

              <td className="px-4 py-4 whitespace-nowrap">
                <div
                  className={`flex items-center text-sm ${
                    isOverdue(task)
                      ? 'text-red-600 font-medium'
                      : 'text-gray-600'
                  }`}
                >
                  <Calendar
                    size={14}
                    className="mr-1"
                  />

                  {formatDate(task.dueDate)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentTasksTable;