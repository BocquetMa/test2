import api from './api';

const OutfitService = {
  getAllOutfits: async (userId) => {
    return api.get(`/outfits?userId=${userId}`); // Suppression du /api
  },

  getOutfitById: async (id) => {
    return api.get(`/outfits/${id}`); // Suppression du /api
  },

  getOutfitsBySeason: async (userId, season) => {
    return api.get(`/outfits/season/${season}?userId=${userId}`); // Suppression du /api
  },

  getOutfitsByWeatherCondition: async (userId, condition) => {
    return api.get(`/outfits/weather/${condition}?userId=${userId}`); // Suppression du /api
  },

  getFavoriteOutfits: async (userId) => {
    return api.get(`/outfits/favorites?userId=${userId}`); // Suppression du /api
  },

  getRecommendation: async (userId, city) => {
    return api.get(`/outfits/recommend?userId=${userId}&city=${city}`); // Suppression du /api
  },

  createOutfit: async (userId, data) => {
    return api.post('/outfits', { // Suppression du /api
      userId,
      ...data
    });
  },

  updateOutfit: async (id, data) => {
    return api.put(`/outfits/${id}`, data); // Suppression du /api
  },

  toggleFavorite: async (id) => {
    return api.put(`/outfits/${id}/favorite`); // Suppression du /api
  },

  deleteOutfit: async (id) => {
    return api.delete(`/outfits/${id}`); // Suppression du /api
  }
};

export default OutfitService;
