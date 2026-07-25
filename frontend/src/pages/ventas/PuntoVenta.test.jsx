import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import PuntoVenta from './PuntoVenta';

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ sucursalActivaId: 1 }),
}));

vi.mock('../../context/CarritoContext', () => ({
  useCarrito: () => ({
    items: [],
    cantidadTotal: 0,
    total: 0,
    agregarAlCarrito: vi.fn(),
    actualizarCantidad: vi.fn(),
    incrementarCantidad: vi.fn(),
    disminuirCantidad: vi.fn(),
    eliminarDelCarrito: vi.fn(),
    vaciarCarrito: vi.fn(),
  }),
}));

vi.mock('../../hooks/useCatalogoPOS', () => ({
  default: () => ({
    productos: [],
    cargando: false,
    error: null,
    refrescar: vi.fn(),
  }),
}));

describe('PuntoVenta', () => {
  it('renderiza el catálogo y el carrito con las funciones del contexto', () => {
    render(<PuntoVenta />);

    expect(screen.getByText('Catálogo de productos')).toBeInTheDocument();
    expect(screen.getByText('Caja / salida')).toBeInTheDocument();
    expect(screen.getByText('El carrito está vacío')).toBeInTheDocument();
  });
});
