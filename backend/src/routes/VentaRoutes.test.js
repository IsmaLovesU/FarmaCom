jest.mock('../middlewares/verificarToken', () => (req, _res, next) => {
  req.usuario = { id_usuario: 7, id_sucursal: 2, rol: 'dependiente' };
  next();
});
jest.mock('../middlewares/verificarRol', () => () => (_req, _res, next) => next());
jest.mock('../services/VentaService');

const express = require('express');
const request = require('supertest');
const VentaService = require('../services/VentaService');
const VentaRoutes = require('./VentaRoutes');

const crearApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/ventas', VentaRoutes);
  return app;
};

describe('VentaRoutes - métricas', () => {
  beforeEach(() => {
    VentaService.obtenerMetricas.mockResolvedValue({
      ingresos_totales: '250.00',
      total_ventas: 6,
      top_productos: [],
    });
  });

  it('valida y normaliza los filtros de las métricas', async () => {
    const respuesta = await request(crearApp())
      .get('/api/ventas/metricas')
      .query({
        id_sucursal: 2,
        fecha_desde: '2026-08-01',
        fecha_hasta: '2026-08-31',
        limite: 8,
      });

    expect(respuesta.status).toBe(200);
    expect(VentaService.obtenerMetricas).toHaveBeenCalledWith({
      id_sucursal: 2,
      fecha_desde: '2026-08-01',
      fecha_hasta: '2026-08-31',
      limite: 8,
    }, {
      id_usuario: 7,
      id_sucursal: 2,
      rol: 'dependiente',
    });
  });

  it('rechaza un límite mayor a veinte', async () => {
    const respuesta = await request(crearApp())
      .get('/api/ventas/metricas')
      .query({ limite: 21 });

    expect(respuesta.status).toBe(400);
    expect(VentaService.obtenerMetricas).not.toHaveBeenCalled();
  });

  it('rechaza un rango de fechas invertido', async () => {
    const respuesta = await request(crearApp())
      .get('/api/ventas/metricas')
      .query({ fecha_desde: '2026-08-20', fecha_hasta: '2026-08-01' });

    expect(respuesta.status).toBe(400);
    expect(VentaService.obtenerMetricas).not.toHaveBeenCalled();
  });
});
