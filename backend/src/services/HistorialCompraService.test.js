jest.mock('../daos/ClienteDAO');
jest.mock('../daos/HistorialCompraDAO');

const ClienteDAO = require('../daos/ClienteDAO');
const HistorialCompraDAO = require('../daos/HistorialCompraDAO');
const HistorialCompraService = require('./HistorialCompraService');

describe('HistorialCompraService', () => {
  const cliente = { id_cliente: 4, nombre_cliente: 'Cliente Frecuente' };
  const usuarioDependiente = {
    id_usuario: 2,
    id_sucursal: 1,
    rol: 'dependiente',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    ClienteDAO.obtenerPorId.mockResolvedValue(cliente);
  });

  it('devuelve el cliente, resumen y compras del historial', async () => {
    const compras = [
      { id_venta: 10, total: '25.50', cantidad_articulos: 3, estado: 'completada', detalles: [] },
      { id_venta: 9, total: '10.00', cantidad_articulos: 1, estado: 'completada', detalles: [] },
    ];
    HistorialCompraDAO.obtenerPorCliente.mockResolvedValue(compras);

    const resultado = await HistorialCompraService.obtenerPorCliente(
      4,
      { estado: 'completada' },
      usuarioDependiente,
    );

    expect(HistorialCompraDAO.obtenerPorCliente).toHaveBeenCalledWith({
      id_cliente: 4,
      id_sucursal: 1,
      estado: 'completada',
      fecha_desde: undefined,
      fecha_hasta: undefined,
    });
    expect(resultado).toEqual({
      cliente,
      resumen: {
        total_compras: 2,
        total_articulos: 4,
        monto_total: '35.50',
      },
      compras,
    });
  });

  it('lanza 404 si el cliente no existe', async () => {
    ClienteDAO.obtenerPorId.mockResolvedValue(null);

    await expect(
      HistorialCompraService.obtenerPorCliente(99, {}, usuarioDependiente),
    ).rejects.toMatchObject({
      status: 404,
      message: 'Cliente no encontrado',
    });
    expect(HistorialCompraDAO.obtenerPorCliente).not.toHaveBeenCalled();
  });

  it('no suma ventas anuladas en el resumen', async () => {
    const compras = [
      { id_venta: 10, total: '25.50', cantidad_articulos: 3, estado: 'completada', detalles: [] },
      { id_venta: 9, total: '10.00', cantidad_articulos: 1, estado: 'anulada', detalles: [] },
    ];
    HistorialCompraDAO.obtenerPorCliente.mockResolvedValue(compras);

    const resultado = await HistorialCompraService.obtenerPorCliente(
      4,
      {},
      usuarioDependiente,
    );

    expect(resultado.resumen).toEqual({
      total_compras: 1,
      total_articulos: 3,
      monto_total: '25.50',
    });
    expect(resultado.compras).toEqual(compras);
  });

  it('impide a un dependiente consultar otra sucursal', async () => {
    await expect(
      HistorialCompraService.obtenerPorCliente(
        4,
        { id_sucursal: 2 },
        usuarioDependiente,
      ),
    ).rejects.toMatchObject({
      status: 403,
      message: 'No tienes permiso para consultar historial de otra sucursal',
    });
    expect(HistorialCompraDAO.obtenerPorCliente).not.toHaveBeenCalled();
  });

  it('rechaza rangos de fechas invertidos', async () => {
    await expect(
      HistorialCompraService.obtenerPorCliente(
        4,
        { fecha_desde: '2026-07-28', fecha_hasta: '2026-07-01' },
        usuarioDependiente,
      ),
    ).rejects.toMatchObject({
      status: 400,
      message: 'fecha_desde no puede ser posterior a fecha_hasta',
    });
  });
});
