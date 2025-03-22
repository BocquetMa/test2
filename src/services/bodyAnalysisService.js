import api from './api';

const BodyAnalysisService = {
  analyzeBodyType: async (userId, photoFile) => {
    // Création d'un objet FormData pour envoyer le fichier
    const formData = new FormData();
    formData.append('photo', photoFile);
    formData.append('userId', userId);
    
    // Configuration spéciale pour les requêtes multipart/form-data
    return api.post('/api/body-analysis/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  getStyleRecommendations: async (bodyType) => {
    return api.get(`/api/body-analysis/recommendations/${bodyType}`);
  }
};

export default BodyAnalysisService;