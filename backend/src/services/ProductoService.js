const ProductoDAO = require('../daos/ProductoDAO');

const {
  PRESENTACIONES,
  esPresentacionValida,
  normalizarPresentacion,
} = require('../constants/presentaciones');

// Helpers

const lanzarError = (mensaje, status) => {
  const err = new Error(mensaje);
  err.status = status;
  throw err;
};

// Operaciones

const crearProducto = async (datos) => {
  const {
    codigo, nombre_generico, concentracion, presentacion,
    precio_compra, meses_alerta_vencimiento,
  } = datos;

  if (!codigo || codigo.trim() === '')                   lanzarError('El código es requerido', 400);
  if (!nombre_generico || nombre_generico.trim() === '')  lanzarError('El nombre genérico es requerido', 400);
  if (!concentracion || concentracion.trim() === '')      lanzarError('La concentración es requerida', 400);
  if (precio_compra < 0)                                  lanzarError('El precio de compra no puede ser negativo', 400);
  if (meses_alerta_vencimiento <= 0)                      lanzarError('Los meses de alerta deben ser mayores a 0', 400);

  if (!esPresentacionValida(presentacion)) {
    lanzarError(`La presentación debe ser una de: ${PRESENTACIONES.join(', ')}`, 400);
  }

  const existente = await ProductoDAO.obtenerPorCodigo(codigo);
  if (existente) lanzarError(`Ya existe un producto con el código "${codigo}"`, 409);

  // Se guarda siempre normalizada para que coincida con el CHECK del esquema
  // y con el índice de identidad.
  const producto = { ...datos, presentacion: normalizarPresentacion(presentacion) };

  const duplicado = await ProductoDAO.obtenerPorIdentidad(producto);
  if (duplicado) {
    lanzarError(
      `Ya existe "${duplicado.nombre_comercial}" de esa casa farmacéutica en presentación de ${producto.presentacion}`,
      409,
    );
  }

  const creado = await ProductoDAO.crear(producto);
  return await ProductoDAO.obtenerPorId(creado.id_producto);
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

  if (campos.presentacion !== undefined && !esPresentacionValida(campos.presentacion)) {
    lanzarError(`La presentación debe ser una de: ${PRESENTACIONES.join(', ')}`, 400);
  }

  if (campos.precio_compra !== undefined && campos.precio_compra < 0) {
    lanzarError('El precio de compra no puede ser negativo', 400);
  }

  if (campos.meses_alerta_vencimiento !== undefined && campos.meses_alerta_vencimiento <= 0) {
    lanzarError('Los meses de alerta deben ser mayores a 0', 400);
  }

  const datos = { ...campos };
  if (campos.presentacion !== undefined) {
    datos.presentacion = normalizarPresentacion(campos.presentacion);
  }

  // La identidad se arma mezclando lo que llega con lo que ya está guardado,
  // porque el usuario puede estar cambiando solo uno de los cuatro campos.
  const identidad = {
    nombre_generico: datos.nombre_generico ?? existente.nombre_generico,
    concentracion:   datos.concentracion   ?? existente.concentracion,
    id_casa:         datos.id_casa         ?? existente.id_casa,
    presentacion:    datos.presentacion    ?? existente.presentacion,
  };

  const mismaIdentidad = await ProductoDAO.obtenerPorIdentidad(identidad);
  if (mismaIdentidad && mismaIdentidad.id_producto !== id_producto) {
    lanzarError('Ya existe otro producto con ese medicamento en esa misma presentación', 409);
  }

  const actualizado = await ProductoDAO.actualizar(id_producto, datos);
  if (!actualizado) lanzarError('No se pudo actualizar el producto', 500);
  return await ProductoDAO.obtenerPorId(id_producto);
};

// Solo el dependiente puede usar este método 
const cambiarAplicaMayoreo = async (id_producto, aplica_mayoreo) => {
  const existente = await ProductoDAO.obtenerPorId(id_producto);
  if (!existente) lanzarError('Producto no encontrado', 404);

  const actualizado = await ProductoDAO.cambiarAplicaMayoreo(id_producto, aplica_mayoreo);
  if (!actualizado) lanzarError('No se pudo actualizar el campo aplica_mayoreo', 500);
  return {
    mensaje: `Mayoreo ${aplica_mayoreo ? 'activado' : 'desactivado'} correctamente`,
    producto: await ProductoDAO.obtenerPorId(id_producto),
  };
};

const desactivarProducto = async (id_producto) => {
  const existente = await ProductoDAO.obtenerPorId(id_producto);
  if (!existente)        lanzarError('Producto no encontrado', 404);
  if (!existente.activo) lanzarError('El producto ya está desactivado', 409);

  const resultado = await ProductoDAO.cambiarActivo(id_producto, false);
  if (!resultado) lanzarError('No se pudo desactivar el producto', 500);
  return {
    mensaje: 'Producto desactivado correctamente',
    producto: await ProductoDAO.obtenerPorId(id_producto),
  };
};

const reactivarProducto = async (id_producto) => {
  const existente = await ProductoDAO.obtenerPorId(id_producto);
  if (!existente)       lanzarError('Producto no encontrado', 404);
  if (existente.activo) lanzarError('El producto ya está activo', 409);

  const resultado = await ProductoDAO.cambiarActivo(id_producto, true);
  if (!resultado) lanzarError('No se pudo reactivar el producto', 500);
  return {
    mensaje: 'Producto reactivado correctamente',
    producto: await ProductoDAO.obtenerPorId(id_producto),
  };
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
