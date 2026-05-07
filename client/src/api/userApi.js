import axiosInstance from './axiosConfig';

// Get all users (Admin only)
export const getAllUsers = async () => {
  const response =
    await axiosInstance.get(
      '/users'
    );

  return response.data;
};

// Get teammates
export const getTeammates =
  async () => {
    const response =
      await axiosInstance.get(
        '/users/teammates'
      );

    return response.data;
  };

// Get user stats
export const getUserStats =
  async (userId) => {
    const response =
      await axiosInstance.get(
        `/users/${userId}/stats`
      );

    return response.data;
  };

// Update role
export const updateUserRole =
  async (
    userId,
    role
  ) => {
    const response =
      await axiosInstance.put(
        `/users/${userId}/role`,
        { role }
      );

    return response.data;
  };

// Delete user
export const deleteUser =
  async (userId) => {
    const response =
      await axiosInstance.delete(
        `/users/${userId}`
      );

    return response.data;
  };