import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import MetodosPagoChart from './MetodosPagoChart';

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="contenedor-responsive">{children}</div>,
  PieChart: ({ children }) => <div data-testid="grafica-dona">{children}</div>,
  Pie: ({ children, data }) => (
    <div data-testid="serie-metodos" data-metodos={data.length}>{children}</div>
  ),
  Cell: ({ fill }) => <span data-testid="segmento-metodo" data-color={fill} />,
}));

const datos = [
  {
    metodo_pago: 'efectivo',
    total_ventas: 6,
    ingresos: 300,
    porcentaje_ingresos: 60,
  },
  {
    metodo_pago: 'tarjeta',
    total_ventas: 4,
    ingresos: 200,
    porcentaje_ingresos: 40,
  },
];

describe('MetodosPagoChart', () => {
  it('presenta la dona y el desglose de cada método', () => {
    render(
      <MetodosPagoChart
        datos={datos}
        cargando={false}
        error={null}
        onReintentar={vi.fn()}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Métodos de pago' })).toBeInTheDocument();
    expect(screen.getByTestId('serie-metodos')).toHaveAttribute('data-metodos', '2');
    expect(screen.getAllByTestId('segmento-metodo')).toHaveLength(2);
    expect(screen.getByText('Efectivo')).toBeInTheDocument();
    expect(screen.getByText('Tarjeta')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
    expect(screen.getByText('40%')).toBeInTheDocument();
    expect(screen.getByText(/Q.*500\.00/)).toBeInTheDocument();
  });

  it('excluye de la dona los métodos sin ingresos y los conserva en el desglose', () => {
    render(
      <MetodosPagoChart
        datos={[datos[0], { ...datos[1], ingresos: 0, porcentaje_ingresos: 0 }]}
        cargando={false}
        error={null}
        onReintentar={vi.fn()}
      />,
    );

    expect(screen.getByTestId('serie-metodos')).toHaveAttribute('data-metodos', '1');
    expect(screen.getByText('Tarjeta')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('muestra estados de carga y ausencia de pagos', () => {
    const { rerender } = render(
      <MetodosPagoChart
        datos={[]}
        cargando
        error={null}
        onReintentar={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('Cargando métodos de pago')).toBeInTheDocument();

    rerender(
      <MetodosPagoChart
        datos={datos.map((metodo) => ({ ...metodo, ingresos: 0 }))}
        cargando={false}
        error={null}
        onReintentar={vi.fn()}
      />,
    );

    expect(screen.getByText('No hay pagos en el período seleccionado.')).toBeInTheDocument();
  });

  it('muestra el error y permite reintentar', () => {
    const onReintentar = vi.fn();
    render(
      <MetodosPagoChart
        datos={[]}
        cargando={false}
        error="No se pudo cargar la distribución de métodos de pago."
        onReintentar={onReintentar}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      'No se pudo cargar la distribución de métodos de pago.',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(onReintentar).toHaveBeenCalledOnce();
  });
});
