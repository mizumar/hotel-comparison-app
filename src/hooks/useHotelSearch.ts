import { useQuery } from "@tanstack/react-query";
import { SearchParams } from "@/src/types/hotel";
import { searchHotels } from "@/src/services/hotelService";

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
