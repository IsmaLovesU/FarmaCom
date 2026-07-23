jest.mock('../database/db');

const pool = require('../database/db');
const CategoriaDAO = require('./CategoriaDAO');

describe('CategoriaDAO', () => {
  describe('crear', () => {
    it('inserta una categoría y devuelve la fila creada', async () => {
      const filaEsperada = { id_categoria: 1, nombre: 'Analgésicos' };
      pool.query.mockResolvedValue({ rows: [filaEsperada] });

      const resultado = await CategoriaDAO.crear({ nombre: 'Analgésicos' });

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO categoria'),
        ['Analgésicos'],
      );
      expect(resultado).toEqual(filaEsperada);
    });
  });

  describe('obtenerPorId', () => {
    it('devuelve la categoría cuando existe', async () => {
      const fila = { id_categoria: 5, nombre: 'Vitaminas' };
      pool.query.mockResolvedValue({ rows: [fila] });

      const resultado = await CategoriaDAO.obtenerPorId(5);

      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [5]);
      expect(resultado).toEqual(fila);
    });

    it('devuelve null cuando no existe ninguna fila', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const resultado = await CategoriaDAO.obtenerPorId(999);

      expect(resultado).toBeNull();
    });
  });

  describe('eliminar', () => {
    it('devuelve la fila eliminada', async () => {
      const fila = { id_categoria: 2, nombre: 'Antibióticos' };
      pool.query.mockResolvedValue({ rows: [fila] });

      const resultado = await CategoriaDAO.eliminar(2);

      expect(resultado).toEqual(fila);
    });
  });
});