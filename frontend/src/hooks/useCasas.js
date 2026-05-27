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

  const crear = async (payload) => {
    const { data } = await api.post('/casas', payload);
    setCasas((prev) => [...prev, data]);
    return data;
  };

  const actualizar = async (id, payload) => {
    const { data } = await api.put(`/casas/${id}`, payload);
    setCasas((prev) => prev.map((c) => (c.id_casa === id ? data : c)));
    return data;
  };

  const cambiarEstado = async (id, activo) => {
    const { data } = await api.patch(`/casas/${id}/estado`, { activo });
    setCasas((prev) => prev.map((c) => (c.id_casa === id ? data : c)));
    return data;
  };

  const eliminar = async (id) => {
    await api.delete(`/casas/${id}`);
    setCasas((prev) => prev.filter((c) => c.id_casa !== id));
  };

  return { casas, cargando, error, refrescar: obtenerTodas, crear, actualizar, cambiarEstado, eliminar };
};

export default useCasas;