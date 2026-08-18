import { useCallback, useEffect, useState } from 'react';
import api from '../api/axios';

export default function usePresentaciones() {
  const [presentaciones, setPresentaciones] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const obtenerTodas = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const { data } = await api.get('/presentaciones');
      setPresentaciones(data);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudieron cargar las presentaciones.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { obtenerTodas(); }, [obtenerTodas]);

  const crear = async (payload) => {
    const { data } = await api.post('/presentaciones', payload);
    const nueva = { ...data, productos_asociados: data.productos_asociados ?? 0 };
    setPresentaciones((prev) => [...prev, nueva].sort((a, b) => a.nombre.localeCompare(b.nombre)));
    return nueva;
  };

  const actualizar = async (id, payload) => {
    const { data } = await api.put(`/presentaciones/${id}`, payload);
    setPresentaciones((prev) => prev
      .map((presentacion) => {
        if (presentacion.id_presentacion !== id) return presentacion;
        return {
          ...presentacion,
          ...data,
          productos_asociados: data.productos_asociados ?? presentacion.productos_asociados ?? 0,
        };
      })
      .sort((a, b) => a.nombre.localeCompare(b.nombre)));
    return data;
  };

  const eliminar = async (id) => {
    await api.delete(`/presentaciones/${id}`);
    setPresentaciones((prev) => prev.filter((p) => p.id_presentacion !== id));
  };

  return {
    presentaciones,
    cargando,
    error,
    crear,
    actualizar,
    eliminar,
    refrescar: obtenerTodas,
  };
}
