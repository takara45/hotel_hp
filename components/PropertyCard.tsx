import React from 'react';
import { Property, PropertyType } from '../types.ts';
import { StarIcon, MapPinIcon } from './icons/CoreIcons.tsx';

interface PropertyCardProps {
  property: Property & { distance?: number };
  onSelect: (property: Property) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onSelect }) => {
  const typeColor = property.type === PropertyType.Hotel ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800';

  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col group"
      onClick={() => onSelect(property)}
    >
      <div className="relative">
        <img className="w-full h-48 object-cover" src={property.photos[0]} alt={property.name} />
        <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full ${typeColor}`}>
          {property.type}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800 truncate group-hover:text-indigo-600 transition-colors">{property.name}</h3>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="truncate">{property.address}</span>
        </div>

        {property.distance !== undefined && (
            <div className="mt-1 text-sm font-medium text-indigo-700">
                現在地から約 {property.distance.toFixed(1)} km
            </div>
        )}
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <StarIcon className="h-5 w-5 text-yellow-400" />
            <span className="text-gray-700 font-bold ml-1">{property.rating.toFixed(1)}</span>
            <span className="text-gray-500 text-sm ml-1">({property.reviews.length}件)</span>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-indigo-600">{`￥${property.price.toLocaleString()}`}</p>
            <p className="text-xs text-gray-500">1泊1名あたり</p>
          </div>
        </div>
        <button 
          className="mt-4 w-full bg-indigo-500 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
        >
          詳細を見て電話で予約
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;