import api from './api';

const WardrobeService = {
  getAllClothingItems: async (userId) => {
    return api.get(`/wardrobe?userId=${userId}`);
  },

  getClothingItemById: async (id) => {
    return api.get(`/wardrobe/${id}`);
  },

  getClothingItemsByCategory: async (userId, category) => {
    return api.get(`/wardrobe/category/${category}?userId=${userId}`);
  },

  getClothingItemsBySeason: async (userId, season) => {
    return api.get(`/wardrobe/season/${season}?userId=${userId}`);
  },

  getFavoriteClothingItems: async (userId) => {
    return api.get(`/wardrobe/favorites?userId=${userId}`);
  },

  createClothingItem: async (userId, formData) => {
    return api.post(`/wardrobe?userId=${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  updateClothingItem: async (id, formData) => {
    return api.put(`/wardrobe/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  toggleFavorite: async (id) => {
    return api.put(`/wardrobe/${id}/favorite`);
  },

  deleteClothingItem: async (id) => {
    return api.delete(`/wardrobe/${id}`);
  }
};

export default WardrobeService;