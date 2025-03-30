import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import WardrobeService from '../services/wardrobeService';
import { toast } from 'react-toastify';
import ClothingItemCard from '../components/wardrobe/ClothingItemCard';
import AddClothingItemModal from '../components/wardrobe/AddClothingItemModal';
import { useNavigate } from 'react-router-dom'; // Import for navigation

const WardrobePage = () => {
  const { currentUser, isAuthenticated } = useContext(AuthContext);
  const [clothingItems, setClothingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const navigate = useNavigate(); // For redirection if needed
  
  const categories = [
    { id: 'all', name: 'Tous' },
    { id: 'Top', name: 'Hauts' },
    { id: 'Bottom', name: 'Bas' },
    { id: 'Footwear', name: 'Chaussures' },
    { id: 'Outerwear', name: 'Vestes' },
    { id: 'Accessory', name: 'Accessoires' }
  ];

  // Check authentication first
  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      toast.error('Veuillez vous connecter pour accéder à votre garde-robe');
      navigate('/login'); // Redirect to login page
      return;
    }
  }, [isAuthenticated, currentUser, navigate]);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      fetchClothingItems();
    }
  }, [activeCategory, isAuthenticated, currentUser]);

  const fetchClothingItems = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      // Log the token before making the request
      console.log("Current token:", localStorage.getItem('token'));
      
      let response;
      
      if (activeCategory === 'all') {
        response = await WardrobeService.getAllClothingItems(currentUser.id);
      } else {
        response = await WardrobeService.getClothingItemsByCategory(currentUser.id, activeCategory);
      }
      
      setClothingItems(response.data);
    } catch (error) {
      console.error('Error fetching clothing items:', error);
      
      // More detailed error handling
      if (error.response) {
        switch (error.response.status) {
          case 401:
            toast.error('Session expirée. Veuillez vous reconnecter.');
            navigate('/login');
            break;
          case 403:
            toast.error('Vous n\'avez pas l\'autorisation d\'accéder à cette ressource');
            break;
          default:
            toast.error('Erreur lors du chargement de votre garde-robe');
        }
      } else {
        toast.error('Impossible de contacter le serveur');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleAddItem = async (newItem) => {
    try {
      await WardrobeService.createClothingItem(currentUser.id, newItem);
      toast.success('Vêtement ajouté avec succès !');
      fetchClothingItems();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding clothing item:', error);
      
      if (error.response && error.response.status === 403) {
        toast.error('Vous n\'avez pas l\'autorisation d\'ajouter des vêtements');
      } else {
        toast.error('Erreur lors de l\'ajout du vêtement');
      }
    }
  };

  // Rest of your component remains the same...
  const handleDeleteItem = async (id) => {
    try {
      await WardrobeService.deleteClothingItem(id);
      toast.success('Vêtement supprimé avec succès !');
      setClothingItems(clothingItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting clothing item:', error);
      
      if (error.response && error.response.status === 403) {
        toast.error('Vous n\'avez pas l\'autorisation de supprimer ce vêtement');
      } else {
        toast.error('Erreur lors de la suppression du vêtement');
      }
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      await WardrobeService.toggleFavorite(id);
      setClothingItems(clothingItems.map(item => 
        item.id === id ? { ...item, favorite: !item.favorite } : item
      ));
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Erreur lors de la modification du favori');
    }
  };

  // If not authenticated, don't render the component
  if (!isAuthenticated || !currentUser) {
    return null;
  }

  return (
    <div className="py-10">
      {/* Rest of your component JSX remains the same */}
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">Ma Garde-robe</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Ajouter un vêtement
          </button>
        </div>
      </header>
      
      <main>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Catégories */}
          <div className="px-4 sm:px-0 py-4">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {categories.map((category) => (
                  <button
                    key={category.id}
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

          {/* Contenu principal */}
          <div className="px-4 py-6 sm:px-0">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              </div>
            ) : clothingItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Aucun vêtement trouvé dans cette catégorie.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {clothingItems.map((item) => (
                  <ClothingItemCard
                    key={item.id}
                    item={item}
                    onDelete={() => handleDeleteItem(item.id)}
                    onToggleFavorite={() => handleToggleFavorite(item.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal d'ajout de vêtement */}
      {showAddModal && (
        <AddClothingItemModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddItem}
        />
      )}
    </div>
  );
};

export default WardrobePage;