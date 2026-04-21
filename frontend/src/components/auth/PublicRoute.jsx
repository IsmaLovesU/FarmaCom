import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDefaultRouteForRole } from '../../utils/navigation';

export default function PublicRoute() {
  const { status, isAuthenticated, usuario } = useAuth();

  if (status === 'checking') {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to={getDefaultRouteForRole(usuario?.rol)} replace />;
  }

  return <Outlet />;
}
