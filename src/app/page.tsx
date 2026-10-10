"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchForm } from "@/src/components/SearchForm";
import { HotelList } from "@/src/components/HotelList";
import { Hotel, SearchParams } from "@/src/types/hotel";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // URL のクエリパラメータから SearchParams オブジェクトを抽出
  const getSearchParamsFromUrl = useCallback((): SearchParams => {
    const keyword = searchParams.get("keyword") || undefined;
    const middleClassCode = searchParams.get("middleClassCode") || undefined;
    const smallClassCode = searchParams.get("smallClassCode") || undefined;
    const checkinDate = searchParams.get("checkinDate") || undefined;
    const checkoutDate = searchParams.get("checkoutDate") || undefined;

    const adultNum = searchParams.get("adultNum")
      ? Number(searchParams.get("adultNum"))
      : undefined;
    const minCharge = searchParams.get("minCharge")
      ? Number(searchParams.get("minCharge"))
      : undefined;
    const maxCharge = searchParams.get("maxCharge")
      ? Number(searchParams.get("maxCharge"))
      : undefined;
    const sort = searchParams.get("sort") || undefined;

    return {
      keyword,
      largeClassCode: "japan",
      middleClassCode,
      smallClassCode,
      checkinDate,
      checkoutDate,
      adultNum,
      minCharge,
      maxCharge,
      sort,
    };
  }, [searchParams]);

  // URL パラメータ変更時に自動で API 呼び出し
  useEffect(() => {
    const params = getSearchParamsFromUrl();

    // 検索条件が一切ない初期画面の場合はフェッチしない
    if (!params.keyword && (!params.checkinDate || !params.checkoutDate)) {
      setHotels([]);
      return;
    }

    const fetchHotels = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const query = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== "") {
            query.set(key, String(value));
          }
        });

        const res = await fetch(`/api/hotels?${query.toString()}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "ホテル情報の取得に失敗しました。");
        }

        setHotels(data.hotels || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotels();
  }, [searchParams, getSearchParamsFromUrl]);

  // フォーム送信時に URL を更新する関数
  const handleSearch = (params: SearchParams) => {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.set(key, String(value));
      }
    });

    // URL を更新（ブラウザの履歴に残すため push）
    router.push(`/?${query.toString()}`);
  };

  const initialParams = getSearchParamsFromUrl();

  return (
    <main className=" bg-gray-50 container mx-auto px-4 py-8">
      <SearchForm
        onSearch={handleSearch}
        isLoading={isLoading}
        initialParams={initialParams}
      />

      {error && (
        <div className="max-w-3xl mx-auto my-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* ホテル一覧表示エリア */}
      <HotelList hotels={hotels} isLoading={isLoading} />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="text-center py-8">読み込み中...</div>}>
      <HomeContent />
    </Suspense>
  );
}
