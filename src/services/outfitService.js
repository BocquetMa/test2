import api from './api';

const OutfitService = {
  getAllOutfits: async (userId) => {
    return api.get(`/outfits?userId=${userId}`);
  },

  getOutfitById: async (id) => {
    return api.get(`/outfits/${id}`);
  },

  getOutfitsBySeason: async (userId, season) => {
    return api.get(`/outfits/season/${season}?userId=${userId}`);
  },

  getOutfitsByWeatherCondition: async (userId, condition) => {
    return api.get(`/outfits/weather/${condition}?userId=${userId}`);
  },

  getFavoriteOutfits: async (userId) => {
    return api.get(`/outfits/favorites?userId=${userId}`);
  },

  getRecommendation: async (userId, city) => {
    return api.get(`/outfits/recommend?userId=${userId}&city=${city}`);
  },

  createOutfit: async (userId, data) => {
    return api.post('/outfits', {
      userId,
      ...data
    });
  },

  updateOutfit: async (id, data) => {
    return api.put(`/outfits/${id}`, data);
  },

  toggleFavorite: async (id) => {
    return api.put(`/outfits/${id}/favorite`);
  },

  deleteOutfit: async (id) => {
    return api.delete(`/outfits/${id}`);
  }
};

export default OutfitService;