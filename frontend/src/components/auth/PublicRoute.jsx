import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PublicRoute() {
  const { status } = useAuth();

  if (status === 'checking') {
    return null;
  }

  return <Outlet />;
}
