import { render, screen } from "@testing-library/react";
import HotelDetailPage from "@/src/app/hotels/[id]/page";
import { notFound } from "next/navigation";

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

const mockHotel = {
  id: "123456",
  name: "テストホテル",
  minCharge: 12000,
  address: "東京都千代田区",
  access: "東京駅から徒歩5分",
  imageUrl: "https://example.com/hotel.jpg",
  rakutenUrl: "https://example.com/hotel",
  hotelKanaName: "テストホテル",
  hotelSpecial: "駅から徒歩5分",
  postalCode: "100-0001",
  telephoneNo: "03-1234-5678",
  faxNo: "03-1234-5679",
  parkingInformation: "駐車場あり",
  nearestStation: "東京駅",
  latitude: 128281.11,
  longitude: 503573.28,
  planListUrl: "https://example.com/plans",
  dpPlanListUrl: "https://example.com/dp-plans",
  reviewUrl: "https://example.com/reviews",
  hotelThumbnailUrl: "https://example.com/thumb.jpg",
  roomImageUrl: "https://example.com/room.jpg",
  roomThumbnailUrl: "https://example.com/room-thumb.jpg",
  hotelMapImageUrl: "https://example.com/map.jpg",
  reviewCount: 100,
  reviewAverage: 4.5,
  userReview: "快適なホテルでした。",
  ratingInfo: {
    serviceAverage: 4.5,
    locationAverage: 4.6,
    roomAverage: 4.4,
    equipmentAverage: 4.3,
    bathAverage: 4.2,
    breakfastAverage: 4.1,
    dinnerAverage: 4.0,
    cleanlinessAverage: 4.7,
  },
};

const mockedNotFound = jest.mocked(notFound);

function mockFetch(body: unknown, status = 200) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: jest.fn().mockResolvedValue(body),
  });
}

async function renderPage(id = "123456") {
  const element = await HotelDetailPage({
    params: Promise.resolve({ id }),
  });

  return render(element);
}

describe("HotelDetailPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_BASE_URL = "http://localhost:3000";
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("TC-PG-01: ホテルの基本情報を表示する", async () => {
    mockFetch({ hotel: mockHotel });

    await renderPage();

    expect(
      screen.getByRole("heading", { name: "テストホテル" }),
    ).toBeInTheDocument();

    expect(screen.getByText("東京都千代田区")).toBeInTheDocument();
    expect(screen.getByText("東京駅から徒歩5分")).toBeInTheDocument();
  });

  test("TC-PG-02: 口コミと評価情報を表示する", async () => {
    mockFetch({ hotel: mockHotel });

    await renderPage();

    expect(screen.getByText("快適なホテルでした。")).toBeInTheDocument();
    const reviewSection = screen.getByText(/口コミ評価/).closest("div")!;
    // もしくは heading から親をたどる
    expect(reviewSection).toHaveTextContent("4.50");
    expect(reviewSection).toHaveTextContent("100");
  });

  test("TC-PG-03: 施設画像が設定されている場合に表示する", async () => {
    mockFetch({ hotel: mockHotel });

    const { container } = await renderPage();

    // 画像のalt文言はページの実装に合わせて確認する
    expect(
      container.querySelector('img[src="https://example.com/room.jpg"]'),
    ).toBeInTheDocument();
  });

  test("TC-PG-04: 任意項目が欠損していても表示できる", async () => {
    const hotelWithoutOptionalInfo = {
      ...mockHotel,
      hotelSpecial: "",
      roomImageUrl: "",
      hotelMapImageUrl: "",
      reviewCount: null,
      reviewAverage: null,
      userReview: null,
      ratingInfo: null,
    };

    mockFetch({ hotel: hotelWithoutOptionalInfo });

    await expect(renderPage()).resolves.toBeDefined();

    expect(
      screen.getByRole("heading", { name: "テストホテル" }),
    ).toBeInTheDocument();
  });

  test("TC-PG-05: 口コミのHTMLタグが実行されない", async () => {
    const hotelWithHtmlReview = {
      ...mockHotel,
      userReview: '<img src="x" onerror="alert(1)">口コミ本文',
    };

    mockFetch({ hotel: hotelWithHtmlReview });

    const { container } = await renderPage();

    expect(container.querySelector("[onerror]")).not.toBeInTheDocument();
    expect(screen.getByText(/口コミ本文/)).toBeInTheDocument();
  });

  test("TC-PG-06: 数字以外を含むIDはNot Foundになる", async () => {
    await expect(renderPage("abc")).rejects.toThrow("NEXT_NOT_FOUND");

    expect(mockedNotFound).toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("TC-PG-07: APIが404を返すとNot Foundになる", async () => {
    mockFetch({ error: "ホテルが見つかりませんでした。" }, 404);

    await expect(renderPage()).rejects.toThrow("NEXT_NOT_FOUND");

    expect(mockedNotFound).toHaveBeenCalled();
  });

  test("TC-PG-08: APIがその他のエラーを返した場合は例外になる", async () => {
    mockFetch({ error: "API error" }, 500);

    await expect(renderPage()).rejects.toThrow();
  });
});
