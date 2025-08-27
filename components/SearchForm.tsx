import React, { useState, useMemo } from 'react';
import { Property, SearchCriteria } from '../types.ts';
import { SearchIcon, MapPinIcon, ChevronDownIcon } from './icons/CoreIcons.tsx';
import { regions, Region } from '../data/prefectures.ts';


interface SearchFormProps {
  onSearch: (criteria: SearchCriteria) => void;
  allProperties: Property[];
}

type SearchTab = 'prefecture' | 'location' | 'name';

const SearchTabs = ({ activeTab, setActiveTab }: { activeTab: SearchTab, setActiveTab: (tab: SearchTab) => void }) => {
  const tabs: { id: SearchTab; label: string }[] = [
    { id: 'prefecture', label: '都道府県から探す' },
    { id: 'location', label: '現在地から探す' },
    { id: 'name', label: '施設名から探す' },
  ];

  return (
    <div className="relative">
      <div className="flex border-b-2 border-stone-300">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 p-3 md:p-4 font-semibold text-sm md:text-base rounded-t-lg transition-colors focus:outline-none relative ${
              activeTab === tab.id
                ? 'bg-stone-700 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
             {activeTab === tab.id && (
                <div 
                    className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0"
                    style={{
                        borderLeft: '10px solid transparent',
                        borderRight: '10px solid transparent',
                        borderTop: '10px solid #6c584c', // custom color matching stone-700
                    }}
                />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};


const SearchForm: React.FC<SearchFormProps> = ({ onSearch, allProperties }) => {
  const [activeTab, setActiveTab] = useState<SearchTab>('prefecture');
  
  // Prefecture Tab State
  const [openRegion, setOpenRegion] = useState<string | null>('関東');

  // Name Tab State
  const [keyword, setKeyword] = useState<string>('');

  // Location Tab State
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const propertyCountsByPrefecture = useMemo(() => {
    const counts: { [prefecture: string]: number } = {};
    if (!allProperties) return {};
    
    for (const property of allProperties) {
      let found = false;
      for (const region of regions) {
        for (const prefecture of region.prefectures) {
          if (property.address.includes(prefecture)) {
            counts[prefecture] = (counts[prefecture] || 0) + 1;
            found = true;
            break;
          }
        }
        if(found) break;
      }
    }
    return counts;
  }, [allProperties]);

  const getCountForRegion = (region: Region) => {
    return region.prefectures.reduce((sum, pref) => sum + (propertyCountsByPrefecture[pref] || 0), 0);
  };

  const handlePrefectureSearch = (prefecture: string) => {
    onSearch({ area: prefecture });
  };

  const handleRegionSearch = (regionName: string) => {
    onSearch({ region: regionName });
  };
  
  const handleKeywordSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    onSearch({ area: keyword });
  };
  
  const handleLocationSearch = () => {
    if (!navigator.geolocation) {
        setLocationError('お使いのブラウザは現在地検索に対応していません。');
        return;
    }
    setIsLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            onSearch({ location: { latitude, longitude } });
            setIsLocating(false);
        },
        (error) => {
            let errorMessage = '現在地の取得に失敗しました。';
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = '現在地の取得が許可されませんでした。ブラウザのアドレスバーにあるアイコン等から、このサイトへの位置情報アクセスを許可してください。';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = '現在地を取得できませんでした。通信環境の良い場所で再度お試しください。';
                    break;
                case error.TIMEOUT:
                    errorMessage = '現在地の取得がタイムアウトしました。再度お試しください。';
                    break;
            }
            setLocationError(errorMessage);
            setIsLocating(false);
        }
    );
  };

  const toggleRegion = (regionName: string) => {
    setOpenRegion(prev => (prev === regionName ? null : regionName));
  };


  return (
    <div className="bg-white rounded-xl shadow-lg mb-8 border border-gray-200" style={{'--tw-shadow-color': 'rgba(92, 64, 51, 0.1)'} as React.CSSProperties}>
      <SearchTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
        {activeTab === 'prefecture' && (
          <div className="animate-fade-in bg-stone-50">
                {regions.map(region => (
                    <div key={region.name} className="border-b last:border-b-0 border-gray-200">
                        <button onClick={() => toggleRegion(region.name)} className="w-full flex justify-between items-center p-4 text-left hover:bg-stone-100 transition-colors">
                            <span className="font-semibold text-gray-800">{region.name}</span>
                            <ChevronDownIcon className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${openRegion === region.name ? 'rotate-180' : ''}`} />
                        </button>
                        {openRegion === region.name && (
                            <div className="p-6 pt-4 animate-fade-in" style={{backgroundColor: '#fdfcfb'}}>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-3">
                                    <button 
                                        onClick={() => handleRegionSearch(region.name)}
                                        className="text-left text-sm text-gray-800 hover:text-indigo-600 transition-colors"
                                    >
                                        {region.name}すべて ({getCountForRegion(region)})
                                    </button>
                                    {region.prefectures.map(pref => (
                                        <button 
                                            key={pref} 
                                            onClick={() => handlePrefectureSearch(pref)}
                                            className="text-left text-sm text-gray-700 hover:text-indigo-600 transition-colors"
                                        >
                                            {pref}({propertyCountsByPrefecture[pref] || 0})
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
          </div>
        )}
        
        {activeTab === 'location' && (
           <div className="text-center p-8 animate-fade-in">
             <button
               onClick={handleLocationSearch}
               disabled={isLocating}
               className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:bg-gray-400"
             >
               <div className="flex items-center">
                 <MapPinIcon className="h-5 w-5 mr-2" />
                 <span>{isLocating ? '検索中...' : '現在地周辺の宿を探す'}</span>
               </div>
             </button>
             {locationError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-800 text-sm rounded-md" role="alert">
                    <p>{locationError}</p>
                </div>
             )}
           </div>
        )}
        
        {activeTab === 'name' && (
          <form onSubmit={handleKeywordSearch} className="animate-fade-in p-6">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="施設名やキーワードを入力"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-500"
              />
              <button
                type="submit"
                className="flex-shrink-0 bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                aria-label="Search"
              >
                <SearchIcon className="h-5 w-5" />
              </button>
            </div>
          </form>
        )}
    </div>
  );
};

export default SearchForm;