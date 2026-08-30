let mockUsuario = { id_usuario: 2, id_sucursal: 1, rol: 'administrador' };

jest.mock('../middlewares/verificarToken', () => (req, _res, next) => {
  req.usuario = mockUsuario;
  next();
});
jest.mock('../services/ReporteService');

const express = require('express');
const request = require('supertest');
const ReporteService = require('../services/ReporteService');
const ReporteRoutes = require('./ReporteRoutes');

const crearApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/reportes', ReporteRoutes);
  return app;
};

describe('ReporteRoutes - métricas', () => {
  beforeEach(() => {
    mockUsuario = { id_usuario: 2, id_sucursal: 1, rol: 'administrador' };
    ReporteService.obtenerMetricas.mockResolvedValue({
      ingresos_totales: '250.00',
      total_ventas: 6,
      top_productos: [],
    });
  });

  it('rechaza el acceso de un dependiente', async () => {
    mockUsuario = { id_usuario: 7, id_sucursal: 1, rol: 'dependiente' };

    const respuesta = await request(crearApp()).get('/api/reportes/metricas');

    expect(respuesta.status).toBe(403);
    expect(ReporteService.obtenerMetricas).not.toHaveBeenCalled();
  });

  it('valida y normaliza los filtros de las métricas', async () => {
    const respuesta = await request(crearApp())
      .get('/api/reportes/metricas')
      .query({
        id_sucursal: 2,
        fecha_desde: '2026-08-01',
        fecha_hasta: '2026-08-31',
        limite: 8,
      });

    expect(respuesta.status).toBe(200);
    expect(ReporteService.obtenerMetricas).toHaveBeenCalledWith({
      id_sucursal: 2,
      fecha_desde: '2026-08-01',
      fecha_hasta: '2026-08-31',
      limite: 8,
    });
  });

  it('rechaza un límite mayor a veinte', async () => {
    const respuesta = await request(crearApp())
      .get('/api/reportes/metricas')
      .query({ limite: 21 });

    expect(respuesta.status).toBe(400);
    expect(ReporteService.obtenerMetricas).not.toHaveBeenCalled();
  });

  it('rechaza un rango de fechas invertido', async () => {
    const respuesta = await request(crearApp())
      .get('/api/reportes/metricas')
      .query({ fecha_desde: '2026-08-20', fecha_hasta: '2026-08-01' });

    expect(respuesta.status).toBe(400);
    expect(ReporteService.obtenerMetricas).not.toHaveBeenCalled();
  });
});
