jest.mock('../daos/ReporteDAO');

const ReporteDAO = require('../daos/ReporteDAO');
const ReporteService = require('./ReporteService');

describe('ReporteService', () => {
  it('normaliza la sucursal y aplica un límite predeterminado', async () => {
    const metricas = {
      ingresos_totales: '150.00',
      total_ventas: 4,
      top_productos: [],
    };
    ReporteDAO.obtenerMetricas.mockResolvedValue(metricas);

    const resultado = await ReporteService.obtenerMetricas({
      id_sucursal: '2',
      fecha_desde: '2026-08-01',
    });

    expect(ReporteDAO.obtenerMetricas).toHaveBeenCalledWith({
      id_sucursal: 2,
      fecha_desde: '2026-08-01',
      limite: 5,
    });
    expect(resultado).toEqual(metricas);
  });

  it('conserva el límite solicitado para un reporte global', async () => {
    ReporteDAO.obtenerMetricas.mockResolvedValue({ ingresos_totales: '900.00' });

    await ReporteService.obtenerMetricas({
      fecha_hasta: '2026-08-31',
      limite: 10,
    });

    expect(ReporteDAO.obtenerMetricas).toHaveBeenCalledWith({
      fecha_hasta: '2026-08-31',
      limite: 10,
    });
  });
});
