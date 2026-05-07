import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import toast from 'react-hot-toast';

import {
  loginUser,
  registerUser,
  getCurrentUser,
} from '../api/authApi';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  // Load User On Refresh
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getCurrentUser();

        setUser(data.user);
      } catch (error) {
        localStorage.removeItem('token');

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Register
  const register = async (formData) => {
    try {
      const data = await registerUser(formData);

      localStorage.setItem('token', data.token);

      setUser(data.user);

      toast.success('Registration successful');

      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Registration failed'
      );

      return false;
    }
  };

  // Login
  const login = async (formData) => {
    try {
      const data = await loginUser(formData);

      localStorage.setItem('token', data.token);

      setUser(data.user);

      toast.success('Login successful');

      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Login failed'
      );

      return false;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');

    setUser(null);

    toast.success('Logged out');
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};