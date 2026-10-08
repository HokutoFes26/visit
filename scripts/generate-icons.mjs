import { chromium } from "@playwright/test";
import { readFile, mkdir } from "node:fs/promises";
const svg = await readFile("public/icon.svg", "utf8");
const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL || "msedge",
});
try {
  await mkdir("public/icons", { recursive: true });
  for (const size of [192, 512]) {
    const page = await browser.newPage({
      viewport: { width: size, height: size },
      deviceScaleFactor: 1,
    });
    await page.setContent(
      `<style>body{margin:0}svg{display:block;width:100vw;height:100vh}</style>${svg}`,
    );
    await page.screenshot({
      path: `public/icons/icon-${size}.png`,
      omitBackground: true,
    });
    if (size === 512) {
      await page.setContent(
        `<style>body{margin:0;background:#337bee;display:grid;place-items:center;width:100vw;height:100vh}svg{width:70vw;height:70vh}</style>${svg}`,
      );
      await page.screenshot({ path: "public/icons/maskable-512.png" });
    }
    await page.close();
  }
} finally {
  await browser.close();
}
