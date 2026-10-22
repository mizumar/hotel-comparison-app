import {
  Hotel,
  HotelDetail,
  HotelRatingInfo,
  SearchParams,
} from "@/src/types/hotel";
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

  // 料金・ソートパラメータの追加
  if (searchParams.minCharge) {
    params.append("minCharge", String(searchParams.minCharge));
  }
  if (searchParams.maxCharge) {
    params.append("maxCharge", String(searchParams.maxCharge));
  }
  if (searchParams.sort) {
    params.append("sort", searchParams.sort);
  }

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

/** 施設情報APIのレスポンスをアプリ用の型に変換する */
function transformRakutenHotelDetailData(apiResponse: any): HotelDetail | null {
  const hotelItems = apiResponse.hotels?.[0]?.hotel;

  if (!Array.isArray(hotelItems)) {
    return null;
  }

  const info = hotelItems.find(
    (item: any) => item.hotelBasicInfo,
  )?.hotelBasicInfo;

  if (!info) {
    return null;
  }

  const rating = hotelItems.find(
    (item: any) => item.hotelRatingInfo,
  )?.hotelRatingInfo;

  const ratingInfo: HotelRatingInfo | null = rating
    ? {
        serviceAverage: rating.serviceAverage,
        locationAverage: rating.locationAverage,
        roomAverage: rating.roomAverage,
        equipmentAverage: rating.equipmentAverage,
        bathAverage: rating.bathAverage,
        breakfastAverage: rating.breakfastAverage,
        dinnerAverage: rating.dinnerAverage,
        cleanlinessAverage: rating.cleanlinessAverage,
      }
    : null;

  return {
    // 一覧用のHotelと共通する情報
    id: String(info.hotelNo),
    name: info.hotelName,
    minCharge: info.hotelMinCharge ?? 0,
    address: `${info.address1 || ""}${info.address2 || ""}`,
    access: info.access || "",
    imageUrl: info.hotelImageUrl || "",
    rakutenUrl: info.hotelInformationUrl || "",

    // 施設情報
    hotelKanaName: info.hotelKanaName || "",
    hotelSpecial: info.hotelSpecial || "",
    postalCode: info.postalCode || "",
    telephoneNo: info.telephoneNo || "",
    faxNo: info.faxNo || "",
    parkingInformation: info.parkingInformation || "",
    nearestStation: info.nearestStation || "",

    // 緯度・経度
    latitude: info.latitude,
    longitude: info.longitude,

    // 施設・客室・地図の画像とリンク
    planListUrl: info.planListUrl || "",
    dpPlanListUrl: info.dpPlanListUrl || "",
    reviewUrl: info.reviewUrl || "",
    hotelThumbnailUrl: info.hotelThumbnailUrl || "",
    roomImageUrl: info.roomImageUrl || "",
    roomThumbnailUrl: info.roomThumbnailUrl || "",
    hotelMapImageUrl: info.hotelMapImageUrl || "",

    // 口コミ情報
    reviewCount: info.reviewCount ?? null,
    reviewAverage: info.reviewAverage ?? null,
    userReview: info.userReview ?? null,

    // 評価の内訳
    ratingInfo,
  };
}

/** ホテル番号を指定して楽天トラベルの施設情報を取得する */
export async function getHotelDetail(
  hotelNo: string,
): Promise<HotelDetail | null> {
  const appId = process.env.RAKUTEN_APPLICATION_ID;
  const accessKey = process.env.RAKUTEN_ACCESS_KEY;

  if (!appId || !accessKey) {
    throw new Error("RAKUTEN_APPLICATION_ID or RAKUTEN_ACCESS_KEY is not set");
  }

  const endpoint =
    "https://openapi.rakuten.co.jp/engine/api/Travel/HotelDetailSearch/20260731";

  const params = new URLSearchParams({
    applicationId: appId.trim(),
    accessKey: accessKey.trim(),
    format: "json",
    responseType: "large",
    hotelNo: hotelNo,
  });

  const res = await customFetch(endpoint, params);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.error_description || data.error || "施設情報の取得に失敗しました。",
    );
  }

  return transformRakutenHotelDetailData(data);
}
