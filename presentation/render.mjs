import {createRequire} from 'module';
import path from 'path';
import {fileURLToPath,pathToFileURL} from 'url';
import fs from 'fs';
const here=path.dirname(fileURLToPath(import.meta.url));
const require=createRequire(path.join(here,'../prototype/package.json'));
const {chromium}=require('playwright');
const out=path.join(here,'out');fs.mkdirSync(out,{recursive:true});
const names=['cover','problem','research','two-bets','before-after','part-a-flow','part-b-booking','part-b-trip','edge-states','languages','design-system','testing-next-steps'];
const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:1400,height:1000},deviceScaleFactor:2});
const page=await ctx.newPage();
await page.goto(pathToFileURL(path.join(here,'boards.html')).href,{waitUntil:'load'});
await page.evaluate(()=>document.fonts.ready);
await page.waitForTimeout(7000);
const boards=await page.$$('.board');
for(let i=0;i<boards.length;i++){
  await boards[i].screenshot({path:path.join(out,`${String(i+1).padStart(2,'0')}-${names[i]}.png`)});
}
await page.evaluate(()=>document.querySelector('#thumb').scrollIntoView());
await page.waitForTimeout(2500);
const r=await page.evaluate(()=>{const b=document.querySelector('#thumb').getBoundingClientRect();return {x:b.left,y:b.top}});
await page.screenshot({path:path.join(out,'cover-808x632.png'),clip:{x:Math.round(r.x),y:Math.round(r.y),width:808,height:632}});
await b.close();
