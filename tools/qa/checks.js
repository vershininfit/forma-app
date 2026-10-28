// injected audit: returns issues for the current visible document
module.exports=function(){
 const SC=[9,10,11,12,13,14,15,16,17,20,24,28,34,44];const R=[0,4,8,12,16,18,22,28,99];
 const vw=innerWidth,vh=innerHeight;const out={hscroll:null,offscale:{},weight:{},italic:[],fontfam:{},smallTap:[],clipped:[],tech:[],broken:[],ease:{},dur:{},grey:[],gradient:[],offscreen:[],radius:{},contrast:[]};
 const de=document.scrollingElement||document.documentElement;
 if(de.scrollWidth>de.clientWidth+1)out.hscroll=de.scrollWidth+'>'+de.clientWidth;
 const vis=e=>{const r=e.getBoundingClientRect();if(r.width<1||r.height<1)return false;const cs=getComputedStyle(e);if(cs.visibility==='hidden'||cs.display==='none')return false;let n=e;while(n&&n.nodeType===1){const c=getComputedStyle(n);if(+c.opacity===0||c.display==='none')return false;n=n.parentElement}return r.bottom>0&&r.top<vh&&r.right>0&&r.left<vw};
 const lab=e=>(e.tagName.toLowerCase()+(e.id?'#'+e.id:'')+(typeof e.className==='string'&&e.className?'.'+e.className.trim().split(/\s+/).slice(0,2).join('.'):''))+' «'+((e.innerText||e.getAttribute('aria-label')||'').trim().replace(/\s+/g,' ').slice(0,30))+'»';
 const hx=c=>{const m=c.match(/[\d.]+/g);return m?m.map(Number):null};
 const lum=([r,g,b])=>{const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(r)+.7152*f(g)+.0722*f(b)};
 function bgOf(e){let n=e;while(n){const c=getComputedStyle(n).backgroundColor;const a=hx(c);if(a&&(a.length<4||a[3]>.6))return a.slice(0,3);if(getComputedStyle(n).backgroundImage!=='none')return null;n=n.parentElement}return [255,255,255]}
 const all=[...document.querySelectorAll('body *')].filter(e=>!e.closest('svg')||e.tagName==='svg');
 for(const e of all){ if(!vis(e))continue; const cs=getComputedStyle(e); const r=e.getBoundingClientRect();
  const hasText=[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim().length>0);
  if(hasText){ const fs=parseFloat(cs.fontSize); const fsr=Math.round(fs*2)/2; if(!SC.includes(fsr)&&!(fsr>=50&&fsr<=72)) (out.offscale[fsr]=out.offscale[fsr]||[]).push(lab(e));
   const w=+cs.fontWeight; const ser=/serif|Iowan|Georgia|Times/i.test(cs.fontFamily)&&!/sans/i.test(cs.fontFamily.split(',')[0]); if(w>500 && !ser) (out.weight[w]=out.weight[w]||[]).push(lab(e));
   if(cs.fontStyle==='italic')out.italic.push(lab(e));
   const fam=cs.fontFamily.split(',')[0].replace(/"/g,'').trim(); out.fontfam[fam]=(out.fontfam[fam]||0)+1;
   const t=e.innerText||''; if(/\b(undefined|NaN|null)\b|\[object|Lorem|Infinity/.test(t)&&t.length<200)out.tech.push(lab(e));
   // contrast
   const fg=hx(cs.color); const bg=bgOf(e); if(fg&&bg&&(fg.length<4||fg[3]>.5)){const L1=lum(fg.slice(0,3)),L2=lum(bg);const cr=(Math.max(L1,L2)+.05)/(Math.min(L1,L2)+.05);const big=fs>=18||(fs>=14&&w>=700);if(cr<(big?3:4.5)&&cr<4.5)out.contrast.push(lab(e)+' '+cr.toFixed(2)+' fs'+fs)}
   // clipped text
   if((cs.overflow.includes('hidden')||cs.overflowX==='hidden')&&e.scrollWidth>e.clientWidth+2&&cs.textOverflow!=='ellipsis'&&e.children.length===0)out.clipped.push(lab(e)+` ${e.scrollWidth}>${e.clientWidth}`);
  }
  if(e.matches('button,[role=button],a,.btn,[onclick]')){ if((r.width<40||r.height<40)&&!e.closest('.tab')){ out.smallTap.push(lab(e)+` ${Math.round(r.width)}x${Math.round(r.height)}`);} }
  if(e.tagName==='IMG'&&e.complete&&e.naturalWidth===0)out.broken.push(e.src.slice(-60));
  const tf=cs.transitionTimingFunction; if(cs.transitionDuration!=='0s'){ if(/(^|, )ease(,|$)/.test(tf)) out.ease[lab(e)]=tf; cs.transitionDuration.split(',').forEach(d=>{const v=parseFloat(d);if(v>0&&![.25,.35,.45,.7,1.1].includes(Math.round(v*100)/100))out.dur[v+'s']=(out.dur[v+'s']||0)+1}) }
  const bgc=hx(cs.backgroundColor); if(bgc&&(bgc.length<4||bgc[3]>.5)){const [R1,G,B]=bgc; if(R1>225&&G>225&&B>225&&!(R1>=253&&G>=253&&B>=253)&&Math.abs(R1-G)<8&&Math.abs(G-B)<10&&r.width>60&&r.height>30)out.grey.push(lab(e)+' '+cs.backgroundColor); if(B>R1+30&&B>G+20&&R1>100)out.grey.push('PURPLE/BLUE '+lab(e)+' '+cs.backgroundColor)}
  if(/gradient/.test(cs.backgroundImage)&&r.width>40)out.gradient.push(lab(e));
  if(r.right>vw+1&&r.width<vw){ let n=e.parentElement,scroller=false;while(n){const c=getComputedStyle(n);if(/auto|scroll/.test(c.overflowX)||c.overflowX==='hidden'){scroller=true;break}n=n.parentElement} if(!scroller)out.offscreen.push(lab(e)+` right=${Math.round(r.right)}`)}
  const br=parseFloat(cs.borderTopLeftRadius); if(br>0&&cs.borderTopLeftRadius.indexOf('%')<0){const rr=Math.round(br);if(!R.includes(rr)&&rr<r.height/2-1)out.radius[rr]=(out.radius[rr]||0)+1}
 }
 for(const k in out.offscale)out.offscale[k]=[...new Set(out.offscale[k])].slice(0,6);
 for(const k in out.weight)out.weight[k]=[...new Set(out.weight[k])].slice(0,6);
 ['smallTap','clipped','tech','grey','gradient','offscreen','contrast','italic'].forEach(k=>out[k]=[...new Set(out[k])].slice(0,15));
 out.fonts=[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family).filter((v,i,a)=>a.indexOf(v)===i);
 return out;
};
