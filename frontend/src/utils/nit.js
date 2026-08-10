const PATRON_NIT = /^[0-9]{1,15}-?[0-9K]$/;

export const normalizarNit = (valor) => String(valor ?? '')
  .trim()
  .toUpperCase()
  .replace(/\s+/g, '');

export const esNitValido = (valor) => {
  const nit = normalizarNit(valor);
  return nit === '' || (nit.length <= 20 && PATRON_NIT.test(nit));
};

export const MENSAJE_NIT_INVALIDO =
  'Ingresa un NIT válido con dígitos, guion opcional y verificador numérico o K.';
