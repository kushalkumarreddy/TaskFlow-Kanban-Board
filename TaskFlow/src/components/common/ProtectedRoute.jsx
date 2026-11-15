
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render the explicitly supplied layout or component.
  // Otherwise, render nested routes through Outlet.
  return children || <Outlet />;
}

export default ProtectedRoute;
