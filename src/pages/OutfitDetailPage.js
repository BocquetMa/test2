import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import OutfitService from '../services/outfitService';
import { toast } from 'react-toastify';
import { FaTshirt, FaHeart, FaRegHeart, FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';

const OutfitDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [outfit, setOutfit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOutfit();
  }, [id]);

  const fetchOutfit = async () => {
    setLoading(true);
    try {
      const response = await OutfitService.getOutfitById(id);
      setOutfit(response.data);
    } catch (error) {
      console.error('Error fetching outfit:', error);
      toast.error('Erreur lors du chargement de la tenue');
      navigate('/outfits');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tenue ?')) {
      try {
        await OutfitService.deleteOutfit(id);
        toast.success('Tenue supprimée avec succès !');
        navigate('/outfits');
      } catch (error) {
        console.error('Error deleting outfit:', error);
        toast.error('Erreur lors de la suppression de la tenue');
      }
    }
  };

  const handleToggleFavorite = async () => {
    try {
      await OutfitService.toggleFavorite(id);
      setOutfit({
        ...outfit,
        favorite: !outfit.favorite
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Erreur lors de la modification du favori');
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Top':
        return <span className="text-blue-500">👕</span>;
      case 'Bottom':
        return <span className="text-indigo-500">👖</span>;
      case 'Footwear':
        return <span className="text-red-500">👞</span>;
      case 'Outerwear':
        return <span className="text-green-500">🧥</span>;
      case 'Accessory':
        return <span className="text-yellow-500">👔</span>;
      default:
        return <span className="text-gray-500">👚</span>;
    }
  };

  return (
    <div className="py-10">
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/outfits')}
              className="mr-4 text-gray-500 hover:text-gray-700"
            >
              <FaArrowLeft />
            </button>
            <h1 className="text-3xl font-bold leading-tight text-gray-900">Détails de la tenue</h1>
          </div>
        </div>
      </header>
      
      <main>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : outfit ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {outfit.name}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    {outfit.season} • {outfit.weatherConditions}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleToggleFavorite}
                    className="p-2 rounded-md text-gray-400 hover:text-red-500"
                  >
                    {outfit.favorite ? (
                      <FaHeart className="h-6 w-6 text-red-500" />
                    ) : (
                      <FaRegHeart className="h-6 w-6" />
                    )}
                  </button>
                  <Link
                    to={`/outfits/edit/${outfit.id}`}
                    className="p-2 rounded-md text-gray-400 hover:text-primary-500"
                  >
                    <FaEdit className="h-6 w-6" />
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="p-2 rounded-md text-gray-400 hover:text-red-500"
                  >
                    <FaTrash className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Vêtements inclus</h3>
                
                {outfit.items && outfit.items.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {outfit.items.map(item => (
                      <div key={item.id} className="bg-gray-50 rounded-md overflow-hidden shadow-sm">
                        <div className="h-48 bg-white flex items-center justify-center p-4 border-b border-gray-200">
                          {item.localImagePath ? (
                            <img
                              src={`http://localhost:8080/uploads/${item.localImagePath}`}
                              alt={item.name}
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <FaTshirt className="h-16 w-16 text-gray-300" />
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-center">
                            {getCategoryIcon(item.category)}
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {item.category}
                            </span>
                          </div>
                          <h4 className="mt-2 text-lg font-medium text-gray-900">{item.name}</h4>
                          <p className="mt-1 text-sm text-gray-500">
                            {item.color} • {item.season}
                          </p>
                          <Link
                            to={`/wardrobe/${item.id}`}
                            className="mt-3 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          >
                            Voir détails
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <FaTshirt className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-2">Aucun vêtement dans cette tenue</p>
                  </div>
                )}
              </div>
              
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <div className="flex justify-between items-center">
                  <Link
                    to="/outfits"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <FaArrowLeft className="mr-2 -ml-1 h-5 w-5" />
                    Retour aux tenues
                  </Link>
                  
                  <Link
                    to={`/virtual-try-on/outfit/${outfit.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Essayer virtuellement
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Tenue non trouvée</h3>
              <p className="mt-1 text-sm text-gray-500">
                Cette tenue n'existe pas ou a été supprimée.
              </p>
              <div className="mt-6">
                <Link
                  to="/outfits"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Retour à la liste des tenues
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OutfitDetailPage;