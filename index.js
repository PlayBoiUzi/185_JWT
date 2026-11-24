require('dotenv').config();

const express = require('express');
const connectDatabase = require('./config/db');
const apiRoutes = require('./routes/api');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiRoutes);

async function startServer() {
  await connectDatabase();

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT harus berupa angka antara 1 dan 65535.');
  }

  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      console.log(`Server berjalan di http://localhost:${port}`);
      resolve(server);
    });
    server.once('error', reject);
  });
}

if (require.main === module) {
  startServer().catch(error => {
    console.error('Gagal menjalankan server:', error.message);
    process.exitCode = 1;
  });
}

module.exports = { app, startServer };