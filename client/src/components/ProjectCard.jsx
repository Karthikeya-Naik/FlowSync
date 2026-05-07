import React, { useState } from 'react';

import {
  Users,
  Trash2,
  Edit2,
  UserPlus,
  CheckCircle,
  ClipboardList,
} from 'lucide-react';

import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';

import { deleteProject, removeMember } from '../api/projectApi';

const ProjectCard = ({
  project,
  onUpdate,
  onDelete,
  onAddMember,
  onViewMembers, // New prop to open member modal
}) => {
  const { isAdmin } = useAuth();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const tasks = project.tasks || [];
  const members = project.members || [];
  const taskCount = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.status === 'completed'
  ).length;
  const memberCount = members.length;
  const progress = taskCount > 0 ? Math.round((completedTasks / taskCount) * 100) : 0;

  // Get first 3 members for avatar display
  const displayedMembers = members.slice(0, 3);
  const remainingCount = members.length - 3;

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.title}"? This will also delete all tasks in this project.`
    );
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      const result = await deleteProject(project._id);
      if (result.success) {
        toast.success('Project deleted successfully');
        onDelete(project._id);
      } else {
        toast.error(result.message || 'Failed to delete project');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRemoveMember = async (memberId, e) => {
    e.stopPropagation();
    const confirmed = window.confirm(
      'Remove this member from project? Their project tasks will also be deleted.'
    );
    if (!confirmed) return;

    try {
      const result = await removeMember(project._id, memberId);
      if (result.success) {
        toast.success('Member removed successfully');
        window.location.reload();
      } else {
        toast.error(result.message || 'Failed to remove member');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div
      className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300 h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-5 flex-1 flex flex-col">
        {/* Header - Title & Description */}
        <div className="flex justify-between items-start gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-gray-900 truncate leading-tight">
              {project.title}
            </h3>
            {project.description && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                {project.description}
              </p>
            )}
          </div>

          {/* Action Buttons - Show on hover for admin */}
          {isAdmin && (
            <div
              className={`flex items-center gap-1 transition-opacity duration-200 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <button
                aria-label="Edit Project"
                onClick={() => onUpdate(project)}
                className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-all duration-200"
              >
                <Edit2 size={16} />
              </button>
              <button
                aria-label="Delete Project"
                onClick={handleDelete}
                disabled={isDeleting}
                className={`p-1.5 rounded-lg transition-all duration-200 ${
                  isDeleting
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-red-50 text-gray-400 hover:text-red-600'
                }`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Stats Row - Clean with icons */}
        <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-gray-100">
          {/* Total Tasks */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <ClipboardList size={14} className="text-gray-400" />
            </div>
            <p className="text-xl font-bold text-gray-900">{taskCount}</p>
            <p className="text-xs text-gray-500">Tasks</p>
          </div>

          {/* Completed */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <CheckCircle size={14} className="text-green-500" />
            </div>
            <p className="text-xl font-bold text-green-600">{completedTasks}</p>
            <p className="text-xs text-gray-500">Completed</p>
          </div>

          {/* Members */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users size={14} className="text-blue-500" />
            </div>
            <p className="text-xl font-bold text-blue-600">{memberCount}</p>
            <p className="text-xs text-gray-500">Members</p>
          </div>
        </div>

        {/* Member Avatars Section - Click to view all */}
        <div
          onClick={() => onViewMembers(project)}
          className="cursor-pointer mb-4 p-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-700">Team Members</span>
            <span className="text-xs text-blue-600 hover:text-blue-700 font-medium">
              View all →
            </span>
          </div>
          {memberCount > 0 ? (
            <div className="flex items-center gap-2">
              {/* Avatar Group */}
              <div className="flex items-center -space-x-1.5">
                {displayedMembers.map((member, idx) => (
                  <div
                    key={member?._id || idx}
                    className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-white flex items-center justify-center shadow-sm"
                  >
                    <span className="text-xs font-semibold text-blue-700">
                      {member?.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                ))}
                {remainingCount > 0 && (
                  <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center shadow-sm">
                    <span className="text-xs font-semibold text-gray-600">
                      +{remainingCount}
                    </span>
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-500">
                {memberCount} {memberCount === 1 ? 'member' : 'members'}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                <UserPlus size={12} className="text-gray-400" />
              </div>
              <span className="text-xs text-gray-400">No members yet</span>
            </div>
          )}
        </div>

        {/* Progress Bar Section - Always visible */}
        <div className="mt-auto">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-gray-600 font-medium">Progress</span>
            <span className="font-semibold text-gray-900">{progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 rounded-full h-1.5 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;