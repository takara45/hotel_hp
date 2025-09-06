import React, { useState, useEffect, useCallback } from 'react';
import { Property, SearchCriteria, Review, Announcement, PropertyTag } from './types.ts';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import SearchForm from './components/SearchForm.tsx';
import PropertyList from './components/PropertyList.tsx';
import PropertyDetail from './components/PropertyDetail.tsx';
import { LoadingSpinner } from './components/LoadingSpinner.tsx';
import AdminPanel from './components/AdminPanel.tsx';
import Login from './components/Login.tsx';
import OwnerLogin from './components/OwnerLogin.tsx';
import OwnerDashboard from './components/OwnerDashboard.tsx';
import SearchByTag from './components/SearchByTag.tsx';
import PropertyCard from './components/PropertyCard.tsx';
import * as api from './services/apiService.ts';
import { regions } from './data/prefectures.ts';
import { TAG_DATA } from './data/tags.ts';
import { ArrowLeftIcon } from './components/icons/CoreIcons.tsx';

type View = 'user' | 'login' | 'admin' | 'ownerLogin' | 'ownerDashboard';
type PageView = 'home' | 'searchResults';

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

const NewArrivals: React.FC<{ properties: Property[], onSelectProperty: (property: Property) => void }> = ({ properties, onSelectProperty }) => {
    const newProperties = properties.slice(0, 8);

    // Render a static list if there are too few items for a meaningful scroll
    if (newProperties.length < 2) {
        return (
            <div className="py-12 animate-fade-in">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-stone-800">新着のホテル・民泊</h2>
                    <div className="mt-2 w-24 h-1 bg-stone-300 mx-auto"></div>
                </div>
                <div className="flex justify-center space-x-6 md:space-x-8 pb-4 -mx-4 px-4">
                    {newProperties.length > 0 ? newProperties.map(property => (
                        <div key={property.id} className="flex-shrink-0 w-80">
                            <PropertyCard property={property} onSelect={onSelectProperty} />
                        </div>
                    )) : (
                        <p className="text-center text-gray-500 w-full">新着施設はまだありません。</p>
                    )}
                </div>
            </div>
        );
    }
    
    // For a smoother animation, we duplicate the items
    const itemsForScroll = [...newProperties, ...newProperties];
    // Adjust animation duration based on number of items
    const animationDuration = `${newProperties.length * 5}s`;

    return (
        <div className="py-12 animate-fade-in">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-stone-800">新着のホテル・民泊</h2>
                <div className="mt-2 w-24 h-1 bg-stone-300 mx-auto"></div>
            </div>
            <div className="w-full overflow-hidden group">
                <div 
                    className="flex scrolling-wrapper"
                    style={{ animation: `scroll ${animationDuration} linear infinite` }}
                >
                    {itemsForScroll.map((property, index) => (
                        // Using padding to create space between items
                        <div key={`${property.id}-${index}`} className="flex-shrink-0 w-80 px-3 md:px-4">
                            <PropertyCard property={property} onSelect={onSelectProperty} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


const App: React.FC = () => {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria | null>(null);
  const [view, setView] = useState<View>('user');
  const [pageView, setPageView] = useState<PageView>('home');
  const [loggedInOwnerProperty, setLoggedInOwnerProperty] = useState<Property | null>(null);
  const [myReviewIds, setMyReviewIds] = useState<string[]>([]);

  // Load properties from API service on initial mount
  useEffect(() => {
    const loadInitialData = async () => {
        setIsLoading(true);
        try {
            const [initialProperties, initialMyReviewIds] = await Promise.all([
                api.getProperties(),
                api.getMyReviewIds()
            ]);
            setAllProperties(initialProperties);
            // Initially, no search results are shown, so this is not strictly necessary
            // setFilteredProperties(initialProperties); 
            setMyReviewIds(initialMyReviewIds);
        } catch (err) {
            setError('データの読み込みに失敗しました。');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    loadInitialData();
  }, []);

  // SEO: Dynamically update meta tags and structured data
  useEffect(() => {
      const defaultTitle = 'ラストミニッツ・コール | 直前の宿探し';
      const defaultDescription = '明日・明後日の宿泊に特化した直前予約サイト。ホテルや民泊のお得なプランを見つけて、電話一本ですぐに予約！';

      const updateMetaTag = (selector: string, content: string) => {
          const element = document.querySelector(selector);
          if (element) {
              element.setAttribute('content', content);
          }
      };
      
      const updateJsonLd = (property: Property | null) => {
          const existingScript = document.getElementById('json-ld-script');
          if (existingScript) {
              existingScript.remove();
          }
          if (!property) return;

          const jsonLd = {
              '@context': 'https://schema.org',
              '@type': property.type === 'ホテル' ? 'Hotel' : 'LodgingBusiness',
              name: property.name,
              description: property.description.substring(0, 5000), // Max length for description
              telephone: property.phoneNumber,
              address: {
                  '@type': 'PostalAddress',
                  addressCountry: 'JP',
                  streetAddress: property.address,
              },
              geo: {
                  '@type': 'GeoCoordinates',
                  latitude: property.latitude,
                  longitude: property.longitude,
              },
              image: property.photos[0],
              aggregateRating: property.reviews.length > 0 ? {
                  '@type': 'AggregateRating',
                  ratingValue: property.rating.toFixed(1),
                  reviewCount: property.reviews.length,
              } : undefined,
          };

          const script = document.createElement('script');
          script.id = 'json-ld-script';
          script.type = 'application/ld+json';
          script.innerHTML = JSON.stringify(jsonLd);
          document.head.appendChild(script);
      };

      if (selectedProperty) {
          const title = `【${selectedProperty.name}】の予約・口コミ | ラストミニッツ・コール`;
          const description = selectedProperty.description.substring(0, 120) + '...';
          document.title = title;
          updateMetaTag('meta[name="description"]', description);
          updateMetaTag('meta[property="og:title"]', title);
          updateMetaTag('meta[property="og:description"]', description);
          updateMetaTag('meta[property="og:image"]', selectedProperty.photos[0] || '');
          updateJsonLd(selectedProperty);
      } else {
          document.title = defaultTitle;
          updateMetaTag('meta[name="description"]', defaultDescription);
          updateMetaTag('meta[property="og:title"]', defaultTitle);
          updateMetaTag('meta[property="og:description"]', defaultDescription);
          updateMetaTag('meta[property="og:image"]', 'https://picsum.photos/seed/og-image/1200/630');
          updateJsonLd(null);
      }
  }, [selectedProperty]);

  const handleSearch = useCallback((criteria: SearchCriteria) => {
    setSearchCriteria(criteria);

    let filtered: Property[] = [];

    if (criteria.location) {
        const { latitude, longitude } = criteria.location;
        filtered = allProperties
            .map(p => ({
                ...p,
                distance: getDistance(latitude, longitude, p.latitude, p.longitude),
            }))
            .sort((a, b) => a.distance - b.distance);
    } else {
        filtered = allProperties.filter(p => {
            if (criteria.region) {
                const regionData = regions.find(r => r.name === criteria.region);
                if (regionData) {
                    return regionData.prefectures.some(pref => p.address.includes(pref));
                }
                return false;
            }
            if (criteria.area) {
                return p.address.includes(criteria.area) || p.name.includes(criteria.area);
            }
            if (criteria.tag) {
                return p.tags?.includes(criteria.tag);
            }
            return true;
        });
    }

    setFilteredProperties(filtered);
    setPageView('searchResults');
  }, [allProperties]);

  const handleSelectProperty = async (property: Property) => {
    const updatedPropertyData = { ...property, viewCount: (property.viewCount || 0) + 1 };
    try {
      const savedProperty = await api.saveProperty(updatedPropertyData);
      const updatedAllProperties = allProperties.map(p => p.id === property.id ? savedProperty : p);
      setAllProperties(updatedAllProperties);
      setFilteredProperties(current => current.map(p => p.id === property.id ? savedProperty : p));
      setSelectedProperty(savedProperty);
    } catch (err) {
      console.error("Failed to update view count, selecting property anyway.", err);
      setSelectedProperty(property);
    }
  };

  const handleBackToList = () => {
    setSelectedProperty(null);
  };
  
  const handleBackToSearch = () => {
    setSearchCriteria(null);
    setPageView('home');
  };

  const handleNavigate = (targetView: View) => {
      setSelectedProperty(null);
      setSearchCriteria(null);
      setLoggedInOwnerProperty(null);
      setView(targetView);
      setPageView('home');
  }

  const handleLoginSuccess = () => {
    setView('admin');
  };

  const handleLogout = () => {
    setView('user');
  };

  const handleOwnerLoginSuccess = (property: Property) => {
      setLoggedInOwnerProperty(property);
      setView('ownerDashboard');
  };

  const handleOwnerLogout = () => {
      setLoggedInOwnerProperty(null);
      setView('user');
  };

  const updateAppState = (newProperties: Property[], propertyId: string) => {
    setAllProperties(newProperties);
    
    const updatedProperty = newProperties.find(p => p.id === propertyId) || null;

    if (selectedProperty && selectedProperty.id === propertyId) {
      setSelectedProperty(updatedProperty);
    }
    
    if (loggedInOwnerProperty && loggedInOwnerProperty.id === propertyId) {
      setLoggedInOwnerProperty(updatedProperty);
    }
    
    if (searchCriteria) {
        handleSearch(searchCriteria);
    }
  };

  const handleSaveProperty = async (propertyToSave: Property) => {
    try {
        const savedProperty = await api.saveProperty(propertyToSave);
        const isNew = !allProperties.some(p => p.id === savedProperty.id);
        const newProperties = isNew 
            ? [savedProperty, ...allProperties]
            : allProperties.map(p => p.id === savedProperty.id ? savedProperty : p);
        
        updateAppState(newProperties, savedProperty.id);
    } catch (err) {
        setError('施設の保存に失敗しました。');
        console.error(err);
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (window.confirm('本当にこの施設を削除しますか？')) {
        try {
            await api.deleteProperty(propertyId);
            const newProperties = allProperties.filter(p => p.id !== propertyId);
            updateAppState(newProperties, propertyId);
        } catch (err) {
            setError('施設の削除に失敗しました。');
            console.error(err);
        }
    }
  };

  const handleAddReview = async (propertyId: string, reviewData: Omit<Review, 'id'>) => {
    try {
        const { updatedProperty, newReview } = await api.addReview(propertyId, reviewData);
        setMyReviewIds(prev => [...prev, newReview.id]);
        const newProperties = allProperties.map(p => p.id === propertyId ? updatedProperty : p);
        updateAppState(newProperties, propertyId);
    } catch (err) {
        setError('レビューの投稿に失敗しました。');
        console.error(err);
    }
  };
    
  const handleUpdateReview = async (propertyId: string, updatedReview: Review) => {
    try {
        const updatedProperty = await api.updateReview(propertyId, updatedReview);
        const newProperties = allProperties.map(p => p.id === propertyId ? updatedProperty : p);
        updateAppState(newProperties, propertyId);
    } catch (err) {
        setError('レビューの更新に失敗しました。');
        console.error(err);
    }
  };

  const handleDeleteReview = async (propertyId: string, reviewId: string) => {
    if (!window.confirm('このレビューを削除しますか？')) return;
    try {
        const { updatedProperty } = await api.deleteReview(propertyId, reviewId);
        setMyReviewIds(prev => prev.filter(id => id !== reviewId));
        const newProperties = allProperties.map(p => p.id === propertyId ? updatedProperty : p);
        updateAppState(newProperties, propertyId);
    } catch (err)
 {
        setError('レビューの削除に失敗しました。');
        console.error(err);
    }
  };
  
  const handleAddAnnouncement = async (propertyId: string, announcementData: Omit<Announcement, 'id' | 'createdAt'>) => {
    try {
        const updatedProperty = await api.addAnnouncement(propertyId, announcementData);
        const newProperties = allProperties.map(p => p.id === propertyId ? updatedProperty : p);
        updateAppState(newProperties, propertyId);
    } catch (err) {
        setError('お知らせの追加に失敗しました。');
        console.error(err);
    }
  };

  const handleUpdateAnnouncement = async (propertyId: string, updatedAnnouncement: Announcement) => {
    try {
        const updatedProperty = await api.updateAnnouncement(propertyId, updatedAnnouncement);
        const newProperties = allProperties.map(p => p.id === propertyId ? updatedProperty : p);
        updateAppState(newProperties, propertyId);
    } catch (err) {
        setError('お知らせの更新に失敗しました。');
        console.error(err);
    }
  };

  const handleDeleteAnnouncement = async (propertyId: string, announcementId: string) => {
    if (!window.confirm('このお知らせを削除しますか？')) return;
    try {
        const updatedProperty = await api.deleteAnnouncement(propertyId, announcementId);
        const newProperties = allProperties.map(p => p.id === propertyId ? updatedProperty : p);
        updateAppState(newProperties, propertyId);
    } catch (err) {
        setError('お知らせの削除に失敗しました。');
        console.error(err);
    }
  };

  const renderUserContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-96">
          <LoadingSpinner />
          <p className="mt-4 text-lg text-gray-600">データを読み込んでいます...</p>
        </div>
      );
    }

    if (error) {
      return <div className="text-center text-red-600 p-8">{error}</div>;
    }

    if (selectedProperty) {
      return (
        <PropertyDetail 
            property={selectedProperty} 
            onBack={handleBackToList}
            onAddReview={handleAddReview}
            onUpdateReview={handleUpdateReview}
            onDeleteReview={handleDeleteReview}
            myReviewIds={myReviewIds}
        />
      );
    }

    if (pageView === 'home') {
        return (
            <>
                <div className="text-center mb-12 bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
                    <h1 className="text-3xl md:text-4xl font-bold text-indigo-800 mb-2">直前だから、お得が見つかる。</h1>
                    <p className="text-lg text-gray-600">
                        このサイトは<span className="font-bold text-red-600">明日・明後日の宿泊予約</span>に特化しています。<br/>
                        気になる宿を見つけたら、すぐに電話で予約！
                    </p>
                </div>
                <SearchForm onSearch={handleSearch} allProperties={allProperties} />
                <SearchByTag onSearch={handleSearch} />
                <NewArrivals properties={allProperties} onSelectProperty={handleSelectProperty} />
            </>
        );
    }

    if (pageView === 'searchResults') {
        return (
            <>
                 <button
                    onClick={handleBackToSearch}
                    className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors mb-4"
                    >
                    <ArrowLeftIcon className="h-4 w-4 mr-1" />
                    検索ページに戻る
                </button>
                {searchCriteria && (
                    <p className="text-center text-gray-700 my-4 text-lg">
                        「<span className="font-bold">
                            {searchCriteria.location && '現在地周辺'}
                            {searchCriteria.area || (searchCriteria.region && `${searchCriteria.region}全体`) || (searchCriteria.tag && TAG_DATA[searchCriteria.tag]?.label) || (!searchCriteria.location && 'すべて')}
                        </span>」の検索結果：
                        <span className="font-bold text-indigo-600">{filteredProperties.length}</span>件
                    </p>
                )}
                <PropertyList properties={filteredProperties} onSelectProperty={handleSelectProperty} />
            </>
        );
    }
  };
  
  if (view === 'login') {
    return <Login onLoginSuccess={handleLoginSuccess} onCancel={() => handleNavigate('user')} />;
  }
  
  if (view === 'ownerLogin') {
      return <OwnerLogin properties={allProperties} onLoginSuccess={handleOwnerLoginSuccess} onCancel={() => handleNavigate('user')} />;
  }
  
  if (view === 'ownerDashboard' && loggedInOwnerProperty) {
      return (
        <OwnerDashboard
            property={loggedInOwnerProperty}
            onSave={handleSaveProperty}
            onLogout={handleOwnerLogout}
            onAddAnnouncement={handleAddAnnouncement}
            onUpdateAnnouncement={handleUpdateAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
        />
    );
  }

  if (view === 'admin') {
      return <AdminPanel properties={allProperties} onSave={handleSaveProperty} onDelete={handleDeleteProperty} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderUserContent()}
      </main>
      <Footer onNavigateToAdmin={() => handleNavigate('login')} onNavigateToOwnerLogin={() => handleNavigate('ownerLogin')} />
    </div>
  );
};

export default App;