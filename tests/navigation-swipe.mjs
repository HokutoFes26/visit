import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'});
try {
 await page.goto(process.env.TEST_URL || 'http://127.0.0.1:4174');
 await page.getByLabel('見学用パスワード').fill('factory2026');
 await page.getByRole('button',{name:'見学ガイドをひらく'}).click();
 const schedule=await page.locator('.overview-grid').boundingBox();
 const notice=await page.locator('.priority-notices').boundingBox();
 assert(schedule.y+schedule.height<=notice.y);
 const cdp=await page.context().newCDPSession(page);
 async function swipe(dx,dy=0){
  const b=await page.locator('.bottom-nav').boundingBox();const x=195,y=b.y+25;
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
  for(let n=1;n<=5;n++) {await page.waitForTimeout(40);await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+dx*n/5,y:y+dy*n/5}]});}
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await page.waitForTimeout(700);
 }
 const path=()=>new URL(page.url()).hash;
 await swipe(-110);assert.equal(path(),'#/schedule');
 await swipe(-110);assert.equal(path(),'#/companies');
 await swipe(110);assert.equal(path(),'#/schedule');
 await swipe(25);assert.equal(path(),'#/schedule');
 await swipe(0,-65);assert.equal(path(),'#/schedule');await page.waitForTimeout(1000);
 await page.locator('.bottom-nav a').first().tap();await page.waitForURL('**/#/');assert.equal(path(),'#/');
 await swipe(110);assert.equal(path(),'#/');
 await page.locator('.bottom-nav a').last().tap();await page.waitForURL('**/#/more');assert.equal(path(),'#/more');
 await swipe(-110);assert.equal(path(),'#/more');
 await page.goto(new URL('/#/companies/'+JSON.parse(await (await import('node:fs/promises')).readFile('src/data/companies.json','utf8'))[0].id,page.url()).href);
 await swipe(-110);assert.equal(path(),'#/sightseeing');
 await page.goto(new URL('/#/settings',page.url()).href);await swipe(110);assert.equal(path(),'#/sightseeing');
 await page.locator('.bottom-nav a').first().tap();
 await page.screenshot({path:'test-results/revision-02-mobile.png',fullPage:true});
 console.log('PASS: schedule before notices, real touch left/right swipes, short/vertical gestures, boundary tabs, tap navigation, nested routes.');
}finally{await browser.close();}

