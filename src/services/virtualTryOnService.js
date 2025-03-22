import api from './api';

const VirtualTryOnService = {
  tryOnClothingItem: async (itemId, photo) => {
    const formData = new FormData();
    formData.append('photo', photo);

    return api.post(`/virtual-try-on/item/${itemId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  tryOnOutfit: async (outfitId, photo) => {
    const formData = new FormData();
    formData.append('photo', photo);

    return api.post(`/virtual-try-on/outfit/${outfitId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
};

export default VirtualTryOnService;