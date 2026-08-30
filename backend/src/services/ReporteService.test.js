jest.mock('../daos/ReporteDAO');

const ReporteDAO = require('../daos/ReporteDAO');
const ReporteService = require('./ReporteService');

describe('ReporteService', () => {
  it('normaliza la sucursal antes de solicitar el resumen', async () => {
    const resumen = {
      ingresos_totales: '150.00',
      total_ventas: 4,
      ticket_promedio: '37.50',
      unidades_vendidas: 11,
    };
    ReporteDAO.obtenerResumenVentas.mockResolvedValue(resumen);

    const resultado = await ReporteService.obtenerResumenVentas({
      id_sucursal: '2',
      fecha_desde: '2026-08-01',
    });

    expect(ReporteDAO.obtenerResumenVentas).toHaveBeenCalledWith({
      id_sucursal: 2,
      fecha_desde: '2026-08-01',
    });
    expect(resultado).toEqual(resumen);
  });

  it('conserva los filtros de fecha para un resumen global', async () => {
    ReporteDAO.obtenerResumenVentas.mockResolvedValue({ ingresos_totales: '900.00' });

    await ReporteService.obtenerResumenVentas({
      fecha_hasta: '2026-08-31',
    });

    expect(ReporteDAO.obtenerResumenVentas).toHaveBeenCalledWith({
      fecha_hasta: '2026-08-31',
    });
  });
});
