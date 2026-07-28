import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Clientes from './Clientes';

const { mockObtenerHistorialCompras } = vi.hoisted(() => ({
  mockObtenerHistorialCompras: vi.fn(),
}));

vi.mock('../api/clientes', () => ({
  obtenerHistorialCompras: mockObtenerHistorialCompras,
}));

vi.mock('../hooks/useClientes', () => ({
  default: () => ({
    clientes: [
      {
        id_cliente: 7,
        nombre_cliente: 'María López',
        observaciones: 'Cliente frecuente',
      },
    ],
    cargando: false,
    error: null,
    crear: vi.fn(),
    actualizar: vi.fn(),
    eliminar: vi.fn(),
  }),
}));

const historial = {
  cliente: {
    id_cliente: 7,
    nombre_cliente: 'María López',
  },
  resumen: {
    total_compras: 1,
    total_articulos: 2,
    monto_total: '125.50',
  },
  compras: [
    {
      id_venta: 31,
      nombre_sucursal: 'Sucursal Central',
      nombre_usuario: 'Vendedor Uno',
      metodo_pago: 'efectivo',
      total: '125.50',
      estado: 'completada',
      fecha_venta: '2026-07-28T15:30:00.000Z',
      cantidad_articulos: 2,
      detalles: [
        {
          id_detalle_venta: 44,
          codigo: 'MED-001',
          nombre_comercial: 'Acetaminofén',
          concentracion: '500 mg',
          presentacion: 'tableta',
          cantidad: 2,
          precio_unitario: '62.75',
          subtotal: '125.50',
        },
      ],
    },
  ],
};

describe('Clientes', () => {
  beforeEach(() => {
    mockObtenerHistorialCompras.mockReset();
    mockObtenerHistorialCompras.mockResolvedValue(historial);
  });

  it('consulta y muestra el historial del cliente seleccionado', async () => {
    const user = userEvent.setup();
    render(<Clientes />);

    await user.click(screen.getByRole('button', { name: 'Ver historial de María López' }));

    expect(mockObtenerHistorialCompras).toHaveBeenCalledWith(7);
    const modal = await screen.findByRole('dialog', { name: 'Historial de ventas' });

    expect(within(modal).getByText('María López')).toBeInTheDocument();
    expect(within(modal).getByText('Compras completadas')).toBeInTheDocument();
    expect(within(modal).getByText('Venta #31')).toBeInTheDocument();
    expect(within(modal).getByText('Sucursal Central')).toBeInTheDocument();

    await user.click(within(modal).getByRole('button', { name: 'Ver detalle' }));

    expect(within(modal).getByText('Acetaminofén')).toBeInTheDocument();
    expect(within(modal).getByText(/MED-001/)).toBeInTheDocument();
  });

  it('muestra un estado vacío cuando el cliente no tiene ventas asociadas', async () => {
    mockObtenerHistorialCompras.mockResolvedValue({
      ...historial,
      resumen: {
        total_compras: 0,
        total_articulos: 0,
        monto_total: '0.00',
      },
      compras: [],
    });
    const user = userEvent.setup();
    render(<Clientes />);

    await user.click(screen.getByRole('button', { name: 'Ver historial de María López' }));

    await waitFor(() => {
      expect(screen.getByText('Sin ventas registradas')).toBeInTheDocument();
    });
    expect(screen.getByText('Este cliente todavía no tiene compras asociadas.')).toBeInTheDocument();
  });
});
