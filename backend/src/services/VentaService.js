const VentaDAO = require('../daos/VentaDAO');
const RecurrenteService = require('./RecurrenteService');

const MAXIMO_CENTAVOS = 999999999999;
const METODOS_PERMITIDOS = ['efectivo', 'tarjeta'];

const lanzarError = (mensaje, status) => {
  const error = new Error(mensaje);
  error.status = status;
  throw error;
};

const aCentavos = (monto) => Math.round(Number(monto) * 100);
const aMonto = (centavos) => (centavos / 100).toFixed(2);

const puedeAccederSucursal = (usuario, id_sucursal) => (
  usuario.rol !== 'dependiente'
  || Number(usuario.id_sucursal) === Number(id_sucursal)
);

const validarAccesoSucursal = (usuario, id_sucursal) => {
  if (!puedeAccederSucursal(usuario, id_sucursal)) {
    lanzarError('No tienes permiso para operar ventas de otra sucursal', 403);
  }
};

const verificarCliente = async (id_cliente, client) => {
  if (id_cliente == null) return;
  const cliente = await VentaDAO.obtenerClientePorId(id_cliente, client);
  if (!cliente) lanzarError('Cliente no encontrado', 404);
};

const obtenerVentaAutorizada = async (id_venta, usuario) => {
  const venta = await VentaDAO.obtenerPorId(id_venta);
  if (!venta) lanzarError('Venta no encontrada', 404);
  validarAccesoSucursal(usuario, venta.id_sucursal);
  return venta;
};

const validarDatosBasicosVenta = (datos, usuario) => {
  const {
    id_sucursal,
    detalles,
  } = datos;

  validarAccesoSucursal(usuario, id_sucursal);

  const idsLote = detalles.map(({ id_lote }) => Number(id_lote));
  if (new Set(idsLote).size !== idsLote.length) {
    lanzarError('Cada lote debe aparecer una sola vez en los detalles de la venta', 400);
  }

  return idsLote;
};

const prepararVenta = async (datos, usuario, client) => {
  const {
    id_sucursal,
    id_cliente = null,
    detalles,
  } = datos;
  const idsLote = validarDatosBasicosVenta(datos, usuario);

  await verificarCliente(id_cliente, client);

  const lotes = await VentaDAO.obtenerLotesParaVenta(
    [...idsLote].sort((a, b) => a - b),
    client,
  );

  if (lotes.length !== idsLote.length) {
    lanzarError('Uno o mas lotes no existen', 404);
  }

  const lotesPorId = new Map(lotes.map((lote) => [Number(lote.id_lote), lote]));
  let totalCentavos = 0;
  const detallesCalculados = detalles.map(({ id_lote, cantidad }) => {
    const lote = lotesPorId.get(Number(id_lote));

    if (Number(lote.id_sucursal) !== Number(id_sucursal)) {
      lanzarError(`El lote ${id_lote} no pertenece a la sucursal indicada`, 409);
    }
    if (!lote.producto_activo) {
      lanzarError(`El producto del lote ${id_lote} esta inactivo`, 409);
    }
    if (lote.vencido) {
      lanzarError(`No se puede vender el lote ${id_lote} porque esta vencido`, 409);
    }
    if (Number(lote.stock_actual) < Number(cantidad)) {
      lanzarError(`Stock insuficiente para el lote ${id_lote}`, 409);
    }

    const precioCentavos = aCentavos(lote.precio_venta);
    const subtotalCentavos = precioCentavos * Number(cantidad);
    if (
      !Number.isSafeInteger(subtotalCentavos)
      || totalCentavos + subtotalCentavos > MAXIMO_CENTAVOS
    ) {
      lanzarError('El total de la venta supera el monto maximo permitido', 400);
    }
    totalCentavos += subtotalCentavos;

    return {
      id_lote: Number(id_lote),
      cantidad: Number(cantidad),
      precio_unitario: aMonto(precioCentavos),
    };
  });

  if (totalCentavos <= 0) {
    lanzarError('El total de la venta debe ser mayor a cero', 400);
  }

  return {
    id_sucursal: Number(id_sucursal),
    id_cliente: id_cliente == null ? null : Number(id_cliente),
    totalCentavos,
    detallesCalculados,
  };
};

const crearCheckoutTarjeta = async (datos, usuario) => {
  validarDatosBasicosVenta(datos, usuario);

  const ventaPreparada = await VentaDAO.ejecutarEnTransaccion((client) => (
    prepararVenta(datos, usuario, client)
  ));

  const checkout = await RecurrenteService.crearCheckoutVenta({
    totalCentavos: ventaPreparada.totalCentavos,
    idSucursal: ventaPreparada.id_sucursal,
    idCliente: ventaPreparada.id_cliente,
    idUsuario: usuario.id_usuario,
  });

  return {
    id_checkout: checkout.id,
    checkout_url: checkout.checkout_url,
    estado: checkout.status,
    total: aMonto(ventaPreparada.totalCentavos),
    moneda: checkout.currency || 'GTQ',
    live_mode: checkout.live_mode,
  };
};

