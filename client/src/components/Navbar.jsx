import React from 'react';

import {
  Bell,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();

  const firstName =
    user?.name?.split(' ')[0] || 'User';

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Welcome */}

        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-gray-800 truncate">
            Welcome back, {firstName}!
          </h2>

          <p className="text-sm text-gray-500 mt-1 truncate">
            Here's what's happening with your tasks today.
          </p>
        </div>

        {/* Actions */}

        <div className="flex items-center space-x-4">
          {/* User Avatar */}

          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-sm font-semibold text-blue-600">
              {user?.name
                ?.charAt(0)
                ?.toUpperCase() || 'U'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;