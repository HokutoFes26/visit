import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'msedge',headless:true});
try {
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'no-preference'});
 await page.goto('http://127.0.0.1:4174');
 await page.getByLabel('見学用パスワード').fill('factory2026');
 await page.getByRole('button',{name:'見学ガイドをひらく'}).click();
 const marker=page.locator('.tab-indicator');
 assert.equal(await marker.evaluate(el=>getComputedStyle(el).transitionDuration),'0.28s');
 await page.locator('.bottom-nav a').nth(1).click();
 await page.waitForTimeout(350);
 const a=await marker.boundingBox(),b=await page.locator('.bottom-nav a').nth(1).boundingBox();
 assert(Math.abs(a.x-b.x)<1);
 await page.screenshot({path:'test-results/tab-animation.png'});
 await page.emulateMedia({reducedMotion:'reduce'});
 assert.equal(await marker.evaluate(el=>getComputedStyle(el).transitionDuration),'0s');
 console.log('PASS: indicator alignment after navigation, animated transition, reduced motion.');
}finally{await browser.close();}
