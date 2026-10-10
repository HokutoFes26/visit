import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL || "msedge",
  headless: true,
});
const page = await browser.newPage({
  viewport: { width: 1280, height: 1000 },
  colorScheme: "light",
  reducedMotion: "reduce",
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const base = process.env.TEST_URL || "http://127.0.0.1:4173";
const toggleLanguage = async () =>
  page.getByRole("button", { name: "EN", exact: true }).first().click();
try {
  await page.goto(base);
  await toggleLanguage();
  await page
    .getByRole("heading", {
      name: "Company visits outside Toyama",
      exact: true,
    })
    .waitFor();
  await page.getByRole("button", { name: "Dark mode", exact: true }).click();
  assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
  await page.reload();
  assert.equal(await page.locator("html").getAttribute("lang"), "en");
  assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
  await page.getByLabel("Visit password").fill("factory2026");
  await page.getByRole("button", { name: "Open visit guide" }).click();
  await page.locator("main").waitFor();
  for (const width of [360, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of [
      "/",
      "/schedule",
      "/companies",
      "/companies/members",
      "/guide",
      "/seats",
      "/learning",
      "/sightseeing",
      "/more",
      "/announcements",
      "/settings",
    ]) {
      await page.goto(base + "/#" + route);
      await page.locator("main").waitFor();
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${width} ${route} overflows`,
      );
      if (route === "/settings") {
        assert.ok(await page.locator("main .expanded .theme-switch span").evaluate(el => el.getBoundingClientRect().height < 30), "Expanded theme label must stay on one line");
      }
      const text = await page.locator("main").innerText();
      assert.ok(
        !/[一-龯ぁ-んァ-ヶ]/.test(text.replaceAll("日本語", "")),
        `Untranslated text on ${route}: ${text}`,
      );
    }
  }
  await page.goto(base + "/#/learning");
  await page.getByRole("checkbox").first().check();
  await page
    .getByRole("button", { name: "日本語", exact: true })
    .first()
    .click();
  assert.equal(await page.getByRole("checkbox").first().isChecked(), true);
  await toggleLanguage();
  await page
    .getByRole("button", { name: "Dark mode", exact: true })
    .first()
    .click();
  assert.equal(await page.locator("html").getAttribute("data-theme"), "light");
  await page.goto(base + "/");
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.screenshot({
    path: "test-results/company-en-light.png",
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Dark mode", exact: true })
    .first()
    .click();
  await page.screenshot({
    path: "test-results/company-en-dark.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 900 });
  await page.screenshot({
    path: "test-results/company-en-dark-mobile.png",
    fullPage: true,
  });
  assert.deepEqual(errors, []);
  console.log(
    "PASS: translation on 11 routes × 4 widths, theme, persisted preferences, preserved checklist, browser errors.",
  );
} catch (e) {
  console.log(page.url(), errors, await page.locator("body").innerText());
  throw e;
} finally {
  await browser.close();
}
