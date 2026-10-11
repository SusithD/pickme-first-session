import {createRequire} from 'module';
import path from 'path';
import {fileURLToPath,pathToFileURL} from 'url';
import fs from 'fs';
const here=path.dirname(fileURLToPath(import.meta.url));
const require=createRequire(path.join(here,'../prototype/package.json'));
const {chromium}=require('playwright');
const out=path.join(here,'out-linkedin');fs.mkdirSync(out,{recursive:true});
const names=['hero','before-after','flow','system-trust'];
const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:1700,height:1000},deviceScaleFactor:2});
const page=await ctx.newPage();
await page.goto(pathToFileURL(path.join(here,'linkedin.html')).href,{waitUntil:'load'});
await page.evaluate(()=>document.fonts.ready);
await page.waitForTimeout(7000);
const banners=await page.$$('.banner');
for(let i=0;i<banners.length;i++){
  await banners[i].scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await banners[i].screenshot({path:path.join(out,`${String(i+1).padStart(2,'0')}-${names[i]}.png`)});
}
await b.close();
