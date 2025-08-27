import { Property, Review, Announcement, PropertyType, Amenity, PropertyTag } from '../types.ts';

const PROPERTIES_KEY = 'properties';
const MY_REVIEW_IDS_KEY = 'myReviewIds';

// --- Initial Mock Data ---
const getInitialProperties = (): Property[] => {
  // A function to generate some mock data if localStorage is empty.
  return [
    {
      id: 'prop-1',
      name: '沖縄の絶景オーシャンビューホテル',
      type: PropertyType.Hotel,
      description: '美しい海を一望できる広々とした客室。プライベートビーチへのアクセスも抜群です。都会の喧騒を忘れ、心ゆくまでリラックスしてください。',
      address: '沖縄県那覇市1-2-3',
      latitude: 26.2124,
      longitude: 127.6809,
      price: 25000,
      rating: 4.8,
      photos: ['https://picsum.photos/seed/hotel1/800/600', 'https://picsum.photos/seed/hotel1-room/800/600'],
      amenities: [Amenity.Wifi, Amenity.Parking, Amenity.NoSmoking, Amenity.SeparateBathToilet],
      tags: [PropertyTag.OCEAN_VIEW, PropertyTag.COUPLE, PropertyTag.FAMILY],
      reviews: [{id: 'rev-1', author: '山田', rating: 5, comment: '最高の景色でした！'}],
      announcements: [{ id: 'ann-1', title: '夏季限定プールオープン！', content: '7月1日より屋外プールがオープンします。', createdAt: new Date().toISOString() }],
      phoneNumber: '098-123-4567',
      lineOfficialUrl: 'https://line.me/R/ti/p/%40linedevelopers',
      checkinTime: '15:00',
      checkoutTime: '11:00',
      ownerUsername: 'owner1',
      ownerPassword: 'password1',
      viewCount: 120,
    },
    {
      id: 'prop-2',
      name: '京都の静かな町家民泊',
      type: PropertyType.Minpaku,
      description: '伝統的な日本の美しさを感じられる町家を一棟貸し。坪庭を眺めながら、静かな時間をお過ごしいただけます。キッチンも完備しています。',
      address: '京都府京都市中京区4-5-6',
      latitude: 35.0116,
      longitude: 135.7681,
      price: 18000,
      rating: 4.9,
      photos: ['https://picsum.photos/seed/minpaku1/800/600', 'https://picsum.photos/seed/minpaku1-garden/800/600'],
      amenities: [Amenity.Wifi, Amenity.NoSmoking, Amenity.SeparateBathToilet],
      tags: [PropertyTag.WITH_KITCHEN, PropertyTag.COUPLE, PropertyTag.MOUNTAIN_VIEW],
      reviews: [{id: 'rev-2', author: '佐藤', rating: 5, comment: '本当に素敵な空間でした。また利用したいです。'}],
      announcements: [],
      phoneNumber: '075-987-6543',
      lineOfficialUrl: '',
      checkinTime: '16:00',
      checkoutTime: '10:00',
      ownerUsername: 'owner2',
      ownerPassword: 'password2',
      viewCount: 250,
    },
    {
      id: 'prop-3',
      name: '新宿駅直結の高層シティホテル',
      type: PropertyType.Hotel,
      description: 'ビジネスにも観光にも最適なロケーション。高層階からの夜景が自慢です。最新のフィットネスジムもご利用いただけます。',
      address: '東京都新宿区西新宿2-8-1',
      latitude: 35.6909,
      longitude: 139.6917,
      price: 32000,
      rating: 4.6,
      photos: ['https://picsum.photos/seed/shinjuku-hotel/800/600', 'https://picsum.photos/seed/shinjuku-view/800/600'],
      amenities: [Amenity.Wifi, Amenity.Parking, Amenity.NoSmoking],
      tags: [PropertyTag.NEAR_STATION, PropertyTag.WORKATION, PropertyTag.LARGE_GROUP],
      reviews: [
        {id: 'rev-3', author: '田中', rating: 4, comment: 'アクセスが最高でした。'},
        {id: 'rev-4', author: 'Suzuki', rating: 5, comment: 'The night view from the room was amazing!'}
      ],
      announcements: [],
      phoneNumber: '03-1234-5678',
      lineOfficialUrl: 'https://line.me/R/ti/p/%40linedevelopers',
      checkinTime: '15:00',
      checkoutTime: '12:00',
      ownerUsername: 'owner3',
      ownerPassword: 'password3',
      viewCount: 580,
    },
    {
      id: 'prop-4',
      name: '箱根の森に佇む温泉旅館',
      type: PropertyType.Hotel,
      description: '豊かな自然に囲まれた静かな温泉旅館。源泉かけ流しの露天風呂で、日々の疲れを癒してください。',
      address: '神奈川県足柄下郡箱根町湯本123',
      latitude: 35.233,
      longitude: 139.106,
      price: 45000,
      rating: 4.9,
      photos: ['https://picsum.photos/seed/hakone-ryokan/800/600', 'https://picsum.photos/seed/hakone-onsen/800/600'],
      amenities: [Amenity.Wifi, Amenity.Parking, Amenity.SeparateBathToilet],
      tags: [PropertyTag.MOUNTAIN_VIEW, PropertyTag.COUPLE],
      reviews: [{id: 'rev-5', author: '伊藤', rating: 5, comment: '温泉が最高でした。食事も美味しかったです。'}],
      announcements: [],
      phoneNumber: '0460-12-3456',
      lineOfficialUrl: '',
      checkinTime: '15:00',
      checkoutTime: '10:00',
      ownerUsername: 'owner4',
      ownerPassword: 'password4',
      viewCount: 320,
    },
    {
      id: 'prop-5',
      name: '大阪なんばのデザイナーズ民泊',
      type: PropertyType.Minpaku,
      description: '道頓堀まで徒歩5分！遊び心あふれるインテリアが特徴のお部屋です。グループ旅行に最適。',
      address: '大阪府大阪市中央区難波千日前7-8-9',
      latitude: 34.6653,
      longitude: 135.5059,
      price: 15000,
      rating: 4.5,
      photos: ['https://picsum.photos/seed/osaka-minpaku/800/600', 'https://picsum.photos/seed/osaka-room/800/600'],
      amenities: [Amenity.Wifi, Amenity.NoSmoking],
      tags: [PropertyTag.NEAR_STATION, PropertyTag.LARGE_GROUP, PropertyTag.WITH_KITCHEN],
      reviews: [],
      announcements: [],
      phoneNumber: '06-9876-5432',
      lineOfficialUrl: '',
      checkinTime: '16:00',
      checkoutTime: '11:00',
      ownerUsername: 'owner5',
      ownerPassword: 'password5',
      viewCount: 410,
    },
    {
      id: 'prop-6',
      name: '北海道・富良野のコテージ',
      type: PropertyType.Minpaku,
      description: 'ラベンダー畑に囲まれた一棟貸しのコテージ。満点の星空と静寂な時間をお楽しみください。冬はスキーの拠点にも。',
      address: '北海道富良野市北の峰町10-11',
      latitude: 43.344,
      longitude: 142.383,
      price: 28000,
      rating: 4.7,
      photos: ['https://picsum.photos/seed/furano-cottage/800/600', 'https://picsum.photos/seed/furano-lavender/800/600'],
      amenities: [Amenity.Wifi, Amenity.Parking, Amenity.SeparateBathToilet],
      tags: [PropertyTag.MOUNTAIN_VIEW, PropertyTag.FAMILY, PropertyTag.LARGE_GROUP, PropertyTag.WITH_KITCHEN],
      reviews: [{id: 'rev-6', author: '加藤', rating: 5, comment: '家族で最高の思い出ができました。'}],
      announcements: [],
      phoneNumber: '0167-11-2233',
      lineOfficialUrl: '',
      checkinTime: '15:00',
      checkoutTime: '10:00',
      ownerUsername: 'owner6',
      ownerPassword: 'password6',
      viewCount: 180,
    },
    {
      id: 'prop-7',
      name: '福岡・天神のビジネスホテル',
      type: PropertyType.Hotel,
      description: '天神の中心部に位置し、ビジネスやショッピングに便利。快適なベッドと機能的なデスクで、出張をサポートします。',
      address: '福岡県福岡市中央区天神3-3-3',
      latitude: 33.5913,
      longitude: 130.3988,
      price: 12000,
      rating: 4.4,
      photos: ['https://picsum.photos/seed/fukuoka-hotel/800/600', 'https://picsum.photos/seed/fukuoka-desk/800/600'],
      amenities: [Amenity.Wifi, Amenity.NoSmoking],
      tags: [PropertyTag.WORKATION, PropertyTag.NEAR_STATION],
      reviews: [],
      announcements: [{ id: 'ann-2', title: '朝食ビュッフェリニューアル', content: '和洋中のメニューがさらに充実しました。', createdAt: new Date().toISOString() }],
      phoneNumber: '092-555-7788',
      lineOfficialUrl: 'https://line.me/R/ti/p/%40linedevelopers',
      checkinTime: '15:00',
      checkoutTime: '11:00',
      ownerUsername: 'owner7',
      ownerPassword: 'password7',
      viewCount: 650,
    },
    {
      id: 'prop-8',
      name: '軽井沢の森の隠れ家',
      type: PropertyType.Minpaku,
      description: '浅間山を望む、静かな森の中に佇む一軒家。暖炉のあるリビングで、ゆったりとした時間をお過ごしください。',
      address: '長野県北佐久郡軽井沢町長倉12-34',
      latitude: 36.348,
      longitude: 138.632,
      price: 35000,
      rating: 4.9,
      photos: ['https://picsum.photos/seed/karuizawa-house/800/600', 'https://picsum.photos/seed/karuizawa-living/800/600'],
      amenities: [Amenity.Wifi, Amenity.Parking, Amenity.SeparateBathToilet],
      tags: [PropertyTag.MOUNTAIN_VIEW, PropertyTag.COUPLE, PropertyTag.FAMILY, PropertyTag.WITH_KITCHEN],
      reviews: [{id: 'rev-7', author: '高橋', rating: 5, comment: '非日常を味わえました。また来たいです。'}],
      announcements: [],
      phoneNumber: '0267-41-1111',
      lineOfficialUrl: '',
      checkinTime: '16:00',
      checkoutTime: '11:00',
      ownerUsername: 'owner8',
      ownerPassword: 'password8',
      viewCount: 290,
    },
    {
      id: 'prop-9',
      name: '金沢ひがし茶屋街の宿',
      type: PropertyType.Minpaku,
      description: '歴史的な街並みに溶け込む、趣のあるお宿です。金沢の文化を肌で感じながら、特別な滞在をお楽しみください。',
      address: '石川県金沢市東山1-13-2',
      latitude: 36.572,
      longitude: 136.669,
      price: 22000,
      rating: 4.8,
      photos: ['https://picsum.photos/seed/kanazawa-chaya/800/600', 'https://picsum.photos/seed/kanazawa-room/800/600'],
      amenities: [Amenity.Wifi, Amenity.NoSmoking, Amenity.SeparateBathToilet],
      tags: [PropertyTag.COUPLE, PropertyTag.NEAR_STATION],
      reviews: [],
      announcements: [],
      phoneNumber: '076-252-8888',
      lineOfficialUrl: '',
      checkinTime: '15:00',
      checkoutTime: '10:00',
      ownerUsername: 'owner9',
      ownerPassword: 'password9',
      viewCount: 330,
    },
  ];
};

