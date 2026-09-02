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
    const mensaje = err.response?.data?.mensaje || 'No se pudo enviar el cobro al POS.';
    throw new Error(mensaje);
  }
};
