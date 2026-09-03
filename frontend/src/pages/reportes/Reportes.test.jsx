import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Reportes from './Reportes';

describe('Reportes', () => {
  it('presenta un encabezado puntual para la vista', () => {
    render(<Reportes />);

    expect(screen.getByRole('heading', { name: 'Reportes de ventas' })).toBeInTheDocument();
    expect(screen.queryByText('Análisis comercial')).not.toBeInTheDocument();
    expect(screen.queryByText('Información consolidada')).not.toBeInTheDocument();
  });
});
