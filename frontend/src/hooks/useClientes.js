import { useCallback, useEffect, useState } from 'react';
import api from '../api/axios';

export default function useClientes() {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const obtenerTodos = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const { data } = await api.get('/clientes');
      setClientes(data);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudieron cargar los clientes.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { obtenerTodos(); }, [obtenerTodos]);

  const crear = async (payload) => {
    const { data } = await api.post('/clientes', payload);
    setClientes((prev) => [...prev, data].sort((a, b) => a.nombre_cliente.localeCompare(b.nombre_cliente)));
    return data;
  };
  const actualizar = async (id, payload) => {
    const { data } = await api.put(`/clientes/${id}`, payload);
    setClientes((prev) => prev.map((cliente) => (cliente.id_cliente === id ? data : cliente))
      .sort((a, b) => a.nombre_cliente.localeCompare(b.nombre_cliente)));
    return data;
  };
  const eliminar = async (id) => {
    await api.delete(`/clientes/${id}`);
    setClientes((prev) => prev.filter((cliente) => cliente.id_cliente !== id));
  };

  return { clientes, cargando, error, crear, actualizar, eliminar, refrescar: obtenerTodos };
}
