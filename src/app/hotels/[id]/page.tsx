import { notFound } from "next/navigation";
import type { HotelDetail } from "@/src/types/hotel";

interface HotelDetailPageProps {
  params: Promise<{ id: string }>;
}

/** ホテルの詳細情報を表示するページ */
export default async function HotelDetailPage({
  params,
}: HotelDetailPageProps) {
  const { id } = await params;

  // 不正なホテルIDは詳細ページを表示しない
  if (!/^\d+$/.test(id)) {
    notFound();
  }

  // サーバー側から施設情報を取得
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/hotels/${id}`,
    { cache: "no-store" },
  );

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error("ホテル情報の取得に失敗しました。");
  }

  const data: { hotel: HotelDetail } = await response.json();
  const hotel = data.hotel;

  return (
    <main className=" container mx-auto max-w-5xl px-4 py-8">
      <a href="/" className="mb-6 inline-block text-blue-600 hover:underline">
        ← ホテル一覧へ戻る
      </a>

      <h1 className="mb-4 text-2xl font-bold">{hotel.name}</h1>

      {hotel.hotelSpecial && (
        <p className="mb-6 text-gray-700">{hotel.hotelSpecial}</p>
      )}

      {hotel.imageUrl && (
        <img
          src={hotel.imageUrl}
          alt={hotel.name}
          className="mb-6 w-full max-h-96 rounded-xl object-cover"
        />
      )}

      <section className="mb-8 rounded-xl border p-5">
        <h2 className="mb-4 text-lg font-bold">基本情報</h2>

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-gray-500">住所</dt>
            <dd>{hotel.address || "情報なし"}</dd>
            {hotel.postalCode && <dd>〒{hotel.postalCode}</dd>}
          </div>

          <div>
            <dt className="text-sm text-gray-500">アクセス</dt>
            <dd>{hotel.access || "情報なし"}</dd>
          </div>

          <div>
            <dt className="text-sm text-gray-500">最寄り駅</dt>
            <dd>{hotel.nearestStation || "情報なし"}</dd>
          </div>

          <div>
            <dt className="text-sm text-gray-500">電話番号</dt>
            <dd>{hotel.telephoneNo || "情報なし"}</dd>
          </div>

          <div>
            <dt className="text-sm text-gray-500">駐車場</dt>
            <dd>{hotel.parkingInformation || "情報なし"}</dd>
          </div>

          <div>
            <dt className="text-sm text-gray-500">最安料金</dt>
            <dd>
              {hotel.minCharge > 0
                ? `¥${hotel.minCharge.toLocaleString()}〜`
                : "料金情報なし"}
            </dd>
          </div>
        </dl>
      </section>

      {hotel.roomImageUrl && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-bold">客室画像</h2>
          <img
            src={hotel.roomImageUrl}
            alt={`${hotel.name}の客室`}
            className="w-full max-h-80 rounded-xl object-cover"
          />
        </section>
      )}

      <section className="mb-8 rounded-xl border p-5">
        <h2 className="mb-3 text-lg font-bold">口コミ評価</h2>

        {hotel.reviewAverage !== null ? (
          <p className="text-2xl font-bold">
            ★ {hotel.reviewAverage.toFixed(2)}
            <span className="ml-2 text-sm font-normal text-gray-500">
              （{hotel.reviewCount ?? 0} 件）
            </span>
          </p>
        ) : (
          <p>評価情報なし</p>
        )}

        {hotel.userReview && (
          <p className="mt-4 text-sm leading-7 text-gray-700">
            {hotel.userReview.replace(/<[^>]*>/g, "")}
          </p>
        )}

        {hotel.ratingInfo && (
          <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <dt className="text-sm text-gray-500">サービス</dt>
              <dd>{hotel.ratingInfo.serviceAverage}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">立地</dt>
              <dd>{hotel.ratingInfo.locationAverage}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">部屋</dt>
              <dd>{hotel.ratingInfo.roomAverage}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">清潔さ</dt>
              <dd>{hotel.ratingInfo.cleanlinessAverage}</dd>
            </div>
          </dl>
        )}
      </section>

      {hotel.hotelMapImageUrl && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-bold">施設周辺地図</h2>
          <img
            src={hotel.hotelMapImageUrl}
            alt={`${hotel.name}の地図`}
            className="w-full max-w-xl rounded-xl"
          />
        </section>
      )}

      {hotel.rakutenUrl && (
        <a
          href={hotel.rakutenUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
        >
          楽天トラベルで見る
        </a>
      )}
    </main>
  );
}
