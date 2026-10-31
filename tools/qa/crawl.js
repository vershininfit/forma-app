const {chromium}=require('playwright');const fs=require('fs');const check=require('./checks');
const URL0='http://127.0.0.1:8765/';
const ENUM=`(()=>{const vw=innerWidth,vh=innerHeight;const L=[...document.querySelectorAll('button,a[href],[onclick],[role=button],[data-a],[data-l]')];
 return L.map((el,i)=>{const r=el.getBoundingClientRect();if(r.width<1||r.height<1)return null;const cs=getComputedStyle(el);if(cs.visibility==='hidden'||cs.pointerEvents==='none')return null;
  if(r.bottom<=0||r.top>=vh||r.right<=0||r.left>=vw)return null;let n=el;while(n&&n.nodeType===1){const c=getComputedStyle(n);if(+c.opacity<0.05||c.display==='none')return null;n=n.parentElement}
  const cx=Math.min(Math.max(r.left+r.width/2,1),vw-2),cy=Math.min(Math.max(r.top+r.height/2,1),vh-2);const t=document.elementFromPoint(cx,cy);const cov=!(t&&(t===el||el.contains(t)||t.contains(el)));
  return {i,txt:(el.innerText||el.getAttribute('aria-label')||el.title||el.dataset.a||'').trim().replace(/\\s+/g,' ').slice(0,40),cov,x:cx,y:cy}}).filter(Boolean)})()`;
async function mk(b,st,vp){const ctx=await b.newContext({viewport:vp||{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,locale:'ru-RU',timezoneId:'Europe/Moscow'});
 await ctx.addInitScript(st=>{if(!sessionStorage.getItem('__s')){localStorage.clear();for(const k in st)localStorage.setItem(k,st[k]);sessionStorage.setItem('__s','1')}},st);
 const p=await ctx.newPage();const log=[];p.on('pageerror',e=>log.push('PAGEERR '+(e.message).slice(0,250)));p.on('console',m=>{if(m.type()==='error')log.push('CONSOLE '+m.text().slice(0,250))});
 p.on('dialog',async d=>{log.push('DIALOG '+d.type()+': '+d.message().slice(0,120));try{await d.dismiss()}catch(e){}});
 await p.goto(URL0,{waitUntil:'load'});await p.waitForTimeout(2200);return {ctx,p,log}}
async function af(p){const h=await p.$('iframe.on');return h?await h.contentFrame():p.mainFrame()}
async function nav(p,steps){for(const s of steps){const f=await af(p);try{
  if(s.startsWith('tab:'))await f.locator(`button.tab[aria-label="${s.slice(4)}"]`).first().click({timeout:3000});
  else if(s.startsWith('text:'))await f.getByText(s.slice(5),{exact:true}).locator('visible=true').first().click({timeout:3000});
  else if(s.startsWith('ptext:'))await f.getByText(s.slice(6)).locator('visible=true').first().click({timeout:3000});
  else await f.click(s,{timeout:3000});}catch(e){return 'NAVFAIL '+s}await p.waitForTimeout(1100)}
 /* окно новой медали (всплывает в Прогрессе) закрываем, иначе оно перекрывает все кнопки */
 await p.waitForTimeout(600);for(const fx of [p.mainFrame(),await af(p)]){try{if(await fx.$('#mdOv.on')){await fx.locator('#mdOv').getByText('Отлично',{exact:true}).first().click({timeout:2000});await p.waitForTimeout(700)}}catch(e){}}}
async function sig(p){const f=await af(p);const fr=await p.evaluate(()=>{const e=document.querySelector('iframe.on');return e?[...document.querySelectorAll('iframe')].indexOf(e):-1});
 const body=await f.evaluate(()=>{const v=[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&r.bottom>0&&r.top<innerHeight&&getComputedStyle(e).visibility!=='hidden'&&+getComputedStyle(e).opacity>0.05});return v.length+':'+(document.body.innerText||'').length+':'+document.querySelectorAll('.on,.open,.sel').length+':'+v.slice(0,400).map(e=>e.className).join('').length});
 const sh=await p.evaluate(()=>[...document.body.children].filter(e=>e.tagName!=='IFRAME'&&e.getBoundingClientRect().height>0&&getComputedStyle(e).visibility!=='hidden').map(e=>e.id+e.className).join(',')+document.body.innerText.length);
 return fr+'|'+body+'|'+sh}
async function run(route,st,b){const {ctx,p,log}=await mk(b,st);const nf=await nav(p,route.steps);const f=await af(p);const list=await f.evaluate(ENUM);await ctx.close();
 const res={route:route.name,nav:nf||'ok',n:list.length,items:[]};
 for(const it of list){ if(/Стереть все данные|Удалить все/i.test(it.txt))continue;
  const {ctx,p,log}=await mk(b,st);await nav(p,route.steps);const f=await af(p);const before=await sig(p);
  let clickErr=null;try{const h=(await f.$$('button,a[href],[onclick],[role=button],[data-a],[data-l]'))[it.i];if(!h)clickErr='gone';else await h.click({timeout:2500})}catch(e){clickErr=e.message.split('\n')[0].slice(0,140)}
  await p.waitForTimeout(1100);const after=await sig(p);
  let ck=null;try{const f2=await af(p);ck=await f2.evaluate(`(${check.toString()})()`)}catch(e){}
  const issues=[];if(ck){if(ck.hscroll)issues.push('hscroll '+ck.hscroll);if(Object.keys(ck.offscale).length)issues.push('offscale '+JSON.stringify(ck.offscale));if(ck.tech.length)issues.push('tech '+ck.tech.join(';'));if(ck.offscreen.length)issues.push('offscreen '+ck.offscreen.join(';'));if(ck.clipped.length)issues.push('clipped '+ck.clipped.join(';'));if(ck.broken.length)issues.push('broken '+ck.broken.join(';'));if(Object.keys(ck.weight).length)issues.push('weight '+JSON.stringify(ck.weight));if(ck.italic.length)issues.push('italic '+ck.italic.join(';'))}
  const shot=`cr-${route.name}-${it.i}.png`;await p.screenshot({path:'crawl/'+shot});
  res.items.push({i:it.i,txt:it.txt,cov:it.cov,clickErr,changed:before!==after,log:[...log],issues,shot});
  await ctx.close();}
 return res}
(async()=>{const routes=JSON.parse(fs.readFileSync(process.argv[2]));const out=process.argv[3];fs.mkdirSync('crawl',{recursive:true});const b=await chromium.launch();const all=[];
 for(const r of routes){const st=JSON.parse(fs.readFileSync(r.state));const t=Date.now();const res=await run(r,st,b);all.push(res);fs.writeFileSync(out,JSON.stringify(all,null,1));console.log(r.name,res.n,'items',Math.round((Date.now()-t)/1000)+'s')}
 await b.close()})();
