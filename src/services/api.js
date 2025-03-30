import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include the token on every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      // Handle specific error status codes
      switch (error.response.status) {
        case 401:
          console.error('Authentication error detected. User not authenticated.');
          // Optionally redirect to login or clear invalid tokens
          // localStorage.removeItem('token');
          // window.location.href = '/login';
          break;
        case 403:
          console.error('Authorization error detected. User lacks permission.');
          break;
        case 404:
          console.error('Resource not found.');
          break;
        default:
          console.error(`Request failed with status code ${error.response.status}`);
      }
    } else if (error.request) {
      console.error('No response received from server');
    } else {
      console.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;