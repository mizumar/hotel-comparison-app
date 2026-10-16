"use client";

import { useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchForm } from "@/src/components/SearchForm";
import { HotelList } from "@/src/components/HotelList";
import { SearchParams } from "@/src/types/hotel";
import { useHotelSearch } from "@/src/hooks/useHotelSearch";

/**
 * ホテル検索ページのメインコンテンツ
 *
 * URL から検索条件を取得し、ホテル検索を実行する。
 * 検索フォームへの初期値の設定や、検索結果・エラーの表示も行う。
 *
 * ※ useSearchParams() を使用するため、Suspense の内側で描画する。
 */
function HomeContent() {
  // URL の変更や画面遷移を行うためのルーター
  const router = useRouter();

  // 現在の URL に含まれるクエリパラメータを取得する
  const searchParams = useSearchParams();

  /**
   * URL のクエリパラメータから SearchParams オブジェクトを作成する
   *
   * URL に設定された検索条件を取得し、
   * 数値として扱う項目は Number() で変換する。
   *
   * @returns URL に基づくホテルの検索条件
   */
  const getSearchParamsFromUrl = useCallback((): SearchParams => {
    // 文字列として取得する検索条件
    // 値が空の場合は undefined として扱う
    const keyword = searchParams.get("keyword") || undefined;
    const middleClassCode = searchParams.get("middleClassCode") || undefined;
    const smallClassCode = searchParams.get("smallClassCode") || undefined;
    const checkinDate = searchParams.get("checkinDate") || undefined;
    const checkoutDate = searchParams.get("checkoutDate") || undefined;

    // 数値として取得する検索条件
    // URL に値が存在する場合のみ Number() で数値に変換する
    const adultNum = searchParams.get("adultNum")
      ? Number(searchParams.get("adultNum"))
      : undefined;

    const minCharge = searchParams.get("minCharge")
      ? Number(searchParams.get("minCharge"))
      : undefined;

    const maxCharge = searchParams.get("maxCharge")
      ? Number(searchParams.get("maxCharge"))
      : undefined;

    // 並び順の指定を取得する
    const sort = searchParams.get("sort") || undefined;

    // 取得した値を SearchParams 型のオブジェクトにまとめる
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

  // 現在の URL に対応する検索条件を取得する
  const currentParams = getSearchParamsFromUrl();

  // 初期画面では検索を実行せず、検索条件がある場合のみ実行する
  // キーワード、またはチェックイン日とチェックアウト日の両方が必要
  const isSearchEnabled = Boolean(
    currentParams.keyword ||
    (currentParams.checkinDate && currentParams.checkoutDate),
  );

  /**
   * ホテル検索を実行し、取得データや状態を管理する
   *
   * useHotelSearch 内の TanStack Query により、
   * ホテル一覧・読み込み状態・エラー状態を取得する。
   */
  const {
    data: hotels = [],
    isLoading,
    error,
  } = useHotelSearch(currentParams, isSearchEnabled);

  /**
   * 検索フォームの送信時に URL を更新する
   *
   * 検索条件をクエリパラメータに変換して URL に設定する。
   * URL が更新されることで、その URL をもとに検索条件が再取得される。
   *
   * @param params - フォームから送信された検索条件
   */
  const handleSearch = (params: SearchParams) => {
    // 検索条件を URL のクエリパラメータに変換する
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      // 値が undefined または空文字列の項目は URL に含めない
      if (value !== undefined && value !== "") {
        query.set(key, String(value));
      }
    });

    // 検索条件を URL に反映する
    router.push(`/?${query.toString()}`);
  };

  return (
    <main className=" bg-gray-50 container mx-auto px-4 py-8">
      {/* 検索フォーム：検索条件の入力と検索処理を担当 */}
      <SearchForm
        onSearch={handleSearch}
        isLoading={isLoading}
        initialParams={currentParams}
      />

      {/* 検索に失敗した場合はエラーメッセージを表示する */}
      {error && (
        <div className="max-w-3xl mx-auto my-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error.message || "ホテル情報の取得に失敗しました。"}
        </div>
      )}

      {/* ホテル一覧：取得したホテル情報と読み込み状態を渡す */}
      <HotelList hotels={hotels} isLoading={isLoading} />
    </main>
  );
}

/**
 * ホテル検索ページのエントリーポイント
 *
 * HomeContent を Suspense で囲み、
 * URL の検索パラメータを読み込む間の表示を用意する。
 */
export default function Home() {
  return (
    <Suspense fallback={<div className="text-center py-8">読み込み中...</div>}>
      <HomeContent />
    </Suspense>
  );
}
