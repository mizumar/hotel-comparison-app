/** ホテル検索結果の一覧表示に使用する型 */
export interface Hotel {
  id: string;
  name: string;
  minCharge: number;
  address: string;
  access: string;
  imageUrl: string;
  rakutenUrl: string;
}

/** 検索フォーム・API リクエスト用の型定義 */
export interface SearchParams {
  keyword?: string; // フリーワード（ホテル名など）
  largeClassCode?: string; // 大分類
  middleClassCode?: string; // 中分類
  smallClassCode?: string; // 小分類
  checkinDate?: string; // チェックイン日 (YYYY-MM-DD)
  checkoutDate?: string; // チェックインアウト日 (YYYY-MM-DD)
  adultNum?: number; // 宿泊人数（大人）
  latitude?: number; // 緯度 (エリア・現在地検索用)
  longitude?: number; // 経度 (エリア・現在地検索用)
  searchRadius?: number; // 検索半径 (km)
  // Phase 3-2 追加パラメータ
  minCharge?: number; // 最低料金 (円)
  maxCharge?: number; // 最高料金 (円)
  sort?: string; // ソート順 ('standard' | '+roomCharge' | '-roomCharge')
}

/** ホテルの詳細情報を含む型 */
export interface HotelDetail extends Hotel {
  // 施設情報
  hotelKanaName: string;
  hotelSpecial: string;
  postalCode: string;
  telephoneNo: string;
  faxNo: string;
  parkingInformation: string;
  nearestStation: string;

  // 緯度・経度
  latitude: number;
  longitude: number;

  // 施設・客室・地図の画像
  planListUrl: string;
  dpPlanListUrl: string;
  reviewUrl: string;
  hotelThumbnailUrl: string;
  roomImageUrl: string;
  roomThumbnailUrl: string;
  hotelMapImageUrl: string;

  // 口コミ情報
  reviewCount: number | null;
  reviewAverage: number | null;
  userReview: string | null;

  // 評価の内訳
  ratingInfo: HotelRatingInfo | null;
}

/** ホテルの評価内訳 */
export interface HotelRatingInfo {
  serviceAverage: number;
  locationAverage: number;
  roomAverage: number;
  equipmentAverage: number;
  bathAverage: number;
  breakfastAverage: number;
  dinnerAverage: number;
  cleanlinessAverage: number;
}
