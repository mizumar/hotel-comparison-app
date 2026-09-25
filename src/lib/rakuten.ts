import { Hotel } from "@/src/types/hotel";

export async function searchHotels(keyword: string): Promise<Hotel[]> {
  const appId = process.env.RAKUTEN_APPLICATION_ID;
  const accessKey = process.env.RAKUTEN_ACCESS_KEY;
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://hotel-comparison-app.vercel.app/";

  if (!appId || !accessKey) {
    throw new Error("RAKUTEN_APPLICATION_ID or RAKUTEN_ACCESS_KEY is not set");
  }

  // 最新の OpenAPI エンドポイント
  const endpoint =
    "https://openapi.rakuten.co.jp/engine/api/Travel/KeywordHotelSearch/20260731";

  const params = new URLSearchParams({
    applicationId: appId.trim(),
    accessKey: accessKey.trim(),
    format: "json",
    keyword: keyword.trim(),
  });

  const res = await fetch(`${endpoint}?${params.toString()}`, {
    headers: {
      Referer: appUrl,
      Origin: appUrl,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("楽天APIエラー詳細 (Raw):", errorText);
    throw new Error(`Failed to fetch hotels: ${res.status}`);
  }

  const data = await res.json();
  if (!data.hotels) return [];

  return data.hotels.map((item: any) => {
    const basicInfo = item.hotel[0].hotelBasicInfo;
    return {
      id: String(basicInfo.hotelNo),
      name: basicInfo.hotelName,
      minCharge: basicInfo.hotelMinCharge || 0,
      address: `${basicInfo.address1 || ""}${basicInfo.address2 || ""}`,
      access: basicInfo.access || "",
      imageUrl: basicInfo.hotelImageUrl || basicInfo.roomImageUrl || "",
      rakutenUrl: basicInfo.hotelInformationUrl || basicInfo.planListUrl || "#",
    };
  });
}
