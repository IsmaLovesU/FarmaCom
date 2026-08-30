const ReporteDAO = require('../daos/ReporteDAO');

const obtenerMetricas = async (filtros = {}) => {
  const filtrosAplicados = {
    ...filtros,
    limite: filtros.limite === undefined ? 5 : Number(filtros.limite),
  };

  if (filtrosAplicados.id_sucursal) {
    filtrosAplicados.id_sucursal = Number(filtrosAplicados.id_sucursal);
  }

  return ReporteDAO.obtenerMetricas(filtrosAplicados);
};

module.exports = {
  obtenerMetricas,
};
