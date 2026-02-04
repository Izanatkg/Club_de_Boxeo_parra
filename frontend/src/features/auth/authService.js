import api from '../../utils/axiosConfig';

// Register user
const register = async (userData) => {
  const response = await api.post('/users', userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

// Login user
const login = async (userData) => {
  try {
    console.log('Attempting login');
    const response = await api.post('/users/login', userData);
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
