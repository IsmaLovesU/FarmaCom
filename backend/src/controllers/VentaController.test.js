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

describe('VentaController', () => {
  beforeEach(() => {
    validationResult.mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    });
  });

  it('responde 201 con la venta creada por el usuario autenticado', async () => {
    const usuario = { id_usuario: 7, id_sucursal: 1, rol: 'dependiente' };
    const body = { id_sucursal: 1, metodo_pago: 'efectivo', detalles: [] };
    VentaService.crearVenta.mockResolvedValue({ id_venta: 15 });
    const req = { body, usuario };
    const res = mockResponse();

    await VentaController.crear(req, res);

    expect(VentaService.crearVenta).toHaveBeenCalledWith(body, usuario);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id_venta: 15 });
  });

  it('responde 201 con el checkout de tarjeta creado por el usuario autenticado', async () => {
    const usuario = { id_usuario: 7, id_sucursal: 1, rol: 'dependiente' };
    const body = { id_sucursal: 1, detalles: [] };
    VentaService.crearCheckoutTarjeta.mockResolvedValue({
      id_checkout: 'ch_test_123',
      checkout_url: 'https://app.recurrente.com/checkout-session/ch_test_123',
    });
    const req = { body, usuario };
    const res = mockResponse();

    await VentaController.crearCheckoutTarjeta(req, res);

    expect(VentaService.crearCheckoutTarjeta).toHaveBeenCalledWith(body, usuario);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id_checkout: 'ch_test_123',
      checkout_url: 'https://app.recurrente.com/checkout-session/ch_test_123',
    });
  });

  it('no llama al servicio cuando la petición es inválida', async () => {
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: 'detalles debe contener al menos un producto' }],
    });
    const req = { body: {}, usuario: {} };
    const res = mockResponse();

    await VentaController.crear(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(VentaService.crearVenta).not.toHaveBeenCalled();
  });

  it('propaga un conflicto de stock enviado por el servicio', async () => {
    const error = new Error('Stock insuficiente para el lote 3');
    error.status = 409;
    VentaService.crearVenta.mockRejectedValue(error);
    const req = { body: {}, usuario: {} };
    const res = mockResponse();

    await VentaController.crear(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: 'Stock insuficiente para el lote 3',
    });
  });

});
