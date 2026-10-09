# Factory Visit Guide

工場見学向け電子パンフレット。**Phase 1〜4の機能を実装済み**です。配布資料「県外企業見学.pdf」の概要を反映しています。日程はユーザー確認済みの2026年10月21日〜23日です。企業の事業概要・訪問拠点・個人別座席割りなど資料にない情報は未発表または記載なしとしています。

## 起動

Node.js 22.12以降（24推奨）とnpmが必要です。

```sh
npm ci
npm run dev
```

表示されたローカルURLを開いてください。初期デモパスワードは `factory2026` です。

```sh
npm run build
npm run preview -- --port 4173
```

`build` はTypeScriptの型検査後に `dist/` を生成します。`preview` は生成済みファイルの確認用です。

PowerShellでnpmの実行に問題がある場合は、`npm.cmd ci`・`npm.cmd run dev` のように実行してください。

## visit-main テンプレートとの対応

提供されたZIPの `pages`・`layouts`・`config`・`styles`・`types`・`provider.tsx` の構成と、GitHub Pagesの公開フローに合わせています。画面・入力データ・保存キー・PWA機能は維持しています。デザインを維持するため、HeroUI・Tailwindへの置き換えは行っていません。テンプレートのDocs・Pricing・Blog等のページ、不要なテーマ切替や依存ライブラリも追加していません。

```text
.github/workflows/deploy.yml   # main更新時のGitHub Pages公開
src/
  App.tsx                     # 簡易ゲートとルート定義
  main.tsx                    # アプリ起動
  provider.tsx                # PWA・端末保存・エラー境界
  pages/                      # 各画面
    index.tsx                 # ホーム
    login.tsx
    schedule.tsx
    companies.tsx
    company-detail.tsx
    guide.tsx
    announcements.tsx
    seats.tsx
    learning.tsx
    notes.tsx
    more.tsx
    settings.tsx
  layouts/default.tsx         # 共通レイアウト
  components/navbar.tsx       # ヘッダー・サイドバー・下部ナビ
  components/ui.tsx           # 共通カード・見出し
  components/Timeline.tsx
  config/site.ts              # メニュー・ショートカット
  config/assets.ts            # 公開場所に対応する画像パス
  styles/globals.css          # 共通デザイン
  types/index.ts              # 企業・予定の型定義
  hooks/useNow.ts
  state/visit-storage.tsx     # メモ・チェックの保存
  data/                      # 内容を編集するJSON
  pwa.tsx
  sw.ts
```

`@/` は `src/` を指すインポート用エイリアスです。

## 実装済み

- Industrial Glassの共通UI、PCサイドバー、モバイル下部ナビ、キーボードフォーカス、動きを減らす設定への対応
- 共通パスワードの簡易閲覧ゲート、表示切替、エラー表示、sessionStorageでのタブ内ログイン保持、ログアウト
- ホーム、日時に基づく現在・次の予定、複数日対応タイムライン
- 企業一覧・詳細・関連予定・注目ポイント・質問例
- 集合場所・持ち物・服装・安全上の注意
- JSONの重要告知表示、告知一覧、設定画面
- 未登録企業・不正なデータ・保存領域の利用失敗の案内
- PWAインストール、必須ファイルのプリキャッシュ、全キャッシュ確認後の準備完了表示、オフライン閲覧、更新通知・適用、キャッシュ削除後の再準備
- 新幹線2号車の資料に基づく座席図（水色39席・教員席・荷物置き・×表示、個人名なし）
- 企業ごとの事前学習と、端末保存するチェックリスト
- 企業別メモの自動保存・復元・全メモのテキスト書き出し・保存失敗時の再試行

## 構成と更新方法

| ファイル | 用途 |
| --- | --- |
| `src/App.tsx` | ルーティング・簡易ゲート |
| `src/pages/*.tsx` | 各画面の見出し・テキスト・構成 |
| `src/layouts/default.tsx` | 共通レイアウト |
| `src/components/navbar.tsx` | ヘッダーとナビゲーション |
| `src/config/site.ts` | メニュー名・ショートカット |
| `src/provider.tsx` | 共通状態の提供・エラー画面 |
| `src/components/Timeline.tsx` | 日時に連動するタイムライン |
| `src/components/ui.tsx` | 共通カード・見出し・空状態 |
| `src/types/index.ts` | 企業・予定の型定義 |
| `src/data/index.ts` | 基本バリデーション・日本時間の判定 |
| `src/data/event.json` | 見学概要、代表日、集合情報、版番号 |
| `src/data/schedule.json` | 日付、開始・終了時刻、場所、企業ID、移動情報 |
| `src/data/companies.json` | 企業紹介、画像、注目ポイント、質問例 |
| `src/data/guide.json` | 持ち物・服装・注意事項 |
| `src/data/announcements.json` | 告知内容・掲載日・更新日・重要度 |
| `src/data/seats.json` | 行数、列・通路、座席番号、グループ |
| `src/data/learning.json` | 企業別の事前知識とチェック項目 |
| `src/state/visit-storage.tsx` | メモ・学習チェックの端末保存 |
| `src/pwa.tsx` | 準備状態、インストール、更新通知・適用 |
| `src/sw.ts` | Service Worker、プリキャッシュ・キャッシュ照合 |
| `vite.config.ts` | Manifest・PWAビルド設定 |
| `public/icons/` | 通常・マスカブルのPNGアイコン |
| `src/styles/globals.css` | デザイントークン、画面、レスポンシブ定義 |
| `public/images/factory.svg` | 自作の差し替え可能な仮工場イラスト |
| `tests/smoke.mjs` | 実ブラウザでの基本動作テスト |
| `tests/pwa.mjs` | オフライン・保存・更新・キャッシュ復旧テスト |

