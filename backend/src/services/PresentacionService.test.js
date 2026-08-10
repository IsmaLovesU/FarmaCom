jest.mock('../daos/PresentacionDAO');

const PresentacionDAO = require('../daos/PresentacionDAO');
const PresentacionService = require('./PresentacionService');

describe('PresentacionService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('crea una presentación cuando el nombre está disponible', async () => {
    const creada = { id_presentacion: 4, nombre: 'Frasco' };
    PresentacionDAO.obtenerPorNombre.mockResolvedValue(null);
    PresentacionDAO.crear.mockResolvedValue(creada);

    await expect(
      PresentacionService.crearPresentacion({ nombre: 'Frasco' }),
    ).resolves.toEqual(creada);
    expect(PresentacionDAO.crear).toHaveBeenCalledWith({ nombre: 'Frasco' });
  });

  it('rechaza nombres duplicados sin distinguir mayúsculas', async () => {
    PresentacionDAO.obtenerPorNombre.mockResolvedValue({ id_presentacion: 1, nombre: 'Caja' });

    await expect(
      PresentacionService.crearPresentacion({ nombre: 'caja' }),
    ).rejects.toMatchObject({ status: 409, message: 'Ya existe una presentación con ese nombre' });
  });

  it('actualiza una presentación existente', async () => {
    PresentacionDAO.obtenerPorId.mockResolvedValue({ id_presentacion: 2, nombre: 'Blíster' });
    PresentacionDAO.obtenerPorNombre.mockResolvedValue(null);
    PresentacionDAO.actualizar.mockResolvedValue({ id_presentacion: 2, nombre: 'Paquete' });

    await expect(
      PresentacionService.actualizarPresentacion(2, { nombre: 'Paquete' }),
    ).resolves.toEqual({ id_presentacion: 2, nombre: 'Paquete' });
  });

  it('impide eliminar una presentación asociada a productos', async () => {
    PresentacionDAO.obtenerPorId.mockResolvedValue({
      id_presentacion: 1,
      nombre: 'Caja',
      productos_asociados: 3,
    });

    await expect(PresentacionService.eliminarPresentacion(1)).rejects.toMatchObject({
      status: 409,
      message: 'No se puede eliminar una presentación asociada a productos',
    });
    expect(PresentacionDAO.eliminar).not.toHaveBeenCalled();
  });

  it('elimina una presentación sin productos asociados', async () => {
    PresentacionDAO.obtenerPorId.mockResolvedValue({
      id_presentacion: 5,
      nombre: 'Ampolla',
      productos_asociados: 0,
    });
    PresentacionDAO.eliminar.mockResolvedValue({ id_presentacion: 5, nombre: 'Ampolla' });

    await expect(PresentacionService.eliminarPresentacion(5)).resolves.toEqual({
      mensaje: 'Presentación eliminada correctamente',
    });
  });
});