// --- LocalStorage Helper Functions ---
const getPropertiesFromStorage = (): Property[] => {
  try {
    const data = localStorage.getItem(PROPERTIES_KEY);
    if (data) {
      return JSON.parse(data);
    } else {
      const initialData = getInitialProperties();
      localStorage.setItem(PROPERTIES_KEY, JSON.stringify(initialData));
      return initialData;
    }
  } catch (error) {
    console.error("Could not read properties from localStorage", error);
    return getInitialProperties(); // Fallback to initial data
  }
};

const savePropertiesToStorage = (properties: Property[]): void => {
  try {
    localStorage.setItem(PROPERTIES_KEY, JSON.stringify(properties));
  } catch (error) {
    console.error("Could not save properties to localStorage", error);
  }
};

// Initialize storage on load
getPropertiesFromStorage();


// --- API Functions ---

export const getProperties = async (): Promise<Property[]> => {
  return Promise.resolve(getPropertiesFromStorage());
};

export const saveProperty = async (propertyData: Property): Promise<Property> => {
  let properties = getPropertiesFromStorage();
  const index = properties.findIndex(p => p.id === propertyData.id);

  if (index > -1) {
    // Update existing property
    properties[index] = propertyData;
  } else {
    // Add new property
    properties.unshift(propertyData);
  }
  
  savePropertiesToStorage(properties);
  return Promise.resolve(propertyData);
};

