const {open,active}=require('./lib');const fs=require('fs');const check=require('./checks');
const ROUTES=[['Главная',[]],['Тренировки',[]],['Тренировки',['text:Прогресс']],['Тренировки',['text:Готовые']],['Тренировки',['text:Библиотека']],['Тренер',[]],['Профиль',[]]];
async function act(p,a){const f=await active(p);try{ if(a.startsWith('text:')) await f.getByText(a.slice(5),{exact:true}).locator('visible=true').first().click({timeout:3000}); else await f.click(a,{timeout:3000});}catch(e){return 'FAIL '+a}await p.waitForTimeout(1200);}
async function auditAll(st,vp,tag,routes){routes=routes||ROUTES;const {b,p,log}=await open({state:st,vp});const res={};
 for(const [tab,sub] of routes){const f0=await active(p);try{await f0.locator('button.tab',{hasText:tab}).or(f0.locator(`button.tab[aria-label="${tab}"]`)).first().click({timeout:3000})}catch(e){res[tab]='TABFAIL';continue}
  await p.waitForTimeout(1300);for(const a of sub){const r=await act(p,a);if(r)console.log(r)}
  const f=await active(p);const key=tab+(sub.length?'/'+sub.join('/').replace(/text:/g,''):'');
  res[key]=await f.evaluate(`(${check.toString()})()`);
  await p.screenshot({path:`shot-${tag}-${key.replace(/[\/ ]/g,'_')}.png`});
  // scroll to bottom too
  await f.evaluate(()=>{const s=[...document.querySelectorAll('*')].filter(e=>e.scrollHeight>e.clientHeight+20&&/auto|scroll/.test(getComputedStyle(e).overflowY));s.forEach(e=>e.scrollTop=e.scrollHeight);scrollTo(0,1e6)});await p.waitForTimeout(600);
  await p.screenshot({path:`shot-${tag}-${key.replace(/[\/ ]/g,'_')}-bottom.png`});
  res[key+' (низ)']=await f.evaluate(`(${check.toString()})()`);
  await f.evaluate(()=>{document.querySelectorAll('*').forEach(e=>{if(e.scrollTop)e.scrollTop=0});scrollTo(0,0)});
 }
 res.__log=log;await b.close();return res;}
module.exports={auditAll};
if(require.main===module)(async()=>{const st=JSON.parse(fs.readFileSync(process.argv[2]));const tag=process.argv[3]||'a';const vp=process.argv[4]?{width:+process.argv[4].split('x')[0],height:+process.argv[4].split('x')[1]}:undefined;
 const r=await auditAll(st,vp,tag);fs.writeFileSync(`audit-${tag}.json`,JSON.stringify(r,null,1));
 for(const k in r){if(k==='__log'){console.log('LOG',JSON.stringify(r[k]));continue}const v=r[k];if(typeof v==='string'){console.log(k,v);continue}
  const s=[];for(const f of ['hscroll','offscale','weight','italic','smallTap','clipped','tech','broken','ease','dur','grey','gradient','offscreen','radius','contrast']){const x=v[f];if(x&&(Array.isArray(x)?x.length:typeof x==='object'?Object.keys(x).length:x))s.push(f+'='+JSON.stringify(x))}
  console.log('##',k,'fonts:',v.fonts&&v.fonts.join('/'),'fam:',JSON.stringify(v.fontfam));s.forEach(x=>console.log('   ',x.slice(0,700)));}
})();
