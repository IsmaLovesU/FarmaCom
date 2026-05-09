const { validationResult } = require('express-validator');
const CasaEmailService = require('../services/CasaEmailService');

const crear = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const id_casa = Number(req.params.id_casa);
    const { correo } = req.body;
    const email = await CasaEmailService.crearEmail({ id_casa, correo });
    return res.status(201).json(email);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const obtenerPorCasa = async (req, res) => {
  try {
    const id_casa = Number(req.params.id_casa);
    const emails = await CasaEmailService.obtenerPorCasa(id_casa);
    return res.status(200).json(emails);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const obtenerPorId = async (req, res) => {
  try {
    const email = await CasaEmailService.obtenerPorId(Number(req.params.id_email));
    return res.status(200).json(email);
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
    const email = await CasaEmailService.actualizarEmail(Number(req.params.id_email), req.body);
    return res.status(200).json(email);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const eliminar = async (req, res) => {
  try {
    const resultado = await CasaEmailService.eliminarEmail(Number(req.params.id_email));
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

module.exports = { crear, obtenerPorCasa, obtenerPorId, actualizar, eliminar };