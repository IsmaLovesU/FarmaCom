import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute.jsx';
import PublicRoute from '../components/auth/PublicRoute.jsx';
import MainLayout from '../layouts/MainLayout.jsx';
import Login from '../pages/Login.jsx';
import Sucursales from '../pages/Sucursales.jsx';
import Usuarios from '../pages/Usuarios.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/sucursales" replace />} />
          <Route path="/sucursales" element={<Sucursales />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route
            path="/inventario"
            element={<div className="p-8 font-headline text-2xl font-bold">Inventario (Proximamente)</div>}
          />
          <Route
            path="/patients"
            element={<div className="p-8 font-headline text-2xl font-bold">Pacientes (Proximamente)</div>}
          />
          <Route
            path="/reports"
            element={<div className="p-8 font-headline text-2xl font-bold">Reportes (Proximamente)</div>}
          />
          <Route
            path="/support"
            element={<div className="p-8 font-headline text-2xl font-bold">Ayuda (Proximamente)</div>}
          />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
