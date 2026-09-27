import { NextResponse } from "next/server";
import { searchHotelsByKeyword } from "@/src/lib/rakuten";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword") || undefined;

  // キーワードがない場合のエラーハンドリング
  if (!keyword) {
    return NextResponse.json(
      { error: "検索キーワード（エリアや地名、ホテル名）を指定してください。" },
      { status: 400 },
    );
  }

  try {
    const hotels = await searchHotelsByKeyword(keyword);
    return NextResponse.json({ hotels });
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: error.message || "ホテル情報の取得に失敗しました。" },
      { status: 500 },
    );
  }
}
