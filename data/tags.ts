import { PropertyTag } from '../types.ts';

export const TAG_DATA: Record<PropertyTag, { label: string; image: string }> = {
  [PropertyTag.FAMILY]: { label: '子連れ歓迎', image: 'https://images.unsplash.com/photo-1519642918688-7e43b19245d8?w=400&auto=format&fit=crop&q=60' },
  [PropertyTag.NEAR_STATION]: { label: '駅から徒歩5分圏内', image: 'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?w=400&auto=format&fit=crop&q=60' },
  [PropertyTag.WITH_KITCHEN]: { label: 'キッチン付き', image: 'https://images.unsplash.com/photo-1618220252344-8ec99ec624b1?w=400&auto=format&fit=crop&q=60' },
  [PropertyTag.COUPLE]: { label: 'カップルにおすすめ', image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&auto=format&fit=crop&q=60' },
  [PropertyTag.LARGE_GROUP]: { label: '大人数OK', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&auto=format&fit=crop&q=60' },
  [PropertyTag.OCEAN_VIEW]: { label: 'オーシャンビュー', image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400&auto=format&fit=crop&q=60' },
  [PropertyTag.MOUNTAIN_VIEW]: { label: '美しい山の景色', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&auto=format&fit=crop&q=60' },
  [PropertyTag.WORKATION]: { label: 'ワーケーションに最適', image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&auto=format&fit=crop&q=60' },
};