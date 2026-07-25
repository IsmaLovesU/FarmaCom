export const formatearQuetzales = (valor) =>
  new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
    minimumFractionDigits: 2,
  }).format(Number(valor) || 0);

const numeroSeguro = (valor, predeterminado = 0) => {
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : predeterminado;
};

export const construirCatalogoPOS = (inventario = [], lotes = []) => {
  const productosPorId = new Map(
    inventario.map((producto) => [Number(producto.id_producto), producto]),
  );
  const ofertasPorPresentacion = new Map();

  for (const lote of lotes) {
    const producto = productosPorId.get(Number(lote.id_producto));
    const factor = Math.max(1, numeroSeguro(lote.factor_conversion, 1));
    const stockBase = Math.max(0, numeroSeguro(lote.stock_actual));
    const stockDisponible = Math.floor(stockBase / factor);
    const precioVenta = Number(lote.precio_venta);
    const tienePrecio = lote.precio_venta !== null
      && lote.precio_venta !== undefined
      && lote.precio_venta !== ''
      && Number.isFinite(precioVenta)
      && precioVenta >= 0;
    const estaVencido = lote.estado_vencimiento === 'vencido';
    const productoActivo = producto?.activo !== false;

    if (!producto || !productoActivo || estaVencido || stockDisponible <= 0) {
      continue;
    }

    const idPresentacion = Number(lote.presentacion_ingreso);
    const claveAgrupacion = `${lote.id_producto}-${idPresentacion}`;
    const oferta = {
      id_producto: Number(lote.id_producto),
      id_lote: Number(lote.id_lote),
      id_presentacion: idPresentacion,
      carritoKey: `lote-${lote.id_lote}-presentacion-${idPresentacion}`,
      codigo: producto.codigo,
      nombre_comercial: lote.nombre_comercial || producto.nombre_comercial,
      nombre_generico: lote.nombre_generico || producto.nombre_generico,
      presentacion_nombre: lote.presentacion_nombre || 'Unidad',
      factor_conversion: factor,
      numero_lote: lote.numero_lote,
      fecha_vencimiento: lote.fecha_vencimiento,
      estado_vencimiento: lote.estado_vencimiento,
      estado_stock: lote.estado_stock,
      stock_base: stockBase,
      stock_disponible: stockDisponible,
      precio_venta: tienePrecio ? precioVenta : null,
      tiene_precio: tienePrecio,
    };

    const existente = ofertasPorPresentacion.get(claveAgrupacion);
    if (!existente || (!existente.tiene_precio && tienePrecio)) {
      ofertasPorPresentacion.set(claveAgrupacion, oferta);
    }
  }

  return [...ofertasPorPresentacion.values()].sort((a, b) =>
    a.nombre_comercial.localeCompare(b.nombre_comercial, 'es'));
};

export const filtrarCatalogoPOS = (productos, busqueda) => {
  const termino = busqueda.trim().toLocaleLowerCase('es');
  if (!termino) return productos;

  return productos.filter((producto) => [
    producto.nombre_comercial,
    producto.nombre_generico,
    producto.codigo,
    producto.presentacion_nombre,
  ].some((valor) => String(valor || '').toLocaleLowerCase('es').includes(termino)));
};
