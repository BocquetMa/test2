import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import OutfitService from '../services/outfitService';
import { toast } from 'react-toastify';
import OutfitCard from '../components/outfits/OutfitCard';
import { FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const OutfitsPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', name: 'Toutes' },
    { id: 'favorite', name: 'Favoris' },
    { id: 'season', name: 'Par saison' },
    { id: 'weather', name: 'Par météo' }
  ];

  useEffect(() => {
    fetchOutfits();
  }, []);

  const fetchOutfits = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      let response;
      
      if (activeFilter === 'all') {
        response = await OutfitService.getAllOutfits(currentUser.id);
      } else if (activeFilter === 'favorite') {
        response = await OutfitService.getFavoriteOutfits(currentUser.id);
      } else {
        // Par défaut, chargez toutes les tenues si le filtre n'est pas encore implémenté
        response = await OutfitService.getAllOutfits(currentUser.id);
      }
      
      setOutfits(response.data);
    } catch (error) {
      console.error('Error fetching outfits:', error);
      toast.error('Erreur lors du chargement des tenues');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  useEffect(() => {
    fetchOutfits();
  }, [activeFilter]);

  const handleDeleteOutfit = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tenue ?')) {
      try {
        await OutfitService.deleteOutfit(id);
        toast.success('Tenue supprimée avec succès !');
        setOutfits(outfits.filter(outfit => outfit.id !== id));
      } catch (error) {
        console.error('Error deleting outfit:', error);
        toast.error('Erreur lors de la suppression de la tenue');
      }
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      await OutfitService.toggleFavorite(id);
      setOutfits(outfits.map(outfit => 
        outfit.id === id ? { ...outfit, favorite: !outfit.favorite } : outfit
      ));
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Erreur lors de la modification du favori');
    }
  };

  return (
    <div className="py-10">
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">Mes Tenues</h1>
          <Link
            to="/outfits/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FaPlus className="mr-2" /> Créer une tenue
          </Link>
        </div>
      </header>
      
      <main>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Filtres */}
          <div className="px-4 sm:px-0 py-4">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    className={`
                      whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                      ${activeFilter === filter.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                    `}
                    onClick={() => handleFilterChange(filter.id)}
                  >
                    {filter.name}
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
            ) : outfits.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune tenue trouvée</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Commencez par créer votre première tenue.
                </p>
                <div className="mt-6">
                  <Link
                    to="/outfits/create"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <FaPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Nouvelle tenue
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {outfits.map((outfit) => (
                  <OutfitCard
                    key={outfit.id}
                    outfit={outfit}
                    onDelete={() => handleDeleteOutfit(outfit.id)}
                    onToggleFavorite={() => handleToggleFavorite(outfit.id)}
                    onEdit={() => {}} // Implémentation à venir
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OutfitsPage;