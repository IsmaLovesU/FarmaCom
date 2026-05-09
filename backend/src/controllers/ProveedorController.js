const { validationResult } = require('express-validator');
const ProveedorService = require('../services/ProveedorService');

const crear = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const proveedor = await ProveedorService.crearProveedor(req.body);
    return res.status(201).json(proveedor);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const obtenerTodos = async (req, res) => {
  try {
    const proveedores = await ProveedorService.obtenerTodos();
    return res.status(200).json(proveedores);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const obtenerPorId = async (req, res) => {
  try {
    const proveedor = await ProveedorService.obtenerPorId(Number(req.params.id));
    return res.status(200).json(proveedor);
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
    const proveedor = await ProveedorService.actualizarProveedor(Number(req.params.id), req.body);
    return res.status(200).json(proveedor);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

// PATCH /api/proveedores/:id/estado — activa o desactiva (baja lógica)
const cambiarEstado = async (req, res) => {
  const { activo } = req.body;

  if (typeof activo !== 'boolean') {
    return res.status(400).json({ mensaje: 'El campo "activo" debe ser un booleano' });
  }

  try {
    const resultado = await ProveedorService.cambiarEstado(Number(req.params.id), activo);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const eliminar = async (req, res) => {
  try {
    const resultado = await ProveedorService.eliminarProveedor(Number(req.params.id));
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

module.exports = { crear, obtenerTodos, obtenerPorId, actualizar, cambiarEstado, eliminar };