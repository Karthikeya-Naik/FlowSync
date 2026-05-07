import React, {
  useState,
  useEffect,
} from 'react';

import { X } from 'lucide-react';

const EditTaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  task,
  projects = [],
}) => {
  const [title, setTitle] =
    useState('');

  const [
    description,
    setDescription,
  ] = useState('');

  const [priority, setPriority] =
    useState('medium');
  const [status, setStatus] =
    useState('todo');

  const [assignedTo, setAssignedTo] =
    useState('');

  const [availableMembers, setAvailableMembers] =
    useState([]);
  const [dueDate, setDueDate] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  // Load task data

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');

      setDescription(
        task.description || ''
      );

      setPriority(
        task.priority || 'medium'
      );
      setStatus(
        task.status || 'todo'
      );

      setAssignedTo(
        task.assignedTo?._id || ''
      );
      setDueDate(
        task.dueDate
          ? task.dueDate.split(
              'T'
            )[0]
          : ''
      );
    }
  }, [task]);

// Load project members

    useEffect(() => {
    if (
        task?.project &&
        projects.length > 0
    ) {
        const selectedProject =
        projects.find(
            (project) =>
            project._id ===
            task.project._id
        );

        setAvailableMembers(
        selectedProject
            ?.members || []
        );
    }
    }, [task, projects]); 
  // ESC support

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

  // Reset form

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setStatus('todo');
    setAssignedTo('');
    setAvailableMembers([]);
    setDueDate('');
  };

  // Close

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
      !dueDate
    ) {
      return;
    }

    try {
      setLoading(true);

      const success =
        await onSubmit(
          task._id,
          {
            title: title.trim(),
            description:
              description.trim(),
            priority,
            status,
            assignedTo,
            dueDate,
            dueDate,
          }
        );

      if (success) {
        handleClose();
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !task) {
    return null;
  }

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
            Edit Task
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

        {/* Form */}

        <form onSubmit={handleSubmit}>
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
                required
                disabled={
                  loading
                }
              />
            </div>

            {/* Project */}

            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Project
            </label>

            <input
                type="text"
                value={
                task.project?.title || ''
                }
                className="input bg-gray-100"
                disabled
            />
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

            {/* Status */}

            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
            </label>

            <select
                value={status}
                onChange={(e) =>
                setStatus(
                    e.target.value
                )
                }
                className="input"
                disabled={loading}
            >
                <option value="todo">
                Todo
                </option>

                <option value="in-progress">
                In Progress
                </option>

                <option value="completed">
                Completed
                </option>
            </select>
            </div>            

            {/* Assigned Member */}

            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Assigned Member
            </label>

            <select
                value={assignedTo}
                onChange={(e) =>
                setAssignedTo(
                    e.target.value
                )
                }
                className="input"
                disabled={loading}
            >
                <option value="">
                Select Member
                </option>

                {availableMembers.map(
                (member) => (
                    <option
                    key={member._id}
                    value={member._id}
                    >
                    {member.name}
                    </option>
                )
                )}
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
                    task?.dueDate ? undefined : new Date().toISOString().split('T')[0]
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
                ? 'Saving...'
                : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;