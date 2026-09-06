import http from 'k6/http';
import { group, sleep } from 'k6';
import { iniciarSesion } from './lib/auth.js';
import {
  comprobarArregloJson,
  comprobarObjetoJson,
  comprobarRespuestaJson,
} from './lib/checks.js';
import { config } from './lib/config.js';

const usuariosPorProporcion = (proporcion) => Math.max(
  1,
  Math.round(config.estres.usuariosMaximos * proporcion),
);

const usuariosRecuperacion = Math.min(
  config.estres.usuariosRecuperacion,
  config.estres.usuariosMaximos,
);

export const options = {
  noCookiesReset: true,
  scenarios: {
    estres_y_recuperacion: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: config.estres.calentamiento, target: 1 },
        { duration: config.estres.duracionEtapa, target: usuariosPorProporcion(0.25) },
        { duration: config.estres.duracionEtapa, target: usuariosPorProporcion(0.50) },
        { duration: config.estres.duracionEtapa, target: usuariosPorProporcion(0.75) },
        { duration: config.estres.duracionEtapa, target: config.estres.usuariosMaximos },
        { duration: config.estres.duracionEtapa, target: config.estres.usuariosMaximos },
        { duration: config.estres.duracionEtapa, target: usuariosRecuperacion },
        { duration: config.estres.duracionRecuperacion, target: usuariosRecuperacion },
        { duration: config.estres.enfriamiento, target: 0 },
      ],
      gracefulRampDown: '15s',
      tags: { flujo: 'estres-consultas' },
    },
  },
  thresholds: {
    checks: ['rate>0.95'],
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<5000'],
  },
};

let sesionIniciada = false;

const asegurarSesion = () => {
  if (!sesionIniciada) {
    iniciarSesion();
    sesionIniciada = true;
  }
};

const formatearFecha = (fecha) => fecha.toISOString().slice(0, 10);

const obtenerRangoReportes = () => {
  const fechaHasta = config.reportes.fechaHasta || formatearFecha(new Date());
  const inicioPredeterminado = new Date();
  inicioPredeterminado.setUTCDate(inicioPredeterminado.getUTCDate() - 30);
  const fechaDesde = config.reportes.fechaDesde || formatearFecha(inicioPredeterminado);

  return { fechaDesde, fechaHasta };
};

export default function () {
  asegurarSesion();
  const { fechaDesde, fechaHasta } = obtenerRangoReportes();
  const filtros = `id_sucursal=${config.idSucursal}&fecha_desde=${fechaDesde}&fecha_hasta=${fechaHasta}`;

  group('Estrés: consultas combinadas', () => {
    const respuestas = http.batch([
      [
        'GET',
        `${config.apiUrl}/productos/autocompletar?busqueda=a&limite=10`,
        null,
        { tags: { endpoint: 'autocompletar-pos', tipo: 'estres' } },
      ],
      [
        'GET',
        `${config.apiUrl}/sucursales/${config.idSucursal}/inventario`,
        null,
        { tags: { endpoint: 'inventario', tipo: 'estres' } },
      ],
      [
        'GET',
        `${config.apiUrl}/clientes`,
        null,
        { tags: { endpoint: 'clientes', tipo: 'estres' } },
      ],
      [
        'GET',
        `${config.apiUrl}/reportes/ventas/resumen?${filtros}`,
        null,
        { tags: { endpoint: 'resumen-ventas', tipo: 'estres' } },
      ],
      [
        'GET',
        `${config.apiUrl}/reportes/productos/top?${filtros}&limite=5&criterio=cantidad`,
        null,
        { tags: { endpoint: 'top-productos', tipo: 'estres' } },
      ],
    ]);

    const arreglos = [
      ['autocompletado', respuestas[0]],
      ['inventario', respuestas[1]],
      ['clientes', respuestas[2]],
      ['productos más vendidos', respuestas[4]],
    ];

    arreglos.forEach(([nombre, respuesta]) => {
      comprobarRespuestaJson(respuesta, nombre);
      comprobarArregloJson(respuesta, nombre);
    });

    comprobarRespuestaJson(respuestas[3], 'resumen de ventas');
    comprobarObjetoJson(respuestas[3], 'resumen de ventas');
  });

  sleep(0.5 + Math.random());
}
