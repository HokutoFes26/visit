import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdir, readFile } from "node:fs/promises";

// Run against the production preview: npm run preview -- --port 4173
const base = process.env.TEST_URL || "http://127.0.0.1:4173";
const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL || "msedge",
  headless: true,
});
await mkdir("test-results", { recursive: true });
const errors = [];
const companies = JSON.parse(await readFile("src/data/i/companies.json", "utf8"));
const schedules = JSON.parse(await readFile("src/data/i/schedule.json", "utf8"));
const at = (s, field) => Date.parse(`${s.date}T${s[field]}:00+09:00`);
const page = await browser.newPage({
  viewport: { width: 1280, height: 1000 },
  timezoneId: "America/New_York",
});
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
const login = async (target = page) => {
  await target
    .getByLabel("見学用パスワード")
    .fill(process.env.TEST_PASSWORD || "factory2026");
  await target.getByRole("button", { name: "見学ガイドをひらく" }).click();
  await target.getByRole("heading", { name: "県外企業見学" }).waitFor();
};
try {
  await page.goto(base);
  await page.getByLabel("見学用パスワード").fill("incorrect");
  await page.getByRole("button", { name: "見学ガイドをひらく" }).click();
  assert.match(
    await page.getByRole("alert").innerText(),
    /パスワードが違います/,
  );
  await page
    .getByRole("button", { name: "パスワードを表示", exact: true })
    .click();
  assert.equal(
    await page.getByLabel("見学用パスワード").getAttribute("type"),
    "text",
  );
  await login();
  await page.reload();
  await page.getByRole("heading", { name: "県外企業見学" }).waitFor();
  for (const width of [360, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of [
      "/",
      "/schedule",
      "/companies",
      `/companies/${companies[0].id}`,
      "/guide",
      "/more",
      "/announcements",
      "/settings",
      "/sightseeing",
      "/seats",
      "/learning",
    ]) {
      await page.goto(`${base}/#${route}`);
      await page.locator("main h1").waitFor();
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        `Horizontal overflow at ${width}: ${route}`,
      );
    }
    await page.goto(`${base}/#/`);
    await page.screenshot({
      path: `test-results/home-${width}.png`,
      fullPage: true,
    });
  }
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page
    .getByRole("navigation", { name: "メインナビゲーション" })
    .getByRole("link", { name: "企業情報" })
    .click();
  await page.locator(".company-card").first().click();
  await page
    .getByRole("heading", { name: companies[0].name, exact: true })
    .waitFor();
  await page.getByRole("link", { name: "企業一覧", exact: false }).click();
  await page.goto(`${base}/#/companies/missing`);
  assert.match(await page.locator("main").innerText(), /企業が見つかりません/);

  // Check real JST instants with a browser configured to a different timezone.
  for (const instant of [
    at(schedules[0], "startTime") - 86400000,
    at(schedules[0], "startTime"),
    at(schedules.find(s => s.startTime && s.endTime), "startTime"),
    at(schedules.filter(s => s.endTime).at(-1), "endTime"),
  ]) {
    await page.clock.setFixedTime(new Date(instant));
    await page.goto(`${base}/#/schedule`);
    await page.reload();
    const day = schedules[0].date;
    const expected = schedules.filter(
      (s) =>
        s.date === day &&
        instant >= at(s, "startTime") &&
        instant < at(s, "endTime"),
    );
    assert.equal(
      await page.locator(".timeline-item.current").count(),
      expected.length,
    );
    if (expected.length)
      assert.ok(
        (
          await page.locator(".timeline-item.current").first().innerText()
        ).includes(expected[0].title),
      );
  }
  await page.goto(`${base}/#/`);
  await page.getByRole("button", { name: "ログアウト" }).click();
  await page.reload();
  await page.getByLabel("見学用パスワード").waitFor();
  await page.screenshot({
    path: "test-results/login-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 360, height: 800 });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await page.screenshot({
    path: "test-results/login-mobile.png",
    fullPage: true,
  });

  const blocked = await browser.newPage();
  await blocked.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("Storage disabled", "QuotaExceededError");
    };
  });
  await blocked.goto(base);
  await login(blocked);
  assert.match(
    await blocked.getByRole("alert").innerText(),
    /ログイン状態を保存できません/,
  );
  await blocked.close();
  assert.ok(
    schedules.every(
      (s) => !s.companyId || companies.some((c) => c.id === s.companyId),
    ),
  );
  assert.deepEqual(errors, [], "Browser console/page errors");
  console.log(
    "PASS: login, visibility, persistence, logout, navigation, 11 routes × 4 widths, missing company, JST boundaries, storage failure, data references, browser errors.",
  );
} finally {
  await browser.close();
}
