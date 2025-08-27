

import React, { useState } from 'react';
import { Property } from '../types.ts';
import AdminPropertyList from './AdminPropertyList.tsx';
import PropertyForm from './PropertyForm.tsx';

interface AdminPanelProps {
  properties: Property[];
  onSave: (property: Property) => void;
  onDelete: (propertyId: string) => void;
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ properties, onSave, onDelete, onLogout }) => {
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setIsCreatingNew(false);
  };
  
  const handleCreateNew = () => {
    setEditingProperty(null);
    setIsCreatingNew(true);
  };

  const handleCancel = () => {
    setEditingProperty(null);
    setIsCreatingNew(false);
  };
  
  const handleSave = (property: Property) => {
    onSave(property);
    setEditingProperty(null);
    setIsCreatingNew(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">施設管理</h1>
          <button
            onClick={onLogout}
            className="text-sm bg-red-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
          >
            ログアウト
          </button>
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isCreatingNew || editingProperty ? (
          <PropertyForm
            initialData={editingProperty}
            onSubmit={handleSave}
            onCancel={handleCancel}
            mode="admin"
          />
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={handleCreateNew}
                className="bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
              >
                + 新規施設を追加
              </button>
            </div>
            <AdminPropertyList
              properties={properties}
              onEdit={handleEdit}
              onDelete={onDelete}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;