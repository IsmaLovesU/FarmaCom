import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from '../api/axios';
import useLotes from './useLotes';

vi.mock('../api/axios', () => ({
  default: { post: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}));

describe('useLotes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('actualiza un lote mediante PATCH', async () => {
    const lote = { id_lote: 7, numero_lote: 'LT-002' };
    api.patch.mockResolvedValue({ data: lote });
    const { result } = renderHook(() => useLotes());

    let respuesta;
    await act(async () => {
      respuesta = await result.current.actualizar(7, { numero_lote: 'LT-002' });
    });

    expect(api.patch).toHaveBeenCalledWith('/lotes/7', { numero_lote: 'LT-002' });
    expect(respuesta).toEqual(lote);
    expect(result.current.error).toBeNull();
  });

  it('elimina un lote mediante DELETE', async () => {
    api.delete.mockResolvedValue({ data: { mensaje: 'Lote eliminado correctamente' } });
    const { result } = renderHook(() => useLotes());

    await act(async () => {
      await result.current.eliminar(7);
    });

    expect(api.delete).toHaveBeenCalledWith('/lotes/7');
    expect(result.current.guardando).toBe(false);
  });

  it('expone el mensaje del backend cuando no puede eliminarse', async () => {
    api.delete.mockRejectedValue({
      response: { data: { mensaje: 'No se puede eliminar un lote asociado a ventas' } },
    });
    const { result } = renderHook(() => useLotes());

    await act(async () => {
      await expect(result.current.eliminar(7)).rejects.toThrow(
        'No se puede eliminar un lote asociado a ventas',
      );
    });

    await waitFor(() => {
      expect(result.current.error).toBe('No se puede eliminar un lote asociado a ventas');
    });
  });
});
