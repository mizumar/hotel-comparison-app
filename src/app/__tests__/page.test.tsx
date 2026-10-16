import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "../page";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Next.js ナビゲーションのモック化
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

const renderWithQueryClient = (ui: React.ReactElement) => {
  const queryClient = createTestQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
};

// API (fetch) のモック化
global.fetch = jest.fn();

describe("src/app/page.tsx", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  test("【TC-PL-01】URLからの初期検索: クエリ付きURLでアクセスした際、条件がセットされホテル一覧が取得・表示されること", async () => {
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams("keyword=仙台"),
    );

    const fetchMock = jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        hotels: [
          {
            id: "1",
            name: "仙台グランホテル",
            minCharge: 8500,
            address: "宮城県仙台市",
            access: "仙台駅徒歩3分",
            imageUrl: "",
            rakutenUrl: "",
          },
        ],
      }),
    } as Response);

    try {
      renderWithQueryClient(<Home />);

      const keywordInput = screen.getByTestId(
        "keyword-input",
      ) as HTMLInputElement;

      expect(keywordInput.value).toBe("仙台");

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(
          expect.stringContaining("/api/hotels?"),
        );

        expect(fetchMock).toHaveBeenCalledWith(
          expect.stringContaining("keyword=%E4%BB%99%E5%8F%B0"),
        );
      });

      expect(await screen.findByText("仙台グランホテル")).toBeInTheDocument();
    } finally {
      fetchMock.mockRestore();
    }
  });

  test("【TC-PL-02】フォーム送信時のURL更新: 空室条件を入力して検索送信した際、URL に各パラメータがセットされ（router.push）、ブラウザ履歴が更新されること", async () => {
    // 初期状態はクエリなし
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(""));

    renderWithQueryClient(<Home />);

    // 空室検索タブに切替
    fireEvent.click(screen.getByTestId("tab-vacant"));

    // 条件入力
    fireEvent.change(screen.getByTestId("checkin-input"), {
      target: { value: "2026-10-01" },
    });
    fireEvent.change(screen.getByTestId("checkout-input"), {
      target: { value: "2026-10-02" },
    });

    // 検索ボタン送信
    fireEvent.click(screen.getByTestId("submit-button"));

    // router.push が正しいクエリパラメータ付きで呼び出されたか検証
    expect(mockPush).toHaveBeenCalledTimes(1);
    const pushedUrl = mockPush.mock.calls[0][0];
    expect(pushedUrl).toContain("/?");
    expect(pushedUrl).toContain("checkinDate=2026-10-01");
    expect(pushedUrl).toContain("checkoutDate=2026-10-02");
  });
});
