import axiosInstance from './axiosConfig';

// Get Tasks
export const getTasks = async (
  filters = {}
) => {
  const cleanedFilters = Object.fromEntries(
    Object.entries(filters).filter(
      ([_, value]) =>
        value !== '' && value != null
    )
  );

  const params = new URLSearchParams(
    cleanedFilters
  ).toString();

  const response = await axiosInstance.get(
    `/tasks${params ? `?${params}` : ''}`
  );

  return response.data;
};

// Get Dashboard Stats
export const getTaskStats = async () => {
  const response = await axiosInstance.get(
    '/tasks/stats/dashboard'
  );

  return response.data;
};

// Create Task
export const createTask = async (
  taskData
) => {
  const response = await axiosInstance.post(
    '/tasks',
    taskData
  );

  return response.data;
};

// Update Task
export const updateTask = async (
  id,
  taskData
) => {
  const response = await axiosInstance.put(
    `/tasks/${id}`,
    taskData
  );

  return response.data;
};

// Delete Task
export const deleteTask = async (id) => {
  const response = await axiosInstance.delete(
    `/tasks/${id}`
  );

  return response.data;
};