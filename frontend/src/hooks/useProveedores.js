import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const useProveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const obtenerTodos = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const { data } = await api.get('/proveedores');
      setProveedores(data);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al cargar proveedores');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    obtenerTodos();
  }, [obtenerTodos]);

  return { proveedores, cargando, error, refrescar: obtenerTodos };
};

export default useProveedores;