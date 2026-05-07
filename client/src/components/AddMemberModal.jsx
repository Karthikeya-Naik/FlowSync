import React, {
  useEffect,
  useState,
} from 'react';

import {
  X,
  UserPlus,
  Mail,
  UserCheck,
} from 'lucide-react';

import {
  getAllUsers,
} from '../api/userApi';
import { getProjects } from '../api/projectApi';

const AddMemberModal = ({
  isOpen,
  onClose,
  onAdd,
  project,
}) => {
  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [addingUserId, setAddingUserId] =
    useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  // Fetch available users
  const fetchUsers =
    async () => {
      try {
        setLoading(true);

        const response =
          await getAllUsers();

        // Get all assigned member IDs
        const assignedMemberIds =
           [];

        const projectsResponse =
           await getProjects();

        (
           projectsResponse.projects ||
           []
        ).forEach((project) => {
           (
              project.members || []
           ).forEach((member) => {
              assignedMemberIds.push(
                 member._id
              );
           });
        });

        // Filter only unassigned members
        const availableUsers =
           (
              response.users ||
              []
           ).filter(
             (user) =>
             user.role ===
                'member' &&
             !assignedMemberIds.includes(
                user._id
             )
           );

        setUsers(
          availableUsers
        );
      } catch (error) {
        console.error(
          'Fetch users error:',
          error
        );
      } finally {
        setLoading(false);
      }
    };

  // Add member
  const handleAddMember =
    async (userId) => {
      setAddingUserId(
        userId
      );

      await onAdd(
        project._id,
        userId
      );

      setAddingUserId(
        null
      );
    };

  if (!isOpen || !project)
    return null;

  // Get initials for avatar
  const getInitials = (name) => {
    return name?.charAt(0)?.toUpperCase() || '?';
  };

  // Get random gradient color based on name
  const getAvatarGradient = (name) => {
    const gradients = [
      'from-blue-100 to-blue-200 text-blue-700',
      'from-purple-100 to-purple-200 text-purple-700',
      'from-green-100 to-green-200 text-green-700',
      'from-orange-100 to-orange-200 text-orange-700',
      'from-pink-100 to-pink-200 text-pink-700',
      'from-indigo-100 to-indigo-200 text-indigo-700',
    ];
    const index = (name?.length || 0) % gradients.length;
    return gradients[index];
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <UserPlus size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Add Members
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {project.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto max-h-[60vh] p-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 text-sm">Loading members...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck size={32} className="text-gray-300" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                No available members
              </h3>
              <p className="text-sm text-gray-500">
                All members are already assigned to projects
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Available Members ({users.length})
                </p>
              </div>
              {users.map(
                (user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-all duration-200"
                  >
                    {/* User Info */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Avatar */}
                      <div
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarGradient(
                          user.name
                        )} flex items-center justify-center shadow-sm flex-shrink-0`}
                      >
                        <span className="text-sm font-bold">
                          {getInitials(user.name)}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                          {user.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Mail size={12} className="text-gray-400" />
                          <span className="text-xs text-gray-500 truncate">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Add Button */}
                    <button
                      onClick={() =>
                        handleAddMember(
                          user._id
                        )
                      }
                      disabled={
                        addingUserId ===
                        user._id
                      }
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex-shrink-0 ml-3 ${
                        addingUserId === user._id
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
                      }`}
                    >
                      {addingUserId === user._id ? (
                        <span className="flex items-center gap-1">
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Adding...
                        </span>
                      ) : (
                        'Add'
                      )}
                    </button>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <p className="text-xs text-gray-500 text-center">
            {users.length} member{users.length !== 1 ? 's' : ''} available to add
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;