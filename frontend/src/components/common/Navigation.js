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
    { title: 'Dashboard', path: '/dashboard', icon: <DashboardIcon />, roles: ['admin', 'staff', 'empleado'] },
    { title: 'Ventas', path: '/sales', icon: <PointOfSaleIcon />, roles: ['admin', 'staff', 'empleado'] },
    { title: 'Avisos', path: '/notices', icon: <NotificationsIcon />, roles: ['admin', 'instructor', 'staff'] },
  ];
  
  // Filtrar páginas según el rol del usuario
  const pages = allPages.filter(page => page.roles.includes(user.role));

  return (
    <AppBar position="static" sx={{ mb: 3, backgroundColor: '#1976d2' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Club de Boxeo
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
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
                  borderRadius: '0 0 8px 8px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
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
                    py: 1.5,
                    borderLeft: location.pathname === page.path ? '4px solid #1976d2' : '4px solid transparent',
                    backgroundColor: location.pathname === page.path ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      width: '40px',
                      color: location.pathname === page.path ? '#1976d2' : 'text.secondary'
                    }}>
                      {page.icon}
                    </Box>
                    <Typography 
                      sx={{ 
                        ml: 1,
                        fontWeight: location.pathname === page.path ? 'bold' : 'normal',
                        color: location.pathname === page.path ? '#1976d2' : 'text.primary'
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
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Club de Boxeo
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
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor:
                    location.pathname === page.path
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                {page.icon}
                <Typography sx={{ ml: 1 }}>{page.title}</Typography>
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Opciones">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar>
                  <PersonIcon />
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ 
                mt: '45px',
                '& .MuiPaper-root': {
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  minWidth: '200px',
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
              <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {user.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                  {user.role}
                </Typography>
              </Box>
              
              <MenuItem 
                onClick={onLogout}
                sx={{ 
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: 'rgba(244, 67, 54, 0.08)'
                  }
                }}
              >
                <LogoutIcon sx={{ mr: 1, color: '#f44336' }} />
                <Typography textAlign="center" color="error.main">Cerrar Sesión</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navigation;
