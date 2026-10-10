/* МЕНЮ «+» (v1) и обёртка пульсации */
(function(){function init(){var fab=document.getElementById('fab');if(!fab||window.__pm)return;window.__pm=1;
var w=fab.parentNode;if(!(w.classList&&w.classList.contains('fabw'))){var r=document.createElement('span');r.className='fabring';r.setAttribute('aria-hidden','true');w=document.createElement('span');w.className='fabw';fab.parentNode.insertBefore(w,fab);w.appendChild(r);w.appendChild(fab)}
if(fab.classList.contains('scan'))return;
var app=fab.closest('.app')||document.body,pm=document.createElement('div');pm.className='fpm';
pm.innerHTML='<div class="fpmb"></div><div class="fpmc"><button class="fpmi" type="button" data-a="meal"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M7.5 12h9"/></svg>Добавить приём пищи</button><button class="fpmi" type="button" data-a="work"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 9.2v5.6M7.5 7.3v9.4M7.5 12h9M16.5 7.3v9.4M19.5 9.2v5.6"/></svg>Новая тренировка</button></div>';
app.appendChild(pm);
var open=false,rt=0;
function bz(n){try{if(window.buzz)window.buzz(n)}catch(e){}}
function set(v,quick){if(v===open&&!quick)return;open=v;clearTimeout(rt);pm.classList.toggle('on',v);fab.setAttribute('aria-expanded',v?'true':'false');
 if(v){w.classList.remove('rest');w.classList.add('open')}else{w.classList.remove('open');if(quick){w.classList.remove('rest')}else{w.classList.add('rest');rt=setTimeout(function(){w.classList.remove('rest')},560)}}}
fab.addEventListener('click',function(e){e.stopImmediatePropagation();e.preventDefault();bz(8);set(!open)},true);
pm.querySelector('.fpmb').addEventListener('click',function(){bz(5);set(false)});
pm.querySelector('.fpmc').addEventListener('click',function(e){var b=e.target.closest('.fpmi');if(!b)return;bz(8);var a=b.dataset.a;set(false);
 setTimeout(function(){try{if(window.parent&&window.parent!==window)parent.postMessage(a==='meal'?{f:'forma',t:'meal',from:window.PAGE||'x'}:{f:'forma',t:'open',nw:1,from:window.PAGE||'x'},'*')}catch(x){}},230)});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&open)set(false)});
addEventListener('message',function(e){var m=e.data;if(open&&m&&m.f==='forma'&&m.t==='show')set(false,true)});
}if(document.getElementById('fab'))init();else document.addEventListener('DOMContentLoaded',init)})();

/* ТАП-АНИМАЦИЯ ИКОНОК ВКЛАДОК (v1): иконки дока с отдельными частями + проигрыватель */
(function(){if(window.dockIc)return;
var P={home:'<g class="ig"><path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/></g>',
dumb:'<g class="ig"><g class="shl"><path class="po" d="M4.5 9.2v5.6"/><path d="M7.5 7.3v9.4"/></g><g class="shr"><path d="M16.5 7.3v9.4"/><path class="po" d="M19.5 9.2v5.6"/></g><path class="bb" d="M7.5 12h9"/></g>',
food:'<g class="ig"><g class="fk"><path d="M7 3v6.5a2.5 2.5 0 0 0 5 0V3M9.5 3v18"/></g><g class="kn"><path d="M17.5 21V3c-2.2 1.4-3.5 4-3.5 7 0 2.2 1.2 3.4 3.5 3.5"/></g></g>',
chart:'<g class="ig"><path d="M4 19V5M4 19h16"/><path class="ln" pathLength="1" d="M8 15l3-4 3 2 5-6"/></g>',
user:'<g class="ig"><circle class="hd" cx="12" cy="8" r="4"/><path d="M4 20c1-4 4-6 8-6s7 2 8 6"/></g>'};
window.dockIc=function(n){var h=P[n];return h?'<svg class="i" data-k="'+n+'" aria-hidden="true">'+h+'</svg>':'<svg class="i"><use href="#'+n+'"/></svg>'};
window.__tabPlay=function(btn){var s=btn&&btn.querySelector&&btn.querySelector('svg[data-k]');if(!s)return;clearTimeout(s._ti);s.classList.remove('ia');void s.getBoundingClientRect();s.classList.add('ia');s._ti=setTimeout(function(){s.classList.remove('ia')},1400)};
addEventListener('message',function(e){var m=e.data;if(!m||m.f!=='forma'||m.t!=='show'||!(m.to>=0)||!(m.fi>=0)||m.fi===m.to)return;var tb=document.querySelector('.tabbar');if(!tb)return;window.__tabPlay(tb.querySelectorAll('.tab')[m.to])});
})();


window.PAGE="prog";
/*STORE_BEGIN*/
/* Хранилище Forma: данные живут на устройстве (localStorage), общие для всех экранов приложения */
var FS=(function(){
 var P="forma.",cache={},subs=[],okLS=true,MEMO=(function(){var w=window;try{for(var i=0;i<4;i++){var p=w.parent;if(!p||p===w)break;void p.document;w=p}}catch(e){}w.__FM=w.__FM||{};return w.__FM})();
 var DEF={profile:{},hist:[],wt:[],progs:null,plan:null,live:null,set:{wRem:true,notif:[]},ob:0,sync:{},demo:0,pend:[],nutr:null,xarch:[]};
 function okT(k,v){var d=DEF[k];if(d===undefined)return true;if(Array.isArray(d))return Array.isArray(v);if(d===null)return v===null||(typeof v==='object'&&!Array.isArray(v));if(typeof d==='object')return v!==null&&typeof v==='object'&&!Array.isArray(v);return typeof v===typeof d&&(typeof v!=='number'||isFinite(v))}
 function rd(k){if(cache[k]!==undefined)return cache[k];var v;try{var s=localStorage.getItem(P+k);if(s!=null)v=JSON.parse(s)}catch(e){okLS=false}
  if(v!==undefined&&!okT(k,v))v=undefined;if(v===undefined&&MEMO[k]!==undefined){try{v=JSON.parse(MEMO[k])}catch(e){}}if(v!==undefined&&!okT(k,v))v=undefined;
  if(v===undefined)v=JSON.parse(JSON.stringify(DEF[k]===undefined?null:DEF[k]));cache[k]=v;return v}
 function wr(k,v,quiet){cache[k]=v;var s=JSON.stringify(v);try{localStorage.setItem(P+k,s)}catch(e){okLS=false}MEMO[k]=s;
  if(!quiet){try{parent!==window&&parent.postMessage({f:"forma",t:"fs",k:k,from:self.name||""},"*")}catch(e){}}return v}
 function inval(k){delete cache[k];subs.forEach(function(fn){try{fn(k)}catch(e){}})}
 addEventListener("storage",function(e){if(e.key&&e.key.indexOf(P)===0)inval(e.key.slice(P.length))});
 addEventListener("message",function(e){var m=e.data;if(m&&m.f==="forma"&&m.t==="fs"&&m.k)inval(m.k)});
 return {
  get:rd,
  set:function(k,v){return wr(k,v)},
  save:function(k){return wr(k,rd(k))},
  patch:function(k,o){var v=rd(k)||{};for(var i in o)v[i]=o[i];return wr(k,v)},
  on:function(fn){subs.push(fn)},
  persistent:function(){return okLS},
  keys:function(){return Object.keys(DEF)},
  dump:function(){var o={v:1,t:Date.now()};Object.keys(DEF).forEach(function(k){o[k]=rd(k)});return o},
  load:function(o){Object.keys(DEF).forEach(function(k){if(o&&o[k]!==undefined)wr(k,o[k])});},
  wipe:function(){Object.keys(DEF).forEach(function(k){delete cache[k];try{localStorage.removeItem(P+k)}catch(e){}delete MEMO[k];try{parent!==window&&parent.postMessage({f:"forma",t:"fs",k:k},"*")}catch(e){}})}
 }})();
function isoOf(d){return d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2)}
function todayIso(){return isoOf(new Date())}
function addDays(iso,n){var p=iso.split("-"),d=new Date(+p[0],+p[1]-1,+p[2]+n);return isoOf(d)}
function dowOf(iso){var p=iso.split("-");return (new Date(+p[0],+p[1]-1,+p[2]).getDay()+6)%7}
function weekStartOf(iso){return addDays(iso,-dowOf(iso))}
/*STORE_END*/

/*HIST_BEGIN*/
var TODAY_ISO=todayIso();
var MR=["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
function dmy(d){var p=d.split("-");return (+p[2])+" "+MR[+p[1]-1]}
var HIST=FS.get("hist");
function reloadHist(){HIST=FS.get("hist")||[]}
function lastOf(k,before){for(var i=HIST.length-1;i>=0;i--){var h=HIST[i];if(h.k===k&&(!before||h.d<before))return h}return null}
function addHist(e){HIST=HIST.filter(function(h){return !(h.d===e.d&&h.k===e.k)});HIST.push(e);HIST.sort(function(a,b){return a.d<b.d?-1:a.d>b.d?1:0});FS.set("hist",HIST)}
function histOn(d){return HIST.filter(function(h){return h.d===d})}
function setsLine(x){var n=x.sets.length,s=x.sets[0]||{},same=x.sets.every(function(q){return q.v===s.v&&q.w===s.w&&q.t===s.t});
 if(x.mode==="time"){return same?n+" × "+(s.t)+" с":n+" подх."}
 var kg=function(w){return +w>0?" · "+String(w).replace(".",",")+" кг":""};
 return same?n+" × "+s.v+kg(s.w):n+" подх. · "+x.sets.map(function(q){return q.v+(+q.w>0?"×"+String(q.w).replace(".",","):"")}).join(", ")}
/*HIST_END*/

/*PULSE_BEGIN*/
/* Круг-пульсация со стартового экрана: мягкое кольцо расходится от места отметки */
(function(){var st=document.createElement("style");st.textContent=".pu{position:absolute;left:50%;top:50%;width:100%;height:100%;border-radius:50%;pointer-events:none;box-shadow:0 0 0 1.5px currentColor;opacity:0;transform:translate(-50%,-50%) scale(1);z-index:3}.pu.go{animation:puGo .9s cubic-bezier(.22,1,.36,1) forwards}.pu.s2.go{animation-delay:.14s}@keyframes puGo{0%{opacity:.55;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-50%) scale(2.1)}}@media (prefers-reduced-motion:reduce){.pu.go{animation-duration:.01ms}}";document.head.appendChild(st)})();
function pulseRing(el,col,n){if(!el)return;try{navigator.vibrate&&navigator.vibrate(n==null?8:n)}catch(e){}try{if(window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches)return}catch(e){}var cs=getComputedStyle(el);if(cs.position==="static")el.style.position="relative";
 [0,1].forEach(function(i){var r=document.createElement("i");r.className="pu"+(i?" s2":"");r.style.color=col||"var(--green)";el.appendChild(r);requestAnimationFrame(function(){r.classList.add("go")});setTimeout(function(){r.remove()},1300)})}
/* Мягкое «жидкое» нажатие: без расходящихся колец — лёгкое сжатие и плавный возврат */
function pulseAt(el,col,n){if(!el)return;try{navigator.vibrate&&navigator.vibrate(n==null?8:n)}catch(e){}
 try{if(window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches)return;if(!el.animate)return;
  if(el._pa){try{el._pa.cancel()}catch(e){}}
  /* только scale (compositor): без filter, повторный вызов не накладывается на предыдущий */
  var a=el.animate([{scale:"1"},{scale:".955",offset:.32},{scale:"1.012",offset:.68},{scale:"1"}],{duration:520,easing:"cubic-bezier(.22,1,.36,1)"});el._pa=a;a.onfinish=a.oncancel=function(){if(el._pa===a)el._pa=null}}catch(e){}}
/*PULSE_END*/

/*COMMON_BEGIN*/
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
function ic(n){return '<svg class="i"><use href="#'+n+'"/></svg>'}
var hl=null;function hlEl(){if(hl)return hl;try{hl=document.createElement("label");hl.setAttribute("aria-hidden","true");hl.style.cssText="position:fixed;left:-9999px;top:0;opacity:0;pointer-events:none";hl.innerHTML='<input type="checkbox" switch tabindex="-1">';document.body.appendChild(hl)}catch(e){}return hl}
function buzz(p){try{if(navigator.vibrate){navigator.vibrate(p);return}}catch(e){}
  var a=[].concat(p),t=0;a.forEach(function(v,i){if(i%2===0)setTimeout(function(){try{hlEl().click()}catch(e){}},t);t+=v})}
function raf(fn,ms){var s=performance.now();(function f(n){var t=Math.min(n-s,ms);fn(t);if(t<ms)requestAnimationFrame(f)})(s)}
function mix(a,b,t){return a.map(function(v,i){return Math.round(v+(b[i]-v)*t)})}
function hex(c){c=c.replace('#','');return [parseInt(c.slice(0,2),16),parseInt(c.slice(2,4),16),parseInt(c.slice(4,6),16)]}
function colorFor(p){var t=Math.max(0,Math.min(1,p/100)),st=[[0,"E58AA0"],[.4,"EDB48F"],[.7,"B5D68A"],[1,"4FB874"]],i=0;while(i<st.length-2&&t>st[i+1][0])i++;var u=(t-st[i][0])/(st[i+1][0]-st[i][0]);return "rgb("+mix(hex(st[i][1]),hex(st[i+1][1]),Math.max(0,Math.min(1,u))).join(",")+")"}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function plural(n,f){var m=n%10,k=n%100;return n+" "+(m===1&&k!==11?f[0]:(m>=2&&m<=4&&(k<10||k>=20)?f[1]:f[2]))}
function uid(){return Math.random().toString(36).slice(2,9)}
function clone(o){return JSON.parse(JSON.stringify(o))}
function fk(v){return (Math.round(v*10)/10).toFixed(1).replace(".",",")}
function fi(v){return String(Math.round(v*10)/10).replace(".",",")}
var PAGE=window.PAGE||"x";
function send(m){m.f="forma";m.from=PAGE;try{parent!==window&&parent.postMessage(m,"*")}catch(e){}}
function toast(t,act,fn){var e=$("#toast");if(!e)return;e.innerHTML="";e.classList.toggle("act",!!act);var s=document.createElement("span");s.textContent=t;e.appendChild(s);if(act){var b=document.createElement("button");b.className="tact";b.textContent=act;b.onclick=function(){e.classList.remove("on");fn&&fn()};e.appendChild(b)}e.classList.add("on");clearTimeout(toast._t);toast._t=setTimeout(function(){e.classList.remove("on")},act?4200:2600)}
/* нижнее меню */
var TABS=[["home","Главная","home"],["dumb","Тренировки","work"],["food","Питание","nutr"],["chart","Прогресс","prog"],["user","Профиль","prof"]];
function initTabs(active){var tb=$("#tabbar"),ind=document.createElement("div");ind.className="ind";tb.appendChild(ind);var btns=[];
 TABS.forEach(function(t,i){var b=document.createElement("button");b.className="tab"+(t[2]===active?" on":"");b.setAttribute("aria-label",t[1]);b.innerHTML=dockIc(t[0])+'<span class="lbl">'+t[1]+'</span>';
  b.onclick=function(){if(t[2]===active){var s=$("#scroll");s&&s.scrollTo({top:0,behavior:"smooth"});return}buzz(6);send({t:"tab",to:t[2]})};tb.appendChild(b);btns.push(b)});
 function place(){var b=btns[TABS.map(function(t){return t[2]}).indexOf(active)];ind.style.transform="translateX("+b.offsetLeft+"px)";ind.style.width=b.offsetWidth+"px"}
 setTimeout(place,60);addEventListener("resize",place);if(document.fonts)document.fonts.ready.then(place);return place}
/* окно/лист */
function openWin(w,btn){w=typeof w==="string"?$(w):w;w.classList.add("measure");var wr=w.getBoundingClientRect(),br=btn?btn.getBoundingClientRect():{left:wr.left+wr.width/2,top:wr.top+wr.height/2,width:0,height:0};w.style.transformOrigin=(br.left+br.width/2-wr.left)+"px "+(br.top+br.height/2-wr.top)+"px";w.classList.remove("measure");void w.offsetWidth;$("#scrim").classList.add("on");w.classList.add("on");buzz(10)}
function closeLayers(){$$(".win.on,.sheet.on").forEach(function(x){x.classList.remove("on")});$("#scrim").classList.remove("on")}
function openSheet(id){$$(".sheet.on").forEach(function(s){s.classList.remove("on")});$("#"+id).classList.add("on");$("#scrim").classList.add("on");buzz(8)}

/* ===== Единый стандарт смены вкладок/сегментов (v7): swapPane / swapPanes / initSeg =====
   Движение: старое уходит (opacity→0, translateY(-4px), 160ms), новое входит (opacity 0→1, translateY 8→0, blur 4→0, .45s),
   кривая glassease; индикатор сегмента скользит .45s. prefers-reduced-motion: без анимации. Быстрые повторные вызовы безопасны.
   swapPane(host, render, {top:true|false, out:false, inMs:450})  — host: элемент/селектор; render() сам перестраивает содержимое host.
        top:true — после замены прокрутить host вверх (по умолчанию позиция прокрутки сохраняется); out:false — только появление (фильтры/обновления).
   swapPanes(fromEl, toEl)       — две готовые панели: from уходит и скрывается (hidden), to появляется.
   initSeg(segEl, function(i,prev){…}) -> {set(i), place(), get()} — сегмент ".seg > .ind + button*"; индикатор и класс .on ведёт сам. */
(function(){
var EASE="cubic-bezier(.32,.72,0,1)",W=window;
function reduced(){try{return matchMedia("(prefers-reduced-motion:reduce)").matches}catch(e){return false}}
function el(x){return typeof x==="string"?document.querySelector(x):x}
function shown(h){try{return h.getClientRects().length>0}catch(e){return false}}
try{var st=document.createElement("style");st.textContent="[hidden]{display:none!important}";document.head.appendChild(st)}catch(e){}
function cur(h){try{var o=parseFloat(getComputedStyle(h).opacity);return isFinite(o)?o:1}catch(e){return 1}}
function swapPane(host,render,o){o=o||{};host=el(host);if(!host){render&&render();return}
 var tok=host._swT=(host._swT||0)+1,op=host._swA?cur(host):1,sc=host.scrollTop;
 if(host._swA){try{host._swA.cancel()}catch(e){}host._swA=null}
 function put(){render&&render();if(o.top)host.scrollTop=0;else if(host.scrollTop!==sc)host.scrollTop=sc}
 if(reduced()||!host.animate||!shown(host)){host.style.willChange="";put();return}
 host.style.willChange="opacity,transform,filter";
 function enter(){var a=host.animate([{opacity:0,transform:"translateY(8px)",filter:"blur(4px)"},{opacity:1,transform:"none",filter:"blur(0px)"}],{duration:o.inMs||450,easing:EASE});
  host._swA=a;var end=function(){if(host._swT===tok){host._swA=null;host.style.willChange=""}};a.onfinish=end;a.oncancel=function(){if(host._swA===a)host._swA=null};return a}
 if(o.out===false){put();enter();return}
 var out=host.animate([{opacity:op,transform:"none"},{opacity:0,transform:"translateY(-4px)"}],{duration:o.outMs||160,easing:EASE,fill:"forwards"}),done=false;
 host._swA=out;
 function next(){if(done||host._swT!==tok)return;done=true;put();var a=enter();try{out.cancel()}catch(e){}host._swA=a}
 out.onfinish=next;setTimeout(next,320)}
function swapPanes(from,to,o){from=el(from);to=el(to);if(!to||from===to)return;
 var tok=to._swT=(to._swT||0)+1;if(from)from._swT=(from._swT||0)+1;
 function flip(){if(from)from.hidden=true;to.hidden=false}
 if(reduced()||!to.animate||!from||!shown(from)){flip();return}
 var out=from.animate([{opacity:1,transform:"none"},{opacity:0,transform:"translateY(-4px)"}],{duration:160,easing:EASE,fill:"forwards"}),done=false;
 function next(){if(done)return;done=true;flip();try{out.cancel()}catch(e){}
  to.animate([{opacity:0,transform:"translateY(8px)",filter:"blur(4px)"},{opacity:1,transform:"none",filter:"blur(0px)"}],{duration:450,easing:EASE})}
 out.onfinish=next;setTimeout(next,320)}
function initSeg(seg,cb){seg=el(seg);if(!seg)return {set:function(){},place:function(){},get:function(){return 0}};
 var bs=[].slice.call(seg.querySelectorAll("button")),ind=seg.querySelector(".ind"),idx=0,TR="transform .45s "+EASE+",width .45s "+EASE;
 if(!ind){ind=document.createElement("div");ind.className="ind";seg.insertBefore(ind,seg.firstChild)}
 bs.forEach(function(b,i){if(b.classList.contains("on"))idx=i});
 seg.setAttribute("role","tablist");
 function mark(){bs.forEach(function(b,j){var on=j===idx;b.classList.toggle("on",on);b.setAttribute("role","tab");b.setAttribute("aria-selected",on?"true":"false")})}
 function place(instant){var b=bs[idx];if(!b||!b.offsetWidth)return;
  ind.style.transition=instant?"none":TR;ind.style.width=b.offsetWidth+"px";ind.style.transform="translateX("+b.offsetLeft+"px)";
  if(instant){void ind.offsetWidth;ind.style.transition=TR}}
 function set(i){i=Math.max(0,Math.min(bs.length-1,i|0));idx=i;mark();place(false)}
 bs.forEach(function(b,i){b.addEventListener("click",function(){if(i===idx)return;var prev=idx;set(i);try{buzz(6)}catch(e){}cb&&cb(i,prev)})});
 mark();ind.style.transition="none";
 if(W.ResizeObserver){try{new ResizeObserver(function(){place(true)}).observe(seg)}catch(e){}}else addEventListener("resize",function(){place(true)});
 setTimeout(function(){place(true)},30);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){place(true)});
 return {set:set,place:place,get:function(){return idx}}}
W.swapPane=swapPane;W.swapPanes=swapPanes;W.initSeg=initSeg;
})();
/*COMMON_END*/

