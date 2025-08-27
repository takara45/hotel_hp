export interface Region {
  name: string;
  prefectures: string[];
}

export const regions: Region[] = [
  {
    name: '北海道・東北',
    prefectures: ['北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県'],
  },
  {
    name: '関東',
    prefectures: ['茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県'],
  },
  {
    name: '北陸・甲信越',
    prefectures: ['新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県'],
  },
  {
    name: '東海',
    prefectures: ['岐阜県', '静岡県', '愛知県', '三重県'],
  },
  {
    name: '関西（近畿）',
    prefectures: ['滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県'],
  },
  {
    name: '中国・四国',
    prefectures: ['鳥取県', '島根県', '岡山県', '広島県', '山口県', '徳島県', '香川県', '愛媛県', '高知県'],
  },
  {
    name: '九州・沖縄',
    prefectures: ['福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'],
  },
];
