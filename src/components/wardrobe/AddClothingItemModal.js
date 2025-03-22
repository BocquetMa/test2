import React, { useState } from 'react';
import { FaTimes, FaUpload } from 'react-icons/fa';

const AddClothingItemModal = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Top');
  const [color, setColor] = useState('');
  const [season, setSeason] = useState('All');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'Top', name: 'Haut' },
    { id: 'Bottom', name: 'Bas' },
    { id: 'Footwear', name: 'Chaussures' },
    { id: 'Outerwear', name: 'Veste/Manteau' },
    { id: 'Accessory', name: 'Accessoire' }
  ];

  const seasons = [
    { id: 'All', name: 'Toutes saisons' },
    { id: 'Spring', name: 'Printemps' },
    { id: 'Summer', name: 'Été' },
    { id: 'Fall', name: 'Automne' },
    { id: 'Winter', name: 'Hiver' }
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('category', category);
      formData.append('color', color);
      formData.append('season', season);
      if (image) {
        formData.append('image', image);
      }
      
      await onAdd(formData);
    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-lg max-w-md w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Ajouter un vêtement</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nom
              </label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Catégorie
              </label>
              <select
                id="category"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                Couleur
              </label>
              <input
                type="text"
                id="color"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="season" className="block text-sm font-medium text-gray-700">
                Saison
              </label>
              <select
                id="season"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                required
              >
                {seasons.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Image
              </label>
              <div className="mt-1 flex items-center">
                {imagePreview ? (
                  <div className="relative h-32 w-32 rounded-md overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Aperçu"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setImagePreview('');
                      }}
                      className="absolute top-0 right-0 p-1 bg-white rounded-full shadow-md"
                    >
                      <FaTimes className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer h-32 w-32 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-primary-500"
                  >
                    <FaUpload className="h-8 w-8 text-gray-400" />
                    <input
                      id="image-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {loading ? 'Ajout en cours...' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClothingItemModal;