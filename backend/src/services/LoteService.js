const LoteDAO = require('../daos/LoteDAO');
const LotePresentacionDAO = require('../daos/LotePresentacionDAO');
const ProductoDAO = require('../daos/ProductoDAO');
const PresentacionDAO = require('../daos/PresentacionDAO');

//  Helpers 

const lanzarError = (mensaje, status) => {
  const err = new Error(mensaje);
  err.status = status;
  throw err;
};

//  Lote 

const crearLote = async (datos) => {
  const {
    id_producto,
    id_proveedor,
    id_sucursal,
    numero_lote,
    fecha_vencimiento,
    cantidad_ingresada,
    presentacion_ingreso,
    precios = [],
  } = datos;

  // Verificar que el producto exista y esté activo
  const producto = await ProductoDAO.obtenerPorId(id_producto);
  if (!producto)        lanzarError('Producto no encontrado', 404);
  if (!producto.activo) lanzarError('No se puede agregar un lote a un producto inactivo', 409);

  // Verificar que la presentación de ingreso exista y pertenezca al producto
  const presIngreso = await PresentacionDAO.obtenerPorId(presentacion_ingreso);
  if (!presIngreso)
    lanzarError('Presentación de ingreso no encontrada', 404);
  if (presIngreso.id_producto !== id_producto)
    lanzarError('La presentación de ingreso no pertenece a este producto', 400);
  if (!presIngreso.activo)
    lanzarError('La presentación de ingreso está inactiva', 409);

  // Verificar fecha de vencimiento, no puede ser pasada
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fechaVenc = new Date(fecha_vencimiento);
  if (isNaN(fechaVenc.getTime()))
    lanzarError('fecha_vencimiento no es una fecha válida', 400);
  if (fechaVenc <= hoy)
    lanzarError('La fecha de vencimiento debe ser posterior a hoy', 400);

  // Verificar cantidad
  if (!cantidad_ingresada || cantidad_ingresada <= 0)
    lanzarError('La cantidad ingresada debe ser mayor a 0', 400);

  // Número de lote único por producto y sucursal
  const duplicado = await LoteDAO.obtenerPorNumeroLote(numero_lote, id_producto, id_sucursal);
  if (duplicado)
    lanzarError(
      `Ya existe un lote con el número "${numero_lote}" para este producto en esta sucursal`,
      409,
    );

  // Calcular stock_inicial en unidades atómicas
  //     stock_inicial = cantidad_ingresada × factor_conversion de la presentación de ingreso
  const stock_inicial = parseFloat(
    (cantidad_ingresada * presIngreso.factor_conversion).toFixed(4),
  );

  // Validar precios antes de insertar nada
  if (!Array.isArray(precios) || precios.length === 0)
    lanzarError('Debe ingresar al menos un precio (precios[])', 400);

  for (const p of precios) {
    const pres = await PresentacionDAO.obtenerPorId(p.id_presentacion);
    if (!pres)
      lanzarError(`Presentación ${p.id_presentacion} no encontrada`, 404);
    if (pres.id_producto !== id_producto)
      lanzarError(`La presentación ${p.id_presentacion} no pertenece a este producto`, 400);
    if (!pres.activo)
      lanzarError(`La presentación ${p.id_presentacion} está inactiva`, 409);
    if (p.precio_venta === undefined || p.precio_venta < 0)
      lanzarError(`precio_venta inválido para presentación ${p.id_presentacion}`, 400);
    if (p.margen_ganancia === undefined || p.margen_ganancia < 0)
      lanzarError(`margen_ganancia inválido para presentación ${p.id_presentacion}`, 400);

    // Verificar consistencia mayoreo
    const tienePrecioMayoreo   = p.precio_mayoreo   != null;
    const tieneCantidadMayoreo = p.cantidad_mayoreo != null;
    if (tienePrecioMayoreo !== tieneCantidadMayoreo)
      lanzarError(
        `precio_mayoreo y cantidad_mayoreo deben definirse juntos (presentación ${p.id_presentacion})`,
        400,
      );
  }

  // Insertar lote
  const lote = await LoteDAO.crear({
    id_producto,
    id_proveedor,
    id_sucursal,
    numero_lote,
    fecha_vencimiento,
    cantidad_ingresada,
    presentacion_ingreso,
    stock_inicial,
  });

  // Insertar precios
  const preciosCreados = [];
  for (const p of precios) {
    const precio = await LotePresentacionDAO.crear({
      id_lote: lote.id_lote,
      id_presentacion:  p.id_presentacion,
      precio_venta:     p.precio_venta,
      margen_ganancia:  p.margen_ganancia,
      precio_mayoreo:   p.precio_mayoreo   ?? null,
      cantidad_mayoreo: p.cantidad_mayoreo ?? null,
    });
    preciosCreados.push(precio);
  }

  return { lote, precios: preciosCreados };
};

