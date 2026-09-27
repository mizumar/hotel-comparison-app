import { Hotel } from "@/src/types/hotel";
import { FavoriteButton } from "@/src/components/FavoriteButton";

interface HotelListProps {
  hotels: Hotel[];
}

export function HotelList({ hotels }: HotelListProps) {
  if (hotels.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto my-8">
      {hotels.map((hotel) => (
        <div
          key={hotel.id}
          className="border rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col bg-white"
        >
          {hotel.imageUrl && (
            <img
              src={hotel.imageUrl}
              alt={hotel.name}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                  {hotel.name}
                </h3>

                {/* お気に入りボタン */}
                <FavoriteButton hotel={hotel} />
              </div>

              <p className="text-sm text-gray-600 mb-1">{hotel.address}</p>

              <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                {hotel.access}
              </p>
            </div>
            <div>
              <div className="text-right mb-3">
                <span className="text-xs text-gray-500">最安料金 / 人〜</span>
                <p className="text-xl font-extrabold text-red-600">
                  ¥{hotel.minCharge.toLocaleString()}
                </p>
              </div>
              <a
                href={hotel.rakutenUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center w-full py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg text-sm transition-colors"
              >
                楽天トラベルで見る
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
