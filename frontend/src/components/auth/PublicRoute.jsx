import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth';

export default function PublicRoute() {
  if (isAuthenticated()) {
    return <Navigate to="/sucursales" replace />;
  }

  return <Outlet />;
}
