"use client";

import { useState } from "react";
import { SearchParams } from "@/src/types/hotel";

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [keyword, setKeyword] = useState("");
  const [checkinDate, setCheckinDate] = useState("");
  const [checkoutDate, setCheckoutDate] = useState("");
  const [adultNum, setAdultNum] = useState<number | undefined>(undefined);
  const [dateError, setDateError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDateError("");

    // 日付バリデーション: チェックインとチェックアウトの両方が入力されている場合のみチェック
    if (checkinDate && checkoutDate) {
      if (new Date(checkoutDate) <= new Date(checkinDate)) {
        setDateError(
          "チェックアウト日はチェックイン日より後の日付を選択してください。",
        );
        return;
      }
    }

    onSearch({
      keyword: keyword.trim() || undefined,
      checkinDate: checkinDate || undefined,
      checkoutDate: checkoutDate || undefined,
      adultNum,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl mx-auto my-6 p-6 bg-white rounded-xl border border-gray-200 shadow-sm space-y-4"
    >
      {/* エラーメッセージ表示 */}
      {dateError && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md font-medium">
          {dateError}
        </div>
      )}

      {/* キーワード入力 */}
      <div>
        <label
          htmlFor="keyword-input"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          キーワード / エリア
        </label>
        <input
          id="keyword-input"
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="地名や駅名、ホテル名（例: 仙台、東京）"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-sm"
          disabled={isLoading}
        />
      </div>

      {/* 日付・人数指定 (グリッド配置) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="checkin-input"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            チェックイン日
          </label>
          <input
            id="checkin-input"
            type="date"
            value={checkinDate}
            onChange={(e) => setCheckinDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-sm"
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="checkout-input"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            チェックアウト日
          </label>
          <input
            id="checkout-input"
            type="date"
            value={checkoutDate}
            onChange={(e) => setCheckoutDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-sm"
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="adult-num-select"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            宿泊人数（大人）
          </label>
          <select
            id="adult-num-select"
            value={adultNum ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              setAdultNum(value === "" ? undefined : Number(value));
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-sm bg-white"
            disabled={isLoading}
          >
            <option value="">指定しない</option>

            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num} value={num}>
                {num}名
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 検索ボタン */}
      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto px-8 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {isLoading ? "検索中..." : "この条件で検索"}
        </button>
      </div>
    </form>
  );
}
