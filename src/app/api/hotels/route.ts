import { NextResponse } from "next/server";
import { searchHotelsByKeyword, searchVacantHotels } from "@/src/lib/rakuten";
import { Hotel } from "@/src/types/hotel";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // パラメータ取得
  const keyword = searchParams.get("keyword") || undefined;
  const middleClassCode = searchParams.get("middleClassCode") || undefined;
  const smallClassCode = searchParams.get("smallClassCode") || undefined;
  const checkinDate = searchParams.get("checkinDate") || undefined;
  const checkoutDate = searchParams.get("checkoutDate") || undefined;
  const adultNumParam = searchParams.get("adultNum");
  const adultNum = adultNumParam ? Number(adultNumParam) : undefined;

  // バリデーションチェック（どちらの検索条件も満たしていない場合）
  if (!keyword && (!checkinDate || !checkoutDate)) {
    return NextResponse.json(
      {
        error:
          "検索キーワード、または日程（チェックイン・チェックアウト日）を指定してください。",
      },
      { status: 400 },
    );
  }

  try {
    let hotels: Hotel[] = [];

    if (keyword) {
      // 1. キーワード検索
      hotels = await searchHotelsByKeyword(keyword);
    } else {
      // 2. 空室検索
      hotels = await searchVacantHotels({
        largeClassCode: "japan",
        middleClassCode: middleClassCode || "tokyo",
        smallClassCode: smallClassCode || "tokyo",
        checkinDate,
        checkoutDate,
        adultNum,
      });
    }

    return NextResponse.json({ hotels });
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: error.message || "ホテル情報の取得に失敗しました。" },
      { status: 500 },
    );
  }
}
