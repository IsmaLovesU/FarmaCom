jest.mock('../services/ReporteService');
jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));

const { validationResult } = require('express-validator');
const ReporteService = require('../services/ReporteService');
const ReporteController = require('./ReporteController');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('ReporteController', () => {
  beforeEach(() => {
    validationResult.mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    });
  });

  it('responde con las métricas solicitadas', async () => {
    const metricas = {
      ingresos_totales: '450.00',
      total_ventas: 9,
      top_productos: [],
    };
    const query = { id_sucursal: 1, limite: 5 };
    ReporteService.obtenerMetricas.mockResolvedValue(metricas);
    const req = { query };
    const res = mockResponse();

    await ReporteController.obtenerMetricas(req, res);

    expect(ReporteService.obtenerMetricas).toHaveBeenCalledWith(query);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(metricas);
  });

  it('no consulta el servicio cuando los filtros son inválidos', async () => {
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: 'fecha_hasta debe ser igual o posterior a fecha_desde' }],
    });
    const req = { query: {} };
    const res = mockResponse();

    await ReporteController.obtenerMetricas(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(ReporteService.obtenerMetricas).not.toHaveBeenCalled();
  });
});
