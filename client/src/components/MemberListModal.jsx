import React, { useState } from 'react';
import {
  X,
  Mail,
  Crown,
  Trash2,
  Users,
  Plus,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { removeMember } from '../api/projectApi';

const MemberListModal = ({
  isOpen,
  onClose,
  project,
  isAdmin,
  onRefresh,
  onAddMember, // Add this prop to open the AddMemberModal from parent
}) => {
  const [removingId, setRemovingId] = useState(null);

  if (!isOpen || !project) return null;

  const members = project.members || [];
  const creator = project.createdBy;
  const memberCount = members.length;

  const handleRemoveMember = async (memberId, memberName) => {
    const confirmed = window.confirm(
      `Remove ${memberName} from this project? Their assigned tasks will also be deleted.`
    );
    if (!confirmed) return;

    try {
      setRemovingId(memberId);
      const result = await removeMember(project._id, memberId);
      if (result.success) {
        toast.success(`${memberName} removed successfully`);
        onClose(); 
        await onRefresh(); // Refresh projects list
      } else {
        toast.error(result.message || 'Failed to remove member');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddMemberClick = () => {
    onClose(); // Close member list modal first
    onAddMember(project); // Then open add member modal from parent
  };

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[85vh] overflow-hidden animate-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Team Members</h2>
              <p className="text-sm text-gray-500">{project.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Stats Banner */}
        <div className="px-5 py-3 bg-blue-50/50 border-b border-blue-100">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Total Members
            </span>
            <span className="text-lg font-bold text-blue-600">
              {memberCount + 1}
            </span>
          </div>
        </div>

        {/* Members List */}
        <div className="overflow-y-auto max-h-[45vh] p-4 space-y-3">
          {/* Creator Section */}
          {creator && (
            <div className="bg-gradient-to-r from-amber-50 to-amber-50/30 rounded-xl p-3 border border-amber-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center shadow-sm flex-shrink-0">
                    <Crown size={18} className="text-amber-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900 text-sm">
                        {creator.name || 'Unknown'}
                      </span>
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                        Creator
                      </span>
                    </div>
                    {creator.email && (
                      <div className="flex items-center gap-1 mt-1">
                        <Mail size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-500 truncate">
                          {creator.email}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium ml-2">
                  Admin
                </span>
              </div>
            </div>
          )}

          {/* Members Section */}
          {memberCount > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1 mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Team Members ({memberCount})
                </span>
              </div>
              {members.map((member) => (
                <div
                  key={member._id}
                  className="bg-gray-50 rounded-xl p-3 border border-gray-100 hover:border-blue-200 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarGradient(
                          member.name
                        )} flex items-center justify-center shadow-sm flex-shrink-0`}
                      >
                        <span className="text-sm font-bold">
                          {getInitials(member.name)}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 text-sm truncate">
                          {member.name || 'Unknown'}
                        </p>
                        {member.email && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <Mail size={11} className="text-gray-400" />
                            <span className="text-xs text-gray-500 truncate">
                              {member.email}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => handleRemoveMember(member._id, member.name)}
                        disabled={removingId === member._id}
                        className={`p-2 rounded-lg transition-all duration-200 flex-shrink-0 ml-2 ${
                          removingId === member._id
                            ? 'opacity-50 cursor-not-allowed'
                            : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">No team members added yet</p>
              <p className="text-gray-400 text-xs mt-1">
                Click "Add Member" below to get started
              </p>
            </div>
          )}
        </div>

        {/* Footer with Add Member Button */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          {isAdmin && (
            <button
              onClick={handleAddMemberClick}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Plus size={16} />
              Add Member
            </button>
          )}
          <p className="text-xs text-gray-500 text-center mt-3">
            Total {memberCount + 1} {memberCount + 1 === 1 ? 'person' : 'people'} in this project
          </p>
        </div>
      </div>
    </div>
  );
};

export default MemberListModal;