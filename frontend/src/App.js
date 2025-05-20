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
      main: '#1976d2',
      dark: '#115293',
      light: '#4791db',
    },
    secondary: {
      main: '#dc004e',
      dark: '#b0003a',
      light: '#e33371',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          fontWeight: 500,
        },
        containedPrimary: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        containedSecondary: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
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
