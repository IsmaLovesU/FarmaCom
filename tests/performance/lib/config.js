const normalizarUrl = (url) => String(url || '').trim().replace(/\/+$/, '');

const convertirEnteroPositivo = (valor, valorPredeterminado) => {
  const numero = Number(valor);
  return Number.isInteger(numero) && numero > 0 ? numero : valorPredeterminado;
};

export const config = Object.freeze({
  apiUrl: normalizarUrl(__ENV.K6_API_URL || 'http://backend:3000/api'),
  correo: String(__ENV.K6_USER_EMAIL || '').trim(),
  contrasena: String(__ENV.K6_USER_PASSWORD || ''),
  idSucursal: convertirEnteroPositivo(__ENV.K6_BRANCH_ID, 1),
});

export const validarConfiguracion = () => {
  const faltantes = [];

  if (!config.correo) faltantes.push('K6_USER_EMAIL');
  if (!config.contrasena) faltantes.push('K6_USER_PASSWORD');

  if (faltantes.length > 0) {
    throw new Error(`Faltan variables requeridas: ${faltantes.join(', ')}`);
  }
};
