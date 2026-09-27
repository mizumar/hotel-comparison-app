import { Hotel, SearchParams } from "@/src/types/hotel";
import { customFetch } from "@/src/lib/fetcher";

// レスポンス整形ヘルパー
function transformRakutenHotelData(apiResponse: any): Hotel[] {
  if (!apiResponse.hotels || !Array.isArray(apiResponse.hotels)) {
    return [];
  }

  return apiResponse.hotels.map((item: any) => {
    const info = item.hotel[0].hotelBasicInfo;
    return {
      id: String(info.hotelNo),
      name: info.hotelName,
      minCharge: info.hotelMinCharge ?? 0,
      address: `${info.address1 || ""}${info.address2 || ""}`,
      access: info.access || "",
      imageUrl: info.hotelImageUrl || "",
      rakutenUrl: info.hotelInformationUrl || "",
    };
  });
}

// キーワード検索 API 呼び出し
export async function searchHotelsByKeyword(keyword: string): Promise<Hotel[]> {
  const appId = process.env.RAKUTEN_APPLICATION_ID;
  const accessKey = process.env.RAKUTEN_ACCESS_KEY;

  if (!appId || !accessKey) {
    throw new Error("RAKUTEN_APPLICATION_ID or RAKUTEN_ACCESS_KEY is not set");
  }

  const endpoint =
    "https://openapi.rakuten.co.jp/engine/api/Travel/KeywordHotelSearch/20260731";

  const params = new URLSearchParams({
    applicationId: appId.trim(),
    accessKey: accessKey.trim(),
    format: "json",
    keyword: keyword.trim(),
  });

  const res = await customFetch(endpoint, params);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error_description || "キーワード検索に失敗しました。");
  }

  return transformRakutenHotelData(data);
}

// 空室検索 API 呼び出し
export async function searchVacantHotels(
  searchParams: SearchParams,
): Promise<Hotel[]> {
  const appId = process.env.RAKUTEN_APPLICATION_ID;
  const accessKey = process.env.RAKUTEN_ACCESS_KEY;

  if (!appId || !accessKey) {
    throw new Error("RAKUTEN_APPLICATION_ID or RAKUTEN_ACCESS_KEY is not set");
  }

  const endpoint =
    "https://openapi.rakuten.co.jp/engine/api/Travel/VacantHotelSearch/20170426";

  const params = new URLSearchParams({
    applicationId: appId.trim(),
    accessKey: accessKey.trim(),
    format: "json",
    largeClassCode: searchParams.largeClassCode || "japan",
    middleClassCode: searchParams.middleClassCode || "kyoto",
    smallClassCode: searchParams.smallClassCode || "kyoto", // ← 追加
    checkinDate: searchParams.checkinDate || "",
    checkoutDate: searchParams.checkoutDate || "",
    adultNum: String(searchParams.adultNum || 2),
  });

  const res = await customFetch(endpoint, params);
  const data = await res.json();

  if (!res.ok) {
    // 🔍 楽天 API から返ってきたエラーメッセージの詳細をターミナルに出力
    console.error("Rakuten API Error Response:", JSON.stringify(data, null, 2));
    throw new Error(
      data.error_description || data.error || "空室検索に失敗しました。",
    );
  }

  return transformRakutenHotelData(data);
}
