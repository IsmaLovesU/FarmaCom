const ClienteDAO = require('../daos/ClienteDAO');

const noEncontrado = () => {
  const error = new Error('Cliente no encontrado');
  error.status = 404;
  return error;
};

const crearCliente = ({ nombre_cliente, observaciones }) =>
  ClienteDAO.crear({ nombre_cliente, observaciones });

const obtenerTodos = () => ClienteDAO.obtenerTodos();

const obtenerPorId = async (id_cliente) => {
  const cliente = await ClienteDAO.obtenerPorId(id_cliente);
  if (!cliente) throw noEncontrado();
  return cliente;
};

const actualizarCliente = async (id_cliente, campos) => {
  const cliente = await ClienteDAO.actualizar(id_cliente, campos);
  if (!cliente) throw noEncontrado();
  return cliente;
};

const eliminarCliente = async (id_cliente) => {
  const cliente = await ClienteDAO.eliminar(id_cliente);
  if (!cliente) throw noEncontrado();
  return { mensaje: 'Cliente eliminado correctamente' };
};

module.exports = { crearCliente, obtenerTodos, obtenerPorId, actualizarCliente, eliminarCliente };
