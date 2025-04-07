import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' ? 'https://gestion-club-de-boxeo-parra.onrender.com/api/payments/' : '/api/payments/';

// Get all payments
const getPayments = async (token, filters = {}) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: filters,
  };

  try {
    console.log('Fetching payments with URL:', API_URL);
    console.log('Using config:', config);
    
    const response = await axios.get(API_URL, config);
    console.log('Payments response:', response.data);
    
    if (!response.data) {
      console.warn('No data received from payments API');
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching payments:', error.response || error);
    throw error;
  }
};

// Create new payment
const createPayment = async (paymentData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, paymentData, config);
  return response.data;
};

// Update payment
const updatePayment = async (paymentId, paymentData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(API_URL + paymentId, paymentData, config);
  return response.data;
};

// Delete payment
const deletePayment = async (paymentId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + paymentId, config);
  return response.data;
};

const paymentService = {
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
};

export default paymentService;
