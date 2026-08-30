jest.mock('../database/db');

const pool = require('../database/db');
const VentaDAO = require('./VentaDAO');

describe('VentaDAO', () => {
  describe('ejecutarEnTransaccion', () => {
    it('confirma la transacción cuando toda la operación termina correctamente', async () => {
      const client = {
        query: jest.fn().mockResolvedValue({ rows: [] }),
        release: jest.fn(),
      };
      pool.connect.mockResolvedValue(client);
      const operacion = jest.fn().mockResolvedValue('resultado');

      const resultado = await VentaDAO.ejecutarEnTransaccion(operacion);

      expect(resultado).toBe('resultado');
      expect(client.query.mock.calls.map(([consulta]) => consulta)).toEqual([
        'BEGIN',
        'COMMIT',
      ]);
      expect(client.release).toHaveBeenCalled();
    });

    it('revierte la transacción si falla cualquier parte de la venta', async () => {
      const client = {
        query: jest.fn().mockResolvedValue({ rows: [] }),
        release: jest.fn(),
      };
      pool.connect.mockResolvedValue(client);
      const error = new Error('Stock insuficiente');

      await expect(
        VentaDAO.ejecutarEnTransaccion(async () => {
          throw error;
        }),
      ).rejects.toThrow('Stock insuficiente');

      expect(client.query.mock.calls.map(([consulta]) => consulta)).toEqual([
        'BEGIN',
        'ROLLBACK',
      ]);
      expect(client.release).toHaveBeenCalled();
    });
  });

  it('bloquea los lotes consultados para evitar ventas concurrentes sin stock', async () => {
    const client = { query: jest.fn().mockResolvedValue({ rows: [] }) };

    await VentaDAO.obtenerLotesParaVenta([1, 2], client);

    expect(client.query).toHaveBeenCalledWith(
      expect.stringContaining('FOR UPDATE OF l'),
      [[1, 2]],
    );
  });

  it('descuenta stock únicamente cuando hay existencias suficientes', async () => {
    const client = {
      query: jest.fn().mockResolvedValue({
        rows: [{ id_lote: 8, stock_actual: 3 }],
      }),
    };

    const resultado = await VentaDAO.descontarStock(8, 2, client);

    expect(client.query).toHaveBeenCalledWith(
      expect.stringContaining('stock_actual >= $1'),
      [2, 8],
    );
    expect(resultado).toEqual({ id_lote: 8, stock_actual: 3 });
  });

  it('calcula ingresos y top de productos usando solo ventas completadas', async () => {
    const metricas = {
      ingresos_totales: '350.50',
      total_ventas: 12,
      top_productos: [
        { id_producto: 4, cantidad_vendida: 25, ingresos_generados: '200.00' },
      ],
    };
    pool.query.mockResolvedValue({ rows: [metricas] });

    const resultado = await VentaDAO.obtenerMetricas({
      id_sucursal: 2,
      fecha_desde: '2026-08-01',
      fecha_hasta: '2026-08-31',
      limite: 7,
    });

    const [consulta, valores] = pool.query.mock.calls[0];
    expect(consulta).toContain("v.estado = 'completada'");
    expect(consulta).toContain('v.id_sucursal = $1');
    expect(consulta).toContain("$3::DATE + INTERVAL '1 day'");
    expect(consulta).toContain('SUM(dv.cantidad)');
    expect(consulta).toContain('SUM(dv.subtotal)');
    expect(consulta).toContain('LIMIT $4');
    expect(valores).toEqual([2, '2026-08-01', '2026-08-31', 7]);
    expect(resultado).toEqual(metricas);
  });

  it('permite consultar métricas globales sin filtros opcionales', async () => {
    pool.query.mockResolvedValue({
      rows: [{ ingresos_totales: '0.00', total_ventas: 0, top_productos: [] }],
    });

    await VentaDAO.obtenerMetricas();

    expect(pool.query.mock.calls[0][1]).toEqual([null, null, null, 5]);
  });
});
