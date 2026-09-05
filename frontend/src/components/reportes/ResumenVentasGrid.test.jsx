import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ResumenVentasGrid from './ResumenVentasGrid';

describe('ResumenVentasGrid', () => {
  it('presenta los cuatro indicadores con formato guatemalteco', () => {
    render(
      <ResumenVentasGrid
        datos={{
          ingresos_totales: 1250.5,
          total_ventas: 32,
          ticket_promedio: 39.078,
          unidades_vendidas: 86,
        }}
        cargando={false}
        error={null}
        onReintentar={vi.fn()}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Resumen' })).toBeInTheDocument();
    expect(screen.getByText(/Q.*1,250\.50/)).toBeInTheDocument();
    expect(screen.getByText('32')).toBeInTheDocument();
    expect(screen.getByText(/Q.*39\.08/)).toBeInTheDocument();
    expect(screen.getByText('86')).toBeInTheDocument();
  });

  it('muestra un esqueleto para cada indicador mientras carga', () => {
    render(
      <ResumenVentasGrid
        datos={null}
        cargando
        error={null}
        onReintentar={vi.fn()}
      />,
    );

    expect(screen.getAllByLabelText(/^Cargando /)).toHaveLength(4);
  });

  it('presenta el error y permite reintentar', () => {
    const onReintentar = vi.fn();
    render(
      <ResumenVentasGrid
        datos={null}
        cargando={false}
        error="No se pudo cargar el resumen."
        onReintentar={onReintentar}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('No se pudo cargar el resumen.');
    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(onReintentar).toHaveBeenCalledOnce();
  });
});
