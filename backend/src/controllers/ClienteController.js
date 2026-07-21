const { validationResult } = require('express-validator');
const clienteService = require('../services/ClienteService');

const responderErrores = (req, res) => {
  const errores = validationResult(req);
  if (errores.isEmpty()) return false;
  res.status(400).json({ errores: errores.array() });
  return true;
};

const crear = async (req, res) => {
  if (responderErrores(req, res)) return;
  try {
    res.status(201).json(await clienteService.crearCliente(req.body));
  } catch (error) {
    res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const obtenerTodas = async (_req, res) => {
  try {
    res.json(await clienteService.obtenerTodos());
  } catch (error) {
    res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const obtenerPorId = async (req, res) => {
  try {
    res.json(await clienteService.obtenerPorId(Number(req.params.id)));
  } catch (error) {
    res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const actualizar = async (req, res) => {
  if (responderErrores(req, res)) return;
  try {
    res.json(await clienteService.actualizarCliente(Number(req.params.id), req.body));
  } catch (error) {
    res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const eliminar = async (req, res) => {
  try {
    res.json(await clienteService.eliminarCliente(Number(req.params.id)));
  } catch (error) {
    res.status(error.status || 500).json({ mensaje: error.message });
  }
};

module.exports = { crear, obtenerTodas, obtenerPorId, actualizar, eliminar };
