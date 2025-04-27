import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Button, Container, Grid, Paper, Divider, IconButton, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { getNotices } from '../features/notices/noticeSlice';
import './Landing.css';

// Componentes estilizados
const HeroSection = styled(Box)(({ theme }) => ({
  height: '100vh',
  backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("images/459027765_1295704515204292_8972208912016071407_n.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  color: 'white',
  position: 'relative',
}));

const NavBar = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  zIndex: 10,
}));

const NavLink = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(0, 2),
  cursor: 'pointer',
  '&:hover': {
    borderBottom: '2px solid white',
  },
}));

const AdminButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: 'white',
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

const NoticeCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: '#f5f5f5',
  borderLeft: `4px solid ${theme.palette.primary.main}`,
}));

const Landing = () => {
  const dispatch = useDispatch();
  const { notices, isLoading, isError, message } = useSelector((state) => state.notices);

  useEffect(() => {
    dispatch(getNotices());
  }, [dispatch]);

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <NavBar>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
              <img src="images/logo.jpg" alt="Club de Boxeo Parra Logo" style={{ height: '50px', borderRadius: '50%', marginRight: '15px' }} />
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                CLUB DE BOXEO PARRA
              </Typography>
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <NavLink variant="body1">HOME</NavLink>
              <NavLink variant="body1">ENTRENAMIENTO</NavLink>
              <NavLink variant="body1">BLOG</NavLink>
              <NavLink variant="body1">CONTACTO</NavLink>
            </Box>
          </Box>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <AdminButton variant="contained">ADMINISTRACIÓN</AdminButton>
          </Link>
        </NavBar>

        <Container>
          <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={8} sx={{ textAlign: 'center' }}>
              <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 2, textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                BOXEO PROFESIONAL
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
                ENTRENAMIENTO OFICIAL EN TEPIC, NAYARIT
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Typography variant="body1" sx={{ mr: 2 }}>
                  01/03
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton size="small" sx={{ color: 'white', mx: 1 }}>
                    &lt;
                  </IconButton>
                  <IconButton size="small" sx={{ color: 'white', mx: 1 }}>
                    &gt;
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>

        <Box sx={{ position: 'absolute', bottom: 20, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <IconButton sx={{ color: 'white', mx: 1 }}>
            <FacebookIcon />
          </IconButton>
          <IconButton sx={{ color: 'white', mx: 1 }}>
            <InstagramIcon />
          </IconButton>
          <IconButton sx={{ color: 'white', mx: 1 }}>
            <TwitterIcon />
          </IconButton>
          <IconButton sx={{ color: 'white', mx: 1 }}>
            <YouTubeIcon />
          </IconButton>
        </Box>
      </HeroSection>

      {/* Avisos Section */}
      <Container sx={{ py: 6 }}>
        <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 'bold' }}>
          AVISOS IMPORTANTES
        </Typography>
        <Divider sx={{ mb: 4 }} />

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Typography color="error">Error al cargar los avisos: {message}</Typography>
        ) : notices.length > 0 ? (
          notices.map((notice) => (
            <NoticeCard key={notice._id} elevation={1}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                {notice.title}
              </Typography>
              <Typography variant="body1">{notice.content}</Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                Publicado: {new Date(notice.createdAt).toLocaleDateString()}
              </Typography>
            </NoticeCard>
          ))
        ) : (
          <Typography>No hay avisos disponibles en este momento.</Typography>
        )}
      </Container>

      {/* Sección de Imagen Adicional */}
      <Box sx={{ py: 6, bgcolor: '#f5f5f5' }}>
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
                ENTRENA COMO UN CAMPEÓN
              </Typography>
              <Typography variant="body1" sx={{ mb: 4 }}>
                En Club de Boxeo Parra ofrecemos entrenamiento profesional para todos los niveles. Desde principiantes hasta boxeadores avanzados, nuestros entrenadores certificados te ayudarán a alcanzar tus metas.
              </Typography>
              <Typography variant="body1">
                Contamos con instalaciones de primer nivel, equipamiento profesional y un ambiente motivador para que des lo mejor de ti en cada entrenamiento.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <img src="images/444990179_1216950283079716_5435413490193245865_n.jpg" alt="Entrenamiento de boxeo" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'black', color: 'white', py: 4 }}>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <img src="images/logo.jpg" alt="Club de Boxeo Parra Logo" style={{ height: '40px', borderRadius: '50%', marginRight: '10px' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  CLUB DE BOXEO PARRA
                </Typography>
              </Box>
              <Typography variant="body2">
                Entrenamiento profesional de boxeo en Tepic, Nayarit. Clases para todos los niveles y edades.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                CONTACTO
              </Typography>
              <Typography variant="body2">Dirección: Av. Principal #123, Tepic, Nayarit</Typography>
              <Typography variant="body2">Teléfono: (311) 123-4567</Typography>
              <Typography variant="body2">Email: info@clubdboxeoparra.com</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                HORARIO
              </Typography>
              <Typography variant="body2">Lunes a Viernes: 6:00 AM - 10:00 PM</Typography>
              <Typography variant="body2">Sábados: 8:00 AM - 2:00 PM</Typography>
              <Typography variant="body2">Domingos: Cerrado</Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2">© {new Date().getFullYear()} Club de Boxeo Parra. Todos los derechos reservados.</Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
