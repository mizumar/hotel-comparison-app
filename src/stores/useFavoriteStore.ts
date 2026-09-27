import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Hotel } from "@/src/types/hotel";

interface FavoriteState {
  favorites: Hotel[];
  addFavorite: (hotel: Hotel) => void;
  removeFavorite: (hotelId: string) => void;
  toggleFavorite: (hotel: Hotel) => void;
  isFavorite: (hotelId: string) => boolean;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],

      // お気に入り追加
      addFavorite: (hotel) =>
        set((state) => ({
          favorites: [...state.favorites, hotel],
        })),

      // お気に入り削除
      removeFavorite: (hotelId) =>
        set((state) => ({
          favorites: state.favorites.filter((h) => h.id !== hotelId),
        })),

      // 追加/削除のトグル処理
      toggleFavorite: (hotel) => {
        const { favorites, addFavorite, removeFavorite } = get();
        const exists = favorites.some((h) => h.id === hotel.id);
        if (exists) {
          removeFavorite(hotel.id);
        } else {
          addFavorite(hotel);
        }
      },

      // お気に入り登録済みかどうかの判定
      isFavorite: (hotelId) => {
        return get().favorites.some((h) => h.id === hotelId);
      },
    }),
    {
      name: "favorite-hotels-storage", // localStorage のキー名
    },
  ),
);
