"use client";

import { useState } from "react";

interface SearchFormProps {
  onSearch: (keyword: string) => void;
  isLoading: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [keyword, setKeyword] = useState("");

  // React.FormEvent から React.SubmitEvent に変更
  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    onSearch(keyword.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 w-full max-w-xl mx-auto my-6"
    >
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="地名や駅名を入力（例: 仙台、東京）"
        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !keyword.trim()}
        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
      >
        {isLoading ? "検索中..." : "検索"}
      </button>
    </form>
  );
}
