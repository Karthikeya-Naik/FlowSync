import React from 'react';

const TaskStatusChart = ({
  stats = {},
}) => {
  const {
    todoTasks = 0,
    inProgressTasks = 0,
    completedTasks = 0,
  } = stats;

  const total =
    todoTasks +
    inProgressTasks +
    completedTasks;

  if (total === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No tasks yet. Create your first task!
      </div>
    );
  }

  const todoPercent = Math.round(
    (todoTasks / total) * 100
  );

  const inProgressPercent = Math.round(
    (inProgressTasks / total) * 100
  );

  const completedPercent = Math.round(
    (completedTasks / total) * 100
  );

  return (
    <div className="space-y-5">
      {/* Progress Bar */}

      <div
        className="flex h-3 rounded-full overflow-hidden bg-gray-100"
        aria-label="Task status distribution"
      >
        <div
          className="bg-yellow-500 transition-all duration-500"
          style={{
            width: `${todoPercent}%`,
          }}
        />

        <div
          className="bg-blue-500 transition-all duration-500"
          style={{
            width: `${inProgressPercent}%`,
          }}
        />

        <div
          className="bg-green-500 transition-all duration-500"
          style={{
            width: `${completedPercent}%`,
          }}
        />
      </div>

      {/* Legend */}

      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2" />

          <span className="text-gray-600">
            Todo: {todoTasks}
          </span>
        </div>

        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />

          <span className="text-gray-600">
            In Progress:
            {' '}
            {inProgressTasks}
          </span>
        </div>

        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />

          <span className="text-gray-600">
            Completed:
            {' '}
            {completedTasks}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskStatusChart;