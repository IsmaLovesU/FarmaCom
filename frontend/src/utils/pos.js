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
  const ofertasPorProducto = new Map();

  for (const lote of lotes) {
    const producto = productosPorId.get(Number(lote.id_producto));
    const stockDisponible = Math.max(0, numeroSeguro(lote.stock_actual));
    const precioVenta = Number(lote.precio_venta);
    const tienePrecio = lote.precio_venta !== null
      && lote.precio_venta !== undefined
      && lote.precio_venta !== ''
      && Number.isFinite(precioVenta)
      && precioVenta > 0;
    const estaVencido = lote.estado_vencimiento === 'vencido';
    const productoActivo = producto?.activo !== false;

    if (!producto || !productoActivo || estaVencido || stockDisponible <= 0) {
      continue;
    }

    const oferta = {
      id_producto: Number(lote.id_producto),
      id_lote: Number(lote.id_lote),
      carritoKey: `lote-${lote.id_lote}`,
      codigo: producto.codigo,
      nombre_comercial: lote.nombre_comercial || producto.nombre_comercial,
      nombre_generico: lote.nombre_generico || producto.nombre_generico,
      concentracion: lote.concentracion || producto.concentracion,
      presentacion: lote.presentacion || producto.presentacion,
      numero_lote: lote.numero_lote,
      fecha_vencimiento: lote.fecha_vencimiento,
      estado_vencimiento: lote.estado_vencimiento,
      estado_stock: lote.estado_stock,
      stock_disponible: stockDisponible,
      precio_venta: tienePrecio ? precioVenta : null,
      tiene_precio: tienePrecio,
    };

    const existente = ofertasPorProducto.get(oferta.id_producto);
    if (!existente || (!existente.tiene_precio && tienePrecio)) {
      ofertasPorProducto.set(oferta.id_producto, oferta);
    }
  }

  return [...ofertasPorProducto.values()].sort((a, b) =>
    a.nombre_comercial.localeCompare(b.nombre_comercial, 'es'));
};

export const filtrarCatalogoPOS = (productos, busqueda) => {
  const termino = busqueda.trim().toLocaleLowerCase('es');
  if (!termino) return productos;

  return productos.filter((producto) => [
    producto.nombre_comercial,
    producto.nombre_generico,
    producto.concentracion,
    producto.codigo,
    producto.presentacion,
  ].some((valor) => String(valor || '').toLocaleLowerCase('es').includes(termino)));
};
