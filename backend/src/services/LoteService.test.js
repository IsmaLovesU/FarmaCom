jest.mock('../daos/LoteDAO');
jest.mock('../daos/ProductoDAO');

const LoteDAO = require('../daos/LoteDAO');
const ProductoDAO = require('../daos/ProductoDAO');
const LoteService = require('./LoteService');

const loteExistente = {
  id_lote: 7,
  id_producto: 2,
  id_proveedor: 3,
  id_sucursal: 4,
  numero_lote: 'LT-001',
  cantidad_ingresada: 20,
  stock_actual: 12,
};

describe('LoteService', () => {
  describe('actualizarLote', () => {
    it('actualiza los datos editables y devuelve el lote completo', async () => {
      const loteActualizado = { ...loteExistente, numero_lote: 'LT-002' };
      LoteDAO.obtenerPorId
        .mockResolvedValueOnce(loteExistente)
        .mockResolvedValueOnce(loteActualizado);
      LoteDAO.obtenerPorNumeroLote.mockResolvedValue(null);
      LoteDAO.actualizar.mockResolvedValue(loteActualizado);

      const resultado = await LoteService.actualizarLote(7, { numero_lote: 'LT-002' });

      expect(LoteDAO.obtenerPorNumeroLote).toHaveBeenCalledWith('LT-002', 2, 4, 7);
      expect(LoteDAO.actualizar).toHaveBeenCalledWith(7, { numero_lote: 'LT-002' });
      expect(resultado).toEqual(loteActualizado);
    });

    it('rechaza un numero de lote duplicado para el producto y sucursal', async () => {
      LoteDAO.obtenerPorId.mockResolvedValue(loteExistente);
      LoteDAO.obtenerPorNumeroLote.mockResolvedValue({ id_lote: 8 });

      await expect(
        LoteService.actualizarLote(7, { numero_lote: 'LT-DUP' }),
      ).rejects.toMatchObject({ status: 409 });
      expect(LoteDAO.actualizar).not.toHaveBeenCalled();
    });

    it('impide reducir la cantidad ingresada por debajo del stock actual', async () => {
      LoteDAO.obtenerPorId.mockResolvedValue(loteExistente);

      await expect(
        LoteService.actualizarLote(7, { cantidad_ingresada: 10 }),
      ).rejects.toMatchObject({
        message: 'El stock actual no puede superar la cantidad ingresada del lote',
        status: 400,
      });
    });

    it('limpia ambos valores de mayoreo en una sola actualizacion', async () => {
      LoteDAO.obtenerPorId
        .mockResolvedValueOnce(loteExistente)
        .mockResolvedValueOnce(loteExistente);
      LoteDAO.actualizar.mockResolvedValue(loteExistente);

      await LoteService.actualizarLote(7, {
        limpiar_mayoreo: true,
        precio_mayoreo: 15,
        cantidad_mayoreo: 5,
      });

      expect(LoteDAO.actualizar).toHaveBeenCalledWith(7, { limpiar_mayoreo: true });
    });

    it('rechaza una actualizacion sin campos reconocidos', async () => {
      LoteDAO.obtenerPorId.mockResolvedValue(loteExistente);

      await expect(
        LoteService.actualizarLote(7, { campo_desconocido: 'valor' }),
      ).rejects.toMatchObject({ status: 400 });
    });
  });

  describe('eliminarLote', () => {
    it('devuelve 404 cuando el lote no existe', async () => {
      LoteDAO.obtenerPorId.mockResolvedValue(null);

      await expect(LoteService.eliminarLote(99)).rejects.toMatchObject({
        message: 'Lote no encontrado',
        status: 404,
      });
      expect(LoteDAO.eliminar).not.toHaveBeenCalled();
    });

    it('elimina un lote sin ventas asociadas', async () => {
      LoteDAO.obtenerPorId.mockResolvedValue(loteExistente);
      LoteDAO.eliminar.mockResolvedValue(loteExistente);

      await expect(LoteService.eliminarLote(7)).resolves.toEqual({
        mensaje: 'Lote eliminado correctamente',
      });
    });

    it('devuelve conflicto cuando el lote esta asociado a una venta', async () => {
      LoteDAO.obtenerPorId.mockResolvedValue(loteExistente);
      LoteDAO.eliminar.mockRejectedValue({ code: '23503' });

      await expect(LoteService.eliminarLote(7)).rejects.toMatchObject({
        message: 'No se puede eliminar un lote asociado a ventas',
        status: 409,
      });
    });
  });
});
