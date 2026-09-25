import { Hotel } from "@/src/types/hotel";
import { searchHotels } from "@/src/lib/rakuten";

// fetch のグローバルモック
global.fetch = jest.fn();

describe("src/lib/rakuten.ts - searchHotels", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...ORIGINAL_ENV,
      RAKUTEN_APPLICATION_ID: "dummy_app_id",
      RAKUTEN_ACCESS_KEY: "dummy_access_key",
    };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  // 【1-1】 正常系: ホテル一覧の取得
  it("[1-1] 正常系: 有効なキーワード入力時に Hotel[] 型のオブジェクト配列が返ること", async () => {
    const mockApiResponse = {
      hotels: [
        {
          hotel: [
            {
              hotelBasicInfo: {
                hotelNo: 12345,
                hotelName: "テストホテル仙台",
                hotelMinCharge: 5000,
                address1: "宮城県",
                address2: "仙台市青葉区1-1",
                access: "仙台駅徒歩5分",
                hotelImageUrl: "https://example.com/image.jpg",
                hotelInformationUrl: "https://example.com/hotel/12345",
              },
            },
          ],
        },
      ],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    });

    // searchHotelsFn から searchHotels に変更
    const result = await searchHotels("仙台");

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: "12345",
      name: "テストホテル仙台",
      minCharge: 5000,
      address: "宮城県仙台市青葉区1-1",
      access: "仙台駅徒歩5分",
      imageUrl: "https://example.com/image.jpg",
      rakutenUrl: "https://example.com/hotel/12345",
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(
        "https://openapi.rakuten.co.jp/engine/api/Travel/KeywordHotelSearch/20260731",
      ),
      expect.any(Object),
    );
  });

  // 【1-2】 正常系: 検索結果 0 件時
  it("[1-2] 正常系: 該当なしのレスポンス（hotelsなし）の時に空配列（[]）が返ること", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    const result = await searchHotels("存在しないホテル名");
    expect(result).toEqual([]);
  });

  // 【1-3】 異常系: 環境変数未設定
  it("[1-3] 異常系: RAKUTEN_APPLICATION_ID または RAKUTEN_ACCESS_KEY が未設定の時エラーがスローされること", async () => {
    delete process.env.RAKUTEN_APPLICATION_ID;

    await expect(searchHotels("仙台")).rejects.toThrow(
      "RAKUTEN_APPLICATION_ID or RAKUTEN_ACCESS_KEY is not set",
    );
  });

  // 【1-4】 異常系: API エラーレスポンス
  it("[1-4] 異常系: 楽天 API が 400 / 500 エラーを返した時にエラーがスローされること", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => "Internal Server Error",
    });

    await expect(searchHotels("仙台")).rejects.toThrow(
      "Failed to fetch hotels: 500",
    );
  });
});
