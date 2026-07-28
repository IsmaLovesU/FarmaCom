const LoteDAO = require('../daos/LoteDAO');
const ProductoDAO = require('../daos/ProductoDAO');

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
    precio_venta,
    margen_ganancia,
    precio_mayoreo,
    cantidad_mayoreo,
  } = datos;

  // Verificar que el producto exista y esté activo
  const producto = await ProductoDAO.obtenerPorId(id_producto);
  if (!producto)        lanzarError('Producto no encontrado', 404);
  if (!producto.activo) lanzarError('No se puede agregar un lote a un producto inactivo', 409);

  // Verificar fecha de vencimiento, no puede ser pasada
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fechaVenc = new Date(fecha_vencimiento);
  if (isNaN(fechaVenc.getTime()))
    lanzarError('fecha_vencimiento no es una fecha válida', 400);
  if (fechaVenc <= hoy)
    lanzarError('La fecha de vencimiento debe ser posterior a hoy', 400);

  // Verificar cantidad
  if (!Number.isInteger(Number(cantidad_ingresada)) || Number(cantidad_ingresada) <= 0)
    lanzarError('La cantidad ingresada debe ser un entero mayor a 0', 400);

  // Número de lote único por producto y sucursal
  const duplicado = await LoteDAO.obtenerPorNumeroLote(numero_lote, id_producto, id_sucursal);
  if (duplicado)
    lanzarError(
      `Ya existe un lote con el número "${numero_lote}" para este producto en esta sucursal`,
      409,
    );

  // Precio de venta del lote
  if (precio_venta === undefined || precio_venta < 0)
    lanzarError('El precio de venta es requerido y no puede ser negativo', 400);
  if (margen_ganancia === undefined || margen_ganancia < 0 || margen_ganancia > 9999.9999)
    lanzarError('El margen de ganancia debe estar entre 0 y 9999.9999', 400);

  // precio_mayoreo y cantidad_mayoreo se definen juntos o ninguno
  const tienePrecioMayoreo   = precio_mayoreo   != null;
  const tieneCantidadMayoreo = cantidad_mayoreo != null;
  if (tienePrecioMayoreo !== tieneCantidadMayoreo)
    lanzarError('precio_mayoreo y cantidad_mayoreo deben definirse juntos', 400);

  const lote = await LoteDAO.crear({
    id_producto,
    id_proveedor,
    id_sucursal,
    numero_lote,
    fecha_vencimiento,
    cantidad_ingresada,
    precio_venta,
    margen_ganancia,
    precio_mayoreo:   precio_mayoreo   ?? null,
    cantidad_mayoreo: cantidad_mayoreo ?? null,
  });

  return await LoteDAO.obtenerPorId(lote.id_lote);
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
  return lote;
};

/**
 * Permite actualizar la fecha de vencimiento, el stock y los precios de venta.
 * El stock no puede quedar negativo ni superar la cantidad ingresada.
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
    if (campos.stock_actual > Number(lote.cantidad_ingresada))
      lanzarError('El stock actual no puede superar la cantidad ingresada del lote', 400);
  }

  if (campos.precio_venta !== undefined && campos.precio_venta < 0)
    lanzarError('El precio de venta no puede ser negativo', 400);

  if (
    campos.margen_ganancia !== undefined
    && (campos.margen_ganancia < 0 || campos.margen_ganancia > 9999.9999)
  )
    lanzarError('El margen de ganancia debe estar entre 0 y 9999.9999', 400);

  // Limpiar mayoreo explícitamente
  if (campos.limpiar_mayoreo === true) {
    const limpiado = await LoteDAO.limpiarMayoreo(id_lote);
    if (!limpiado) lanzarError('No se pudo limpiar el precio de mayoreo', 500);
  } else {
    const tienePrecioMayoreo   = campos.precio_mayoreo   != null;
    const tieneCantidadMayoreo = campos.cantidad_mayoreo != null;
    if (tienePrecioMayoreo !== tieneCantidadMayoreo)
      lanzarError('precio_mayoreo y cantidad_mayoreo deben definirse juntos', 400);
  }

  const actualizado = await LoteDAO.actualizar(id_lote, campos);
  if (!actualizado) lanzarError('No se pudo actualizar el lote', 500);
  return await obtenerPorId(id_lote);
};

//  Alertas

const obtenerAlertas = async (id_sucursal = null) => {
  return await LoteDAO.obtenerAlertas(id_sucursal);
};

module.exports = {
  crearLote,
  obtenerPorSucursal,
  obtenerPorProducto,
  obtenerPorId,
  actualizarLote,
  obtenerAlertas,
};
