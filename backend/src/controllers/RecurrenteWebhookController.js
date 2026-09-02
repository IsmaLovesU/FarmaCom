const VentaService = require('../services/VentaService');

const recibir = async (req, res) => {
  try {
    const resultado = await VentaService.procesarWebhookRecurrente(
      req.body,
      req.headers,
    );
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(error.status || 500).json({ mensaje: error.message });
  }
};

module.exports = { recibir };
