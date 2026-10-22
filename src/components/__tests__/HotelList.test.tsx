import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { HotelList } from "../HotelList";
import { Hotel } from "@/src/types/hotel";

// FavoriteButton コンポーネントのモック化
jest.mock("@/src/components/FavoriteButton", () => ({
  FavoriteButton: ({ hotel }: { hotel: Hotel }) => (
    <button data-testid={`favorite-button-${hotel.id}`}>
      Favorite {hotel.name}
    </button>
  ),
}));

describe("src/components/HotelList.tsx", () => {
  const mockHotels: Hotel[] = [
    {
      id: "1",
      name: "仙台グランホテル",
      minCharge: 8500,
      address: "宮城県仙台市青葉区",
      access: "仙台駅徒歩3分",
      imageUrl: "https://example.com/hotel1.jpg",
      rakutenUrl: "https://example.com/hotel1",
    },
    {
      id: "2",
      name: "仙台ビジネスイン",
      minCharge: 4200,
      address: "宮城県仙台市宮城野区",
      access: "仙台駅徒歩10分",
      imageUrl: "https://example.com/hotel2.jpg",
      rakutenUrl: "https://example.com/hotel2",
    },
  ];

  test("【TC-HL-01】お気に入りボタンの表示: ホテルカードを描画した際、各カード内に FavoriteButton が正常に表示・レンダリングされること", () => {
    render(<HotelList hotels={mockHotels} isLoading={false} />);

    // カードの描画確認
    expect(screen.getByTestId("hotel-card-1")).toBeInTheDocument();
    expect(screen.getByTestId("hotel-card-2")).toBeInTheDocument();

    // ホテル名・料金の描画確認
    expect(screen.getByText("仙台グランホテル")).toBeInTheDocument();
    expect(screen.getByText("仙台ビジネスイン")).toBeInTheDocument();
    expect(screen.getByText("¥8,500〜")).toBeInTheDocument();
    expect(screen.getByText("¥4,200〜")).toBeInTheDocument();

    // 各カード内にお気に入りボタン（FavoriteButton）が存在すること
    expect(screen.getByTestId("favorite-button-1")).toBeInTheDocument();
    expect(screen.getByTestId("favorite-button-2")).toBeInTheDocument();

    // 楽天トラベルリンク確認
    const links = screen.getAllByRole("link", { name: "楽天トラベルで見る" });
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "https://example.com/hotel1");
  });

  test("【TC-HL-02】0件時・ローディング表示: isLoading={true} または hotels=[] の場合、スケルトンUI またはメッセージが表示されること", () => {
    // パターンA: isLoading={true} の場合にスケルトンが表示され、カードが表示されないこと
    const { rerender } = render(<HotelList hotels={[]} isLoading={true} />);
    expect(screen.queryByTestId("hotel-card-1")).not.toBeInTheDocument();
    expect(
      screen.queryByText("該当するホテルが見つかりませんでした。"),
    ).not.toBeInTheDocument();

    // パターンB: hotels=[] かつ isLoading={false} の場合に 0件メッセージが表示されること
    rerender(<HotelList hotels={[]} isLoading={false} />);
    expect(
      screen.getByText("該当するホテルが見つかりませんでした。"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "検索条件（エリア・日付・金額など）を変更して再度お試しください。",
      ),
    ).toBeInTheDocument();
  });

  // TC-LS-01: ホテル名から詳細ページへ遷移できる
  test("TC-LS-01: ホテル名から詳細ページへ遷移できる", () => {
    render(<HotelList hotels={mockHotels} isLoading={false} />);

    expect(
      screen.getByRole("link", { name: "仙台グランホテル" }),
    ).toHaveAttribute("href", "/hotels/1");

    expect(
      screen.getByRole("link", { name: "仙台ビジネスイン" }),
    ).toHaveAttribute("href", "/hotels/2");
  });

  // TC-LS-02: ホテルごとに正しい詳細ページURLが設定される
  test("TC-LS-02: ホテルごとに正しい詳細ページURLが設定される", () => {
    render(<HotelList hotels={mockHotels} isLoading={false} />);

    expect(
      screen.getByTestId("hotel-card-1").querySelector('a[href="/hotels/1"]'),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("hotel-card-2").querySelector('a[href="/hotels/2"]'),
    ).toBeInTheDocument();
  });

  // TC-LS-03: 楽天トラベルへのリンク属性が正しい
  test("TC-LS-03: 楽天トラベルへのリンク属性が正しい", () => {
    render(<HotelList hotels={mockHotels} isLoading={false} />);

    const rakutenLinks = screen.getAllByRole("link", {
      name: "楽天トラベルで見る",
    });
    expect(rakutenLinks).toHaveLength(2);

    // 1件目
    expect(rakutenLinks[0]).toHaveAttribute(
      "href",
      "https://example.com/hotel1",
    );
    expect(rakutenLinks[0]).toHaveAttribute("target", "_blank");
    expect(rakutenLinks[0]).toHaveAttribute("rel", "noopener noreferrer");

    // 2件目
    expect(rakutenLinks[1]).toHaveAttribute(
      "href",
      "https://example.com/hotel2",
    );
  });

  // TC-LS-04: お気に入りボタンがホテルごとに表示される
  test("TC-LS-04: お気に入りボタンがホテルごとに表示される", () => {
    render(<HotelList hotels={mockHotels} isLoading={false} />);

    expect(screen.getByTestId("favorite-button-1")).toBeInTheDocument();
    expect(screen.getByTestId("favorite-button-2")).toBeInTheDocument();

    // 各カード内に1つずつ存在すること
    const card1 = screen.getByTestId("hotel-card-1");
    const card2 = screen.getByTestId("hotel-card-2");
    expect(
      card1.querySelector('[data-testid^="favorite-button-"]'),
    ).not.toBeNull();
    expect(
      card2.querySelector('[data-testid^="favorite-button-"]'),
    ).not.toBeNull();
  });

  // TC-LS-05: 検索結果が0件の場合は案内を表示する
  test("TC-LS-05: 検索結果が0件の場合は案内を表示する", () => {
    render(<HotelList hotels={[]} isLoading={false} />);

    expect(
      screen.getByText("該当するホテルが見つかりませんでした。"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "検索条件（エリア・日付・金額など）を変更して再度お試しください。",
      ),
    ).toBeInTheDocument();
  });

  // TC-LS-06: 読み込み中はローディング表示になる
  test("TC-LS-06: 読み込み中はローディング表示になる", () => {
    const { container } = render(<HotelList hotels={[]} isLoading={true} />);

    // スケルトンUI（animate-pulse）が表示される
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();

    // 0件メッセージは表示されない
    expect(
      screen.queryByText("該当するホテルが見つかりませんでした。"),
    ).not.toBeInTheDocument();

    // カードも表示されない
    expect(screen.queryByTestId("hotel-card-1")).not.toBeInTheDocument();
  });
});
