import React, { useState, useEffect, useRef } from 'react';
import { Property, PropertyType, Amenity, PropertyTag } from '../types.ts';
import { TrashIcon, StarIcon, SparklesIcon } from './icons/CoreIcons.tsx';
import { generateDescription } from '../services/geminiService.ts';
import { TAG_DATA } from '../data/tags.ts';

interface PropertyFormProps {
  initialData: Property | null;
  onSubmit: (property: Property) => void;
  onCancel: () => void;
  mode?: 'admin' | 'owner';
}

const amenityOptions = Object.values(Amenity);
const tagOptions = Object.values(PropertyTag);

const PropertyForm: React.FC<PropertyFormProps> = ({ initialData, onSubmit, onCancel, mode = 'owner' }) => {
  const [property, setProperty] = useState({
    name: '',
    type: PropertyType.Hotel,
    description: '',
    address: '',
    price: 10000,
    phoneNumber: '',
    lineOfficialUrl: '',
    checkinTime: '15:00',
    checkoutTime: '10:00',
    ownerUsername: '',
    ownerPassword: '',
    latitude: 0,
    longitude: 0,
  });
  
  const [selectedAmenities, setSelectedAmenities] = useState<Set<Amenity>>(new Set());
  const [selectedTags, setSelectedTags] = useState<Set<PropertyTag>>(new Set());
  const [photos, setPhotos] = useState<string[]>([]);
  const [aiKeywords, setAiKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if (initialData) {
      setProperty({
        name: initialData.name,
        type: initialData.type,
        description: initialData.description,
        address: initialData.address,
        price: initialData.price,
        phoneNumber: initialData.phoneNumber,
        lineOfficialUrl: initialData.lineOfficialUrl || '',
        checkinTime: initialData.checkinTime,
        checkoutTime: initialData.checkoutTime,
        ownerUsername: initialData.ownerUsername,
        ownerPassword: initialData.ownerPassword,
        latitude: initialData.latitude || 0,
        longitude: initialData.longitude || 0,
      });
      setSelectedAmenities(new Set(initialData.amenities));
      setSelectedTags(new Set(initialData.tags || []));
      setPhotos(initialData.photos || []);
    } else {
        // Reset form for creating a new property
        setProperty({
            name: '',
            type: PropertyType.Hotel,
            description: '',
            address: '',
            price: 10000,
            phoneNumber: '',
            lineOfficialUrl: '',
            checkinTime: '15:00',
            checkoutTime: '10:00',
            ownerUsername: '',
            ownerPassword: '',
            latitude: 0,
            longitude: 0,
        });
        setSelectedAmenities(new Set());
        setSelectedTags(new Set());
        setPhotos([]);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    setProperty(prev => ({ ...prev, [name]: isNumber ? parseFloat(value) : value }));
  };

  const handleAmenityChange = (amenity: Amenity) => {
    const newAmenities = new Set(selectedAmenities);
    if (newAmenities.has(amenity)) {
      newAmenities.delete(amenity);
    } else {
      newAmenities.add(amenity);
    }
    setSelectedAmenities(newAmenities);
  };

  const handleTagChange = (tag: PropertyTag) => {
    const newTags = new Set(selectedTags);
    if (newTags.has(tag)) {
        newTags.delete(tag);
    } else {
        newTags.add(tag);
    }
    setSelectedTags(newTags);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            if (!file.type.startsWith('image/')) {
                return; // Skip non-image files
            }
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                if (loadEvent.target?.result) {
                    setPhotos(prevPhotos => [...prevPhotos, loadEvent.target.result as string]);
                }
            };
            reader.readAsDataURL(file);
        });
    }
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setPhotos(prevPhotos => prevPhotos.filter((_, index) => index !== indexToRemove));
  };
  
  const handleGenerateDescription = async () => {
    setIsGenerating(true);
    try {
        const generatedText = await generateDescription(property.name, property.type, aiKeywords);
        setProperty(prev => ({ ...prev, description: generatedText.trim() }));
    } catch (error) {
        alert(error instanceof Error ? error.message : '説明の生成に失敗しました。');
    } finally {
        setIsGenerating(false);
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalProperty: Property = {
      ...initialData,
      id: initialData ? initialData.id : `prop-${Date.now()}`,
      reviews: initialData ? initialData.reviews : [],
      announcements: initialData ? initialData.announcements : [],
      viewCount: initialData ? initialData.viewCount : 0,
      rating: initialData ? initialData.rating : 0, // Rating is now managed automatically
      ...property,
      amenities: Array.from(selectedAmenities),
      tags: Array.from(selectedTags),
      photos: photos.length > 0 ? photos : ['https://picsum.photos/seed/default/800/600'],
    };
    onSubmit(finalProperty);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">{initialData ? '施設情報の編集' : '新規施設の追加'}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">施設名</label>
            <input type="text" name="name" id="name" value={property.name} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">タイプ</label>
            <select name="type" id="type" value={property.type} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
              <option value={PropertyType.Hotel}>ホテル</option>
              <option value={PropertyType.Minpaku}>民泊</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="aiKeywords" className="block text-sm font-medium text-gray-700">AI説明生成用のキーワード</label>
          <div className="flex items-center gap-2 mt-1">
            <input 
              type="text" 
              name="aiKeywords" 
              id="aiKeywords" 
              value={aiKeywords}
              onChange={(e) => setAiKeywords(e.target.value)}
              placeholder="例: オーシャンビュー, 静か, 家族向け" 
              className="flex-grow block w-full border-gray-300 rounded-md shadow-sm"
            />
            <button
              type="button"
              onClick={handleGenerateDescription}
              disabled={isGenerating || !aiKeywords.trim()}
              className="flex-shrink-0 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <SparklesIcon className="w-5 h-5 mr-2 -ml-1" />
              {isGenerating ? '生成中...' : 'AIで生成'}
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">説明</label>
          <textarea name="description" id="description" value={property.description} onChange={handleChange} rows={5} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"></textarea>
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">住所</label>
          <input type="text" name="address" id="address" value={property.address} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">緯度</label>
                <input type="number" name="latitude" id="latitude" value={property.latitude} onChange={handleChange} step="any" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
            </div>
            <div>
                <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">経度</label>
                <input type="number" name="longitude" id="longitude" value={property.longitude} onChange={handleChange} step="any" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">価格（円）</label>
              <input type="number" name="price" id="price" value={property.price} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">評価 (自動計算)</label>
                <div className="mt-1 px-3 py-2 flex items-center w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm">
                    <StarIcon className="h-5 w-5 text-yellow-400 mr-2" />
                    <span className="text-gray-800 font-bold">{initialData ? initialData.rating.toFixed(1) : 'N/A'}</span>
                    <span className="text-sm text-gray-500 ml-2"> (レビュー平均)</span>
                </div>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">電話番号</label>
              <input type="tel" name="phoneNumber" id="phoneNumber" value={property.phoneNumber} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
            </div>
            <div>
              <label htmlFor="lineOfficialUrl" className="block text-sm font-medium text-gray-700">LINE公式アカウントURL (任意)</label>
              <input type="url" name="lineOfficialUrl" id="lineOfficialUrl" value={property.lineOfficialUrl} onChange={handleChange} placeholder="https://line.me/R/ti/p/..." className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
            </div>
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label htmlFor="checkinTime" className="block text-sm font-medium text-gray-700">チェックイン</label>
                 <input type="text" name="checkinTime" id="checkinTime" value={property.checkinTime} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
               </div>
               <div>
                 <label htmlFor="checkoutTime" className="block text-sm font-medium text-gray-700">チェックアウト</label>
                 <input type="text" name="checkoutTime" id="checkoutTime" value={property.checkoutTime} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
               </div>
           </div>
        </div>
        
        {mode === 'admin' && (
            <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900">掲載者情報</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label htmlFor="ownerUsername" className="block text-sm font-medium text-gray-700">掲載者 ユーザー名</label>
                      <input type="text" name="ownerUsername" id="ownerUsername" value={property.ownerUsername} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
                    </div>
                    <div>
                      <label htmlFor="ownerPassword" className="block text-sm font-medium text-gray-700">掲載者 パスワード</label>
                      <input type="text" name="ownerPassword" id="ownerPassword" value={property.ownerPassword} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
                    </div>
                </div>
            </div>
        )}

        <div>
            <label className="block text-sm font-medium text-gray-700">写真</label>
            <div className="mt-2 flex items-center">
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    ファイルを選択
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>
            {photos.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {photos.map((photo, index) => (
                        <div key={index} className="relative group aspect-w-1 aspect-h-1">
                            <img src={photo} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                            <div className="absolute top-0 right-0">
                                <button
                                    type="button"
                                    onClick={() => handleRemovePhoto(index)}
                                    className="m-1 bg-red-600 text-white rounded-full p-1 opacity-50 group-hover:opacity-100 transition-opacity"
                                    aria-label="Remove photo"
                                >
                                    <TrashIcon className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">こだわりタグ</label>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
              {tagOptions.map(tag => (
                  <label key={tag} className="flex items-center space-x-2">
                      <input
                          type="checkbox"
                          checked={selectedTags.has(tag)}
                          onChange={() => handleTagChange(tag)}
                          className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                      <span className="text-gray-700 text-sm">{TAG_DATA[tag].label}</span>
                  </label>
              ))}
          </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">アメニティ</label>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                {amenityOptions.map(amenity => (
                    <label key={amenity} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={selectedAmenities.has(amenity)}
                            onChange={() => handleAmenityChange(amenity)}
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                        <span className="text-gray-700 text-sm">{amenity}</span>
                    </label>
                ))}
            </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300">
            キャンセル
          </button>
          <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700">
            保存
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;