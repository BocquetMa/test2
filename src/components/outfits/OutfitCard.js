import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaTrash, FaEdit } from 'react-icons/fa';

const OutfitCard = ({ outfit, onDelete, onToggleFavorite, onEdit }) => {
  const { id, name, season, weatherConditions, favorite, items = [] } = outfit;
  
  // Choisir la première image d'un vêtement de la tenue comme aperçu
  const previewImage = items && items.length > 0 && items[0].localImagePath 
    ? `http://localhost:8080/uploads/${items[0].localImagePath}` 
    : null;

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {previewImage ? (
          <img
            src={previewImage}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          </div>
        )}
        <button
          onClick={onToggleFavorite}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-100"
        >
          {favorite ? (
            <FaHeart className="h-5 w-5 text-red-500" />
          ) : (
            <FaRegHeart className="h-5 w-5 text-gray-500" />
          )}
        </button>
      </div>
      <div className="px-4 py-4">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <div className="mt-2 flex items-center text-sm text-gray-500 space-x-2">
          <span className="inline-block px-2 py-1 bg-gray-100 rounded-md">{season}</span>
          {weatherConditions && (
            <span className="inline-block px-2 py-1 bg-gray-100 rounded-md">{weatherConditions}</span>
          )}
        </div>
        <div className="mt-4 flex justify-between items-center">
          <Link
            to={`/outfits/${id}`}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Voir détails
          </Link>
          <div className="flex space-x-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-2 rounded-md text-gray-500 hover:text-primary-600 hover:bg-gray-100"
              >
                <FaEdit className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={onDelete}
              className="p-2 rounded-md text-gray-500 hover:text-red-600 hover:bg-gray-100"
            >
              <FaTrash className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutfitCard;