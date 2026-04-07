const { validationResult } = require('express-validator');
const sucursalService = require('../services/SucursalService');

const crear = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const sucursal = await sucursalService.crearSucursal(req.body);
    return res.status(201).json(sucursal);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const obtenerTodas = async (req, res) => {
  try {
    const sucursales = await sucursalService.obtenerTodas();
    return res.status(200).json(sucursales);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const obtenerPorId = async (req, res) => {
  try {
    const sucursal = await sucursalService.obtenerPorId(Number(req.params.id));
    return res.status(200).json(sucursal);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const actualizar = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const sucursal = await sucursalService.actualizarSucursal(Number(req.params.id), req.body);
    return res.status(200).json(sucursal);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const eliminar = async (req, res) => {
  try {
    const resultado = await sucursalService.eliminarSucursal(Number(req.params.id));
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

module.exports = { crear, obtenerTodas, obtenerPorId, actualizar, eliminar };