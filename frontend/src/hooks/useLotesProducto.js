import { useCallback, useEffect, useState } from 'react';
import api from '../api/axios';

const useLotesProducto = (idProducto, { enabled = true, refreshKey = 0 } = {}) => {
  const [lotes, setLotes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const cargarLotes = useCallback(async () => {
    if (!enabled || !idProducto) return;

    setCargando(true);
    setError(null);

    try {
      const { data } = await api.get(`/lotes/producto/${idProducto}`);
      setLotes(data);
    } catch (err) {
      setLotes([]);
      setError(err.response?.data?.mensaje || 'Error al cargar lotes del producto');
    } finally {
      setCargando(false);
    }
  }, [enabled, idProducto, refreshKey]);

  useEffect(() => {
    cargarLotes();
  }, [cargarLotes]);

  return {
    lotes,
    cargando,
    error,
    refrescar: cargarLotes,
  };
};

export default useLotesProducto;
