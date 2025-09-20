import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./Frontend/context/AuthContext.jsx";
import Register from "./Frontend/pages/Register.jsx";
import Login from "./Frontend/pages/Login.jsx";
import Dashboard from "./Frontend/pages/Dashboard.jsx";

// Redirects unauthenticated users to login
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
};

// Redirects authenticated users away from login/register
const PublicRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? <Navigate to="/dashboard" replace /> : children;
};

// Redirect unknown routes depending on auth
const AuthWrapper = () => {
  const { user } = useContext(AuthContext);
  return <Navigate to={user ? "/dashboard" : "/login"} replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all for unknown routes */}
          <Route path="*" element={<AuthWrapper />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
