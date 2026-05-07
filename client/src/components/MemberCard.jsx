import React, {
  useState,
} from 'react';

import {
  Mail,
  Calendar,
} from 'lucide-react';

import {
  getUserStats,
  updateUserRole,
  deleteUser,
} from '../api/userApi';

import toast from 'react-hot-toast';

const MemberCard = ({
  user,
  isAdminView,
  isCurrentUser,
  onDelete,
  onRoleChange,
}) => {
  const [showStats, setShowStats] =
    useState(false);

  const [stats, setStats] =
    useState(null);

  const [loadingStats, setLoadingStats] =
    useState(false);

  const [changingRole, setChangingRole] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  // Load user stats
  const loadStats =
    async () => {
      if (stats) {
        setShowStats(
          !showStats
        );

        return;
      }

      setLoadingStats(
        true
      );

      try {
        const response =
          await getUserStats(
            user._id
          );

        setStats(
          response.stats
        );

        setShowStats(
          true
        );
      } catch (error) {
        toast.error(
          'Failed to load user stats'
        );
      } finally {
        setLoadingStats(
          false
        );
      }
    };

  // Change role
  const handleRoleChange =
    async (newRole) => {
      if (
        window.confirm(
          `Change ${user.name}'s role to ${newRole}?`
        )
      ) {
        setChangingRole(
          true
        );

        try {
          const response =
            await updateUserRole(
              user._id,
              newRole
            );

          if (
            response.success
          ) {
            toast.success(
              `Role updated to ${newRole}`
            );

            onRoleChange(
              user._id,
              newRole
            );
          }
        } catch (error) {
          toast.error(
            error.response
              ?.data
              ?.message ||
              'Failed to update role'
          );
        } finally {
          setChangingRole(
            false
          );
        }
      }
    };

  // Delete user
  const handleDelete =
    async () => {
      if (
        window.confirm(
          `Delete ${user.name}?`
        )
      ) {
        setDeleting(true);

        try {
          const response =
            await deleteUser(
              user._id
            );

          if (
            response.success
          ) {
            toast.success(
              'User deleted'
            );

            onDelete(
              user._id
            );
          }
        } catch (error) {
          toast.error(
            error.response
              ?.data
              ?.message ||
              'Failed to delete user'
          );
        } finally {
          setDeleting(
            false
          );
        }
      }
    };

  // Role badge
  const getRoleBadgeColor =
    () => {
      return user.role ===
        'admin'
        ? 'bg-purple-100 text-purple-700'
        : 'bg-blue-100 text-blue-700';
    };

  const joinedDate =
    new Date(
      user.createdAt
    ).toLocaleDateString();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
            {user?.name
              ?.charAt(0)
              ?.toUpperCase()}
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold text-gray-900">
              {user.name}
            </h3>

            <div className="flex items-center space-x-2 mt-1">
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor()}`}
              >
                {user.role ===
                'admin'
                  ? 'Administrator'
                  : 'Team Member'}
              </span>

              {isCurrentUser && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  You
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        {isAdminView &&
          !isCurrentUser && (
            <div className="flex space-x-1">
              {/* Role Change */}
              <select
                value={
                  user.role
                }
                onChange={(
                  e
                ) =>
                  handleRoleChange(
                    e.target
                      .value
                  )
                }
                disabled={
                  changingRole
                }
                className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="member">
                  Member
                </option>

                <option value="admin">
                  Admin
                </option>
              </select>

              {/* Delete */}
              <button
                onClick={
                  handleDelete
                }
                disabled={
                  deleting
                }
                className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                {deleting
                  ? '...'
                  : 'Delete'}
              </button>
            </div>
          )}
      </div>

      {/* Contact */}
      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-center text-gray-500">
          <Mail
            size={14}
            className="mr-2"
          />

          <span>
            {user.email}
          </span>
        </div>

        <div className="flex items-center text-gray-500">
          <Calendar
            size={14}
            className="mr-2"
          />

          <span>
            Joined{' '}
            {joinedDate}
          </span>
        </div>
      </div>

      {/* Stats Button (Admin only) */}
      {isAdminView && user.role !== 'admin' && (
        <button
          onClick={
            loadStats
          }
          className="w-full mb-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {showStats
            ? 'Hide Stats'
            : 'View Task Stats'}
        </button>
      )}

      {/* Stats */}
      {showStats && user.role !== 'admin' && (
        <div className="border-t pt-3 space-y-3">
          {loadingStats ? (
            <div className="text-center text-gray-500 text-sm">
              Loading stats...
            </div>
          ) : (
            stats && (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-xl font-bold text-gray-900">
                      {stats.totalTasks ||
                        0}
                    </p>

                    <p className="text-xs text-gray-500">
                      Tasks
                    </p>
                  </div>

                  <div>
                    <p className="text-xl font-bold text-green-600">
                      {stats.completedTasks ||
                        0}
                    </p>

                    <p className="text-xs text-gray-500">
                      Completed
                    </p>
                  </div>

                  <div>
                    <p className="text-xl font-bold text-red-600">
                      {stats.overdueTasks ||
                        0}
                    </p>

                    <p className="text-xs text-gray-500">
                      Overdue
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>
                      Completion Rate
                    </span>

                    <span>
                      {stats.completionRate ||
                        0}
                      %
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-green-500 rounded-full h-1.5 transition-all"
                      style={{
                        width: `${stats.completionRate || 0}%`,
                      }}
                    />
                  </div>
                </div>
              </>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default MemberCard;