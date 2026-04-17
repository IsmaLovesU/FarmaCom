require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
    const requestOrigin = req.headers.origin;

    if (requestOrigin === allowedOrigin) {
        res.setHeader('Access-Control-Allow-Origin', requestOrigin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/UsuarioRoutes');
const sucursalRoutes = require('./routes/SucursalRoutes');

app.get('/api/ping', (req, res) => {
    res.json({ status: 'ok', message: 'pong' });
});

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/sucursales', sucursalRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
