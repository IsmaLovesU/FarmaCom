import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PublicRoute() {
  const { isAuthenticated, status } = useAuth();

  if (status === 'checking') {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/sucursales" replace />;
  }

  return <Outlet />;
}
