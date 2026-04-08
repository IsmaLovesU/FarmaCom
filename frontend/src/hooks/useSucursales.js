import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const useSucursales = () => {
  const [sucursales, setSucursales] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const obtenerTodas = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const { data } = await api.get('/sucursales');
      setSucursales(data);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al cargar sucursales');
    } finally {
      setCargando(false);
    }
  }, []);

  const crear = async (datos) => {
    try {
      const { data } = await api.post('/sucursales', datos);
      setSucursales((prev) => [...prev, data]);
      return data;
    } catch (err) {
      const mensaje = err.response?.data?.mensaje || 'Error al crear sucursal';
      throw new Error(mensaje);
    }
  };

  const actualizar = async (id, datos) => {
    try {
      const { data } = await api.put(`/sucursales/${id}`, datos);
      setSucursales((prev) => prev.map((s) => (s.id_sucursal === id ? data : s)));
      return data;
    } catch (err) {
      const mensaje = err.response?.data?.mensaje || 'Error al actualizar sucursal';
      throw new Error(mensaje);
    }
  };

  const eliminar = async (id) => {
    try {
      await api.delete(`/sucursales/${id}`);
      setSucursales((prev) => prev.filter((s) => s.id_sucursal !== id));
    } catch (err) {
      const mensaje = err.response?.data?.mensaje || 'Error al eliminar sucursal';
      throw new Error(mensaje);
    }
  };

  useEffect(() => {
    obtenerTodas();
  }, [obtenerTodas]);

  return { sucursales, cargando, error, crear, actualizar, eliminar, refrescar: obtenerTodas };
};

export default useSucursales;