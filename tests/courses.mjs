import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const base = process.env.TEST_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'msedge', headless: true });
const errors = [];
try {
  for (const course of ['i', 'k']) {
    const context = await browser.newContext();
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${base}/?c=${course}`, { waitUntil: "domcontentloaded" });
    await page.locator('#password').fill(process.env.TEST_PASSWORD || 'factory2026');
    await page.locator('button[type="submit"]').click();
    await page.locator('main').waitFor();
    await page.goto(`${base}/?c=${course}#/seats`, { waitUntil: "domcontentloaded" });
    await page.waitForURL('**#/guide');
    assert.equal(await page.getByRole('heading', { name: '見学ガイド', exact: true }).count(), 1);
    assert.equal(await page.locator('a[href="#/seats"]').count(), 0);
    await page.getByRole('button', { name: 'EN', exact: true }).first().click();
    const companies = JSON.parse(fs.readFileSync(`src/data/${course}/companies.json`, 'utf8'));
    const routes = ['/', '/schedule', '/companies', '/guide', '/learning', '/sightseeing', '/more', '/announcements', '/settings', ...companies.map(c => `/companies/${c.id}`)];
    const check = async route => {
      const text = await page.locator('main').innerText();
      assert.ok(!/[一-龯ぁ-んァ-ヶ]/.test(text.replaceAll('日本語', '')), `${course} ${route}: untranslated text: ${text}`);
      if (!(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))) await page.screenshot({path: "test-results/overflow.png", fullPage: true});
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${course} ${route}: horizontal overflow ${JSON.stringify(await page.evaluate(() => [...document.querySelectorAll("main *")].filter(el => el.scrollWidth > el.clientWidth + 1).map(el => ({ tag: el.tagName, cls: el.className, text: el.textContent.slice(0, 100), right: el.getBoundingClientRect().right, scroll: el.scrollWidth, client: el.clientWidth })).slice(-20)))}`);
    };
    for (const width of [390, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of routes) {
        await page.goto(`${base}/?c=${course}#${route}`, { waitUntil: "domcontentloaded" });
        await page.locator('main').waitFor();
        await check(route);
        if (route === '/schedule') {
          const days = page.locator('.day-tabs button');
          for (let i = 0; i < await days.count(); i++) {
            await days.nth(i).click();
            const stops = page.locator('main button[aria-expanded]').first();
            if (await stops.count() && await stops.getAttribute('aria-expanded') === 'false') await stops.click();
            await check(route);
          }
        }
        if (route.startsWith('/companies/')) {
          for (const button of await page.locator('main button[aria-expanded="false"]').all()) await button.click();
          await check(route);
        }
        if (route === '/guide') {
          if (course === 'k') assert.match(await page.locator('main').innerText(), /choose your seat on both the Shinkansen and the bus/);
          fs.mkdirSync('test-results', { recursive: true });
          await page.screenshot({ path: `test-results/guide-${course}-en-${width}.png`, fullPage: true });
        }
      }
    }
    await page.goto(`${base}/?c=${course}#/settings`);
    await page.getByRole('button', { name: 'Switch course', exact: true }).click();
    await page.getByRole('button', { name: course === 'k' ? 'Electronics' : 'International', exact: true }).click();
    await page.waitForFunction(expected => localStorage.getItem('factory-visit:course') === expected, course === 'k' ? 'i' : 'k');
    await page.locator('main').waitFor();
    await check('/settings (after switch)');
    await context.close();
  }
  assert.deepEqual(errors, []);
  console.log('PASS: both courses, legacy seating URL redirect to guide, English on all main routes and company details, every schedule day, expanded content, mobile/desktop layout and course switching.');
} finally {
  await browser.close();
}
