"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HeartIcon, BuildingsIcon } from "@phosphor-icons/react";
import { useFavoriteStore } from "@/src/stores/useFavoriteStore";

export function Header() {
  const favorites = useFavoriteStore((state) => state.favorites);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-5xl h-16 flex items-center justify-between">
        {/* ロゴ / トップへのリンク */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-gray-900 hover:opacity-80 transition-opacity"
          aria-label="ホームへ戻る"
        >
          <BuildingsIcon size={28} className="text-blue-600" />
          <span>ホテル検索</span>
        </Link>

        {/* お気に入りページへのナビゲーション */}
        <nav>
          <Link
            href="/favorites"
            className="flex items-center gap-1 p-2.5 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="お気に入り一覧を見る"
          >
            <HeartIcon size={24} weight="fill" className="text-red-500" />
            {/* Clientマウント後かつ1件以上の場合に上付き文字風に表示 */}
            {isMounted && favorites.length > 0 && (
              <span className="text-xs font-bold text-gray-800 leading-none -translate-y-1">
                {favorites.length > 99 ? "99+" : favorites.length}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
