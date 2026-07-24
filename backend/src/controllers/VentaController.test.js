jest.mock('../services/VentaService');
jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));

const { validationResult } = require('express-validator');
const VentaService = require('../services/VentaService');
const VentaController = require('./VentaController');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const sinErrores = () => ({ isEmpty: () => true, array: () => [] });

describe('VentaController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    validationResult.mockReturnValue(sinErrores());
  });

  it('responde 201 al crear una venta', async () => {
    const venta = { id_venta: 1, estado: 'borrador', total: '15.00' };
    const req = {
      body: {
        detalles: [
          { descripcion: 'Artículo', cantidad: 1, precio_unitario: 15 },
        ],
      },
      usuario: { id_usuario: 3, id_sucursal: 1 },
    };
    const res = mockResponse();
    VentaService.crearVenta.mockResolvedValue(venta);

    await VentaController.crear(req, res);

    expect(VentaService.crearVenta).toHaveBeenCalledWith(req.body, req.usuario);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(venta);
  });

  it('responde 400 y no crea cuando falla la validación', async () => {
    const errores = [{ msg: 'detalles debe contener al menos un artículo' }];
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => errores,
    });
    const req = { body: {}, usuario: { id_usuario: 3, id_sucursal: 1 } };
    const res = mockResponse();

    await VentaController.crear(req, res);

    expect(VentaService.crearVenta).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ errores });
  });

  it('responde 404 cuando la venta no existe', async () => {
    const error = new Error('Venta no encontrada');
    error.status = 404;
    VentaService.obtenerPorId.mockRejectedValue(error);
    const req = {
      params: { id: '99' },
      usuario: { id_usuario: 3, id_sucursal: 1 },
    };
    const res = mockResponse();

    await VentaController.obtenerPorId(req, res);

    expect(VentaService.obtenerPorId).toHaveBeenCalledWith(99, req.usuario);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ mensaje: 'Venta no encontrada' });
  });

  it('responde con el mensaje al eliminar una venta', async () => {
    const resultado = { mensaje: 'Venta eliminada correctamente' };
    VentaService.eliminarVenta.mockResolvedValue(resultado);
    const req = {
      params: { id: '5' },
      usuario: { id_usuario: 3, id_sucursal: 1 },
    };
    const res = mockResponse();

    await VentaController.eliminar(req, res);

    expect(VentaService.eliminarVenta).toHaveBeenCalledWith(5, req.usuario);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(resultado);
  });
});
