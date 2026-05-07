import React from 'react';

const TaskStatusChart = ({
  stats = {},
}) => {
  const {
    todoTasks = 0,
    inProgressTasks = 0,
    completedTasks = 0,
  } = stats;

  const total = todoTasks + inProgressTasks + completedTasks;

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-400">
            <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p className="text-gray-500 text-sm font-medium">No tasks yet</p>
        <p className="text-gray-400 text-xs mt-1">Create your first task to see distribution</p>
      </div>
    );
  }

  const todoPercent = Math.round((todoTasks / total) * 100);
  const inProgressPercent = Math.round((inProgressTasks / total) * 100);
  const completedPercent = Math.round((completedTasks / total) * 100);

  return (
    <div className="space-y-6">
      {/* Progress Bar - No empty gaps */}
      <div className="relative">
        <div 
          className="flex h-2.5 rounded-full overflow-hidden bg-gray-100"
          role="presentation"
        >
          {/* Todo Section - Yellow */}
          {todoPercent > 0 && (
            <div
              className="bg-yellow-500 transition-all duration-700 ease-out"
              style={{ width: `${todoPercent}%` }}
            />
          )}
          
          {/* In Progress Section - Blue */}
          {inProgressPercent > 0 && (
            <div
              className="bg-blue-500 transition-all duration-700 ease-out"
              style={{ width: `${inProgressPercent}%` }}
            />
          )}
          
          {/* Completed Section - Green */}
          {completedPercent > 0 && (
            <div
              className="bg-green-500 transition-all duration-700 ease-out"
              style={{ width: `${completedPercent}%` }}
            />
          )}
        </div>
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
      </div>

      {/* Legend - Grid layout for better spacing */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Todo */}
        <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm shadow-yellow-200" />
          <div className="flex-1">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium text-gray-700">Todo</span>
              <span className="text-sm font-bold text-gray-900">{todoTasks}</span>
            </div>
            <div className="text-xs text-gray-400 mt-0.5">{todoPercent}% of total</div>
          </div>
        </div>

        {/* In Progress */}
        <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm shadow-blue-200" />
          <div className="flex-1">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium text-gray-700">In Progress</span>
              <span className="text-sm font-bold text-gray-900">{inProgressTasks}</span>
            </div>
            <div className="text-xs text-gray-400 mt-0.5">{inProgressPercent}% of total</div>
          </div>
        </div>

        {/* Completed */}
        <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm shadow-green-200" />
          <div className="flex-1">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium text-gray-700">Completed</span>
              <span className="text-sm font-bold text-gray-900">{completedTasks}</span>
            </div>
            <div className="text-xs text-gray-400 mt-0.5">{completedPercent}% of total</div>
          </div>
        </div>
      </div>

      {/* Additional Stats Card - Optional but adds value */}
      {total > 0 && (
        <div className="pt-3 mt-1 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Total Tasks</span>
            <span className="font-semibold text-gray-900">{total}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskStatusChart;