import api from '../../utils/axiosConfig';

// Get all students
const getStudents = async (filters = {}) => {
  try {
    console.log('Fetching students with filters:', filters);
    
    const response = await api.get('/students', { params: filters });
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
const createStudent = async (studentData) => {
  const response = await api.post('/students', studentData);
  return response.data;
};

// Update student
const updateStudent = async (studentId, studentData) => {
  const response = await api.put(`/students/${studentId}`, studentData);
  return response.data;
};

// Delete student
const deleteStudent = async (studentId) => {
  const response = await api.delete(`/students/${studentId}`);
  return response.data;
};

const studentService = {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
};

export default studentService;
