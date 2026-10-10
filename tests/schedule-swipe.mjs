import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'msedge',headless:true});
try {
 const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
 await page.goto('http://127.0.0.1:4174');
 await page.getByLabel('見学用パスワード').fill('factory2026');
 await page.getByRole('button',{name:'見学ガイドをひらく'}).click();
 await page.locator('.bottom-nav a').nth(1).click();
 const buttons=page.locator('.day-tabs button');
 await buttons.first().click();
 const selected=()=>page.locator('.day-tabs .selected').getAttribute('aria-label');
 const labels=await buttons.evaluateAll(els=>els.map(e=>e.getAttribute('aria-label')));
 const cdp=await page.context().newCDPSession(page);
 async function swipe(dx,dy=0){
  await page.evaluate(()=>window.scrollTo(0,0));
  const x=195,y=450;
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
  for(let i=1;i<=5;i++){await page.waitForTimeout(40);await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+dx*i/5,y:y+dy*i/5}]});}
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await page.waitForTimeout(700);
 }
 await swipe(-110);assert.equal(await selected(),labels[1]);
 await swipe(110);assert.equal(await selected(),labels[0]);
 await swipe(110);assert.equal(await selected(),labels[0]);
 await swipe(25);assert.equal(await selected(),labels[0]);
 await swipe(0,-90);assert.equal(await selected(),labels[0]);
 await buttons.last().click();assert.equal(await selected(),labels.at(-1));
 await swipe(-110);assert.equal(await selected(),labels.at(-1));
 assert.equal(new URL(page.url()).hash,'#/schedule');
 console.log('PASS: day swipe both directions, boundaries, short/vertical gestures, date buttons, route unchanged.');
}finally{await browser.close();}