const crearVenta = async (datos, usuario) => {
  const {
    metodo_pago,
    monto_recibido,
    referencia_pago,
  } = datos;

  if (!METODOS_PERMITIDOS.includes(metodo_pago)) {
    lanzarError('metodo_pago debe ser efectivo o tarjeta', 400);
  }

  validarDatosBasicosVenta(datos, usuario);

  let datosPagoVerificado = {};
  let totalPagadoCentavos = null;

  if (metodo_pago === 'tarjeta') {
    if (!referencia_pago) {
      lanzarError('referencia_pago es requerida para ventas con tarjeta', 400);
    }

    const ventaParaPago = await VentaDAO.ejecutarEnTransaccion((client) => (
      prepararVenta(datos, usuario, client)
    ));
    totalPagadoCentavos = ventaParaPago.totalCentavos;
    datosPagoVerificado = await RecurrenteService.validarCheckoutPagado(
      referencia_pago,
      totalPagadoCentavos,
    );
  }

  const idVenta = await VentaDAO.ejecutarEnTransaccion(async (client) => {
    const ventaPreparada = await prepararVenta(datos, usuario, client);
    let recibidoCentavos;
    let cambioCentavos;
    let datosPago = {};

    if (metodo_pago === 'efectivo') {
      recibidoCentavos = aCentavos(monto_recibido);
      if (recibidoCentavos < ventaPreparada.totalCentavos) {
        lanzarError(
          `El monto recibido es insuficiente. El total es Q${aMonto(ventaPreparada.totalCentavos)}`,
          400,
        );
      }
      cambioCentavos = recibidoCentavos - ventaPreparada.totalCentavos;
    } else {
      if (ventaPreparada.totalCentavos !== totalPagadoCentavos) {
        lanzarError('El total de la venta cambio despues de confirmar el pago', 409);
      }
      datosPago = datosPagoVerificado;
      recibidoCentavos = ventaPreparada.totalCentavos;
      cambioCentavos = 0;
    }

    const venta = await VentaDAO.crearVenta({
      id_sucursal: ventaPreparada.id_sucursal,
      id_usuario: Number(usuario.id_usuario),
      id_cliente: ventaPreparada.id_cliente,
      metodo_pago,
      proveedor_pago: metodo_pago === 'tarjeta' ? 'recurrente' : null,
      referencia_pago: datosPago.referencia_pago || null,
      estado_pago: datosPago.estado_pago || null,
      autorizacion_pago: datosPago.autorizacion_pago || null,
      tarjeta_ultimos4: datosPago.tarjeta_ultimos4 || null,
      total: aMonto(ventaPreparada.totalCentavos),
      monto_recibido: aMonto(recibidoCentavos),
      cambio: aMonto(cambioCentavos),
    }, client);

    for (const detalle of ventaPreparada.detallesCalculados) {
      const loteActualizado = await VentaDAO.descontarStock(
        detalle.id_lote,
        detalle.cantidad,
        client,
      );
      if (!loteActualizado) {
        lanzarError(`Stock insuficiente para el lote ${detalle.id_lote}`, 409);
      }

      await VentaDAO.crearDetalle({
        id_venta: venta.id_venta,
        ...detalle,
      }, client);
    }

    return venta.id_venta;
  });

  return VentaDAO.obtenerPorId(idVenta);
};

const obtenerTodas = async (filtros, usuario) => {
  const filtrosAplicados = { ...filtros };

  if (usuario.rol === 'dependiente') {
    if (
      filtrosAplicados.id_sucursal
      && Number(filtrosAplicados.id_sucursal) !== Number(usuario.id_sucursal)
    ) {
      lanzarError('No tienes permiso para consultar ventas de otra sucursal', 403);
    }
    filtrosAplicados.id_sucursal = Number(usuario.id_sucursal);
  }

  return VentaDAO.obtenerTodas(filtrosAplicados);
};

const obtenerPorId = (id_venta, usuario) =>
  obtenerVentaAutorizada(id_venta, usuario);

const asociarCliente = async (id_venta, id_cliente, usuario) => {
  await VentaDAO.ejecutarEnTransaccion(async (client) => {
    const venta = await VentaDAO.obtenerParaActualizar(id_venta, client);
    if (!venta) lanzarError('Venta no encontrada', 404);
    validarAccesoSucursal(usuario, venta.id_sucursal);

    await verificarCliente(id_cliente, client);
    await VentaDAO.actualizarCliente(id_venta, id_cliente, client);
  });

  return VentaDAO.obtenerPorId(id_venta);
};

const anularVenta = async (id_venta, motivo_anulacion, usuario) => {
  await VentaDAO.ejecutarEnTransaccion(async (client) => {
    const venta = await VentaDAO.obtenerParaActualizar(id_venta, client);
    if (!venta) lanzarError('Venta no encontrada', 404);
    validarAccesoSucursal(usuario, venta.id_sucursal);

    if (venta.estado === 'anulada') {
      lanzarError('La venta ya esta anulada', 409);
    }

    const detalles = await VentaDAO.obtenerDetallesParaAnulacion(id_venta, client);
    for (const detalle of detalles) {
      const lote = await VentaDAO.restaurarStock(
        detalle.id_lote,
        detalle.cantidad,
        client,
      );
      if (!lote) {
        lanzarError(`No se pudo restaurar el stock del lote ${detalle.id_lote}`, 500);
      }
    }

    await VentaDAO.anular(id_venta, motivo_anulacion, client);
  });

  return VentaDAO.obtenerPorId(id_venta);
};

module.exports = {
  crearCheckoutTarjeta,
  crearVenta,
  obtenerTodas,
  obtenerPorId,
  asociarCliente,
  anularVenta,
};
