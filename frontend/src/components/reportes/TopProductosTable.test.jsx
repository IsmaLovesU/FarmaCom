import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import TopProductosTable from './TopProductosTable';

const productos = [
  {
    id_producto: 3,
    codigo: 'MED-003',
    nombre_comercial: 'Acetaminofén',
    nombre_generico: 'Paracetamol',
    cantidad_vendida: 25,
    ingresos_generados: 375,
  },
  {
    id_producto: 8,
    codigo: 'MED-008',
    nombre_comercial: 'Vitamina C',
    nombre_generico: 'Ácido ascórbico',
    cantidad_vendida: 18,
    ingresos_generados: 270,
  },
];

describe('TopProductosTable', () => {
  it('presenta el ranking con cantidad e ingresos', () => {
    render(
      <TopProductosTable
        datos={productos}
        criterio="cantidad"
        cargando={false}
        error={null}
        onCriterioChange={vi.fn()}
        onReintentar={vi.fn()}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Productos más vendidos' })).toBeInTheDocument();
    const tabla = screen.getByRole('table', {
      name: 'Ranking de productos ordenado por cantidad vendida',
    });
    expect(within(tabla).getByText('Acetaminofén')).toBeInTheDocument();
    expect(within(tabla).getByText('Paracetamol')).toBeInTheDocument();
    expect(within(tabla).getByText('1')).toHaveClass('text-primary');
    expect(within(tabla).getByText('25').closest('td')).toHaveClass('text-primary');
    expect(within(tabla).getByText(/Q.*375\.00/).closest('td')).toHaveClass('text-primary');
    expect(screen.getByRole('button', { name: 'Cantidad' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('permite cambiar el criterio del ranking', () => {
    const onCriterioChange = vi.fn();
    render(
      <TopProductosTable
        datos={productos}
        criterio="cantidad"
        cargando={false}
        error={null}
        onCriterioChange={onCriterioChange}
        onReintentar={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Ingresos' }));
    expect(onCriterioChange).toHaveBeenCalledWith('ingresos');
  });

  it('muestra estados de carga y ausencia de productos', () => {
    const { rerender } = render(
      <TopProductosTable
        datos={[]}
        criterio="cantidad"
        cargando
        error={null}
        onCriterioChange={vi.fn()}
        onReintentar={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('Cargando productos más vendidos')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cantidad' })).toBeDisabled();

    rerender(
      <TopProductosTable
        datos={[]}
        criterio="cantidad"
        cargando={false}
        error={null}
        onCriterioChange={vi.fn()}
        onReintentar={vi.fn()}
      />,
    );

    expect(screen.getByText('No hay productos vendidos en el período seleccionado.')).toBeInTheDocument();
  });

  it('muestra el error y permite reintentar', () => {
    const onReintentar = vi.fn();
    render(
      <TopProductosTable
        datos={[]}
        criterio="ingresos"
        cargando={false}
        error="No se pudieron cargar los productos destacados."
        onCriterioChange={vi.fn()}
        onReintentar={onReintentar}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      'No se pudieron cargar los productos destacados.',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(onReintentar).toHaveBeenCalledOnce();
  });
});
