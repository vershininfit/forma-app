const {chromium}=require('playwright');
const URL0='http://127.0.0.1:8765/';
async function open(opts={}){
  const b=await chromium.launch();
  const vp=opts.vp||{width:390,height:844};
  const ctx=await b.newContext({viewport:vp,deviceScaleFactor:opts.dpr||2,isMobile:true,hasTouch:true,locale:'ru-RU',timezoneId:'Europe/Moscow',...(opts.ctx||{})});
  if(opts.state) await ctx.addInitScript(st=>{ if(!sessionStorage.getItem('__seeded')){ for(const k in st) localStorage.setItem(k,st[k]); sessionStorage.setItem('__seeded','1'); } }, opts.state);
  const p=await ctx.newPage(); const log=[];
  p.on('console',m=>{if(m.type()==='error')log.push({k:'console',t:m.text().slice(0,300),u:m.location().url?.slice(-40)})});
  p.on('pageerror',e=>log.push({k:'pageerror',t:(e.stack||e.message).slice(0,400)}));
  p.on('requestfailed',r=>log.push({k:'reqfail',t:r.url()+' '+(r.failure()&&r.failure().errorText)}));
  p.on('response',r=>{if(r.status()>=400)log.push({k:'http',t:r.status()+' '+r.url()})});
  await p.goto(URL0,{waitUntil:'load'}); await p.waitForTimeout(opts.wait||2500);
  return {b,ctx,p,log};
}
async function active(p){
  const h=await p.$('iframe.on'); return h? await h.contentFrame():p.mainFrame();
}
async function clickables(f){
  return await f.evaluate(()=>{
    const out=[];const vw=innerWidth,vh=innerHeight;
    document.querySelectorAll('button,a,[onclick],[role=button],.btn,input,select,textarea,[data-act],[tabindex]').forEach((el,i)=>{
      const r=el.getBoundingClientRect(); const cs=getComputedStyle(el);
      if(r.width<1||r.height<1||cs.visibility==='hidden'||cs.display==='none'||+cs.opacity===0)return;
      if(r.bottom<0||r.top>vh||r.right<0||r.left>vw)return;
      const cx=r.left+r.width/2,cy=r.top+r.height/2; const top=document.elementFromPoint(Math.min(Math.max(cx,0),vw-1),Math.min(Math.max(cy,0),vh-1));
      out.push({i,tag:el.tagName,id:el.id,cls:(el.className&&el.className.baseVal!==undefined?el.className.baseVal:el.className||'').toString().slice(0,40),txt:(el.innerText||el.value||el.getAttribute('aria-label')||el.title||'').trim().replace(/\s+/g,' ').slice(0,40),x:Math.round(r.left),y:Math.round(r.top),w:Math.round(r.width),h:Math.round(r.height),covered:top&&top!==el&&!el.contains(top)&&!top.contains(el)});
    });return out;});
}
module.exports={open,active,clickables,URL0};
