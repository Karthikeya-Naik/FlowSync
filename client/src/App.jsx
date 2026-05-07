import React from 'react';

import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Members from './pages/Members';

import Layout from './layouts/Layout';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } =
    useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">
          Loading...
        </div>
      </div>
    );
  }

  return isAuthenticated
    ? children
    : <Navigate to="/login" />;
};

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}

      <Route
        path="/login"
        element={
          isAuthenticated
            ? (
              <Navigate to="/dashboard" />
            )
            : (
              <Login />
            )
        }
      />

      <Route
        path="/signup"
        element={
          isAuthenticated
            ? (
              <Navigate to="/dashboard" />
            )
            : (
              <Signup />
            )
        }
      />

      {/* Protected Routes */}

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <Navigate to="/dashboard" />
          }
        />

        <Route
          path="dashboard"
          element={<Dashboard />}
        />

        <Route
          path="projects"
          element={<Projects />}
        />

        <Route
          path="tasks"
          element={<Tasks />}
        />
      <Route path="members" element={<Members />} />
      </Route>


      {/* Fallback Route */}

      <Route
        path="*"
        element={
          <Navigate to="/dashboard" />
        }
      />
    </Routes>
  );
}

export default App;