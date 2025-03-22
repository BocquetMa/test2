import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import WardrobeService from '../services/wardrobeService';
import OutfitService from '../services/outfitService';
import { toast } from 'react-toastify';
import { FaTshirt, FaPlus, FaTimes } from 'react-icons/fa';

const CreateOutfitPage = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [season, setSeason] = useState('All');
  const [weatherConditions, setWeatherConditions] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  const seasons = [
    { id: 'All', name: 'Toutes saisons' },
    { id: 'Spring', name: 'Printemps' },
    { id: 'Summer', name: 'Été' },
    { id: 'Fall', name: 'Automne' },
    { id: 'Winter', name: 'Hiver' }
  ];

  const categories = [
    { id: 'all', name: 'Tous' },
    { id: 'Top', name: 'Hauts' },
    { id: 'Bottom', name: 'Bas' },
    { id: 'Footwear', name: 'Chaussures' },
    { id: 'Outerwear', name: 'Vestes' },
    { id: 'Accessory', name: 'Accessoires' }
  ];

  useEffect(() => {
    if (currentUser) {
      fetchClothingItems();
    }
  }, [currentUser]);

  const fetchClothingItems = async () => {
    setLoading(true);
    try {
      const response = await WardrobeService.getAllClothingItems(currentUser.id);
      setAvailableItems(response.data);
    } catch (error) {
      console.error('Error fetching clothing items:', error);
      toast.error('Erreur lors du chargement de votre garde-robe');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const getFilteredItems = () => {
    if (activeCategory === 'all') {
      return availableItems.filter(item => !selectedItems.some(selected => selected.id === item.id));
    } else {
      return availableItems.filter(
        item => item.category === activeCategory && !selectedItems.some(selected => selected.id === item.id)
      );
    }
  };

  const handleAddItem = (item) => {
    setSelectedItems([...selectedItems, item]);
  };

  const handleRemoveItem = (itemId) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedItems.length < 2) {
      toast.warning('Veuillez sélectionner au moins 2 vêtements pour créer une tenue');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const itemIds = selectedItems.map(item => item.id);
      
      await OutfitService.createOutfit(
        currentUser.id,
        {
          name,
          clothingItemIds: itemIds,
          season,
          weatherConditions
        }
      );
      
      toast.success('Tenue créée avec succès !');
      navigate('/outfits');
    } catch (error) {
      console.error('Error creating outfit:', error);
      toast.error('Erreur lors de la création de la tenue');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-10">
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">Créer une nouvelle tenue</h1>
        </div>
      </header>
      
      <main>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit}>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Nom de la tenue
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="season" className="block text-sm font-medium text-gray-700">
                        Saison
                      </label>
                      <select
                        id="season"
                        name="season"
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={season}
                        onChange={(e) => setSeason(e.target.value)}
                      >
                        {seasons.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="weatherConditions" className="block text-sm font-medium text-gray-700">
                        Conditions météo
                      </label>
                      <input
                        type="text"
                        name="weatherConditions"
                        id="weatherConditions"
                        placeholder="Ex: Ensoleillé, Pluvieux, etc."
                        className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value={weatherConditions}
                        onChange={(e) => setWeatherConditions(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Vêtements sélectionnés ({selectedItems.length})
                </h3>
              </div>
              
              <div className="px-4 py-5 sm:p-6">
                {selectedItems.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    <FaTshirt className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-2">Aucun vêtement sélectionné</p>
                    <p className="text-sm">Sélectionnez des vêtements ci-dessous pour créer votre tenue</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {selectedItems.map(item => (
                      <div key={item.id} className="relative bg-gray-50 p-2 rounded-md">
                        <button
                          type="button"
                          className="absolute top-1 right-1 text-gray-400 hover:text-red-500"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <FaTimes />
                        </button>
                        <div className="flex flex-col items-center pt-4">
                          <div className="h-20 w-20 flex items-center justify-center mb-2">
                            {item.localImagePath ? (
                              <img
                                src={`http://localhost:8080/uploads/${item.localImagePath}`}
                                alt={item.name}
                                className="max-h-full max-w-full object-contain"
                              />
                            ) : (
                              <FaTshirt className="h-10 w-10 text-gray-400" />
                            )}
                          </div>
                          <p className="text-sm font-medium text-center">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Sélectionner des vêtements
                </h3>
                
                <div className="mt-4 border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        className={`
                          whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                          ${activeCategory === category.id
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                        `}
                        onClick={() => handleCategoryChange(category.id)}
                      >
                        {category.name}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
              
              <div className="px-4 py-5 sm:p-6">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                  </div>
                ) : getFilteredItems().length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    <p>Aucun vêtement disponible dans cette catégorie</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {getFilteredItems().map(item => (
                      <div
                        key={item.id}
                        className="bg-white border border-gray-200 rounded-md p-2 cursor-pointer hover:border-primary-500 hover:shadow-sm"
                        onClick={() => handleAddItem(item)}
                      >
                        <div className="flex flex-col items-center">
                          <div className="h-20 w-20 flex items-center justify-center mb-2">
                            {item.localImagePath ? (
                              <img
                                src={`http://localhost:8080/uploads/${item.localImagePath}`}
                                alt={item.name}
                                className="max-h-full max-w-full object-contain"
                              />
                            ) : (
                              <FaTshirt className="h-10 w-10 text-gray-400" />
                            )}
                          </div>
                          <p className="text-sm font-medium text-center">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.category}</p>
                          <button
                            type="button"
                            className="mt-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          >
                            <FaPlus className="mr-1" /> Ajouter
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={() => navigate('/outfits')}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={submitting || selectedItems.length < 2}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Création en cours...' : 'Créer la tenue'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateOutfitPage;