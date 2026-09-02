const { Router } = require('express');
const RecurrenteWebhookController = require('../controllers/RecurrenteWebhookController');

const router = Router();

router.post('/', RecurrenteWebhookController.recibir);

module.exports = router;
