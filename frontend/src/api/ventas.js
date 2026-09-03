import api from './axios';

export const crearVenta = async (payload) => {
  try {
    const { data } = await api.post('/ventas', payload);
    return data;
  } catch (err) {
    const mensaje = err.response?.data?.mensaje || 'No se pudo registrar la venta.';
    throw new Error(mensaje);
  }
};

export const crearPagoPOS = async (payload) => {
  try {
    const { data } = await api.post('/ventas/tarjeta/pos', payload);
    return data;
  } catch (err) {
    const mensajeBackend = err.response?.data?.mensaje || '';
    const mensaje = /modo espera|no est[aá] listo|terminal_not_in_standby/i.test(mensajeBackend)
      ? 'El dispositivo no está listo para cobrar. Verifica que esté abierto e inténtalo de nuevo.'
      : /m[ií]nimo.*Q?5|Q5\.00/i.test(mensajeBackend)
        ? 'El monto mínimo para pagar con tarjeta es Q5.00.'
        : 'No se pudo iniciar el pago. Inténtalo de nuevo.';
    throw new Error(mensaje);
  }
};
