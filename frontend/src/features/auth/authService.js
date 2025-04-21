import axios from 'axios';

// Usar rutas relativas para que funcione en cualquier dominio
const API_URL = '/api/users/';

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL, userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

// Login user
const login = async (userData) => {
  try {
    console.log('Attempting login with URL:', API_URL + 'login');
    const response = await axios.post(API_URL + 'login', userData);
    console.log('Login response:', response.data);

    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } else {
      throw new Error('No se recibió respuesta del servidor');
    }
  } catch (error) {
    console.error('Error en login:', error.response || error);
    throw error;
  }
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

const authService = {
  register,
  logout,
  login,
};

export default authService;
