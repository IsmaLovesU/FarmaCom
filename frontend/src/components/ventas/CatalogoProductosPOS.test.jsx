import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CatalogoProductosPOS from './CatalogoProductosPOS';

const productos = [
  {
    carritoKey: 'lote-1-presentacion-1',
    id_producto: 1,
    codigo: 'MED-001',
    nombre_comercial: 'Paracetamol',
    nombre_generico: 'Acetaminofén',
    presentacion: 'Blíster',
    numero_lote: 'L-001',
    fecha_vencimiento: '2027-01-01',
    stock_disponible: 5,
    precio_venta: 8.5,
    tiene_precio: true,
    estado_stock: 'normal',
    estado_vencimiento: 'normal',
  },
  {
    carritoKey: 'lote-2-presentacion-2',
    id_producto: 2,
    codigo: 'HIG-010',
    nombre_comercial: 'Pañales talla M',
    presentacion: 'Paquete',
    numero_lote: 'L-002',
    fecha_vencimiento: '2028-01-01',
    stock_disponible: 3,
    precio_venta: 42,
    tiene_precio: true,
    estado_stock: 'poco_stock',
    estado_vencimiento: 'normal',
  },
];

const renderizarCatalogo = (onAgregar = vi.fn()) => {
  render(
    <CatalogoProductosPOS
      productos={productos}
      cargando={false}
      error={null}
      onAgregar={onAgregar}
      onRefrescar={() => {}}
    />,
  );
  return onAgregar;
};

describe('CatalogoProductosPOS', () => {
  it('filtra el catálogo mientras el usuario escribe', async () => {
    const user = userEvent.setup();
    renderizarCatalogo();

    await user.type(screen.getByLabelText('Buscar productos'), 'pañales');

    expect(screen.getByText('Pañales talla M')).toBeInTheDocument();
    expect(screen.queryByText('Paracetamol')).not.toBeInTheDocument();
  });

  it('agrega el primer resultado al presionar Enter, como haría un lector', async () => {
    const user = userEvent.setup();
    const onAgregar = renderizarCatalogo();
    const buscador = screen.getByLabelText('Buscar productos');

    await user.type(buscador, 'MED-001{Enter}');

    expect(onAgregar).toHaveBeenCalledWith(productos[0]);
    expect(buscador).toHaveValue('');
  });
});
