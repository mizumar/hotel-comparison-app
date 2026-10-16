import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useHotelSearch } from "../useHotelSearch";
import { SearchParams } from "@/src/types/hotel";
import * as hotelService from "@/src/services/hotelService";
import React from "react";

// service 層をモック化
jest.mock("@/src/services/hotelService");

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // テスト時の自動リトライを無効化
        gcTime: 0,
      },
    },
  });

const defaultWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("src/hooks/useHotelSearch.ts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("【TC-TQ-01】初回データフェッチ: enabledがtrueのとき、正常にAPIを呼び出してデータが取得できること", async () => {
    const mockParams: SearchParams = { keyword: "仙台" };
    const mockHotels = [{ id: "1", name: "ホテルA", minCharge: 5000 }];

    (hotelService.searchHotels as jest.Mock).mockResolvedValueOnce(mockHotels);

    const { result } = renderHook(() => useHotelSearch(mockParams, true), {
      wrapper: defaultWrapper,
    });

    // 初期状態はローディング中
    expect(result.current.isLoading).toBe(true);

    // フェッチ完了を待つ
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockHotels);
    expect(hotelService.searchHotels).toHaveBeenCalledWith(mockParams);
  });

  test("【TC-TQ-02】キャッシュの効力確認: 同一パラメータでのフック呼び出し時にキャッシュが利用されAPIが重複コールされないこと", async () => {
    const mockParams: SearchParams = { keyword: "東京" };
    const mockHotels = [{ id: "2", name: "ホテルB", minCharge: 8000 }];

    (hotelService.searchHotels as jest.Mock).mockResolvedValue(mockHotels);

    const queryClient = createTestQueryClient();
    const customWrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    // 1回目レンダリング
    const { result: result1 } = renderHook(
      () => useHotelSearch(mockParams, true),
      {
        wrapper: customWrapper,
      },
    );
    await waitFor(() => expect(result1.current.isSuccess).toBe(true));

    // 2回目レンダリング（同じパラメータ）
    const { result: result2 } = renderHook(
      () => useHotelSearch(mockParams, true),
      {
        wrapper: customWrapper,
      },
    );

    // キャッシュから即座にデータが取得できること
    expect(result2.current.data).toEqual(mockHotels);
    // searchHotels はキャッシュが効くため、合計で1回しか呼ばれないこと
    expect(hotelService.searchHotels).toHaveBeenCalledTimes(1);
  });

  test("【TC-TQ-03】エラーハンドリング: API呼び出しでエラーが発生した場合に error ステートに格納されること", async () => {
    const mockParams: SearchParams = { keyword: "エラー" };
    const errorMessage = "サーバーエラーが発生しました";

    (hotelService.searchHotels as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage),
    );

    const { result } = renderHook(() => useHotelSearch(mockParams, true), {
      wrapper: defaultWrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
    expect(result.current.error?.message).toBe(errorMessage);
  });
});
