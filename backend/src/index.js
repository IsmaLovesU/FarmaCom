require('dotenv').config();
const express = require('express');
const app = express();

const sucursalRoutes = require('./routes/SucursalRoutes');
const usuarioRoutes = require('./routes/UsuarioRoutes');
const productosRoutes = require('./routes/ProductosRoutes');

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.get('/api/ping', (req, res) => {
  res.json({ status: 'ok', message: 'pong' });
});

app.use('/api/sucursales', sucursalRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/productos', productosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});