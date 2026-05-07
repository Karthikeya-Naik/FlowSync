import React, {
  useState,
} from 'react';

import {
  Mail,
  Calendar,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  CheckCircle,
  AlertCircle,
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
          `Delete ${user.name}? This action cannot be undone.`
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
              'User deleted successfully'
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
      return user.role === 'admin'
        ? 'bg-purple-50 text-purple-700 border-purple-200'
        : 'bg-blue-50 text-blue-700 border-blue-200';
    };

  const joinedDate =
    new Date(
      user.createdAt
    ).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

  const hasStats = stats && (stats.totalTasks > 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
      <div className="p-5 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-sm flex-shrink-0">
              <span className="text-blue-700 font-bold text-lg">
                {user?.name
                  ?.charAt(0)
                  ?.toUpperCase()}
              </span>
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 text-base truncate">
                {user.name}
              </h3>

              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full border font-medium ${getRoleBadgeColor()}`}
                >
                  {user.role === 'admin'
                    ? 'Administrator'
                    : 'Team Member'}
                </span>

                {isCurrentUser && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium border border-gray-200">
                    You
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Admin Actions */}
          {isAdminView && !isCurrentUser && (
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              {/* Role Change */}
              <select
                value={user.role}
                onChange={(e) =>
                  handleRoleChange(e.target.value)
                }
                disabled={changingRole}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 hover:bg-white transition-colors cursor-pointer"
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
                onClick={handleDelete}
                disabled={deleting}
                className="px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium disabled:opacity-50"
              >
                {deleting ? '...' : 'Delete'}
              </button>
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-500 text-sm">
            <Mail size={14} className="mr-2 flex-shrink-0" />
            <span className="truncate text-gray-600">
              {user.email}
            </span>
          </div>

          <div className="flex items-center text-gray-500 text-sm">
            <Calendar size={14} className="mr-2 flex-shrink-0" />
            <span className="text-gray-600">
              Joined {joinedDate}
            </span>
          </div>
        </div>

        {/* Stats Button - Only show for non-admin users */}
        {isAdminView && user.role !== 'admin' && (
          <button
            onClick={loadStats}
            className="w-full mt-2 mb-2 flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium py-2 rounded-lg hover:bg-blue-50 transition-all duration-200 border border-dashed border-blue-200 hover:border-blue-300"
          >
            {showStats ? (
              <>
                <ChevronUp size={16} />
                Hide Task Stats
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                View Task Stats
              </>
            )}
          </button>
        )}

        {/* Stats Section - Expandable */}
        {showStats && user.role !== 'admin' && (
          <div className="mt-3 pt-3 border-t border-gray-100 space-y-3 animate-in slide-in-from-top-2 duration-200">
            {loadingStats ? (
              <div className="flex items-center justify-center py-6">
                <div className="w-6 h-6 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                <span className="ml-2 text-gray-500 text-sm">Loading stats...</span>
              </div>
            ) : stats ? (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="flex justify-center mb-1">
                      <ClipboardList size={16} className="text-gray-500" />
                    </div>
                    <p className="text-xl font-bold text-gray-900">
                      {stats.totalTasks || 0}
                    </p>
                    <p className="text-xs text-gray-500">Total Tasks</p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-2 text-center">
                    <div className="flex justify-center mb-1">
                      <CheckCircle size={16} className="text-green-600" />
                    </div>
                    <p className="text-xl font-bold text-green-600">
                      {stats.completedTasks || 0}
                    </p>
                    <p className="text-xs text-gray-500">Completed</p>
                  </div>

                  <div className="bg-red-50 rounded-lg p-2 text-center">
                    <div className="flex justify-center mb-1">
                      <AlertCircle size={16} className="text-red-600" />
                    </div>
                    <p className="text-xl font-bold text-red-600">
                      {stats.overdueTasks || 0}
                    </p>
                    <p className="text-xs text-gray-500">Overdue</p>
                  </div>
                </div>

                {/* Progress Bar - Only show if there are tasks */}
                {stats.totalTasks > 0 && (
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                      <span className="font-medium">Completion Rate</span>
                      <span className="font-semibold text-gray-700">
                        {stats.completionRate || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-green-500 rounded-full h-1.5 transition-all duration-500"
                        style={{
                          width: `${stats.completionRate || 0}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* No tasks message */}
                {stats.totalTasks === 0 && (
                  <div className="text-center py-2">
                    <p className="text-xs text-gray-400">No tasks assigned yet</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">No statistics available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberCard;