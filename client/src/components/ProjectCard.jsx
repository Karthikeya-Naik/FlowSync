import React, {
  useState,
} from 'react';

import {
  Users,
  Trash2,
  Edit2,
  Plus,
} from 'lucide-react';

import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';

import { deleteProject, removeMember, } from '../api/projectApi';

const ProjectCard = ({
  project,
  onUpdate,
  onDelete,
  onAddMember,
}) => {
  const { isAdmin } = useAuth();

  const [showMembers, setShowMembers] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const tasks = project.tasks || [];

  const members = project.members || [];

  const taskCount = tasks.length;

  const completedTasks = tasks.filter(
    (task) =>
      task.status === 'completed'
  ).length;

  const memberCount = members.length;

  const progress =
    taskCount > 0
      ? Math.round(
          (completedTasks / taskCount) *
            100
        )
      : 0;

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.title}"? This will also delete all tasks in this project.`
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);

      const result =
        await deleteProject(
          project._id
        );

      if (result.success) {
        toast.success(
          'Project deleted successfully'
        );

        onDelete(project._id);
      } else {
        toast.error(
          result.message ||
            'Failed to delete project'
        );
      }
    } catch (error) {
      toast.error(
        'Something went wrong'
      );
    } finally {
      setIsDeleting(false);
    }
  };

const handleRemoveMember =
  async (memberId) => {
    const confirmed =
      window.confirm(
        'Remove this member from project? Their project tasks will also be deleted.'
      );

    if (!confirmed) return;

    try {
      const result =
        await removeMember(
          project._id,
          memberId
        );

      if (result.success) {
        toast.success(
          'Member removed successfully'
        );
        window.location.reload();
      } else {
        toast.error(
          result.message ||
            'Failed to remove member'
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data
          ?.message ||
          'Something went wrong'
      );
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
      <div className="p-6">
        {/* Header */}

        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {project.title}
            </h3>

            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {project.description ||
                'No description'}
            </p>
          </div>

          {isAdmin && (
            <div className="flex items-center space-x-2 flex-shrink-0">
              <button
                aria-label="Edit Project"
                onClick={() =>
                  onUpdate(project)
                }
                className="p-1.5 rounded hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Edit2 size={18} />
              </button>

              <button
                aria-label="Delete Project"
                onClick={handleDelete}
                disabled={isDeleting}
                className={`p-1.5 rounded transition-colors ${
                  isDeleting
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-red-50 text-gray-400 hover:text-red-600'
                }`}
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Stats */}

        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
          <div className="text-center flex-1">
            <p className="text-2xl font-bold text-gray-900">
              {taskCount}
            </p>

            <p className="text-xs text-gray-500">
              Total Tasks
            </p>
          </div>

          <div className="text-center flex-1">
            <p className="text-2xl font-bold text-green-600">
              {completedTasks}
            </p>

            <p className="text-xs text-gray-500">
              Completed
            </p>
          </div>

          <div className="text-center flex-1">
            <p className="text-2xl font-bold text-blue-600">
              {memberCount}
            </p>

            <p className="text-xs text-gray-500">
              Members
            </p>
          </div>
        </div>

        {/* Members */}

        <div className="mb-3">
          <button
            onClick={() =>
              setShowMembers(
                !showMembers
              )
            }
            className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Users
              size={16}
              className="mr-1"
            />

            <span>
              Team Members (
              {memberCount})
            </span>
          </button>

          {showMembers && (
            <div className="mt-3 space-y-2">
              {/* Creator */}

              <div className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-lg">
                <div className="min-w-0">
                  <span className="font-medium">
                    {project.createdBy
                      ?.name || 'Unknown'}
                  </span>

                  <span className="text-xs text-gray-500 ml-2">
                    (Creator)
                  </span>
                </div>

                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                  Admin
                </span>
              </div>

              {/* Members */}

              {members.length > 0 ? (
                members.map((member) => (
                  <div
                    key={member?._id}
                    className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-lg"
                  >
                    <div className="min-w-0">
                      <span className="font-medium">
                        {member?.name || 'Unknown'}
                      </span>

                      <span className="text-xs text-gray-500 ml-2 truncate">
                        (
                        {member?.email || 'No Email'}
                        )
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                        Member
                    </span>

                    {isAdmin && (
                        <button
                        onClick={() =>
                            handleRemoveMember(
                            member._id
                            )
                        }
                        className="text-xs text-red-600 hover:text-red-700"
                        >
                        Remove
                        </button>
                    )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 p-2">
                  No members added yet
                </div>
              )}

              {/* Add Member */}

              {isAdmin && (
                <div className="mt-2">
                  <button
                    onClick={() =>
                        onAddMember(project)
                    }
                    className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Plus
                      size={14}
                      className="mr-1"
                    />
                    Add Member
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Progress */}

        {taskCount > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>

              <span>{progress}%</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-green-500 rounded-full h-1.5 transition-all duration-500"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;