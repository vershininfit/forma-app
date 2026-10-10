// Эталонные результаты генератора программ из PWA. Запуск: node golden/make-golden.js
// Перенос на TypeScript считается точным, если те же входы дают те же выходы (без случайных id).
const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.join(__dirname,'..','logic');
let seed=1;const rnd=()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const ctx={__rnd:rnd,FCAT:JSON.parse(fs.readFileSync(path.join(root,'fcat.json'),'utf8')),console};ctx.window=ctx;vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root,'rx-gen.legacy.js'),'utf8').replace('if(typeof module','if(false&&typeof module').replace(/Math\.random\(\)/g,'__rnd()').replace(/Date\.now\(\)/g,'(1)'),ctx);
const {GEN,RX}=ctx;
const strip=o=>JSON.parse(JSON.stringify(o,(k,v)=>(typeof v==='string'&&/^g[0-9a-z]{5,}$/.test(v))?'<id>':v));
const cases=[];
for(const sex of ['m','f'])for(const lvl of [1,2,3])for(const goal of ['shape','lean','strength','restart','recover','habit'])for(const where of ['home','gym','both'])
  for(const cau of [[],['kn_pain'],['back_pain']])cases.push({sex,lvl,goal,where,cau,h:170,w:70});
const out=[];
for(const p of cases){seed=1;let r;try{r=strip(GEN.starter(p))}catch(e){r={error:String(e.message)}}out.push({in:p,out:r})}
const a=JSON.stringify(out);
// проверка детерминированности: второй проход должен совпасть
const out2=cases.map(p=>{seed=1;try{return {in:p,out:strip(GEN.starter(p))}}catch(e){return {in:p,out:{error:String(e.message)}}}});
const det=JSON.stringify(out2)===a;if(!det){for(let i=0;i<out.length;i++){const x=JSON.stringify(out[i]),y=JSON.stringify(out2[i]);if(x!==y){let j=0;while(x[j]===y[j])j++;console.log('first diff case',i,JSON.stringify(cases[i]),'\n A:',x.slice(Math.max(0,j-120),j+120),'\n B:',y.slice(Math.max(0,j-120),j+120));break}}}
require('fs').writeFileSync(path.join(__dirname,'starter.golden.json.gz'),require('zlib').gzipSync(JSON.stringify(out),{level:9}));
console.log('cases',cases.length,'deterministic',det,'bytes',a.length,'errors',out.filter(x=>x.out.error).length);
