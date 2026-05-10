import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const useCasas = () => {
  const [casas, setCasas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const obtenerTodas = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const { data } = await api.get('/casas');
      setCasas(data);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al cargar casas farmacéuticas');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    obtenerTodas();
  }, [obtenerTodas]);

  return { casas, cargando, error, refrescar: obtenerTodas };
};

export default useCasas;