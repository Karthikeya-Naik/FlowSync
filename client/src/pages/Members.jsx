import React, {
  useState,
  useEffect,
} from 'react';

import {
  Users,
  Search,
  Filter,
} from 'lucide-react';

import {
  useAuth,
} from '../context/AuthContext';

import {
  getAllUsers,
  getTeammates,
} from '../api/userApi';

import MemberCard from '../components/MemberCard';

import toast from 'react-hot-toast';

const Members = () => {
  const {
    user,
    isAdmin,
  } = useAuth();

  const [members, setMembers] =
    useState([]);

  const [
    filteredMembers,
    setFilteredMembers,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [
    searchTerm,
    setSearchTerm,
  ] = useState('');

  const [
    roleFilter,
    setRoleFilter,
  ] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [
    members,
    searchTerm,
    roleFilter,
  ]);

  // Fetch members
  const fetchMembers =
    async () => {
      try {
        setLoading(true);

        let response;

        if (isAdmin) {
          // Admin sees all users
          response =
            await getAllUsers();
        } else {
          // Members see teammates only
          response =
            await getTeammates();
        }

        setMembers(
          response.users || []
        );
      } catch (error) {
        console.error(
          'Fetch members error:',
          error
        );

        toast.error(
          'Failed to load members'
        );
      } finally {
        setLoading(false);
      }
    };

  // Apply filters
  const applyFilters =
    () => {
      let filtered = [
        ...members,
      ];

      // Search
      if (searchTerm) {
        filtered =
          filtered.filter(
            (member) =>
              member.name
                .toLowerCase()
                .includes(
                  searchTerm.toLowerCase()
                ) ||
              member.email
                .toLowerCase()
                .includes(
                  searchTerm.toLowerCase()
                )
          );
      }

      // Role
      if (roleFilter) {
        filtered =
          filtered.filter(
            (member) =>
              member.role ===
              roleFilter
          );
      }
      const sortedMembers =
        [...filtered].sort(
           (a, b) => {
              if (
                a._id ===
                user?._id
              )
                return -1;

              if (
                b._id ===
                user?._id
              )
                return 1;

              return 0;
            }
      );
      setFilteredMembers(
        sortedMembers
      );
    };

  // Delete user
  const handleDeleteUser =
    (userId) => {
      setMembers((prev) =>
        prev.filter(
          (member) =>
            member._id !==
            userId
        )
      );
    };

  // Update role locally
  const handleRoleChange =
    (
      userId,
      newRole
    ) => {
      setMembers((prev) =>
        prev.map(
          (member) =>
            member._id ===
            userId
              ? {
                  ...member,
                  role:
                    newRole,
                }
              : member
        )
      );
    };

  // Clear filters
  const clearFilters =
    () => {
      setSearchTerm('');
      setRoleFilter('');
    };

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">
          Loading members...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Team Members
          </h1>

          <p className="text-gray-500 mt-1">
            {isAdmin
              ? `Managing ${members.length} team member${members.length !== 1 ? 's' : ''}`
              : `Working with ${members.length} teammate${members.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Search */}
          <div className="flex-1 min-w-[220px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Search
                size={14}
                className="inline mr-1"
              />

              Search
            </label>

            <input
              type="text"
              value={
                searchTerm
              }
              onChange={(
                e
              ) =>
                setSearchTerm(
                  e.target
                    .value
                )
              }
              placeholder="Search by name or email..."
              className="input py-2"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Filter
                size={14}
                className="inline mr-1"
              />

              Role
            </label>

            <select
              value={
                roleFilter
              }
              onChange={(
                e
              ) =>
                setRoleFilter(
                  e.target
                    .value
                )
              }
              className="input py-2"
            >
              <option value="">
                All Roles
              </option>

              <option value="admin">
                Admin
              </option>

              <option value="member">
                Member
              </option>
            </select>
          </div>

          {/* Clear */}
          {(searchTerm ||
            roleFilter) && (
            <button
              onClick={
                clearFilters
              }
              className="text-sm text-blue-600 hover:text-blue-700 mb-1"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Members */}
      {filteredMembers.length ===
      0 ? (
        <div className="card text-center py-12">
          <Users
            size={48}
            className="mx-auto text-gray-400 mb-4"
          />

          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No members found
          </h3>

          <p className="text-gray-500">
            {searchTerm ||
            roleFilter
              ? 'Try adjusting your filters'
              : isAdmin
                ? 'No users found'
                : 'You have no teammates yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map(
            (
              member
            ) => (
              <MemberCard
                key={
                  member._id
                }
                user={
                  member
                }
                isAdminView={
                  isAdmin
                }
                isCurrentUser={
                  member._id ===
                  user?._id
                }
                onDelete={
                  handleDeleteUser
                }
                onRoleChange={
                  handleRoleChange
                }
              />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Members;