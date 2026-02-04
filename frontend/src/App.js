import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Navigation from './components/common/Navigation';
import SessionTimeout from './components/common/SessionTimeout';
import Login from './pages/Login';
import Students from './pages/Students';
import Payments from './pages/Payments';
import Products from './pages/Products';
import Dashboard from './pages/Dashboard';
import Sales from './pages/Sales';
import Notices from './pages/Notices';
import Landing from './pages/Landing';
import TestNotice from './pages/TestNotice';
import { useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#da2525', // Rojo intenso
      dark: '#b82020', // Rojo oscuro
      light: '#f04040', // Rojo claro
      contrastText: '#ffffff', // Texto blanco sobre rojo
    },
    secondary: {
      main: '#ffffff', // Gris medio
      dark: '#3a3939', // Gris oscuro
      light: '#6b6a6a', // Gris claro
      contrastText: '#ffffff', // Texto blanco sobre gris
    },
    background: {
      default: '#151414', // Negro más oscuro
      paper: '#1d1b1b', // Negro grisáceo
    },
    text: {
      primary: '#ffffff', // Blanco rosado suave
      secondary: '#ffffff', // Gris medio
    },
    error: {
      main: '#da2525', // Rojo para errores
    },
    warning: {
      main: '#da2525', // Rojo para advertencias
    },
    success: {
      main: '#da2525', // Rojo para éxito
    },
    info: {
      main: '#e7dada', // Blanco rosado para información
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 900,
      fontSize: {
        xs: '2rem',
        sm: '2.5rem',
        md: '3rem',
      },
      color: '#ffffff',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    h2: {
      fontWeight: 800,
      fontSize: {
        xs: '1.5rem',
        sm: '2rem',
        md: '2.5rem',
      },
      color: '#ffffff',
      textTransform: 'uppercase',
      letterSpacing: '0.03em',
    },
    h3: {
      fontWeight: 700,
      fontSize: {
        xs: '1.25rem',
        sm: '1.5rem',
        md: '1.75rem',
      },
      color: '#ffffff',
      textTransform: 'uppercase',
      letterSpacing: '0.02em',
    },
    h4: {
      fontWeight: 600,
      fontSize: {
        xs: '1.1rem',
        sm: '1.25rem',
        md: '1.5rem',
      },
      color: '#ffffff',
    },
    h5: {
      fontWeight: 600,
      fontSize: {
        xs: '1rem',
        sm: '1.1rem',
        md: '1.25rem',
      },
      color: '#ffffff',
    },
    h6: {
      fontWeight: 500,
      fontSize: {
        xs: '0.9rem',
        sm: '1rem',
        md: '1.1rem',
      },
      color: '#ffffff',
    },
    body1: {
      fontSize: {
        xs: '0.875rem',
        sm: '0.9rem',
        md: '1rem',
      },
      color: '#ffffff',
    },
    body2: {
      fontSize: {
        xs: '0.8rem',
        sm: '0.85rem',
        md: '0.875rem',
      },
      color: '#ffffff',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: {
            xs: '0.875rem',
            sm: '0.9rem',
            md: '1rem',
          },
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 12px rgba(0, 0, 0, 0.15)',
          },
        },
        containedPrimary: {
          backgroundColor: '#da2525',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#b82020',
          },
        },
        containedSecondary: {
          backgroundColor: '#ffffff',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#3a3939',
          },
        },
        outlined: {
          borderColor: '#da2525',
          color: '#da2525',
          '&:hover': {
            borderColor: '#b82020',
            backgroundColor: 'rgba(218, 37, 37, 0.04)',
            color: '#b82020',
          },
        },
        outlinedSecondary: {
          borderColor: '#da2525',
          color: '#da2525',
          '&:hover': {
            borderColor: '#991b1b',
            backgroundColor: 'rgba(220, 38, 38, 0.04)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #151414 0%, #1d1b1b 100%)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
          borderBottom: '2px solid #da2525',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(218, 37, 37, 0.2)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 12px rgba(0, 0, 0, 0.15)',
            borderColor: 'rgba(218, 37, 37, 0.4)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
        elevation2: {
          boxShadow: '0 8px 12px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: {
            xs: '0.8rem',
            sm: '0.85rem',
            md: '0.9rem',
          },
          padding: {
            xs: '8px 12px',
            sm: '12px 16px',
            md: '14px 20px',
          },
          borderBottom: '1px solid rgba(218, 37, 37, 0.2)',
        },
        head: {
          backgroundColor: '#151414',
          color: '#ffffff',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontSize: {
            xs: '0.75rem',
            sm: '0.8rem',
            md: '0.85rem',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            fontSize: {
              xs: '0.875rem',
              sm: '0.9rem',
              md: '1rem',
            },
            color: '#ffffff',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(218, 37, 37, 0.3)',
              borderRadius: 8,
            },
            '&:hover fieldset': {
              borderColor: '#da2525',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#da2525',
              borderWidth: 2,
            },
          },
          '& .MuiInputLabel-root': {
            color: '#ffffff',
            fontWeight: 500,
            '&.Mui-focused': {
              color: '#ffffff',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(212, 175, 55, 0.3)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#d4af37',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#d4af37',
            borderWidth: 2,
          },
          '& .MuiSelect-select': {
            color: '#ffffff',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 16,
        },
        colorPrimary: {
          backgroundColor: '#dc2626',
          color: '#ffffff',
        },
        colorSecondary: {
          backgroundColor: '#dc2626',
          color: '#ffffff',
        },
        colorSuccess: {
          backgroundColor: '#dc2626',
          color: '#ffffff',
        },
        colorError: {
          backgroundColor: '#dc2626',
          color: '#ffffff',
        },
        colorWarning: {
          backgroundColor: '#dc2626',
          color: '#ffffff',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          '& .MuiDialog-paper': {
            borderRadius: 16,
            border: '2px solid #da2525',
          },
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #151414 0%, #1d1b1b 100%)',
          color: '#ffffff',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        },
      },
    },
  },
});

