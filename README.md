# 県外企業見学ガイド — モノトーン改修版

起動方法・変更内容・検証結果は [改修版ガイド](docs/REFINEMENT.md) を参照してください。

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
npm install
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

A license for this project has not been specified.
