import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import Sucursales from '../pages/Sucursales.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/sucursales" replace />} />
        <Route path="/sucursales" element={<Sucursales />} />
        {/* Placeholder for other routes */}
        <Route path="/inventario" element={<div className="p-8 font-headline font-bold text-2xl">Inventario (Próximamente)</div>} />
        <Route path="/patients" element={<div className="p-8 font-headline font-bold text-2xl">Pacientes (Próximamente)</div>} />
        <Route path="/reports" element={<div className="p-8 font-headline font-bold text-2xl">Reportes (Próximamente)</div>} />
        <Route path="*" element={<Navigate to="/sucursales" replace />} />
      </Route>
    </Routes>
  );
}
