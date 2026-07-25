import { useCallback, useEffect, useState } from 'react';
import api from '../api/axios';
import { construirCatalogoPOS } from '../utils/pos';

export default function useCatalogoPOS(idSucursal) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const cargarCatalogo = useCallback(async () => {
    if (!idSucursal) {
      setProductos([]);
      setError('No hay una sucursal activa para realizar la venta.');
      return;
    }

    setCargando(true);
    setError(null);

    try {
      const [respuestaInventario, respuestaLotes] = await Promise.all([
        api.get(`/sucursales/${idSucursal}/inventario`),
        api.get(`/lotes/sucursal/${idSucursal}`),
      ]);

      setProductos(construirCatalogoPOS(
        respuestaInventario.data,
        respuestaLotes.data,
      ));
    } catch (err) {
      setProductos([]);
      setError(
        err.response?.data?.mensaje
        || 'No se pudo cargar el catálogo del punto de venta.',
      );
    } finally {
      setCargando(false);
    }
  }, [idSucursal]);

  useEffect(() => {
    cargarCatalogo();
  }, [cargarCatalogo]);

  return {
    productos,
    cargando,
    error,
    refrescar: cargarCatalogo,
  };
}
