import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute.jsx';
import PublicRoute from '../components/auth/PublicRoute.jsx';
import RoleRoute from '../components/auth/RoleRoute.jsx';
import MainLayout from '../layouts/MainLayout.jsx';
import Login from '../pages/Login.jsx';
import Sucursales from '../pages/Sucursales.jsx';
import Usuarios from '../pages/Usuarios.jsx';
import Productos from '../pages/inventario/Productos.jsx';
import Lotes from '../pages/inventario/Lotes.jsx';
import InventarioSucursal from '../pages/inventario/InventarioSucursal.jsx';
import Categorias from '../pages/inventario/Categorias.jsx';
import Proveedores from '../pages/inventario/Proveedores.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route
            path="/dashboard"
            element={<div className="p-8 font-headline text-2xl font-bold">Dashboard (Próximamente)</div>}
          />

          {/* Inventario*/}
          <Route path="/inventario">
            {/* Redirect /inventario → /inventario/productos */}
            <Route index element={<Navigate to="productos" replace />} />
            <Route path="productos" element={<Productos />} />
            <Route path="lotes" element={<Lotes />} />
            <Route path="stock" element={<InventarioSucursal />} />
            <Route path="categorias" element={<Categorias />} />
            <Route path="proveedores" element={<Proveedores />} />
          </Route>

          {/* Admin */}
          <Route element={<RoleRoute allowedRoles={['dueno', 'administrador']} />}>
            <Route path="/sucursales" element={<Sucursales />} />
            <Route path="/usuarios" element={<Usuarios />} />
          </Route>

          <Route
            path="/patients"
            element={<div className="p-8 font-headline text-2xl font-bold">Clientes (Próximamente)</div>}
          />
          <Route
            path="/reports"
            element={<div className="p-8 font-headline text-2xl font-bold">Reportes (Próximamente)</div>}
          />
          <Route
            path="/support"
            element={<div className="p-8 font-headline text-2xl font-bold">Ayuda (Próximamente)</div>}
          />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}