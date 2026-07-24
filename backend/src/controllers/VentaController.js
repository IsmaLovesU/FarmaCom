const { validationResult } = require('express-validator');
const VentaService = require('../services/VentaService');

const responderErrores = (req, res) => {
  const errores = validationResult(req);
  if (errores.isEmpty()) return false;

  res.status(400).json({ errores: errores.array() });
  return true;
};

const crear = async (req, res) => {
  if (responderErrores(req, res)) return;

  try {
    const venta = await VentaService.crearVenta(req.body, req.usuario);
    return res.status(201).json(venta);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const obtenerTodas = async (req, res) => {
  try {
    const ventas = await VentaService.obtenerTodas(req.usuario);
    return res.status(200).json(ventas);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const obtenerPorId = async (req, res) => {
  if (responderErrores(req, res)) return;

  try {
    const venta = await VentaService.obtenerPorId(
      Number(req.params.id),
      req.usuario,
    );
    return res.status(200).json(venta);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const actualizar = async (req, res) => {
  if (responderErrores(req, res)) return;

  try {
    const venta = await VentaService.actualizarVenta(
      Number(req.params.id),
      req.body,
      req.usuario,
    );
    return res.status(200).json(venta);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const eliminar = async (req, res) => {
  if (responderErrores(req, res)) return;

  try {
    const resultado = await VentaService.eliminarVenta(
      Number(req.params.id),
      req.usuario,
    );
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

module.exports = {
  crear,
  obtenerTodas,
  obtenerPorId,
  actualizar,
  eliminar,
};
