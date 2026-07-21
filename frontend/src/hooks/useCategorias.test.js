import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import api from '../api/axios';
import useCategorias from './useCategorias';

vi.mock('../api/axios', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

const categoriasEjemplo = [
  { id_categoria: 1, nombre: 'Analgésicos' },
  { id_categoria: 2, nombre: 'Vitaminas' },
];

describe('useCategorias', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('carga las categorías automáticamente al montar el hook', async () => {
    api.get.mockResolvedValue({ data: categoriasEjemplo });

    const { result } = renderHook(() => useCategorias());

    expect(result.current.cargando).toBe(true);

    await waitFor(() => expect(result.current.cargando).toBe(false));

    expect(api.get).toHaveBeenCalledWith('/categorias');
    expect(result.current.categorias).toEqual(categoriasEjemplo);
    expect(result.current.error).toBeNull();
  });

  it('expone un mensaje de error si la API falla', async () => {
    api.get.mockRejectedValue({ response: { data: { mensaje: 'Error de servidor' } } });

    const { result } = renderHook(() => useCategorias());

    await waitFor(() => expect(result.current.cargando).toBe(false));

    expect(result.current.error).toBe('Error de servidor');
    expect(result.current.categorias).toEqual([]);
  });

  it('agrega la categoría creada a la lista sin recargar todo', async () => {
    api.get.mockResolvedValue({ data: categoriasEjemplo });
    const nueva = { id_categoria: 3, nombre: 'Antibióticos' };
    api.post.mockResolvedValue({ data: nueva });

    const { result } = renderHook(() => useCategorias());
    await waitFor(() => expect(result.current.cargando).toBe(false));

    await act(async () => {
      await result.current.crear({ nombre: 'Antibióticos' });
    });

    expect(api.post).toHaveBeenCalledWith('/categorias', { nombre: 'Antibióticos' });
    expect(result.current.categorias).toEqual([...categoriasEjemplo, nueva]);
  });

  it('elimina la categoría de la lista local tras borrarla', async () => {
    api.get.mockResolvedValue({ data: categoriasEjemplo });
    api.delete.mockResolvedValue({});

    const { result } = renderHook(() => useCategorias());
    await waitFor(() => expect(result.current.cargando).toBe(false));

    await act(async () => {
      await result.current.eliminar(1);
    });

    expect(api.delete).toHaveBeenCalledWith('/categorias/1');
    expect(result.current.categorias).toEqual([categoriasEjemplo[1]]);
  });
});