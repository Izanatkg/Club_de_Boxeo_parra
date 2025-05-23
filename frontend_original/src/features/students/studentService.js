import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' ? 'https://gestion-club-de-boxeo-parra.onrender.com/api/students/' : '/api/students/';

// Get all students
const getStudents = async (token, filters = {}) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: filters,
  };

  try {
    console.log('Fetching students with URL:', API_URL);
    console.log('Using config:', config);
    
    const response = await axios.get(API_URL, config);
    console.log('Students response:', response.data);
    
    if (!response.data) {
      console.warn('No data received from students API');
      return [];
    }
    
    if (!Array.isArray(response.data)) {
      console.warn('Students data is not an array:', response.data);
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching students:', error.response || error);
    throw error;
  }
};

// Create new student
const createStudent = async (studentData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, studentData, config);
  return response.data;
};

// Update student
const updateStudent = async (studentId, studentData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(API_URL + studentId, studentData, config);
  return response.data;
};

// Delete student
const deleteStudent = async (studentId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + studentId, config);
  return response.data;
};

const studentService = {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
};

export default studentService;
