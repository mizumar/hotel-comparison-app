import { NextResponse } from "next/server";
import { searchHotels } from "@/src/lib/rakuten";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword");

  if (!keyword) {
    return NextResponse.json(
      { error: "検索キーワードが指定されていません。" },
      { status: 400 },
    );
  }

  try {
    const hotels = await searchHotels(keyword);
    return NextResponse.json({ hotels });
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: error.message || "ホテル情報の取得に失敗しました。" },
      { status: 500 },
    );
  }
}