(function(){
"use strict";
var EMB=window.name==="forma-emb";
var MS=["янв","фев","мар","апр","мая","июн","июл","авг","сен","окт","ноя","дек"],WDN=["воскресенье","понедельник","вторник","среда","четверг","пятница","суббота"];
var GALL=["Плечи","Мышцы груди","Мышцы спины","Бицепс","Трицепс","Предплечье","Мышцы кора","Ягодицы","Передняя поверхность бедра","Задняя поверхность бедра","Мышцы голени"];
var GS={"Плечи":"Плечи","Мышцы груди":"Грудь","Мышцы спины":"Спина","Бицепс":"Бицепс","Трицепс":"Трицепс","Предплечье":"Предплечье","Мышцы кора":"Кор","Ягодицы":"Ягодицы","Передняя поверхность бедра":"Квадрицепс","Задняя поверхность бедра":"Бицепс бедра","Мышцы голени":"Голень"};
var GLOW={};GALL.forEach(function(g){GLOW[g.toLowerCase()]=g});
var PERS=[["7","7 дней",7,"за 7 дней"],["30","30 дней",30,"за 30 дней"],["90","3 мес.",90,"за 3 месяца"],["all","Всё",0,"за всё время"]];
var WPERS=[["4w","4 нед",28],["3m","3 мес.",91],["all","Всё",0]];
var LOW=6,HIGH=20,NORM_N=3;

/* ---------- безопасные помощники ---------- */
function arr(x){return Array.isArray(x)?x:[]}
function nn(x){if(typeof x==="string"){x=x.replace(",",".").trim();if(x==="")return NaN;x=+x}else if(typeof x!=="number")return NaN;return isFinite(x)?x:NaN}
function S(x,n){return (typeof x==="string"||typeof x==="number")?String(x).replace(/\s+/g," ").trim().slice(0,n||120):""}
function okIso(s){if(typeof s!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;var y=+s.slice(0,4),m=+s.slice(5,7),d=+s.slice(8,10);return y>=2000&&isoOf(new Date(y,m-1,d))===s}
function th(n){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,"\u00a0")}
function f1(v){return isFinite(v)?fk(v):"–"}
function f0(v){return isFinite(v)?fi(v):"–"}
function sd(iso,y){var p=iso.split("-");return p[2]+"."+p[1]+(y?"."+p[0].slice(2):"")}
function utc(iso){var p=iso.split("-");return Date.UTC(+p[0],+p[1]-1,+p[2])}
function daysBetween(a,b){return Math.round((utc(b)-utc(a))/864e5)}
function wdOf(iso){var p=iso.split("-");return new Date(+p[0],+p[1]-1,+p[2]).getDay()}
function lowerFirst(s){return s.charAt(0).toLowerCase()+s.slice(1)}
function dmyy(iso,T){var p=iso.split("-");return (+p[2])+" "+MR[+p[1]-1]+(p[0]!==String(T).slice(0,4)?" "+p[0]:"")}
function clamp(x,a,b){return Math.max(a,Math.min(b,x))}
function setPatch(o){var s=FS.get("set");if(!s||typeof s!=="object"||Array.isArray(s))s={wRem:true,notif:[]};for(var k in o)s[k]=o[k];FS.set("set",s)}

/* ---------- каталог упражнений ---------- */
var CATX=null,CATN=-1,CBY={},CBN={};
function catIdx(){var c=null;try{c=window.FCAT||(parent&&parent.FCAT)}catch(e){}if(!Array.isArray(c))c=[];
 if(c!==CATX||c.length!==CATN){CATX=c;CATN=c.length;CBY={};CBN={};c.forEach(function(q){if(q&&q.id!=null){CBY[q.id]=q;if(q.n)CBN[String(q.n).toLowerCase()]=q}})}}
function catOf(x){catIdx();return (x.id&&CBY[x.id])||CBN[String(x.n||"").toLowerCase()]||null}
function canonG(s){return GLOW[String(s==null?"":s).trim().toLowerCase()]||null}
/* [[группа,%]] -> [[группа,доля]] (сумма 1) или null */
function pairs(a){if(!Array.isArray(a))return null;var o=[],sum=0;a.forEach(function(r){if(!Array.isArray(r))return;var g=canonG(r[0]),p=nn(r[1]);if(g&&p>0){o.push([g,p]);sum+=p}});return o.length&&sum>0?o.map(function(r){return [r[0],r[1]/sum]}):null}
function catDist(x){var c=catOf(x);if(!c)return null;return pairs(c.pc)||(canonG(c.m)?[[canonG(c.m),1]]:null)}

/* ---------- нормализация данных ---------- */
function normEx(x){if(!x||typeof x!=="object")return null;
 var mode=x.mode==="time"?"time":"kg",sets=[];
 arr(x.sets).forEach(function(q){if(!q||typeof q!=="object")return;var v=nn(q.v),w=nn(q.w),t=nn(q.t);
  v=v>0&&v<=1000?Math.round(v):0;w=w>0&&w<=1000?Math.round(w*100)/100:0;t=t>0&&t<=36000?Math.round(t):0;
  if(mode==="time"?t<=0:v<=0)return;
  sets.push({v:mode==="time"?(v||1):v,w:w>0?w:"",t:t,rest:0,done:q.done!==false})});
 var id=S(x.id,60),c=catOf({id:id,n:S(x.n,80)}),name=S(x.n,80)||(c&&S(c.n,80))||"Упражнение",e=nn(x.eff);
 return {id:id,key:id?"i:"+id:"n:"+name.toLowerCase(),n:name,mode:mode,sets:sets,eff:e>=1&&e<=10?e:0,my:S(x.my,300),pain:!!x.pain,tn:S(x.tn,200),g:x.g}}
function doneOf(x){return x.sets.filter(function(q){return q.done})}
function normE(h,T){if(!h||typeof h!=="object"||!okIso(h.d)||h.d>T)return null;
 var e={d:h.d,k:S(h.k,60),wn:S(h.wn,80)||"Тренировка",pn:S(h.pn,80),t:/^\d{1,2}:\d{2}$/.test(S(h.t,5))?S(h.t,5):"",tn:S(h.tn,300),note:"",gp:null,ex:[]},sec=nn(h.sec),kc=nn(h.kcal),pc=nn(h.pct);
 e.sec=sec>0&&sec<=86400?Math.round(sec):0;e.kcal=kc>0&&kc<=20000?Math.round(kc):0;e.pct=pc>0&&pc<=100?Math.round(pc):0;
 if(typeof h.g==="string")e.note=S(h.g,300);else if(Array.isArray(h.g))e.gp=h.g;
 e.ex=arr(h.ex).map(normEx).filter(Boolean);
 var ef=[],vol=0,ns=0;e.ex.forEach(function(x){var ds=doneOf(x);ns+=ds.length;if(x.eff&&ds.length)ef.push(x.eff);ds.forEach(function(q){if(x.mode!=="time"&&q.w>0)vol+=q.v*q.w})});
 e.sets=ns;e.vol=Math.round(vol);e.effN=ef.length;e.effS=ef.reduce(function(s,v){return s+v},0);e.eff=ef.length?e.effS/ef.length:0;
 e.pain=e.ex.some(function(x){return x.pain});return e}

/* ---------- сводные расчёты ---------- */
function planN(){var p=FS.get("plan"),u={};if(p&&typeof p==="object")arr(p.days).forEach(function(d){d=nn(d);if(d>=0&&d<=6&&d===Math.floor(d))u[d]=1});var n=Object.keys(u).length;var pr=FS.get("profile"),gm={stroy:4,relief:3,force:3,start:2,recover:2,reg:3};return {n:n||gm[pr&&typeof pr==="object"?pr.goal:""]||NORM_N,planned:n>0}}
function nextW(){var P=FS.get("progs"),ps=P&&typeof P==="object"?arr(P.programs):[],pl=FS.get("plan"),pid=pl&&typeof pl==="object"?pl.prog:null,o=ps.filter(function(p){return p&&typeof p==="object"});
 o.sort(function(a,b){return (a.id===pid?0:1)-(b.id===pid?0:1)});
 for(var i=0;i<o.length;i++){var ws=arr(o[i].workouts);for(var j=0;j<ws.length;j++){var w=ws[j];if(w&&typeof w==="object"&&!w.done&&w.id!=null)return {id:w.id,n:S(w.name,60)||"Тренировка"}}}return null}
function exUnit(m){var any=m.s.some(function(r){return r.x.mode!=="time"&&r.x.sets.some(function(q){return q.w>0})}),last=m.s[m.s.length-1].x;return last.mode==="time"?"с":(any?"кг":"повт.")}
function buildEx(H){var M={},order=[];
 H.forEach(function(e){var inE={};e.ex.forEach(function(x){var ds=doneOf(x);if(!ds.length)return;
  var m=M[x.key];if(!m){m=M[x.key]={key:x.key,id:x.id,n:x.n,s:[]};order.push(x.key)}m.n=x.n;
  var r=inE[x.key];if(r){r.x.sets=r.x.sets.concat(ds);r.x.pain=r.x.pain||x.pain;if(x.my&&!r.x.my)r.x.my=x.my;if(x.eff)r.x.eff=Math.max(r.x.eff,x.eff)}
  else{r={d:e.d,k:e.k,e:e,x:{id:x.id,n:x.n,mode:x.mode,sets:ds.slice(),eff:x.eff,my:x.my,pain:x.pain,tn:x.tn,g:x.g}};m.s.push(r);inE[x.key]=r}})});
 var out=[];
 order.forEach(function(key){var m=M[key],u=exUnit(m);m.u=u;m.p=[];
  m.s.forEach(function(r){var st=r.x.sets,v=null,vol=0;
   if(u==="с"){if(r.x.mode==="time"){v=Math.max.apply(null,st.map(function(q){return q.t}));vol=st.reduce(function(s,q){return s+q.t},0)}}
   else if(u==="кг"){var ws=st.filter(function(q){return q.w>0});if(ws.length){v=Math.max.apply(null,ws.map(function(q){return q.w}));vol=ws.reduce(function(s,q){return s+q.v*q.w},0)}}
   else{if(r.x.mode!=="time"){v=Math.max.apply(null,st.map(function(q){return q.v}));vol=st.reduce(function(s,q){return s+q.v},0)}}
   if(v!=null&&isFinite(v)&&v>0){r.v=v;r.vol=vol;m.p.push(r)}});
  var n=m.p.length;if(!n)return;
  var best=-1,bv=-1,rec=[];
  m.p.forEach(function(r,i){var hit=false;if(i>0){if(r.v>best+1e-9)hit=true;else if(u==="кг"&&r.vol>bv+1e-9)hit=true}if(r.v>best)best=r.v;if(r.vol>bv)bv=r.vol;if(hit)rec.push(i)});
  var lr=rec.length?rec[rec.length-1]:-1;
  m.n_=n;m.best=best;m.bestVol=bv;m.rec=rec;m.last=m.p[n-1].v;m.first=m.p[0].v;m.prev=n>1?m.p[n-2].v:null;m.since=lr<0?n-1:n-1-lr;
  m.st=n>=4&&m.since>=3?"pl":(lr>=0&&m.since<3?"up":"ne");if(m.st!=="up"&&n>=3&&m.last<m.best*0.9-1e-9)m.st="dn";m.newRec=lr===n-1;
  m.pn=m.p.slice(-3).some(function(r){return r.x.pain});m.lastD=m.p[n-1].d;out.push(m)});
 return out}
function weekRuns(set,T){/* set: {weekStart:1}; -> {cur,best} подряд идущих недель; текущая неделя не рвёт серию, пока не закончилась */
 var ks=Object.keys(set).sort(),best=0,run=0,prev=null;
 ks.forEach(function(k){run=(prev&&addDays(prev,7)===k)?run+1:1;if(run>best)best=run;prev=k});
 var cw=weekStartOf(T),cur=0;if(prev&&(prev===cw||prev===addDays(cw,-7)))cur=run;return {cur:cur,best:best}}

var D=null;
function compute(){
 var T=todayIso(),d={T:T},map={},i;
 reloadHist();
 arr(HIST).forEach(function(h){var e=normE(h,T);if(e)map[e.d+"|"+(e.k||e.wn)]=e});
 var H=Object.keys(map).map(function(k){return map[k]});
 H.sort(function(a,b){return a.d<b.d?-1:a.d>b.d?1:(a.t<b.t?-1:a.t>b.t?1:(a.wn<b.wn?-1:a.wn>b.wn?1:0))});
 H.forEach(function(e,j){e.i=j});d.H=H;
 var wm={};arr(FS.get("wt")).forEach(function(r){if(!r||typeof r!=="object"||!okIso(r.d)||r.d>T)return;var v=nn(r.v);if(v>=30&&v<=250)wm[r.d]=Math.round(v*10)/10});
 d.W=Object.keys(wm).sort().map(function(k){return {d:k,v:wm[k]}});
 var p=FS.get("profile");d.prof=p&&typeof p==="object"&&!Array.isArray(p)?p:{};
 var pn=planN();d.N=pn.n;d.planned=pn.planned;d.next=nextW();
 d.wkc={};H.forEach(function(e){var w=weekStartOf(e.d);d.wkc[w]=(d.wkc[w]||0)+1});
 /* серия недель в ритме */
 var cw=weekStartOf(T),run=0,best=0;
 if(H.length){var ws=weekStartOf(H[0].d);while(ws<cw){if((d.wkc[ws]||0)>=d.N)run++;else run=0;if(run>best)best=run;ws=addDays(ws,7)}}
 var curOk=(d.wkc[cw]||0)>=d.N;d.streak={cur:run+(curOk?1:0),best:Math.max(best,run+(curOk?1:0))};
 d.fullW=Object.keys(d.wkc).filter(function(k){return d.wkc[k]>=d.N}).length;
 var wset={};d.W.forEach(function(r){wset[weekStartOf(r.d)]=1});d.wRun=weekRuns(wset,T);
 var AR={};arr(FS.get("xarch")).forEach(function(h){var e=normE(h,T);if(e){e.gone=1;AR[e.d+"|"+(e.k||e.wn)]=e}});
 var HA=H.concat(Object.keys(AR).map(function(k){return AR[k]}));HA.sort(function(a,b){return a.d<b.d?-1:a.d>b.d?1:(a.t<b.t?-1:a.t>b.t?1:0)});
 d.EX=buildEx(HA);
 d.recs=d.EX.reduce(function(s,e){return s+e.rec.length},0);
 d.vol=H.reduce(function(s,e){return s+e.vol},0);
 d.fams=medalFams(d);return d}

/* ---------- медали ---------- */
var WU=["неделя","недели","недель"];
function medalFams(d){return [
 {k:"tr",n:"Тренировки",ic:"m-reg",L:[1,5,10,25,50],v:d.H.length,u:["тренировка","тренировки","тренировок"],d:"Все проведённые тренировки. В зачёт идёт любая: и короткая, и обычная.",h:function(n){return "ещё "+plural(n,["тренировка","тренировки","тренировок"])},go:"work"},
 {k:"st",n:"Серия",ic:"flame",L:[2,4,8],v:d.streak.best,u:WU,d:"Недели подряд, в которые сделаны все тренировки плана. Если неделя не сложилась, серия начнётся заново, а лучший результат сохранится.",h:function(n){return "ещё "+plural(n,WU)+" в ритме подряд"},go:"work"},
 {k:"pr",n:"Рекорды",ic:"m-prg",L:[1,5,15],v:d.recs,u:["рекорд","рекорда","рекордов"],d:"Каждый раз, когда в упражнении побит прежний результат: больше вес, повторов, времени или объёма.",h:function(n){return "ещё "+plural(n,["новый рекорд","новых рекорда","новых рекордов"])},go:"work"},
 {k:"vl",n:"Тоннаж",ic:"dumb",L:[1000,10000],v:Math.round(d.vol),fmt:function(t){return th(t)+" кг"},d:"Сумма «повторы × вес» по всем подходам с отягощением. Подходы со своим весом в тоннаж не входят.",h:function(n){return "ещё "+th(n)+" кг тоннажа"},go:"work"},
 {k:"fw",n:"Без пропусков",ic:"m-qua",L:[1,4,12],v:d.fullW,u:WU,d:"Недели, в которые сделаны все тренировки плана. Не обязательно подряд.",h:function(n){return "ещё "+plural(n,WU)+" без пропусков"},go:"work"},
 {k:"wl",n:"Вес",ic:"scale",L:[4,12],v:d.wRun.best,u:WU,d:"Недели подряд, в которые вы записывали вес. Хотя бы одно взвешивание в неделю.",h:function(n){return "ещё "+plural(n,WU)+" подряд с записью веса"},go:"wt"}]}
function mState(m){var v=m.v,lv=0;m.L.forEach(function(t){if(v>=t)lv++});var nx=m.L[lv],pv=lv?m.L[lv-1]:0;return {v:v,lv:lv,nx:nx,f:nx?clamp((v-pv)/(nx-pv),0,1):1}}
function mLab(m,t){return m.fmt?m.fmt(t):plural(t,m.u)}
function earnedIds(){var o=[];D.fams.forEach(function(m){m.L.forEach(function(t){if(m.v>=t)o.push(m.k+":"+t)})});return o}

/* ---------- общее состояние UI ---------- */
var swTok=0,pane=0,per="30",wPer="3m",mMetric="sets",pgF="",hShown=8,xF="all",xQ="",xShown=15,shown=!EMB,wSel=-1,wP=[],wX=null,wW=312;
function perOf(k){for(var i=0;i<PERS.length;i++)if(PERS[i][0]===k)return PERS[i];return PERS[1]}
function perFrom(p){return p[2]?addDays(D.T,-(p[2]-1)):""}
function inWin(from){return D.H.filter(function(e){return !from||e.d>=from})}
function go(to){buzz(6);send({t:"tab",to:to})}
function barCol(n,N,cur){return n<=0?"":(n>=N?"var(--green)":(cur?"var(--coral)":"var(--pink)"))}
function anim(root){setTimeout(function(){$$("[data-h]",root).forEach(function(e){var v=+e.dataset.h;if(!isFinite(v))v=0;e.style.height=Math.max(0,v)+"px";if(e.dataset.c)e.style.background=e.dataset.c});$$("[data-w]",root).forEach(function(e){var v=+e.dataset.w;if(!isFinite(v))v=0;e.style.width=clamp(v,0,100)+"%";if(e.dataset.c)e.style.background=e.dataset.c});$$(".ln",root).forEach(function(e){e.style.strokeDashoffset=0});$$("[data-f]",root).forEach(function(e){var v=+e.dataset.f;if(!isFinite(v))v=0;e.style.strokeDashoffset=1-clamp(v,0,1)})},90)}
function win(html,btn){var w=$("#pw");w.innerHTML=html;openWin(w,btn);return w}
function chips(list,cur,cls,id){return '<div class="chips '+(cls||"nw")+'" id="'+id+'">'+list.map(function(m){return '<button class="chp'+(m[0]===cur?" on":"")+'" data-k="'+esc(m[0])+'">'+esc(m[1])+(m[3]!=null?'<em>'+m[3]+'</em>':"")+'</button>'}).join("")+'</div>'}
function bindChips(id,fn){$$(".chp",$("#"+id)).forEach(function(b){b.onclick=function(){if(b.classList.contains("on"))return;$$(".chp",$("#"+id)).forEach(function(x){x.classList.toggle("on",x===b)});pulseAt(b,"var(--coral)",6);fn(b.dataset.k)}})}
function goBtn(id,txt,cls,fn){return '<button class="cta '+(cls||"")+'" id="'+id+'">'+txt+'</button>'}

/* ---------- Общий ---------- */
function ghostChart(pts){var W=312,H=110,g='<line class="gl" x1="30" x2="302" y1="20" y2="20"/><line class="gl" x1="30" x2="302" y1="55" y2="55"/><line class="gl" x1="30" x2="302" y1="90" y2="90"/>',
 xs=[40,105,170,235,298],ys=pts||[58,52,60,48,44];
 var d="M"+xs.map(function(x,i){return x+" "+ys[i]}).join("L"),c=xs.map(function(x,i){return '<circle cx="'+x+'" cy="'+ys[i]+'" r="4"/>'}).join("");
 return '<svg class="gh" viewBox="0 0 '+W+' '+H+'" aria-hidden="true">'+g+'<path class="gp" d="'+d+'"/>'+c+'</svg>'}
function wRem(){var s=FS.get("set");return !(s&&typeof s==="object"&&s.wRem===false)}
function wSubText(P){if(P.length<2)return "";var t=P[P.length-1].v-P[0].v;return "с "+dmy(P[0].d)+" "+(Math.abs(t)<.05?"без изменений":(t<0?"−":"+")+f1(Math.abs(t))+" кг")}
var OPENF=window.OPENF={};function fzo(k){return OPENF[k]?'" data-open="1':''}
function weightCard(){var W=D.W,n=W.length,h='<div class="card rise" id="wcard" data-fz="w'+fzo("w")+'">';
 if(n<2){
  var pw=nn(D.prof.w),hint=n===0&&pw>=30&&pw<=250?' В профиле указан вес '+f1(pw)+' кг: запишите сегодняшний, чтобы пошла динамика.':"";
  h+='<div class="ch2"><h4>'+ic("scale")+'Вес</h4><span>'+(n?"1 запись":"пока нет записей")+'</span></div>';
  if(n){h+='<div class="wrd"><span class="bign">'+f1(W[0].v)+'<small>кг</small></span><span class="d">'+esc(dmy(W[0].d))+'</span></div>'}
  h+=ghostChart()+'<div class="unl"><span>'+(n?"Ещё 1 взвешивание, и появится график.":"Запишите вес сегодня: это первая точка. С двумя записями появится график.")+hint+'</span><div class="pb"><s data-w="'+(n?50:0)+'"></s></div></div>';
 }else{
  h+='<div class="ch2"><h4>'+ic("scale")+'Вес</h4><span id="wsub"></span></div>'+chips(WPERS.map(function(p){return [p[0],p[1]]}),wPer,"nw","wpch")+'<div class="wrd"><span class="bign"><span id="wbig"></span><small>кг</small></span><span class="d" id="wdt"></span></div><div class="wch" id="wch"></div><p class="small" id="wnote" style="margin:0"></p>';
 }
 h+='<div class="btnrow"><button class="cta'+(n?"":" go")+'" id="wadd">'+(n?"Внести вес":"Записать вес")+'</button></div><div class="sw2"><div class="tx"><b>Напоминать о весе</b><span id="wrs"></span></div><button class="tg'+(wRem()?" on":"")+'" id="wtg" role="switch" aria-checked="'+wRem()+'" aria-label="Напоминать о весе"></button></div></div>';
 h=h.replace('<div class="ch2">','<div class="ch2 fzh" role="button" tabindex="0" aria-expanded="'+!!OPENF.w+'">');var i=h.indexOf("</div>")+6;
 return h.slice(0,i)+'<div class="fzb"><div class="fzi">'+h.slice(i,-6)+'</div></div></div>'}
function wWindow(){var p=WPERS.filter(function(x){return x[0]===wPer})[0]||WPERS[1],from=p[2]?addDays(D.T,-(p[2]-1)):"";return D.W.filter(function(r){return !from||r.d>=from})}
function wDraw(){var P=wWindow();wP=P;var box=$("#wch");if(!box)return;
 if(P.length<2){var all=D.W,last=all[all.length-1];box.innerHTML=ghostChart();wSel=-1;$("#wbig").textContent=f1(last.v);$("#wdt").textContent=dmy(last.d);$("#wsub").textContent="";$("#wnote").textContent="В этом периоде одна запись. Выберите «Всё» или запишите вес ещё раз.";return}
 $("#wnote").textContent="";
 var H=140,pl=30,pr=10,pt=12,pb=24,vs=P.map(function(p){return p.v}),mn=Math.min.apply(null,vs),mx=Math.max.apply(null,vs),lo=Math.floor(mn-.2),hi=Math.ceil(mx+.2);if(hi-lo<2)hi=lo+2;
 var t0=utc(P[0].d),span=Math.max(1,utc(P[P.length-1].d)-t0);
 var X=function(i){return pl+(wW-pl-pr)*((utc(P[i].d)-t0)/span)},Y=function(v){return pt+(H-pt-pb)*(1-(v-lo)/(hi-lo))};wX=X;
 var g="",mid=(lo+hi)/2;[lo,mid,hi].forEach(function(v){g+='<line class="gl" x1="'+pl+'" x2="'+(wW-pr)+'" y1="'+Y(v)+'" y2="'+Y(v)+'"/><text x="0" y="'+(Y(v)+3.5)+'">'+f0(v)+'</text>'});
 var d="M"+P.map(function(p,i){return X(i).toFixed(1)+" "+Y(p.v).toFixed(1)}).join("L"),many=P.length>45,
 dots=P.map(function(p,i){var l=i===P.length-1;if(many&&!l)return "";return '<circle class="dt'+(l?" l":"")+'" cx="'+X(i).toFixed(1)+'" cy="'+Y(p.v).toFixed(1)+'" r="'+(l?5:4)+'" data-i="'+i+'"/>'}).join(""),yr=P[0].d.slice(0,4)!==P[P.length-1].d.slice(0,4)||span>300*864e5;
 box.innerHTML='<svg viewBox="0 0 '+wW+' '+H+'" role="img" aria-label="График веса">'+g+'<line class="sl" id="wsl" x1="0" x2="0" y1="'+pt+'" y2="'+(H-pb)+'"/><path class="ln" d="'+d+'" pathLength="1"/>'+dots+'<text x="'+pl+'" y="'+(H-6)+'">'+sd(P[0].d,yr)+'</text><text x="'+(wW-pr)+'" y="'+(H-6)+'" text-anchor="end">'+sd(P[P.length-1].d,yr)+'</text></svg>';
 var dr=false;
 function pick(e){var r=box.getBoundingClientRect(),x=(e.clientX-r.left)/Math.max(1,r.width)*wW,bi=0,bd=1e9;P.forEach(function(p,i){var dd=Math.abs(X(i)-x);if(dd<bd){bd=dd;bi=i}});if(bi!==wSel){wSelect(bi);buzz(3)}}
 box.onpointerdown=function(e){dr=true;pick(e)};box.onpointermove=function(e){if(dr)pick(e)};box.onpointerup=box.onpointercancel=function(){dr=false};
 wSelect(P.length-1,true);anim(box)}
function wSelect(i,quiet){var P=wP;if(!P[i])return;wSel=i;$("#wbig").textContent=f1(P[i].v);var dl=i>0?P[i].v-P[i-1].v:0;
 $("#wdt").innerHTML=esc(dmy(P[i].d))+(i>0?'<br>'+(Math.abs(dl)<.05?"без изменений":(dl<0?"−":"+")+f1(Math.abs(dl))+" к прошлому"):"");
 $("#wsub").textContent=wSubText(P);
 $$(".dt",$("#wch")).forEach(function(c){c.classList.toggle("s",+c.dataset.i===i&&i!==P.length-1)});
 var sl=$("#wsl");if(sl&&wX){sl.setAttribute("x1",wX(i));sl.setAttribute("x2",wX(i));sl.classList.toggle("on",!quiet&&i!==P.length-1)}}
function rhythmCard(){var N=D.N,c=D.wkc[weekStartOf(D.T)]||0,left=N-c,pct=Math.min(100,Math.round(c/N*100)),H=D.H.length,
 voice=!H?"Первая тренировка запустит ритм недели.":left<=0?"Цель недели выполнена":left===1?"Осталась одна тренировка":"Осталось "+plural(left,["тренировка","тренировки","тренировок"]),
 bars=weeksOf(6).map(function(w){var h=Math.round(Math.min(1,w.n/N)*52)+5;return '<div class="wb'+(w.cur?" cur":"")+'"><u>'+w.n+'</u><i data-h="'+h+'" data-c="'+barCol(w.n,N,w.cur)+'"></i><em>'+(w.cur?"эта":sd(w.s))+'</em></div>'}).join("");
 var btn="";if(left>0){btn=D.next?'<button class="cta go blk" id="rgo" data-wid="'+esc(String(D.next.id))+'" style="height:48px;font-size:15px">'+(H?"Открыть":"Начать")+' «'+esc(D.next.n.slice(0,26))+'»</button>':'<button class="cta go blk" id="rgo" style="height:48px;font-size:15px">'+(H?"К тренировкам":"Начать первую тренировку")+'</button>'}
 return '<div class="card rise" data-fz="r'+fzo("r")+'"><div class="ch2 fzh" role="button" tabindex="0" aria-expanded="'+!!OPENF.r+'"><h4>'+ic("dumb")+'Ритм недели</h4><span>'+(D.planned?"план: "+N+" в неделю":"ориентир: "+N+" в неделю")+'</span></div><div class="rhb" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+pct+'" aria-label="Тренировок на этой неделе: '+c+' из '+N+'"><i data-w="'+pct+'" data-c="'+barCol(c,N,true)+'"></i></div><div class="fzb"><div class="fzi"><div><span class="bign">'+c+'<small>из '+N+'</small></span></div><p class="voice">'+voice+'</p><div class="wbars" role="img" aria-label="Тренировок по неделям, последние 6">'+bars+'</div>'+btn+'</div></div></div>'}
function weeksOf(n){var r=[],ws=weekStartOf(D.T);for(var i=n-1;i>=0;i--){var s=addDays(ws,-7*i),e=addDays(s,6);r.push({s:s,n:D.wkc[s]||0,cur:i===0,h:D.H.filter(function(x){return x.d>=s&&x.d<=e})})}return r}
/* ===== огонёк недели: тот же рисунок, но «гибкий» =====
   Контур огонька (тот же, что в маске серых дней) изгибается от основания к кончику: основание неподвижно, верх уходит в сторону сильнее.
   Раскачка = сумма плавных волн с периодами 10, 5 и 3,3 с: за 10 с она не повторяется, а последний кадр равен первому, шва нет. */
var FL_N=60,FL_T=10,FL_PTS=[[12,1.5],[12.7,5.4],[17.9,7.5],[17.9,13.4],[17.9,16.66],[15.26,19.3],[12,19.3],[8.74,19.3],[6.1,16.66],[6.1,13.4],[6.1,11.1],[7.2,9.5],[8.5,8.2],[8.7,10.1],[9.5,11.2],[10.7,11.4],[10.3,8],[10.2,4.8],[12,1.5]];
function flRnd(seed){var a=(seed*2654435761)%4294967296||1;return function(){a^=a<<13;a>>>=0;a^=a>>>17;a^=a<<5;a>>>=0;return a/4294967296}}
function flWave(r,c){var p=[];for(var i=0;i<c.length;i++)p.push(r()*6.2832);return function(t){var v=0;for(var i=0;i<c.length;i++)v+=c[i][1]*Math.sin(6.2832*c[i][0]*t+p[i]);return v}}
function flPath(lean,wig,str){var o="";FL_PTS.forEach(function(q,i){var u=Math.max(0,(19.3-q[1])/17.8),x=q[0]+lean*Math.pow(u,1.7)+wig*Math.sin(3.1416*Math.min(1,u*1.15))*u,y=19.3-(19.3-q[1])*(1+str*u);
 o+=(i===0?"M":(i%3===1?"C":""))+x.toFixed(2)+" "+y.toFixed(2)+" "});return o+"Z"}
function flameSvg(k,kind){var r=flRnd(k*977+13),m=kind==="cur"?.55:1,
 L=flWave(r,[[1,1.0],[2,.35],[3,.18]]),G=flWave(r,[[2,.8],[3,.5],[5,.2]]),S=flWave(r,[[1,.6],[3,.4]]),v=[];
 for(var i=0;i<=FL_N;i++){var t=(i%FL_N)/FL_N;v.push(flPath(L(t)*3.2*m,G(t)*.9*m,S(t)*.035*m))}
 return '<svg class="flm" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="'+v[0]+'" '+(kind==="cur"?'style="fill:var(--coral-soft)"':'fill="url(#flg-b)"')+'><animate attributeName="d" dur="'+FL_T+'s" repeatCount="indefinite" values="'+v.join(';')+'"/></path></svg>'}
var FLDEFS='<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="flg-b" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#E0572F"/><stop offset=".55" stop-color="#EE6A33"/><stop offset="1" stop-color="#FF9A4D"/></linearGradient></defs></svg>';
window.__flameSvg=flameSvg;

function streakCard(){var S=D.streak,N=D.N,curOk=(D.wkc[weekStartOf(D.T)]||0)>=N,total=Math.max(12,S.cur+6),dts="";
 for(var k=1;k<=total;k++){var cl=k<=S.cur?"on":(k===S.cur+1&&!curOk?"cur":"");dts+='<i class="'+cl+'">'+(cl?flameSvg(k,cl):'')+k+'</i>'}
 var tx="Серия — это недели подряд, в которые вы выполнили недельный план тренировок. Сейчас план — "+plural(N,["тренировка","тренировки","тренировок"])+" в неделю: выполнили все — неделя засчитана, пропустили — счёт начинается заново.";
 return '<div class="card rise" data-fz="s'+fzo("s")+'"><div class="stk fzh" role="button" tabindex="0" aria-expanded="'+!!OPENF.s+'"><span class="fl">'+ic("flame")+'</span><div class="tx"><b>'+plural(S.cur,WU)+' в ритме</b></div></div><div class="dsr fzt" role="button" tabindex="0" aria-label="Недели серии. Нажмите, чтобы узнать, как считается серия">'+FLDEFS+'<div class="dsw" data-cur="'+Math.max(0,Math.min(S.cur,total)-1+(!curOk&&S.cur<total?1:0))+'">'+dts+'</div></div><div class="fzb"><div class="fzi"><p class="stx">'+esc(tx)+'</p></div></div></div>'}
var CALR=window.CALR=window.CALR||{a:null,b:null,pend:false,edit:null};
var CMN=["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
function calFirst(){return D.H.length?D.H[0].d:addDays(D.T,-29)}
function calRange(){if(!CALR.a){CALR.a=addDays(D.T,-29);CALR.b=D.T}return CALR}
function calMonths(){var T=D.T,f=calFirst(),y=+f.slice(0,4),m=+f.slice(5,7),ty=+T.slice(0,4),tm=+T.slice(5,7),c=(ty-y)*12+(tm-m);if(c<5){m-=5-c;while(m<1){m+=12;y--}}
 var out=[];while(y<ty||(y===ty&&m<=tm)){out.push([y,m]);m++;if(m>12){m=1;y++}}return out}
function calCard(){var T=D.T,R=calRange(),by={};D.H.forEach(function(e){(by[e.d]=by[e.d]||[]).push(e)});
 var head="Пн Вт Ср Чт Пт Сб Вс".split(" ").map(function(x){return '<span class="wn">'+x+'</span>'}).join(""),ms="";
 calMonths().forEach(function(ym){var y=ym[0],m=ym[1],f=y+"-"+(m<10?"0":"")+m+"-01",dim=new Date(Date.UTC(y,m,0)).getUTCDate(),off=dowOf(f),c="";
  for(var k=0;k<off;k++)c+='<i class="ph"></i>';
  for(var d=1;d<=dim;d++){var iso=y+"-"+(m<10?"0":"")+m+"-"+(d<10?"0":"")+d,L=by[iso];
   c+='<button class="cd2'+(iso>T?" fu":"")+(iso===T?" td":"")+(L?" w":"")+(L&&L.length>1?" m2":"")+'" data-d="'+iso+'"'+(iso>T?" disabled":"")+'>'+d+'</button>'}
  ms+='<div class="pm"><h5>'+CMN[m-1]+' '+y+'</h5><div class="cal">'+(ms?"":head)+c+'</div></div>'});
 return '<div class="card rise" data-fz="c'+fzo("c")+'"><div class="ch2 fzh" role="button" tabindex="0" aria-expanded="'+!!OPENF.c+'"><h4>'+ic("calic")+'Календарь</h4><span id="pcs"></span></div><div class="fzb"><div class="fzi"><div class="pcw">'
  +chips(PERS.map(function(x){return [x[0],x[1]]}),"","nw","pcc")
  +'<div class="pcp"><button id="pca"></button><i></i><button id="pcb"></button></div>'
  +'<div class="pcsc" data-noswipe>'+ms+'</div><div class="pcn" id="pcn"></div><div class="pcl" id="pcl"></div></div></div></div></div>'}
function calSet(a,b){if(a>b){var t=a;a=b;b=t}CALR.a=a;CALR.b=b}
function calPer(k){var T=D.T,x=PERS.filter(function(z){return z[0]===k})[0];CALR.a=x[2]?addDays(T,-(x[2]-1)):calFirst();CALR.b=T;CALR.pend=false;CALR.edit=null}
function calUpd(){var R=calRange(),root=$("#p0");if(!root)return;
 $$(".pcsc .cd2",root).forEach(function(b){var d=b.dataset.d,i=d>=R.a&&d<=R.b;b.classList.toggle("in",i&&!b.classList.contains("w"));b.classList.toggle("ed",d===R.a||d===R.b)});
 var cur="";PERS.forEach(function(x){var a=x[2]?addDays(D.T,-(x[2]-1)):calFirst();if(R.a===a&&R.b===D.T)cur=x[0]});
 $$("#pcc .chp",root).forEach(function(b){b.classList.toggle("on",b.dataset.k===cur)});
 var pa=$("#pca"),pb=$("#pcb");pa.innerHTML='<small>От</small>'+dmyy(R.a,D.T);pb.innerHTML='<small>До</small>'+dmyy(R.b,D.T);
 pa.classList.toggle("on",CALR.edit==="a"||(CALR.pend&&false));pb.classList.toggle("on",CALR.edit==="b"||CALR.pend);
 var L=D.H.filter(function(e){return e.d>=R.a&&e.d<=R.b}),n=L.length,mins=0;L.forEach(function(e){if(e.sec>=30)mins+=e.sec/60});
 var days={};L.forEach(function(e){days[e.d]=1});
 $("#pcs").textContent=n?plural(n,["тренировка","тренировки","тренировок"]):"нет тренировок";
 $("#pcn").innerHTML=CALR.pend?'Выберите конечную дату':(n?'<b>'+plural(n,["тренировка","тренировки","тренировок"])+'</b> · '+plural(Object.keys(days).length,["день","дня","дней"])+(mins>=1?' · '+Math.round(mins)+' мин':''):'В этом периоде тренировок нет');
 var rev=L.slice().reverse(),lim=CALR.all?rev.length:20;
 $("#pcl").innerHTML=rev.slice(0,lim).map(histRow).join("")+(rev.length>lim?'<button class="pcm" id="pcm">Показать ещё '+(rev.length-lim)+'</button>':'');
 $$(".hr",$("#pcl")).forEach(function(b){b.onclick=function(){openSession(D.H[+b.dataset.i],b)}});
 var m=$("#pcm");if(m)m.onclick=function(){CALR.all=true;calUpd()}}
function calScroll(){var s=$(".pcsc");if(!s||CALR.touched)return;var R=calRange(),t=s.querySelector('[data-d="'+R.b+'"]');if(t&&s.clientHeight)s.scrollTop=Math.max(0,t.offsetTop-s.clientHeight+90)}
function calInit(){var root=$("#p0"),sc=$(".pcsc",root);if(!sc)return;
 bindChips("pcc",function(){});
 $$("#pcc .chp",root).forEach(function(b){b.addEventListener("click",function(){calPer(b.dataset.k);CALR.all=false;CALR.touched=false;calUpd();calScroll()})});
 $("#pca").onclick=function(){CALR.edit=CALR.edit==="a"?null:"a";CALR.pend=false;calUpd()};
 $("#pcb").onclick=function(){CALR.edit=CALR.edit==="b"?null:"b";CALR.pend=false;calUpd()};
 ["touchstart","wheel","pointerdown"].forEach(function(n){sc.addEventListener(n,function(){CALR.touched=true},{passive:true})});
 sc.onclick=function(ev){var b=ev.target.closest&&ev.target.closest(".cd2");if(!b||b.disabled)return;var d=b.dataset.d,R=calRange();CALR.all=false;
  try{navigator.vibrate&&navigator.vibrate(6)}catch(e){}
  if(CALR.edit==="a"){calSet(d,R.b);CALR.edit=null}
  else if(CALR.edit==="b"){calSet(R.a,d);CALR.edit=null}
  else if(!CALR.pend){CALR.a=CALR.b=d;CALR.pend=true}
  else{calSet(R.a,d);CALR.pend=false}
  calUpd()};
 $$('[data-fz="c"] .fzh',root).forEach(function(h){h.addEventListener("click",function(){setTimeout(calScroll,60);setTimeout(calScroll,460)})});
 calUpd();calScroll();if(OPENF.c)setTimeout(calScroll,460)}
function medalsCard(){return '<div class="rise"><div class="ch2" style="margin-bottom:4px"><h4>Медали</h4><span>нажмите, чтобы узнать подробнее</span></div><div class="mrow">'+D.fams.map(function(m,i){var s=mState(m),one=m.L.length===1;
  return '<button class="md" data-m="'+i+'"><span class="mr'+(s.lv?" on":" z")+'"><svg class="rr" viewBox="0 0 36 36"><circle class="t" cx="18" cy="18" r="16"/><circle class="f" cx="18" cy="18" r="16" pathLength="1" data-f="'+s.f.toFixed(3)+'"'+(s.f<=0?' style="opacity:0"':'')+'/></svg><i>'+ic(m.ic)+'</i></span><b>'+m.n+'</b><span>'+(s.lv?(one?"Получена":"Уровень "+s.lv+" из "+m.L.length):"Ещё не получена")+'</span></button>'}).join("")+'</div></div>'}
function greeting(E0){var nm=S(D.prof.name,24),n30=inWin(addDays(D.T,-29)).length,left=D.N-(D.wkc[weekStartOf(D.T)]||0),s;
 if(E0)s="Здесь появится ваш путь: тренировки, вес и медали. Начните с любого шага.";
 else if(!D.H.length)s="Вес записан. Первая тренировка запустит ритм и откроет остальные блоки.";
 else if(left<=0)s="Неделя в ритме. Дальше можно просто держать темп.";
 else if(n30>0){var avg=Math.round(n30/30*7*10)/10;s="За 30 дней: "+plural(n30,["тренировка","тренировки","тренировок"])+", в среднем "+fk(avg)+" в неделю при плане "+D.N+".";}
 else s="Вернуться можно в любой момент: начните с лёгкой тренировки.";
 return '<p class="voice rise">'+(nm?esc(nm)+", "+esc(lowerFirst(s)):esc(s))+'</p>'}
function p0(){var E0=!D.H.length&&!D.W.length,h=greeting(E0),sumH="";
 if(E0)h+='<div class="card hero0 rise"><span class="eyebrow">Старт</span><h3>Ваш путь начнётся здесь</h3><p class="voice">Пока нет ни тренировок, ни записей веса. Достаточно одного шага: всё остальное посчитается само.</p><div class="stp2"><button class="cta go blk" id="e0w">Начать первую тренировку</button><button class="cta rg blk" id="e0v">Записать вес</button></div></div>';
 
 h+=rhythmCard()+weightCard()+streakCard()+calCard()+medalsCard();
 $("#p0").innerHTML=h;
 wRS();if(D.W.length>=2)wDraw();
 $$("[data-m]",$("#p0")).forEach(function(b){b.onclick=function(){openMedal(+b.dataset.m,b)}});
 calInit();
 var a=$("#wadd");if(a)a.onclick=function(){openW(a)};
 var e0w=$("#e0w");if(e0w)e0w.onclick=function(){go("work")};var e0v=$("#e0v");if(e0v)e0v.onclick=function(){openW(e0v)};
 var rg=$("#rgo");if(rg)rg.onclick=function(){buzz(8);if(rg.dataset.wid&&D.next)send({t:"open",wid:D.next.id});else send({t:"tab",to:"work"})};
 var tg=$("#wtg");if(tg)tg.onclick=function(){var on=!wRem();setPatch({wRem:on});tg.classList.toggle("on",on);tg.setAttribute("aria-checked",on);buzz(on?[6,30,6]:6);pulseAt(tg,"var(--green)",0);wRS();toast(on?"Спросим про вес раз в неделю":"Больше не спрашиваем про вес")};
 if($("#wpch"))bindChips("wpch",function(k){wPer=k;wDraw()});
 anim($("#p0"))}
function wRS(){var e=$("#wrs");if(e)e.textContent=wRem()?"Спросим раз в неделю на Главной":"Выключено, вес можно вносить здесь"}

/* ---------- запись веса ---------- */
function parseW(s){var v=nn(s);return isFinite(v)?Math.round(v*10)/10:NaN}
var W_MIN=30,W_MAX=250,wv=-1,wlast=null,rulerBuilt=false;
function rr1(v){return Math.round(v*10)/10}
function buildRuler(){if(rulerBuilt)return;rulerBuilt=true;var tk=$("#wr .ticks"),f=document.createDocumentFragment();
 for(var v=0;v<=(W_MAX-W_MIN)*10;v++){var t=document.createElement("div");t.className="t1"+(v%10===0?" m10":v%5===0?" m5":"");if(v%10===0){var e=document.createElement("em");e.textContent=W_MIN+v/10;t.appendChild(e)}f.appendChild(t)}tk.appendChild(f)}
function wHint(){var h=$("#whint");if(wlast==null){h.textContent="Первая запись станет отправной точкой";return}
 var d=rr1(wv-wlast);h.textContent=d===0?"Как в прошлый раз":(d>0?"+":"−")+f1(Math.abs(d))+" кг к прошлому разу"}
function setW(v,src){v=Math.max(W_MIN,Math.min(W_MAX,rr1(isFinite(+v)?+v:wv)));var ch=v!==wv;wv=v;var inp=$("#wi");if(src!=="input")inp.value=f1(wv);
 if(src!=="ruler"){var r=$("#wr");r.style.scrollSnapType="none";r.scrollLeft=Math.round((wv-W_MIN)*10)*10;setTimeout(function(){r.style.scrollSnapType=""},60)}
 if(ch&&src&&src!=="ruler"){var m=$(".rmark");m.classList.remove("p");void m.offsetWidth;m.classList.add("p");var bg=$("#shW .big");bg.classList.remove("p");void bg.offsetWidth;bg.classList.add("p");buzz(4)}
 $("#wsave").disabled=false;$("#werr").textContent="";wHint()}
function openW(btn){buildRuler();var T=D.T,has=D.W.some(function(r){return r.d===T}),L=D.W,pw=nn(D.prof.w),last=L.length?L[L.length-1].v:NaN,pL=L.filter(function(r){return r.d!==T}),pv=pL.length?pL[pL.length-1].v:NaN;wlast=isFinite(pv)?pv:null;
 var v=isFinite(last)?last:(pw>=W_MIN&&pw<=W_MAX?pw:60);$("#wdate").textContent="Сегодня, "+dmy(T)+(has?" · запись за сегодня будет заменена":"");wv=-1;setW(v);openSheet("shW");
 setTimeout(function(){setW(wv)},120);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){setW(wv)})}
(function(){var r=$("#wr"),inp=$("#wi");
 var rst=null;r.addEventListener("scroll",function(){var v=rr1(W_MIN+Math.round(r.scrollLeft/10)/10);if(Math.abs(v-wv)>0.001&&document.activeElement!==inp)setW(v,"ruler");clearTimeout(rst);rst=setTimeout(function(){var t=Math.round(r.scrollLeft/10)*10;if(Math.abs(r.scrollLeft-t)>.6)r.scrollTo({left:t,behavior:"smooth"})},130)},{passive:true});
 inp.addEventListener("input",function(){var x=parseFloat(inp.value.replace(",","."));if(isFinite(x)&&x>=W_MIN&&x<=W_MAX){var v=rr1(x);wv=v;var rr=$("#wr");rr.style.scrollSnapType="none";rr.scrollLeft=Math.round((wv-W_MIN)*10)*10;setTimeout(function(){rr.style.scrollSnapType=""},60);$("#wsave").disabled=false;$("#werr").textContent="";wHint()}else{$("#wsave").disabled=true;$("#werr").textContent="Введите вес от 30 до 250 кг"}});
 inp.addEventListener("blur",function(){inp.value=f1(wv);$("#wsave").disabled=false;$("#werr").textContent="";wHint()});
 inp.addEventListener("focus",function(){try{inp.select()}catch(e){}});
 inp.addEventListener("keydown",function(e){if(e.key==="Enter"){e.preventDefault();inp.blur()}});
 function hold(btn,d){var t1,t2;function step(){setW(wv+d,"step")}function stop(){clearTimeout(t1);clearInterval(t2)}
  btn.addEventListener("pointerdown",function(e){e.preventDefault();step();t1=setTimeout(function(){t2=setInterval(step,70)},380)});
  ["pointerup","pointerleave","pointercancel"].forEach(function(n){btn.addEventListener(n,stop)})}
 hold($("#wm"),-0.1);hold($("#wp"),0.1);
 $("#wsave").onclick=function(){var x=parseFloat($("#wi").value.replace(",","."));if(isFinite(x)&&x>=W_MIN&&x<=W_MAX)wv=rr1(x);
  if(!(wv>=W_MIN&&wv<=W_MAX)){$("#werr").textContent="Введите вес от 30 до 250 кг";buzz([10,40,10]);return}
  var v=wv,T=todayIso(),list=arr(FS.get("wt")).filter(function(r){return r&&typeof r==="object"&&r.d!==T});list.push({d:T,v:v});list.sort(function(a,b){return String(a.d)<String(b.d)?-1:String(a.d)>String(b.d)?1:0});
  FS.set("wt",list);var p=FS.get("profile");if(!p||typeof p!=="object"||Array.isArray(p))p={};p.w=v;FS.set("profile",p);
  closeLayers();buzz([8,30,8]);refresh(true);setTimeout(function(){var t=$("#wcard .bign")||$("#wcard");pulseAt(t,"var(--coral)")},250);toast("Вес "+f1(v)+" кг записан")}})();

/* ---------- медали: окно ---------- */
function openMedal(i,btn){var m=D.fams[i];if(!m)return;var s=mState(m),one=m.L.length===1,
 rows=m.L.map(function(t,j){var ok=s.v>=t,cur=!ok&&j===s.lv;return '<div class="lv'+(ok?" ok":"")+'"><i>'+(ok?ic("check").replace('class="i"','class="i" style="width:15px;height:15px"'):j+1)+'</i><span class="t"><b>'+(one?"Цель":"Уровень "+(j+1))+'</b><span>'+mLab(m,t)+(cur?' · сейчас '+(m.fmt?m.fmt(s.v):s.v):'')+'</span>'+(cur?'<div class="pb"><s style="width:'+Math.round(clamp(s.v/t,0,1)*100)+'%"></s></div>':'')+'</span></div>'}).join(""),
 tip=s.nx?'<div class="tip up"><b>До следующего уровня</b><p class="voice">'+m.h(s.nx-s.v)+'.</p></div>':'<div class="tip up"><b>Все уровни взяты</b><p class="voice">Максимальный уровень. Дальше мы добавим новые цели.</p></div>';
 win('<div class="pw-h"><span class="eyebrow">Медаль</span><h3>'+m.n+'</h3><div class="meta"><span>'+(s.lv?(one?"Получена":"Уровень "+s.lv+" из "+m.L.length):"Ещё не получена")+'</span><span>сейчас '+(m.fmt?m.fmt(s.v):s.v)+'</span></div><p class="voice" style="margin-top:4px">'+m.d+'</p></div><div class="pw-l"><div class="lvs">'+rows+'</div>'+tip+'</div><div class="pw-f"><button class="cta rg" id="wc">Закрыть</button><button class="cta go" id="wgo">'+(m.go==="wt"?"Записать вес":"К тренировкам")+'</button></div>',btn);
 $("#wc").onclick=function(){closeLayers();buzz(6)};
 $("#wgo").onclick=function(){closeLayers();buzz(8);if(m.go==="wt")setTimeout(function(){openW(null)},350);else setTimeout(function(){send({t:"tab",to:"work"})},250)}}
var announcing=false;
function checkMedals(){if(!shown||!D||announcing)return;var st=FS.get("set"),seen=st&&typeof st==="object"&&Array.isArray(st.medals)?st.medals:[],now=earnedIds(),fresh=now.filter(function(id){return seen.indexOf(id)<0});if(!fresh.length)return;
 announcing=true;setPatch({medals:seen.concat(fresh)});
 var fam={};fresh.forEach(function(id){fam[id.split(":")[0]]=1});var ks=Object.keys(fam),m0=D.fams.filter(function(m){return m.k===ks[0]})[0],lvl=now.filter(function(id){return id.split(":")[0]===ks[0]}).length;
 setTimeout(function(){toast(ks.length===1?"Новая медаль: «"+m0.n+"»"+(m0.L.length>1?", уровень "+Math.min(lvl,m0.L.length):""):"Новые медали: "+ks.length);
  if(pane===0)ks.forEach(function(k,j){var el=$('[data-m="'+D.fams.map(function(m){return m.k}).indexOf(k)+'"] .mr',$("#p0"));if(el)setTimeout(function(){pulseAt(el)},j*220)});announcing=false},600)}

/* ---------- Тренировки ---------- */
var METR=[["sets","Подходы"],["min","Минуты"],["eff","Усилие"],["vol","Объём"]];
function mVal(hs,m){if(m==="sets")return hs.reduce(function(s,h){return s+h.sets},0);if(m==="min")return Math.round(hs.reduce(function(s,h){return s+h.sec},0)/60);
 if(m==="eff"){var n=0,t=0;hs.forEach(function(h){n+=h.effN;t+=h.effS});return n?t/n:0}return hs.reduce(function(s,h){return s+h.vol},0)}
function mLabV(v,m){if(m==="eff")return v?f1(v):"–";if(m==="vol")return v>=1e6?th(v/1000)+" т":v>=1000?f1(v/1000)+" т":(v>0?Math.round(v)+" кг":"0");return String(Math.round(v))}
var mZero=true;
function mBars(){var W=weeksOf(6),vs=W.map(function(w){var v=mVal(w.h,mMetric);return isFinite(v)?v:0}),mx=Math.max.apply(null,vs.concat([1]));mZero=!vs.some(function(v){return v>0});
 return W.map(function(w,i){var h=vs[i]>0?Math.max(6,Math.round(vs[i]/mx*72)):3;return '<div class="wb'+(w.cur?" cur":"")+(vs[i]>0?"":" z")+'"><u>'+mLabV(vs[i],mMetric)+'</u><i data-h="'+h+'"></i><em>'+(w.cur?"эта":sd(w.s))+'</em></div>'}).join("")}
function muscleData(hs,from){var G={},cl=0,rows;GALL.forEach(function(g){G[g]=0});
 hs.forEach(function(e){var egp=pairs(e.gp);e.ex.forEach(function(x){var n=doneOf(x).length;if(!n)return;var dist=pairs(x.g)||catDist(x)||egp;if(!dist)return;cl+=n;dist.forEach(function(r){G[r[0]]+=n*r[1]})})});
 var first=D.H.length?D.H[0].d:D.T,s0=from&&from>first?from:first,weeks=Math.max(1,(daysBetween(s0,D.T)+1)/7);
 rows=GALL.map(function(g){return [g,G[g]/weeks]}).sort(function(a,b){return b[1]-a[1]});return {rows:rows,cl:cl}}
function histRow(h,i){var p=h.d.split("-"),bits=[];if(h.sec>=30)bits.push(Math.max(1,Math.round(h.sec/60))+" мин");if(h.eff)bits.push("усилие "+f1(h.eff));if(h.ex.length)bits.push(plural(h.ex.length,["упр.","упр.","упр."]));
 var yr=p[0]!==D.T.slice(0,4)?p[0]+" · ":"";
 return '<button class="hr" data-i="'+h.i+'" style="animation:glassIn .45s var(--spring) '+Math.min(i,8)*40+'ms backwards"><span class="dd"><b>'+(+p[2])+'</b><small>'+MS[+p[1]-1]+'</small></span><span class="t"><b>'+esc(h.wn)+'</b><span>'+esc(yr+bits.join(" · "))+'</span></span>'+(h.pain?'<s class="pk"></s>':'')+ic("chev")+'</button>'}
function p1(){var h2="";
 if(!D.H.length){
  h2='<div class="card hero0 rise"><span class="eyebrow">Тренировки</span><h3>Пока нет тренировок</h3><p class="voice">Здесь появятся минуты, объём, нагрузка по группам мышц и история с разбором каждой тренировки. Всё считается из ваших тренировок.</p><div class="stp2"><div class="nxt"><i>1</i><span>Проведите первую тренировку</span></div><div class="nxt"><i>2</i><span>После второй откроется баланс мышц</span></div></div><button class="cta go blk" id="e1w">Начать первую тренировку</button></div>'
  +'<div class="card rise"><div class="ch2"><h4>По неделям</h4><span>последние 6</span></div><div class="mbars" role="img" aria-label="По неделям, последние 6">'+mBars()+'</div><span class="small">Пока нет данных: столбики появятся после первой тренировки.</span></div>'
  +lockedMuscles();
  $("#p1").innerHTML=h2;var b=$("#e1w");if(b)b.onclick=function(){go("work")};anim($("#p1"));return}
 var pr=perOf(per),from=perFrom(pr),hs=inWin(from),n=hs.length,mins=mVal(hs,"min"),ef=mVal(hs,"eff"),vol=mVal(hs,"vol");
 var pc=PERS.map(function(p){return [p[0],p[1]]});
 var tiles='<div class="tiles rise"><div class="tile"><span>Тренировок</span><div class="v">'+n+'</div><small>'+pr[3]+'</small></div><div class="tile"><span>Минут</span><div class="v'+(mins?"":" dash")+'">'+(mins?th(mins):"–")+'</div><small>'+(n&&mins?"в среднем "+Math.round(mins/n)+" на тренировку":"нет данных о времени")+'</small></div><div class="tile"><span>Объём</span><div class="v'+(vol>0?"":" dash")+'">'+(vol>0?mLabV(vol,"vol"):"–")+'</div><small>'+(vol>0?"суммарный тоннаж":"нет подходов с весом")+'</small></div><div class="tile"><span>Усилие</span><div class="v'+(ef?"":" dash")+'">'+(ef?f1(ef):"–")+'</div><small>'+(ef?"в среднем из 10":"оценок пока нет")+'</small></div></div>';
 var mus;
 if(D.H.length<2)mus=lockedMuscles();
 else{var md=muscleData(hs,from),rows=md.rows,lowG=rows.filter(function(r){return r[1]<LOW}).sort(function(a,b){return a[1]-b[1]}).slice(0,3).map(function(r){return GS[r[0]].toLowerCase()}),hiG=rows.filter(function(r){return r[1]>HIGH}).slice(0,2).map(function(r){return GS[r[0]].toLowerCase()});
  var rh=rows.map(function(r){var v=r[1],c=v<=0?"z":v<LOW?"lo":v>HIGH?"hi":"ok",lab=v<=0?"нет нагрузки":v<LOW?"ниже ориентира":v>HIGH?"выше ориентира":"в ориентире",col=v<LOW?"var(--pink)":v>HIGH?"var(--coral)":"var(--green)";
   return '<div class="r '+c+'"><span>'+GS[r[0]]+'<small>'+lab+'</small></span><div class="tk"><i data-w="'+Math.min(100,v/HIGH*100).toFixed(1)+'" data-c="'+col+'"></i></div><span class="v">'+(v>0?f0(v):"0")+'</span></div>'}).join("");
  var adv=!n?"В этом периоде тренировок не было. Выберите период пошире.":!md.cl?"Для упражнений из этого периода нет данных о мышцах, поэтому нагрузку по группам показать нельзя.":
   (lowG.length?"Меньше всего нагрузки: "+lowG.join(", ")+". Если так и задумано, всё в порядке; для ровной картины можно добавить упражнение на эти группы.":"Нагрузка распределена ровно: все группы получают не меньше "+LOW+" подходов в неделю.")+(hiG.length?" Выше ориентира: "+hiG.join(", ")+", им стоит дать время восстановиться.":"");
  mus='<div class="card rise"><div class="ch2"><h4>Баланс мышц</h4><span>подходов в неделю</span></div><div class="gr">'+(md.cl?rh:"")+'</div><p class="voice">'+esc(adv)+'</p><span class="small">Среднее за период. Ориентир '+LOW+'–'+HIGH+' подходов в неделю на группу: рабочая логика, её стоит сверять с вашей методикой. Подход делится между мышцами по их доле в упражнении.</span></div>'}
 var pgs=[],seen={};hs.forEach(function(e){if(e.pn&&!seen[e.pn]){seen[e.pn]=1;pgs.push(e.pn)}});if(pgF&&!seen[pgF])pgF="";
 var list=hs.filter(function(e){return !pgF||e.pn===pgF}).slice().reverse(),shownL=list.slice(0,hShown),pch=pgs.length>1?'<div class="chips sc" id="pgch">'+[["","Все программы"]].concat(pgs.map(function(p){return [p,p.length>24?p.slice(0,23)+"…":p]})).map(function(m){return '<button class="chp sm'+(m[0]===pgF?" on":"")+'" data-k="'+esc(m[0])+'">'+esc(m[1])+'</button>'}).join("")+'</div>':"";
 var hist=shownL.map(histRow).join("");
 h2='<div class="rise"><div class="ch2" style="margin-bottom:8px"><h4>Период</h4><span>для сводки, мышц и истории</span></div>'+chips(pc,per,"nw","pch")+'</div>'+tiles
 +'<div class="card rise"><div class="ch2"><h4>По неделям</h4><span>последние 6</span></div>'+chips(METR,mMetric,"nw","mch")+'<div class="mbars" id="mb" role="img" aria-label="По неделям, последние 6">'+mBars()+'</div><p class="small" id="mnote" style="margin:0"'+(mZero?'':' hidden')+'>По этому показателю пока нет данных.</p></div>'+mus
 +'<div class="rise"><div class="ch2" style="margin-bottom:8px"><h4>История</h4><span>'+plural(list.length,["тренировка","тренировки","тренировок"])+'</span></div>'+pch+'<div class="hsr" style="margin-top:'+(pch?8:0)+'px">'+(hist||'<div class="empty2">В этом периоде тренировок нет.</div>')+'</div>'+(list.length>shownL.length?'<button class="cta" id="hmore" style="margin-top:10px;width:100%;height:48px;font-size:15px">Показать ещё '+Math.min(10,list.length-shownL.length)+'</button>':'')+(!list.length?'<button class="cta go blk" id="hgo" style="margin-top:10px;height:48px;font-size:15px">К тренировкам</button>':'')+'</div>';
 $("#p1").innerHTML=h2;anim($("#p1"));
 bindChips("pch",function(k){per=k;hShown=8;pgF="";soft(1)});
 bindChips("mch",function(k){mMetric=k;buzz(5);$("#mb").innerHTML=mBars();var mn=$("#mnote");if(mn)mn.hidden=!mZero;anim($("#mb"))});
 if($("#pgch"))bindChips("pgch",function(k){pgF=k;hShown=8;soft(1)});
 $$(".hr",$("#p1")).forEach(function(b){b.onclick=function(){openSession(D.H[+b.dataset.i],b)}});
 var hm=$("#hmore");if(hm)hm.onclick=function(){hShown+=10;buzz(6);var y=$("#scroll").scrollTop;soft(1);$("#scroll").scrollTo({top:y,behavior:"instant"})};
 var hg=$("#hgo");if(hg)hg.onclick=function(){go("work")}}
function lockedMuscles(){var n=D.H.length,left=Math.max(0,2-n);return '<div class="card rise"><div class="ch2"><h4>Баланс мышц</h4><span>откроется после 2 тренировок</span></div><div class="lock"><p class="voice">Покажем, какие из 11 групп мышц получают нагрузку, а какие отстают от ориентира '+LOW+'–'+HIGH+' подходов в неделю.</p><div class="unl"><span>'+(left?"Ещё "+plural(left,["тренировка","тренировки","тренировок"]):"Данных достаточно")+'</span><div class="pb"><s data-w="'+Math.round(Math.min(1,n/2)*100)+'"></s></div></div></div></div>'}
function soft(i){var y=$("#scroll").scrollTop;renderPane(i,true);$("#scroll").scrollTo({top:y,behavior:"instant"})}
function exRows(e){if(!e.ex.length)return '<div class="empty2">В этой записи нет упражнений.</div>';return e.ex.map(function(x){var dn=doneOf(x).length;return '<div class="cx"><div class="cxh"><b>'+esc(x.n)+'</b>'+(x.pain?'<em class="pk">Дискомфорт</em>':'')+(dn<x.sets.length?'<em class="pk">'+dn+' из '+x.sets.length+' подх.</em>':'')+'</div><span class="cxs">'+(x.sets.length?esc(setsLine(x))+(x.eff?" · усилие "+x.eff:""):"подходы не записаны")+'</span>'+(x.my?'<p>'+esc(x.my)+'</p>':'')+(x.tn?'<p>Тренер: '+esc(x.tn)+'</p>':'')+'</div>'}).join("")}
function openSession(e,btn){if(!e)return;var p=e.d.split("-"),meta=[];
 if(e.sec>=30)meta.push(Math.max(1,Math.round(e.sec/60))+" мин");meta.push(plural(e.ex.length,["упражнение","упражнения","упражнений"]));if(e.kcal)meta.push("≈ "+e.kcal+" ккал");if(e.pct&&e.pct<100)meta.push("выполнено "+e.pct+"%");if(e.eff)meta.push("усилие "+f1(e.eff));
 win('<div class="pw-h"><span class="eyebrow">'+esc(dmyy(e.d,D.T))+' · '+WDN[wdOf(e.d)]+'</span><h3>'+esc(e.wn)+'</h3><div class="meta">'+meta.map(function(m){return '<span>'+esc(m)+'</span>'}).join("")+'</div>'+(e.pn?'<span class="small">'+esc(e.pn)+'</span>':'')+'</div><div class="pw-l">'+(e.tn?'<p class="gn2 tn2">Тренер: '+esc(e.tn)+'</p>':'')+(e.note?'<p class="gn2">'+esc(e.note)+'</p>':'')+'<div class="cxl">'+exRows(e)+'</div></div><div class="pw-f"><button class="cta rg" id="wc">Закрыть</button>'+(e.ro?'':'<button class="cta go" id="wr2">Повторить тренировку</button>')+'</div>',btn);
 $("#wc").onclick=function(){closeLayers();buzz(6)};
 var wr2=$("#wr2");if(wr2)wr2.onclick=function(){closeLayers();buzz(8);setTimeout(function(){if(e.k)send({t:"open",k:e.k,pn:e.pn||""});else send({t:"tab",to:"work"})},300)}}

/* ---------- Упражнения ---------- */
var XF=[["all","Все"],["up","Растёт"],["pl","Плато"],["dn","Снижение"],["pn","Дискомфорт"]];
function xMatch(e,f){return f==="all"||(f==="pn"?e.pn:e.st===f)}
function xPr(e){return e.pn?0:(e.st==="pl"||e.st==="dn")?1:e.st==="up"?2:3}
function xSorted(){return D.EX.slice().sort(function(a,b){return xPr(a)-xPr(b)||(a.lastD<b.lastD?1:a.lastD>b.lastD?-1:0)})}
function fu(v,u){return f0(v)+" "+u}
function spark(e){var vs=e.p.map(function(r){return r.v}),mn=Math.min.apply(null,vs),mx=Math.max.apply(null,vs),W=62,H=28,n=vs.length,col=e.st==="up"?"var(--green)":(e.st==="pl"||e.st==="dn")?"var(--pink)":"var(--ink3)";
 if(n===1)return '<svg viewBox="0 0 '+W+' '+H+'"><circle cx="'+W/2+'" cy="'+H/2+'" r="3" style="fill:'+col+'"/></svg>';
 var pts=vs.map(function(v,i){return (3+(W-6)*i/(n-1)).toFixed(1)+","+(mx===mn?H/2:(H-4-(H-8)*(v-mn)/(mx-mn))).toFixed(1)}).join(" ");return '<svg viewBox="0 0 '+W+' '+H+'"><polyline points="'+pts+'" style="stroke:'+col+'"/></svg>'}
function xDelta(e){if(e.prev==null)return "";var dl=e.last-e.prev;return Math.abs(dl)<1e-9?"без изменений":(dl>0?"+":"−")+f0(Math.abs(dl))+" "+e.u+" к прошлому"}
function p2(){
 if(!D.EX.length){$("#p2").innerHTML='<div class="card hero0 rise"><span class="eyebrow">Упражнения</span><h3>Пока нет данных</h3><p class="voice">Здесь будет каждое упражнение с динамикой веса, рекордами и мягкими советами. Нужна хотя бы одна завершённая тренировка, а для динамики две.</p><button class="cta go blk" id="e2w">'+(D.H.length?"К тренировкам":"Начать первую тренировку")+'</button></div>';$("#p2").querySelector("#e2w").onclick=function(){go("work")};return}
 var X=xSorted(),cnt=function(f){return X.filter(function(e){return xMatch(e,f)}).length},fl=XF.map(function(f){return [f[0],f[1],0,cnt(f[0])]});
 $("#p2").innerHTML='<div class="xsr rise">'+ic("search")+'<input id="xq" type="search" placeholder="Найти упражнение" autocomplete="off" autocorrect="off" spellcheck="false" enterkeyhint="search" value="'+esc(xQ)+'"><button id="xqc" type="button" aria-label="Очистить"'+(xQ?"":" hidden")+'>'+ic("x")+'</button></div><div class="rise" id="xcw"><p class="voice" style="margin-bottom:10px">Сверху те упражнения, которым сейчас нужно внимание.</p>'+chips(fl,xF,"sc","xch")+'</div><div class="hsr rise" id="xl"></div><div id="xm"></div>';
 xList();bindChips("xch",function(k){xF=k;xShown=15;xList()});
 var qi=$("#xq"),qc=$("#xqc");qi.oninput=function(){xQ=qi.value;qc.hidden=!xQ;xShown=xQ?30:15;xList()};
 qi.onkeydown=function(ev){if(ev.key==="Enter"){ev.preventDefault();qi.blur()}};
 qc.onclick=function(){xQ="";qi.value="";qc.hidden=true;xShown=15;xList();qi.focus()}}
function xNorm(s){return String(s||"").toLowerCase().replace(/ё/g,"е").trim()}
function xFind(e){var t=xNorm(xQ).split(/\s+/).filter(Boolean);if(!t.length)return true;var n=xNorm(e.n);return t.every(function(w){return n.indexOf(w)>-1})}
function xList(){var Q=!!xNorm(xQ),X=xSorted().filter(function(e){return Q?xFind(e):xMatch(e,xF)}),sh=X.slice(0,xShown);var cw=$("#xcw");if(cw)cw.classList.toggle("dim",Q);
 $("#xl").innerHTML=sh.length?sh.map(function(e,i){var bs=(e.newRec?'<span class="bd up">Новый рекорд</span>':e.st==="up"?'<span class="bd up">Растёт</span>':e.st==="pl"?'<span class="bd pl">Плато</span>':e.st==="dn"?'<span class="bd pl">Снижение</span>':'<span class="bd ne">'+(e.n_<2?"Первая запись":"Стабильно")+'</span>')+(e.pn?'<span class="bd pn">Дискомфорт</span>':''),dl=xDelta(e);
  return '<button class="er" data-k="'+esc(e.key)+'" style="animation-delay:'+Math.min(i,10)*35+'ms"><span class="t"><b>'+esc(e.n)+'</b><span>'+esc(setsLine(e.p[e.p.length-1].x))+(dl?" · "+esc(dl):"")+'</span></span><span class="sp">'+spark(e)+'</span><span class="bs">'+bs+'</span></button>'}).join(""):'<div class="empty2">'+(Q?"Ничего не нашлось по «"+esc(xQ.trim())+"». Попробуйте часть названия.":xF==="all"?"Пока пусто.":xF==="pn"?"Дискомфорта в последних тренировках нет. Это хороший знак.":xF==="pl"?"Плато нет. Это хороший знак.":xF==="dn"?"Снижения результатов нет. Это хороший знак.":"Пока ничего не растёт. Новые рекорды появятся после следующих тренировок.")+'</div>';
 $("#xm").innerHTML=X.length>sh.length?'<button class="cta" id="xmore" style="margin-top:2px;width:100%;height:48px;font-size:15px">Показать ещё '+Math.min(15,X.length-sh.length)+'</button>':"";
 var xm=$("#xmore");if(xm)xm.onclick=function(){xShown+=15;buzz(6);var y=$("#scroll").scrollTop;xList();$("#scroll").scrollTo({top:y,behavior:"instant"})};
 $$(".er",$("#xl")).forEach(function(b){b.onclick=function(){openEx(b.dataset.k,b)}})}
function xChart(e){var P=e.p,W=300,H=124,pl=26,pr=10,pt=12,pb=22,vs=P.map(function(r){return r.v}),mn=Math.min.apply(null,vs),mx=Math.max.apply(null,vs),lo=mn===mx?mn-1:mn-(mx-mn)*.15,hi=mn===mx?mx+1:mx+(mx-mn)*.15,n=P.length;
 var X=function(i){return n===1?W/2:pl+(W-pl-pr)*i/(n-1)},Y=function(v){return pt+(H-pt-pb)*(1-(v-lo)/(hi-lo))},many=n>40;
 var gl="";[mn,mx].forEach(function(v,j){if(j&&mn===mx)return;gl+='<line class="gl" x1="'+pl+'" x2="'+(W-pr)+'" y1="'+Y(v)+'" y2="'+Y(v)+'"/><text x="0" y="'+(Y(v)+3.5)+'">'+f0(v)+'</text>'});if(mn===mx)gl+='<line class="gl" x1="'+pl+'" x2="'+(W-pr)+'" y1="'+Y(mn)+'" y2="'+Y(mn)+'"/>';
 var d="M"+P.map(function(r,i){return X(i).toFixed(1)+" "+Y(r.v).toFixed(1)}).join("L"),dots=P.map(function(r,i){var rc=e.rec.indexOf(i)>-1;if(many&&!rc&&i!==n-1)return "";return '<circle class="dt'+(rc?" r":"")+'" cx="'+X(i).toFixed(1)+'" cy="'+Y(r.v).toFixed(1)+'" r="4"/>'}).join(""),yr=P[0].d.slice(0,4)!==P[n-1].d.slice(0,4);
 return '<div class="xch '+e.st+'" data-n="'+n+'"><svg viewBox="0 0 '+W+' '+H+'">'+gl+'<path class="ln" d="'+d+'" pathLength="1" style="'+(e.st==="pl"||e.st==="dn"?"stroke:var(--pink)":"")+'"/>'+dots+'<circle class="dsel" r="6.5" cx="-20" cy="-20"/><text x="'+pl+'" y="'+(H-5)+'">'+sd(P[0].d,yr)+'</text><text x="'+(W-pr)+'" y="'+(H-5)+'" text-anchor="end">'+sd(P[n-1].d,yr)+'</text></svg><div class="xtip" hidden></div></div>'}
function epl(q){return q.w>0&&q.v>=1&&q.v<=12?q.w*(1+q.v/30):0}
function rmOf(r){return Math.max.apply(null,[0].concat(r.x.sets.map(epl)))}
function rmBest(e){if(e.u!=="кг")return 0;return Math.max.apply(null,[0].concat(e.p.map(rmOf)))}
function xTipHtml(r,u){var p=r.d.split("-"),st=r.x.sets,h='<b>'+(+p[2])+' '+MS[+p[1]-1]+' '+p[0]+'</b><div class="xcols">';
 if(r.x.mode==="time"){st.forEach(function(q){h+='<i><em>'+q.t+' с</em></i>'})}
 else{var hw=st.some(function(q){return +q.w>0});st.forEach(function(q){h+='<i><em>'+q.v+'</em>'+(hw?'<span>'+(+q.w>0?String(q.w).replace(".",","):"—")+'</span>':'')+'</i>'})}
 return h+'</div>'}
function xChBind(w,e){var c=w.querySelector(".xch");if(!c)return;var sv=c.querySelector("svg"),tp=c.querySelector(".xtip"),ds=c.querySelector(".dsel"),P=e.p,n=P.length,W=300,pl=26,pr=10;
 function pick(ev){var b=sv.getBoundingClientRect(),x=(ev.clientX-b.left)/b.width*W,i=n===1?0:Math.round((x-pl)/(W-pl-pr)*(n-1));i=Math.max(0,Math.min(n-1,i));
  var cx=n===1?W/2:pl+(W-pl-pr)*i/(n-1),vs=P.map(function(r){return r.v}),mn=Math.min.apply(null,vs),mx=Math.max.apply(null,vs),lo=mn===mx?mn-1:mn-(mx-mn)*.15,hi=mn===mx?mx+1:mx+(mx-mn)*.15,cy=12+(124-12-22)*(1-(P[i].v-lo)/(hi-lo));
  ds.setAttribute("cx",cx.toFixed(1));ds.setAttribute("cy",cy.toFixed(1));tp.innerHTML=xTipHtml(P[i],e.u);tp.hidden=false;
  var cw=c.clientWidth,tw=tp.offsetWidth,lx=cx/W*cw-tw/2;lx=Math.max(0,Math.min(cw-tw,lx));tp.style.left=lx+"px";tp.style.transform="none";buzz(4)}
 sv.style.cursor="pointer";sv.addEventListener("click",function(ev){ev.stopPropagation();pick(ev)});
 w.addEventListener("click",function(ev){if(!ev.target.closest(".xch")){tp.hidden=true;ds.setAttribute("cx",-20)}})}
var XMN=["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
function xNotes(r){var o=[];if(r.x.my)o.push(["Ваша заметка",r.x.my]);if(r.x.tn)o.push(["Заметка тренера",r.x.tn]);var e=r.e||{};if(e.note)o.push(["К тренировке",e.note]);if(e.tn&&e.tn!==r.x.tn)o.push(["Тренер · к тренировке",e.tn]);return o}
function xHist(e){var P=e.p.slice().reverse(),n=P.length,h="",mk="",u=e.u;
 P.forEach(function(r,i){var ym=r.d.slice(0,7),prev=P[i+1],dl="";
  if(ym!==mk){mk=ym;h+='<h6 class="xmh">'+XMN[+ym.slice(5)-1]+' '+ym.slice(0,4)+'</h6>'}
  if(prev){var d=r.v-prev.v;if(Math.abs(d)>1e-9)dl='<i class="xd '+(d>0?"up":"dn")+'">'+(d>0?"+":"−")+f0(Math.abs(d))+'</i>'}
  var p=r.d.split("-"),nt=xNotes(r),wn=r.e&&r.e.wn?r.e.wn:"",gone=r.e&&r.e.gone;
  h+='<div class="xr" data-i="'+(n-1-i)+'"><span class="dd"><b>'+(+p[2])+'</b><small>'+MS[+p[1]-1]+'</small></span><span class="t"><b>'+esc(setsLine(r.x))+'</b><span>'+esc((r.x.eff?"усилие "+r.x.eff+" · ":"")+(wn?wn:""))+(gone?' <em class="gn">тренировка удалена</em>':'')+(r.x.pain?' <em class="pk">дискомфорт</em>':'')+'</span></span>'+dl+(nt.length?'<button class="xi" type="button" aria-label="Заметки">'+ic("info")+'</button>':'')+'</div>'});
 return '<div class="xhh"><b>История</b><span>'+plural(n,["запись","записи","записей"])+' · сначала новые</span></div><div class="xhs" data-noswipe>'+h+'</div>'}
function xBind(w,e){var P=e.p;
 function close(){var o=w.querySelector(".xpop");if(o)o.remove();w.querySelectorAll(".xi.on").forEach(function(b){b.classList.remove("on")})}
 w.querySelectorAll(".xi").forEach(function(b){b.onclick=function(ev){ev.stopPropagation();var row=b.closest(".xr"),was=b.classList.contains("on");close();if(was)return;
  var r=P[+row.dataset.i],nt=xNotes(r);b.classList.add("on");buzz(5);
  var o=document.createElement("div");o.className="xpop";o.innerHTML=nt.map(function(a){return '<small>'+esc(a[0])+'</small><p>'+esc(a[1])+'</p>'}).join("");row.appendChild(o)}});
 w.addEventListener("click",function(ev){if(!ev.target.closest(".xpop,.xi"))close()});
 var s=w.querySelector(".xhs");if(s)s.scrollTop=0}
function openEx(key,btn){var e=D.EX.filter(function(q){return q.key===key})[0];if(!e)return;var n=e.n_,dl=e.last-e.first,u=e.u,lx=e.p[n-1].x,c=catOf({id:e.id,n:e.n}),dist=pairs(lx.g)||catDist({id:e.id,n:e.n}),grp=dist?GS[dist.slice().sort(function(a,b){return b[1]-a[1]})[0][0]]:(c&&canonG(c.m)?GS[canonG(c.m)]:"Упражнение"),
 lastPain=e.p.slice().reverse().filter(function(r){return r.x.pain})[0],tip="";
 var up=c&&c.up?S(c.up,160):"",dnv=c&&c.dn?S(c.dn,160):"";
 if(e.pn)tip='<div class="tip pn"><b>Был дискомфорт</b><p class="voice">Пока не наращивайте нагрузку. '+(lastPain&&lastPain.x.my?"Вы писали: «"+esc(lastPain.x.my)+"». ":"")+'Проверьте технику и при необходимости покажите её тренеру.</p><button class="cta rg2" id="wt" style="height:46px;font-size:14px;margin-top:6px">Посмотреть технику</button></div>';
 else if(e.st==="dn")tip='<div class="tip dn"><b>Результат снизился</b><p class="voice">Последний результат ('+fu(e.last,u)+') ниже лучшего ('+fu(e.best,u)+') на '+Math.round((e.best-e.last)/e.best*100)+'%. Чаще всего это усталость, недосып или перерыв. Вернитесь к рабочему значению, с которым было уверенно, и растите от него.'+(dnv?" Вариант облегчения: "+esc(lowerFirst(dnv))+".":"")+'</p>'+(c&&c.id?'<button class="cta rg2" id="wt" style="height:46px;font-size:14px;margin-top:6px">Варианты облегчения</button>':'')+'</div>';
 else if(e.st==="pl")tip='<div class="tip pl"><b>Плато</b><p class="voice">Уже '+plural(e.since,["тренировку","тренировки","тренировок"])+' без нового результата. Это нормально. '+(u==="с"?"Можно добавить 5–10 секунд, сделать движение медленнее или взять более сложный вариант.":"Можно добавить повтор, замедлить темп до 3-1-1 или усложнить упражнение.")+(up?" Из каталога: "+esc(lowerFirst(up))+".":"")+'</p><button class="cta rg2" id="wt" style="height:46px;font-size:14px;margin-top:6px">'+(c&&c.id?"Варианты усложнения":"Найти похожие")+'</button></div>';
 else if(e.st==="up"){var le=lx.eff;tip='<div class="tip up"><b>'+(e.newRec?"Новый рекорд":"Идёте вверх")+'</b><p class="voice">'+(le&&le<=7?"Усилие "+le+" из 10, запас есть: в следующий раз можно чуть прибавить.":"Усилие "+(le?le+" из 10":"не отмечено")+". Закрепите этот результат, а потом прибавляйте.")+'</p></div>'}
 else tip='<div class="tip"><b>Пока мало данных</b><p class="voice">'+(n<2?"Это точка отсчёта. После следующей тренировки покажем динамику.":"Нужно ещё несколько тренировок, чтобы увидеть тенденцию.")+'</p></div>';
 var ss=xHist(e);
 var st3=u==="кг"?'<div><span>Лучший вес</span><b>'+fu(e.best,u)+'</b></div><div><span>Лучший объём</span><b>'+th(e.bestVol)+' кг</b></div><div><span>Рекордов</span><b>'+e.rec.length+'</b></div>':'<div><span>Первый</span><b>'+fu(e.first,u)+'</b></div><div><span>Рекорд</span><b>'+fu(e.best,u)+'</b></div><div><span>Рекордов</span><b>'+e.rec.length+'</b></div>';
 var w=win('<div class="pw-h"><span class="eyebrow">'+esc(grp)+'</span><h3>'+esc(e.n)+'</h3><div class="meta"><span>'+plural(n,["тренировка","тренировки","тренировок"])+'</span><span>рекорд '+fu(e.best,u)+'</span></div></div><div class="pw-l"><div><span class="bign">'+f0(e.last)+'<small>'+u+'</small></span><span class="small" style="margin-left:8px">'+(n<2?"первая запись":(Math.abs(dl)<1e-9?"без изменений с начала":(dl>0?"+":"−")+f0(Math.abs(dl))+" "+u+" с начала"))+'</span></div>'+(n>1&&xDelta(e)?'<span class="small">К прошлому разу: '+esc(xDelta(e).replace(" к прошлому",""))+'</span>':"")+xChart(e)+'<div class="stat3">'+st3+'</div>'+(rmBest(e)?'<div class="xrm"><span>Расчётный 1ПМ <small>(формула Эпли)</small></span><b>≈ '+f0(rmBest(e))+' кг</b></div>':'')+tip+ss+'</div><div class="pw-f"><button class="cta rg" id="wc">Закрыть</button><button class="cta go" id="wo">В тренировки</button></div>',btn);
 anim(w);xBind(w,e);xChBind(w,e);
 $("#wc").onclick=function(){closeLayers();buzz(6)};
 $("#wo").onclick=function(){closeLayers();buzz(8);setTimeout(function(){send({t:"tab",to:"work"})},250)};
 var wt=$("#wt");if(wt)wt.onclick=function(){closeLayers();buzz(8);var q;
  /* в каталоге есть: открываем карточку именно этого упражнения (там прогрессия/регрессия/техника); нет: поиск по названию */
  if(c&&c.id)q={q:S(c.n,120),id:c.id,sec:e.pn?"tech":(e.st==="dn"?"dn":"up")};
  else{q={q:e.n};if(!e.pn){var w1=String(e.n).split(/[\s,(]+/)[0];if(w1.length>=3)q.q=w1}}
  try{FS.set("libq",q)}catch(_){}setTimeout(function(){send({t:"sub",i:3})},250)}}

/* ---------- По неделям: таблица прогресса ---------- */
var SDW=["вс","пн","вт","ср","чт","пт","сб"],TBCAP=24;
var tbWho="me",tbProg="",tbOpen={},TBR=[];
function sortH(H){H.sort(function(a,b){return a.d<b.d?-1:a.d>b.d?1:(a.t<b.t?-1:a.t>b.t?1:(a.wn<b.wn?-1:a.wn>b.wn?1:0))});return H}
function tbCoach(){var s=FS.get("sync");if(!s||typeof s!=="object"||s.role!=="coach"||!s.clients||typeof s.clients!=="object"||Array.isArray(s.clients))return null;
 var out=[];Object.keys(s.clients).forEach(function(u){var c=s.clients[u];if(!c||typeof c!=="object")return;out.push({id:u,name:S(c.name,24)||"Клиент",upd:nn(c.updated),hist:arr(c.hist)})});
 if(!out.length)return null;out.sort(function(a,b){return a.name<b.name?-1:a.name>b.name?1:0});return out}
function tbNorm(list,T){var map={};arr(list).forEach(function(h){try{var e=normE(h,T);if(e)map[e.d+"|"+(e.k||e.wn)]=e}catch(x){}});return sortH(Object.keys(map).map(function(k){var e=map[k];e.ro=1;return e}))}
function tbGroups(H,progsArr){
 var P=[],byName={},keyProg={};
 function prog(name){var p=byName[name];if(!p){p={name:name,ws:[],wm:{},n:0,last:""};byName[name]=p;P.push(p)}return p}
 function wk(p,key,name,wid){var w=p.wm[key];if(!w){w={key:key,name:name,wid:wid,runs:[]};p.wm[key]=w;p.ws.push(w)}return w}
 progsArr.forEach(function(pr){var p=prog(S(pr.name,80)||"Программа");arr(pr.workouts).forEach(function(w){if(!w||typeof w!=="object")return;var key=S(w.key!=null&&w.key!==""?w.key:w.id,60);if(!key)return;wk(p,key,S(w.name,80)||"Тренировка",w.id);if(!keyProg[key])keyProg[key]=p.name})});
 H.forEach(function(e){var key=e.k||e.wn,pn=(e.pn&&byName[e.pn]?e.pn:(keyProg[key]||e.pn||"Свои тренировки")),p=prog(pn),w=p.wm[key]||wk(p,key,e.wn,null);w.name=e.wn;w.runs.push(e);p.n++;if(e.d>=p.last)p.last=e.d});
 P=P.filter(function(p){return p.n>0});
 P.forEach(function(p){p.ws.forEach(function(w){w.last=w.runs.length?w.runs[w.runs.length-1].d:""});var a=p.ws.filter(function(w){return w.runs.length}),b=p.ws.filter(function(w){return !w.runs.length});p.ws=a.concat(b)});
 P.sort(function(a,b){return a.last<b.last?1:a.last>b.last?-1:0});return P}
/* лучший подход ячейки: для веса — расчётный максимум (формула Эпли: вес × (1 + повторы/30), повторы свыше 12 не учитываются: оценка там ненадёжна), для своего тела — повторы, для времени — секунды */
function tbTop(c){if(!c||!c.sets)return null;var ds=c.sets.filter(function(q){return q.done});if(!ds.length)return null;
 if(c.mode==="time")return {u:"t",v:Math.max.apply(null,ds.map(function(q){return q.t}))};
 var wd=ds.filter(function(q){return q.w>0});
 if(wd.length){var mw=Math.max.apply(null,wd.map(function(q){return q.w})),best=0,rm=0;wd.forEach(function(q){var e=q.w*(1+Math.min(q.v,12)/30);if(e>best)best=e;if(q.w===mw&&q.v>rm)rm=q.v});return {u:"w",v:best,w:mw,r:rm}}
 return {u:"r",v:Math.max.apply(null,ds.map(function(q){return q.v}))}}
function tbStr(c,q){if(!q.done)return "—";if(c.mode==="time")return q.t+" с";return (q.w>0?fi(q.w):"")+"×"+q.v}
function tbNum(v){return v>0?fi(v):"–"}
function tbCell(c,top,mark,two,r2){if(!c)return '<td class="na" rowspan="'+(r2?2:1)+'">·</td>';var n=c.sets.length;if(!n)return '<td class="na" rowspan="'+(r2?2:1)+'">—</td>';
 var tm=c.mode==="time";
 function line(f){return '<div class="s">'+c.sets.map(function(q){return '<i'+(q.done?'':' class="x"')+'>'+(q.done?f(q):"–")+'</i>'}).join("")+'</div>'}
 var k=line(function(q){return tm?String(q.t):tbNum(q.w)}),r=tm?"":line(function(q){return String(q.v)});
 var cls=(mark?mark+" ":"");
 return '<td class="'+cls+'k">'+k+'</td>'+(tm?"":'<td class="r">'+r+'</td>')}
function tbMark(a,b){if(!a||!b||a.u!==b.u)return "";if(b.v>a.v+1e-9)return "up";if(b.v<a.v*0.9-1e-9)return "dn";return ""}
function tbPct(e){if(e.pct>0)return e.pct;var t=0,d=0;e.ex.forEach(function(x){t+=x.sets.length;d+=doneOf(x).length});return t?Math.round(d/t*100):0}
function tbVoice(runs,rows){var n=runs.length;if(n<2)return "";var L=runs[n-1],ref=0,i;
 for(i=n-2;i>=0;i--){if(daysBetween(runs[i].d,L.d)>=14){ref=i;break}}
 var days=daysBetween(runs[ref].d,L.d),span=days>=10?"За "+plural(Math.max(1,Math.round(days/7)),["неделю","недели","недель"]):"За "+plural(Math.max(1,days),["день","дня","дней"]);
 var g=[],m=0;
 rows.forEach(function(r){var a=tbTop(r.c[ref]),b=tbTop(r.c[n-1]);if(!a||!b||a.u!==b.u)return;m++;var t=null,rel=0;
  if(b.u==="w"){if(b.w>a.w+1e-9){t="+"+fi(b.w-a.w)+" кг";rel=(b.w-a.w)/a.w}else if(Math.abs(b.w-a.w)<1e-9&&b.r>a.r){t="+"+(b.r-a.r)+" повт.";rel=(b.r-a.r)/Math.max(1,a.r)*.5}}
  else if(b.u==="r"){if(b.v>a.v){t="+"+(b.v-a.v)+" повт.";rel=(b.v-a.v)/a.v}}
  else if(b.v>a.v){t="+"+(b.v-a.v)+" с";rel=(b.v-a.v)/a.v}
  if(t)g.push({n:r.n.length>28?r.n.slice(0,27)+"…":r.n,t:t,rel:rel})});
 if(!m)return "";
 g.sort(function(a,b){return b.rel-a.rel});
 var txt=g.length?span+": "+g.slice(0,2).map(function(x){return "«"+x.n+"» "+x.t}).join(", ")+"."+(g.length>2?" Выросло "+g.length+" из "+m+" упражнений.":""):span+" нагрузка держится на том же уровне.";
 var vr=runs[ref].vol,vl=L.vol;if(vr>0&&vl>0){var pc=Math.round((vl/vr-1)*100);if(Math.abs(pc)>=3)txt+=" Объём тренировки "+(pc>0?"+":"−")+Math.abs(pc)+"%."}
 return txt}
function tbTable(w){
 var all=w.runs,runs=all.slice(-TBCAP),n=runs.length,rows=[],idx={};
 runs.forEach(function(e,ci){e.ex.forEach(function(x){var r=idx[x.key];if(r==null){r=idx[x.key]=rows.length;rows.push({key:x.key,n:x.n,c:[]})}rows[r].n=x.n;var c=rows[r].c[ci];if(c)c.sets=c.sets.concat(x.sets);else rows[r].c[ci]={mode:x.mode,sets:x.sets.slice()}})});
 var yT=D.T.slice(0,4),th_="",ML=3,NS=3;
 rows.forEach(function(r){r.c.forEach(function(c){if(!c)return;if(c.sets.length>NS)NS=c.sets.length;c.sets.forEach(function(q){var l=String(c.mode==="time"?q.t:tbNum(q.w)).length,l2=String(q.v).length;ML=Math.max(ML,l,l2)})})});
 var W0=Math.floor($("#p3").clientWidth||354)-2,FW=Math.floor(W0*.25),NW=FW,UW=0,
  CW=Math.max(64,Math.min(150,Math.round(NS*(ML*6.6+7)+14)));
 runs.forEach(function(e){var p=e.d.split("-"),ri=TBR.length;TBR.push(e);
  var note=e.tn||e.note||e.ex.some(function(x){return x.my||x.tn}),mk=e.pain?'<s class="p"></s>':(note||e.eff>=8?'<s></s>':"");
  th_+='<th scope="col" class="dc"><button class="dh" data-r="'+ri+'" aria-label="Тренировка '+esc(dmyy(e.d,D.T))+(e.pain?", был дискомфорт":"")+'">'+(+p[2])+" "+MS[+p[1]-1]+'<small>'+SDW[wdOf(e.d)]+(p[0]!==yT?" · "+p[0].slice(2):"")+'</small>'+mk+'</button></th>'});
 var vols='<tr class="sum l1"><th class="fc fa" scope="row">Объём, кг</th>'+runs.map(function(e){return '<td>'+(e.vol>0?th(e.vol):"–")+'</td>'}).join("")+'</tr>',
  pcs='<tr class="sum l2"><th class="fc fa" scope="row">Выполнено</th>'+runs.map(function(e){var p=tbPct(e);return '<td>'+(p?p+"%":"–")+'</td>'}).join("")+'</tr>';
 var body="";
 rows.forEach(function(r){var tmo=r.c.some(function(c){return c&&c.mode==="time"})&&!r.c.some(function(c){return c&&c.mode!=="time"}),prev=null,tk='',tr2='';
  for(var ci=0;ci<n;ci++){var c=r.c[ci],t=tbTop(c),mk="";if(t){if(prev)mk=tbMark(prev,t);prev=t}
   if(!c||!c.sets.length){tk+='<td class="na k">'+(c?"—":"·")+'</td>';if(!tmo)tr2+='<td class="na r"></td>'}
   else{var cc=tbCell(c,t,mk,false,!tmo),kk=cc.split('</td>');tk+=kk[0]+'</td>';if(!tmo)tr2+=kk[1]+'</td>'}}
  body+='<tr class="exh"><th class="fc fn" scope="row">'+esc(r.n)+'</th><td class="exb" colspan="'+n+'"></td></tr>'+
   '<tr class="ex1"><th class="fc fu" scope="row">'+(tmo?"сек":"кг")+'</th>'+tk+'</tr>'+(tmo?'':'<tr class="ex2"><th class="fc fu" scope="row">повт.</th>'+tr2+'</tr>')});
 var cols='<colgroup><col style="width:'+FW+'px">'+runs.map(function(){return '<col style="width:'+CW+'px">'}).join("")+'</colgroup>',W=FW+CW*n;
 var tbl='<div class="tbw" data-n="'+n+'" style="--fw:'+FW+'px"><table class="tb" lang="ru" style="width:'+W+'px">'+cols+'<thead><tr><th class="fc fa" scope="col">Упражнение</th>'+th_+'</tr></thead><tbody>'+vols+pcs+body+'</tbody></table></div>';
 var vc=tbVoice(runs,rows),ft;
 if(n<2)ft='<p class="voice">Ещё одна тренировка — и появится динамика.</p>';
 else ft=(vc?'<p class="voice">'+esc(vc)+'</p>':'')+'<span class="small lg"><i style="background:var(--green)"></i>выше прошлой даты  <i style="background:var(--pink)"></i>ниже больше чем на 10% · сравнение по расчётному максимуму (формула Эпли)'+(all.length>n?' · показаны последние '+n+' из '+all.length:'')+'</span>';
 return '<div class="ab">'+tbl+'<div class="ft">'+ft+'</div></div>'}
function dsh(iso){var p=iso.split("-");return (+p[2])+" "+MS[+p[1]-1]+(p[0]!==D.T.slice(0,4)?" "+p[0].slice(2):"")}
function tbKey(p,w){return p.name+"\u0001"+w.key}
function tbSet(el){var w=el.querySelector(".tbw");if(!w)return;var f=function(){w.classList.toggle("sc",w.scrollLeft>2)};w.onscroll=f;f()}
function tbEnd(el){var w=el.querySelector(".tbw");if(!w)return;w.scrollLeft=w.scrollWidth;tbSet(el)}
function tbCard(p,w,i,L){var n=w.runs.length,key=tbKey(p,w),open=!!tbOpen[key]&&n>0;L.push({p:p,w:w});
 var u={},nx=0;w.runs.forEach(function(e){e.ex.forEach(function(x){if(!u[x.key]){u[x.key]=1;nx++}})});
 var sub=n?plural(n,["раз","раза","раз"])+" · последняя "+dsh(w.last)+(nx?" · "+nx+" упр.":""):"Ещё не выполнялась";
 return '<div class="wkc'+(n?"":" z")+(open?" open":"")+'" data-i="'+(L.length-1)+'" style="animation-delay:'+Math.min(i,8)*40+'ms"><button class="wh" aria-expanded="'+open+'"><span class="cn"><b>'+n+'</b><small>раз</small></span><span class="t"><b>'+esc(w.name)+'</b><span>'+esc(sub)+'</span></span>'+ic("chev")+'</button>'+(n?'<div class="acc"><div class="ai">'+(open?tbTable(w):"")+'</div></div>':"")+'</div>'}
function tbChips(list,cur,id){return '<div class="chips sc" id="'+id+'">'+list.map(function(m){return '<button class="chp sm'+(m[0]===cur?" on":"")+'" data-k="'+esc(m[0])+'">'+esc(m[1])+(m[2]!=null?'<em>'+m[2]+'</em>':"")+'</button>'}).join("")+'</div>'}
function p3(){
 var host=$("#p3"),sl={};$$(".wkc",host).forEach(function(c){var t=c.querySelector(".tbw");if(t)sl[c.dataset.i+"|"+c.querySelector(".t b").textContent]=t.scrollLeft});
 var coach=tbCoach(),cl=null;
 if(tbWho!=="me"){cl=coach?coach.filter(function(c){return c.id===tbWho})[0]||null:null;if(!cl)tbWho="me"}
 var T=D.T,H,pa=[];
 if(cl)H=tbNorm(cl.hist,T);else{H=D.H;var PG=FS.get("progs");pa=PG&&typeof PG==="object"?arr(PG.programs).filter(function(q){return q&&typeof q==="object"}):[]}
 var h='<div class="rise"><div class="ch2" style="margin-bottom:6px"><h4>По неделям</h4><span>вес × повторы, как записано</span></div>';
 if(coach)h+='<div class="tbn"><span class="lab">Чьи тренировки</span>'+tbChips([["me","Мои"]].concat(coach.map(function(c){return [c.id,c.name]})),tbWho,"tbwho")+'</div>';
 h+='</div>';
 if(cl&&cl.upd>1e12)h+='<p class="tbi rise">Данные клиента обновлены '+esc(dsh(isoOf(new Date(cl.upd))))+' · только просмотр</p>';
 var P=tbGroups(H,pa),L=[];
 if(!P.length){
  if(cl)h+='<div class="card hero0 rise"><span class="eyebrow">'+esc(cl.name)+'</span><h3>Пока нет выполненных тренировок</h3><p class="voice">Таблица появится, когда клиент завершит первую тренировку и данные синхронизируются.</p><button class="cta go blk" id="tbme">Мои тренировки</button></div>';
  else h+='<div class="card hero0 rise"><span class="eyebrow">Таблица прогресса</span><h3>Пока нет данных</h3><p class="voice">Пока нет данных — завершите первую тренировку, и здесь появится таблица: упражнения строками, даты столбцами, кг и повторы как записаны.</p><button class="cta go blk" id="tbgo">К тренировкам</button></div>';
  host.innerHTML=h;var m1=$("#tbme");if(m1)m1.onclick=function(){buzz(8);tbWho="me";tbProg="";soft(3)};var g1=$("#tbgo");if(g1)g1.onclick=function(){go("work")};
  if($("#tbwho"))bindChips("tbwho",function(k){tbWho=k;tbProg="";soft(3)});return}
 var cur=P.filter(function(p){return p.name===tbProg})[0];if(!cur){cur=P[0];tbProg=cur.name}
 if(P.length>1)h+='<div class="rise">'+tbChips(P.map(function(p){return [p.name,p.name.length>24?p.name.slice(0,23)+"…":p.name,p.n]}),tbProg,"tbprog")+'</div>';
 TBR=[];
 var cards=cur.ws.map(function(w,i){try{return tbCard(cur,w,i,L)}catch(err){L.push({p:cur,w:w});return '<div class="wkc z" data-i="'+(L.length-1)+'"><div class="wh"><span class="t"><b>'+esc(w.name)+'</b><span>Не удалось построить таблицу</span></span></div></div>'}}).join("");
 h+='<div class="tbl rise" id="tbl">'+cards+'</div>';
 host.innerHTML=h;
 $$(".wkc",host).forEach(function(c){var it=L[+c.dataset.i],w=it.w,hd=c.querySelector(".wh"),ai=c.querySelector(".ai");
  if(c.classList.contains("open")){var k=c.dataset.i+"|"+w.name,t=c.querySelector(".tbw");if(t){requestAnimationFrame(function(){if(sl[k]!=null)t.scrollLeft=sl[k];else t.scrollLeft=t.scrollWidth;tbSet(c)})}}
  else if(c.querySelector(".tbw"))tbSet(c);
  tbBind(c);
  if(!hd||hd.tagName!=="BUTTON")return;
  hd.onclick=function(){
   if(!w.runs.length){buzz(6);if(w.wid!=null&&!cl)send({t:"open",wid:w.wid});else send({t:"tab",to:"work"});return}
   var key=tbKey(it.p,w),open=!c.classList.contains("open");buzz(5);pulseAt(hd,"",0);
   if(open&&!ai.firstChild){ai.innerHTML=tbTable(w);tbBind(c)}
   tbOpen[key]=open;c.classList.toggle("open",open);hd.setAttribute("aria-expanded",open);
   if(open){var go_=function(){tbEnd(c)};setTimeout(go_,30);setTimeout(go_,560)}}});
 if($("#tbwho"))bindChips("tbwho",function(k){tbWho=k;tbProg="";soft(3)});
 if($("#tbprog"))bindChips("tbprog",function(k){tbProg=k;soft(3)});
 anim(host)}
function tbBind(c){$$(".dh",c).forEach(function(b){b.onclick=function(){var e=TBR[+b.dataset.r];if(e){buzz(5);openSession(e,b)}}})}

/* ---------- панели и навигация ---------- */
var R=[p0,p1,p2,p3];
function fail(i,err){try{console.error("prog pane "+i+": "+(err&&err.message||err))}catch(e){}
 var p=$("#p"+i);if(p)p.innerHTML='<div class="card hero0"><span class="eyebrow">Прогресс</span><h3>Не удалось показать данные</h3><p class="voice">Ваши записи целы. Обновите экран: мы пересчитаем всё заново.</p><button class="cta go blk" id="rtry">Обновить</button></div>';
 var b=$("#rtry");if(b)b.onclick=function(){buzz(6);renderPane(pane,true)}}
function renderPane(i,soft){var ok=true;try{D=compute()}catch(err){ok=false;D=D||null;fail(i,err)}
 if(ok){try{R[i]()}catch(err){fail(i,err)}}
 var p=$("#p"+i);
 if(soft){p.classList.remove("swap","in");void p.offsetWidth;p.classList.add("swap")}
 else{p.classList.remove("in","swap");void p.offsetWidth;p.classList.add("in")}
 head()}
function head(){var t=new Date(),wd=WDN[t.getDay()];$("#pdate").textContent=wd.charAt(0).toUpperCase()+wd.slice(1)+", "+t.getDate()+" "+MR[t.getMonth()]}
function refresh(soft){renderPane(pane,soft!==false)}
var plTab=null;
var PSUBD=["Ваш путь целиком: общие результаты и основные показатели","Каждая проведённая тренировка: дата, длительность и как она прошла","Динамика и прогресс каждого упражнения","Здесь удобно следить за прогрессом по неделям и месяцам"];
function descSet(el,t){if(!el||el.textContent===t)return;el.style.opacity="0";setTimeout(function(){el.textContent=t;el.style.opacity="1"},160)}
(function(){var el=$("#ptab"),bs=$$("button",el),ind=$(".ind",el);var cur=-1;function pl(anim){var b=$$("button.on",el)[0];if(!b||!b.offsetWidth)return;var i=bs.indexOf(b),l=b.offsetLeft,r=el.clientWidth-(b.offsetLeft+b.offsetWidth);ind.style.width="auto";ind.style.transform="none";if(!anim||cur<0){ind.style.transition="none";ind.style.left=l+"px";ind.style.right=r+"px";void ind.offsetWidth;cur=i;return}var fw=i>cur;ind.style.transition="left "+(fw?".6s":".34s")+" var(--glassease),right "+(fw?".34s":".6s")+" var(--glassease)";ind.style.left=l+"px";ind.style.right=r+"px";cur=i}
 function showPane(i){$$(".pane").forEach(function(p,j){if(j!==i)p.classList.remove("on","out","in","swap")});var p=$("#p"+i);p.classList.remove("out");p.classList.add("on")}
 bs.forEach(function(b,i){b.onclick=function(){if(i===pane)return;var prev=pane,tok=++swTok;bs.forEach(function(x){x.classList.remove("on");x.setAttribute("aria-selected","false")});b.classList.add("on");b.setAttribute("aria-selected","true");pl(true);buzz(6);pulseAt(b,"var(--coral)",0);pane=i;descSet($("#pSub"),PSUBD[i]);
  var op=$("#p"+prev);op.classList.remove("in","swap");op.classList.add("out");
  setTimeout(function(){if(tok!==swTok)return;showPane(i);$("#scroll").scrollTo({top:0,behavior:"instant"});renderPane(i)},110)}});
 setTimeout(pl,80);if(document.fonts)document.fonts.ready.then(pl);addEventListener("resize",pl);plTab=pl})();
$("#fab").onclick=function(){buzz(8);send({t:"open",nw:1})};
var tabsPlace=initTabs("prog");
$("#scrim").onclick=closeLayers;
var tmr=null;
FS.on(function(k){if(["hist","wt","profile","plan","progs","set","sync"].indexOf(k)<0)return;clearTimeout(tmr);tmr=setTimeout(function(){reloadHist();refresh(true);checkMedals()},80)});
addEventListener("message",function(e){var m=e.data;if(!m||m.f!=="forma"||m.from==="prog")return;
 if(m.t==="show"){shown=true;closeLayers();tabsPlace&&tabsPlace();plTab&&plTab();$("#scroll").scrollTo({top:0,behavior:"instant"});refresh(true);setTimeout(checkMedals,500)}});
addEventListener("pointerdown",function(){if(!shown){shown=true;checkMedals()}},{passive:true});
addEventListener("keydown",function(e){if(e.key==="Escape")closeLayers()});
send({t:"hello"});
renderPane(0);
setTimeout(checkMedals,900);
})();



(function(){
 if(window.__swInit)return;window.__swInit=1;
/* жест вверх/вниз с нижнего меню прокручивает страницу (раньше зона меню была «мёртвой» для скролла) */
 (function(){var d=document,sc=null,y0=0,x0=0,ly=0,lt=0,v=0,mode=0,raf=0;
  function scroller(){var e=d.elementFromPoint(innerWidth/2,innerHeight*.35);while(e&&e!==d.documentElement){var c=getComputedStyle(e);if((c.overflowY==='auto'||c.overflowY==='scroll')&&e.scrollHeight>e.clientHeight+2)return e;e=e.parentElement}return null}
  function dockT(t){return t&&t.closest&&t.closest('.dock')}
  d.addEventListener('touchstart',function(e){cancelAnimationFrame(raf);mode=0;if(!dockT(e.target))return;var t=e.touches[0];sc=scroller();y0=ly=t.clientY;x0=t.clientX;lt=e.timeStamp;v=0;mode=sc?1:0},{passive:true});
  d.addEventListener('touchmove',function(e){if(mode===0||!sc)return;var t=e.touches[0];
   if(mode===1){if(Math.abs(t.clientY-y0)<8&&Math.abs(t.clientX-x0)<8)return;if(Math.abs(t.clientY-y0)>=Math.abs(t.clientX-x0)){mode=2;sc.style.scrollBehavior='auto'}else{mode=0;return}}
   var dy=ly-t.clientY,dt=Math.max(1,e.timeStamp-lt);sc.scrollTop+=dy;v=dy/dt*.7+v*.3;ly=t.clientY;lt=e.timeStamp},{passive:true});
  function end(){if(mode!==2||!sc){mode=0;return}var el=sc,vv=v*16;mode=0;
   (function step(){if(Math.abs(vv)<.4){el.style.scrollBehavior='';return}el.scrollTop+=vv;vv*=.95;raf=requestAnimationFrame(step)})()}
  d.addEventListener('touchend',end,{passive:true});d.addEventListener('touchcancel',function(){mode=0},{passive:true});
 })();

 var d=document,sx=0,sy=0,st=0,tg=null,on=false;
 function layers(){return d.querySelector('.sheet.on,.win.on,.cam.on,#cal.on')}
 function rootState(){var a=d.getElementById('app');var m=a&&a.dataset?a.dataset.mode:'';return !layers()&&(!m||m==='list')}
 function hscroll(t){while(t&&t!==d.body&&t.nodeType===1){var c=getComputedStyle(t);if((c.overflowX==='auto'||c.overflowX==='scroll')&&t.scrollWidth>t.clientWidth+4)return true;t=t.parentNode}return false}
 function blocked(t){while(t&&t!==d.body&&t.nodeType===1){if(t.matches&&t.matches('input,textarea,select,[contenteditable="true"],.seg,.chips,.slist,.wkscroll,.offers,.chart,[data-noswipe]'))return true;t=t.parentNode}return hscroll(tg)}
 function subInfo(t){var seg=d.querySelector('#sgSub')||d.querySelector('#sgTab');if(!seg)return null;var host=d.querySelector('#panes')||d.querySelector('#sList');if(!host||!t||!host.contains(t))return null;
  var bs=[].slice.call(seg.querySelectorAll('button')).filter(function(b){return b.getClientRects().length});var i=-1;bs.forEach(function(b,k){if(b.classList.contains('on'))i=k});return i<0?null:{bs:bs,i:i}}
 function zi(e){var z=parseInt(getComputedStyle(e).zIndex,10);return isFinite(z)?z:0}
 function closeTop(){var L=[].slice.call(d.querySelectorAll('.sheet.on,.win.on,.cam.on,#cal.on'));if(!L.length)return false;
  L.sort(function(a,b){return zi(a)-zi(b)});var top=L[L.length-1],btn=top.querySelector('.xb,#aX,#calX,#camX,#iX,[aria-label="Закрыть"],[aria-label="Закрыть камеру"],.cta.l');
  if(btn){btn.click();return true}var sc=d.querySelector('.scrim.on,#scrim2.on');if(sc){sc.click();return true}return false}
 var sub0=null;
 function begin(x,y,t){on=true;sx=x;sy=y;st=Date.now();tg=t;sub0=subInfo(t)}
 function finish(x,y){if(!on)return;on=false;var dx=x-sx,dy=y-sy;if(Math.abs(dx)<70||Math.abs(dx)<Math.abs(dy)*1.7||Date.now()-st>900)return;var dir=dx<0?1:-1;
  if(dx>0&&sx<=30){if(closeTop())return;var ap=d.getElementById('app'),md=ap&&ap.dataset?ap.dataset.mode:'';
   if(md==='con'){var cb=d.getElementById('cBack');if(cb){cb.click();return}}
   if(md==='live'){var lb=d.getElementById('lBack');if(lb){lb.click();return}}}
  if(!rootState()||blocked(tg))return;
  if(sub0){var tg2=sub0.i+dir;if(tg2>=0&&tg2<sub0.bs.length){sub0.bs[tg2].click();return}}
  try{parent.postMessage({f:'forma',t:'swipe',dir:dir,from:(window.PAGE||'x')},'*')}catch(e){}}
 d.addEventListener('touchstart',function(e){var t=e.touches[0];begin(t.clientX,t.clientY,e.target)},{passive:true});
 d.addEventListener('touchend',function(e){var t=e.changedTouches[0];finish(t.clientX,t.clientY)},{passive:true});
 d.addEventListener('touchcancel',function(){on=false},{passive:true});
 d.addEventListener('pointerdown',function(e){if(e.pointerType==='mouse'&&e.button===0)begin(e.clientX,e.clientY,e.target)},{passive:true});
 d.addEventListener('pointerup',function(e){if(e.pointerType==='mouse')finish(e.clientX,e.clientY)},{passive:true});
 /* плашка нижнего меню перетекает от прежней вкладки к новой, как выбор дня */
 addEventListener('message',function(e){var m=e.data;if(!m||m.f!=='forma'||m.t!=='show'||!(m.from>=0)||!(m.to>=0)||m.from===m.to)return;
  var tb=d.querySelector('.tabbar');if(!tb)return;var ind=tb.querySelector('.ind'),tabs=[].slice.call(tb.querySelectorAll('.tab'));if(!ind||tabs.length<5)return;
  var A=tabs[m.from],B=tabs[m.to],t0=performance.now(),dur=540;function io(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}
  var ac=A.offsetLeft+A.offsetWidth/2,aw=A.offsetWidth;ind.style.transition='none';
  function step(now){var t=Math.min(1,(now-t0)/dur),k=io(t),bc=B.offsetLeft+B.offsetWidth/2,bw=B.offsetWidth,c=ac+(bc-ac)*k,w=(aw+(bw-aw)*k)*(1+.12*Math.sin(Math.PI*t));
   ind.style.transform='translateX('+(c-w/2)+'px)';ind.style.width=w+'px';if(t<1)requestAnimationFrame(step);else{ind.style.transform='translateX('+B.offsetLeft+'px)';ind.style.width=B.offsetWidth+'px'}}
  requestAnimationFrame(step)});
})();

(function(){function tg(h){var c=h.closest("[data-fz]");if(!c)return;var k=c.dataset.fz[0],o=!c.hasAttribute("data-open");if(o){c.setAttribute("data-open","1");OPENF[k]=1}else{c.removeAttribute("data-open");delete OPENF[k]}[].forEach.call(c.querySelectorAll(".fzh,.fzt"),function(x){x.setAttribute("aria-expanded",String(o))});try{buzz(3)}catch(e){}}
document.addEventListener("click",function(e){var h=e.target.closest(".fzh,.fzt");if(h)tg(h)});
document.addEventListener("keydown",function(e){if((e.key==="Enter"||e.key===" ")&&e.target.classList&&(e.target.classList.contains("fzh")||e.target.classList.contains("fzt"))){e.preventDefault();tg(e.target)}})})();

(function(){function fit(){document.querySelectorAll(".dsw").forEach(function(w){if(w._f)return;var n=+w.dataset.cur||0,d=w.children[n];if(!d||!w.clientWidth)return;w._f=1;w.scrollLeft=Math.max(0,d.offsetLeft-w.clientWidth/2+d.offsetWidth/2)})}
new MutationObserver(function(){requestAnimationFrame(fit)}).observe(document.body,{childList:true,subtree:true});addEventListener("load",function(){setTimeout(fit,60)})})();
