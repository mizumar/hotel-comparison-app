"use client";

import { HeartIcon } from "@phosphor-icons/react";
import { useFavoriteStore } from "@/src/stores/useFavoriteStore";
import { Hotel } from "@/src/types/hotel";

interface FavoriteButtonProps {
  hotel: Hotel;
}

export function FavoriteButton({ hotel }: FavoriteButtonProps) {
  const favorites = useFavoriteStore((state) => state.favorites);
  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);
  const isFavorite = useFavoriteStore((state) => state.isFavorite);

  // お気に入り登録済みかどうかを判定
  const isFav = isFavorite(hotel.id);

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(hotel)}
      className={`inline-flex items-center gap-1.5 px-2 py-2 rounded-full text-sm font-medium transition-colors ${
        isFav
          ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
          : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
      }`}
      aria-label={isFav ? "お気に入りから削除" : "お気に入りに追加"}
    >
      <HeartIcon
        size={18}
        weight={isFav ? "fill" : "regular"}
        className={isFav ? "text-red-500" : "text-gray-400"}
      />
    </button>
  );
}
