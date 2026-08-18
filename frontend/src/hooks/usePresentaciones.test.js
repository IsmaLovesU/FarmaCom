import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from '../api/axios';
import usePresentaciones from './usePresentaciones';

vi.mock('../api/axios', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

const presentacionesIniciales = [
  { id_presentacion: 1, nombre: 'Caja', productos_asociados: 2 },
  { id_presentacion: 2, nombre: 'Blíster', productos_asociados: 0 },
];

describe('usePresentaciones', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.get.mockResolvedValue({ data: presentacionesIniciales });
  });

  it('actualiza la presentación en la API y conserva su cantidad de productos', async () => {
    api.put.mockResolvedValue({ data: { id_presentacion: 1, nombre: 'Paquete' } });
    const { result } = renderHook(() => usePresentaciones());
    await waitFor(() => expect(result.current.cargando).toBe(false));

    await act(async () => {
      await result.current.actualizar(1, { nombre: 'Paquete' });
    });

    expect(api.put).toHaveBeenCalledWith('/presentaciones/1', { nombre: 'Paquete' });
    expect(result.current.presentaciones).toContainEqual({
      id_presentacion: 1,
      nombre: 'Paquete',
      productos_asociados: 2,
    });
  });

  it('elimina la presentación de la lista después de borrarla en la API', async () => {
    api.delete.mockResolvedValue({});
    const { result } = renderHook(() => usePresentaciones());
    await waitFor(() => expect(result.current.cargando).toBe(false));

    await act(async () => {
      await result.current.eliminar(2);
    });

    expect(api.delete).toHaveBeenCalledWith('/presentaciones/2');
    expect(result.current.presentaciones).toEqual([presentacionesIniciales[0]]);
  });
});
