require('dotenv').config();
const express = require('express');
const app = express();

app.get('/api/ping', (req, res) => {
  res.json({ status: 'ok', message: 'pong' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});