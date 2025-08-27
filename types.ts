



export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export enum PropertyType {
  Hotel = 'ホテル',
  Minpaku = '民泊',
}

export enum PropertyTag {
  FAMILY = 'family',
  NEAR_STATION = 'near_station',
  WITH_KITCHEN = 'with_kitchen',
  COUPLE = 'couple',
  LARGE_GROUP = 'large_group',
  OCEAN_VIEW = 'ocean_view',
  MOUNTAIN_VIEW = 'mountain_view',
  WORKATION = 'workation',
}

export enum Amenity {
  Wifi = 'wifi',
  Parking = 'parking',
  NoSmoking = 'no_smoking',
  SeparateBathToilet = 'separate_bath_toilet',
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
}

export interface Property {
  id: string;
  name: string;
  type: PropertyType;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  price: number;
  rating: number;
  photos: string[];
  amenities: Amenity[];
  tags?: PropertyTag[];
  reviews: Review[];
  announcements: Announcement[];
  phoneNumber: string;
  lineOfficialUrl?: string; // LINE公式アカウントのURLを追加
  checkinTime: string;
  checkoutTime: string;
  // Owner-specific fields
  ownerUsername: string;
  ownerPassword: string;
  viewCount: number;
}

export interface SearchCriteria {
  area?: string;
  region?: string;
  tag?: PropertyTag;
  location?: {
    latitude: number;
    longitude: number;
  };
}