import React from 'react';

import {
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

const colorVariants = {
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
  },

  green: {
    bg: 'bg-green-100',
    text: 'text-green-600',
  },

  red: {
    bg: 'bg-red-100',
    text: 'text-red-600',
  },

  orange: {
    bg: 'bg-orange-100',
    text: 'text-orange-600',
  },

  yellow: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-600',
  },
};

const DashboardCard = ({
  title,
  value,
  icon: Icon,
  color = 'blue',
  change,
}) => {
  const selectedColor =
    colorVariants[color] ||
    colorVariants.blue;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      {/* Top Section */}

      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-sm text-gray-500 mb-1 truncate">
            {title}
          </p>

          <p className="text-2xl font-bold text-gray-900">
            {value ?? 0}
          </p>
        </div>

        <div
          className={`p-3 rounded-lg ${selectedColor.bg}`}
        >
          <Icon
            className={selectedColor.text}
            size={24}
          />
        </div>
      </div>

      {/* Change Indicator */}

      {change !== undefined &&
        change !== null && (
          <div className="mt-4 flex items-center text-sm">
            {change >= 0 ? (
              <TrendingUp
                size={16}
                className="text-green-500 mr-1"
              />
            ) : (
              <TrendingDown
                size={16}
                className="text-red-500 mr-1"
              />
            )}

            <span
              className={
                change >= 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }
            >
              {Math.abs(change)}%
            </span>

            <span className="text-gray-500 ml-1">
              from last week
            </span>
          </div>
        )}
    </div>
  );
};

export default DashboardCard;