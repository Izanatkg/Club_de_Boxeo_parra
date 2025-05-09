import axios from 'axios';

const API_URL = '/api/users/';

// Get all users
const getUsers = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  console.log('Obteniendo usuarios con token:', token ? 'Sí' : 'No');
  const response = await axios.get(API_URL + 'all', config);
  return response.data;
};

const userService = {
  getUsers,
};

export default userService;