日付は `YYYY-MM-DD`、時刻は24時間制の `HH:mm` です。スケジュールは日付と `order` で並びます。時刻が未発表の場合は `startTime`・`endTime` を `null` にし、`timeNote` に「見学後」などの補足を書きます。終了時刻のない集合・出発は単一時点として表示し、時刻未定の予定を「現在進行中」と断定しません。開始・終了の両方がある予定のみ開始以上・終了未満を「現在」とします。日本時間で解釈し、端末の時計が誤っていれば判定もずれます。15秒ごとに表示を更新します。日程追加時はスケジュールに別の日付を追加してください。告知の資料掲載日は不明なら `null`、サイト反映日は日付で記録します。

企業は `id` と予定の `companyId` で関連付けます。画像は `public/images/` に配置しJSONの `image` を変更します。写真に差し替えた際は仮イメージ表記も更新してください。公式URL未登録時はリンクを出しません。データのID重複、必須項目、時刻形式、期間の前後関係、関連企業の参照を起動時に確認します。

企業情報や日時はJSONで更新後、型検査・ブラウザ確認を行い、再ビルドして配布してください。企業写真は現在も仮イラストで、実際の訪問先の写真ではありません。反映内容と資料の対応は `docs/OVERVIEW-SOURCE.md` にまとめています。

座席の `columns` は `A, B, C, aisle, D, E` のように通路も含めて並べます。各座席には `row`（1始まり）、`column`、`number`、`groupId` を指定します。現在の `groupId` は班ではなく資料上の区分（水色席・教員・荷物置き・×）を表します。色は `blue`・`mint`・`violet`・`gray` です。班編成案は `groupPlan` に別管理し、席との対応は作っていません。学習データは `companyId` で企業と結び付け、`basics` と `checklist` を編集します。チェック項目の `id` を変更すると既存のチェック状態との対応が変わります。旧仮企業のメモは消去せず保存領域に残し、「すべてのメモを書き出す」で旧IDを含めて出力できます。

## PWA・メモの使い方

1. `npm run build` → `npm run preview -- --port 4173` で本番版を起動します。開発用の5173ではService Workerは登録しません。
2. オンラインで `http://127.0.0.1:4173/` を開き、上部に「オフライン準備完了」が出るまで待ちます。登録成功だけでなく、現行版の必要な全キャッシュを照合しています。
3. 対応環境では設定画面のインストールボタン、またはブラウザのメニューから追加できます。iPhoneはSafariの共有メニューからホーム画面に追加します。
4. 配布内容の更新後は通知の「更新を適用」で新しい版へ切り替えます。設定の「キャッシュ・更新を確認」で手動確認できます。接続復帰時と1時間ごとにも更新を確認します。
5. キャッシュを消した場合はオンラインで設定の「オフラインを再準備」を実行します。準備前の初回オフラインアクセスはできません。

キャッシュに含めるJSONはJSへバンドルされます。ローカルの画像・フォントは指定拡張子でキャッシュ対象です。外部サイトや外部画像は対象外です。準備表示は起動時・画面復帰時・接続変化時・30秒ごとに再確認します。OSやブラウザによる保存領域の削除後は再準備が必要です。

メモは入力の都度 `factory-visit:notes:v1`、チェックは `factory-visit:learning:v1` に保存します。クラウド同期はありません。保存に失敗した場合、別画面へ移動しても同じアプリ内には入力を保持しますが、再読み込み・終了で失われます。保存を再試行するか、メモを書き出してください。未保存の入力がある間は更新適用を止め、ページ終了時にはブラウザの確認を要求します（表示可否はブラウザに依存）。共有端末では保存内容を他の人も閲覧できます。

**5173と4173は保存領域が別です。** 開発版で書いたメモは本番プレビューに自動移行されません。重要なメモは書き出してください。

## 共通パスワードとデータの扱い

`.env.example` を `.env.local` にコピーし、`VITE_VISIT_PASSWORD` を変更して再ビルドします。本番の値はGitにコミットしないでください。`.env.local` と `.env.*.local` は除外済みです。

