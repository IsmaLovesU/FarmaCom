import http from 'k6/http';
import { group, sleep } from 'k6';
import { iniciarSesion } from './lib/auth.js';
import {
  comprobarArregloJson,
  comprobarObjetoJson,
  comprobarRespuestaJson,
} from './lib/checks.js';
import { config } from './lib/config.js';

const etapas = (usuarios) => [
  { duration: config.carga.incremento, target: usuarios },
  { duration: config.carga.duracionEstable, target: usuarios },
  { duration: config.carga.descenso, target: 0 },
];

export const options = {
  noCookiesReset: true,
  scenarios: {
    punto_venta: {
      executor: 'ramping-vus',
      exec: 'consultarPuntoVenta',
      startVUs: 0,
      stages: etapas(config.carga.usuariosPOS),
      gracefulRampDown: '10s',
      tags: { flujo: 'punto-venta' },
    },
    gestion: {
      executor: 'ramping-vus',
      exec: 'consultarGestion',
      startVUs: 0,
      stages: etapas(config.carga.usuariosGestion),
      gracefulRampDown: '10s',
      tags: { flujo: 'gestion' },
    },
    reportes: {
      executor: 'ramping-vus',
      exec: 'consultarReportes',
      startVUs: 0,
      stages: etapas(config.carga.usuariosReportes),
      gracefulRampDown: '10s',
      tags: { flujo: 'reportes' },
    },
  },
  thresholds: {
    checks: ['rate>0.98'],
    http_req_failed: ['rate<0.02'],
    http_req_duration: ['p(95)<3000'],
    'http_req_duration{tipo:consulta}': ['p(95)<2000'],
    'http_req_duration{tipo:reporte}': ['p(95)<3000'],
  },
};

let sesionIniciada = false;

const asegurarSesion = () => {
  if (!sesionIniciada) {
    iniciarSesion();
    sesionIniciada = true;
  }
};

const pausaUsuario = () => sleep(1 + Math.random() * 2);

const formatearFecha = (fecha) => fecha.toISOString().slice(0, 10);

const obtenerRangoReportes = () => {
  const fechaHasta = config.reportes.fechaHasta || formatearFecha(new Date());
  const inicioPredeterminado = new Date();
  inicioPredeterminado.setUTCDate(inicioPredeterminado.getUTCDate() - 30);
  const fechaDesde = config.reportes.fechaDesde || formatearFecha(inicioPredeterminado);

  return { fechaDesde, fechaHasta };
};

export function consultarPuntoVenta() {
  asegurarSesion();

  group('Carga: punto de venta', () => {
    const respuestas = http.batch([
      [
        'GET',
        `${config.apiUrl}/productos/autocompletar?busqueda=a&limite=10`,
        null,
        { tags: { endpoint: 'autocompletar-pos', tipo: 'consulta' } },
      ],
      [
        'GET',
        `${config.apiUrl}/sucursales/${config.idSucursal}/inventario`,
        null,
        { tags: { endpoint: 'inventario', tipo: 'consulta' } },
      ],
      [
        'GET',
        `${config.apiUrl}/cajas?id_sucursal=${config.idSucursal}&activa=true`,
        null,
        { tags: { endpoint: 'cajas-activas', tipo: 'consulta' } },
      ],
    ]);

    const nombres = ['autocompletado', 'inventario', 'cajas activas'];
    respuestas.forEach((respuesta, indice) => {
      comprobarRespuestaJson(respuesta, nombres[indice]);
      comprobarArregloJson(respuesta, nombres[indice]);
    });
  });

  pausaUsuario();
}

export function consultarGestion() {
  asegurarSesion();

  group('Carga: gestión', () => {
    const respuestas = http.batch([
      [
        'GET',
        `${config.apiUrl}/clientes`,
        null,
        { tags: { endpoint: 'clientes', tipo: 'consulta' } },
      ],
      [
        'GET',
        `${config.apiUrl}/productos`,
        null,
        { tags: { endpoint: 'productos', tipo: 'consulta' } },
      ],
      [
        'GET',
        `${config.apiUrl}/sucursales/${config.idSucursal}/inventario/resumen`,
        null,
        { tags: { endpoint: 'resumen-inventario', tipo: 'consulta' } },
      ],
    ]);

    comprobarRespuestaJson(respuestas[0], 'clientes');
    comprobarArregloJson(respuestas[0], 'clientes');
    comprobarRespuestaJson(respuestas[1], 'productos');
    comprobarArregloJson(respuestas[1], 'productos');
    comprobarRespuestaJson(respuestas[2], 'resumen de inventario');
    comprobarObjetoJson(respuestas[2], 'resumen de inventario');
  });

  pausaUsuario();
}

export function consultarReportes() {
  asegurarSesion();
  const { fechaDesde, fechaHasta } = obtenerRangoReportes();
  const filtros = `id_sucursal=${config.idSucursal}&fecha_desde=${fechaDesde}&fecha_hasta=${fechaHasta}`;

  group('Carga: reportes', () => {
    const respuestas = http.batch([
      [
        'GET',
        `${config.apiUrl}/reportes/ventas/resumen?${filtros}`,
        null,
        { tags: { endpoint: 'resumen-ventas', tipo: 'reporte' } },
      ],
      [
        'GET',
        `${config.apiUrl}/reportes/ventas/serie?${filtros}&agrupacion=dia`,
        null,
        { tags: { endpoint: 'serie-ventas', tipo: 'reporte' } },
      ],
      [
        'GET',
        `${config.apiUrl}/reportes/ventas/metodos-pago?${filtros}`,
        null,
        { tags: { endpoint: 'metodos-pago', tipo: 'reporte' } },
      ],
      [
        'GET',
        `${config.apiUrl}/reportes/productos/top?${filtros}&limite=5&criterio=cantidad`,
        null,
        { tags: { endpoint: 'top-productos', tipo: 'reporte' } },
      ],
    ]);

    comprobarRespuestaJson(respuestas[0], 'resumen de ventas');
    comprobarObjetoJson(respuestas[0], 'resumen de ventas');

    const nombres = ['serie de ventas', 'métodos de pago', 'productos más vendidos'];
    respuestas.slice(1).forEach((respuesta, indice) => {
      comprobarRespuestaJson(respuesta, nombres[indice]);
      comprobarArregloJson(respuesta, nombres[indice]);
    });
  });

  pausaUsuario();
}
