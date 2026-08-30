const ReporteDAO = require('../daos/ReporteDAO');

const obtenerResumenVentas = async (filtros = {}) => {
  const filtrosAplicados = { ...filtros };

  if (filtrosAplicados.id_sucursal) {
    filtrosAplicados.id_sucursal = Number(filtrosAplicados.id_sucursal);
  }

  return ReporteDAO.obtenerResumenVentas(filtrosAplicados);
};

module.exports = {
  obtenerResumenVentas,
};
