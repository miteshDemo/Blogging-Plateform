import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./Frontend/context/AuthContext.jsx";
import Home from "./Frontend/pages/Home.jsx";
import Register from "./Frontend/pages/Register.jsx";
import Login from "./Frontend/pages/Login.jsx";
import Dashboard from "./Frontend/pages/Dashboard.jsx";
import CreatePost from "./Frontend/pages/CreatePost.jsx";
import PostDetail from "./Frontend/pages/PostDetail.jsx";
import Profile from "./Frontend/pages/Profile.jsx";

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
  return <Navigate to={user ? "/dashboard" : "/"} replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/post/:slug" element={<PostDetail />} />
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
          <Route
            path="/create-post"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
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