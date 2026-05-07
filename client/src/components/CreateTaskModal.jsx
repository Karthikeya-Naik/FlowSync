import React, {
  useState,
  useEffect,
} from 'react';

import { X } from 'lucide-react';

import { getProjects } from '../api/projectApi';

const CreateTaskModal = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] =
    useState('');

  const [
    description,
    setDescription,
  ] = useState('');

  const [projectId, setProjectId] =
    useState('');

  const [assignedTo, setAssignedTo] =
    useState('');

  const [priority, setPriority] =
    useState('medium');

  const [dueDate, setDueDate] =
    useState('');

  const [projects, setProjects] =
    useState([]);

  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [
    fetchingData,
    setFetchingData,
  ] = useState(true);

  // Fetch Data

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
    }
  }, [isOpen]);

  // ESC key support

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener(
        'keydown',
        handleEscape
      );
    }

    return () => {
      document.removeEventListener(
        'keydown',
        handleEscape
      );
    };
  }, [isOpen, loading]);

  // Update members when project changes

  useEffect(() => {
    if (!projectId) {
      setUsers([]);
      setAssignedTo('');
      return;
    }

    const selectedProject =
      projects.find(
        (project) =>
          project._id ===
          projectId
      );

    if (!selectedProject) {
      setUsers([]);
      setAssignedTo('');
      return;
    }

    const projectMembers =
      selectedProject.members || [];

    setUsers(projectMembers);

    // Reset assigned user if switching projects

    setAssignedTo('');
  }, [projectId, projects]);

  // Fetch projects

  const fetchProjects =
    async () => {
      try {
        setFetchingData(true);

        const projectsRes =
          await getProjects();

        const fetchedProjects =
          projectsRes.projects || [];

        setProjects(
          fetchedProjects
        );

        // Initially no users until project selected

        setUsers([]);
      } catch (error) {
        console.error(
          'Error fetching projects:',
          error
        );
      } finally {
        setFetchingData(false);
      }
    };

  // Reset form

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setProjectId('');
    setAssignedTo('');
    setPriority('medium');
    setDueDate('');
    setUsers([]);
  };

  // Close modal

  const handleClose = () => {
    if (loading) return;

    resetForm();

    onClose();
  };

  // Submit

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    if (
      !title.trim() ||
      !description.trim() ||
      !projectId ||
      !assignedTo ||
      !dueDate
    ) {
      return;
    }

    try {
      setLoading(true);

      const success =
        await onSubmit({
          title: title.trim(),
          description:
            description.trim(),
          project:
            projectId,
          assignedTo,
          priority,
          dueDate,
        });

      if (success) {
        handleClose();
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      {/* Modal */}

      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        {/* Header */}

        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-gray-900">
            Create New Task
          </h2>

          <button
            aria-label="Close modal"
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {fetchingData ? (
          <div className="text-center py-10 text-gray-500">
            Loading data...
          </div>
        ) : (
          <form
            onSubmit={
              handleSubmit
            }
          >
            <div className="space-y-4">
              {/* Title */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title *
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) =>
                    setTitle(
                      e.target.value
                    )
                  }
                  className="input"
                  placeholder="Enter task title"
                  required
                  disabled={
                    loading
                  }
                />
              </div>

              {/* Description */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>

                <textarea
                  value={
                    description
                  }
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  className="input resize-none"
                  rows="3"
                  placeholder="Enter task description"
                  required
                  disabled={
                    loading
                  }
                />
              </div>

              {/* Project */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project *
                </label>

                <select
                  value={
                    projectId
                  }
                  onChange={(e) =>
                    setProjectId(
                      e.target.value
                    )
                  }
                  className="input"
                  required
                  disabled={
                    loading
                  }
                >
                  <option value="">
                    Select a
                    project
                  </option>

                  {projects.map(
                    (
                      project
                    ) => (
                      <option
                        key={
                          project._id
                        }
                        value={
                          project._id
                        }
                      >
                        {
                          project.title
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Assign */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign To *
                </label>

                <select
                  value={
                    assignedTo
                  }
                  onChange={(e) =>
                    setAssignedTo(
                      e.target.value
                    )
                  }
                  className="input"
                  required
                  disabled={
                    loading || !projectId
                  }
                >
                  <option value="">
                    {projectId
                      ? 'Select team member'
                      : 'Select project first'}
                  </option>

                  {users.length ===
                  0 ? (
                    <option disabled>
                      No users
                      available
                    </option>
                  ) : (
                    users.map(
                      (
                        user
                      ) => (
                        <option
                          key={
                            user._id
                          }
                          value={
                            user._id
                          }
                        >
                          {
                            user.name
                          }{' '}
                          (
                          {
                            user.email
                          }
                          )
                        </option>
                      )
                    )
                  )}
                </select>
              </div>

              {/* Priority */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>

                <select
                  value={
                    priority
                  }
                  onChange={(e) =>
                    setPriority(
                      e.target.value
                    )
                  }
                  className="input"
                  disabled={
                    loading
                  }
                >
                  <option value="low">
                    Low
                  </option>

                  <option value="medium">
                    Medium
                  </option>

                  <option value="high">
                    High
                  </option>
                </select>
              </div>

              {/* Due Date */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date *
                </label>

                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) =>
                    setDueDate(
                      e.target.value
                    )
                  }
                  className="input"
                  required
                  disabled={
                    loading
                  }
                  min={
                    new Date()
                      .toISOString()
                      .split(
                        'T'
                      )[0]
                  }
                />
              </div>
            </div>

            {/* Actions */}

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={
                  handleClose
                }
                disabled={
                  loading
                }
                className="flex-1 btn-secondary disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  loading
                }
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {loading
                  ? 'Creating...'
                  : 'Create Task'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateTaskModal;