const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Verificar que MONGO_URI está definido
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    // Configuración de conexión
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30 segundos
      socketTimeoutMS: 45000, // 45 segundos
      connectTimeoutMS: 30000, // 30 segundos
      keepAlive: true,
      retryWrites: true,
      w: 'majority'
    };

    // Si no hay una URI específica, usar la URI por defecto
    const uri = process.env.MONGO_URI || 'mongodb+srv://Spacecards:G0rillaz24@cluster0.xi0cc.mongodb.net/boxingclub?retryWrites=true&w=majority&appName=Cluster0';

    // Intentar conectar
    const conn = await mongoose.connect(uri, options);
    
    console.log('MongoDB URI:', process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    
    // Manejadores de eventos para la conexión
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

  } catch (error) {
    console.error('MongoDB connection error details:', error);
    console.error(`Failed to connect to MongoDB: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

module.exports = connectDB;
