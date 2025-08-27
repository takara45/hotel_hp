

import React, { useState, useEffect } from 'react';
import { Property, Amenity, Review, PropertyTag } from '../types.ts';
import { StarIcon, MapPinIcon, ClockIcon, PhoneIcon, ChevronLeftIcon, ChevronRightIcon, ArrowLeftIcon, PencilIcon, TrashIcon, BellIcon, LineIcon } from './icons/CoreIcons.tsx';
import { WifiIcon, ParkingIcon, NoSmokingIcon, BathIcon } from './icons/AmenityIcons.tsx';
import ReviewForm from './ReviewForm.tsx';
import { TAG_DATA } from '../data/tags.ts';

const AMENITY_MAP: Record<Amenity, { label: string; IconComponent: React.ComponentType<{}> }> = {
  [Amenity.Wifi]: { label: '無料Wi-Fi', IconComponent: WifiIcon },
  [Amenity.Parking]: { label: '駐車場', IconComponent: ParkingIcon },
  [Amenity.NoSmoking]: { label: '禁煙', IconComponent: NoSmokingIcon },
  [Amenity.SeparateBathToilet]: { label: 'バス・トイレ別', IconComponent: BathIcon },
};

interface PropertyDetailProps {
  property: Property;
  onBack: () => void;
  onAddReview: (propertyId: string, review: Omit<Review, 'id'>) => void;
  onUpdateReview: (propertyId: string, review: Review) => void;
  onDeleteReview: (propertyId: string, reviewId: string) => void;
  myReviewIds: string[];
}

