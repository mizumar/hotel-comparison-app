import { Hotel, SearchParams } from "@/src/types/hotel";

/**
 * ホテル検索 API のレスポンス形式
 *
 * hotels にホテル一覧、error にエラーメッセージが格納される。
 */
interface HotelSearchResponse {
  hotels: Hotel[];
  error?: string;
}

/**
 * 楽天トラベル API（バックエンド経由）からホテル一覧を取得するサービス関数
 *
 * 検索条件を URL のクエリパラメータに変換して
 * 自作の API ルートにリクエストを送り、ホテル一覧を取得する。
 *
 * @param params - ホテルの検索条件
 * @returns 取得したホテル一覧
 * @throws API リクエストが失敗した場合にエラーを投げる
 */
export async function searchHotels(params: SearchParams): Promise<Hotel[]> {
  // 検索条件を URL のクエリパラメータに変換する
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    // 値が undefined または空文字列の項目は URL に含めない
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  });

  // 自作の API ルートにリクエストを送り、検索結果を取得する
  const res = await fetch(`/api/hotels?${query.toString()}`);

  // レスポンスの JSON を HotelSearchResponse 型として扱う
  const data: HotelSearchResponse = await res.json();

  // HTTP 通信が失敗した場合は、エラーメッセージを使って例外を投げる
  if (!res.ok) {
    throw new Error(data.error || "ホテル情報の取得に失敗しました。");
  }

  // hotels が存在すれば返し、存在しなければ空の配列を返す
  return data.hotels || [];
}
