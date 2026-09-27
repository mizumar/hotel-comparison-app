This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 🚀 デプロイについて

本番環境（Vercel）への公開手順や、楽天APIの設定方法については [Wikiの「本番環境へのデプロイと環境変数」ページ](https://github.com/mizumar/hotel-comparison-app/wiki/%E6%9C%AC%E7%95%AA%E7%92%B0%E5%A2%83%EF%BC%88Vercel%EF%BC%89%E3%81%AE%E8%A8%AD%E5%AE%9A%E3%81%A8%E7%92%B0%E5%A2%83%E5%A4%89%E6%95%B0) を参照してください。

# 開発ロードマップ

楽天トラベルAPIを活用したホテル検索・選択サービスの開発ロードマップです。

楽天トラベルAPIで取得できる情報や検索機能を活用しながら、
「ホテルを探す → 条件で絞る → 気になるホテルを選ぶ → 詳細を確認する → 楽天トラベルへ移動する」
というホテル選びの体験を段階的に構築していきます。

※このロードマップは開発全体の方向性を示すものです。
詳細な実装内容は、各Phaseの進行に合わせて決定します。

## Phase 1：検索基盤の構築 ✅

楽天トラベルAPIと連携し、ホテルを検索・表示できる基盤を構築する。

- [x] 楽天トラベルAPI連携
- [x] キーワード検索
- [x] ホテル一覧表示
- [x] APIレスポンスの確認・整理
- [x] 基本的な単体テスト

## Phase 2：お気に入り・ホテル選択機能 ✅️

気になるホテルを保存し、ホテルを選ぶための基本的な機能を整える。

- [x] Zustandによるお気に入り管理
- [x] お気に入りボタン
- [x] お気に入り一覧ページ
- [x] ヘッダーへのお気に入り導線
- [x] お気に入り件数バッジ
- [x] ホテル選択に関する機能の検討・実装

※比較機能など、具体的な機能は実際の利用体験を確認しながら決定する。

## Phase 3：検索体験の強化 🏃‍♂️

より実際の旅行条件に合わせてホテルを探せるようにする。

- [ ] チェックイン日の指定
- [ ] チェックアウト日の指定
- [ ] 宿泊人数の指定
- [ ] 検索条件の保持
- [ ] 検索結果のソート
- [ ] 検索結果の絞り込み
- [ ] 料金条件による検索
- [ ] エリア・地域による検索
- [ ] その他、楽天トラベルAPIで利用可能な検索機能の検討・活用

## Phase 4：空室・料金情報の活用

指定した宿泊条件に応じたホテル情報を取得し、より実用的な検索体験を構築する。

- [ ] 指定日程での空室検索
- [ ] 宿泊人数に応じた検索
- [ ] 宿泊料金の表示
- [ ] 条件に応じたホテル検索
- [ ] 空室・料金情報と検索結果の連携
- [ ] 楽天トラベルAPIの空室検索機能の活用

## Phase 5：ホテル詳細・楽天トラベルへの導線

ホテルの詳細を確認し、そのまま楽天トラベルへ移動できる導線を構築する。

- [ ] ホテル詳細ページ
- [ ] ホテル基本情報の表示
- [ ] 施設・設備情報の表示
- [ ] 料金・空室情報の表示
- [ ] チェックイン・チェックアウト条件の保持
- [ ] 宿泊人数の保持
- [ ] 楽天トラベルへの遷移
- [ ] 検索条件を維持した状態での遷移
- [ ] アフィリエイト導線の確認

## Phase 6：ホテル選びをサポートする独自機能

楽天トラベルの検索結果を表示するだけではなく、
ホテル選びそのものをサポートする機能を検討する。

- [ ] ホテル情報の整理・見せ方の改善
- [ ] ホテルごとの特徴を分かりやすく表示
- [ ] ホテル同士の比較機能を検討
- [ ] 旅行目的に応じたホテル選択支援を検討
- [ ] 独自の絞り込み・スコアリングなどを検討
- [ ] 実際の利用状況を見ながら必要な機能を追加

## Phase 7：地図・周辺情報

ホテルの立地や周辺環境も含めてホテルを検討できるようにする。

- [ ] 地図表示
- [ ] ホテル位置の表示
- [ ] 周辺施設・観光地などの情報
- [ ] ホテルと周辺エリアの位置関係を確認できるUI

## Phase 8：コンテンツ・SEO・集客

ホテル検索機能とコンテンツを組み合わせ、検索流入からホテル選びにつなげる。

- [ ] ホテル選びに関する記事
- [ ] エリア別コンテンツ
- [ ] 旅行目的別コンテンツ
- [ ] 記事からホテル検索への導線
- [ ] 記事からホテル詳細への導線
- [ ] SEO対策
- [ ] OGP
- [ ] sitemap
- [ ] robots
- [ ] Search Console・アクセス解析

## Phase 9：品質担保・本番運用

主要なユーザー導線を確認し、安定して利用できる状態にする。

- [ ] E2Eテスト（Playwright）
- [ ] 検索フローのE2Eテスト
- [ ] お気に入り機能のE2Eテスト
- [ ] 詳細ページ・送客フローのE2Eテスト
- [ ] APIエラーへの対応
- [ ] 検索結果0件時のUI
- [ ] モバイル表示確認
- [ ] パフォーマンス確認
- [ ] 本番環境での動作確認
- [ ] Vercelへの本番デプロイ

## 最終的なサービスイメージ

ホテルを探す
↓
検索条件を指定
├─ キーワード
├─ エリア
├─ チェックイン
├─ チェックアウト
├─ 宿泊人数
└─ その他の条件
↓
ホテル一覧
↓
ソート・絞り込み
↓
お気に入り・ホテル選択
↓
ホテル詳細
↓
空室・料金確認
↓
検索条件を保持
↓
楽天トラベルへ
↓
予約

## 開発方針

このロードマップは、現時点ですべての機能を確定させるものではありません。

楽天トラベルAPIで利用できる機能を確認しながら、
実際にサイトを使ってみて「ホテル選びに必要な機能」を見極め、
優先順位を決めて段階的に実装していきます。

将来的な機能については、各Phaseの開始時に具体的なIssueへ分解して管理します。

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
