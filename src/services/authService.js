import api from './api';

const AuthService = {
  login: async (username, password) => {
    try {
      console.log("Attempting login for:", username);
      const response = await api.post('/api/auth/signin', { username, password });
      
      console.log("Server response:", response.data);
      
      // Vérification des données utilisateur
      if (response.data && response.data.id) {
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
      } else {
        console.error('Incomplete user data received:', response.data);
        throw new Error('Données utilisateur incomplètes');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  register: async (username, email, password) => {
    return api.post('/api/auth/signup', { username, email, password });
  },

  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;
      
      const user = JSON.parse(userStr);
      return user;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
};

export default AuthService;