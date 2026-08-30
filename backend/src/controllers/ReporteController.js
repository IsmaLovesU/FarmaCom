const { validationResult } = require('express-validator');
const ReporteService = require('../services/ReporteService');

const responderErrores = (req, res) => {
  const errores = validationResult(req);
  if (errores.isEmpty()) return false;

  res.status(400).json({ errores: errores.array() });
  return true;
};

const obtenerResumenVentas = async (req, res) => {
  if (responderErrores(req, res)) return;

  try {
    const resumen = await ReporteService.obtenerResumenVentas(req.query);
    return res.status(200).json(resumen);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

module.exports = {
  obtenerResumenVentas,
};
