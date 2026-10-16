"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, ReactNode } from "react";

export function QueryProvider({ children }: { children: ReactNode }) {
  // QueryClient のインスタンスを生成（useState を使ってレンダリングごとの再生成を防ぐ）
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // ウィンドウフォーカス時の自動再フェッチを無効化（お好みで調整可）
            refetchOnWindowFocus: false,
            // キャッシュの保持時間（例: 5分間は新鮮なデータとみなす）
            staleTime: 1000 * 60 * 5,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 開発時に便利なデベロッパーツール（画面下に小さくアイコンが出ます） */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
