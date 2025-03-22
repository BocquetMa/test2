import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import BodyAnalysisService from '../services/bodyAnalysisService';
import { toast } from 'react-toastify';
import { FaUpload, FaUser } from 'react-icons/fa';

const BodyAnalysisPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [bodyType, setBodyType] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!photo) {
      toast.warning('Veuillez sélectionner une photo pour l\'analyse');
      return;
    }

    if (!currentUser || !currentUser.id) {
      toast.error('Utilisateur non authentifié. Veuillez vous reconnecter.');
      return;
    }

    console.log('Starting analysis with photo:', photo);
    console.log('User ID:', currentUser.id);
    
    setLoading(true);
    try {
      // Envoi de la photo au serveur
      const response = await BodyAnalysisService.analyzeBodyType(currentUser.id, photo);
      console.log('Analysis response:', response.data);
      setBodyType(response.data);
      
      // Récupérer les recommandations basées sur le type de corps
      const recsResponse = await BodyAnalysisService.getStyleRecommendations(response.data);
      console.log('Recommendations response:', recsResponse.data);
      setRecommendations(recsResponse.data);
      
      toast.success('Analyse réussie !');
    } catch (error) {
      console.error('Error during body analysis:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        toast.error(`Erreur d'analyse: ${error.response.data?.message || 'Veuillez réessayer.'}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        toast.error('Aucune réponse du serveur. Vérifiez votre connexion internet.');
      } else {
        toast.error('Erreur lors de l\'analyse. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10">
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">Analyse de Morphologie</h1>
        </div>
      </header>
      
      <main>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Téléchargez votre photo
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Prenez une photo de face, en position debout, pour une analyse plus précise de votre morphologie.
                  </p>
                  
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      {photoPreview ? (
                        <div className="relative">
                          <img
                            src={photoPreview}
                            alt="Aperçu"
                            className="mx-auto h-64 object-cover"
                          />
                          <button
                            onClick={() => {
                              setPhoto(null);
                              setPhotoPreview('');
                            }}
                            className="absolute top-0 right-0 mt-2 mr-2 bg-white rounded-full p-1 shadow-md"
                          >
                            <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                            >
                              <span>Télécharger une image</span>
                              <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handlePhotoChange} accept="image/*" />
                            </label>
                            <p className="pl-1">ou glisser-déposer</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 10MB</p>
                          <div className="flex justify-center mt-4">
                            <FaUser className="h-20 w-20 text-gray-300" />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={handleAnalyze}
                      disabled={!photo || loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Analyse en cours...' : 'Analyser ma morphologie'}
                    </button>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Résultats de l'analyse
                  </h2>
                  
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
                      <p>Analyse en cours...</p>
                    </div>
                  ) : bodyType ? (
                    <div>
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h3 className="text-md font-medium">Votre morphologie: <span className="text-primary-600">{bodyType}</span></h3>
                      </div>
                      
                      <h3 className="text-md font-medium mb-2">Recommandations de style:</h3>
                      
                      {recommendations.length > 0 ? (
                        <ul className="space-y-2">
                          {recommendations.map((rec, index) => (
                            <li key={index} className="bg-white p-3 rounded-md border border-gray-200">
                              {rec}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">Aucune recommandation disponible pour le moment.</p>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500">
                      <FaUser className="h-16 w-16 mb-4 text-gray-300" />
                      <p>Téléchargez une photo et lancez l'analyse pour obtenir des recommandations de style adaptées à votre morphologie.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BodyAnalysisPage;