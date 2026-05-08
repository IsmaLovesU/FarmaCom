const PresentacionDAO = require('../daos/PresentacionDAO');
const ProductoDAO     = require('../daos/ProductoDAO');

// Helpers

const lanzarError = (mensaje, status) => {
  const err = new Error(mensaje);
  err.status = status;
  throw err;
};

// Operaciones

const crearPresentacion = async (id_producto, datos, forzar_cambio_base = false) => {
  const { nombre, factor_conversion, es_base } = datos;

  const producto = await ProductoDAO.obtenerPorId(id_producto);
  if (!producto) lanzarError('Producto no encontrado', 404);

  if (!nombre || nombre.trim() === '') lanzarError('El nombre es requerido', 400);
  if (!factor_conversion || factor_conversion < 1) {
    lanzarError('El factor de conversión debe ser mayor o igual a 1', 400);
  }

  if (es_base) {
    const baseExistente = await PresentacionDAO.obtenerBaseActiva(id_producto);

    if (baseExistente) {
      if (!forzar_cambio_base) {
        const error = new Error(
          `Ya existe una presentación base para este producto ("${baseExistente.nombre}"). ` +
          `¿Desea reemplazarla? Envíe forzar_cambio_base: true para confirmar.`,
        );
        error.status = 409;
        error.requiere_confirmacion = true;
        error.base_actual = baseExistente;
        throw error;
      }
      // Confirmado: quitar es_base a todas las presentaciones del producto
      await PresentacionDAO.desmarcarBase(id_producto, 0);
    }
  }

  return await PresentacionDAO.crear({ id_producto, nombre, factor_conversion, es_base: es_base ?? false });
};

const obtenerPorProducto = async (id_producto) => {
  const producto = await ProductoDAO.obtenerPorId(id_producto);
  if (!producto) lanzarError('Producto no encontrado', 404);
  return await PresentacionDAO.obtenerPorProducto(id_producto);
};

const obtenerPorId = async (id_presentacion) => {
  const presentacion = await PresentacionDAO.obtenerPorId(id_presentacion);
  if (!presentacion) lanzarError('Presentación no encontrada', 404);
  return presentacion;
};

const actualizarPresentacion = async (id_presentacion, campos, forzar_cambio_base = false) => {
  const existente = await PresentacionDAO.obtenerPorId(id_presentacion);
  if (!existente) lanzarError('Presentación no encontrada', 404);

  if (campos.factor_conversion !== undefined) {
    const tieneLotes = await PresentacionDAO.tieneLotes(id_presentacion);
    if (tieneLotes) {
      lanzarError(
        'No se puede modificar el factor de conversión porque esta presentación ya tiene lotes asignados',
        409,
      );
    }
    if (campos.factor_conversion < 1) {
      lanzarError('El factor de conversión debe ser mayor o igual a 1', 400);
    }
  }

  if (campos.es_base === true && !existente.es_base) {
    const baseExistente = await PresentacionDAO.obtenerBaseActiva(
      existente.id_producto,
      id_presentacion,
    );

    if (baseExistente) {
      if (!forzar_cambio_base) {
        const error = new Error(
          `Ya existe una presentación base para este producto ("${baseExistente.nombre}"). ` +
          `¿Desea reemplazarla? Envíe forzar_cambio_base: true para confirmar.`,
        );
        error.status = 409;
        error.requiere_confirmacion = true;
        error.base_actual = baseExistente;
        throw error;
      }
      await PresentacionDAO.desmarcarBase(existente.id_producto, id_presentacion);
    }
  }

  const actualizado = await PresentacionDAO.actualizar(id_presentacion, campos);
  if (!actualizado) lanzarError('No se pudo actualizar la presentación', 500);
  return actualizado;
};

const desactivarPresentacion = async (id_presentacion) => {
  const existente = await PresentacionDAO.obtenerPorId(id_presentacion);
  if (!existente)        lanzarError('Presentación no encontrada', 404);
  if (!existente.activo) lanzarError('La presentación ya está desactivada', 409);

  const tieneLotes = await PresentacionDAO.tieneLotes(id_presentacion);
  if (tieneLotes) {
    lanzarError(
      'No se puede desactivar esta presentación porque tiene lotes asignados',
      409,
    );
  }

  const totalActivas = await PresentacionDAO.contarActivasPorProducto(existente.id_producto);
  if (totalActivas <= 1) {
    lanzarError('No se puede desactivar la única presentación activa del producto', 409);
  }

  if (existente.es_base) {
    lanzarError(
      'No se puede desactivar la presentación base. Asigne otra presentación como base primero',
      409,
    );
  }

  const resultado = await PresentacionDAO.cambiarActivo(id_presentacion, false);
  return { mensaje: 'Presentación desactivada correctamente', presentacion: resultado };
};

const reactivarPresentacion = async (id_presentacion) => {
  const existente = await PresentacionDAO.obtenerPorId(id_presentacion);
  if (!existente)       lanzarError('Presentación no encontrada', 404);
  if (existente.activo) lanzarError('La presentación ya está activa', 409);

  const resultado = await PresentacionDAO.cambiarActivo(id_presentacion, true);
  return { mensaje: 'Presentación reactivada correctamente', presentacion: resultado };
};

module.exports = {
  crearPresentacion,
  obtenerPorProducto,
  obtenerPorId,
  actualizarPresentacion,
  desactivarPresentacion,
  reactivarPresentacion,
};