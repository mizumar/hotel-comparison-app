/**
 * アプリの実行環境に応じたベースURLを取得する
 */
export function getAppUrl(): string {
  // 環境変数が明示されていれば優先
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  // 開発環境（npm run dev）の場合は localhost:3000 を返す
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  // 本番環境（フォールバック）
  return "https://hotel-comparison-app.vercel.app/";
}

/**
 * 楽天API等の呼び出し用：リファラ・オリジンヘッダーを自動付与する共通 fetch メソッド
 */
export async function customFetch(
  endpoint: string,
  params: URLSearchParams,
  options: RequestInit = {},
): Promise<Response> {
  const appUrl = getAppUrl();

  const defaultHeaders: Record<string, string> = {
    Referer: appUrl,
    Origin: appUrl,
  };
  console.log(endpoint);
  console.log(defaultHeaders);

  return await fetch(`${endpoint}?${params.toString()}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    cache: options.cache ?? "no-store",
  });
}
