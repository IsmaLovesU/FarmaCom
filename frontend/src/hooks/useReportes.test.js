import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  obtenerMetodosPago,
  obtenerResumenVentas,
  obtenerSerieVentas,
  obtenerTopProductos,
} from '../api/reportes';
import useReportes from './useReportes';

vi.mock('../api/reportes', () => ({
  obtenerResumenVentas: vi.fn(),
  obtenerSerieVentas: vi.fn(),
  obtenerMetodosPago: vi.fn(),
  obtenerTopProductos: vi.fn(),
}));

const filtros = {
  id_sucursal: 2,
  fecha_desde: '2026-08-01',
  fecha_hasta: '2026-08-31',
  agrupacion: 'dia',
  criterio: 'cantidad',
  limite: 5,
};

const prepararRespuestasExitosas = () => {
  obtenerResumenVentas.mockResolvedValue({ ingresos_totales: 500 });
  obtenerSerieVentas.mockResolvedValue([{ periodo: '2026-08-01', ingresos: 500 }]);
  obtenerMetodosPago.mockResolvedValue([{ metodo_pago: 'efectivo', ingresos: 500 }]);
  obtenerTopProductos.mockResolvedValue([{ id_producto: 1, cantidad_vendida: 10 }]);
};

describe('useReportes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    prepararRespuestasExitosas();
  });

  it('carga en paralelo todos los recursos con los mismos filtros', async () => {
    const { result } = renderHook(() => useReportes(filtros));

    expect(result.current.cargando).toBe(true);

    await waitFor(() => expect(result.current.cargando).toBe(false));

    expect(obtenerResumenVentas).toHaveBeenCalledWith(filtros, {
      signal: expect.any(AbortSignal),
    });
    expect(obtenerSerieVentas).toHaveBeenCalledWith(filtros, {
      signal: expect.any(AbortSignal),
    });
    expect(obtenerMetodosPago).toHaveBeenCalledWith(filtros, {
      signal: expect.any(AbortSignal),
    });
    expect(obtenerTopProductos).toHaveBeenCalledWith(filtros, {
      signal: expect.any(AbortSignal),
    });
    expect(result.current.resumen.datos).toEqual({ ingresos_totales: 500 });
    expect(result.current.serie.error).toBeNull();
  });

  it('mantiene disponibles los recursos correctos cuando una sección falla', async () => {
    obtenerTopProductos.mockRejectedValue({
      response: { data: { mensaje: 'No hay ranking disponible.' } },
    });

    const { result } = renderHook(() => useReportes(filtros));

    await waitFor(() => expect(result.current.cargando).toBe(false));

    expect(result.current.resumen.datos).toEqual({ ingresos_totales: 500 });
    expect(result.current.resumen.error).toBeNull();
    expect(result.current.topProductos.datos).toEqual([]);
    expect(result.current.topProductos.error).toBe('No hay ranking disponible.');
  });

  it('publica cada recurso sin esperar a que terminen las demás consultas', async () => {
    let resolverTopProductos;
    obtenerTopProductos.mockReturnValue(new Promise((resolve) => {
      resolverTopProductos = resolve;
    }));

    const { result } = renderHook(() => useReportes(filtros));

    await waitFor(() => expect(result.current.resumen.cargando).toBe(false));

    expect(result.current.resumen.datos).toEqual({ ingresos_totales: 500 });
    expect(result.current.topProductos.cargando).toBe(true);
    expect(result.current.cargando).toBe(true);

    await act(async () => {
      resolverTopProductos([]);
    });

    await waitFor(() => expect(result.current.cargando).toBe(false));
  });

  it('permite reintentar la carga sin cambiar los filtros', async () => {
    const { result } = renderHook(() => useReportes(filtros));
    await waitFor(() => expect(result.current.cargando).toBe(false));

    act(() => {
      result.current.recargar();
    });

    await waitFor(() => expect(obtenerResumenVentas).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(result.current.cargando).toBe(false));
  });

  it('cancela las solicitudes anteriores cuando cambian los filtros', async () => {
    const { rerender } = renderHook(
      ({ filtrosActuales }) => useReportes(filtrosActuales),
      { initialProps: { filtrosActuales: filtros } },
    );

    await waitFor(() => expect(obtenerResumenVentas).toHaveBeenCalledTimes(1));
    const primeraSignal = obtenerResumenVentas.mock.calls[0][1].signal;

    rerender({
      filtrosActuales: { ...filtros, agrupacion: 'semana' },
    });

    expect(primeraSignal.aborted).toBe(true);
    await waitFor(() => expect(obtenerResumenVentas).toHaveBeenCalledTimes(2));
  });
});
