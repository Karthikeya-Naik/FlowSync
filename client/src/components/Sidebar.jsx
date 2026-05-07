import React from 'react';

import {
  NavLink,
  useNavigate,
} from 'react-router-dom';

import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  LogOut,
  Users,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();

  const { logout, user } = useAuth();

  const navItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      path: '/projects',
      label: 'Projects',
      icon: FolderKanban,
    },
    {
      path: '/tasks',
      label: 'Tasks',
      icon: CheckSquare,
    },
    { path: '/members', label: 'Members', icon: Users },
  ];

  const handleLogout = () => {
    logout();

    navigate('/login');
  };

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}

      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-blue-600">
          FlowSync
        </h1>

        <p className="text-xs text-gray-500 mt-1">
          Team Task Manager
        </p>
      </div>

      {/* User Info */}

      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 font-semibold">
              {user?.name
                ?.charAt(0)
                ?.toUpperCase()}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name}
            </p>

            <p className="text-xs text-gray-500">
              {user?.role === 'admin'
                ? 'Administrator'
                : 'Team Member'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-medium shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <Icon size={20} />

              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          aria-label="Logout"
          className="flex items-center justify-center space-x-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200"
        >
          <LogOut size={20} />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;