const { validationResult } = require('express-validator');
const ProveedorTelefonoService = require('../services/ProveedorTelefonoService');

const crear = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const id_proveedor = Number(req.params.id_proveedor);
    const { numero } = req.body;
    const telefono = await ProveedorTelefonoService.crearTelefono({ id_proveedor, numero });
    return res.status(201).json(telefono);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const obtenerPorProveedor = async (req, res) => {
  try {
    const id_proveedor = Number(req.params.id_proveedor);
    const telefonos = await ProveedorTelefonoService.obtenerPorProveedor(id_proveedor);
    return res.status(200).json(telefonos);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const obtenerPorId = async (req, res) => {
  try {
    const telefono = await ProveedorTelefonoService.obtenerPorId(Number(req.params.id_telefono));
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
    const telefono = await ProveedorTelefonoService.actualizarTelefono(Number(req.params.id_telefono), req.body);
    return res.status(200).json(telefono);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const eliminar = async (req, res) => {
  try {
    const resultado = await ProveedorTelefonoService.eliminarTelefono(Number(req.params.id_telefono));
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

module.exports = { crear, obtenerPorProveedor, obtenerPorId, actualizar, eliminar };