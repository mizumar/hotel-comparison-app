import { render, screen, fireEvent, act } from "@testing-library/react";
import { FavoriteButton } from "@/src/components/FavoriteButton";
import { useFavoriteStore } from "@/src/stores/useFavoriteStore";
import { Hotel } from "@/src/types/hotel";

const mockHotel: Hotel = {
  id: "12345",
  name: "テストホテル仙台",
  address: "宮城県仙台市青葉区...",
  access: "仙台駅徒歩3分",
  minCharge: 8500,
  imageUrl: "https://example.com/image.jpg",
  rakutenUrl: "https://example.com",
};

describe("FavoriteButton", () => {
  beforeEach(() => {
    act(() => {
      useFavoriteStore.setState({ favorites: [] });
    });
  });

  it("未登録状態のホテルを Props で渡した場合、未登録状態の UI がレンダリングされること", () => {
    render(<FavoriteButton hotel={mockHotel} />);

    const button = screen.getByRole("button", { name: "お気に入りに追加" });
    expect(button).toBeInTheDocument();
  });

  it("登録済み状態のホテルを Props で渡した場合、登録済み状態の UI がレンダリングされること", () => {
    // ストアにあらかじめ追加しておく
    act(() => {
      useFavoriteStore.getState().addFavorite(mockHotel);
    });

    render(<FavoriteButton hotel={mockHotel} />);

    const button = screen.getByRole("button", { name: "お気に入りから削除" });
    expect(button).toBeInTheDocument();
  });

  it("ボタンをクリックした際、Store のトグル処理が正しく走り状態が更新されること", () => {
    render(<FavoriteButton hotel={mockHotel} />);

    const button = screen.getByRole("button", { name: "お気に入りに追加" });

    // クリックして登録
    fireEvent.click(button);
    expect(useFavoriteStore.getState().isFavorite(mockHotel.id)).toBe(true);

    // 再度クリックして解除
    fireEvent.click(button);
    expect(useFavoriteStore.getState().isFavorite(mockHotel.id)).toBe(false);
  });
});
