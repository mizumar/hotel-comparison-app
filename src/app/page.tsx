"use client";

import { useState } from "react";
import { SearchForm } from "@/src/components/SearchForm";
import { HotelList } from "@/src/components/HotelList";
import { Hotel } from "@/src/types/hotel";

export default function Home() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (keyword: string) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const res = await fetch(
        `/api/hotels?keyword=${encodeURIComponent(keyword)}`,
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "ホテルデータの取得に失敗しました。");
      }

      setHotels(data.hotels || []);
    } catch (err: any) {
      setError(err.message || "エラーが発生しました。");
      setHotels([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          ホテル検索
        </h1>
        <p className="text-gray-600">
          キーワードで全国のホテル・宿を検索できます
        </p>
      </div>

      <SearchForm onSearch={handleSearch} isLoading={isLoading} />

      {error && (
        <div className="max-w-xl mx-auto my-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center">
          {error}
        </div>
      )}

      {!isLoading && hasSearched && hotels.length === 0 && !error && (
        <p className="text-center text-gray-500 my-12">
          該当するホテルが見つかりませんでした。別のキーワードでお試しください。
        </p>
      )}

      <HotelList hotels={hotels} />
    </main>
  );
}
