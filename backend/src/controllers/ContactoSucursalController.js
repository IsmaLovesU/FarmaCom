const ContactoSucursalService = require('../services/ContactoSucursalService');

class ContactoSucursalController {
  async obtener(req, res) {
    try {
      const data = await ContactoSucursalService.obtenerPorSucursal(Number(req.params.id));
      res.json(data);
    } catch (err) {
      res.status(500).json({ mensaje: err.message });
    }
  }

  async agregarTelefono(req, res) {
    try {
      const telefono = await ContactoSucursalService.agregarTelefono(
        Number(req.params.id),
        req.body.numero,
      );
      res.status(201).json(telefono);
    } catch (err) {
      res.status(400).json({ mensaje: err.message });
    }
  }

  async eliminarTelefono(req, res) {
    try {
      const eliminado = await ContactoSucursalService.eliminarTelefono(
        Number(req.params.idTelefono),
        Number(req.params.id),
      );
      res.json(eliminado);
    } catch (err) {
      res.status(404).json({ mensaje: err.message });
    }
  }

  async agregarCorreo(req, res) {
    try {
      const correo = await ContactoSucursalService.agregarCorreo(
        Number(req.params.id),
        req.body.correo,
      );
      res.status(201).json(correo);
    } catch (err) {
      res.status(400).json({ mensaje: err.message });
    }
  }

  async eliminarCorreo(req, res) {
    try {
      const eliminado = await ContactoSucursalService.eliminarCorreo(
        Number(req.params.idCorreo),
        Number(req.params.id),
      );
      res.json(eliminado);
    } catch (err) {
      res.status(404).json({ mensaje: err.message });
    }
  }
}

module.exports = new ContactoSucursalController();
