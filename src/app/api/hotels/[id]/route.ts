import { NextResponse } from "next/server";
import { getHotelDetail } from "@/src/lib/rakuten";

/** ホテルIDを指定して施設情報を返すAPI */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // 不正なホテルIDを楽天APIへ送らない
  if (!/^\d+$/.test(id)) {
    return NextResponse.json(
      { error: "ホテルIDが正しくありません。" },
      { status: 400 },
    );
  }

  try {
    const hotel = await getHotelDetail(id);

    // 指定されたホテルが見つからない場合
    if (!hotel) {
      return NextResponse.json(
        { error: "ホテルが見つかりませんでした。" },
        { status: 404 },
      );
    }

    return NextResponse.json({ hotel });
  } catch (error: unknown) {
    console.error("Hotel Detail API Error:", error);

    const message =
      error instanceof Error ? error.message : "施設情報の取得に失敗しました。";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
