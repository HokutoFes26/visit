import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import { readFile, mkdir } from "node:fs/promises";
import { createServer } from "node:http";
import { resolve, extname, sep } from "node:path";

const data = JSON.parse(
  (await readFile("src/data/sightseeing.json", "utf8")).replace(/^\uFEFF/, ""),
);
assert.equal(
  new Set(data.areas.map((area) => area.id)).size,
  data.areas.length,
);
assert.equal(
  new Set(data.spots.map((spot) => spot.id)).size,
  data.spots.length,
);
for (const spot of data.spots) {
  assert.ok(
    data.areas.some((area) => area.id === spot.areaId),
    spot.id,
  );
  assert.ok(
    Number.isFinite(spot.latitude) && Math.abs(spot.latitude) <= 90,
    spot.id,
  );
  assert.ok(
    Number.isFinite(spot.longitude) && Math.abs(spot.longitude) <= 180,
    spot.id,
  );
  for (const key of [
    "name",
    "description",
    "access",
    "cost",
    "duration",
    "note",
  ])
    assert.ok(
      typeof spot[key] === "string" || spot[key].ja,
      `${spot.id} ${key}`,
    );
  for (const key of ["website", "sourceUrl"])
    assert.equal(new URL(spot[key]).protocol, "https:");
}
const root = resolve("dist");
const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webmanifest": "application/manifest+json",
};
const server = createServer(async (request, response) => {
  const path = resolve(
    root,
    "." +
      new URL(request.url, "http://localhost").pathname.replace(
        /\/$/,
        "/index.html",
      ),
  );
  if (!path.startsWith(root + sep)) {
    response.writeHead(403).end();
    return;
  }
  try {
    response.writeHead(200, {
      "Content-Type": types[extname(path)] || "application/octet-stream",
    });
    response.end(await readFile(path));
  } catch {
    response.writeHead(404).end();
  }
});
await new Promise((done) => server.listen(0, "127.0.0.1", done));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL || "msedge",
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 1280, height: 1000 },
  reducedMotion: "reduce",
  colorScheme: "dark",
});
const page = await context.newPage();
const errors = [];
let mapTiles = 0;
page.on("response", (response) => {
  if (
    response.url().includes("tile.openstreetmap.org/") &&
    response.status() === 200
  )
    mapTiles++;
});
page.on("pageerror", (error) => errors.push(error.message));
try {
  await mkdir("test-results", { recursive: true });
  await page.goto(base);
  assert.equal(
    await page.locator("html").getAttribute("data-theme"),
    "light",
    "Default must be light even when OS is dark",
  );
  await page
    .getByLabel("見学用パスワード")
    .fill(process.env.TEST_PASSWORD || "factory2026");
  await page.getByRole("button", { name: "見学ガイドをひらく" }).click();
  await expect(page.locator('a[href="#/notes"]')).toHaveCount(0);
  await page.locator(".shortcut-grid").getByRole("link", { name: "東京観光", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "東京観光" }),
  ).toBeVisible();
  await expect(page.locator(".sightseeing-spot")).toHaveCount(
    data.spots.filter((spot) => spot.enabled).length,
  );
  for (const area of data.areas) {
    await page
      .getByRole("group", { name: "観光エリア" })
      .getByRole("button", { name: new RegExp(area.name.ja) })
      .click();
    const spots = data.spots.filter(
      (spot) => spot.enabled && spot.areaId === area.id,
    );
    await expect(page.locator(".sightseeing-spot")).toHaveCount(spots.length);
    for (const spot of spots) {
      await page
        .getByRole("button", {
          name: `${spot.name.ja}を地図に表示`,
          exact: true,
        })
        .click();
      const src = new URL(
        await page.locator(".sightseeing-map").getAttribute("src"),
      );
      assert.equal(
        src.searchParams.get("marker"),
        `${spot.latitude},${spot.longitude}`,
      );
      await expect(page.locator(".sightseeing-map-heading h2")).toHaveText(
        spot.name.ja,
      );
    }
  }
  for (const origin of data.origins) {
    await page.getByLabel("経路の出発地").selectOption(origin.id);
    const directions = new URL(
      await page
        .getByRole("link", { name: "Googleマップで経路を確認" })
        .getAttribute("href"),
    );
    assert.equal(directions.searchParams.get("origin"), origin.query);
    assert.equal(directions.searchParams.get("travelmode"), "transit");
  }
  await page
    .getByRole("group", { name: "観光エリア" })
    .getByRole("button", { name: "すべて" })
    .click();
  // Tile fetching is external; core selection and links must work independently of it.
  await expect.poll(() => mapTiles, { timeout: 15000 }).toBeGreaterThan(0);
  const loadedMap = true;
  for (const language of ["ja", "en"]) {
    await page
      .getByRole("button", {
        name: language === "ja" ? "日本語" : "EN",
        exact: true,
      })
      .first()
      .click();
    for (const theme of ["light", "dark"]) {
      if ((await page.locator("html").getAttribute("data-theme")) !== theme)
        await page.locator(".theme-switch").first().click();
      for (const width of [360, 390, 768, 1280]) {
        await page.setViewportSize({ width, height: 1000 });
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          `${language} ${theme} ${width}`,
        );
      }
    }
  }
  const englishNames = data.spots
    .filter((spot) => spot.enabled)
    .map((spot) =>
      typeof spot.name === "string" ? spot.name : spot.name.en || spot.name.ja,
    );
  assert.deepEqual(
    await page.locator(".sightseeing-spot h2").allTextContents(),
    englishNames,
  );
  await expect(page.locator(".sightseeing-map-heading .eyebrow")).toHaveText(
    "LOCATE ON THE MAP",
  );
  await page.screenshot({
    path: "test-results/sightseeing-en-dark.png",
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "日本語", exact: true })
    .first()
    .click();
  await page.locator(".theme-switch").first().click();
  await page
    .getByRole("group", { name: "観光エリア" })
    .getByRole("button", { name: /浅草/ })
    .click();
  await page.setViewportSize({ width: 390, height: 900 });
  await page
    .getByRole("button", { name: "仲見世商店街を地図に表示", exact: true })
    .click();
  assert.ok(
    await page
      .locator(".sightseeing-map-panel")
      .evaluate(
        (element) =>
          element.getBoundingClientRect().top >= -1 &&
          element.getBoundingClientRect().top < 100,
      ),
  );
  await page
    .frameLocator(".sightseeing-map")
    .locator("canvas")
    .first()
    .waitFor();
  await page
    .frames()
    .find((frame) =>
      frame.url().includes("openstreetmap.org/export/embed.html"),
    )
    ?.waitForLoadState("networkidle", { timeout: 15000 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: "test-results/sightseeing-ja-mobile.png",
    fullPage: true,
  });
  await expect(page.locator(".pwa-status").first()).toContainText(
    "オフライン準備完了",
    { timeout: 15000 },
  );
  await context.setOffline(true);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "東京観光" }),
  ).toBeVisible();
  await expect(page.locator(".sightseeing-map-offline")).toBeVisible();
  await expect(page.locator(".sightseeing-spot")).toHaveCount(
    data.spots.filter((spot) => spot.enabled).length,
  );
  await context.setOffline(false);
  await expect(page.locator(".sightseeing-map")).toBeVisible();
  for (const route of ["learning", "guide", "more"]) {
    await page.goto(`${base}/#/${route}`);
    await page
      .locator("main")
      .getByRole("link", {
        name: route === "more" ? "東京観光" : "地図で東京の観光スポットを探す",
        exact: true,
      })
      .click();
    await expect(
      page.getByRole("heading", { name: "東京観光" }),
    ).toBeVisible();
  }
  await page.goto(`${base}/#/notes?company=members`);
  await expect(page).toHaveURL(/#\/sightseeing$/);
  await expect(page.locator('a[href="#/notes"]')).toHaveCount(0);
  assert.deepEqual(errors, []);
  console.log(
    `PASS: sightseeing data, filters, ${data.spots.length} map pins, directions, links, Japanese/English × light/dark × 4 widths, offline reload, mobile map navigation, browser errors. Live map tiles: ${loadedMap}.`,
  );
} finally {
  await browser.close();
  await new Promise((done) => server.close(done));
}