**これは本格的な認証・アクセス制御ではありません。** クライアントに埋め込まれるパスワード、JSON、画像は解析・閲覧できます。環境変数にしてもビルド済みの値は秘匿できません。氏名入り名簿、個人連絡先、機密情報は含めないでください。ログイン状態は同一タブ内の再読み込みに保持され、同期はありません。パスワード変更は既存セッションの強制失効を保証しません。

## 動作確認

本番ビルド後、別のターミナルで `npm run preview -- --port 4173` を起動してから実行します。

```sh
npm test
npm run test:pwa
npm run test:pages
```

標準ではインストール済みMicrosoft EdgeをPlaywrightで起動します。別チャネルなら `PLAYWRIGHT_CHANNEL`、URLは `TEST_URL`、変更済みパスワードは `TEST_PASSWORD` を設定してください。例（PowerShell）：`$env:PLAYWRIGHT_CHANNEL='chrome'`。

360・390・768・1280pxの11画面、ログイン成功/失敗、表示切替、再読み込み、ログアウト、企業遷移、未登録企業、異なるタイムゾーンからの日本時間判定、保存失敗時の通知、ブラウザエラーを検証します。スクリーンショットは `test-results/` に保存します。実機テストは別途必要です。

`test:pwa` は本番ビルドを一時的なローカルサーバーで配信し、実際のService Workerでオフラインログイン・9画面再読み込み・画像、メモの保存/復元/書き出し、チェック復元、保存失敗と再試行を検証します。配信用の複製を変更して更新通知から新しい会社名への切り替えとメモ保持を確認し、キャッシュ削除後の未準備表示・復旧も確認します。元のJSONやdistはテストで変更しません。

`test:pages` は同じ検証を `/visit/` 配下で行い、Service Workerのscope、ホーム画面起動URL、画像パスが公開ディレクトリ内に収まることも確認します。

Windows版Edgeの自動テストは通過済みです。物理的なiPhone/Androidでのホーム画面追加・機内モード・OS再起動後の動作は未確認です。配布前にHTTPSの配布先で、実機での追加→準備完了→機内モード→再起動→各画面確認を行ってください。

## 配布

`dist/` の内容をHTTPS対応の静的ホスティングに配置します。HashRouter採用のため画面URLは `/#/schedule` または `/visit/#/schedule` の形式で、画面ごとのサーバーリライトは不要です。Viteの `base: "./"`、相対パスのManifest・画像、公開先scope基準のService Workerにより、ドメイン直下・リポジトリ名の配下の両方に対応します。外部フォント・外部APIは利用していません。

### GitHub Pages

1. 本プロジェクトの `package.json` がGitHubリポジトリのルートに来るように配置します。ZIP版では、展開した `visit-main/` の中身が対象です。`node_modules`、`dist`、`.env.local` はアップロードしません。
2. 元のHeroUIテンプレートを置き換える場合は、このプロジェクト一式を使ってください。旧 `src/`、`postcss.config.js`、`eslint.config.mjs`、`tsconfig.node.json` などを混在させると、削除した依存ライブラリを参照してビルドが失敗することがあります。
3. GitHubのリポジトリ設定で **Pages → Build and deployment → Source → GitHub Actions** を選びます。
4. 共通パスワードを変更する場合は **Secrets and variables → Actions → New repository secret** で `VITE_VISIT_PASSWORD` を登録します。未設定ならデモパスワードを使います。Secrets経由でもビルドした値は閲覧可能です。
5. `main` ブランチへのpush、またはActionsの **build and deploy → Run workflow** で公開します。Node.js 24で `npm ci` → `npm run build` を実行し、`dist/` をPagesへ配布します。
6. デプロイ結果のURL（例：`https://ユーザー名.github.io/visit/`）を開きます。PWA利用時は準備完了を確認してください。

ワークフローはファイルとして用意済みです。この作業ではGitHubへのpush・実際の公開は行っていません。

PWAのため `sw.js`・`manifest.webmanifest`・iconsも含め、dist全体を同時に配布してください。`sw.js`・`index.html` は再検証可能なCache-Control（例：`no-cache`）、ハッシュ付きassetsは長期キャッシュにします。古いHTMLを受け取った端末のため、直前のハッシュ付きassetsも一定期間保持する運用を推奨します。ローカルホスト以外のHTTP配信ではService Workerが利用できません。

## 未実装・次の工程

1. **Phase 5:** 同じJSONを読む印刷用テンプレート、PlaywrightのA4 PDF生成スクリプト、版番号・ページ番号、レイアウト照合。
2. **Phase 6:** 実際の配布データと写真への差し替え、実機・オフラインの最終確認。

バックエンド・個別アカウント・クラウド同期・プッシュ通知は実装していません。


## 東京観光の編集

地図付きの東京観光ページを追加しています。観光地の追加・変更は `src/data/sightseeing.json` で行います。[編集手順と追加用テンプレート](SIGHTSEEING.md)を参照してください。
