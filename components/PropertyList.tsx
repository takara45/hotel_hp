import React from 'react';
import { Property } from '../types.ts';
import PropertyCard from './PropertyCard.tsx';

interface PropertyListProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
}

const PropertyList: React.FC<PropertyListProps> = ({ properties, onSelectProperty }) => {
  if (properties.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-800">検索条件に一致する宿が見つかりませんでした。</h3>
        <p className="text-gray-500 mt-2">条件を変更して再度お試しください。</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {properties.map(property => (
        <PropertyCard key={property.id} property={property} onSelect={onSelectProperty} />
      ))}
    </div>
  );
};

export default PropertyList;