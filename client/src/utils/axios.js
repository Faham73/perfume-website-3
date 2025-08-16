import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle timeouts
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
      // Optionally retry the request
    }
    
    // Handle unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // Handle network errors
    if (error.message === 'Network Error') {
      console.error('Network connection problem');
      // Show user notification
    }
    
    // Handle insufficient resources
    if (error.code === 'ERR_INSUFFICIENT_RESOURCES') {
      console.error('System resources low');
      // Suggest refreshing the page
    }
    
    return Promise.reject(error);
  }
);

export default api;