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

  it('ordena el top por cantidad vendida y aplica los filtros', async () => {
    const productos = [
      {
        id_producto: 4,
        cantidad_vendida: 25,
        ingresos_generados: '200.00',
      },
    ];
    pool.query.mockResolvedValue({ rows: productos });

    const resultado = await ReporteDAO.obtenerTopProductos({
      id_sucursal: 2,
      fecha_desde: '2026-08-01',
      fecha_hasta: '2026-08-31',
      limite: 7,
      criterio: 'cantidad',
    });

    const [consulta, valores] = pool.query.mock.calls[0];
    expect(consulta).toContain('completada');
    expect(consulta).toContain('America/Guatemala');
    expect(consulta).toContain('SUM(dv.cantidad)');
    expect(consulta).toContain('SUM(dv.subtotal)');
    expect(consulta).toContain('ORDER BY cantidad_vendida DESC');
    expect(consulta).toContain('LIMIT $4');
    expect(valores).toEqual([2, '2026-08-01', '2026-08-31', 7]);
    expect(resultado).toEqual(productos);
  });

  it('permite ordenar el top global por ingresos', async () => {
    pool.query.mockResolvedValue({ rows: [] });

    await ReporteDAO.obtenerTopProductos({ criterio: 'ingresos' });

    const [consulta, valores] = pool.query.mock.calls[0];
    expect(consulta).toContain('ORDER BY ingresos_generados DESC');
    expect(valores).toEqual([null, null, null, 5]);
  });
});
