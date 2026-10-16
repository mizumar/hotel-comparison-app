import { Hotel, SearchParams } from "@/src/types/hotel";

interface HotelSearchResponse {
  hotels: Hotel[];
  error?: string;
}

/**
 * 楽天トラベル API（バックエンド経由）からホテル一覧を取得するサービス関数
 */
export async function searchHotels(params: SearchParams): Promise<Hotel[]> {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  });

  const res = await fetch(`/api/hotels?${query.toString()}`);
  const data: HotelSearchResponse = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "ホテル情報の取得に失敗しました。");
  }

  return data.hotels || [];
}
