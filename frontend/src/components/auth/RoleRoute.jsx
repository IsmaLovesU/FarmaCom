import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDefaultRouteForRole } from '../../utils/navigation';

export default function RoleRoute({ allowedRoles = [], redirectTo }) {
  const { status, usuario } = useAuth();

  if (status === 'checking') {
    return null;
  }

  if (!usuario || !allowedRoles.includes(usuario.rol)) {
    return <Navigate to={redirectTo || getDefaultRouteForRole(usuario?.rol)} replace />;
  }

  return <Outlet />;
}
