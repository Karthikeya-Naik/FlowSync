import React, {
  useState,
  useEffect,
  useMemo,
} from 'react';

import {
  Plus,
  Search,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

import {
  getTasks,
  createTask,
  updateTask,
} from '../api/taskApi';

import { getProjects } from '../api/projectApi';

import TaskCard from '../components/TaskCard';

import CreateTaskModal from '../components/CreateTaskModal';

import EditTaskModal from '../components/EditTaskModal';

import toast from 'react-hot-toast';

const Tasks = () => {
  const { isAdmin } = useAuth();

  const [tasks, setTasks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [
    showCreateModal,
    setShowCreateModal,
  ] = useState(false);

  const [
    editingTask,
    setEditingTask,
  ] = useState(null);

  const [projects, setProjects] =
    useState([]);

  // Filters

  const [
    statusFilter,
    setStatusFilter,
  ] = useState('');

  const [
    priorityFilter,
    setPriorityFilter,
  ] = useState('');

  const [
    projectFilter,
    setProjectFilter,
  ] = useState('');

  const [
    searchTerm,
    setSearchTerm,
  ] = useState('');

  // Fetch

  useEffect(() => {
    fetchTasksAndProjects();
  }, []);

  const fetchTasksAndProjects =
    async () => {
      try {
        setLoading(true);

        const [
          tasksRes,
          projectsRes,
        ] = await Promise.all([
          getTasks(),
          getProjects(),
        ]);

        setTasks(
          tasksRes.tasks || []
        );

        setProjects(
          projectsRes.projects || []
        );
      } catch (error) {
        console.error(
          'Error fetching data:',
          error
        );

        toast.error(
          'Failed to load tasks'
        );
      } finally {
        setLoading(false);
      }
    };

  // Filters

  const filteredTasks =
    useMemo(() => {
      let filtered = [...tasks];

      if (statusFilter) {
        filtered = filtered.filter(
          (task) =>
            task.status ===
            statusFilter
        );
      }

      if (priorityFilter) {
        filtered = filtered.filter(
          (task) =>
            task.priority ===
            priorityFilter
        );
      }

      if (projectFilter) {
        filtered = filtered.filter(
          (task) =>
            task.project?._id ===
            projectFilter
        );
      }

      if (searchTerm) {
        filtered = filtered.filter(
          (task) =>
            (task.title || '')
              .toLowerCase()
              .includes(
                searchTerm.toLowerCase()
              ) ||
            (
              task.description ||
              ''
            )
              .toLowerCase()
              .includes(
                searchTerm.toLowerCase()
              )
        );
      }

      return filtered;
    }, [
      tasks,
      statusFilter,
      priorityFilter,
      projectFilter,
      searchTerm,
    ]);

  // Create

  const handleCreateTask =
    async (taskData) => {
      try {
        const response =
          await createTask(
            taskData
          );

        if (response.success) {
          toast.success(
            'Task created successfully'
          );

          await fetchTasksAndProjects();

          return true;
        }

        return false;
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            'Failed to create task'
        );

        return false;
      }
    };

  // Update

  const handleUpdateTask =
    async (id, taskData) => {
      try {
        const response =
          await updateTask(
            id,
            taskData
          );

        if (response.success) {
          toast.success(
            'Task updated successfully'
          );

          await fetchTasksAndProjects();

          return true;
        }

        return false;
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            'Failed to update task'
        );

        return false;
      }
    };

  // Local updates

  const handleTaskUpdate = (
    updatedTask
  ) => {
    setTasks((prev) =>
      prev.map((task) =>
        task._id ===
        updatedTask._id
          ? updatedTask
          : task
      )
    );
  };

  const handleTaskDelete = (
    taskId
  ) => {
    setTasks((prev) =>
      prev.filter(
        (task) =>
          task._id !== taskId
      )
    );
  };

  // Clear filters

  const clearFilters = () => {
    setStatusFilter('');
    setPriorityFilter('');
    setProjectFilter('');
    setSearchTerm('');
  };

  // Counts

  const getStatusCount = (
    status
  ) => {
    return tasks.filter(
      (task) =>
        task.status === status
    ).length;
  };

  // Loading

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 animate-pulse">
          Loading tasks...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tasks
          </h1>

          <p className="text-gray-500 mt-1">
            Manage and track all
            tasks
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() =>
              setShowCreateModal(
                true
              )
            }
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />

            <span>
              New Task
            </span>
          </button>
        )}
      </div>

      {/* Stats */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-yellow-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {getStatusCount(
              'todo'
            )}
          </p>

          <p className="text-xs text-yellow-700">
            Todo
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-blue-600">
            {getStatusCount(
              'in-progress'
            )}
          </p>

          <p className="text-xs text-blue-700">
            In Progress
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-green-600">
            {getStatusCount(
              'completed'
            )}
          </p>

          <p className="text-xs text-green-700">
            Completed
          </p>
        </div>

        <div className="bg-red-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-red-600 animate-pulse">
            {
              tasks.filter(
                (task) =>
                  task.isOverdue
              ).length
            }
          </p>

          <p className="text-xs text-red-700">
            Overdue
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
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
              placeholder="Search tasks..."
              className="input py-2"
            />
          </div>

          {/* Status */}

          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>

            <select
              value={
                statusFilter
              }
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="input py-2"
            >
              <option value="">
                All
              </option>

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

          {/* Priority */}

          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>

            <select
              value={
                priorityFilter
              }
              onChange={(e) =>
                setPriorityFilter(
                  e.target.value
                )
              }
              className="input py-2"
            >
              <option value="">
                All
              </option>

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

          {/* Project */}

          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project
            </label>

            <select
              value={
                projectFilter
              }
              onChange={(e) =>
                setProjectFilter(
                  e.target.value
                )
              }
              className="input py-2"
            >
              <option value="">
                All Projects
              </option>

              {projects.map(
                (project) => (
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

          {/* Clear */}

          {(statusFilter ||
            priorityFilter ||
            projectFilter ||
            searchTerm) && (
            <button
              onClick={
                clearFilters
              }
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Tasks */}

      {filteredTasks.length ===
      0 ? (
        <div className="card text-center py-12">
            <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Search
                size={28}
                className="text-gray-400"
                />
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No tasks found
            </h3>

            <p className="text-gray-500 max-w-sm text-center">
                {(statusFilter ||
                priorityFilter ||
                projectFilter ||
                searchTerm)
                ? 'No tasks match your current filters.'
                : isAdmin
                ? 'Create your first task to start managing work efficiently.'
                : 'No tasks have been assigned yet.'}
            </p>
            </div>

          {(statusFilter ||
            priorityFilter ||
            projectFilter ||
            searchTerm) && (
            <button
              onClick={
                clearFilters
              }
              className="mt-4 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            >
              Clear filters
              to see all
              tasks
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map(
            (task) => (
              <TaskCard
                key={task._id}
                task={task}
                onUpdate={
                  handleTaskUpdate
                }
                onDelete={
                  handleTaskDelete
                }
                onEdit={
                  setEditingTask
                }
                projects={
                  projects
                }
              />
            )
          )}
        </div>
      )}

      {/* Modals */}

      <CreateTaskModal
        isOpen={
          showCreateModal
        }
        onClose={() =>
          setShowCreateModal(
            false
          )
        }
        onSubmit={
          handleCreateTask
        }
      />

      <EditTaskModal
        projects={projects}
        isOpen={
          !!editingTask
        }
        onClose={() =>
          setEditingTask(
            null
          )
        }
        onSubmit={
          handleUpdateTask
        }
        task={editingTask}
      />
    </div>
  );
};

export default Tasks;