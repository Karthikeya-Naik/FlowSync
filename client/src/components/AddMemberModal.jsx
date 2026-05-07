import React, {
  useEffect,
  useState,
} from 'react';

import {
  X,
  UserPlus,
  Mail,
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

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Add Members
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {project.title}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="text-center py-10 text-gray-500">
              Loading members...
            </div>
          ) : users.length ===
            0 ? (
            <div className="text-center py-10">
              <UserPlus
                size={48}
                className="mx-auto text-gray-300 mb-3"
              />

              <p className="text-gray-500">
                No available members
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {users.map(
                (user) => (
                  <div
                    key={
                      user._id
                    }
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors"
                  >
                    {/* User Info */}
                    <div className="flex items-center space-x-3">
                      {/* Avatar */}
                      <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {user.name
                            ?.charAt(
                              0
                            )
                            ?.toUpperCase()}
                        </span>
                      </div>

                      {/* Details */}
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {
                            user.name
                          }
                        </h3>

                        <div className="flex items-center text-sm text-gray-500 mt-0.5">
                          <Mail
                            size={14}
                            className="mr-1"
                          />

                          <span>
                            {
                              user.email
                            }
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
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      {addingUserId ===
                      user._id
                        ? 'Adding...'
                        : 'Add'}
                    </button>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;