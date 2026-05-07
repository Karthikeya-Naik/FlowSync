import React, {
  useState,
  useEffect,
} from 'react';

import {
  Plus,
  FolderOpen,
} from 'lucide-react';

import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';

import {
  getProjects,
  createProject,
  updateProject,
  addMember,
} from '../api/projectApi';

import ProjectCard from '../components/ProjectCard';
import CreateProjectModal from '../components/CreateProjectModal';
import EditProjectModal from '../components/EditProjectModal';
import AddMemberModal from '../components/AddMemberModal';
import MemberListModal from '../components/MemberListModal'; // Import this

const Projects = () => {
  const { isAdmin } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [memberModalProject, setMemberModalProject] = useState(null); // Add this state

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getProjects();
      setProjects(response.projects || []);
    } catch (error) {
      console.error('Projects Error:', error);
      setError('Failed to load projects');
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      const response = await createProject(projectData);
      if (response.success) {
        toast.success('Project created successfully');
        await fetchProjects();
        return true;
      }
      return false;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create project');
      return false;
    }
  };

  const handleUpdateProject = async (id, projectData) => {
    try {
      const response = await updateProject(id, projectData);
      if (response.success) {
        toast.success('Project updated successfully');
        await fetchProjects();
        return true;
      }
      return false;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update project');
      return false;
    }
  };

  const handleAddMember = async (projectId, userId) => {
    try {
      const response = await addMember(projectId, userId);
      if (response.success) {
        toast.success('Member added successfully');
        await fetchProjects();
        setSelectedProject(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add member');
    }
  };

  const handleDeleteProject = (projectId) => {
    setProjects((prev) =>
      prev.filter((project) => project._id !== projectId)
    );
  };

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 text-lg">Loading projects...</div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500 mt-1">Manage your team's projects</p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Plus size={18} />
            <span>New Project</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {projects.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm text-center py-16">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderOpen size={40} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-500 mb-6">
            {isAdmin
              ? 'Create your first project to get started'
              : "You haven't been added to any projects yet"}
          </p>
          {isAdmin && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all duration-200"
            >
              <Plus size={18} />
              Create Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onUpdate={setEditingProject}
              onDelete={handleDeleteProject}
              onAddMember={setSelectedProject}
              onViewMembers={setMemberModalProject} // Add this prop
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateProject}
      />

      {/* Edit Modal */}
      <EditProjectModal
        isOpen={!!editingProject}
        onClose={() => setEditingProject(null)}
        onSubmit={handleUpdateProject}
        project={editingProject}
      />

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        onAdd={handleAddMember}
        project={selectedProject}
      />

      {/* Member List Modal */}
      <MemberListModal
        isOpen={!!memberModalProject}
        onClose={() => setMemberModalProject(null)}
        project={memberModalProject}
        isAdmin={isAdmin}
        onRefresh={fetchProjects}
        onAddMember={setSelectedProject}
      />
    </div>
  );
};

export default Projects;