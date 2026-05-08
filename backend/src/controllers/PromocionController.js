const { validationResult } = require('express-validator');
const PromocionService = require('../services/PromocionService');

const crear = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const id_producto = Number(req.params.id_producto);
    const promocion   = await PromocionService.crearPromocion(id_producto, req.body);
    return res.status(201).json(promocion);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const obtenerPorProducto = async (req, res) => {
  try {
    const promociones = await PromocionService.obtenerPorProducto(
      Number(req.params.id_producto),
    );
    return res.status(200).json(promociones);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const obtenerPorId = async (req, res) => {
  try {
    const promocion = await PromocionService.obtenerPorId(Number(req.params.id));
    return res.status(200).json(promocion);
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
    const promocion = await PromocionService.actualizarPromocion(Number(req.params.id), req.body);
    return res.status(200).json(promocion);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

// PATCH /api/promociones/:id/estado — cancelación manual antes de fecha_fin
const cambiarEstado = async (req, res) => {
  const { activo } = req.body;

  if (typeof activo !== 'boolean') {
    return res.status(400).json({ mensaje: 'El campo "activo" debe ser un booleano' });
  }

  // Solo se puede desactivar desde este endpoint (la activación es al crear)
  if (activo === true) {
    return res.status(400).json({ mensaje: 'Para activar una promoción, créela nuevamente' });
  }

  try {
    const resultado = await PromocionService.desactivarPromocion(Number(req.params.id));
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

// DELETE /api/promociones/:id — borrado físico
const eliminar = async (req, res) => {
  try {
    const resultado = await PromocionService.eliminarPromocion(Number(req.params.id));
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

module.exports = { crear, obtenerPorProducto, obtenerPorId, actualizar, cambiarEstado, eliminar };