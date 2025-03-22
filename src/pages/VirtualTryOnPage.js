import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import OutfitService from '../services/outfitService';
import VirtualTryOnService from '../services/virtualTryOnService';
import { toast } from 'react-toastify';
import { FaUpload, FaArrowLeft, FaSpinner, FaTshirt } from 'react-icons/fa';

const VirtualTryOnPage = () => {
  const { type, id } = useParams(); // type peut être 'outfit' ou 'item'
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  
  const [item, setItem] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [resultImage, setResultImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchItem();
  }, [id, type]);

  const fetchItem = async () => {
    setLoading(true);
    try {
      if (type === 'outfit') {
        const response = await OutfitService.getOutfitById(id);
        setItem(response.data);
      } else if (type === 'item') {
        // À implémenter si necessaire pour essayer un vêtement individuel
        // const response = await WardrobeService.getClothingItemById(id);
        // setItem(response.data);
        toast.warning('L\'essayage d\'un vêtement individuel n\'est pas encore disponible');
        navigate('/outfits');
      }
    } catch (error) {
      console.error('Error fetching item:', error);
      toast.error('Erreur lors du chargement des données');
      navigate('/outfits');
    } finally {
      setLoading(false);
    }
  };

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

  const handleTryOn = async () => {
    if (!photo) {
      toast.warning('Veuillez sélectionner une photo pour l\'essayage virtuel');
      return;
    }

    setProcessing(true);
    try {
      const response = await VirtualTryOnService.tryOnOutfit(id, photo);
      setResultImage(response.data.resultImagePath);
      toast.success('Essayage virtuel réussi !');
    } catch (error) {
      console.error('Error during virtual try-on:', error);
      toast.error('Erreur lors de l\'essayage virtuel. Veuillez réessayer.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="py-10">
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 text-gray-500 hover:text-gray-700"
            >
              <FaArrowLeft />
            </button>
            <h1 className="text-3xl font-bold leading-tight text-gray-900">Essayage Virtuel</h1>
          </div>
        </div>
      </header>
      
      <main>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Essayer virtuellement: {item?.name}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Téléchargez une photo de vous pour essayer cette tenue virtuellement
                </p>
              </div>
              
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">1. Télécharger votre photo</h4>
                    
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
                              <FaUpload className="h-20 w-20 text-gray-300" />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={handleTryOn}
                        disabled={!photo || processing}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processing ? (
                          <>
                            <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
                            Traitement en cours...
                          </>
                        ) : (
                          'Essayer la tenue'
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">2. Résultat</h4>
                    
                    <div className="mt-1 border-2 border-gray-300 rounded-md h-80 flex items-center justify-center">
                      {resultImage ? (
                        <img
                          src={`http://localhost:8080/uploads/${resultImage}`}
                          alt="Résultat essayage virtuel"
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <div className="text-center text-gray-500">
                          <FaTshirt className="mx-auto h-16 w-16 text-gray-300" />
                          <p className="mt-2">Le résultat de l'essayage apparaîtra ici</p>
                        </div>
                      )}
                    </div>
                    
                    {resultImage && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-500 mb-2">
                          Vous pouvez télécharger l'image du résultat ou la partager
                        </p>
                        <div className="flex space-x-2">
                            
                            <a   href={`http://localhost:8080/uploads/${resultImage}`}
                                download
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                Télécharger
                            </a>
                            <button
                                type="button"
                                onClick={() => {
                                // Fonction de partage à implémenter
                                toast.info('Fonctionnalité de partage en développement');
                                }}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                Partager
                            </button>
                            </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <div className="flex justify-between items-center">
                  <Link
                    to={`/outfits/${id}`}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <FaArrowLeft className="mr-2 -ml-1 h-5 w-5" />
                    Retour aux détails
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VirtualTryOnPage;