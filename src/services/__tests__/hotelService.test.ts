import { searchHotels } from "../hotelService";
import { SearchParams } from "@/src/types/hotel";

// global.fetch のモック化
global.fetch = jest.fn();

describe("src/services/hotelService.ts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("【TC-SR-01】Service層の独立性: searchHotels() に SearchParams を渡した際、クエリパラメータが正しく構築されホテル配列が返却されること", async () => {
    const mockParams: SearchParams = {
      largeClassCode: "japan",
      middleClassCode: "miyagi",
      smallClassCode: "sendai",
      checkinDate: "2026-10-01",
      checkoutDate: "2026-10-02",
      adultNum: 2,
    };

    const mockResponseData = {
      hotels: [
        {
          id: "1",
          name: "仙台テストホテル",
          minCharge: 7000,
        },
      ],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponseData,
    });

    const result = await searchHotels(mockParams);

    // fetch が正しいエンドポイントとクエリ文字列で呼び出されたか検証
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0];
    expect(calledUrl).toContain("/api/hotels?");
    expect(calledUrl).toContain("middleClassCode=miyagi");
    expect(calledUrl).toContain("checkinDate=2026-10-01");

    // 返却値が期待通りであること
    expect(result).toEqual(mockResponseData.hotels);
  });
});
