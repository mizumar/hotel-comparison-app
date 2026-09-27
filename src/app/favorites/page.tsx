"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HeartIcon } from "@phosphor-icons/react";
import { useFavoriteStore } from "@/src/stores/useFavoriteStore";
import { HotelList } from "@/src/components/HotelList";

export default function FavoritesPage() {
  const favorites = useFavoriteStore((state) => state.favorites);
  const [isMounted, setIsMounted] = useState(false);

  // Client側でハイドレーション完了後にフラグを立てる（Hydration Error防止）
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ハイドレーション前（サーバーサイド・初回描画時）
  if (!isMounted) {
    return (
      <main className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <HeartIcon size={28} weight="fill" className="text-red-500" />
            お気に入りホテル一覧
          </h1>
          <div className="text-center py-12 text-gray-400">読み込み中...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <HeartIcon size={28} weight="fill" className="text-red-500" />
            お気に入りホテル一覧
          </h1>
          <span className="text-sm font-medium text-gray-500">
            全 {favorites.length} 件
          </span>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200 p-8">
            <HeartIcon
              size={48}
              weight="regular"
              className="mx-auto text-gray-300 mb-4"
            />
            <p className="text-lg font-medium text-gray-700 mb-2">
              お気に入りのホテルはまだありません
            </p>
            <p className="text-sm text-gray-500 mb-6">
              検索結果画面から気になるホテルのハートアイコンを押して追加してみましょう。
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              ホテルを検索する
            </Link>
          </div>
        ) : (
          <HotelList hotels={favorites} />
        )}
      </div>
    </main>
  );
}
