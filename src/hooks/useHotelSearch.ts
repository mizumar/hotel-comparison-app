import { useQuery } from "@tanstack/react-query";
import { SearchParams } from "@/src/types/hotel";
import { searchHotels } from "@/src/services/hotelService";
/**
 * ホテル検索のデータ取得と状態管理を行うカスタムフック
 *
 * 検索条件をもとにホテル検索を実行し、
 * TanStack Query を使って取得データのキャッシュや
 * 読み込み中・エラーなどの状態を管理する。
 *
 * @param params - ホテルの検索条件
 * @param enabled - 検索を自動実行するかどうか（デフォルト: true）
 * @returns ホテルの取得データ、読み込み状態、エラー状態など
 */
export function useHotelSearch(params: SearchParams, enabled: boolean = true) {
  return useQuery({
    // キャッシュのキー
    queryKey: ["hotels", params],
    // サービス層の関数を呼び出す
    queryFn: () => searchHotels(params),
    // 検索条件が有効な時だけフェッチを実行
    enabled,
    // 5分間はキャッシュを新鮮とみなす
    staleTime: 1000 * 60 * 5,
  });
}
