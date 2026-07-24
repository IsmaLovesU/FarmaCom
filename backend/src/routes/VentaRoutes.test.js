jest.mock('../middlewares/verificarToken', () => (req, _res, next) => {
  req.usuario = { id_usuario: 3, id_sucursal: 1 };
  next();
});

jest.mock('../services/VentaService');

const express = require('express');
const request = require('supertest');
const VentaService = require('../services/VentaService');
const VentaRoutes = require('./VentaRoutes');

const crearAplicacion = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/ventas', VentaRoutes);
  return app;
};

describe('VentaRoutes', () => {
  const app = crearAplicacion();

  beforeEach(() => {
    jest.clearAllMocks();
    VentaService.crearVenta.mockResolvedValue({
      id_venta: 1,
      estado: 'borrador',
    });
    VentaService.actualizarVenta.mockResolvedValue({
      id_venta: 1,
      estado: 'borrador',
    });
  });

  it('acepta una venta con al menos un detalle válido', async () => {
    const respuesta = await request(app)
      .post('/api/ventas')
      .send({
        observaciones: 'Borrador inicial',
        detalles: [
          {
            descripcion: 'Artículo de prueba',
            cantidad: 2,
            precio_unitario: 5.5,
          },
        ],
    });

    expect(respuesta.status).toBe(201);
    expect(VentaService.crearVenta).toHaveBeenCalledTimes(1);
  });

  it('rechaza crear una venta sin detalles', async () => {
    const respuesta = await request(app)
      .post('/api/ventas')
      .send({ observaciones: 'Sin productos' });

    expect(respuesta.status).toBe(400);
    expect(respuesta.body.errores[0].msg).toBe(
      'detalles debe contener al menos un artículo',
    );
    expect(VentaService.crearVenta).not.toHaveBeenCalled();
  });

  it('permite actualizar únicamente las observaciones', async () => {
    const respuesta = await request(app)
      .put('/api/ventas/1')
      .send({ observaciones: 'Nueva observación' });

    expect(respuesta.status).toBe(200);
    expect(VentaService.actualizarVenta).toHaveBeenCalledTimes(1);
  });

  it('rechaza reemplazar detalles cuando falta la descripción', async () => {
    const respuesta = await request(app)
      .put('/api/ventas/1')
      .send({
        detalles: [
          {
            cantidad: 1,
            precio_unitario: 8,
          },
        ],
      });

    expect(respuesta.status).toBe(400);
    expect(respuesta.body.errores).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: 'La descripción del artículo es requerida',
        }),
      ]),
    );
    expect(VentaService.actualizarVenta).not.toHaveBeenCalled();
  });
});
