import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000, // 10 second timeout
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['Content-Type'] = 'application/json';
  return config;
});

// Add error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - Server is not responding');
    }

    if (!error.response) {
      throw new Error('Network error - Unable to reach the server');
    }

    switch (error.response.status) {
      case 401:
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('Session expired - Please login again');
      case 404:
        throw new Error('Resource not found');
      case 500:
        throw new Error('Internal server error - Please try again later');
      default:
        throw error;
    }
  }
);

export const auth = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  signup: (name, email, password) => api.post('/auth/signup', { name, email, password }),
  getProfile: () => api.get('/users/profile'),
  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
};

export const rooms = {
  getAll: () => api.get('/rooms')
};

export const reservations = {
  getAll: () => api.get('/users/reservations'),
  create: (data) => api.post('/users/reservations', data),
  update: (id, data) => api.put(`/users/reservations/${id}`, data),
  delete: (id) => api.delete(`/users/reservations/${id}`)
};

export const feedback = {
  getUserFeedback: (userId) => api.get(`/users/feedbacks/user/${userId}`),
  create: (data) => api.post('/users/feedbacks', data)
};

export default api;
