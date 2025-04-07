const express = require('express');
const cors = require('cors');
const colors = require('colors');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const path = require('path');

// Cargar variables de entorno antes que todo
// dotenv.config({ path: path.join(__dirname, '../.env') });

// Conectar a la base de datos
connectDB();

// Inicializar Express
const app = express();

// CORS configuration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://gestion-club-de-boxeo-parra.onrender.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Middleware básico
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/sales', require('./routes/saleRoutes'));

// Ruta de prueba
// app.get('/api/test', (req, res) => {
//   res.json({ message: 'Backend is working!' });
// });

// Servir archivos estáticos en producción
if (process.env.NODE_ENV === 'production') {
  // Establecer carpeta estática
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // Cualquier ruta que no sea /api redirige al index.html
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
    }
  });
}

// Middleware de manejo de errores
app.use(errorHandler);

const port = process.env.PORT || 5000;

// Iniciar servidor
app.listen(port, () => {
  console.log(`Server running on port ${port}`.yellow.bold);
});
