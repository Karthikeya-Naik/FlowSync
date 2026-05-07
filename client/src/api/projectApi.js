import axiosInstance from './axiosConfig';

// Get All Projects
export const getProjects = async () => {
  const response = await axiosInstance.get('/projects');

  return response.data;
};

// Create Project
export const createProject = async (projectData) => {
  const response = await axiosInstance.post(
    '/projects',
    projectData
  );

  return response.data;
};

// Update Project
export const updateProject = async (
  id,
  projectData
) => {
  const response = await axiosInstance.put(
    `/projects/${id}`,
    projectData
  );

  return response.data;
};

// Delete Project
export const deleteProject = async (id) => {
  const response = await axiosInstance.delete(
    `/projects/${id}`
  );

  return response.data;
};

// Add Member To Project
// Add Member To Project
export const addMember = async (
  projectId,
  userId
) => {
  const response = await axiosInstance.post(
    `/projects/${projectId}/members`,
    { userId }
  );

  return response.data;
};

// Remove Member From Project
export const removeMember =
  async (
    projectId,
    memberId
  ) => {
    const response =
      await axiosInstance.delete(
        `/projects/${projectId}/members/${memberId}`
      );

    return response.data;
  };