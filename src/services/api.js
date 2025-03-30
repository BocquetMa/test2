import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Ajustez selon votre environnement
  headers: {
    'Content-Type': 'application/json'
  }
});

const token = localStorage.getItem('token'); // Assure-toi que le token est bien stocké quelque part après la connexion

if (token) {
  api.defaults.headers['Authorization'] = `Bearer ${token}`;
}

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.response && error.response.status === 401) {
      console.error('Authentication error detected');
    }
    
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.response && error.response.status === 401) {
      console.error('Authentication error detected');
    }
    
    return Promise.reject(error);
  }
);

export default api;