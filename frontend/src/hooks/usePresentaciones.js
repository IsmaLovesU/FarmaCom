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
    setPresentaciones((prev) => [...prev, data].sort((a, b) => a.nombre.localeCompare(b.nombre)));
    return data;
  };

  return { presentaciones, cargando, error, crear, refrescar: obtenerTodas };
}