function App() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  // Si el usuario está autenticado y está en la ruta raíz, redirigir a estudiantes
  if (location.pathname === '/login' && user) {
    return <Navigate to="/students" />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {user && location.pathname !== '/' && <Navigation />}
      {user && <SessionTimeout />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={user ? <Navigate to={user.role === 'empleado' ? "/dashboard" : "/students"} /> : <Login />} />
        <Route
          path="/students"
          element={
            user ? 
              (['admin', 'instructor', 'staff', 'empleado'].includes(user.role) ? 
                <Students /> : 
                <Navigate to="/dashboard" />
              ) : 
              <Navigate to="/login" />
          }
        />
        <Route
          path="/payments"
          element={
            user ? 
              (['admin', 'instructor', 'staff', 'empleado'].includes(user.role) ? 
                <Payments /> : 
                <Navigate to="/dashboard" />
              ) : 
              <Navigate to="/login" />
          }
        />
        <Route
          path="/products"
          element={
            user ? 
              (['admin', 'staff'].includes(user.role) ? 
                <Products /> : 
                <Navigate to="/dashboard" />
              ) : 
              <Navigate to="/login" />
          }
        />
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/sales" 
          element={
            user ? 
              (['admin', 'staff', 'empleado'].includes(user.role) ? 
                <Sales /> : 
                <Navigate to="/dashboard" />
              ) : 
              <Navigate to="/login" />
          } 
        />
        <Route 
          path="/notices" 
          element={
            user ? 
              (['admin', 'instructor', 'staff'].includes(user.role) ? 
                <Notices /> : 
                <Navigate to="/dashboard" />
              ) : 
              <Navigate to="/login" />
          } 
        />
        <Route 
          path="/test-notice" 
          element={
            user ? 
              (['admin'].includes(user.role) ? 
                <TestNotice /> : 
                <Navigate to="/dashboard" />
              ) : 
              <Navigate to="/login" />
          } 
        />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </ThemeProvider>
  );
}

export default App;
