/**
 * @jest-environment node
 */
import { GET } from "../route";

// searchHotels ロジックをモック化
jest.mock("@/src/lib/rakuten", () => ({
  searchHotels: jest.fn(),
}));

import { searchHotels } from "@/src/lib/rakuten";

describe("src/app/api/hotels/route.ts - GET", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 【2-1】 パラメータ未指定エラー
  it("[2-1] keyword パラメータなしでリクエストした時にステータス 400 が返ること", async () => {
    const req = new Request("http://localhost:3000/api/hotels");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("検索キーワードが指定されていません。");
  });

  // 【2-2】 正常応答
  it("[2-2] keyword=仙台 でリクエストした時にステータス 200 とホテル一覧が返ること", async () => {
    const mockHotels = [
      {
        id: "100",
        name: "サンプルホテル",
        minCharge: 4000,
        address: "東京都",
        access: "東京駅1分",
        imageUrl: "http://example.com/a.jpg",
        rakutenUrl: "http://example.com/a",
      },
    ];

    (searchHotels as jest.Mock).mockResolvedValueOnce(mockHotels);

    const req = new Request("http://localhost:3000/api/hotels?keyword=仙台");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.hotels).toEqual(mockHotels);
    expect(searchHotels).toHaveBeenCalledWith("仙台");
  });
});
