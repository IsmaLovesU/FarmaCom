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

  useEffect(() => {
    obtenerTodas();
  }, [obtenerTodas]);

  return { categorias, cargando, error, refrescar: obtenerTodas };
};

export default useCategorias;