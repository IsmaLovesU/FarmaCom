/**
 * Presentaciones válidas de un producto.
 *
 * Es una lista fija: no hay tabla en la base de datos ni pantalla de
 * administración. Si algún día se agrega un valor nuevo, debe actualizarse
 */

const PRESENTACIONES = ['caja', 'blister', 'unidad'];
const normalizarPresentacion = (valor) => {
    return String(valor ?? '')
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
};

const esPresentacionValida = (valor) => {
    return PRESENTACIONES.includes(normalizarPresentacion(valor));
};

module.exports = {
    PRESENTACIONES,
    normalizarPresentacion,
    esPresentacionValida,
};