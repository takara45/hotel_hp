import React, { useState } from 'react';
import { Property, Announcement } from '../types.ts';
import PropertyForm from './PropertyForm.tsx';
import AnnouncementForm from './AnnouncementForm.tsx';
import { EyeIcon, PencilSquareIcon, ChartBarIcon, BellIcon, TrashIcon, PencilIcon } from './icons/CoreIcons.tsx';

interface OwnerDashboardProps {
  property: Property;
  onSave: (property: Property) => void;
  onLogout: () => void;
  onAddAnnouncement: (propertyId: string, data: Omit<Announcement, 'id' | 'createdAt'>) => void;
  onUpdateAnnouncement: (propertyId: string, announcement: Announcement) => void;
  onDeleteAnnouncement: (propertyId: string, announcementId: string) => void;
}

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ property, onSave, onLogout, onAddAnnouncement, onUpdateAnnouncement, onDeleteAnnouncement }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'edit' | 'announcements'>('analytics');
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [isCreatingAnnouncement, setIsCreatingAnnouncement] = useState(false);

  const handleSaveProperty = (updatedProperty: Property) => {
    onSave(updatedProperty);
    // Optionally switch back to analytics tab after saving
    setActiveTab('analytics'); 
  };
  
  const handleCreateAnnouncementClick = () => {
    setEditingAnnouncement(null);
    setIsCreatingAnnouncement(true);
  };
  
  const handleEditAnnouncementClick = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setIsCreatingAnnouncement(false);
  };
  
  const handleCancelAnnouncement = () => {
    setEditingAnnouncement(null);
    setIsCreatingAnnouncement(false);
  };
  
  const handleAnnouncementSubmit = (data: Omit<Announcement, 'id' | 'createdAt'>) => {
    if (editingAnnouncement) {
      onUpdateAnnouncement(property.id, { ...data, id: editingAnnouncement.id, createdAt: editingAnnouncement.createdAt });
    } else {
      onAddAnnouncement(property.id, data);
    }
    handleCancelAnnouncement();
  };
  
  const handleDeleteAnnouncementClick = (announcementId: string) => {
    onDeleteAnnouncement(property.id, announcementId);
  };
  
  const TabButton = ({
    tabName,
    label,
    Icon,
  }: {
    tabName: 'analytics' | 'edit' | 'announcements';
    label: string;
    Icon: React.FC<{ className?: string }>;
  }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
        activeTab === tabName
          ? 'border-indigo-500 text-indigo-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">掲載者ダッシュボード</h1>
            <p className="text-sm text-gray-600">{property.name}</p>
          </div>
          <button
            onClick={onLogout}
            className="text-sm bg-red-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
          >
            ログアウト
          </button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                <TabButton tabName="analytics" label="アクセス解析" Icon={ChartBarIcon} />
                <TabButton tabName="edit" label="施設情報編集" Icon={PencilSquareIcon} />
                <TabButton tabName="announcements" label="お知らせ管理" Icon={BellIcon} />
            </nav>
        </div>

        <div className="animate-fade-in">
            {activeTab === 'analytics' && (
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">アクセス解析</h2>
                    <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-lg">
                        <div className="flex items-center">
                            <EyeIcon className="h-8 w-8 text-indigo-600 mr-4" />
                            <div>
                                <p className="text-sm text-gray-600">あなたの施設の詳細ページ閲覧数</p>
                                <p className="text-4xl font-bold text-indigo-800">{property.viewCount.toLocaleString()}回</p>
                            </div>
                        </div>
                    </div>
                     <p className="text-sm text-gray-500 mt-4">
                        この数値は、利用者があなたの施設の詳細ページを開いた合計回数です。
                    </p>
                </div>
            )}
            
            {activeTab === 'edit' && (
                <PropertyForm 
                    initialData={property}
                    onSubmit={handleSaveProperty}
                    onCancel={() => setActiveTab('analytics')}
                    mode="owner"
                />
            )}

            {activeTab === 'announcements' && (
                <div>
                  {isCreatingAnnouncement || editingAnnouncement ? (
                    <AnnouncementForm
                      initialData={editingAnnouncement}
                      onSubmit={handleAnnouncementSubmit}
                      onCancel={handleCancelAnnouncement}
                    />
                  ) : (
                    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">お知らせ管理</h2>
                        <button onClick={handleCreateAnnouncementClick} className="bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600 transition-colors">
                          + 新規作成
                        </button>
                      </div>
                      <div className="space-y-4">
                        {(property.announcements && property.announcements.length > 0) ? (
                          property.announcements.map(ann => (
                            <div key={ann.id} className="border p-4 rounded-lg flex justify-between items-start gap-4">
                              <div>
                                <p className="font-semibold text-gray-900">{ann.title}</p>
                                <p className="text-sm text-gray-500 mt-1">{new Date(ann.createdAt).toLocaleDateString('ja-JP')} 更新</p>
                                <p className="mt-2 text-gray-700 whitespace-pre-wrap text-sm">{ann.content}</p>
                              </div>
                              <div className="flex space-x-1 flex-shrink-0">
                                <button onClick={() => handleEditAnnouncementClick(ann)} className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100 transition-colors">
                                  <PencilIcon className="h-5 w-5" />
                                </button>
                                <button onClick={() => handleDeleteAnnouncementClick(ann.id)} className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100 transition-colors">
                                  <TrashIcon className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-gray-500 py-8">お知らせはまだありません。「新規作成」ボタンから追加できます。</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
        </div>
      </main>
    </div>
  );
};

export default OwnerDashboard;