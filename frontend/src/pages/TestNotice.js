import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, TextField, Button, Box, Paper, CircularProgress } from '@mui/material';
import { createNotice } from '../features/notices/noticeSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const TestNotice = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.notices);
  
  const [noticeData, setNoticeData] = useState({
    title: 'Horario Especial',
    content: 'El Club de Boxeo Parra permanecerá cerrado el próximo domingo 4 de mayo por mantenimiento de instalaciones. Gracias por su comprensión.',
    isActive: true
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNoticeData({
      ...noticeData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createNotice(noticeData));
    toast.success('Aviso creado correctamente');
    setTimeout(() => {
      navigate('/notices');
    }, 2000);
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4">Acceso denegado</Typography>
        <Typography>Debes iniciar sesión para acceder a esta página.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
          Crear Aviso de Prueba
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Título"
            name="title"
            value={noticeData.title}
            onChange={handleChange}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Contenido"
            name="content"
            value={noticeData.content}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={4}
            required
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            sx={{ mt: 3 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Crear Aviso'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default TestNotice;
