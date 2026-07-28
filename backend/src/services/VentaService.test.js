jest.mock('../daos/VentaDAO');

const VentaDAO = require('../daos/VentaDAO');
const VentaService = require('./VentaService');

const usuarioDependiente = {
  id_usuario: 7,
  id_sucursal: 1,
  rol: 'dependiente',
};

const datosVenta = {
  id_sucursal: 1,
  id_cliente: null,
  metodo_pago: 'efectivo',
  monto_recibido: 30,
  detalles: [
    { id_lote: 2, cantidad: 2 },
    { id_lote: 1, cantidad: 1 },
  ],
};

const lotesDisponibles = [
  {
    id_lote: 1,
    id_sucursal: 1,
    stock_actual: 4,
    precio_venta: '10.00',
    producto_activo: true,
    vencido: false,
  },
  {
    id_lote: 2,
    id_sucursal: 1,
    stock_actual: 5,
    precio_venta: '7.50',
    producto_activo: true,
    vencido: false,
  },
];

describe('VentaService', () => {
  beforeEach(() => {
    VentaDAO.ejecutarEnTransaccion.mockImplementation((operacion) => operacion({}));
  });

  describe('crearVenta', () => {
    it('guarda la venta, descuenta stock y calcula el cambio en el servidor', async () => {
      VentaDAO.obtenerLotesParaVenta.mockResolvedValue(lotesDisponibles);
      VentaDAO.crearVenta.mockResolvedValue({ id_venta: 21 });
      VentaDAO.descontarStock.mockResolvedValue({ id_lote: 1 });
      VentaDAO.crearDetalle.mockResolvedValue({});
      VentaDAO.obtenerPorId.mockResolvedValue({ id_venta: 21, total: '25.00' });

      const resultado = await VentaService.crearVenta(datosVenta, usuarioDependiente);

      expect(VentaDAO.obtenerLotesParaVenta).toHaveBeenCalledWith([1, 2], {});
      expect(VentaDAO.crearVenta).toHaveBeenCalledWith({
        id_sucursal: 1,
        id_usuario: 7,
        id_cliente: null,
        total: '25.00',
        monto_recibido: '30.00',
        cambio: '5.00',
      }, {});
      expect(VentaDAO.descontarStock).toHaveBeenCalledTimes(2);
      expect(VentaDAO.crearDetalle).toHaveBeenCalledWith({
        id_venta: 21,
        id_lote: 2,
        cantidad: 2,
        precio_unitario: '7.50',
      }, {});
      expect(resultado).toEqual({ id_venta: 21, total: '25.00' });
    });

    it('rechaza la venta completa si un lote no tiene stock suficiente', async () => {
      VentaDAO.obtenerLotesParaVenta.mockResolvedValue([
        lotesDisponibles[0],
        { ...lotesDisponibles[1], stock_actual: 1 },
      ]);

      await expect(
        VentaService.crearVenta(datosVenta, usuarioDependiente),
      ).rejects.toMatchObject({
        status: 409,
        message: 'Stock insuficiente para el lote 2',
      });
      expect(VentaDAO.crearVenta).not.toHaveBeenCalled();
    });

    it('bloquea lotes vencidos', async () => {
      VentaDAO.obtenerLotesParaVenta.mockResolvedValue([
        { ...lotesDisponibles[0], vencido: true },
        lotesDisponibles[1],
      ]);

      await expect(
        VentaService.crearVenta(datosVenta, usuarioDependiente),
      ).rejects.toMatchObject({
        status: 409,
        message: 'No se puede vender el lote 1 porque está vencido',
      });
    });

    it('rechaza pagos distintos de efectivo', async () => {
      await expect(
        VentaService.crearVenta(
          { ...datosVenta, metodo_pago: 'tarjeta' },
          usuarioDependiente,
        ),
      ).rejects.toMatchObject({
        status: 400,
        message: 'Por el momento, únicamente se aceptan ventas en efectivo',
      });
      expect(VentaDAO.ejecutarEnTransaccion).not.toHaveBeenCalled();
    });

    it('rechaza un monto recibido menor que el total calculado', async () => {
      VentaDAO.obtenerLotesParaVenta.mockResolvedValue(lotesDisponibles);

      await expect(
        VentaService.crearVenta(
          { ...datosVenta, monto_recibido: 20 },
          usuarioDependiente,
        ),
      ).rejects.toMatchObject({
        status: 400,
        message: 'El monto recibido es insuficiente. El total es Q25.00',
      });
      expect(VentaDAO.crearVenta).not.toHaveBeenCalled();
    });

    it('rechaza detalles duplicados para el mismo lote', async () => {
      await expect(
        VentaService.crearVenta({
          ...datosVenta,
          detalles: [
            { id_lote: 1, cantidad: 1 },
            { id_lote: 1, cantidad: 2 },
          ],
        }, usuarioDependiente),
      ).rejects.toMatchObject({
        status: 400,
        message: 'Cada lote debe aparecer una sola vez en los detalles de la venta',
      });
      expect(VentaDAO.ejecutarEnTransaccion).not.toHaveBeenCalled();
    });

    it('impide que un dependiente venda inventario de otra sucursal', async () => {
      await expect(
        VentaService.crearVenta(
          { ...datosVenta, id_sucursal: 2 },
          usuarioDependiente,
        ),
      ).rejects.toMatchObject({ status: 403 });
      expect(VentaDAO.ejecutarEnTransaccion).not.toHaveBeenCalled();
    });
  });

  describe('asociarCliente', () => {
    it('permite asociar una venta existente a un cliente', async () => {
      VentaDAO.obtenerParaActualizar.mockResolvedValue({
        id_venta: 21,
        id_sucursal: 1,
      });
      VentaDAO.obtenerClientePorId.mockResolvedValue({ id_cliente: 4 });
      VentaDAO.actualizarCliente.mockResolvedValue({ id_venta: 21, id_cliente: 4 });
      VentaDAO.obtenerPorId.mockResolvedValue({ id_venta: 21, id_cliente: 4 });

      const resultado = await VentaService.asociarCliente(
        21,
        4,
        usuarioDependiente,
      );

      expect(VentaDAO.actualizarCliente).toHaveBeenCalledWith(21, 4, {});
      expect(resultado).toEqual({ id_venta: 21, id_cliente: 4 });
    });
  });

  describe('anularVenta', () => {
    it('repone el stock de cada detalle y conserva la venta como anulada', async () => {
      VentaDAO.obtenerParaActualizar.mockResolvedValue({
        id_venta: 21,
        id_sucursal: 1,
        estado: 'completada',
      });
      VentaDAO.obtenerDetallesParaAnulacion.mockResolvedValue([
        { id_lote: 1, cantidad: 1 },
        { id_lote: 2, cantidad: 2 },
      ]);
      VentaDAO.restaurarStock.mockResolvedValue({ id_lote: 1 });
      VentaDAO.anular.mockResolvedValue({ id_venta: 21, estado: 'anulada' });
      VentaDAO.obtenerPorId.mockResolvedValue({ id_venta: 21, estado: 'anulada' });

      const resultado = await VentaService.anularVenta(
        21,
        'Error de digitación',
        usuarioDependiente,
      );

      expect(VentaDAO.restaurarStock).toHaveBeenCalledTimes(2);
      expect(VentaDAO.anular).toHaveBeenCalledWith(
        21,
        'Error de digitación',
        {},
      );
      expect(resultado.estado).toBe('anulada');
    });

    it('no permite anular dos veces la misma venta', async () => {
      VentaDAO.obtenerParaActualizar.mockResolvedValue({
        id_venta: 21,
        id_sucursal: 1,
        estado: 'anulada',
      });

      await expect(
        VentaService.anularVenta(21, null, usuarioDependiente),
      ).rejects.toMatchObject({
        status: 409,
        message: 'La venta ya está anulada',
      });
      expect(VentaDAO.restaurarStock).not.toHaveBeenCalled();
    });
  });
});
