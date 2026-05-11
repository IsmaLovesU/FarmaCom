const { Router } = require('express');
const ContactoSucursalController = require('../controllers/ContactoSucursalController');

const router = Router({ mergeParams: true });

// GET    /api/sucursales/:id/contactos
router.get('/', ContactoSucursalController.obtener);

// POST   /api/sucursales/:id/contactos/telefonos
router.post('/telefonos', ContactoSucursalController.agregarTelefono);

// DELETE /api/sucursales/:id/contactos/telefonos/:idTelefono
router.delete('/telefonos/:idTelefono', ContactoSucursalController.eliminarTelefono);

// POST   /api/sucursales/:id/contactos/correos
router.post('/correos', ContactoSucursalController.agregarCorreo);

// DELETE /api/sucursales/:id/contactos/correos/:idCorreo
router.delete('/correos/:idCorreo', ContactoSucursalController.eliminarCorreo);

module.exports = router;
