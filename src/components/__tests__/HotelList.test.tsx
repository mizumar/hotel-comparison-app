import { render, screen } from "@testing-library/react";
import { HotelList } from "../HotelList";
import { Hotel } from "@/src/types/hotel";

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

  // 【3-3】 カードレンダリング
  it("[3-3] 渡された hotels 配列の要素数ぶんカードが表示され、金額や情報が描画されること", () => {
    render(<HotelList hotels={mockHotels} />);

    // ホテル名が表示されているか
    expect(screen.getByText("仙台グランホテル")).toBeInTheDocument();
    expect(screen.getByText("仙台ビジネスイン")).toBeInTheDocument();

    // 最安料金の表示フォーマット確認
    expect(screen.getByText("¥8,500")).toBeInTheDocument();
    expect(screen.getByText("¥4,200")).toBeInTheDocument();

    // リンクボタンの有無
    const links = screen.getAllByRole("link", { name: "楽天トラベルで見る" });
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "https://example.com/hotel1");
    expect(links[1]).toHaveAttribute("href", "https://example.com/hotel2");
  });
});
