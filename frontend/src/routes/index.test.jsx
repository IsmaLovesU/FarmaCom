import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AppRoutes from './index';

const estadoAuth = vi.hoisted(() => ({
  usuario: {
    id_usuario: 2,
    nombre_usuario: 'Ana Administradora',
    rol: 'administrador',
  },
}));

vi.mock('../context/AuthContext', () => ({
  AUTH_ACTIONS: { LOGOUT: 'LOGOUT' },
  useAuth: () => ({
    dispatch: vi.fn(),
    isAuthenticated: true,
    status: 'authenticated',
    usuario: estadoAuth.usuario,
  }),
}));

vi.mock('../pages/reportes/Reportes.jsx', () => ({
  default: () => <h1>Reportes</h1>,
}));

const renderizarRutaReportes = () => render(
  <MemoryRouter initialEntries={['/reports']}>
    <AppRoutes />
  </MemoryRouter>,
);

describe('ruta de reportes', () => {
  beforeEach(() => {
    estadoAuth.usuario = {
      id_usuario: 2,
      nombre_usuario: 'Ana Administradora',
      rol: 'administrador',
    };
    window.localStorage.clear();
  });

  it('permite ingresar a un administrador y muestra el acceso en el menú', async () => {
    renderizarRutaReportes();

    expect(await screen.findByRole('heading', { name: 'Reportes' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Reportes' })).toBeInTheDocument();
  });

  it('redirige a un dependiente y oculta el acceso del menú', () => {
    estadoAuth.usuario = {
      id_usuario: 7,
      nombre_usuario: 'Diego Dependiente',
      rol: 'dependiente',
    };

    renderizarRutaReportes();

    expect(screen.getByText('Dashboard (Próximamente)')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Reportes' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Reportes' })).not.toBeInTheDocument();
  });
});
