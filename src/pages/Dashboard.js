import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import WeatherService from '../services/weatherService';
import OutfitService from '../services/outfitService';
import { toast } from 'react-toastify';
import { FaTshirt, FaSun, FaCloudRain, FaSnowflake, FaCloud } from 'react-icons/fa';

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [weather, setWeather] = useState(null);
  const [recommendedOutfit, setRecommendedOutfit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('Paris'); // Ville par défaut

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser, city]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Récupérer les données météo
      const weatherResponse = await WeatherService.getCurrentWeather(city);
      setWeather(weatherResponse.data);
      
      // Récupérer une recommandation de tenue basée sur la météo
      if (currentUser.id) {
        try {
          const outfitResponse = await OutfitService.getRecommendation(currentUser.id, city);
          setRecommendedOutfit(outfitResponse.data);
        } catch (error) {
          console.error('Error fetching outfit recommendation:', error);
          // Ne pas afficher d'erreur ici, car l'utilisateur peut ne pas avoir de tenue recommandée
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition) => {
    if (!condition) return <FaCloud />;
    
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('sun') || conditionLower.includes('clear')) {
      return <FaSun className="text-yellow-500" />;
    } else if (conditionLower.includes('rain')) {
      return <FaCloudRain className="text-blue-500" />;
    } else if (conditionLower.includes('snow')) {
      return <FaSnowflake className="text-blue-300" />;
    } else {
      return <FaCloud className="text-gray-400" />;
    }
  };

  return (
    <div className="py-10">
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">Dashboard</h1>
        </div>
      </header>
      
      <main>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Widget météo */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Météo actuelle
                      </h3>
                      <div className="mt-2 flex items-center">
                        <div className="mr-4 text-4xl">
                          {weather && getWeatherIcon(weather.condition)}
                        </div>
                        <div>
                          <p className="text-3xl font-bold">
                            {weather ? `${Math.round(weather.temperature)}°C` : 'N/A'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {weather ? weather.condition : 'Données indisponibles'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {weather ? `${city}` : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          type="text"
                          className="focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="Changer de ville"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tenue recommandée */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Tenue recommandée pour aujourd'hui
                  </h3>
                  
                  {recommendedOutfit ? (
                    <div className="mt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xl font-semibold">{recommendedOutfit.name}</p>
                          <p className="text-sm text-gray-500">
                            Adapté pour: {weather?.condition || 'aujourd\'hui'}
                          </p>
                        </div>
                        <Link
                          to={`/outfits/${recommendedOutfit.id}`}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
                        >
                          Voir la tenue
                        </Link>
                      </div>
                      
                      {recommendedOutfit.items && recommendedOutfit.items.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                          {recommendedOutfit.items.map((item) => (
                            <div key={item.id} className="bg-gray-50 rounded-md p-3 flex flex-col items-center">
                              <div className="h-20 w-20 flex items-center justify-center">
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
                              <p className="mt-2 text-sm font-medium text-center">{item.name}</p>
                              <p className="text-xs text-gray-500">{item.category}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mt-4 flex flex-col items-center justify-center py-6 text-gray-500">
                      <FaTshirt className="h-12 w-12 mb-3 text-gray-300" />
                      <p>Aucune tenue recommandée disponible</p>
                      <p className="text-sm mt-1">Ajoutez des vêtements à votre garde-robe pour obtenir des recommandations</p>
                      <Link
                        to="/wardrobe"
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                      >
                        Ajouter des vêtements
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Actions rapides */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Actions rapides
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Link
                      to="/wardrobe"
                      className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                    >
                      <div className="flex-shrink-0">
                        <FaTshirt className="h-6 w-6 text-primary-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="absolute inset-0" aria-hidden="true" />
                        <p className="text-sm font-medium text-gray-900">
                          Gérer ma garde-robe
                        </p>
                        <p className="text-sm text-gray-500">
                          Ajouter ou modifier mes vêtements
                        </p>
                      </div>
                    </Link>
                    
                    <Link
                      to="/outfits"
                      className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                    >
                      <div className="flex-shrink-0">
                        <FaTshirt className="h-6 w-6 text-secondary-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="absolute inset-0" aria-hidden="true" />
                        <p className="text-sm font-medium text-gray-900">
                          Mes tenues
                        </p>
                        <p className="text-sm text-gray-500">
                          Voir et créer des tenues
                        </p>
                      </div>
                    </Link>
                    
                    <Link
                      to="/body-analysis"
                      className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                    >
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="absolute inset-0" aria-hidden="true" />
                        <p className="text-sm font-medium text-gray-900">
                          Analyse de morphologie
                        </p>
                        <p className="text-sm text-gray-500">
                          Obtenir des conseils personnalisés
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
       </div>
      </main>
    </div>
  );
};

export default Dashboard;