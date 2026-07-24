jest.mock('../daos/VentaDAO');

const VentaDAO = require('../daos/VentaDAO');
const VentaService = require('./VentaService');

const usuario = {
  id_usuario: 7,
  id_sucursal: 2,
  rol: 'dependiente',
};

const ventaBorrador = {
  id_venta: 10,
  id_sucursal: 2,
  id_usuario: 7,
  estado: 'borrador',
  total: '25.00',
  detalles: [
    {
      descripcion: 'Artículo de prueba',
      cantidad: '2.0000',
      precio_unitario: '12.50',
      subtotal: '25.00',
    },
  ],
};

describe('VentaService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('crearVenta', () => {
    it('toma el usuario y la sucursal de la sesión autenticada', async () => {
      const datos = {
        observaciones: 'Venta de prueba',
        detalles: [
          {
            descripcion: 'Artículo de prueba',
            cantidad: 2,
            precio_unitario: 12.5,
          },
        ],
      };
      VentaDAO.crear.mockResolvedValue(ventaBorrador);

      const resultado = await VentaService.crearVenta(datos, usuario);

      expect(VentaDAO.crear).toHaveBeenCalledWith({
        id_sucursal: 2,
        id_usuario: 7,
        observaciones: 'Venta de prueba',
        detalles: datos.detalles,
      });
      expect(resultado).toEqual(ventaBorrador);
    });

    it('rechaza la operación si la sesión no contiene una sucursal', async () => {
      await expect(
        VentaService.crearVenta(
          { detalles: ventaBorrador.detalles },
          { id_usuario: 7 },
        ),
      ).rejects.toMatchObject({
        status: 401,
        message: 'No se pudo determinar el usuario o la sucursal de la venta',
      });
      expect(VentaDAO.crear).not.toHaveBeenCalled();
    });
  });

  describe('obtenerPorId', () => {
    it('limita la consulta a la sucursal del usuario', async () => {
      VentaDAO.obtenerPorId.mockResolvedValue(ventaBorrador);

      const resultado = await VentaService.obtenerPorId(10, usuario);

      expect(VentaDAO.obtenerPorId).toHaveBeenCalledWith(10, 2);
      expect(resultado).toEqual(ventaBorrador);
    });

    it('lanza error 404 cuando la venta no existe en la sucursal', async () => {
      VentaDAO.obtenerPorId.mockResolvedValue(null);

      await expect(
        VentaService.obtenerPorId(99, usuario),
      ).rejects.toMatchObject({
        status: 404,
        message: 'Venta no encontrada',
      });
    });
  });

  describe('actualizarVenta', () => {
    it('reemplaza los detalles de una venta en borrador', async () => {
      const campos = {
        detalles: [
          {
            descripcion: 'Nuevo artículo',
            cantidad: 1,
            precio_unitario: 8,
          },
        ],
      };
      VentaDAO.obtenerPorId.mockResolvedValue(ventaBorrador);
      VentaDAO.actualizar.mockResolvedValue({
        ...ventaBorrador,
        total: '8.00',
        detalles: campos.detalles,
      });

      const resultado = await VentaService.actualizarVenta(10, campos, usuario);

      expect(VentaDAO.actualizar).toHaveBeenCalledWith(10, 2, campos);
      expect(resultado.total).toBe('8.00');
    });

    it('impide editar una venta confirmada', async () => {
      VentaDAO.obtenerPorId.mockResolvedValue({
        ...ventaBorrador,
        estado: 'confirmada',
      });

      await expect(
        VentaService.actualizarVenta(10, { observaciones: 'Cambio' }, usuario),
      ).rejects.toMatchObject({
        status: 409,
        message: 'Solo se pueden editar ventas en estado borrador',
      });
      expect(VentaDAO.actualizar).not.toHaveBeenCalled();
    });
  });

  describe('eliminarVenta', () => {
    it('elimina una venta en borrador', async () => {
      VentaDAO.obtenerPorId.mockResolvedValue(ventaBorrador);
      VentaDAO.eliminar.mockResolvedValue({ id_venta: 10 });

      const resultado = await VentaService.eliminarVenta(10, usuario);

      expect(VentaDAO.eliminar).toHaveBeenCalledWith(10, 2);
      expect(resultado).toEqual({ mensaje: 'Venta eliminada correctamente' });
    });

    it('impide eliminar una venta confirmada', async () => {
      VentaDAO.obtenerPorId.mockResolvedValue({
        ...ventaBorrador,
        estado: 'confirmada',
      });

      await expect(
        VentaService.eliminarVenta(10, usuario),
      ).rejects.toMatchObject({
        status: 409,
        message: 'Solo se pueden eliminar ventas en estado borrador',
      });
      expect(VentaDAO.eliminar).not.toHaveBeenCalled();
    });
  });
});
