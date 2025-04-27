import axios from 'axios';

const API_URL = '/api/notices/';

// Get all notices (public)
const getNotices = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Get all notices (admin)
const getAllNotices = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + '?all=true', config);
  return response.data;
};

// Create new notice
const createNotice = async (noticeData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, noticeData, config);
  return response.data;
};

// Update notice
const updateNotice = async (noticeId, noticeData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(API_URL + noticeId, noticeData, config);
  return response.data;
};

// Delete notice
const deleteNotice = async (noticeId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(API_URL + noticeId, config);
  return response.data;
};

// Toggle notice status
const toggleNoticeStatus = async (noticeId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(API_URL + noticeId + '/toggle', {}, config);
  return response.data;
};

const noticeService = {
  getNotices,
  getAllNotices,
  createNotice,
  updateNotice,
  deleteNotice,
  toggleNoticeStatus,
};

export default noticeService;
