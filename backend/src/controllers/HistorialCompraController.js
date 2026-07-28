const { validationResult } = require('express-validator');
const HistorialCompraService = require('../services/HistorialCompraService');

const responderErrores = (req, res) => {
  const errores = validationResult(req);
  if (errores.isEmpty()) return false;

  res.status(400).json({ errores: errores.array() });
  return true;
};

const obtenerPorCliente = async (req, res) => {
  if (responderErrores(req, res)) return;

  try {
    const historial = await HistorialCompraService.obtenerPorCliente(
      Number(req.params.id),
      req.query,
      req.usuario,
    );
    return res.status(200).json(historial);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

module.exports = { obtenerPorCliente };
