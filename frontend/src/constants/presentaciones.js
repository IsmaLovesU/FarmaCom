/**
 * Las presentaciones (Caja, Blister, Unidad, ...) ya no son una lista fija:
 * viven en la tabla `presentacion` del backend y se administran via
 * `usePresentaciones`. Lo unico que queda como constante es la forma de
 * derivar un plural y un sufijo de codigo a partir del nombre.
 */

const CODIGO_INICIO_DIACRITICO = 0x0300;
const CODIGO_FIN_DIACRITICO = 0x036f;

const esMarcaDiacritica = (caracter) => {
  const codigo = caracter.codePointAt(0);
  return codigo >= CODIGO_INICIO_DIACRITICO && codigo <= CODIGO_FIN_DIACRITICO;
};

const sinAcentos = (texto) => texto.normalize('NFD')
  .split('')
  .filter((caracter) => !esMarcaDiacritica(caracter))
  .join('');

export function pluralizarPresentacion(nombre) {
  if (!nombre) return '';
  const ultimaLetra = sinAcentos(nombre.trim().slice(-1)).toLowerCase();
  const esVocal = 'aeiou'.includes(ultimaLetra);
  return `${nombre}${esVocal ? 's' : 'es'}`;
}

export function sufijoPresentacion(nombre) {
  if (!nombre) return '';
  return sinAcentos(nombre.trim()).slice(0, 2).toUpperCase();
}
