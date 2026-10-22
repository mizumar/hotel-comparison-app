/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { getHotelDetail } from "@/src/lib/rakuten";
import { GET } from "@/src/app/api/hotels/[id]/route";

jest.mock("@/src/lib/rakuten", () => ({
  getHotelDetail: jest.fn(),
}));

const mockedGetHotelDetail = jest.mocked(getHotelDetail);

describe("GET /api/hotels/[id]", () => {
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
    ratingInfo: null,
  };

  function createRequest(id: string) {
    return new NextRequest(`http://localhost:3000/api/hotels/${id}`);
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("TC-AR-01: 正常時は200とホテル情報を返す", async () => {
    mockedGetHotelDetail.mockResolvedValueOnce(mockHotel);

    const response = await GET(createRequest("123456"), {
      params: Promise.resolve({ id: "123456" }),
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      hotel: mockHotel,
    });
    expect(mockedGetHotelDetail).toHaveBeenCalledWith("123456");
  });

  test("TC-AR-02: 数字以外を含むIDには400を返す", async () => {
    const response = await GET(createRequest("abc"), {
      params: Promise.resolve({ id: "abc" }),
    });

    expect(response.status).toBe(400);
    expect(mockedGetHotelDetail).not.toHaveBeenCalled();
  });

  test("TC-AR-03: 空のIDには400を返す", async () => {
    const response = await GET(createRequest(""), {
      params: Promise.resolve({ id: "" }),
    });

    expect(response.status).toBe(400);
    expect(mockedGetHotelDetail).not.toHaveBeenCalled();
  });

  test("TC-AR-04: ホテルが見つからない場合は404を返す", async () => {
    mockedGetHotelDetail.mockResolvedValueOnce(null);

    const response = await GET(createRequest("999999"), {
      params: Promise.resolve({ id: "999999" }),
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: "ホテルが見つかりませんでした。",
    });
  });

  test("TC-AR-05: 取得処理が例外を投げた場合は500を返す", async () => {
    mockedGetHotelDetail.mockRejectedValueOnce(
      new Error("楽天APIとの通信に失敗しました"),
    );

    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const response = await GET(createRequest("123456"), {
      params: Promise.resolve({ id: "123456" }),
    });

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "楽天APIとの通信に失敗しました",
    });

    consoleError.mockRestore();
  });

  test("TC-AR-06: エラー内容が不明な場合も500を返す", async () => {
    mockedGetHotelDetail.mockRejectedValueOnce("unknown error");

    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const response = await GET(createRequest("123456"), {
      params: Promise.resolve({ id: "123456" }),
    });

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "施設情報の取得に失敗しました。",
    });

    consoleError.mockRestore();
  });
});
