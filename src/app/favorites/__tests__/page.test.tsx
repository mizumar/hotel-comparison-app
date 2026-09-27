import { render, screen, act } from "@testing-library/react";
import FavoritesPage from "@/src/app/favorites/page";
import { useFavoriteStore } from "@/src/stores/useFavoriteStore";
import { Hotel } from "@/src/types/hotel";

// next/link のモック（Simple Link wrapper）
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// テスト用データ
const mockHotels: Hotel[] = [
  {
    id: "hotel-1",
    name: "テストホテル仙台",
    address: "宮城県仙台市...",
    access: "仙台駅徒歩1分",
    minCharge: 9000,
    imageUrl: "https://example.com/1.jpg",
    rakutenUrl: "https://example.com/1",
  },
  {
    id: "hotel-2",
    name: "テストホテル松島",
    address: "宮城県宮城郡松島町...",
    access: "松島海岸駅徒歩5分",
    minCharge: 15000,
    imageUrl: "https://example.com/2.jpg",
    rakutenUrl: "https://example.com/2",
  },
];

describe("FavoritesPage (/favorites)", () => {
  beforeEach(() => {
    // 各テスト実行前に Zustand の状態をクリア
    act(() => {
      useFavoriteStore.setState({ favorites: [] });
    });
  });

  it("お気に入りが空（0件）の時、Empty状態のメッセージと検索画面へのリンクが表示されること", async () => {
    render(<FavoritesPage />);

    // useEffect のマウント処理完了を反映するため画面描画を確認
    expect(
      await screen.findByText("お気に入りのホテルはまだありません"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "検索結果画面から気になるホテルのハートアイコンを押して追加してみましょう。",
      ),
    ).toBeInTheDocument();

    // トップページ（/）への導線リンクが存在するか確認
    const link = screen.getByRole("link", { name: "ホテルを検索する" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });

  it("お気に入りが存在する場合、保存されたホテル一覧と件数が正しく表示されること", async () => {
    // 事前にストアにお気に入りホテルを2件追加
    act(() => {
      useFavoriteStore.setState({ favorites: mockHotels });
    });

    render(<FavoritesPage />);

    // 件数表示の確認
    expect(await screen.findByText("全 2 件")).toBeInTheDocument();

    // ホテル名が表示されているか確認
    expect(screen.getByText("テストホテル仙台")).toBeInTheDocument();
    expect(screen.getByText("テストホテル松島")).toBeInTheDocument();

    // 0件メッセージが表示されていないことの確認
    expect(
      screen.queryByText("お気に入りのホテルはまだありません"),
    ).not.toBeInTheDocument();
  });
});
