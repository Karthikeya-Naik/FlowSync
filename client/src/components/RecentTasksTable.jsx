import React from 'react';

import { Calendar } from 'lucide-react';

const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return 'bg-green-50 text-green-700 border-green-100';
    case 'in-progress':
      return 'bg-blue-50 text-blue-700 border-blue-100';
    default:
      return 'bg-yellow-50 text-yellow-700 border-yellow-100';
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
      return 'bg-red-50 text-red-700 border-red-100';
    case 'medium':
      return 'bg-orange-50 text-orange-700 border-orange-100';
    default:
      return 'bg-green-50 text-green-700 border-green-100';
  }
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) {
    return 'Invalid Date';
  }
  return parsedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
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
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar size={24} className="text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm font-medium">No recent tasks to display</p>
        <p className="text-gray-400 text-xs mt-1">Tasks will appear here once created</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-100">
        {/* Header */}
        <thead className="bg-gray-50/50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Task
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Project
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Priority
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Due Date
            </th>
          </tr>
        </thead>

        {/* Body */}
        <tbody className="divide-y divide-gray-50 bg-white">
          {tasks.map((task) => (
            <tr
              key={task._id}
              className="hover:bg-gray-50/50 transition-all duration-200 group"
            >
              {/* Task */}
              <td className="px-6 py-4">
                <div className="max-w-xs">
                  <div className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-200">
                    {task.title}
                  </div>
                  {task.description && (
                    <div className="text-xs text-gray-400 truncate mt-1">
                      {task.description}
                    </div>
                  )}
                </div>
              </td>

              {/* Project */}
              <td className="px-6 py-4">
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  {task.project?.title || '—'}
                </span>
              </td>

              {/* Status */}
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                    task.status
                  )}`}
                >
                  {getStatusText(task.status)}
                </span>
              </td>

              {/* Priority */}
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(
                    task.priority
                  )}`}
                >
                  {task.priority?.toUpperCase() || 'LOW'}
                </span>
              </td>

              {/* Due Date */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div
                  className={`flex items-center text-sm ${
                    isOverdue(task)
                      ? 'text-red-600 font-semibold'
                      : 'text-gray-500'
                  }`}
                >
                  <Calendar
                    size={14}
                    className={`mr-1.5 ${
                      isOverdue(task) ? 'text-red-500' : 'text-gray-400'
                    }`}
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