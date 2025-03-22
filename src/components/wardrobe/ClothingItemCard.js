import React from 'react';
import { FaHeart, FaRegHeart, FaTrash, FaEdit } from 'react-icons/fa';

const ClothingItemCard = ({ item, onDelete, onToggleFavorite, onEdit }) => {
  const { id, name, category, color, season, localImagePath, favorite } = item;
  
  // URL du backend pour les images
  const imageUrl = localImagePath 
    ? `http://localhost:8080/uploads/${localImagePath}` 
    : 'https://via.placeholder.com/150?text=No+Image';

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
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
          <span className="inline-block px-2 py-1 bg-gray-100 rounded-md">{category}</span>
          <span className="inline-block px-2 py-1 bg-gray-100 rounded-md">{color}</span>
          <span className="inline-block px-2 py-1 bg-gray-100 rounded-md">{season}</span>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
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
  );
};

export default ClothingItemCard;