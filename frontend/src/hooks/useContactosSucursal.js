import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export default function useContactosSucursal(idSucursal) {
  const [telefonos, setTelefonos] = useState([]);
  const [correos, setCorreos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    if (!idSucursal) return;
    setCargando(true);
    setError(null);
    try {
      const [resTel, resCor] = await Promise.all([
        api.get(`/sucursales/${idSucursal}/telefonos`),
        api.get(`/sucursales/${idSucursal}/correos`),
      ]);
      setTelefonos(resTel.data || []);
      setCorreos(resCor.data || []);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al cargar contactos');
    } finally {
      setCargando(false);
    }
  }, [idSucursal]);

  useEffect(() => { cargar(); }, [cargar]);

  const agregarTelefono = async (numero) => {
    const { data } = await api.post(`/sucursales/${idSucursal}/telefonos`, { numero });
    setTelefonos((prev) => [...prev, data]);
  };

  const actualizarTelefono = async (id, numero) => {
    const { data } = await api.put(`/telefonos/${id}`, { numero });
    setTelefonos((prev) => prev.map((t) => (t.id_telefono_sucursal === id ? data : t)));
  };

  const eliminarTelefono = async (id) => {
    await api.delete(`/telefonos/${id}`);
    setTelefonos((prev) => prev.filter((t) => t.id_telefono_sucursal !== id));
  };

  const agregarCorreo = async (correo) => {
    const { data } = await api.post(`/sucursales/${idSucursal}/correos`, { correo });
    setCorreos((prev) => [...prev, data]);
  };

  const actualizarCorreo = async (id, correo) => {
    const { data } = await api.put(`/correos/${id}`, { correo });
    setCorreos((prev) => prev.map((c) => (c.id_correo_sucursal === id ? data : c)));
  };

  const eliminarCorreo = async (id) => {
    await api.delete(`/correos/${id}`);
    setCorreos((prev) => prev.filter((c) => c.id_correo_sucursal !== id));
  };

  return {
    telefonos,
    correos,
    cargando,
    error,
    agregarTelefono,
    actualizarTelefono,
    eliminarTelefono,
    agregarCorreo,
    actualizarCorreo,
    eliminarCorreo,
  };
}
