import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // Ajustez selon votre environnement
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.response && error.response.status === 401) {
      // Commentez temporairement cette partie pour déboguer sans être redirigé
      // localStorage.removeItem('user');
      // window.location.href = '/login';
      console.error('Authentication error detected but redirection disabled for debugging');
    
    }
    
    return Promise.reject(error);
  }
);

export default api;