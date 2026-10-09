import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import { readFile, readdir, mkdir, cp, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { resolve, extname, sep } from "node:path";
import { createHash } from "node:crypto";

// A separate, temporary origin allows a real SW update without editing source data.
const prefix = process.argv.includes('--pages') ? '/visit' : '';
const fixture = resolve(prefix ? 'test-results/pages-update' : "test-results/pwa-update");
const unexpectedPaths = [];
await mkdir(fixture, { recursive: true });
await cp("dist", fixture, { recursive: true });
const jsName = (await readdir("dist/assets")).find((n) =>
  /^index-.*\.js$/.test(n),
);
const companies = JSON.parse(await readFile("src/data/companies.json", "utf8"));
const newName = "index-update-test.js";
const original = await readFile(`dist/assets/${jsName}`, "utf8");
const updated = original.replaceAll(companies[0].name, "更新テスト会社");
assert.notEqual(original, updated);
await writeFile(`${fixture}/assets/${newName}`, updated);
const html = (await readFile("dist/index.html", "utf8")).replaceAll(
  jsName,
  newName,
);
await writeFile(`${fixture}/index.html`, html);
const revision = createHash("md5").update(html).digest("hex");
const worker = (await readFile("dist/sw.js", "utf8"))
  .replaceAll(jsName, newName)
  .replace(
    /"revision":"[^"]+","url":"index.html"/,
    `"revision":"${revision}","url":"index.html"`,
  );
