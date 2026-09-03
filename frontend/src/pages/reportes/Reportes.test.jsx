import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Reportes from './Reportes';

const controles = vi.hoisted(() => ({
  actualizarFiltro: vi.fn(),
  aplicarFiltros: vi.fn(),
  restablecerFiltros: vi.fn(),
  recargar: vi.fn(),
}));

vi.mock('../../hooks/useFiltrosReportes', () => ({
  default: () => ({
    filtrosEdicion: {
      id_sucursal: '',
      fecha_desde: '2026-08-05',
      fecha_hasta: '2026-09-03',
      agrupacion: 'dia',
    },
    filtrosAplicados: {
      fecha_desde: '2026-08-05',
      fecha_hasta: '2026-09-03',
      agrupacion: 'dia',
    },
    errorFiltros: null,
    actualizarFiltro: controles.actualizarFiltro,
    aplicarFiltros: controles.aplicarFiltros,
    restablecerFiltros: controles.restablecerFiltros,
  }),
}));

vi.mock('../../hooks/useReportes', () => ({
  default: () => ({
    resumen: {
      datos: {
        ingresos_totales: 500,
        total_ventas: 10,
        ticket_promedio: 50,
        unidades_vendidas: 24,
      },
      cargando: false,
      error: null,
    },
    serie: {
      datos: [{
        periodo: '2026-08-05',
        ingresos: 500,
        total_ventas: 10,
        ticket_promedio: 50,
        unidades_vendidas: 24,
      }],
      cargando: false,
      error: null,
    },
    recargar: controles.recargar,
  }),
}));

vi.mock('../../hooks/useSucursales', () => ({
  default: () => ({
    sucursales: [],
    cargando: false,
    error: null,
  }),
}));

describe('Reportes', () => {
  it('presenta un encabezado puntual para la vista', () => {
    render(<Reportes />);

    expect(screen.getByRole('heading', { name: 'Reportes' })).toBeInTheDocument();
    expect(screen.queryByText('Análisis comercial')).not.toBeInTheDocument();
    expect(screen.queryByText('Información consolidada')).not.toBeInTheDocument();
    expect(screen.getByRole('form', { name: 'Filtros de reportes' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Resumen' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Ingresos por período' })).toBeInTheDocument();
  });
});
