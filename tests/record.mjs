import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:960,height:600},deviceScaleFactor:1});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.clock.install({time:new Date('2026-10-21T00:00:00Z')});await page.clock.pauseAt(new Date('2026-10-21T00:00:01Z'));await page.goto('http://localhost:5173/skyodyssey-gpt/?test');await page.click('#start');
const tick=async(ms)=>{for(let t=0;t<ms;t+=100)await page.clock.fastForward(Math.min(100,ms-t));};const state=()=>page.evaluate(()=>window.__flight.state);const set=v=>page.evaluate(v=>window.__flight.setState(v),v);
// Real renderer frames from deterministic live gameplay; cuts between seeded scenes, no fabricated frames.
fs.mkdirSync('docs/frames',{recursive:true});await page.evaluate(()=>window.__flight.setMission(0));let n=0;
async function capture(count){for(let i=0;i<count;i++){await tick(100);await page.screenshot({path:`docs/frames/${String(n++).padStart(4,'0')}.png`});}}
await set({x:0,y:34.1,z:620,yaw:0,pitch:0,roll:0,speed:28,throttle:1,vy:0,ground:true,crashed:false,landed:null});await page.keyboard.down('ArrowDown');await capture(40);await page.keyboard.up('ArrowDown');
await set({x:500,y:850,z:-1600,yaw:.3,pitch:0,roll:0,speed:65,throttle:.65,vy:0,ground:false,landed:null});await page.keyboard.press('KeyC');await page.keyboard.down('ArrowLeft');await capture(40);await page.keyboard.up('ArrowLeft');await page.keyboard.press('KeyC');await page.keyboard.press('KeyC');
await set({x:2450,y:114,z:-3380,yaw:0,pitch:-.09,roll:0,speed:34,throttle:.25,vy:-3,ground:false,landed:null});await page.keyboard.down('ArrowUp');await capture(10);await page.keyboard.up('ArrowUp');await capture(20);await page.keyboard.down('KeyS');await page.keyboard.down('Space');await capture(10);await page.keyboard.up('KeyS');await page.keyboard.up('Space');console.log('Recorded 120 actual gameplay frames / 12 seconds');await browser.close();


