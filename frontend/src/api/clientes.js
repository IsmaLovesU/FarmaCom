import api from './axios';

export const obtenerHistorialCompras = async (idCliente, filtros = {}) => {
  const { data } = await api.get(
    `/clientes/${idCliente}/historial-compras`,
    { params: filtros },
  );
  return data;
};
