const ReporteDAO = require('../daos/ReporteDAO');

const CRITERIOS_TOP_PRODUCTOS = ['cantidad', 'ingresos'];

const normalizarFiltrosComunes = (filtros = {}) => {
  const filtrosAplicados = { ...filtros };

  if (filtrosAplicados.id_sucursal) {
    filtrosAplicados.id_sucursal = Number(filtrosAplicados.id_sucursal);
  }

  return filtrosAplicados;
};

const obtenerResumenVentas = async (filtros = {}) => {
  const filtrosAplicados = normalizarFiltrosComunes(filtros);
  return ReporteDAO.obtenerResumenVentas(filtrosAplicados);
};

const obtenerTopProductos = async (filtros = {}) => {
  const filtrosAplicados = normalizarFiltrosComunes({
    ...filtros,
    limite: filtros.limite === undefined ? 5 : Number(filtros.limite),
    criterio: filtros.criterio || 'cantidad',
  });

  if (!CRITERIOS_TOP_PRODUCTOS.includes(filtrosAplicados.criterio)) {
    const error = new Error('El criterio debe ser cantidad o ingresos');
    error.status = 400;
    throw error;
  }

  return ReporteDAO.obtenerTopProductos(filtrosAplicados);
};

module.exports = {
  obtenerResumenVentas,
  obtenerTopProductos,
};
