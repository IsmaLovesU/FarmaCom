require('dotenv').config();
const express = require('express');
const app = express();

const sucursalRoutes = require('./routes/SucursalRoutes');
const usuarioRoutes = require('./routes/UsuarioRoutes');

app.use(express.json());

app.get('/api/ping', (req, res) => {
  res.json({ status: 'ok', message: 'pong' });
});

app.use('/api/sucursales', sucursalRoutes);
app.use('/api/usuarios', usuarioRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});