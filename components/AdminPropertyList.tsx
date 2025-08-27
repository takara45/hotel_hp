import React from 'react';
import { Property } from '../types.ts';
import { PencilIcon, TrashIcon } from './icons/CoreIcons.tsx';

interface AdminPropertyListProps {
  properties: Property[];
  onEdit: (property: Property) => void;
  onDelete: (propertyId: string) => void;
}

const AdminPropertyList: React.FC<AdminPropertyListProps> = ({ properties, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* --- Desktop Table View (hidden on small screens) --- */}
      <div className="hidden md:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">施設名</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">タイプ</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">住所</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">価格</th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {properties.map((property) => (
              <tr key={property.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{property.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${property.type === 'ホテル' ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800'}`}>
                      {property.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{property.address}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{`￥${property.price.toLocaleString()}`}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => onEdit(property)} className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label={`${property.name}を編集`}>
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button onClick={() => onDelete(property.id)} className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-gray-100 transition-colors ml-2" aria-label={`${property.name}を削除`}>
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Mobile Card View (shown only on small screens) --- */}
      <div className="md:hidden">
        <div className="divide-y divide-gray-200">
          {properties.map((property) => (
            <div key={property.id} className="p-4">
              <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0 pr-4">
                      <p className="text-md font-bold text-gray-900 truncate">{property.name}</p>
                      <div className="mt-1 flex items-center text-sm text-gray-600">
                           <span className={`mr-3 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${property.type === 'ホテル' ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800'}`}>
                               {property.type}
                           </span>
                           <p className="font-semibold text-gray-800">{`￥${property.price.toLocaleString()}`}</p>
                      </div>
                      <p className="mt-1 text-xs text-gray-500 truncate">{property.address}</p>
                  </div>
                  <div className="flex-shrink-0 flex flex-col space-y-2">
                      <button 
                          onClick={() => onEdit(property)} 
                          className="flex items-center justify-center w-20 text-sm bg-indigo-600 text-white font-semibold py-2 px-2 rounded-md hover:bg-indigo-700 transition-colors shadow"
                      >
                          <PencilIcon className="h-4 w-4 mr-1" />
                          編集
                      </button>
                      <button 
                          onClick={() => onDelete(property.id)} 
                          className="flex items-center justify-center w-20 text-sm bg-red-600 text-white font-semibold py-2 px-2 rounded-md hover:bg-red-700 transition-colors shadow"
                      >
                          <TrashIcon className="h-4 w-4 mr-1" />
                          削除
                      </button>
                  </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPropertyList;
