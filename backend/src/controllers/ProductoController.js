const { validationResult } = require('express-validator');
const ProductoService = require('../services/ProductoService');

const crear = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const producto = await ProductoService.crearProducto(req.body);
    return res.status(201).json(producto);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const obtenerTodos = async (req, res) => {
  try {
    const productos = await ProductoService.obtenerTodos();
    return res.status(200).json(productos);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const obtenerPorId = async (req, res) => {
  try {
    const producto = await ProductoService.obtenerPorId(Number(req.params.id));
    return res.status(200).json(producto);
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
    const producto = await ProductoService.actualizarProducto(Number(req.params.id), req.body);
    return res.status(200).json(producto);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

// PATCH /api/productos/:id/mayoreo — exclusivo para dependiente (interruptor POS)
const cambiarAplicaMayoreo = async (req, res) => {
  const { aplica_mayoreo } = req.body;

  if (typeof aplica_mayoreo !== 'boolean') {
    return res.status(400).json({ mensaje: 'El campo "aplica_mayoreo" debe ser un booleano' });
  }

  try {
    const resultado = await ProductoService.cambiarAplicaMayoreo(Number(req.params.id), aplica_mayoreo);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

// PATCH /api/productos/:id/estado — desactiva o reactiva
const cambiarEstado = async (req, res) => {
  const { activo } = req.body;

  if (typeof activo !== 'boolean') {
    return res.status(400).json({ mensaje: 'El campo "activo" debe ser un booleano' });
  }

  try {
    const resultado = activo
      ? await ProductoService.reactivarProducto(Number(req.params.id))
      : await ProductoService.desactivarProducto(Number(req.params.id));

    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

module.exports = { crear, obtenerTodos, obtenerPorId, actualizar, cambiarAplicaMayoreo, cambiarEstado };