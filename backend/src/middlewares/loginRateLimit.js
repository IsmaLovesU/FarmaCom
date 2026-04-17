const rateLimit = require('express-rate-limit');

const loginRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    message: {
        mensaje: 'Demasiados intentos de inicio de sesión. Intenta de nuevo más tarde.',
    },
});

module.exports = loginRateLimit;
