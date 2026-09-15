import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  const location = useLocation();

  // If user is not logged in or is a Guest/Client attempting admin routes
  if (!user || user.role === 'Client') {
    return <Navigate to="/login" state={{ from: location, message: 'Access Denied: Authentication required. Please log in with valid Admin or Superadmin credentials.' }} replace />;
  }

  // If role is specified and user's role is not authorized
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" state={{ from: location, message: `Access Denied: Your account role (${user.role}) does not have permission to view this section.` }} replace />;
  }

  return children;
}
