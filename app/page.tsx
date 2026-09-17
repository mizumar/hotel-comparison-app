import { searchHotels } from "@/src/lib/rakuten/search";

export default async function HomePage() {
  // テストとして「東京」で検索
  const hotels = await searchHotels("東京");

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">楽天トラベル API 導通テスト</h1>
      <div className="space-y-4">
        {hotels.slice(0, 8).map((hotel) => (
          <div key={hotel.id} className="border p-4 rounded shadow-sm">
            <h2 className="font-bold text-lg">{hotel.name}</h2>
            <p className="text-sm text-gray-600">{hotel.address}</p>
            <p className="text-sm font-semibold mt-2">
              最安料金:{" "}
              {hotel.minCharge
                ? `${hotel.minCharge.toLocaleString()}円〜`
                : "情報なし"}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
