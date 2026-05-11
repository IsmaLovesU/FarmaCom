const ContactoSucursalDAO = require('../daos/ContactoSucursalDAO');

class ContactoSucursalService {
  async obtenerPorSucursal(id_sucursal) {
    return ContactoSucursalDAO.obtenerPorSucursal(id_sucursal);
  }

  async agregarTelefono(id_sucursal, numero) {
    if (!numero || !numero.trim()) throw new Error('El número es requerido');
    return ContactoSucursalDAO.agregarTelefono(id_sucursal, numero.trim());
  }

  async eliminarTelefono(id_telefono, id_sucursal) {
    const eliminado = await ContactoSucursalDAO.eliminarTelefono(id_telefono, id_sucursal);
    if (!eliminado) throw new Error('Teléfono no encontrado');
    return eliminado;
  }

  async agregarCorreo(id_sucursal, correo) {
    if (!correo || !correo.trim()) throw new Error('El correo es requerido');
    return ContactoSucursalDAO.agregarCorreo(id_sucursal, correo.trim());
  }

  async eliminarCorreo(id_correo, id_sucursal) {
    const eliminado = await ContactoSucursalDAO.eliminarCorreo(id_correo, id_sucursal);
    if (!eliminado) throw new Error('Correo no encontrado');
    return eliminado;
  }
}

module.exports = new ContactoSucursalService();
