const ProductoDAO = require('../daos/ProductoDAO');

// Helpers

const lanzarError = (mensaje, status) => {
  const err = new Error(mensaje);
  err.status = status;
  throw err;
};

// Operaciones

const crearProducto = async (datos) => {
  const { codigo, precio_compra, meses_alerta_vencimiento } = datos;

  if (!codigo || codigo.trim() === '')   lanzarError('El código es requerido', 400);
  if (precio_compra < 0)                 lanzarError('El precio de compra no puede ser negativo', 400);
  if (meses_alerta_vencimiento <= 0)     lanzarError('Los meses de alerta deben ser mayores a 0', 400);

  const existente = await ProductoDAO.obtenerPorCodigo(codigo);
  if (existente) lanzarError(`Ya existe un producto con el código "${codigo}"`, 409);

  return await ProductoDAO.crear(datos);
};

const obtenerTodos = async () => {
  return await ProductoDAO.obtenerTodos();
};

const obtenerPorId = async (id_producto) => {
  const producto = await ProductoDAO.obtenerPorId(id_producto);
  if (!producto) lanzarError('Producto no encontrado', 404);
  return producto;
};

const actualizarProducto = async (id_producto, campos) => {
  const existente = await ProductoDAO.obtenerPorId(id_producto);
  if (!existente) lanzarError('Producto no encontrado', 404);

  if (campos.codigo && campos.codigo.toLowerCase() !== existente.codigo.toLowerCase()) {
    const duplicado = await ProductoDAO.obtenerPorCodigo(campos.codigo);
    if (duplicado) lanzarError(`Ya existe un producto con el código "${campos.codigo}"`, 409);
  }

  if (campos.precio_compra !== undefined && campos.precio_compra < 0) {
    lanzarError('El precio de compra no puede ser negativo', 400);
  }

  if (campos.meses_alerta_vencimiento !== undefined && campos.meses_alerta_vencimiento <= 0) {
    lanzarError('Los meses de alerta deben ser mayores a 0', 400);
  }

  const actualizado = await ProductoDAO.actualizar(id_producto, campos);
  if (!actualizado) lanzarError('No se pudo actualizar el producto', 500);
  return actualizado;
};

// Solo el dependiente puede usar este método 
const cambiarAplicaMayoreo = async (id_producto, aplica_mayoreo) => {
  const existente = await ProductoDAO.obtenerPorId(id_producto);
  if (!existente) lanzarError('Producto no encontrado', 404);

  const actualizado = await ProductoDAO.cambiarAplicaMayoreo(id_producto, aplica_mayoreo);
  if (!actualizado) lanzarError('No se pudo actualizar el campo aplica_mayoreo', 500);
  return { mensaje: `Mayoreo ${aplica_mayoreo ? 'activado' : 'desactivado'} correctamente`, producto: actualizado };
};

const desactivarProducto = async (id_producto) => {
  const existente = await ProductoDAO.obtenerPorId(id_producto);
  if (!existente)        lanzarError('Producto no encontrado', 404);
  if (!existente.activo) lanzarError('El producto ya está desactivado', 409);

  const resultado = await ProductoDAO.cambiarActivo(id_producto, false);
  return { mensaje: 'Producto desactivado correctamente', producto: resultado };
};

const reactivarProducto = async (id_producto) => {
  const existente = await ProductoDAO.obtenerPorId(id_producto);
  if (!existente)       lanzarError('Producto no encontrado', 404);
  if (existente.activo) lanzarError('El producto ya está activo', 409);

  const resultado = await ProductoDAO.cambiarActivo(id_producto, true);
  return { mensaje: 'Producto reactivado correctamente', producto: resultado };
};

module.exports = {
  crearProducto,
  obtenerTodos,
  obtenerPorId,
  actualizarProducto,
  cambiarAplicaMayoreo,
  desactivarProducto,
  reactivarProducto,
};