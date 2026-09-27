import { act } from "@testing-library/react";
import { useFavoriteStore } from "@/src/stores/useFavoriteStore";
import { Hotel } from "@/src/types/hotel";

// テスト用のダミーホテルデータ
const mockHotel: Hotel = {
  id: "12345",
  name: "テストホテル仙台",
  address: "宮城県仙台市青葉区...",
  access: "仙台駅徒歩3分",
  minCharge: 8500,
  imageUrl: "https://example.com/image.jpg",
  rakutenUrl: "https://example.com",
};

const mockHotel2: Hotel = {
  ...mockHotel,
  id: "67890",
  name: "テストホテル松島",
};

describe("useFavoriteStore", () => {
  // 各テストケースの実行前にストアの状態を初期化する
  beforeEach(() => {
    act(() => {
      useFavoriteStore.setState({ favorites: [] });
    });
  });

  it("初期状態ではお気に入りリスト（favorites）が空配列であること", () => {
    const { favorites } = useFavoriteStore.getState();
    expect(favorites).toEqual([]);
  });

  it("addFavorite を実行すると、対象のホテルがリストに追加されること", () => {
    act(() => {
      useFavoriteStore.getState().addFavorite(mockHotel);
    });

    const { favorites } = useFavoriteStore.getState();
    expect(favorites).toHaveLength(1);
    expect(favorites[0]).toEqual(mockHotel);
  });

  it("removeFavorite を実行すると、指定した ID のホテルがリストから削除されること", () => {
    // 事前に2件追加
    act(() => {
      useFavoriteStore.getState().addFavorite(mockHotel);
      useFavoriteStore.getState().addFavorite(mockHotel2);
    });

    // 1件目を削除
    act(() => {
      useFavoriteStore.getState().removeFavorite(mockHotel.id);
    });

    const { favorites } = useFavoriteStore.getState();
    expect(favorites).toHaveLength(1);
    expect(favorites[0].id).toBe(mockHotel2.id);
  });

  it("toggleFavorite を実行した際、未登録なら追加され、登録済みなら削除されること", () => {
    // 1回目の実行（未登録 -> 追加）
    act(() => {
      useFavoriteStore.getState().toggleFavorite(mockHotel);
    });
    expect(useFavoriteStore.getState().favorites).toHaveLength(1);

    // 2回目の実行（登録済み -> 削除）
    act(() => {
      useFavoriteStore.getState().toggleFavorite(mockHotel);
    });
    expect(useFavoriteStore.getState().favorites).toHaveLength(0);
  });

  it("isFavorite が、登録済みの場合は true、未登録の場合は false を正しく返すこと", () => {
    expect(useFavoriteStore.getState().isFavorite(mockHotel.id)).toBe(false);

    act(() => {
      useFavoriteStore.getState().addFavorite(mockHotel);
    });

    expect(useFavoriteStore.getState().isFavorite(mockHotel.id)).toBe(true);
  });
});
