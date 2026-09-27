// 1. 既存の Hotel 型（楽天 API のレスポンスに合わせフィールド名を一部拡張）
export interface Hotel {
  id: string;
  name: string;
  minCharge: number;
  address: string;
  access: string;
  imageUrl: string;
  rakutenUrl: string;
}

// 2. 検索フォーム・API リクエスト用の型定義 (新規追加)
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
}