export const deleteProperty = async (propertyId: string): Promise<void> => {
  let properties = getPropertiesFromStorage();
  const filteredProperties = properties.filter(p => p.id !== propertyId);
  savePropertiesToStorage(filteredProperties);
  return Promise.resolve();
};

// --- Reviews ---

export const getMyReviewIds = async (): Promise<string[]> => {
  const data = localStorage.getItem(MY_REVIEW_IDS_KEY);
  return Promise.resolve(data ? JSON.parse(data) : []);
};

const saveMyReviewIds = async (ids: string[]): Promise<void> => {
  localStorage.setItem(MY_REVIEW_IDS_KEY, JSON.stringify(ids));
  return Promise.resolve();
};

const recalculateRating = (reviews: Review[]): number => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return parseFloat((totalRating / reviews.length).toFixed(1));
};

export const addReview = async (propertyId: string, reviewData: Omit<Review, 'id'>): Promise<{ updatedProperty: Property, newReview: Review }> => {
  let properties = getPropertiesFromStorage();
  const propertyIndex = properties.findIndex(p => p.id === propertyId);
  if (propertyIndex === -1) throw new Error("Property not found");

  const newReview: Review = { ...reviewData, id: `rev-${Date.now()}` };
  const property = properties[propertyIndex];
  
  property.reviews.push(newReview);
  property.rating = recalculateRating(property.reviews);
  
  properties[propertyIndex] = property;
  savePropertiesToStorage(properties);

  const myIds = await getMyReviewIds();
  myIds.push(newReview.id);
  await saveMyReviewIds(myIds);
  
  return Promise.resolve({ updatedProperty: property, newReview });
};

