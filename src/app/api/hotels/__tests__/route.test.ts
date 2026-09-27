/**
 * @jest-environment node
 */
import { GET } from "@/src/app/api/hotels/route";
import * as rakutenModule from "@/src/lib/rakuten";

jest.mock("@/src/lib/rakuten");

let consoleSpy: jest.SpyInstance;

beforeEach(() => {
  // console.error の出力を一時的に抑制
  consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
});

describe("GET /api/hotels Route Handler", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // TC-API-01: パラメータなしエラー
  test("TC-API-01: returns 400 when no search parameters are provided", async () => {
    const req = new Request("http://localhost:3000/api/hotels");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe(
      "検索キーワード（エリアや地名、ホテル名）を指定してください。",
    );
  });

  // TC-API-02: キーワード検索
  test("TC-API-02: calls searchHotelsByKeyword and returns 200 with hotels data", async () => {
    const mockHotels = [
      {
        id: "1",
        name: "テストホテル",
        minCharge: 5000,
        address: "東京都",
        access: "駅徒歩1分",
        imageUrl: "http://example.com/img.jpg",
        rakutenUrl: "http://example.com",
      },
    ];

    jest
      .spyOn(rakutenModule, "searchHotelsByKeyword")
      .mockResolvedValue(mockHotels);

    const req = new Request(
      "http://localhost:3000/api/hotels?keyword=%E4%BB%99%E5%8F%B0",
    );
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.hotels).toEqual(mockHotels);
    expect(rakutenModule.searchHotelsByKeyword).toHaveBeenCalledWith("仙台");
  });

  // TC-API-03: 異常系ハンドリング
  test("TC-API-03: returns 500 when Rakuten API throws an error", async () => {
    jest
      .spyOn(rakutenModule, "searchHotelsByKeyword")
      .mockRejectedValue(new Error("API Failure"));

    const req = new Request(
      "http://localhost:3000/api/hotels?keyword=%E4%BB%99%E5%8F%B0",
    );
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe("API Failure");
    // console.error が正しく呼び出されたこと自体を検証
    expect(consoleSpy).toHaveBeenCalledWith(
      "API Route Error:",
      expect.any(Error),
    );
  });
});
