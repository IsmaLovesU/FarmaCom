const { validationResult } = require('express-validator');
const PresentacionService = require('../services/PresentacionService');

const responderErrores = (req, res) => {
  const errores = validationResult(req);
  if (errores.isEmpty()) return false;
  res.status(400).json({ errores: errores.array() });
  return true;
};

const crear = async (req, res) => {
  if (responderErrores(req, res)) return;
  try {
    const presentacion = await PresentacionService.crearPresentacion(req.body);
    res.status(201).json(presentacion);
  } catch (error) {
    res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const obtenerTodas = async (_req, res) => {
  try {
    res.status(200).json(await PresentacionService.obtenerTodas());
  } catch (error) {
    res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const obtenerPorId = async (req, res) => {
  if (responderErrores(req, res)) return;
  try {
    res.status(200).json(await PresentacionService.obtenerPorId(Number(req.params.id)));
  } catch (error) {
    res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const actualizar = async (req, res) => {
  if (responderErrores(req, res)) return;
  try {
    const presentacion = await PresentacionService.actualizarPresentacion(
      Number(req.params.id),
      req.body,
    );
    res.status(200).json(presentacion);
  } catch (error) {
    res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const eliminar = async (req, res) => {
  if (responderErrores(req, res)) return;
  try {
    res.status(200).json(await PresentacionService.eliminarPresentacion(Number(req.params.id)));
  } catch (error) {
    res.status(error.status || 500).json({ mensaje: error.message });
  }
};

module.exports = { crear, obtenerTodas, obtenerPorId, actualizar, eliminar };