const PropertyDetail: React.FC<PropertyDetailProps> = ({ property, onBack, onAddReview, onUpdateReview, onDeleteReview, myReviewIds }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const nextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % property.photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + property.photos.length) % property.photos.length);
  };
  
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<StarIcon key={i} className={`h-5 w-5 ${i <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`} />);
    }
    return stars;
  };

  const handleAddNewReviewClick = () => {
    setEditingReview(null);
    setShowReviewForm(true);
  };

  const handleEditReviewClick = (review: Review) => {
      setEditingReview(review);
      setShowReviewForm(true);
  };

  const handleDeleteReviewClick = (reviewId: string) => {
      onDeleteReview(property.id, reviewId);
  };

  const handleReviewFormSubmit = (reviewData: Omit<Review, 'id'> | Review) => {
      if ('id' in reviewData) {
          onUpdateReview(property.id, reviewData);
      } else {
          onAddReview(property.id, reviewData);
      }
      setShowReviewForm(false);
      setEditingReview(null);
  };

  const handleReviewFormCancel = () => {
      setShowReviewForm(false);
      setEditingReview(null);
  };


  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden animate-fade-in">
      <div className="p-4">
        <button
          onClick={onBack}
          className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          検索結果に戻る
        </button>
      </div>

      {/* Photo Gallery */}
      <div className="relative">
        <img src={property.photos[currentPhotoIndex]} alt={property.name} className="w-full h-64 md:h-96 object-cover" />
        {property.photos.length > 1 && (
          <>
            <button onClick={prevPhoto} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition">
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <button onClick={nextPhoto} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition">
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${property.type === 'ホテル' ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800'}`}>{property.type}</span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">{property.name}</h1>
            <div className="flex items-center mt-2 text-gray-600">
              <MapPinIcon className="h-5 w-5 mr-2" />
              <span>{property.address}</span>
            </div>
            <div className="flex items-center mt-2">
              <div className="flex">{renderStars(property.rating)}</div>
              <span className="ml-2 text-gray-700 font-bold">{property.rating.toFixed(1)}</span>
              <span className="ml-1 text-gray-500">({property.reviews.length}件のレビュー)</span>
            </div>
            
            {property.tags && property.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {property.tags.map(tag => (
                        <span key={tag} className="bg-teal-100 text-teal-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                            {TAG_DATA[tag as PropertyTag]?.label || tag}
                        </span>
                    ))}
                </div>
            )}

            <p className="mt-6 text-gray-700 leading-relaxed whitespace-pre-wrap">{property.description}</p>
            
            {property.announcements && property.announcements.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4 flex items-center">
                        <BellIcon className="h-6 w-6 mr-3 text-indigo-600" />
                        施設からのお知らせ
                    </h3>
                    <div className="space-y-4">
                        {property.announcements.map(ann => (
                            <div key={ann.id} className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg">
                                <p className="font-semibold text-indigo-800">{ann.title}</p>
                                <p className="text-sm text-gray-500 mt-1">{new Date(ann.createdAt).toLocaleDateString('ja-JP')} 更新</p>
                                <p className="mt-2 text-gray-700 whitespace-pre-wrap">{ann.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">アメニティ・設備</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {property.amenities.map(amenityKey => {
                        const amenityDetails = AMENITY_MAP[amenityKey as Amenity];
                        if (!amenityDetails) return null;
                        const { IconComponent, label } = amenityDetails;
                        return (
                            <div key={amenityKey} className="flex items-center text-gray-700">
                                <IconComponent />
                                <span className="ml-2">{label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            <div className="mt-8">
                <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <h3 className="text-xl font-bold text-gray-800">レビュー</h3>
                    {!showReviewForm && (
                        <button onClick={handleAddNewReviewClick} className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors text-sm">
                        レビューを追加
                        </button>
                    )}
                </div>
                {showReviewForm && (
                    <div className="my-4">
                        <ReviewForm
                            onSubmit={handleReviewFormSubmit}
                            onCancel={handleReviewFormCancel}
                            initialData={editingReview}
                        />
                    </div>
                )}
                <div className="space-y-6">
                    {property.reviews.length > 0 ? (
                        property.reviews.map((review) => {
                            const isMyReview = myReviewIds.includes(review.id);
                            return (
                                <div key={review.id} className="border-l-4 border-indigo-200 pl-4 py-2 relative group">
                                    <div className="flex items-center">
                                        {renderStars(review.rating)}
                                        <span className="ml-3 font-semibold">{review.author}さん</span>
                                    </div>
                                    <p className="mt-2 text-gray-600">{review.comment}</p>
                                    {isMyReview && (
                                        <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEditReviewClick(review)} className="p-1 text-gray-500 hover:text-indigo-600" aria-label="レビューを編集">
                                                <PencilIcon className="h-5 w-5" />
                                            </button>
                                            <button onClick={() => handleDeleteReviewClick(review.id)} className="p-1 text-gray-500 hover:text-red-600" aria-label="レビューを削除">
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-gray-500">まだレビューはありません。最初のレビューを投稿しませんか？</p>
                    )}
                </div>
            </div>

          </div>

          {/* Booking Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-gray-50 rounded-lg shadow-lg p-6 border border-indigo-200">
              <p className="text-2xl font-bold text-indigo-600 text-center">{`￥${property.price.toLocaleString()}`}<span className="text-base font-normal text-gray-600"> / 泊</span></p>
              
              <div className="mt-6 space-y-3 text-sm text-gray-700">
                <div className="flex justify-between">
                    <span className="font-semibold flex items-center"><ClockIcon className="h-4 w-4 mr-1.5" />チェックイン</span>
                    <span>{property.checkinTime}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold flex items-center"><ClockIcon className="h-4 w-4 mr-1.5" />チェックアウト</span>
                    <span>{property.checkoutTime}</span>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="font-bold text-lg">ご予約・お問い合わせ</p>
                <p className="text-sm text-gray-600 mb-4">直接施設にご連絡ください。</p>
                
                {property.lineOfficialUrl && (
                    <a 
                        href={property.lineOfficialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-block bg-[#06C755] text-white font-bold py-4 px-4 rounded-lg hover:bg-[#05a546] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#06C755] transition-all duration-200 text-lg tracking-wider"
                    >
                        <div className="flex items-center justify-center">
                            <LineIcon className="h-6 w-6 mr-3" />
                            <span>LINEで問い合わせる</span>
                        </div>
                    </a>
                )}

                <a 
                    href={`tel:${property.phoneNumber}`}
                    className="mt-3 w-full inline-block bg-green-500 text-white font-bold py-4 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 text-lg tracking-wider"
                >
                    <div className="flex items-center justify-center">
                        <PhoneIcon className="h-6 w-6 mr-3" />
                        <span>{property.phoneNumber}</span>
                    </div>
                </a>
                <p className="text-xs text-gray-500 mt-4">「ラストミニッツ・コールを見た」とお伝えいただくとスムーズです。</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;