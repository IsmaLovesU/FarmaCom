jest.mock('../database/db');

const pool = require('../database/db');
const ReporteDAO = require('./ReporteDAO');

describe('ReporteDAO', () => {
  it('calcula ingresos y top de productos usando solo ventas completadas', async () => {
    const metricas = {
      ingresos_totales: '350.50',
      total_ventas: 12,
      top_productos: [
        { id_producto: 4, cantidad_vendida: 25, ingresos_generados: '200.00' },
      ],
    };
    pool.query.mockResolvedValue({ rows: [metricas] });

    const resultado = await ReporteDAO.obtenerMetricas({
      id_sucursal: 2,
      fecha_desde: '2026-08-01',
      fecha_hasta: '2026-08-31',
      limite: 7,
    });

    const [consulta, valores] = pool.query.mock.calls[0];
    expect(consulta).toContain('completada');
    expect(consulta).toContain('v.id_sucursal = $1');
    expect(consulta).toContain('$3::DATE + INTERVAL');
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

    await ReporteDAO.obtenerMetricas();

    expect(pool.query.mock.calls[0][1]).toEqual([null, null, null, 5]);
  });
});
