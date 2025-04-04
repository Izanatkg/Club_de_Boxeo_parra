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

// Middleware básico
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/sales', require('./routes/saleRoutes'));

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Servir archivos estáticos en producción
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
    )
  );
}

// Middleware de manejo de errores
app.use(errorHandler);

const port = process.env.PORT || 5000;

// Iniciar servidor
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`.yellow.bold);
});