const obtenerPorSucursal = async (id_sucursal) => {
  return await LoteDAO.obtenerPorSucursal(id_sucursal);
};

const obtenerPorProducto = async (id_producto) => {
  const producto = await ProductoDAO.obtenerPorId(id_producto);
  if (!producto) lanzarError('Producto no encontrado', 404);
  return await LoteDAO.obtenerPorProducto(id_producto);
};

const obtenerPorId = async (id_lote) => {
  const lote = await LoteDAO.obtenerPorId(id_lote);
  if (!lote) lanzarError('Lote no encontrado', 404);

  const precios = await LotePresentacionDAO.obtenerPorLote(id_lote);
  return { ...lote, precios };
};

/**
 * Solo permite actualizar fecha_vencimiento y stock_actual.
 * El stock no puede quedar negativo ni superar el stock_inicial.
 */
const actualizarLote = async (id_lote, campos) => {
  const lote = await LoteDAO.obtenerPorId(id_lote);
  if (!lote) lanzarError('Lote no encontrado', 404);

  if (campos.fecha_vencimiento !== undefined) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaVenc = new Date(campos.fecha_vencimiento);
    if (isNaN(fechaVenc.getTime()))
      lanzarError('fecha_vencimiento no es una fecha válida', 400);
    if (fechaVenc <= hoy)
      lanzarError('La fecha de vencimiento debe ser posterior a hoy', 400);
  }

  if (campos.stock_actual !== undefined) {
    if (campos.stock_actual < 0)
      lanzarError('El stock actual no puede ser negativo', 400);
    if (campos.stock_actual > parseFloat(lote.stock_inicial))
      lanzarError('El stock actual no puede superar el stock inicial del lote', 400);
  }

  const actualizado = await LoteDAO.actualizar(id_lote, campos);
  if (!actualizado) lanzarError('No se pudo actualizar el lote', 500);
  return await obtenerPorId(id_lote);
};

//  Alertas

const obtenerAlertas = async (id_sucursal = null) => {
  return await LoteDAO.obtenerAlertas(id_sucursal);
};

//  LotePresentacion

const obtenerPreciosPorLote = async (id_lote) => {
  const lote = await LoteDAO.obtenerPorId(id_lote);
  if (!lote) lanzarError('Lote no encontrado', 404);
  return await LotePresentacionDAO.obtenerPorLote(id_lote);
};

/**
 * Actualiza el precio/margen de una presentación dentro de un lote.
 * Si se envía limpiar_mayoreo: true se eliminan precio_mayoreo y cantidad_mayoreo.
 */
const actualizarPrecio = async (id_lote, id_presentacion, campos) => {
  const registro = await LotePresentacionDAO.obtenerPorId(id_lote, id_presentacion);
  if (!registro) lanzarError('Precio no encontrado para ese lote y presentación', 404);

  if (campos.precio_venta !== undefined && campos.precio_venta < 0)
    lanzarError('El precio de venta no puede ser negativo', 400);

  if (campos.margen_ganancia !== undefined && campos.margen_ganancia < 0)
    lanzarError('El margen de ganancia no puede ser negativo', 400);

  // Limpiar mayoreo explícitamente
  if (campos.limpiar_mayoreo === true) {
    return await LotePresentacionDAO.limpiarMayoreo(id_lote, id_presentacion);
  }

  // Verificar consistencia mayoreo si se envían
  const tienePrecioMayoreo   = campos.precio_mayoreo   != null;
  const tieneCantidadMayoreo = campos.cantidad_mayoreo != null;
  if (tienePrecioMayoreo !== tieneCantidadMayoreo)
    lanzarError('precio_mayoreo y cantidad_mayoreo deben definirse juntos', 400);

  const actualizado = await LotePresentacionDAO.actualizar(id_lote, id_presentacion, campos);
  if (!actualizado) lanzarError('No se pudo actualizar el precio', 500);
  return actualizado;
};

const eliminarPrecio = async (id_lote, id_presentacion) => {
  // Verificar que no sea el único precio del lote
  const todos = await LotePresentacionDAO.obtenerPorLote(id_lote);
  if (todos.length <= 1)
    lanzarError('No se puede eliminar el único precio del lote', 409);

  const eliminado = await LotePresentacionDAO.eliminar(id_lote, id_presentacion);
  if (!eliminado) lanzarError('Precio no encontrado para ese lote y presentación', 404);
  return { mensaje: 'Precio eliminado correctamente' };
};

module.exports = {
  // Lote
  crearLote,
  obtenerPorSucursal,
  obtenerPorProducto,
  obtenerPorId,
  actualizarLote,
  obtenerAlertas,
  // LotePresentacion
  obtenerPreciosPorLote,
  actualizarPrecio,
  eliminarPrecio,
};