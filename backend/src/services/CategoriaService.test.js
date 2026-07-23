jest.mock('../daos/CategoriaDAO');

const CategoriaDAO = require('../daos/CategoriaDAO');
const CategoriaService = require('./CategoriaService');

describe('CategoriaService', () => {
  describe('crearCategoria', () => {
    it('crea la categoría cuando el nombre no existe todavía', async () => {
      CategoriaDAO.obtenerPorNombre.mockResolvedValue(null);
      CategoriaDAO.crear.mockResolvedValue({ id_categoria: 1, nombre: 'Analgésicos' });

      const resultado = await CategoriaService.crearCategoria({ nombre: 'Analgésicos' });

      expect(CategoriaDAO.obtenerPorNombre).toHaveBeenCalledWith('Analgésicos');
      expect(CategoriaDAO.crear).toHaveBeenCalledWith({ nombre: 'Analgésicos' });
      expect(resultado).toEqual({ id_categoria: 1, nombre: 'Analgésicos' });
    });

    it('lanza error 409 si ya existe una categoría con ese nombre', async () => {
      CategoriaDAO.obtenerPorNombre.mockResolvedValue({ id_categoria: 1, nombre: 'Analgésicos' });

      await expect(
        CategoriaService.crearCategoria({ nombre: 'Analgésicos' }),
      ).rejects.toMatchObject({
        message: 'Ya existe una categoría con ese nombre',
        status: 409,
      });
      expect(CategoriaDAO.crear).not.toHaveBeenCalled();
    });
  });

  describe('obtenerPorId', () => {
    it('lanza error 404 si la categoría no existe', async () => {
      CategoriaDAO.obtenerPorId.mockResolvedValue(null);

      await expect(CategoriaService.obtenerPorId(999)).rejects.toMatchObject({
        message: 'Categoría no encontrada',
        status: 404,
      });
    });

    it('devuelve la categoría cuando existe', async () => {
      const categoria = { id_categoria: 3, nombre: 'Vitaminas' };
      CategoriaDAO.obtenerPorId.mockResolvedValue(categoria);

      const resultado = await CategoriaService.obtenerPorId(3);

      expect(resultado).toEqual(categoria);
    });
  });

  describe('eliminarCategoria', () => {
    it('lanza error 404 si intenta eliminar una categoría inexistente', async () => {
      CategoriaDAO.eliminar.mockResolvedValue(null);

      await expect(CategoriaService.eliminarCategoria(50)).rejects.toMatchObject({
        status: 404,
      });
    });

    it('devuelve mensaje de éxito cuando la eliminación ocurre', async () => {
      CategoriaDAO.eliminar.mockResolvedValue({ id_categoria: 4 });

      const resultado = await CategoriaService.eliminarCategoria(4);

      expect(resultado).toEqual({ mensaje: 'Categoría eliminada correctamente' });
    });
  });
});