export const updateReview = async (propertyId: string, updatedReview: Review): Promise<Property> => {
  let properties = getPropertiesFromStorage();
  const propertyIndex = properties.findIndex(p => p.id === propertyId);
  if (propertyIndex === -1) throw new Error("Property not found");

  const property = properties[propertyIndex];
  const reviewIndex = property.reviews.findIndex(r => r.id === updatedReview.id);
  if (reviewIndex === -1) throw new Error("Review not found");

  property.reviews[reviewIndex] = updatedReview;
  property.rating = recalculateRating(property.reviews);

  properties[propertyIndex] = property;
  savePropertiesToStorage(properties);
  
  return Promise.resolve(property);
};

export const deleteReview = async (propertyId: string, reviewId: string): Promise<{ updatedProperty: Property }> => {
  let properties = getPropertiesFromStorage();
  const propertyIndex = properties.findIndex(p => p.id === propertyId);
  if (propertyIndex === -1) throw new Error("Property not found");
  
  const property = properties[propertyIndex];
  property.reviews = property.reviews.filter(r => r.id !== reviewId);
  property.rating = recalculateRating(property.reviews);

  properties[propertyIndex] = property;
  savePropertiesToStorage(properties);

  const myIds = await getMyReviewIds();
  await saveMyReviewIds(myIds.filter(id => id !== reviewId));

  return Promise.resolve({ updatedProperty: property });
};


// --- Announcements ---

export const addAnnouncement = async (propertyId: string, announcementData: Omit<Announcement, 'id' | 'createdAt'>): Promise<Property> => {
  let properties = getPropertiesFromStorage();
  const propertyIndex = properties.findIndex(p => p.id === propertyId);
  if (propertyIndex === -1) throw new Error("Property not found");

  const newAnnouncement: Announcement = { 
    ...announcementData, 
    id: `ann-${Date.now()}`, 
    createdAt: new Date().toISOString() 
  };
  
  const property = properties[propertyIndex];
  property.announcements = [newAnnouncement, ...(property.announcements || [])];
  
  properties[propertyIndex] = property;
  savePropertiesToStorage(properties);
  
  return Promise.resolve(property);
};


export const updateAnnouncement = async (propertyId: string, updatedAnnouncement: Announcement): Promise<Property> => {
  let properties = getPropertiesFromStorage();
  const propertyIndex = properties.findIndex(p => p.id === propertyId);
  if (propertyIndex === -1) throw new Error("Property not found");

  const property = properties[propertyIndex];
  const announcementIndex = property.announcements.findIndex(a => a.id === updatedAnnouncement.id);
  if (announcementIndex === -1) throw new Error("Announcement not found");

  property.announcements[announcementIndex] = updatedAnnouncement;
  
  properties[propertyIndex] = property;
  savePropertiesToStorage(properties);
  
  return Promise.resolve(property);
};

export const deleteAnnouncement = async (propertyId: string, announcementId: string): Promise<Property> => {
  let properties = getPropertiesFromStorage();
  const propertyIndex = properties.findIndex(p => p.id === propertyId);
  if (propertyIndex === -1) throw new Error("Property not found");
  
  const property = properties[propertyIndex];
  property.announcements = property.announcements.filter(a => a.id !== announcementId);
  
  properties[propertyIndex] = property;
  savePropertiesToStorage(properties);
  
  return Promise.resolve(property);
};