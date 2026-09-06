const normalizarUrl = (url) => String(url || '').trim().replace(/\/+$/, '');

const convertirEnteroPositivo = (valor, valorPredeterminado) => {
  const numero = Number(valor);
  return Number.isInteger(numero) && numero > 0 ? numero : valorPredeterminado;
};

const convertirTexto = (valor, valorPredeterminado) => {
  const texto = String(valor || '').trim();
  return texto || valorPredeterminado;
};

export const config = Object.freeze({
  apiUrl: normalizarUrl(__ENV.K6_API_URL || 'http://backend:3000/api'),
  correo: String(__ENV.K6_USER_EMAIL || '').trim(),
  contrasena: String(__ENV.K6_USER_PASSWORD || ''),
  idSucursal: convertirEnteroPositivo(__ENV.K6_BRANCH_ID, 1),
  carga: Object.freeze({
    usuariosPOS: convertirEnteroPositivo(__ENV.K6_LOAD_POS_VUS, 3),
    usuariosGestion: convertirEnteroPositivo(__ENV.K6_LOAD_MANAGEMENT_VUS, 2),
    usuariosReportes: convertirEnteroPositivo(__ENV.K6_LOAD_REPORTS_VUS, 1),
    incremento: convertirTexto(__ENV.K6_LOAD_RAMP_UP, '30s'),
    duracionEstable: convertirTexto(__ENV.K6_LOAD_STEADY_DURATION, '4m'),
    descenso: convertirTexto(__ENV.K6_LOAD_RAMP_DOWN, '30s'),
  }),
  reportes: Object.freeze({
    fechaDesde: String(__ENV.K6_REPORT_DATE_FROM || '').trim(),
    fechaHasta: String(__ENV.K6_REPORT_DATE_TO || '').trim(),
  }),
});

export const validarConfiguracion = () => {
  const faltantes = [];

  if (!config.correo) faltantes.push('K6_USER_EMAIL');
  if (!config.contrasena) faltantes.push('K6_USER_PASSWORD');

  if (faltantes.length > 0) {
    throw new Error(`Faltan variables requeridas: ${faltantes.join(', ')}`);
  }
};
