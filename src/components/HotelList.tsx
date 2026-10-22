"use client";

import Link from "next/link";
import { Hotel } from "@/src/types/hotel";
import { FavoriteButton } from "@/src/components/FavoriteButton";
import { MapPinLineIcon } from "@phosphor-icons/react";

interface HotelListProps {
  hotels: Hotel[];
  isLoading: boolean;
}
/**
 * 検索結果のホテル一覧を表示するコンポーネント
 */
export function HotelList({ hotels, isLoading }: HotelListProps) {
  // 1. ローディング中の表示（スケルトン UI）
  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto my-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm animate-pulse flex flex-col sm:flex-row"
          >
            <div className="w-full sm:w-48 h-48 bg-gray-200 shrink-0" />
            <div className="p-4 flex-1 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="pt-4 flex justify-between items-center">
                <div className="h-6 bg-gray-200 rounded w-24" />
                <div className="h-8 bg-gray-200 rounded w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 2. 検索結果が0件の場合の表示
  if (hotels.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto my-12 p-8 text-center bg-white rounded-xl border border-gray-200 shadow-sm">
        <p className="text-gray-500 font-medium">
          該当するホテルが見つかりませんでした。
        </p>
        <p className="text-sm text-gray-400 mt-1">
          検索条件（エリア・日付・金額など）を変更して再度お試しください。
        </p>
      </div>
    );
  }

  // 3. ホテル一覧表示
  return (
    <div className="w-full max-w-5xl mx-auto my-8">
      <p className="text-sm text-gray-600 mb-4 font-medium">
        検索結果:{" "}
        <span className="text-blue-600 font-bold text-base">
          {hotels.length}
        </span>{" "}
        件のホテルが見つかりました
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            data-testid={`hotel-card-${hotel.id}`}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row relative"
          >
            {/* ホテル画像 ＆ お気に入りボタン */}
            <div className="w-full sm:w-48 h-48 bg-gray-100 shrink-0 relative overflow-hidden">
              {hotel.imageUrl ? (
                <img
                  src={hotel.imageUrl}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                  画像なし
                </div>
              )}

              {/* お気に入りボタン（画像右上） */}
              <div className="absolute top-2 right-2 z-10">
                <FavoriteButton hotel={hotel} />
              </div>
            </div>

            {/* ホテル詳細情報 */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-base line-clamp-2 mb-1">
                  <Link
                    href={`/hotels/${hotel.id}`}
                    className="hover:underline"
                  >
                    {hotel.name}
                  </Link>
                </h3>
                {hotel.address && (
                  <p className="mb-2 flex min-w-0 items-center justify-left gap-1 text-center text-xs text-gray-500">
                    <MapPinLineIcon className="shrink-0" />
                    <span className="line-clamp-1">{hotel.address}</span>
                  </p>
                )}
                {hotel.access && (
                  <p className="text-xs text-gray-600 line-clamp-2 bg-gray-50 p-2 rounded">
                    {hotel.access}
                  </p>
                )}
              </div>

              {/* 料金＆大きめの CTA ボタン */}
              <div className="pt-3 border-t border-gray-100 mt-3 flex items-end justify-between gap-2">
                <div>
                  <span className="text-xs text-gray-500 block">
                    最安料金 / 人
                  </span>
                  <p className="text-lg font-bold text-blue-600">
                    {hotel.minCharge > 0
                      ? `¥${hotel.minCharge.toLocaleString()}〜`
                      : "料金情報なし"}
                  </p>
                </div>

                {/* 前バージョンより少し大きめの CTA ボタン */}
                {hotel.rakutenUrl && (
                  <a
                    href={hotel.rakutenUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors inline-flex items-center shrink-0 shadow-sm"
                  >
                    楽天トラベルで見る
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
