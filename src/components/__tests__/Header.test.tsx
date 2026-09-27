import { render, screen, act } from "@testing-library/react";
import { Header } from "@/src/components/Header";
import { useFavoriteStore } from "@/src/stores/useFavoriteStore";
import { Hotel } from "@/src/types/hotel";

// next/link のモック
jest.mock("next/link", () => {
  return ({
    children,
    href,
    "aria-label": ariaLabel,
  }: {
    children: React.ReactNode;
    href: string;
    "aria-label"?: string;
  }) => (
    <a href={href} aria-label={ariaLabel}>
      {children}
    </a>
  );
});

// テスト用ダミーホテルデータ
const mockHotel: Hotel = {
  id: "hotel-1",
  name: "テストホテル",
  address: "住所",
  access: "アクセス",
  minCharge: 10000,
  imageUrl: "https://example.com/image.jpg",
  rakutenUrl: "https://example.com",
};

describe("Header", () => {
  beforeEach(() => {
    // 各テスト前に Zustand の状態をクリア
    act(() => {
      useFavoriteStore.setState({ favorites: [] });
    });
  });

  it("ロゴ（ホームへのリンク）とお気に入りリンクが正しくレンダリングされること", () => {
    render(<Header />);

    // ホームへのリンクテスト
    const homeLink = screen.getByRole("link", { name: "ホームへ戻る" });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");

    // お気に入りへのリンクテスト
    const favoritesLink = screen.getByRole("link", {
      name: "お気に入り一覧を見る",
    });
    expect(favoritesLink).toBeInTheDocument();
    expect(favoritesLink).toHaveAttribute("href", "/favorites");
  });

  it("お気に入りが 0 件の時、件数カウントが表示されないこと", async () => {
    render(<Header />);

    // マウント後のレンダリング完了を待機
    expect(
      screen.getByRole("link", { name: "お気に入り一覧を見る" }),
    ).toBeInTheDocument();

    // 数字が表示されていないことを検証
    expect(screen.queryByText(/\d+/)).not.toBeInTheDocument();
  });

  it("お気に入りが 1 件以上の時、件数が正しい数値（上付き表示）で表示されること", async () => {
    // ストアに 2 件追加
    act(() => {
      useFavoriteStore.setState({
        favorites: [mockHotel, { ...mockHotel, id: "hotel-2" }],
      });
    });

    render(<Header />);

    // マウント後に「2」が表示されていることを検証
    expect(await screen.findByText("2")).toBeInTheDocument();
  });

  it("お気に入りが 100 件以上の時、'99+' と表示されること", async () => {
    // 100件のダミー配列を作成
    const hundredHotels = Array.from({ length: 100 }, (_, i) => ({
      ...mockHotel,
      id: `hotel-${i}`,
    }));

    act(() => {
      useFavoriteStore.setState({ favorites: hundredHotels });
    });

    render(<Header />);

    // カンスト表示「99+」の検証
    expect(await screen.findByText("99+")).toBeInTheDocument();
  });
});
