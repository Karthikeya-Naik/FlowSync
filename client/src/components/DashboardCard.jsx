import React from 'react';

import {
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

const colorVariants = {
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-100',
    iconBg: 'bg-blue-100',
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-600',
    border: 'border-green-100',
    iconBg: 'bg-green-100',
  },
  red: {
    bg: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-100',
    iconBg: 'bg-red-100',
  },
  orange: {
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    border: 'border-orange-100',
    iconBg: 'bg-orange-100',
  },
  yellow: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-600',
    border: 'border-yellow-100',
    iconBg: 'bg-yellow-100',
  },
};

const DashboardCard = ({
  title,
  value,
  icon: Icon,
  color = 'blue',
  change,
}) => {
  const selectedColor = colorVariants[color] || colorVariants.blue;

  return (
    <div className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300">
      <div className="p-6">
        {/* Top Section */}
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-500 mb-1 truncate tracking-wide">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {value ?? 0}
            </p>
          </div>

          <div
            className={`p-3 rounded-xl ${selectedColor.iconBg} transition-all duration-300 group-hover:scale-105`}
          >
            <Icon
              className={selectedColor.text}
              size={22}
              strokeWidth={1.75}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;