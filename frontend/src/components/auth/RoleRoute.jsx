import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RoleRoute({ allowedRoles = [], redirectTo = '/sucursales' }) {
  const { status, usuario } = useAuth();

  if (status === 'checking') {
    return null;
  }

  if (!usuario || !allowedRoles.includes(usuario.rol)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
