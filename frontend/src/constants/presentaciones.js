/**
 * Presentaciones válidas de un producto.
 *
 * Debe mantenerse sincronizado con backend/src/constants/presentaciones.js
 * y con la restricción chk_producto_presentacion del esquema.
 *
 * - valor:    lo que viaja al backend y se guarda en la base de datos
 * - etiqueta: cómo se muestra en singular (selects, ficha del producto)
 * - plural:   cómo se muestra acompañando una cantidad ("12 cajas")
 */

export const PRESENTACIONES = [
  { valor: 'caja', etiqueta: 'Caja', plural: 'cajas' },
  { valor: 'blister', etiqueta: 'Blíster', plural: 'blísteres' },
  { valor: 'unidad', etiqueta: 'Unidad', plural: 'unidades' },
];

export const SUFIJOS_CODIGO = {
  caja: 'CJ',
  blister: 'BL',
  unidad: 'UN',
};

export function obtenerEtiquetaPresentacion(valor) {
  const presentacion = PRESENTACIONES.find((item) => item.valor === valor);
  return presentacion ? presentacion.etiqueta : '';
}

export function obtenerPluralPresentacion(valor) {
  const presentacion = PRESENTACIONES.find((item) => item.valor === valor);
  return presentacion ? presentacion.plural : 'unidades';
}