await writeFile(`${fixture}/sw.js`, worker);
let root = resolve("dist");
const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webmanifest": "application/manifest+json",
};
const server = createServer(async (req, res) => {
  try {
    let pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    if (prefix && pathname === prefix) { res.writeHead(301, {Location: prefix+'/'}).end(); return; }
    if (prefix && !pathname.startsWith(prefix+'/')) { unexpectedPaths.push(pathname); res.writeHead(404).end(); return; }
    pathname = pathname.slice(prefix.length);
    const file = resolve(
      root,
      "." + (pathname === "/" ? "/index.html" : pathname),
    );
    if (!file.startsWith(root + sep)) {
      res.writeHead(403).end();
      return;
    }
    res.setHeader(
      "Content-Type",
      mime[extname(file)] || "application/octet-stream",
    );
    res.setHeader("Cache-Control", "no-store");
    res.end(await readFile(file));
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}${prefix}`;
const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL || "msedge",
});
const errors = [];
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
});
const page = await context.newPage();
page.on("pageerror", (e) => errors.push(e.message));
const go = (route) => page.goto(`${base}/#${route}`);
const ready = () =>
  expect(page.locator(".pwa-status").first()).toContainText(
    "オフライン準備完了",
    { timeout: 20000 },
  );
const login = async (p) => {
  await p
    .getByLabel("見学用パスワード")
    .fill(process.env.TEST_PASSWORD || "factory2026");
  await p.getByRole("button", { name: "見学ガイドをひらく" }).click();
};
try {
  await go("/");
  await login(page);
  await ready();
  const manifest = await (
    await context.request.get(`${base}/manifest.webmanifest`)
  ).json();
  assert.equal(manifest.display, "standalone");
  assert.equal(new URL(manifest.start_url, base+'/manifest.webmanifest').pathname, prefix+'/');
  assert.equal(await page.evaluate(async () => (await navigator.serviceWorker.ready).scope),base+'/');
  assert.ok(
    manifest.icons.some(
      (i) => i.sizes === "512x512" && i.purpose === "maskable",
    ),
  );
  await go("/learning");
  await page.getByRole("checkbox").first().check();
  await page.reload();
  await expect(page.getByRole("checkbox").first()).toBeChecked();
  await page.screenshot({
    path: "test-results/learning-mobile.png",
    fullPage: true,
  });
  await go("/seats");
  await expect(page.locator(".seat")).toHaveCount(100);
  await page.screenshot({
    path: "test-results/seats-mobile.png",
    fullPage: true,
  });
  // Fresh tabs must be able to log in offline after precache completion.
  await context.setOffline(true);
  const offline = await context.newPage();
  await offline.goto(base+'/');
  await login(offline);
  await expect(
    offline.getByRole("heading", { name: "県外企業見学", exact: true }),
  ).toBeVisible();
  await offline.close();
  for (const route of [
    "/",
    "/schedule",
    "/companies",
    `/companies/${companies[0].id}`,
    "/guide",
    "/announcements",
    "/seats",
    "/learning",
    "/sightseeing",
  ]) {
    await go(route);
    await page.reload();
    await expect(page.locator("main h1")).toBeVisible();
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      route,
    );
    const missingImages = await page
      .locator("img")
      .evaluateAll((imgs) => imgs.some((i) => !i.complete || !i.naturalWidth));
    assert.equal(missingImages, false, route);
  }
  await go("/learning");
  await page.getByRole("checkbox").first().uncheck();
  await page.reload();
  await expect(page.getByRole("checkbox").first()).not.toBeChecked();
  await context.setOffline(false);
  await ready();
  // An actual second SW version and changed app bundle should prompt, then activate.
  root = fixture;
  await go("/settings");
  await page.getByRole("button", { name: "キャッシュ・更新を確認" }).click();
  await expect(
    page.getByRole("button", { name: "更新を適用" }).first(),
  ).toBeVisible({ timeout: 20000 });
  await page.getByRole("button", { name: "更新を適用" }).first().click();
  await page.waitForLoadState("networkidle");
  await go("/companies");
  await expect(
    page.getByRole("heading", { name: "更新テスト会社", exact: true }),
  ).toBeVisible();
  await go("/learning");
  await expect(page.getByRole("checkbox").first()).not.toBeChecked();
  await ready();
  // Cache deletion must retract readiness and permit re-preparation.
  await page.evaluate(async () => {
    for (const key of await caches.keys())
      if (key.startsWith("factory-visit")) await caches.delete(key);
  });
  await go("/settings");
  await page.getByRole("button", { name: "キャッシュ・更新を確認" }).click();
  await expect(page.locator(".pwa-status").first()).toContainText(
    "オフライン未準備",
  );
  await page.getByRole("button", { name: "オフラインを再準備" }).click();
  await page.waitForLoadState("networkidle");
  await ready();
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator("main h1")).toBeVisible();
  await context.setOffline(false);
  // Failure path: keep checklist changes across SPA navigation, then retry persistence.
  await go("/learning");
  await page.evaluate(() => {
    window.originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) {
      if (k.startsWith("factory-visit:learning"))
        throw new DOMException("full", "QuotaExceededError");
      return window.originalSetItem.call(this, k, v);
    };
  });
  await page.getByRole("checkbox").first().check();
  await expect(page.getByRole("alert")).toContainText("端末に保存できません");
  await go("/companies");
  await go("/learning");
  await expect(page.getByRole("checkbox").first()).toBeChecked();
  await page.evaluate(
    () => (Storage.prototype.setItem = window.originalSetItem),
  );
  await page.getByRole("button", { name: "保存を再試行" }).click();
  await page.reload();
  await expect(page.getByRole("checkbox").first()).toBeChecked();
  const fresh = await browser.newContext({ offline: true });
  const cold = await fresh.newPage();
  await assert.rejects(() => cold.goto(base));
  await fresh.close();
  assert.deepEqual(errors, []);
  assert.deepEqual(unexpectedPaths, [], 'No assets should escape the deployment directory');
  console.log(
    "PASS: manifest, precache readiness, offline login/reload/images/9 routes, checklist persistence/offline edits, 100 train positions, real SW update with changed content, checklist retained, cache loss and repair, storage failure/retry, cold offline failure.",
  );
} finally {
  await browser.close();
  await new Promise((r) => server.close(r));
}

