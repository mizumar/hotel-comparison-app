import { customFetch } from "@/src/lib/fetcher";
import { getHotelDetail } from "@/src/lib/rakuten";

jest.mock("@/src/lib/fetcher", () => ({
  customFetch: jest.fn(),
}));

const mockedCustomFetch = jest.mocked(customFetch);

describe("getHotelDetail", () => {
  const originalApplicationId = process.env.RAKUTEN_APPLICATION_ID;
  const originalAccessKey = process.env.RAKUTEN_ACCESS_KEY;

  // 楽天APIが返す施設情報のモック
  const mockApiResponse = {
    hotels: [
      {
        hotel: [
          {
            hotelBasicInfo: {
              hotelNo: 123456,
              hotelName: "テストホテル",
              hotelInformationUrl: "https://example.com/hotel",
              planListUrl: "https://example.com/plans",
              dpPlanListUrl: "https://example.com/dp-plans",
              reviewUrl: "https://example.com/reviews",
              hotelKanaName: "テストホテル",
              hotelSpecial: "駅から徒歩5分",
              hotelMinCharge: 12000,
              latitude: 128281.11,
              longitude: 503573.28,
              postalCode: "100-0001",
              address1: "東京都",
              address2: "千代田区",
              telephoneNo: "03-1234-5678",
              faxNo: "03-1234-5679",
              access: "東京駅から徒歩5分",
              parkingInformation: "駐車場あり",
              nearestStation: "東京駅",
              hotelImageUrl: "https://example.com/hotel.jpg",
              hotelThumbnailUrl: "https://example.com/thumb.jpg",
              roomImageUrl: "https://example.com/room.jpg",
              roomThumbnailUrl: "https://example.com/room-thumb.jpg",
              hotelMapImageUrl: "https://example.com/map.jpg",
              reviewCount: 100,
              reviewAverage: 4.5,
              userReview: "快適なホテルでした。",
            },
          },
          {
            hotelRatingInfo: {
              serviceAverage: 4.5,
              locationAverage: 4.6,
              roomAverage: 4.4,
              equipmentAverage: 4.3,
              bathAverage: 4.2,
              breakfastAverage: 4.1,
              dinnerAverage: 4.0,
              cleanlinessAverage: 4.7,
            },
          },
        ],
      },
    ],
  };

  // customFetchが返すレスポンスを作るヘルパー
  function mockResponse(body: unknown, ok = true, status = 200) {
    return {
      ok,
      status,
      json: jest.fn().mockResolvedValue(body),
    } as unknown as Response;
  }

  beforeEach(() => {
    jest.clearAllMocks();

    process.env.RAKUTEN_APPLICATION_ID = "test-application-id";
    process.env.RAKUTEN_ACCESS_KEY = "test-access-key";
  });

  afterAll(() => {
    if (originalApplicationId === undefined) {
      delete process.env.RAKUTEN_APPLICATION_ID;
    } else {
      process.env.RAKUTEN_APPLICATION_ID = originalApplicationId;
    }

    if (originalAccessKey === undefined) {
      delete process.env.RAKUTEN_ACCESS_KEY;
    } else {
      process.env.RAKUTEN_ACCESS_KEY = originalAccessKey;
    }
  });

  test("TC-HD-01: 正常な施設情報を取得できる", async () => {
    mockedCustomFetch.mockResolvedValueOnce(mockResponse(mockApiResponse));

    const result = await getHotelDetail("123456");

    expect(result).not.toBeNull();
    expect(result?.id).toBe("123456");
    expect(result?.name).toBe("テストホテル");
    expect(result?.minCharge).toBe(12000);
  });

  test("TC-HD-02: 基本情報と住所が正しく変換される", async () => {
    mockedCustomFetch.mockResolvedValueOnce(mockResponse(mockApiResponse));

    const result = await getHotelDetail("123456");

    expect(result).toMatchObject({
      id: "123456",
      name: "テストホテル",
      address: "東京都千代田区",
      access: "東京駅から徒歩5分",
      imageUrl: "https://example.com/hotel.jpg",
      rakutenUrl: "https://example.com/hotel",
      postalCode: "100-0001",
      telephoneNo: "03-1234-5678",
      nearestStation: "東京駅",
    });
  });

  test("TC-HD-03: 評価情報が正しく変換される", async () => {
    mockedCustomFetch.mockResolvedValueOnce(mockResponse(mockApiResponse));

    const result = await getHotelDetail("123456");

    expect(result?.ratingInfo).toEqual({
      serviceAverage: 4.5,
      locationAverage: 4.6,
      roomAverage: 4.4,
      equipmentAverage: 4.3,
      bathAverage: 4.2,
      breakfastAverage: 4.1,
      dinnerAverage: 4.0,
      cleanlinessAverage: 4.7,
    });
  });

  test("TC-HD-04: 口コミ情報が欠損している場合はnullになる", async () => {
    const responseWithoutReviews = {
      hotels: [
        {
          hotel: [
            {
              hotelBasicInfo: {
                ...mockApiResponse.hotels[0].hotel[0].hotelBasicInfo,
                reviewCount: undefined,
                reviewAverage: undefined,
                userReview: undefined,
              },
            },
          ],
        },
      ],
    };

    mockedCustomFetch.mockResolvedValueOnce(
      mockResponse(responseWithoutReviews),
    );

    const result = await getHotelDetail("123456");

    expect(result?.reviewCount).toBeNull();
    expect(result?.reviewAverage).toBeNull();
    expect(result?.userReview).toBeNull();
  });

  test("TC-HD-05: 評価情報がない場合はratingInfoがnullになる", async () => {
    const responseWithoutRating = {
      hotels: [
        {
          hotel: [
            {
              hotelBasicInfo: mockApiResponse.hotels[0].hotel[0].hotelBasicInfo,
            },
          ],
        },
      ],
    };

    mockedCustomFetch.mockResolvedValueOnce(
      mockResponse(responseWithoutRating),
    );

    const result = await getHotelDetail("123456");

    expect(result?.ratingInfo).toBeNull();
  });

  test("TC-HD-06: 施設情報がない場合はnullを返す", async () => {
    mockedCustomFetch.mockResolvedValueOnce(mockResponse({ hotels: [] }));

    const result = await getHotelDetail("123456");

    expect(result).toBeNull();
  });

  test("TC-HD-07: 基本情報がない場合はnullを返す", async () => {
    mockedCustomFetch.mockResolvedValueOnce(
      mockResponse({
        hotels: [{ hotel: [{ hotelRatingInfo: {} }] }],
      }),
    );

    const result = await getHotelDetail("123456");

    expect(result).toBeNull();
  });

  test("TC-HD-08: 認証情報が未設定ならエラーになる", async () => {
    delete process.env.RAKUTEN_APPLICATION_ID;

    await expect(getHotelDetail("123456")).rejects.toThrow(
      "RAKUTEN_APPLICATION_ID or RAKUTEN_ACCESS_KEY is not set",
    );

    expect(mockedCustomFetch).not.toHaveBeenCalled();
  });

  test("TC-HD-09: APIエラー時はエラーメッセージを返す", async () => {
    mockedCustomFetch.mockResolvedValueOnce(
      mockResponse({ error_description: "API access denied" }, false, 403),
    );

    await expect(getHotelDetail("123456")).rejects.toThrow("API access denied");
  });

  test("TC-HD-10: 正しいURLとリクエストパラメータを使用する", async () => {
    mockedCustomFetch.mockResolvedValueOnce(mockResponse(mockApiResponse));

    await getHotelDetail("123456");

    expect(mockedCustomFetch).toHaveBeenCalledTimes(1);

    const [endpoint, params] = mockedCustomFetch.mock.calls[0];

    expect(endpoint).toContain("HotelDetailSearch");
    expect(params.get("applicationId")).toBe("test-application-id");
    expect(params.get("accessKey")).toBe("test-access-key");
    expect(params.get("format")).toBe("json");
    expect(params.get("responseType")).toBe("large");
    expect(params.get("hotelNo")).toBe("123456");
  });
});
