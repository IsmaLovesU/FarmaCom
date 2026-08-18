jest.mock('../database/db');

const pool = require('../database/db');
const CajaDAO = require('./CajaDAO');

describe('CajaDAO', () => {
  it('confirma la transacción si la operación termina correctamente', async () => {
    const client = {
      query: jest.fn().mockResolvedValue({ rows: [] }),
      release: jest.fn(),
    };
    pool.connect.mockResolvedValue(client);

    await expect(
      CajaDAO.ejecutarEnTransaccion(async () => 'ok'),
    ).resolves.toBe('ok');
    expect(client.query.mock.calls.map(([consulta]) => consulta)).toEqual([
      'BEGIN',
      'COMMIT',
    ]);
    expect(client.release).toHaveBeenCalled();
  });

  it('bloquea exclusivamente la sesión que se va a cerrar', async () => {
    const client = { query: jest.fn().mockResolvedValue({ rows: [] }) };

    await CajaDAO.obtenerSesionPorId(9, client, 'update');

    expect(client.query).toHaveBeenCalledWith(
      expect.stringContaining('FOR UPDATE OF sc'),
      [9],
    );
  });

  it('suma únicamente ventas completadas y separa los métodos de pago', async () => {
    const client = {
      query: jest.fn()
        .mockResolvedValueOnce({
          rows: [{
            ventas_efectivo: '20.00',
            ventas_tarjeta: '15.00',
            cantidad_ventas: 2,
            cantidad_anulaciones: 1,
          }],
        })
        .mockResolvedValueOnce({
          rows: [{ total_entradas: '5.00', total_salidas: '2.00' }],
        }),
    };

    const resultado = await CajaDAO.obtenerTotalesSesion(9, client);

    expect(client.query.mock.calls[0][0]).toContain("estado = 'completada'");
    expect(resultado).toEqual({
      ventas_efectivo: '20.00',
      ventas_tarjeta: '15.00',
      cantidad_ventas: 2,
      cantidad_anulaciones: 1,
      total_entradas: '5.00',
      total_salidas: '2.00',
    });
  });
});
