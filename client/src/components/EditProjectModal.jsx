import React, {
  useState,
  useEffect,
} from 'react';

import { X } from 'lucide-react';

const EditProjectModal = ({
  isOpen,
  onClose,
  onSubmit,
  project,
}) => {
  const [title, setTitle] =
    useState('');

  const [
    description,
    setDescription,
  ] = useState('');

  const [loading, setLoading] =
    useState(false);

  // Load project data

  useEffect(() => {
    if (project) {
      setTitle(project.title || '');

      setDescription(
        project.description || ''
      );
    }
  }, [project]);

  // Reset form

  const resetForm = () => {
    setTitle('');
    setDescription('');
  };

  // Close handler

  const handleClose = () => {
    if (loading) return;

    resetForm();

    onClose();
  };

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

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    if (
      !title.trim() ||
      !description.trim()
    ) {
      return;
    }

    try {
      setLoading(true);

      const success =
        await onSubmit(
          project._id,
          {
            title: title.trim(),
            description:
              description.trim(),
          }
        );

      if (success) {
        handleClose();
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !project) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      {/* Modal */}

      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        {/* Header */}

        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-gray-900">
            Edit Project
          </h2>

          <button
            aria-label="Close modal"
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}

        <form onSubmit={handleSubmit}>
          {/* Title */}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Title *
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="input"
              placeholder="Enter project title"
              required
              disabled={loading}
            />
          </div>

          {/* Description */}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              className="input resize-none"
              rows="4"
              placeholder="Enter project description"
              required
              disabled={loading}
            />
          </div>

          {/* Actions */}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 btn-secondary disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
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

export default EditProjectModal;