import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PuntoVenta from './PuntoVenta';

const productoNormal = {
  carritoKey: 'lote-1-presentacion-1',
  clave: 'lote-1-presentacion-1',
  id_producto: 1,
  nombre_comercial: 'Paracetamol',
  numero_lote: 'L-001',
  fecha_vencimiento: '2027-01-01',
  stock_disponible: 5,
  precio_venta: 8.5,
  tiene_precio: true,
  estado_vencimiento: 'normal',
};

const productoProximoAVencer = {
  carritoKey: 'lote-2-presentacion-1',
  clave: 'lote-2-presentacion-1',
  id_producto: 2,
  nombre_comercial: 'Ibuprofeno',
  numero_lote: 'L-002',
  fecha_vencimiento: '2026-08-01',
  stock_disponible: 5,
  precio_venta: 12,
  tiene_precio: true,
  estado_vencimiento: 'proximo_a_vencer',
};

let carritoItems = [];
const agregarAlCarrito = vi.fn((producto, opciones = {}) => {
  carritoItems.push({
    ...producto,
    clave: producto.carritoKey,
    cantidad: 1,
    precioUnitario: opciones.precioUnitario,
  });
});

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ sucursalActivaId: 1 }),
}));

vi.mock('../../context/CarritoContext', () => ({
  useCarrito: () => ({
    items: carritoItems,
    cantidadTotal: carritoItems.length,
    total: 0,
    agregarAlCarrito,
    actualizarCantidad: vi.fn(),
    incrementarCantidad: vi.fn(),
    disminuirCantidad: vi.fn(),
    eliminarDelCarrito: vi.fn(),
    vaciarCarrito: vi.fn(),
  }),
}));

let productosCatalogo = [];
vi.mock('../../hooks/useCatalogoPOS', () => ({
  default: () => ({
    productos: productosCatalogo,
    cargando: false,
    error: null,
    refrescar: vi.fn(),
  }),
}));

vi.mock('../../hooks/useClientes', () => ({
  default: () => ({
    clientes: [{ id_cliente: 1, nombre_cliente: 'María López' }],
    cargando: false,
  }),
}));

describe('PuntoVenta', () => {
  beforeEach(() => {
    carritoItems = [];
    productosCatalogo = [];
    agregarAlCarrito.mockClear();
  });

  it('renderiza el catálogo, el carrito y el selector de cliente con "Consumidor final" por defecto', () => {
    render(<PuntoVenta />);

    expect(screen.getByText('Catálogo de productos')).toBeInTheDocument();
    expect(screen.getByText('Caja / salida')).toBeInTheDocument();
    expect(screen.getByText('El carrito está vacío')).toBeInTheDocument();
    expect(screen.getByText('Consumidor final')).toBeInTheDocument();
  });

  it('permite seleccionar un cliente existente', async () => {
    const user = userEvent.setup();
    render(<PuntoVenta />);

    await user.click(screen.getByText('Consumidor final'));
    await user.click(screen.getByText('María López'));

    expect(screen.getByText('María López')).toBeInTheDocument();
  });

  it('pide confirmación antes de agregar un producto próximo a vencer', async () => {
    productosCatalogo = [productoProximoAVencer];
    const user = userEvent.setup();
    render(<PuntoVenta />);

    await user.click(screen.getByText('Ibuprofeno'));

    expect(screen.getByText('Producto próximo a vencer')).toBeInTheDocument();
    expect(agregarAlCarrito).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Sí, continuar' }));

    expect(agregarAlCarrito).toHaveBeenCalledWith(
      productoProximoAVencer,
      { precioUnitario: productoProximoAVencer.precio_venta },
    );
  });

  it('agrega directo al carrito un producto sin alerta de vencimiento', async () => {
    productosCatalogo = [productoNormal];
    const user = userEvent.setup();
    render(<PuntoVenta />);

    await user.click(screen.getByText('Paracetamol'));

    expect(agregarAlCarrito).toHaveBeenCalledWith(
      productoNormal,
      { precioUnitario: productoNormal.precio_venta },
    );
    expect(screen.queryByText('Producto próximo a vencer')).not.toBeInTheDocument();
  });

  it('avisa antes de procesar una venta con productos próximos a vencer en el carrito', async () => {
    carritoItems = [{ ...productoProximoAVencer, cantidad: 1, precioUnitario: 12 }];
    const user = userEvent.setup();
    render(<PuntoVenta />);

    await user.click(screen.getByRole('button', { name: 'Procesar venta' }));

    expect(screen.getByText('Venta con productos próximos a vencer')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Sí, continuar' }));

    expect(screen.getByText(/Cobro efectivo preparado para Consumidor final/)).toBeInTheDocument();
  });
});
