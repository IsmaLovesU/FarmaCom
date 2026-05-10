import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const useProductos = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const obtenerTodos = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const { data } = await api.get('/productos');
      setProductos(data);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al cargar productos');
    } finally {
      setCargando(false);
    }
  }, []);

  const crear = async (datos) => {
    try {
      const { data } = await api.post('/productos', datos);
      setProductos((prev) => [...prev, data]);
      return data;
    } catch (err) {
      const mensaje = err.response?.data?.mensaje || 'Error al crear producto';
      throw new Error(mensaje);
    }
  };

  const actualizar = async (id, datos) => {
    try {
      const { data } = await api.put(`/productos/${id}`, datos);
      setProductos((prev) => prev.map((p) => (p.id_producto === id ? data : p)));
      return data;
    } catch (err) {
      const mensaje = err.response?.data?.mensaje || 'Error al actualizar producto';
      throw new Error(mensaje);
    }
  };

  const cambiarEstado = async (id, activo) => {
    try {
      const { data } = await api.patch(`/productos/${id}/estado`, { activo });
      setProductos((prev) => prev.map((p) => (p.id_producto === id ? { ...p, ...data.producto } : p)));
      return data;
    } catch (err) {
      const mensaje = err.response?.data?.mensaje || 'Error al cambiar estado del producto';
      throw new Error(mensaje);
    }
  };

  useEffect(() => {
    obtenerTodos();
  }, [obtenerTodos]);

  return { productos, cargando, error, crear, actualizar, cambiarEstado, refrescar: obtenerTodos };
};

export default useProductos;