import { getAppUrl, customFetch } from "@/src/lib/fetcher";

describe("fetcher utility", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  // TC-FT-01: 開発環境の URL 取得
  test("TC-FT-01: returns localhost URL in development environment", () => {
    delete process.env.NEXT_PUBLIC_APP_URL;
    delete process.env.APP_URL;
    (process.env as any).NODE_ENV = "development";

    expect(getAppUrl()).toBe("http://localhost:3000");
  });

  // TC-FT-02: 本番環境の URL 取得
  test("TC-FT-02: returns NEXT_PUBLIC_APP_URL when set", () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://my-app.vercel.app/";

    expect(getAppUrl()).toBe("https://my-app.vercel.app/");
  });

  // TC-FT-03: ヘッダーの付与
  test("TC-FT-03: attaches Referer and Origin headers in customFetch", async () => {
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    } as any);

    const params = new URLSearchParams({ keyword: "テスト" });
    await customFetch("https://api.example.com", params);

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.example.com?keyword=%E3%83%86%E3%82%B9%E3%83%88",
      expect.objectContaining({
        headers: expect.objectContaining({
          Referer: "http://localhost:3000",
          Origin: "http://localhost:3000",
        }),
      }),
    );
  });
});
