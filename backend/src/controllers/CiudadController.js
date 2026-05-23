const { validationResult } = require('express-validator');
const ciudadService = require('../services/CiudadService');

const crear = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const ciudad = await ciudadService.crearCiudad(req.body);
    return res.status(201).json(ciudad);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const obtenerTodas = async (req, res) => {
  try {
    const ciudades = await ciudadService.obtenerTodas();
    return res.status(200).json(ciudades);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const obtenerPorId = async (req, res) => {
  try {
    const ciudad = await ciudadService.obtenerPorId(Number(req.params.id));
    return res.status(200).json(ciudad);
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
    const ciudad = await ciudadService.actualizarCiudad(Number(req.params.id), req.body);
    return res.status(200).json(ciudad);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const eliminar = async (req, res) => {
  try {
    const resultado = await ciudadService.eliminarCiudad(Number(req.params.id));
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

module.exports = { crear, obtenerTodas, obtenerPorId, actualizar, eliminar };
