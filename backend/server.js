const path = require('path');
const express = require('express');
const cors = require('cors');
const colors = require('colors');

// Cargar variables de entorno antes que todo
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');

// Conectar a la base de datos
connectDB();

// Inicializar Express
const app = express();

// CORS configuration
app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
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
app.use('/api/notices', require('./routes/noticeRoutes'));

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
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`.yellow.bold);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('MongoDB URI:', process.env.MONGO_URI);
});
