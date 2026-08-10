import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PuntoVenta from './PuntoVenta';
import { crearVenta } from '../../api/ventas';

const productoNormal = {
  carritoKey: 'lote-1-presentacion-1',
  clave: 'lote-1-presentacion-1',
  id_producto: 1,
  id_lote: 1,
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
  id_lote: 2,
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
const vaciarCarrito = vi.fn(() => {
  carritoItems = [];
});
const refrescarCatalogo = vi.fn();
const mockCrearCliente = vi.fn();

vi.mock('../../api/ventas', () => ({
  crearVenta: vi.fn(),
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ sucursalActivaId: 1 }),
}));

vi.mock('../../context/CarritoContext', () => ({
  useCarrito: () => ({
    items: carritoItems,
    cantidadTotal: carritoItems.length,
    total: carritoItems.reduce((total, item) => total + item.cantidad * item.precioUnitario, 0),
    agregarAlCarrito,
    actualizarCantidad: vi.fn(),
    incrementarCantidad: vi.fn(),
    disminuirCantidad: vi.fn(),
    eliminarDelCarrito: vi.fn(),
    vaciarCarrito,
  }),
}));

let productosCatalogo = [];
vi.mock('../../hooks/useCatalogoPOS', () => ({
  default: () => ({
    productos: productosCatalogo,
    cargando: false,
    error: null,
    refrescar: refrescarCatalogo,
  }),
}));

vi.mock('../../hooks/useClientes', () => ({
  default: () => ({
    clientes: [{ id_cliente: 1, nombre_cliente: 'Maria Lopez' }],
    cargando: false,
    crear: mockCrearCliente,
  }),
}));

describe('PuntoVenta', () => {
  beforeEach(() => {
    carritoItems = [];
    productosCatalogo = [];
    agregarAlCarrito.mockClear();
    vaciarCarrito.mockClear();
    refrescarCatalogo.mockClear();
    mockCrearCliente.mockReset();
    mockCrearCliente.mockResolvedValue({
      id_cliente: 2,
      nombre_cliente: 'Ana Pérez',
      observaciones: null,
    });
    crearVenta.mockReset();
    crearVenta.mockResolvedValue({ id_venta: 15, cambio: '1.50' });
  });

  it('renderiza el catalogo, el carrito y el selector de cliente con "Consumidor final" por defecto', () => {
    render(<PuntoVenta />);

    expect(screen.getByText(/Cat.logo de productos/)).toBeInTheDocument();
    expect(screen.getByText('Caja / salida')).toBeInTheDocument();
    expect(screen.getByText(/El carrito est. vac.o/)).toBeInTheDocument();
    expect(screen.getByText('Consumidor final')).toBeInTheDocument();
  });

  it('permite seleccionar un cliente existente', async () => {
    const user = userEvent.setup();
    render(<PuntoVenta />);

    await user.click(screen.getByText('Consumidor final'));
    await user.click(screen.getByText('Maria Lopez'));

    expect(screen.getByText('Maria Lopez')).toBeInTheDocument();
  });

  it('permite agregar y seleccionar un cliente nuevo sin salir del punto de venta', async () => {
    const user = userEvent.setup();
    render(<PuntoVenta />);

    await user.click(screen.getByRole('button', { name: 'Agregar cliente' }));
    expect(screen.getByRole('dialog', { name: 'Nuevo cliente' })).toBeInTheDocument();

    await user.type(screen.getByLabelText('Nombre completo'), '  Ana Pérez  ');
    await user.click(screen.getByRole('button', { name: 'Agregar y seleccionar' }));

    await waitFor(() => {
      expect(mockCrearCliente).toHaveBeenCalledWith({
        nombre_cliente: 'Ana Pérez',
        nit: null,
        observaciones: null,
      });
    });

    expect(screen.queryByRole('dialog', { name: 'Nuevo cliente' })).not.toBeInTheDocument();
    expect(screen.getByText('Ana Pérez')).toBeInTheDocument();
  });

  it('pide confirmacion antes de agregar un producto proximo a vencer', async () => {
    productosCatalogo = [productoProximoAVencer];
    const user = userEvent.setup();
    render(<PuntoVenta />);

    await user.click(screen.getByText('Ibuprofeno'));

    expect(screen.getByText(/Producto pr.ximo a vencer/)).toBeInTheDocument();
    expect(agregarAlCarrito).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /S., continuar/ }));

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
    expect(screen.queryByText(/Producto pr.ximo a vencer/)).not.toBeInTheDocument();
  });

  it('avisa antes de cobrar una venta con productos proximos a vencer en el carrito', async () => {
    carritoItems = [{ ...productoProximoAVencer, cantidad: 1, precioUnitario: 12 }];
    const user = userEvent.setup();
    render(<PuntoVenta />);

    await user.click(screen.getByRole('button', { name: 'Procesar venta' }));

    expect(screen.getByText(/Venta con productos pr.ximos a vencer/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /S., continuar/ }));

    expect(screen.getByText('Cobro de venta')).toBeInTheDocument();
  });

  it('registra una venta en efectivo desde el modal de cobro', async () => {
    carritoItems = [{ ...productoNormal, cantidad: 2, precioUnitario: 8.5 }];
    const user = userEvent.setup();
    render(<PuntoVenta />);

    await user.click(screen.getByRole('button', { name: 'Procesar venta' }));
    await user.clear(screen.getByLabelText('Monto recibido'));
    await user.type(screen.getByLabelText('Monto recibido'), '20');
    await user.click(screen.getByRole('button', { name: 'Confirmar cobro' }));

    await waitFor(() => {
      expect(crearVenta).toHaveBeenCalledWith({
        id_sucursal: 1,
        id_cliente: null,
        metodo_pago: 'efectivo',
        monto_recibido: 20,
        detalles: [{ id_lote: 1, cantidad: 2 }],
      });
    });

    expect(vaciarCarrito).toHaveBeenCalled();
    expect(refrescarCatalogo).toHaveBeenCalled();
    expect(screen.getByText('Venta #15 registrada. Cambio: Q1.50.')).toBeInTheDocument();
  });
});
