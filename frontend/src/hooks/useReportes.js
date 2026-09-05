import { useCallback, useEffect, useState } from 'react';
import {
  obtenerMetodosPago,
  obtenerResumenVentas,
  obtenerSerieVentas,
  obtenerTopProductos,
} from '../api/reportes';

const RECURSOS = [
  {
    clave: 'resumen',
    cargar: obtenerResumenVentas,
    valorInicial: null,
    mensajeError: 'No se pudo cargar el resumen de ventas.',
  },
  {
    clave: 'serie',
    cargar: obtenerSerieVentas,
    valorInicial: [],
    mensajeError: 'No se pudo cargar la evolución de ventas.',
  },
  {
    clave: 'metodosPago',
    cargar: obtenerMetodosPago,
    valorInicial: [],
    mensajeError: 'No se pudo cargar la distribución de métodos de pago.',
  },
  {
    clave: 'topProductos',
    cargar: obtenerTopProductos,
    valorInicial: [],
    mensajeError: 'No se pudieron cargar los productos destacados.',
  },
];

const crearEstadoInicial = () => Object.fromEntries(
  RECURSOS.map(({ clave, valorInicial }) => [
    clave,
    { datos: valorInicial, cargando: true, error: null },
  ]),
);

const obtenerMensajeError = (error, mensajePredeterminado) => (
  error?.response?.data?.mensaje
  || error?.response?.data?.errores?.[0]?.msg
  || error?.message
  || mensajePredeterminado
);

export default function useReportes(filtros) {
  const [estado, setEstado] = useState(crearEstadoInicial);
  const [versionRecarga, setVersionRecarga] = useState(0);

  const recargar = useCallback(() => {
    setVersionRecarga((version) => version + 1);
  }, []);

  const idSucursal = filtros?.id_sucursal ?? '';
  const fechaDesde = filtros?.fecha_desde ?? '';
  const fechaHasta = filtros?.fecha_hasta ?? '';
  const agrupacion = filtros?.agrupacion ?? 'dia';
  const criterio = filtros?.criterio ?? 'cantidad';
  const limite = filtros?.limite ?? 5;

  useEffect(() => {
    const controller = new AbortController();
    const filtrosSolicitud = {
      id_sucursal: idSucursal,
      fecha_desde: fechaDesde,
      fecha_hasta: fechaHasta,
      agrupacion,
      criterio,
      limite,
    };

    setEstado((actual) => Object.fromEntries(
      RECURSOS.map(({ clave }) => [
        clave,
        { ...actual[clave], cargando: true, error: null },
      ]),
    ));

    const cargarRecurso = async ({ clave, cargar, valorInicial, mensajeError }) => {
      try {
        const datos = await cargar(filtrosSolicitud, { signal: controller.signal });

        if (controller.signal.aborted) return;

        setEstado((actual) => ({
          ...actual,
          [clave]: { datos, cargando: false, error: null },
        }));
      } catch (error) {
        if (controller.signal.aborted) return;

        setEstado((actual) => ({
          ...actual,
          [clave]: {
            datos: valorInicial,
            cargando: false,
            error: obtenerMensajeError(error, mensajeError),
          },
        }));
      }
    };

    const cargarReportes = async () => {
      await Promise.allSettled(RECURSOS.map(cargarRecurso));
    };

    cargarReportes();

    return () => controller.abort();
  }, [
    agrupacion,
    criterio,
    fechaDesde,
    fechaHasta,
    idSucursal,
    limite,
    versionRecarga,
  ]);

  return {
    ...estado,
    cargando: Object.values(estado).some((recurso) => recurso.cargando),
    recargar,
  };
}
