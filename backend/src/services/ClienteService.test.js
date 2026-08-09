jest.mock('../daos/ClienteDAO');

const ClienteDAO = require('../daos/ClienteDAO');
const ClienteService = require('./ClienteService');

describe('ClienteService', () => {
  describe('crearCliente', () => {
    it('normaliza y guarda el NIT del cliente', async () => {
      const creado = { id_cliente: 1, nombre_cliente: 'Ana', nit: '1234567-K' };
      ClienteDAO.obtenerPorNit.mockResolvedValue(null);
      ClienteDAO.crear.mockResolvedValue(creado);

      const resultado = await ClienteService.crearCliente({
        nombre_cliente: 'Ana',
        nit: ' 1234567-k ',
        observaciones: null,
      });

      expect(ClienteDAO.obtenerPorNit).toHaveBeenCalledWith('1234567-K');
      expect(ClienteDAO.crear).toHaveBeenCalledWith({
        nombre_cliente: 'Ana',
        nit: '1234567-K',
        observaciones: null,
      });
      expect(resultado).toEqual(creado);
    });

    it('permite crear clientes sin NIT', async () => {
      ClienteDAO.crear.mockResolvedValue({ id_cliente: 2, nit: null });

      await ClienteService.crearCliente({ nombre_cliente: 'Luis' });

      expect(ClienteDAO.obtenerPorNit).not.toHaveBeenCalled();
      expect(ClienteDAO.crear).toHaveBeenCalledWith({
        nombre_cliente: 'Luis',
        nit: null,
        observaciones: undefined,
      });
    });

    it('rechaza un NIT que ya pertenece a otro cliente', async () => {
      ClienteDAO.obtenerPorNit.mockResolvedValue({ id_cliente: 9, nit: '1234567-1' });

      await expect(ClienteService.crearCliente({
        nombre_cliente: 'Duplicado',
        nit: '1234567-1',
      })).rejects.toMatchObject({
        message: 'Ya existe un cliente con ese NIT',
        status: 409,
      });
      expect(ClienteDAO.crear).not.toHaveBeenCalled();
    });
  });

  describe('actualizarCliente', () => {
    it('actualiza el NIT excluyendo al mismo cliente de la duplicidad', async () => {
      const existente = { id_cliente: 4, nombre_cliente: 'Marta', nit: '1111111-1' };
      const actualizado = { ...existente, nit: '2222222-K' };
      ClienteDAO.obtenerPorId.mockResolvedValue(existente);
      ClienteDAO.obtenerPorNit.mockResolvedValue(null);
      ClienteDAO.actualizar.mockResolvedValue(actualizado);

      const resultado = await ClienteService.actualizarCliente(4, { nit: '2222222-k' });

      expect(ClienteDAO.obtenerPorNit).toHaveBeenCalledWith('2222222-K');
      expect(ClienteDAO.actualizar).toHaveBeenCalledWith(4, { nit: '2222222-K' });
      expect(resultado).toEqual(actualizado);
    });

    it('permite limpiar el NIT enviando null', async () => {
      ClienteDAO.obtenerPorId.mockResolvedValue({ id_cliente: 4, nit: '1111111-1' });
      ClienteDAO.actualizar.mockResolvedValue({ id_cliente: 4, nit: null });

      await ClienteService.actualizarCliente(4, { nit: null });

      expect(ClienteDAO.actualizar).toHaveBeenCalledWith(4, { nit: null });
      expect(ClienteDAO.obtenerPorNit).not.toHaveBeenCalled();
    });

    it('devuelve 404 antes de actualizar un cliente inexistente', async () => {
      ClienteDAO.obtenerPorId.mockResolvedValue(null);

      await expect(
        ClienteService.actualizarCliente(99, { nit: '1234567-1' }),
      ).rejects.toMatchObject({ status: 404 });
      expect(ClienteDAO.actualizar).not.toHaveBeenCalled();
    });
  });
});
