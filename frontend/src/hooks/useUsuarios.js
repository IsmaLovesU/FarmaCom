import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const obtenerTodos = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const { data } = await api.get('/usuarios');
      setUsuarios(data);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al cargar usuarios');
    } finally {
      setCargando(false);
    }
  }, []);

  const crear = async (datos) => {
    try {
      const { data } = await api.post('/usuarios', datos);
      setUsuarios((prev) => [...prev, data]);
      return data;
    } catch (err) {
      const mensaje = err.response?.data?.mensaje || 'Error al crear usuario';
      throw new Error(mensaje);
    }
  };

  const actualizar = async (id, datos) => {
    try {
      const { data } = await api.put(`/usuarios/${id}`, datos);
      setUsuarios((prev) => prev.map((u) => (u.id_usuario === id ? data : u)));
      return data;
    } catch (err) {
      const mensaje = err.response?.data?.mensaje || 'Error al actualizar usuario';
      throw new Error(mensaje);
    }
  };

  const cambiarEstado = async (id, estado) => {
    try {
      const { data } = await api.patch(`/usuarios/${id}/estado`, { estado });
      setUsuarios((prev) => prev.map((u) => (u.id_usuario === id ? data : u)));
      return data;
    } catch (err) {
      const mensaje = err.response?.data?.mensaje || 'Error al cambiar estado del usuario';
      throw new Error(mensaje);
    }
  };

  useEffect(() => {
    obtenerTodos();
  }, [obtenerTodos]);

  return { usuarios, cargando, error, crear, actualizar, cambiarEstado, refrescar: obtenerTodos };
};

export default useUsuarios;
