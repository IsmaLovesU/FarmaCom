jest.mock('../services/CategoriaService');
jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));

const { validationResult } = require('express-validator');
const categoriaService = require('../services/CategoriaService');
const CategoriaController = require('./CategoriaController');

// Helper para simular el objeto 'res' de Express sin levantar un servidor.
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const sinErroresDeValidacion = () => ({ isEmpty: () => true, array: () => [] });

describe('CategoriaController', () => {
  describe('crear', () => {
    it('responde 201 con la categoría creada', async () => {
      validationResult.mockReturnValue(sinErroresDeValidacion());
      categoriaService.crearCategoria.mockResolvedValue({ id_categoria: 1, nombre: 'Analgésicos' });

      const req = { body: { nombre: 'Analgésicos' } };
      const res = mockResponse();

      await CategoriaController.crear(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id_categoria: 1, nombre: 'Analgésicos' });
    });

    it('responde 400 cuando hay errores de validación y no llama al service', async () => {
      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: 'nombre es requerido' }],
      });

      const req = { body: {} };
      const res = mockResponse();

      await CategoriaController.crear(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(categoriaService.crearCategoria).not.toHaveBeenCalled();
    });

    it('propaga el código de error del service (409 duplicado)', async () => {
      validationResult.mockReturnValue(sinErroresDeValidacion());
      const error = new Error('Ya existe una categoría con ese nombre');
      error.status = 409;
      categoriaService.crearCategoria.mockRejectedValue(error);

      const req = { body: { nombre: 'Analgésicos' } };
      const res = mockResponse();

      await CategoriaController.crear(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'Ya existe una categoría con ese nombre' });
    });
  });

  describe('obtenerPorId', () => {
    it('responde 404 cuando el service lanza "no encontrada"', async () => {
      const error = new Error('Categoría no encontrada');
      error.status = 404;
      categoriaService.obtenerPorId.mockRejectedValue(error);

      const req = { params: { id: '999' } };
      const res = mockResponse();

      await CategoriaController.obtenerPorId(req, res);

      expect(categoriaService.obtenerPorId).toHaveBeenCalledWith(999);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'Categoría no encontrada' });
    });
  });
});