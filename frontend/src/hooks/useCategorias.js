import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const useCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const obtenerTodas = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const { data } = await api.get('/categorias');
      setCategorias(data);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al cargar categorías');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { obtenerTodas(); }, [obtenerTodas]);

  const crear = async (payload) => {
    const { data } = await api.post('/categorias', payload);
    setCategorias((prev) => [...prev, data]);
    return data;
  };

  const actualizar = async (id, payload) => {
    const { data } = await api.put(`/categorias/${id}`, payload);
    setCategorias((prev) => prev.map((c) => (c.id_categoria === id ? data : c)));
    return data;
  };

  const eliminar = async (id) => {
    await api.delete(`/categorias/${id}`);
    setCategorias((prev) => prev.filter((c) => c.id_categoria !== id));
  };

  return { categorias, cargando, error, refrescar: obtenerTodas, crear, actualizar, eliminar };
};

export default useCategorias;
