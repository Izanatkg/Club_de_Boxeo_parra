# 🚀 Guía de Despliegue - Club de Boxeo App

## 📋 Resumen

Esta guía explica cómo desplegar la aplicación del Club de Boxeo en Render.com con configuración optimizada para producción y keep-alive automático.

## 🏗️ Arquitectura del Despliegue

```
Frontend (React) + Backend (Node.js) → Database (MongoDB Atlas)
       ↓               ↓                    ↓
   Render.com (Completo)           MongoDB Atlas
   (Principal)                    (Producción)
```

## 🛠️ Configuración Previa

### 1. Cuenta en Render.com
- Crea una cuenta gratuita en [render.com](https://render.com)
- Conecta tu cuenta de GitHub/GitLab

### 2. Base de Datos MongoDB Atlas
- Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas)
- Crea un cluster gratuito (M0)
- Obtén tu connection string

## 📁 Archivos de Configuración Creados

### `render.yaml`
```yaml
services:
  - type: web
    name: club-boxeo-app
    env: node
    plan: free
    buildCommand: "npm run build"
    startCommand: "npm start"
    healthCheckPath: /api/health
```

### `.env.production`
Variables de entorno específicas para producción.

### `.github/workflows/keep-alive.yml`
GitHub Actions para mantener la aplicación activa.

## 🚀 Pasos de Despliegue

### Paso 1: Preparar el Repositorio

```bash
# Asegúrate de tener todos los cambios commiteados
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### Paso 2: Despliegue en Render

1. **Inicia sesión en Render.com**
2. **Crea un nuevo Web Service**
   - Click en "New +" → "Web Service"
   - Conecta tu repositorio de GitHub
   - Selecciona el repositorio `Club de boxeo app`
   - Render detectará automáticamente la configuración de `render.yaml`

3. **Configura las Variables de Entorno**
   ```
   NODE_ENV=production
   PORT=10000
   MONGO_URI=tu_mongodb_connection_string
   JWT_SECRET=tu_jwt_secreto_seguro
   ```

4. **Configura el Health Check**
   - Path: `/api/health`
   - Check interval: 30s
   - Timeout: 10s
   - Grace period: 30s

### Paso 3: Verificar el Despliegue

1. **Espera a que el build complete** (puede tardar 5-10 minutos)
2. **Verifica el health check**:
   ```bash
   curl https://tu-app.onrender.com/api/health
   ```
3. **Prueba la aplicación completa**

## 🔄 Configuración de Keep-Alive

### GitHub Actions Automático

El workflow `.github/workflows/keep-alive.yml` se ejecutará cada 10 minutos para mantener la aplicación activa.

**Para activarlo:**
1. Haz push a tu repositorio
2. Ve a la pestaña "Actions" en GitHub
3. Habilita los workflows si es necesario
4. Verifica que el workflow "Keep Render App Alive" se esté ejecutando

### Manual Keep-Alive (Opcional)

Si necesitas un keep-alive más robusto:

```javascript
// Agregar a tu backend
const keepAlive = () => {
  setInterval(async () => {
    try {
      await axios.get(`${process.env.RENDER_EXTERNAL_URL}/api/health`);
      console.log('Keep-alive ping sent');
    } catch (error) {
      console.log('Keep-alive failed:', error.message);
    }
  }, 10 * 60 * 1000); // Cada 10 minutos
};
```

## 📊 Monitoreo y Mantenimiento

### Health Check Endpoint
```
GET /api/health
Response:
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "environment": "production"
}
```

### Logs en Render
- Ve a tu servicio en Render.com
- Click en "Logs" para ver los logs en tiempo real
- Filtra por errores o advertencias

### Métricas Importantes
- **Uptime**: Debería ser >95% con keep-alive
- **Response time**: <2s para el health check
- **Memory usage**: <512MB (límite del plan gratuito)

## 🔧 Solución de Problemas Comunes

### Problema: App se duerme después de 15 minutos
**Solución**: El keep-alive debería prevenir esto. Si persiste:
1. Verifica que el GitHub Actions esté activo
2. Revisa la URL en el workflow
3. Considera un servicio de keep-alive externo como UptimeRobot

### Problema: Error de conexión a MongoDB
**Solución**:
1. Verifica que la IP de Render esté en la whitelist de MongoDB Atlas
2. Confirma que el connection string sea correcto
3. Revisa las variables de entorno

### Problema: Build falla
**Solución**:
1. Revisa los logs de build en Render
2. Verifica que todas las dependencias estén en package.json
3. Asegúrate de que el script `build` funcione localmente

## 🚀 Optimizaciones Adicionales

### 1. Compresión de Respuestas
```javascript
const compression = require('compression');
app.use(compression());
```

### 2. Caché HTTP
```javascript
app.use(express.static('build', {
  maxAge: '1y',
  etag: true
}));
```

### 3. Database Connection Pooling
```javascript
mongoose.connect(process.env.MONGO_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
```

## 📈 Escalabilidad

### Cuando necesites escalar:
1. **Plan Starter de Render** ($7/mes)
   - Sin sleep time
   - Más RAM y CPU
   - Build más rápidos

2. **Frontend y Backend en Render**
   - Mejor rendimiento integrado
   - Una sola plataforma para gestionar
   - Sin configuración CORS compleja

3. **Base de Datos Mejorada**
   - MongoDB Atlas M10 ($25/mes)
   - Mejor rendimiento
   - Backups automáticos

## Checklist Final de Despliegue
## 🎯 Checklist Final de Despliegue

- [ ] Repositorio conectado a Render
- [ ] Variables de entorno configuradas
- [ ] Health check funcionando
- [ ] GitHub Actions activo
- [ ] MongoDB Atlas accesible
- [ ] Frontend cargando correctamente
- [ ] Autenticación funcionando
- [ ] Todas las rutas API probadas
- [ ] Logs sin errores críticos

## 🆘 Soporte

Si encuentras problemas:
1. Revisa los logs en Render.com
2. Verifica esta documentación
3. Consulta la [documentación de Render](https://render.com/docs)
4. Revisa los issues comunes en GitHub

---

**¡Tu aplicación está lista para producción!** 🎉
