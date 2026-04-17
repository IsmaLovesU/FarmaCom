import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PublicRoute() {
  const { status, isAuthenticated } = useAuth();

  if (status === 'checking') {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/sucursales" replace />;
  }

  return <Outlet />;
}
