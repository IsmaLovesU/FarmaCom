const { validationResult } = require('express-validator');
const ProveedorEmailService = require('../services/ProveedorEmailService');

const crear = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const id_proveedor = Number(req.params.id_proveedor);
    const { correo } = req.body;
    const email = await ProveedorEmailService.crearEmail({ id_proveedor, correo });
    return res.status(201).json(email);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const obtenerPorProveedor = async (req, res) => {
  try {
    const id_proveedor = Number(req.params.id_proveedor);
    const emails = await ProveedorEmailService.obtenerPorProveedor(id_proveedor);
    return res.status(200).json(emails);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const obtenerPorId = async (req, res) => {
  try {
    const email = await ProveedorEmailService.obtenerPorId(Number(req.params.id_email));
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
    const email = await ProveedorEmailService.actualizarEmail(Number(req.params.id_email), req.body);
    return res.status(200).json(email);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const eliminar = async (req, res) => {
  try {
    const resultado = await ProveedorEmailService.eliminarEmail(Number(req.params.id_email));
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

module.exports = { crear, obtenerPorProveedor, obtenerPorId, actualizar, eliminar };