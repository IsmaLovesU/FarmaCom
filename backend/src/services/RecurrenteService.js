const API_URL = process.env.RECURRENTE_API_URL || 'https://app.recurrente.com/api';
const MONEDA = 'GTQ';
const MINIMO_GTQ_CENTAVOS = 500;

const lanzarError = (mensaje, status) => {
  const error = new Error(mensaje);
  error.status = status;
  throw error;
};

const obtenerLlaveSecreta = () => {
  const llave = process.env.RECURRENTE_SECRET_KEY;
  if (!llave) {
    lanzarError('Configura RECURRENTE_SECRET_KEY para procesar pagos con tarjeta', 503);
  }
  return llave;
};

const obtenerFetch = () => {
  if (typeof fetch !== 'function') {
    lanzarError('El runtime de Node no soporta fetch para conectar con Recurrente', 500);
  }
  return fetch;
};

const leerRespuesta = async (respuesta) => {
  const texto = await respuesta.text();
  if (!texto) return {};

  try {
    return JSON.parse(texto);
  } catch (error) {
    return { error: texto };
  }
};

const formatearErrores = (errores) => {
  if (!errores || typeof errores !== 'object') return null;

  const detalles = Object.values(errores)
    .flat()
    .filter(Boolean);

  return detalles.length > 0 ? detalles.join('. ') : null;
};

const solicitar = async (ruta, opciones = {}) => {
  const respuesta = await obtenerFetch()(`${API_URL}${ruta}`, {
    ...opciones,
    headers: {
      'X-SECRET-KEY': obtenerLlaveSecreta(),
      'Content-Type': 'application/json',
      ...(opciones.headers || {}),
    },
  });
  const data = await leerRespuesta(respuesta);

  if (!respuesta.ok) {
    const detalle = formatearErrores(data.errors);
    const mensajeBase = data.error || data.message || 'Recurrente no pudo procesar la solicitud';
    const mensaje = detalle ? `${mensajeBase}: ${detalle}` : mensajeBase;
    lanzarError(mensaje, respuesta.status || 502);
  }

  return data;
};

const construirUrlRetorno = (estado) => {
  const base = process.env.FRONTEND_URL || 'http://localhost:5173';
  return `${base}/pos?recurrente=${estado}`;
};

const crearCheckoutVenta = async ({
  totalCentavos,
  idSucursal,
  idCliente,
  idUsuario,
}) => {
  if (totalCentavos < MINIMO_GTQ_CENTAVOS) {
    lanzarError('Recurrente requiere un monto minimo de Q5.00 para pagos en GTQ', 400);
  }

  return solicitar('/checkouts', {
    method: 'POST',
    body: JSON.stringify({
      items: [
        {
          name: 'Venta FarmaCom',
          amount_in_cents: totalCentavos,
          currency: MONEDA,
          charge_type: 'one_time',
          quantity: 1,
          payment_method_types: ['card'],
          available_installments: [],
        },
      ],
      success_url: construirUrlRetorno('exito'),
      cancel_url: construirUrlRetorno('cancelado'),
      metadata: {
        sistema: 'FarmaCom',
        id_sucursal: String(idSucursal),
        id_cliente: idCliente == null ? 'consumidor_final' : String(idCliente),
        id_usuario: String(idUsuario),
      },
    }),
  });
};

const obtenerCheckout = (checkoutId) => solicitar(`/checkouts/${checkoutId}`, {
  method: 'GET',
});

const validarCheckoutPagado = async (checkoutId, totalCentavosEsperado) => {
  const checkout = await obtenerCheckout(checkoutId);

  if (checkout.status !== 'paid') {
    lanzarError('El pago con tarjeta aun no esta confirmado', 409);
  }

  if (checkout.currency && checkout.currency !== MONEDA) {
    lanzarError('La moneda del pago con tarjeta no coincide con GTQ', 409);
  }

  if (Number(checkout.total_in_cents) !== Number(totalCentavosEsperado)) {
    lanzarError('El monto pagado con tarjeta no coincide con el total de la venta', 409);
  }

  return {
    referencia_pago: checkout.id,
    estado_pago: 'pagado',
    autorizacion_pago: checkout.latest_intent?.data?.auth_code
      || checkout.latest_intent?.id
      || checkout.payment?.id
      || null,
    tarjeta_ultimos4: checkout.payment_method?.card?.last4 || null,
  };
};

module.exports = {
  crearCheckoutVenta,
  obtenerCheckout,
  validarCheckoutPagado,
};
