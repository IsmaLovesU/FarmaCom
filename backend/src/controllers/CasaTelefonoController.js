const { validationResult } = require('express-validator');
const CasaTelefonoService = require('../services/CasaTelefonoService');

const crear = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const id_casa = Number(req.params.id_casa);
    const { numero } = req.body;
    const telefono = await CasaTelefonoService.crearTelefono({ id_casa, numero });
    return res.status(201).json(telefono);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const obtenerPorCasa = async (req, res) => {
  try {
    const id_casa = Number(req.params.id_casa);
    const telefonos = await CasaTelefonoService.obtenerPorCasa(id_casa);
    return res.status(200).json(telefonos);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const obtenerPorId = async (req, res) => {
  try {
    const telefono = await CasaTelefonoService.obtenerPorId(Number(req.params.id_telefono));
    return res.status(200).json(telefono);
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
    const telefono = await CasaTelefonoService.actualizarTelefono(Number(req.params.id_telefono), req.body);
    return res.status(200).json(telefono);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const eliminar = async (req, res) => {
  try {
    const resultado = await CasaTelefonoService.eliminarTelefono(Number(req.params.id_telefono));
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

module.exports = { crear, obtenerPorCasa, obtenerPorId, actualizar, eliminar };