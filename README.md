# 県外企業見学ガイド — モノトーン改修版

起動方法・変更内容・検証結果は [改修版ガイド](docs/GUIDE.md) を参照してください。

# Factory Visit Guide

A factory visit guide built with Vite, React, and TypeScript, with offline PWA support.

## Technologies Used

- Vite
- React
- TypeScript
- React Router
- Lucide React
- vite-plugin-pwa / Workbox
- Playwright

## How to Use

Download and extract the project, then open its folder in a terminal.
Node.js 24 and npm are recommended.

### Install dependencies

```bash
npm ci
```

### Run the development server

```bash
npm run dev
```

Open the URL shown in the terminal. The demo password is `factory2026`.

### Build and preview

```bash
npm run build
npm run preview
```

Use the production preview to check offline support. Wait for the offline-ready status before disconnecting.

### Edit content and deploy

Edit the files in `src/data/` to change visit information.
See the [Japanese guide](docs/GUIDE.md) for content editing, password configuration, testing, and GitHub Pages deployment.

The shared password is only a viewing gate, not secure authentication. Do not include personal or confidential information.

## License

See [LICENSE](LICENSE) for the included MIT license notice.

## コース別の掲載内容 / Course content

- 電子：2026年10月21日〜23日。国際：2026年10月20日〜23日。
- 国際コースの新幹線・バスの座席は自由です。
- International course: you may choose your seat on both the Shinkansen and the bus.
- [日本語の全掲載データ](docs/CONTENT.ja.md) / [Full content in English](docs/CONTENT.en.md)
- [更新・確認記録](docs/RELEASE-2026-10-11.md)

`npm run docs:sync` updates both content documents; `npm run test:content` checks translation coverage and document synchronization.

## GitHub用ZIP

ZIPを展開し、`package.json` と `.github` がリポジトリ直下に来るように中身を反映してください。ZIPファイルそのものをアップロードしてもサイトは更新されません。Pagesの公開元はGitHub Actionsを選択します。

ホームの座席案内は見学ガイドに変更しました。旧 `/#/seats` は `/#/guide` へ転送します。 / The home seating shortcut is now Visit guide; old seating URLs redirect to the guide.

PDF資料の配置・登録方法は [PDF追加手順](docs/PDF-GUIDE.md) を参照してください。
