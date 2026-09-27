"use client";

import { useState } from "react";
import { SearchParams } from "@/src/types/hotel";
import { MagnifyingGlassIcon, CalendarIcon } from "@phosphor-icons/react";

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}

const AREA_OPTIONS = [
  { label: "東京都（八丈島）", middle: "tokyo", small: "ritou" },
  { label: "秋田県（田沢）", middle: "akita", small: "tazawa" },
  { label: "神奈川県（横浜）", middle: "kanagawa", small: "yokohama" },
  { label: "大阪府（大阪市内）", middle: "osaka", small: "osaka" },
  { label: "京都府（京都市内）", middle: "kyoto", small: "kyoto" },
  { label: "北海道（札幌）", middle: "hokkaido", small: "sapporo" },
  { label: "宮城県（仙台）", middle: "miyagi", small: "sendai" },
  { label: "愛知県（名古屋）", middle: "aichi", small: "nagoya" },
  { label: "福岡県（福岡市内）", middle: "fukuoka", small: "fukuoka" },
  { label: "沖縄県（那覇）", middle: "okinawa", small: "naha" },
];

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [activeTab, setActiveTab] = useState<"keyword" | "vacant">("keyword");

  const [keyword, setKeyword] = useState("");
  const [selectedAreaCode, setSelectedAreaCode] = useState<string>("tokyo");
  const [checkinDate, setCheckinDate] = useState("");
  const [checkoutDate, setCheckoutDate] = useState("");
  const [adultNum, setAdultNum] = useState<number>(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === "keyword") {
      if (!keyword.trim()) return;
      onSearch({ keyword: keyword.trim() });
    } else {
      const area =
        AREA_OPTIONS.find((a) => a.small === selectedAreaCode) ||
        AREA_OPTIONS[0];

      onSearch({
        largeClassCode: "japan",
        middleClassCode: area.middle,
        smallClassCode: area.small,
        checkinDate,
        checkoutDate,
        adultNum,
      });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-6 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* タブヘッダー */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        <button
          type="button"
          data-testid="tab-keyword"
          onClick={() => setActiveTab("keyword")}
          className={`flex-1 py-3.5 transition-colors font-medium text-sm ${
            activeTab === "keyword"
              ? "bg-white text-blue-600 border-b-2 border-blue-600 font-bold"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <MagnifyingGlassIcon className="w-5 h-5" />
            <span>キーワード検索</span>
          </div>
        </button>

        <button
          type="button"
          data-testid="tab-vacant"
          onClick={() => setActiveTab("vacant")}
          className={`flex-1 py-3.5 transition-colors font-medium text-sm ${
            activeTab === "vacant"
              ? "bg-white text-blue-600 border-b-2 border-blue-600 font-bold"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            <span>日程・空室検索</span>
          </div>
        </button>
      </div>

      {/* フォーム入力エリア */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {activeTab === "keyword" ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              キーワード / エリア
            </label>
            <input
              type="text"
              data-testid="keyword-input"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="地名、駅名、ホテル名など（例: 仙台、東京タワー）"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black text-sm"
              disabled={isLoading}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                エリア <span className="text-red-500">*</span>
              </label>
              <select
                data-testid="area-select"
                value={selectedAreaCode}
                onChange={(e) => setSelectedAreaCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black text-sm bg-white"
                disabled={isLoading}
                required
              >
                {AREA_OPTIONS.map((area) => (
                  <option key={area.small} value={area.small}>
                    {area.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  チェックイン日 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  data-testid="checkin-input"
                  value={checkinDate}
                  onChange={(e) => setCheckinDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black text-sm"
                  disabled={isLoading}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  チェックアウト日 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  data-testid="checkout-input"
                  value={checkoutDate}
                  onChange={(e) => setCheckoutDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black text-sm"
                  disabled={isLoading}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  人数
                </label>
                <select
                  data-testid="adult-num-select"
                  value={adultNum}
                  onChange={(e) => setAdultNum(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black text-sm bg-white"
                  disabled={isLoading}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      大人 {num}名
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            data-testid="submit-button"
            disabled={isLoading || (activeTab === "keyword" && !keyword.trim())}
            className="w-full sm:w-auto px-8 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? "検索中..." : "この条件で検索"}
          </button>
        </div>
      </form>
    </div>
  );
}
