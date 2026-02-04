import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../../features/auth/authSlice';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Payments as PaymentsIcon,
  Inventory as InventoryIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  PointOfSale as PointOfSaleIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';

function Navigation() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
  };

  // Definir todas las páginas disponibles
  const allPages = [
    { title: 'Estudiantes', path: '/students', icon: <GroupIcon />, roles: ['admin', 'instructor', 'staff', 'empleado'] },
    { title: 'Pagos', path: '/payments', icon: <PaymentsIcon />, roles: ['admin', 'instructor', 'staff', 'empleado'] },
    { title: 'Productos', path: '/products', icon: <InventoryIcon />, roles: ['admin', 'staff'] },
    { title: 'Venta', path: '/dashboard', icon: <DashboardIcon />, roles: ['admin', 'staff', 'empleado'] },
    { title: 'Resumen de ventas', path: '/sales', icon: <PointOfSaleIcon />, roles: ['admin', 'staff', 'empleado'] },
    { title: 'Avisos', path: '/notices', icon: <NotificationsIcon />, roles: ['admin', 'instructor', 'staff'] },
  ];
  
  // Filtrar páginas según el rol del usuario
  const pages = allPages.filter(page => page.roles.includes(user.role));

  return (
    <AppBar position="static" sx={{ mb: 3, backgroundColor: 'transparent', boxShadow: 'none' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ py: 1 }}>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 900,
              color: '#d4af37',
              textDecoration: 'none',
              fontSize: '1.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Club de Boxeo Parra
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ color: '#d4af37' }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiPaper-root': {
                  width: '100%',
                  maxWidth: '300px',
                  left: '0 !important',
                  right: '0 !important',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  borderRadius: '0 0 16px 16px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                  backgroundColor: '#ffffff',
                  border: '2px solid #d4af37',
                  borderTop: 'none',
                }
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.path}
                  onClick={handleCloseNavMenu}
                  component={Link}
                  to={page.path}
                  selected={location.pathname === page.path}
                  sx={{
                    py: 2,
                    borderLeft: location.pathname === page.path ? '4px solid #d4af37' : '4px solid transparent',
                    backgroundColor: location.pathname === page.path ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                    color: location.pathname === page.path ? '#d4af37' : '#ffffff',
                    '&:hover': {
                      backgroundColor: 'rgba(212, 175, 55, 0.05)',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      width: '40px',
                      color: location.pathname === page.path ? '#d4af37' : '#d4af37'
                    }}>
                      {page.icon}
                    </Box>
                    <Typography 
                      sx={{ 
                        ml: 1,
                        fontWeight: location.pathname === page.path ? 'bold' : '600',
                        fontSize: '0.9rem'
                      }}
                    >
                      {page.title}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 900,
              color: '#d4af37',
              textDecoration: 'none',
              fontSize: '1.2rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Club de Boxeo Parra
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.path}
                component={Link}
                to={page.path}
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  color: location.pathname === page.path ? '#d4af37' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor:
                    location.pathname === page.path
                      ? 'rgba(212, 175, 55, 0.2)'
                      : 'transparent',
                  borderRadius: '8px',
                  px: 2,
                  py: 1,
                  mx: 0.5,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  border: location.pathname === page.path ? '1px solid #d4af37' : '1px solid transparent',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    borderColor: '#d4af37',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                {page.icon}
                <Typography sx={{ ml: 1, fontSize: '0.9rem' }}>{page.title}</Typography>
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Opciones">
              <IconButton 
                onClick={handleOpenUserMenu} 
                sx={{ 
                  p: 0,
                  color: '#d4af37',
                  '&:hover': {
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                  }
                }}
              >
                <Avatar sx={{ 
                  backgroundColor: '#d4af37', 
                  color: '#000000',
                  fontWeight: 'bold'
                }}>
                  <PersonIcon />
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ 
                mt: '45px',
                '& .MuiPaper-root': {
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                  minWidth: '220px',
                  backgroundColor: '#ffffff',
                  border: '2px solid #d4af37',
                }
              }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {/* Mostrar información del usuario */}
              <Box sx={{ 
                px: 3, 
                py: 2, 
                borderBottom: '2px solid #d4af37',
                backgroundColor: 'rgba(212, 175, 55, 0.05)'
              }}>
                <Typography variant="subtitle1" sx={{ 
                  fontWeight: 'bold',
                  color: '#000000',
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em'
                }}>
                  {user.name}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#d4af37',
                  textTransform: 'capitalize',
                  fontWeight: 600
                }}>
                  {user.role}
                </Typography>
              </Box>
              
              <MenuItem 
                onClick={onLogout}
                sx={{ 
                  py: 2,
                  px: 3,
                  '&:hover': {
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                  }
                }}
              >
                <LogoutIcon sx={{ mr: 2, color: '#dc2626' }} />
                <Typography 
                  textAlign="center" 
                  sx={{ 
                    color: '#d4af37',
                    fontWeight: 600
                  }}
                >
                  Cerrar Sesión
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navigation;
