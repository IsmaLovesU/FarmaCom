import { useCallback, useState } from 'react';
import api from '../api/axios';

const obtenerMensajeError = (err, fallback) => {
  if (err.response?.data?.mensaje) return err.response.data.mensaje;

  const errores = err.response?.data?.errores;
  if (Array.isArray(errores) && errores.length > 0) {
    return errores[0].msg || fallback;
  }

  return fallback;
};

const useLotes = () => {
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  const crear = useCallback(async (payload) => {
    setGuardando(true);
    setError(null);

    try {
      const { data } = await api.post('/lotes', payload);
      return data;
    } catch (err) {
      const mensaje = err.response
        ? obtenerMensajeError(err, 'Error al crear lote')
        : err.message || 'Error al crear lote';
      setError(mensaje);
      throw new Error(mensaje);
    } finally {
      setGuardando(false);
    }
  }, []);

  const limpiarError = useCallback(() => {
    setError(null);
  }, []);

  return {
    guardando,
    error,
    crear,
    limpiarError,
  };
};

export default useLotes;
