const { validationResult } = require('express-validator');
const PresentacionService = require('../services/PresentacionService');

const crear = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const id_producto        = Number(req.params.id_producto);
    const forzar_cambio_base = req.body.forzar_cambio_base === true;

    const presentacion = await PresentacionService.crearPresentacion(
      id_producto,
      req.body,
      forzar_cambio_base,
    );
    return res.status(201).json(presentacion);
  } catch (error) {
    if (error.requiere_confirmacion) {
      return res.status(409).json({
        mensaje:               error.message,
        requiere_confirmacion: true,
        base_actual:           error.base_actual,
      });
    }
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const obtenerPorProducto = async (req, res) => {
  try {
    const presentaciones = await PresentacionService.obtenerPorProducto(
      Number(req.params.id_producto),
    );
    return res.status(200).json(presentaciones);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

const obtenerPorId = async (req, res) => {
  try {
    const presentacion = await PresentacionService.obtenerPorId(Number(req.params.id));
    return res.status(200).json(presentacion);
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
    const forzar_cambio_base = req.body.forzar_cambio_base === true;
    const presentacion = await PresentacionService.actualizarPresentacion(
      Number(req.params.id),
      req.body,
      forzar_cambio_base,
    );
    return res.status(200).json(presentacion);
  } catch (error) {
    if (error.requiere_confirmacion) {
      return res.status(409).json({
        mensaje:               error.message,
        requiere_confirmacion: true,
        base_actual:           error.base_actual,
      });
    }
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

// PATCH /api/presentaciones/:id/estado
const cambiarEstado = async (req, res) => {
  const { activo } = req.body;

  if (typeof activo !== 'boolean') {
    return res.status(400).json({ mensaje: 'El campo "activo" debe ser un booleano' });
  }

  try {
    const resultado = activo
      ? await PresentacionService.reactivarPresentacion(Number(req.params.id))
      : await PresentacionService.desactivarPresentacion(Number(req.params.id));

    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

module.exports = { crear, obtenerPorProducto, obtenerPorId, actualizar, cambiarEstado };