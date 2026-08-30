jest.mock('../database/db');

const pool = require('../database/db');
const ReporteDAO = require('./ReporteDAO');

describe('ReporteDAO', () => {
  it('calcula el resumen usando solo ventas completadas', async () => {
    const resumen = {
      ingresos_totales: '350.50',
      total_ventas: 12,
      ticket_promedio: '29.21',
      unidades_vendidas: 28,
    };
    pool.query.mockResolvedValue({ rows: [resumen] });

    const resultado = await ReporteDAO.obtenerResumenVentas({
      id_sucursal: 2,
      fecha_desde: '2026-08-01',
      fecha_hasta: '2026-08-31',
    });

    const [consulta, valores] = pool.query.mock.calls[0];
    expect(consulta).toContain('completada');
    expect(consulta).toContain('v.id_sucursal = $1');
    expect(consulta).toContain('America/Guatemala');
    expect(consulta).toContain('AVG(vf.total)');
    expect(consulta).toContain('SUM(dv.cantidad)');
    expect(consulta).toContain('CROSS JOIN resumen_unidades');
    expect(valores).toEqual([2, '2026-08-01', '2026-08-31']);
    expect(resultado).toEqual(resumen);
  });

  it('permite consultar el resumen global sin filtros opcionales', async () => {
    pool.query.mockResolvedValue({
      rows: [{
        ingresos_totales: '0.00',
        total_ventas: 0,
        ticket_promedio: '0.00',
        unidades_vendidas: 0,
      }],
    });

    await ReporteDAO.obtenerResumenVentas();

    expect(pool.query.mock.calls[0][1]).toEqual([null, null, null]);
  });
});
