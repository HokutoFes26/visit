import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, readFile } from 'node:fs/promises';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ reducedMotion: 'reduce' });
const base = process.env.TEST_URL || 'http://127.0.0.1:4173';
await mkdir('test-results', { recursive: true });
try {
  await page.goto(base);
  await page.getByLabel('見学用パスワード').fill('factory2026');
  await page.getByRole('button', {name:'見学ガイドをひらく'}).click();
  for (const theme of ['light','dark']) {
    await page.evaluate(theme => document.documentElement.dataset.theme=theme, theme);
    for (const width of [360,390,768,1280]) {
      await page.setViewportSize({width,height:1000});
      const nav = page.locator('.bottom-nav');
      if (width <= 850) {
        for (const link of await nav.locator('a').all()) {
          const b = await link.boundingBox();
          assert(b && b.x >= 0 && b.x+b.width <= width+1, 'Every mobile navigation item stays inside viewport');
        }
      }
      assert(await page.locator('.now-card').isVisible());
      await page.screenshot({path:`test-results/refined-${theme}-${width}.png`,fullPage:true});
    }
  }
  const schedules=JSON.parse(await readFile('src/data/schedule.json','utf8'));
  const item=schedules.find(s=>s.startTime && s.endTime);
  await page.clock.install({time:new Date(`${item.date}T${item.startTime}:30+09:00`)});
  await page.goto(`${base}/#/schedule`);
  await page.getByRole('button',{name:'現在の予定へ'}).click();
  await page.locator('.timeline-item.current').waitFor();
  assert(await page.locator('.timeline-item.current').evaluate(el=>document.activeElement===el));
  console.log('PASS: both themes at four widths, all bottom navigation items visible, current activity jump and focus.');
} finally {await browser.close();}
