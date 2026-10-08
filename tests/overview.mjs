import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const data = async (name) =>
  JSON.parse(await readFile(`src/data/${name}.json`, "utf8"));
const [event, schedule, seats] = await Promise.all(
  ["event", "schedule", "seats"].map(data),
);
assert.equal(event.date, "2026-10-21");
assert.equal(event.endDate, "2026-10-23");
assert.equal(seats.seats.filter((s) => s.groupId === "participant").length, 39);
assert.deepEqual(
  seats.seats.filter((s) => s.groupId === "teacher").map((s) => s.number),
  ["8D", "8E", "9D"],
);
assert.deepEqual(
  seats.seats.filter((s) => s.groupId === "luggage").map((s) => s.number),
  ["1D", "1E"],
);
assert.equal(seats.seats.filter((s) => s.groupId === "unavailable").length, 56);
assert.equal(schedule.find((s) => s.id === "train").endTime, "11:36");
assert.equal(schedule.find((s) => s.id === "nec-visit").endTime, "12:00");
assert.equal(schedule.find((s) => s.id === "umihotaru").startTime, null);
const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL || "msedge",
});
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  timezoneId: "America/New_York",
});
const base = process.env.TEST_URL || "http://127.0.0.1:4173";
try {
  await page.goto(base);
  await page
    .getByLabel("見学用パスワード")
    .fill(process.env.TEST_PASSWORD || "factory2026");
  await page.getByRole("button", { name: "見学ガイドをひらく" }).click();
  await page.goto(base + "/#/schedule");
  const days = [...new Set(schedule.map((s) => s.date))];
  await expect(page.locator(".day-tabs button")).toHaveCount(3);
  for (let i = 0; i < days.length; i++) {
    await page.locator(".day-tabs button").nth(i).click();
    await expect(page.locator(".timeline-item")).toHaveCount(
      schedule.filter((s) => s.date === days[i]).length,
    );
    await page.screenshot({
      path: `test-results/overview-day-${i + 1}.png`,
      fullPage: true,
    });
  }
  await page.clock.setFixedTime(new Date("2026-10-22T01:00:00Z"));
  await page.reload();
  await expect(page.locator(".day-tabs button").nth(1)).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.locator(".timeline-item.current")).toContainText(
    "エスユーエス見学",
  );
  await page.clock.setFixedTime(new Date("2026-10-22T03:00:00Z"));
  await page.reload();
  await expect(page.locator(".timeline-item.current")).toHaveCount(0);
  await page.goto(base + "/#/guide");
  await expect(page.locator("main")).toContainText("22:00以降");
  await expect(page.locator("main")).toContainText("ツイン14部屋");
  await page.goto(base + "/#/seats");
  await page.getByText("配布資料の座席図を確認", { exact: true }).click();
  await expect
    .poll(() =>
      page
        .locator("details img")
        .evaluate((i) => i.complete && i.naturalWidth > 0),
    )
    .toBe(true);
  await page.screenshot({
    path: "test-results/train-overview.png",
    fullPage: true,
  });
  console.log(
    "PASS: source dates, three day tabs, second-day live schedule, unknown times not current, rules, 39 passenger positions, teacher/luggage/cross mapping, source seat image.",
  );
} finally {
  await browser.close();
}
