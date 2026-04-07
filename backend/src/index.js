require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

// ─── Middlewares globales ────
app.use(express.json());
app.use(cookieParser());

// ─── Rutas ─────
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');

app.get('/api/ping', (req, res) => {
    res.json({ status: 'ok', message: 'pong' });
});

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);

// ─── Inicio ────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});