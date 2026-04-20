require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';

const corsOptions = {
    origin(origin, callback) {
        if (!origin || origin === allowedOrigin) {
            return callback(null, true);
        }

        return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/UsuarioRoutes');
const sucursalRoutes = require('./routes/SucursalRoutes');
const telefonoSucursalRoutes = require('./routes/TelefonoSucursalRoutes');
const correoSucursalRoutes = require('./routes/CorreoSucursalRoutes');

app.get('/api/ping', (req, res) => {
    res.json({ status: 'ok', message: 'pong' });
});

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/sucursales', sucursalRoutes);

// Rutas anidadas: GET y POST bajo /api/sucursales/:id_sucursal/telefonos|correos
app.use('/api/sucursales/:id_sucursal/telefonos', telefonoSucursalRoutes);
app.use('/api/sucursales/:id_sucursal/correos', correoSucursalRoutes);

// Rutas planas: GET, PUT, DELETE por ID propio
app.use('/api/telefonos', telefonoSucursalRoutes);
app.use('/api/correos', correoSucursalRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});