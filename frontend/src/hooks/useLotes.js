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

const normalizarTexto = (valor) => valor.trim().toLowerCase();

const formatearFactor = (valor) => {
  const numero = Number(valor);
  if (!Number.isFinite(numero)) return valor;
  return Number.isInteger(numero) ? String(numero) : numero.toString();
};

const resolverPresentacionIngreso = async (payload) => {
  const nombre = payload.presentacion_ingreso.trim();
  const factorConversion = Number(payload.factor_conversion_ingreso);

  const { data: presentaciones } = await api.get(`/productos/${payload.id_producto}/presentaciones`);
  const existente = (presentaciones || []).find(
    (presentacion) => presentacion.activo && normalizarTexto(presentacion.nombre) === normalizarTexto(nombre),
  );

  if (existente) {
    if (Number(existente.factor_conversion) !== factorConversion) {
      throw new Error(
        `Ya existe la presentación "${existente.nombre}" con factor ${formatearFactor(existente.factor_conversion)}. ` +
        'Usa ese factor o escribe otro nombre de presentación.',
      );
    }

    return existente;
  }

  const { data } = await api.post(`/productos/${payload.id_producto}/presentaciones`, {
    nombre,
    factor_conversion: factorConversion,
    es_base: false,
  });

  return data;
};

const prepararPayloadLote = async (payload) => {
  const presentacion = await resolverPresentacionIngreso(payload);

  return {
    id_producto: payload.id_producto,
    id_proveedor: payload.id_proveedor,
    id_sucursal: payload.id_sucursal,
    numero_lote: payload.numero_lote,
    fecha_vencimiento: payload.fecha_vencimiento,
    cantidad_ingresada: payload.cantidad_ingresada,
    presentacion_ingreso: presentacion.id_presentacion,
    precios: payload.precios.map((precio) => ({
      id_presentacion: presentacion.id_presentacion,
      precio_venta: precio.precio_venta,
      margen_ganancia: precio.margen_ganancia,
      precio_mayoreo: precio.precio_mayoreo,
      cantidad_mayoreo: precio.cantidad_mayoreo,
    })),
  };
};

const useLotes = () => {
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  const crear = useCallback(async (payload) => {
    setGuardando(true);
    setError(null);

    try {
      const payloadLote = await prepararPayloadLote(payload);
      const { data } = await api.post('/lotes', payloadLote);
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
