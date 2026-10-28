const {open,active}=require('./lib');
async function runOnb(p,log,shots,pick){
  pick=Object.assign({'Что нужно учесть?':'Ничего из этого'},pick||{});
  let f=await active(p); await f.click('#orb'); await p.waitForTimeout(900);
  const steps=[];
  for(let s=0;s<40;s++){
    f=await active(p);
    const info=await f.evaluate(()=>{const L=document.querySelector('.scr.live');if(!L)return null;
      const vis=e=>{const r=e.getBoundingClientRect();if(!(r.width>0&&r.height>0)||e.classList.contains('gone'))return false;const y=Math.min(Math.max(r.top+r.height/2,0),innerHeight-1);const t=document.elementFromPoint(r.left+r.width/2,y);return !!t&&(t===e||e.contains(t))};
      const h=[...L.querySelectorAll('h1,h2,.q')].filter(vis).map(e=>e.innerText.trim())[0]||'';
      const opts=[...L.querySelectorAll('button.opt,button.chip,.opt')].filter(vis);
      const inputs=[...L.querySelectorAll('input,textarea')].filter(vis).map(i=>({id:i.id,type:i.type,ph:i.placeholder,v:i.value}));
      return {h,nOpt:opts.length,nOn:opts.filter(o=>o.classList.contains('on')).length,optTxt:opts.map(o=>o.innerText.split('\n')[0]).slice(0,8),inputs,cta:!!document.getElementById('cta'),ctaDis:document.getElementById('cta')?.disabled}});
    if(!info){ console.log('NO LIVE SECTION at',s); return steps; }
    steps.push(info);
    if(shots) await p.screenshot({path:`onb-${String(s).padStart(2,'0')}.png`});
    console.log('STEP',s,info.h,'| opts',info.nOpt,'on',info.nOn,'| inputs',JSON.stringify(info.inputs.map(i=>i.id+':'+i.ph)),'| ctaDis',info.ctaDis);
    for(const i of info.inputs){ if(!i.v && i.id){ let v='Тест QA'; if(i.type==='number'||/рост|вес|возраст|лет|кг|см/i.test(i.ph)) v=/рост|см/i.test(i.ph)?'170':/вес|кг/i.test(i.ph)?'70':'35'; try{await f.fill('#'+i.id,v)}catch(e){} } }
    if(info.nOpt && !info.nOn){ const want=pick[info.h]; await f.evaluate(w=>{const L=document.querySelector('.scr.live');const vis=e=>{const r=e.getBoundingClientRect();if(!(r.width>0&&r.height>0)||e.classList.contains('gone'))return false;const y=Math.min(Math.max(r.top+r.height/2,0),innerHeight-1);const t=document.elementFromPoint(r.left+r.width/2,y);return !!t&&(t===e||e.contains(t))};const o=[...L.querySelectorAll('button.opt,button.chip,.opt')].filter(vis);(o.find(x=>w&&x.innerText.includes(w))||o[0]).click()},want); await p.waitForTimeout(600); }
    await f.evaluate(()=>{const c=document.querySelector('.scr.live #cbW');if(c){const i=c.querySelector('input');if(i?!i.checked:!c.classList.contains('on'))c.click()}});await p.waitForTimeout(400);
    const before=info.h;
    const ok=await f.evaluate(()=>{const c=document.getElementById('cta');if(!c||c.disabled)return false;c.click();return true});
    if(!ok){ console.log('   cta disabled; stop'); return steps; }
    await p.waitForTimeout(1300);
    const f2=await active(p); if(f2!==f){ console.log('FRAME CHANGED after step',s); return steps; }
  }
  return steps;
}
module.exports={runOnb};
if(require.main===module)(async()=>{const {b,p,log}=await open();await runOnb(p,log,true);await p.waitForTimeout(2500);await p.screenshot({path:'after-onb.png'});console.log(JSON.stringify(log,null,1));
const st=await p.evaluate(()=>Object.fromEntries(Object.keys(localStorage).map(k=>[k,localStorage.getItem(k).length])));console.log(st);await b.close();})();
