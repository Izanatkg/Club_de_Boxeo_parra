import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, LinearProgress } from '@mui/material';

// Tiempo de inactividad en milisegundos (15 minutos)
const INACTIVITY_TIMEOUT = 15 * 60 * 1000;
// Tiempo de advertencia antes del cierre de sesión (1 minuto)
const WARNING_TIMEOUT = 60 * 1000;

const SessionTimeout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [showWarning, setShowWarning] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [warningTime, setWarningTime] = useState(0);
  const [countdown, setCountdown] = useState(WARNING_TIMEOUT / 1000);
  
  // Función para actualizar el tiempo de la última actividad
  const updateActivity = () => {
    setLastActivity(Date.now());
    if (showWarning) {
      setShowWarning(false);
    }
  };
  
  // Función para cerrar sesión
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setShowWarning(false);
  };
  
  // Función para mantener la sesión activa
  const keepSessionAlive = () => {
    updateActivity();
  };
  
  // Efecto para monitorear la actividad del usuario
  useEffect(() => {
    if (!user) return;
    
    // Eventos que consideramos como actividad del usuario
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    // Registrar la actividad del usuario
    events.forEach(event => {
      window.addEventListener(event, updateActivity);
    });
    
    // Verificar inactividad cada 10 segundos
    const interval = setInterval(() => {
      const currentTime = Date.now();
      const userInactiveTime = currentTime - lastActivity;
      
      // Si el tiempo de inactividad es mayor que el tiempo de inactividad menos el tiempo de advertencia
      if (userInactiveTime > INACTIVITY_TIMEOUT - WARNING_TIMEOUT) {
        // Mostrar advertencia si no se está mostrando ya
        if (!showWarning) {
          setShowWarning(true);
          setWarningTime(currentTime);
        }
      }
      
      // Si el tiempo de inactividad es mayor que el tiempo de inactividad, cerrar sesión
      if (userInactiveTime > INACTIVITY_TIMEOUT) {
        handleLogout();
      }
    }, 10000);
    
    // Limpiar eventos y intervalos
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
      clearInterval(interval);
    };
  }, [user, lastActivity, showWarning, dispatch, navigate]);
  
  // Efecto para la cuenta regresiva
  useEffect(() => {
    if (!showWarning) return;
    
    const interval = setInterval(() => {
      const currentTime = Date.now();
      const elapsedWarningTime = currentTime - warningTime;
      const remainingTime = Math.max(0, Math.floor((WARNING_TIMEOUT - elapsedWarningTime) / 1000));
      
      setCountdown(remainingTime);
      
      if (remainingTime <= 0) {
        clearInterval(interval);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [showWarning, warningTime]);
  
  // Si no hay usuario autenticado, no mostrar nada
  if (!user) return null;
  
  return (
    <Dialog open={showWarning} onClose={keepSessionAlive}>
      <DialogTitle>Sesión a punto de expirar</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Su sesión está a punto de expirar por inactividad.
        </Typography>
        <Typography variant="body2" gutterBottom>
          Será desconectado en {countdown} segundos.
        </Typography>
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress 
            variant="determinate" 
            value={(countdown / (WARNING_TIMEOUT / 1000)) * 100} 
            color="error"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleLogout} color="error">
          Cerrar sesión
        </Button>
        <Button onClick={keepSessionAlive} color="primary" variant="contained">
          Mantener sesión activa
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionTimeout;
