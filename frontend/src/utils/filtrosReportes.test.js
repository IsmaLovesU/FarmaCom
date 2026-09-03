import { describe, expect, it } from 'vitest';
import {
  crearFiltrosInicialesReporte,
  prepararFiltrosReporte,
  validarFiltrosReporte,
} from './filtrosReportes';

describe('filtros de reportes', () => {
  const filtrosValidos = {
    id_sucursal: '2',
    fecha_desde: '2026-08-01',
    fecha_hasta: '2026-08-31',
    agrupacion: 'semana',
    criterio: 'ingresos',
    limite: '5',
  };

  it('crea un rango inicial inclusivo de los últimos 30 días', () => {
    expect(crearFiltrosInicialesReporte(new Date(2026, 8, 3))).toEqual({
      id_sucursal: '',
      fecha_desde: '2026-08-05',
      fecha_hasta: '2026-09-03',
      agrupacion: 'dia',
      criterio: 'cantidad',
      limite: 5,
    });
  });

  it('acepta y prepara filtros válidos para la API', () => {
    expect(validarFiltrosReporte(filtrosValidos)).toBeNull();
    expect(prepararFiltrosReporte(filtrosValidos)).toEqual({
      ...filtrosValidos,
      id_sucursal: 2,
      limite: 5,
    });
  });

  it.each([
    [{ ...filtrosValidos, fecha_desde: '' }, 'Selecciona una fecha inicial y una fecha final.'],
    [{ ...filtrosValidos, fecha_desde: '2026-02-31' }, 'Ingresa un rango de fechas válido.'],
    [{ ...filtrosValidos, fecha_desde: '2026-09-01' }, 'La fecha inicial no puede ser posterior a la fecha final.'],
    [{ ...filtrosValidos, id_sucursal: '0' }, 'Selecciona una sucursal válida.'],
    [{ ...filtrosValidos, agrupacion: 'trimestre' }, 'Selecciona una agrupación válida.'],
    [{ ...filtrosValidos, criterio: 'margen' }, 'Selecciona un criterio válido para los productos destacados.'],
    [{ ...filtrosValidos, limite: 21 }, 'El límite de productos debe estar entre 1 y 20.'],
  ])('rechaza filtros inválidos', (filtros, mensaje) => {
    expect(validarFiltrosReporte(filtros)).toBe(mensaje);
  });
});
