import axiosInstance from './axiosConfig';

// Register User
export const registerUser = async (userData) => {
  const response = await axiosInstance.post(
    '/auth/register',
    userData
  );

  return response.data;
};

// Login User
export const loginUser = async (userData) => {
  const response = await axiosInstance.post(
    '/auth/login',
    userData
  );

  return response.data;
};

// Get Current User
export const getCurrentUser = async () => {
  const response = await axiosInstance.get('/auth/me');

  return response.data;
};