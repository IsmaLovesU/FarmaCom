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

const crearPagoPOS = async (req, res) => {
  if (responderErrores(req, res)) return;

  try {
    const pago = await VentaService.crearPagoPOS(req.body, req.usuario);
    return res.status(201).json(pago);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const obtenerEstadoPagoPOS = async (req, res) => {
  if (responderErrores(req, res)) return;

  try {
    const pago = await VentaService.obtenerEstadoPagoPOS(
      req.params.externalId,
      req.usuario,
    );
    return res.status(200).json(pago);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const obtenerTodas = async (req, res) => {
  if (responderErrores(req, res)) return;

  try {
    const ventas = await VentaService.obtenerTodas(req.query, req.usuario);
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

const asociarCliente = async (req, res) => {
  if (responderErrores(req, res)) return;

  try {
    const venta = await VentaService.asociarCliente(
      Number(req.params.id),
      req.body.id_cliente,
      req.usuario,
    );
    return res.status(200).json(venta);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const anular = async (req, res) => {
  if (responderErrores(req, res)) return;

  try {
    const venta = await VentaService.anularVenta(
      Number(req.params.id),
      req.body.motivo_anulacion,
      req.usuario,
    );
    return res.status(200).json(venta);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

module.exports = {
  crear,
  crearPagoPOS,
  obtenerEstadoPagoPOS,
  obtenerTodas,
  obtenerPorId,
  asociarCliente,
  anular,
};
