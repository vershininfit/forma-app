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


window.PAGE="work";
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
 var drop=seg.id==="sgTab",cur=-1;
 function place(instant){var b=bs[idx];if(!b||!b.offsetWidth)return;
  if(drop){var l=b.offsetLeft,r=seg.clientWidth-(b.offsetLeft+b.offsetWidth);ind.style.width="auto";ind.style.transform="none";
   if(instant||cur<0){ind.style.transition="none";ind.style.left=l+"px";ind.style.right=r+"px";void ind.offsetWidth;cur=idx;return}
   var fwd=idx>cur;ind.style.transition="left "+(fwd?".6s":".34s")+" var(--glassease),right "+(fwd?".34s":".6s")+" var(--glassease)";ind.style.left=l+"px";ind.style.right=r+"px";cur=idx;return}
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

/*FZ_BEGIN*/
/* Нечёткий поиск упражнений: по любой части слова, без учёта окончаний, с синонимами и опечатками */
var FZ=(function(){
 function norm(s){return String(s==null?"":s).toLowerCase().replace(/ё/g,"е").replace(/[^a-zа-я0-9]+/g," ").replace(/\s+/g," ").trim()}
 var END=/(иями|ями|ами|ого|его|ому|ему|ыми|ими|ием|ией|иях|ия|ие|ий|ые|ых|ым|ой|ей|ая|яя|ое|ее|ую|юю|ов|ев|ом|ем|ах|ях|ам|ям|ы|и|а|у|ю|я|е|о|ь|й)$/;
 function stem(w){if(w.length<5)return w;var s=w.replace(END,"");if(s.length>=4&&s!==w&&s.length>=5){var s2=s.replace(END,"");if(s2.length>=4&&w.length>=8)s=s2}return s.length>=3?s:w}
 var SYN=[["присед","присед","скват","squat"],["выпад","lunge"],["жим","press"],["отжим","push","pushup"],["подтяг","pullup","chinup","pull up","chin"],["тяг","row","pull"],["станов","deadlift"],["румын","rdl","romanian"],["мост","bridge","thrust","трасты"],["ягодиц","glute"],["планк","plank"],["скруч","crunch","подъем корпус"],["пресс","abs","core","кора"],["разведен","fly","flye","разводк"],["сгибан","curl","подъем на бицепс"],["разгиб","extension","french","французск"],["мах","swing","раскачив"],["гантел","dumbbell","гантельн"],["штанг","barbell","гриф"],["гир","kettlebell","kb"],["петл","trx","trx","подвесн"],["резин","band","эспандер","лент","miniband"],["тренажер","machine"],["блок","кроссовер","cable","канат"],["наклон","hinge","good morning","доброе утро"],["боков","сторон","латерал","lateral","side","сайд","в сторону"],["вперед","forward","front"],["назад","reverse","обратн","back"],["сумо","sumo","широк"],["болгар","bulgarian","сплит","split"],["одн","single","unilateral","одноног","односторон"],["сид","sit","seated","sitting"],["леж","lying","supine"],["стоя","standing","stand"],["плечи","плеч","shoulder","дельт","delt"],["груд","chest","pec"],["спин","back","lat","широчайш"],["бицепс","biceps","bicep"],["трицепс","triceps","tricep"],["бедр","quad","hamstring","thigh","квадрицепс"],["голен","икр","calf","calves"],["пресс","жив","abdom"],["прыжок","jump","plyo","прыгать"],["бег","run","sprint"],["растяж","stretch","mobility","мобил","гибкост"],["вис","hang"],["ходьб","walk","шаг","step"],["гоблет","goblet"],["кубок","goblet"],["сед","squat"],["подъем","raise","lift"],["ротац","rotation","rotate","поворот"],["пайк","pike"],["ножниц","scissor"],["скалолаз","climber"],["бурпи","burpee"],["ласточк","superman","bird"],["становая","deadlift"]];
 var G={},KEYS=[];SYN.forEach(function(g,i){g.forEach(function(w){var k=norm(w);if(k.length>=3){(G[k]=G[k]||[]).push(i);if(KEYS.indexOf(k)<0)KEYS.push(k)}})});
 function groupsOfWord(w,st,acc){KEYS.forEach(function(k){if(w.indexOf(k)===0||st.indexOf(k)===0)G[k].forEach(function(g){acc[g]=1})})}
 function groupsOfQuery(q,qs){var acc={};KEYS.forEach(function(k){if(q.indexOf(k)===0||qs.indexOf(k)===0||(qs.length>=4&&k.indexOf(qs)===0))G[k].forEach(function(g){acc[g]=1})});return Object.keys(acc)}
 function lev(a,b){var m=a.length,n=b.length;if(!m)return n;if(!n)return m;var p=[],c=[],i,j;for(j=0;j<=n;j++)p[j]=j;for(i=1;i<=m;i++){c[0]=i;for(j=1;j<=n;j++){c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a.charCodeAt(i-1)===b.charCodeAt(j-1)?0:1))}var t=p;p=c;c=t}return p[n]}
 function near(q,w,k){if(w.length<q.length-1)return false;for(var L=q.length-1;L<=q.length+1;L++){if(L<3||L>w.length)continue;for(var s=0;s+L<=w.length;s++){if(lev(q,w.substr(s,L))<=k)return true}}return false}
 var STOP={"при":1,"в":1,"на":1,"с":1,"со":1,"и":1,"для":1,"у":1,"от":1,"по":1,"из":1,"к":1,"за":1};
 function words(s){return norm(s).split(" ").filter(Boolean)}
 function qwords(s){return words(s).filter(function(w){return !STOP[w]&&(w.length>2||/\d/.test(w))})}
 function build(items,fields){return items.map(function(it){var main=[],oth=[];fields.forEach(function(f){var v=typeof f.get==="function"?f.get(it):it[f.k];if(!v)return;words(Array.isArray(v)?v.join(" "):v).forEach(function(w){(f.main?main:oth).push(w)})});
  var gs={};main.concat(oth).forEach(function(w){groupsOfWord(w,stem(w),gs)});
  return {it:it,main:main.map(function(w){return [w,stem(w)]}),oth:oth.map(function(w){return [w,stem(w)]}),gs:gs}})}
 function exact(q,qs,qg,ix){var best=0,i,w,sw;
  function chk(list,wt){for(i=0;i<list.length;i++){w=list[i][0];sw=list[i][1];var s=0;
    if(w.indexOf(q)===0||sw.indexOf(qs)===0)s=4;else if(w.indexOf(q)>-1||sw.indexOf(qs)>-1)s=3;else if(qs.length>=4&&sw.length>=4&&qs.indexOf(sw)>-1)s=2.6;
    if(s&&s*wt>best)best=s*wt}}
  chk(ix.main,2);chk(ix.oth,1);if(best)return best;
  for(i=0;i<qg.length;i++)if(ix.gs[qg[i]])return 2.2;return 0}
 function fuzzy(qs,q,ix){var k=qs.length>=7?2:1,i;for(i=0;i<ix.main.length;i++)if(near(qs,ix.main[i][1],k)||near(q,ix.main[i][0],k))return 2.4;for(i=0;i<ix.oth.length;i++)if(near(qs,ix.oth[i][1],k))return 1;return 0}
 function search(index,query,limit){var toks=qwords(query);if(!toks.length)return index.map(function(x){return x.it});
  var n=index.length,tot=new Array(n),alive=new Array(n),i,t;for(i=0;i<n;i++){tot[i]=0;alive[i]=true}
  for(t=0;t<toks.length;t++){var q=toks[t],qs=stem(q),qg=groupsOfQuery(q,qs),sc=new Array(n),any=false;
   for(i=0;i<n;i++){if(!alive[i]){sc[i]=0;continue}sc[i]=exact(q,qs,qg,index[i]);if(sc[i])any=true}
   if(!any&&qs.length>=4)for(i=0;i<n;i++){if(alive[i]){sc[i]=fuzzy(qs,q,index[i])}}
   for(i=0;i<n;i++){if(alive[i]){if(sc[i]){tot[i]+=sc[i]}else alive[i]=false}}}
  var out=[];for(i=0;i<n;i++)if(alive[i])out.push([tot[i],index[i].it]);
  out.sort(function(a,b){return b[0]-a[0]});var r=out.map(function(x){return x[1]});return limit?r.slice(0,limit):r}
 return {norm:norm,stem:stem,build:build,search:search,lev:lev}})();
/*FZ_END*/

/*RX_BEGIN*/
/* Ограничения здоровья: каталог состояний, привязка к профилю, статус упражнения.
   Профиль: p.cx = [ключи состояний], p.preg = 0 нет | 1,2,3 триместр | 4 срок неизвестен (берём самое строгое).
   Упражнение: x1 = «не рекомендуется», x2 = «с осторожностью», pg = "012" по триместрам (0 ок, 1 осторожно, 2 не рекомендуется). */
var RX=(function(){
 var GROUPS=[["bone","Опорно-двигательная"],["heart","Сердечно-сосудистая"],["lung","Дыхательная"],["meta","Метаболические"],["neuro","Нервная система и баланс"],["wom","Женское здоровье"],["other","Прочее"]];
 var CONDS=[ /* ключ, полное название, короткое, группа, область */
  ["kn_oa","Артроз коленного сустава","Колено: артроз","bone","knee"],["kn_pf","Пателлофеморальный синдром","Колено: боль под коленной чашечкой","bone","knee"],["kn_men","Повреждение/операция мениска или ПКС","Колено: мениск или ПКС","bone","knee"],["kn_end","Эндопротез коленного сустава","Колено: эндопротез","bone","knee"],
  ["hip_oa","Артроз тазобедренного сустава","Бедро: артроз","bone","hip"],["hip_lab","Повреждение лабрума тазобедренного сустава","Бедро: лабрум","bone","hip"],["hip_end","Эндопротез тазобедренного сустава","Бедро: эндопротез","bone","hip"],
  ["sp_disc","Протрузия/грыжа диска (поясница)","Спина: грыжа или протрузия","bone","back"],["sp_surg","Состояние после операции на позвоночнике","Спина: после операции","bone","back"],["sp_sten","Стеноз позвоночного канала","Спина: стеноз","bone","back"],["sp_spon","Спондилолистез","Спина: спондилолистез","bone","back"],["sp_mob","Ограничение подвижности поясницы/грудного отдела","Спина: скованность","bone","back"],["osteo","Остеопороз/остеопения","Остеопороз","bone","back"],
  ["sh_imp","Импиджмент-синдром плеча","Плечо: импиджмент","bone","shoulder"],["sh_frz","Замороженное плечо","Плечо: замороженное","bone","shoulder"],["sh_cuff","Повреждение/операция вращательной манжеты","Плечо: манжета","bone","shoulder"],["sh_end","Эндопротез плечевого сустава","Плечо: эндопротез","bone","shoulder"],
  ["elb","Тендинит локтя/туннельный синдром запястья","Локоть и запястье","bone","arm"],["ank","Хроническая нестабильность голеностопа","Голеностоп: нестабильность","bone","foot"],["ach","Проблемы с ахилловым сухожилием","Ахиллово сухожилие","bone","foot"],["plan","Плантарный фасциит","Стопа: плантарный фасциит","bone","foot"],
  ["arr","Аритмия","Аритмия","heart","heart"],["ihd","ИБС/состояние после инфаркта","ИБС или инфаркт","heart","heart"],["htn","Неконтролируемая гипертония","Гипертония","heart","heart"],["hop","Состояние после операции на сердце/стентирования","После операции на сердце","heart","heart"],["var","Варикозная болезнь/венозная недостаточность","Варикоз","heart","legs"],["dvt","Тромбоз глубоких вен/тромбофилия в анамнезе","Тромбоз в анамнезе","heart","legs"],
  ["asth","Бронхиальная астма","Астма","lung",""],["copd","ХОБЛ","ХОБЛ","lung",""],
  ["dm","Сахарный диабет","Диабет","meta",""],["obes","Ожирение высокой степени","Ожирение высокой степени","meta",""],
  ["vest","Головокружения/вестибулярные нарушения","Головокружения","neuro",""],["neur","Периферическая нейропатия","Нейропатия","neuro",""],
  ["pp","Послеродовый период/диастаз прямых мышц живота","После родов, диастаз","wom",""],["pelv","Пролапс тазовых органов/недержание","Тазовое дно","wom",""],
  ["hern","Грыжа (паховая/пупочная/послеоперационная)","Грыжа","other",""],["abd","Недавняя полостная операция","Недавняя операция на животе","other",""]];
 var BY={};CONDS.forEach(function(c){BY[c[0]]=c});
 /* быстрый выбор из онбординга → состояния */
 var QUICK={"Колени":["kn_oa","kn_pf","kn_men"],"Спина":["sp_disc","sp_sten","sp_mob"],"Плечи":["sh_imp","sh_cuff"],"Сердце или давление":["arr","ihd","htn"],"Беременность или после родов":["pp"]};
 var PREGN=["Нет","1 триместр","2 триместр","3 триместр","Срок не знаю"];
 function arr(a){return Array.isArray(a)?a:[]}
 function keysOf(p){p=p||{};
  if(Array.isArray(p.cx))return p.cx.filter(function(k){return BY[k]});
  var s=[];arr(p.cau).forEach(function(l){(QUICK[l]||[]).forEach(function(k){if(s.indexOf(k)<0)s.push(k)})});return s}
 function pregOf(p){p=p||{};var v=+p.preg;if(v>=1&&v<=4)return v;if(p.preg==null&&arr(p.cau).indexOf("Беременность или после родов")>=0&&!Array.isArray(p.cx))return 0;return 0}
 /* 0 — подходит, 1 — с осторожностью, 2 — не рекомендуется */
 function status(ex,p){if(!ex)return 0;var k=keysOf(p),pr=pregOf(p),s=0,i;
  var x1=ex.x1||[],x2=ex.x2||[];
  for(i=0;i<k.length;i++){if(x1.indexOf(k[i])>=0)return 2;if(x2.indexOf(k[i])>=0)s=1}
  if(pr&&ex.pg){var g=ex.pg;if(pr===4){var m=Math.max(+g[0]||0,+g[1]||0,+g[2]||0);if(m>s)s=m}else{var v=+g[pr-1]||0;if(v>s)s=v}}
  return s}
 function why(ex,p){var out=[],k=keysOf(p),pr=pregOf(p),i;if(!ex)return out;
  k.forEach(function(c){if((ex.x1||[]).indexOf(c)>=0)out.push({sev:2,key:c,t:BY[c][2]});else if((ex.x2||[]).indexOf(c)>=0)out.push({sev:1,key:c,t:BY[c][2]})});
  if(pr&&ex.pg){var g=ex.pg,v=pr===4?Math.max(+g[0]||0,+g[1]||0,+g[2]||0):(+g[pr-1]||0);if(v)out.push({sev:v,key:"preg",t:"Беременность"+(pr<4?", "+pr+" триместр":"")})}
  out.sort(function(a,b){return b.sev-a.sev});return out}
 /* все ограничения упражнения (для карточки), без привязки к профилю */
 function all(ex){var o=[];(ex.x1||[]).forEach(function(c){if(BY[c])o.push({sev:2,key:c,t:BY[c][2],g:BY[c][3]})});(ex.x2||[]).forEach(function(c){if(BY[c])o.push({sev:1,key:c,t:BY[c][2],g:BY[c][3]})});return o}
 function pregTxt(ex){var g=ex&&ex.pg;if(!g)return "";var w=["подходит","с осторожностью","не рекомендуется"],o=[];for(var i=0;i<3;i++)o.push((i+1)+" тр. — "+w[+g[i]||0]);return o.join(" · ")}
 /* для профиля: строки «что беречь» для старых мест (кнопки, регулярки) */
 function cauOf(p){var k=keysOf(p),o=[],has=function(a){return k.some(function(c){return BY[c][4]===a})};
  if(has("knee"))o.push("Колени");if(has("back")||k.indexOf("osteo")>=0)o.push("Спина");if(has("shoulder"))o.push("Плечи");
  if(has("heart"))o.push("Сердце или давление");if(pregOf(p)||k.indexOf("pp")>=0)o.push("Беременность или после родов");return o}
 return {GROUPS:GROUPS,CONDS:CONDS,BY:BY,QUICK:QUICK,PREGN:PREGN,keysOf:keysOf,pregOf:pregOf,status:status,why:why,all:all,pregTxt:pregTxt,cauOf:cauOf}})();
/*RX_END*/

/*GEN_BEGIN*/
/* Генератор программ Forma: чистый JS (без DOM). API: mkEx, starter, templates, copyProgram, estMin, stats, setCat */
var GEN=(function(){
 var custom=false,CAT=[],BY={},lastLen=-1;
 function readCat(){var c=null;
  try{if(typeof FCAT!=="undefined"&&FCAT)c=FCAT}catch(e){}
  if(!c){try{if(typeof parent!=="undefined"&&parent&&parent.FCAT)c=parent.FCAT}catch(e){}}
  return Array.isArray(c)?c:[]}
 function reindex(){BY={};CAT.forEach(function(c){if(c&&c.id!=null)BY[c.id]=c});lastLen=CAT.length}
 function ensure(){if(custom)return;var c=readCat();if(c!==CAT||c.length!==lastLen){CAT=c;reindex()}}
 function setCat(arr){CAT=Array.isArray(arr)?arr:[];custom=true;reindex()}

 var _n=0;
 function uid(){_n++;return "g"+Date.now().toString(36)+_n.toString(36)+Math.floor(Math.random()*46656).toString(36)}
 function clamp(x,a,b){return Math.max(a,Math.min(b,x))}
 function RXS(x,p){try{return typeof RX!=="undefined"?RX.status(x,p):0}catch(e){return 0}}
 function parseRng(r){var m=/(\d+)/.exec(String(r==null?"":r));return m?+m[1]:null}
 /* стартовые значения из текста диапазона: «3–6 (сила) / 8–12 (гипертрофия)» → 8; «30–45 сек» → 30 с; «2 мин пассивно + 20–30 сек PAIL» → 20 с */
 function defaults(c){
  var r=String(c&&c.rng||"").replace(/\s+/g," ").trim(),time=!!(c&&c.fmt==="time"),m,n=3,nt=false;
  if(c&&c.eq==="mob")n=2;
  else if(c&&c.pos&&c.pos.indexOf("m")<0&&c.pos.indexOf("c")<0)n=2;
  /* «2 подхода по 20», «5×5»: число подходов из текста; остаток строки — повторы или секунды (иначе «3 подхода…» читалось как 3 повтора) */
  if((m=/^(\d+)(?:\s*[–-]\s*\d+)?\s*(?:подход|прох)\S*(?:\s+по)?\s*(.*)$/i.exec(r))){n=Math.max(1,Math.min(6,+m[1]));nt=true;r=m[2]||""}
  else if((m=/^(\d+)\s*[×x]\s*(\d+.*)$/i.exec(r))){n=Math.max(1,Math.min(6,+m[1]));nt=true;r=m[2]}
  else if((m=/(\d+)\s*подход/i.exec(r)))n=Math.max(1,Math.min(6,+m[1]));
  if(/PAIL|RAIL|пассивно/i.test(r))return {n:2,nt:true,mode:"time",v:1,t:30};
  var v=null,t=null;
  if(time){
   if((m=/(\d+)(?:\s*[–-]\s*\d+)?\s*сек/i.exec(r)))t=+m[1];
   else if((m=/(\d+)(?:\s*[–-]\s*\d+)?\s*мин/i.exec(r)))t=Math.min(120,+m[1]*60);
   else if(/\d+\s*(?:[–-]\s*\d+\s*)?м(?![а-яёa-z])/i.test(r))t=30;
   else{m=/(\d+)/.exec(r);t=m?+m[1]:30;if(t<10)t=30}
   if(!(t>=5))t=30;t=Math.min(t,300);return {n:n,nt:nt,mode:"time",v:1,t:t}}
  if((m=/(\d+)(?:\s*[–-]\s*\d+)?\s*\((?:гипертроф|контрол|выносл)/i.exec(r)))v=+m[1];
  else if((m=/по\s*(\d+)/i.exec(r)))v=+m[1];
  else if((m=/(\d+)/.exec(r)))v=+m[1];
  if(!(v>=1))v=10;v=Math.max(3,Math.min(30,v));
  return {n:n,nt:nt,mode:"kg",v:v,t:30}}


 /* ---------- упражнение ---------- */
 function mkEx(id,o){
  ensure();o=o||{};var c=BY[id]||null,time=!!(c&&c.fmt==="time"),D=c?defaults(c):null,base=D?(time?D.t:D.v):null;
  var n=+o.n>0?Math.round(+o.n):(D&&D.nt?D.n:(c&&+c.sets>0?Math.round(+c.sets):(D&&/\d+\s*подход/i.test(String(c.rng||""))?D.n:3)));
  var rest=+o.rest>=0&&o.rest!==undefined&&o.rest!==null&&o.rest!==""?Math.round(+o.rest):60;
  var v,t;
  if(time){v=1;t=+o.t>0?Math.round(+o.t):(base||30)}
  else{v=+o.v>0?Math.round(+o.v):(base||10);t=+o.t>0?Math.round(+o.t):30}
  var sets=[];for(var i=0;i<n;i++)sets.push({v:v,w:"",t:t,rest:rest});
  return {u:uid(),id:id,mode:time?"time":"kg",sets:sets,note:"",link:false}}

 /* ---------- группы и типы тренировок ---------- */
 var G={GL:"Ягодицы",QD:"Передняя поверхность бедра",HM:"Задняя поверхность бедра",CF:"Мышцы голени",BI:"Бицепс",TR:"Трицепс",FA:"Предплечье",SH:"Плечи",CH:"Мышцы груди",BK:"Мышцы спины",CR:"Мышцы кора"};
 function S(s){return s.split(" ").map(function(k){return G[k]})}
 var ALL=S("QD GL HM CF BI TR FA SH CH BK CR");
 var TYPES={
  full:{label:"Всё тело",slots:S("QD CH BK GL SH HM CR CF TR BI"),groups:ALL,cap:2,full:1},
  fullA:{label:"Всё тело · приседания",slots:S("QD CH BK GL SH HM CR CF TR BI"),groups:ALL,cap:2,full:1},
  fullB:{label:"Всё тело · тяги",slots:S("GL BK SH HM CH CR QD TR CF BI"),groups:ALL,cap:2,full:1},
  fullC:{label:"Всё тело · жимы",slots:S("HM CH QD BK GL SH CR BI TR CF"),groups:ALL,cap:2,full:1},
  lower:{label:"Ягодицы · ноги",slots:S("GL QD HM GL QD CF HM CR GL QD"),groups:S("GL QD HM CF CR"),cap:3},
  lower2:{label:"Ноги · ягодицы",slots:S("QD HM GL QD GL HM CF CR QD GL"),groups:S("QD HM GL CF CR"),cap:3},
  glute:{label:"Ягодицы",slots:S("GL GL HM GL QD GL HM CR CF GL"),groups:S("GL HM QD CF CR"),cap:4},
  upper:{label:"Верх тела",slots:S("CH BK SH BK CH BI TR SH CR FA"),groups:S("CH BK SH BI TR FA CR"),cap:3},
  upper2:{label:"Верх тела · спина",slots:S("BK CH SH CH BK TR BI SH CR FA"),groups:S("BK CH SH TR BI FA CR"),cap:3},
  push:{label:"Грудь · плечи · трицепс",slots:S("CH SH CH TR SH TR CR CH SH"),groups:S("CH SH TR CR"),cap:3},
  pull:{label:"Спина · бицепс",slots:S("BK BK SH BI BK BI CR FA SH BK"),groups:S("BK SH BI FA CR"),cap:3},
  posture:{label:"Осанка и плечи",slots:S("BK SH BK SH CH CR TR BI BK"),groups:S("BK SH CH TR BI CR"),cap:3},
  core:{label:"Кор и пресс",slots:S("CR GL CR BK CR CR SH"),groups:S("CR GL BK SH"),cap:4,coreMain:1}
 };
 var DAYS={1:[2],2:[1,4],3:[0,2,4],4:[0,1,3,4],5:[0,1,2,3,4],6:[0,1,2,3,4,5]};
 var GN={stroy:"Стройное тело",relief:"Рельеф",force:"Сила",start:"Мягкий старт",recover:"Восстановление",reg:"Регулярность"};
 var SOFT={start:1,recover:1,reg:1};
 var JUMP=/прыж|выпрыг|берпи|бёрпи|burpee|jump|скакал|подскок|плиометр/i;
 function isJump(c){return JUMP.test(String(c.n||"")+" "+String(c.tech||"")+" "+String(c.en||""))}
 function hasPc(c,g){var a=c.pc;if(!Array.isArray(a))return false;for(var i=0;i<a.length;i++)if(a[i]&&a[i][0]===g&&+a[i][1]>=30)return true;return false}

 /* ---------- отбор ---------- */
 function normMins(m){m=+m;if(!(m>0))return 45;var a=[20,30,45,60],b=a[0];a.forEach(function(x){if(Math.abs(x-m)<Math.abs(b-m))b=x});return b}
 function countFor(mins,lvl){if(mins===20)return lvl<=1?3:4;if(mins===30)return 5;if(mins===45)return lvl<=1?6:7;return lvl<=1?8:9}
 function mkCtx(c){
  ensure();
  var eq=c.eq||{},valid=CAT.filter(function(x){return x&&x.id!=null&&x.m}),soft=!!c.soft,noJump=!!c.noJump;
  var prof=c.prof||{},home=c.where==="home";
  var ok=function(x){return !(noJump&&isJump(x))&&RXS(x,prof)!==2&&!(home&&x.hm==="g")&&!power(x)};
  var isMain=function(x){return !x.pos||x.pos.indexOf("m")>=0};
  var power=function(x){return /Мощность|Кондиция/.test(String(x.lt||""))&&c.lvl<3&&c.goal!=="force"};
  var inEq=function(x){return eq[x.eq||"body"]&&(x.eq!=="mob"||(!soft&&eq.mob))};
  var strictP=valid.filter(function(x){return x.eq!=="mob"?(eq[x.eq||"body"]&&ok(x)&&isMain(x)&&(x.lvl||1)<=c.maxLvl):false});
  var relaxP=valid.filter(function(x){return x.eq!=="mob"&&eq[x.eq||"body"]&&ok(x)&&isMain(x)});
  var anyP=valid.filter(function(x){return x.eq!=="mob"&&ok(x)&&isMain(x)});
  var warm=function(x){return x.eq==="mob"&&ok(x)&&(!x.pos||x.pos.indexOf("w")>=0)&&!/PAIL|релиз/i.test(String(x.pat||"")+" "+String(x.n||""))};
  if(!soft&&eq.mob){strictP=strictP.concat(valid.filter(function(x){return warm(x)&&(x.lvl||1)<=c.maxLvl}))}
  var mob=soft?valid.filter(function(x){return warm(x)&&(x.lvl||1)<=Math.min(3,c.maxLvl+1)}):[];
  return {types:c.types,goal:c.goal||"std",soft:soft,mins:c.mins,count:c.count,lvl:c.lvl,strict:!!c.strict,minEx:3,sex:c.sex,
   cautious:!!c.cautious,knees:!!c.knees,prof:prof,softSets:c.softSets||2,pools:[strictP,relaxP,anyP],mob:mob}}

 function score(c,ctx,usage,gcPen){
  var s=0,pn=(c.pc&&c.pc.length)||1,l=c.lvl||1;
  s+=Math.min(pn,3)*0.7;
  if(ctx.goal==="force"){if(c.eq==="barbell")s+=2;else if(c.eq==="machine"||c.eq==="dumbbell"||c.eq==="kettlebell")s+=0.6;s+=l*0.5;if(c.fmt==="time")s-=1.5}
  else if(ctx.soft){s-=l*0.6;if(c.uni)s-=0.2}
  else s+=l*0.2-(l>ctx.lvl?1.5:0);
  if(ctx.goal==="relief"&&c.fmt==="time")s+=0.3;
  if(ctx.cautious&&l>=3)s-=0.8;
  if(ctx.knees&&/выпад|болгар|присед/i.test(c.n||""))s-=1;
  if(ctx.prof&&RXS(c,ctx.prof)===1)s-=2.5;
  s-=(usage[c.id]||0)*2.5;s-=gcPen||0;s+=Math.random()*0.8;
  return s}
 function best(list,ctx,usage,gc){
  var b=null,bs=-1e9;
  list.forEach(function(c){var s=score(c,ctx,usage,gc?(gc[c.m]||0)*1.5:0);if(s>bs){bs=s;b=c}});
  return b}
 function cands(pool,g,ids){
  var a=[];pool.forEach(function(c){if(!ids[c.id]&&c.m===g)a.push(c)});
  if(!a.length)pool.forEach(function(c){if(!ids[c.id]&&hasPc(c,g))a.push(c)});
  return a}
 function baseVal(c){var v=((c.pc&&c.pc.length)||1)*2;if(c.fmt==="time")v-=1;if(c.m===G.CF||c.m===G.BI||c.m===G.TR||c.m===G.FA)v-=2;if(c.eq==="barbell")v+=1;return v}

 function slotList(T,ctx){
  var s=T.slots.slice();
  if(T.full){
   if(ctx.goal==="stroy"){s.splice(0,0,G.GL);s.splice(6,0,G.CR)}
   else if(ctx.goal==="relief")s.splice(5,0,G.CR);
   else if(ctx.goal!=="force"&&ctx.sex==="f")s.splice(2,0,G.GL);
   else if(ctx.goal!=="force"&&ctx.sex==="m")s.splice(2,0,G.CH);
  }
  if(ctx.goal==="force")s=s.filter(function(g){return g!==G.BI&&g!==G.TR&&g!==G.FA&&g!==G.CF});
  return s}

 function arrange(list,T){
  /* разминка вперёд, кор в конец, базовые вперёд; чередуем группы, не более 2 одной группы подряд (если это возможно) */
  var ix=list.map(function(c,i){
   var k=c.eq==="mob"?-1000:(c.m===G.CR&&!T.coreMain?1000:-baseVal(c));return {c:c,i:i,k:k}});
  ix.sort(function(a,b){return a.k-b.k||a.i-b.i});
  var rem=ix.map(function(x){return x.c}),out=[];
  while(rem.length){
   var L=rem.length,cnt={},mx=null,mc=0,i;
   rem.forEach(function(c){cnt[c.m]=(cnt[c.m]||0)+1});
   for(var g in cnt)if(cnt[g]>mc){mc=cnt[g];mx=g}
   var last=out.length?out[out.length-1].m:null,p=-1;
   if(mc*2>L&&mx!==last){for(i=0;i<L;i++)if(rem[i].m===mx){p=i;break}}
   if(p<0){for(i=0;i<L;i++)if(rem[i].m!==last){p=i;break}}
   if(p<0)p=0;
   out.push(rem.splice(p,1)[0]);
  }
  return out}

 function exParams(c,idx,ctx){
  var D=defaults(c),base=D.mode==="time"?D.t:D.v,time=c.fmt==="time",n=D.n,o={};
  if(ctx.soft)n=ctx.softSets;
  else if(ctx.goal==="force"){var comp=c.pc&&c.pc.length>1;if(idx<3&&comp)n+=1;n=Math.max(3,Math.min(n,ctx.lvl<=1?4:5))}
  else{if(ctx.lvl<=1)n=Math.min(n,3);if(ctx.mins===20)n=Math.min(n,3);if(ctx.mins===60&&idx<2&&n<4)n+=1}
  o.n=n;
  if(!time&&base){
   if(ctx.goal==="relief")o.v=Math.min(20,base+3);
   else if(ctx.goal==="force")o.v=Math.max(5,Math.round(base*0.6));
   else o.v=base}
  if(time&&base&&ctx.goal==="relief")o.t=base+10;
  o.rest=ctx.goal==="force"?90:(ctx.goal==="relief"?40:60);
  return o}

 function buildOne(ctx,T,usage){
  var N=ctx.count,ids={},chosen=[],gc={};
  function add(c,nogc){ids[c.id]=1;chosen.push(c);if(!nogc)gc[c.m]=(gc[c.m]||0)+1}
  if(ctx.soft&&ctx.mob.length){
   var need=N>=7?2:1;
   for(var k=0;k<need;k++){var m=best(ctx.mob.filter(function(x){return !ids[x.id]}),ctx,usage);if(m)add(m,true)}
  }
  var slots=slotList(T,ctx),p0=ctx.pools[0],i;
  for(i=0;i<slots.length&&chosen.length<N;i++){
   var g=slots[i];if((gc[g]||0)>=T.cap)continue;
   var c=best(cands(p0,g,ids),ctx,usage);if(c)add(c)}
  for(var round=1;round<=3&&chosen.length<N;round++){
   var lim=T.cap+round;
   for(i=0;i<T.groups.length&&chosen.length<N;i++){
    var g2=T.groups[i];if((gc[g2]||0)>=lim)continue;
    var c2=best(cands(p0,g2,ids),ctx,usage);if(c2)add(c2)}
  }
  if(!ctx.strict){
   var pi=0;
   while(chosen.length<N&&pi<1){
    var any=best(p0.filter(function(x){return !ids[x.id]}),ctx,usage,gc);if(!any)break;add(any)}
   pi=1;
   while(chosen.length<Math.min(N,ctx.minEx)&&pi<ctx.pools.length){
    var any2=best(ctx.pools[pi].filter(function(x){return !ids[x.id]}),ctx,usage,gc);
    if(any2)add(any2);else pi++}
  }
  var ord=arrange(chosen,T);
  ord.forEach(function(c){usage[c.id]=(usage[c.id]||0)+1});
  return ord}

 function buildWorkouts(ctx){
  var usage={},out=[],K="ABCDEF";
  for(var i=0;i<ctx.types.length;i++){
   var T=TYPES[ctx.types[i]]||TYPES.full,ord=buildOne(ctx,T,usage);
   if(ctx.strict&&ord.length<ctx.minEx)return null;
   if(!ord.length)continue;
   var key=K.charAt(out.length)||String(out.length+1);
   var names=ord.filter(function(c){return c.eq!=="mob"}).slice(0,3).map(function(c){return c.n});
   out.push({id:uid(),key:key,name:key+" · "+T.label,desc:names.join(", "),done:false,tnote:"",
    ex:ord.map(function(c,j){return mkEx(c.id,exParams(c,j,ctx))})});
  }
  return out}

 /* ---------- стартовая программа ---------- */
 function hasRe(a,re){return Array.isArray(a)&&a.some(function(s){return re.test(String(s).toLowerCase())})}
 function validTime(t){return typeof t==="string"&&/^([01]\d|2[0-3]):[0-5]\d$/.test(t)?t:null}
 function sessionsFor(days,lvl,goal){
  if(days<=1)return ["full"];
  if(days===2)return ["fullA","fullB"];
  if(days===3){if(lvl<=1)return ["fullA","fullB","fullC"];return goal==="stroy"?["lower","upper","lower2"]:["lower","upper","fullA"]}
  if(days===4)return ["upper","lower","upper2","lower2"];
  if(days===5)return ["lower","push","pull","lower2","fullA"];
  return ["push","pull","lower","push","pull","lower2"]}
 function dayWord(n){return n===1?"день":(n<5?"дня":"дней")}

 function starter(profile,opts){
  ensure();profile=profile||{};opts=opts||{};
  var days=clamp(Math.round(+opts.days)||3,1,6),mins=normMins(opts.mins),lvl=clamp(Math.round(+profile.lvl)||1,1,3);
  var time=validTime(opts.time)||validTime(profile.rem)||"18:00";
  var goal=GN[profile.goal]?profile.goal:"std",soft=!!SOFT[goal];
  var cauAll=(Array.isArray(profile.cau)?profile.cau:[]).concat(typeof RX!=="undefined"?RX.cauOf(profile):[]);
  var knees=hasRe(cauAll,/колен/),back=hasRe(cauAll,/спин|поясниц/);
  var eq={body:1},pe=Array.isArray(profile.eq)?profile.eq.filter(function(k){return typeof k==="string"}):[];
  pe.forEach(function(k){eq[k]=1});
  if(profile.where==="gym"&&!pe.length){eq.machine=eq.dumbbell=eq.barbell=eq.cable=eq.kettlebell=1}
  var ctx=mkCtx({types:sessionsFor(days,lvl,goal),goal:goal,soft:soft,noJump:soft||knees||back,eq:eq,maxLvl:lvl,
   mins:mins,count:countFor(mins,lvl),lvl:lvl,sex:profile.sex,prof:profile,where:profile.where,cautious:knees||back,knees:knees,softSets:(goal==="reg"&&lvl>=2)?3:2});
  var workouts=buildWorkouts(ctx)||[];
  var W={gym:"зал",home:"дом",both:"дом и зал"}[profile.where]||"дом и зал";
  var prog={id:uid(),name:(GN[goal]||"Моя программа"),
   desc:days+" "+dayWord(days)+" в неделю · ~"+mins+" мин · "+W,workouts:workouts};
  return {progs:{programs:[prog]},plan:{days:DAYS[days].slice(),mins:mins,time:time,prog:prog.id}}}

 /* ---------- готовые программы ---------- */
 var TPL=[
  {id:"tpl-trx-full",name:"TRX дома: всё тело",desc:"12 тренировок на петлях на всё тело за 4 недели: приседания, тяги, жимы и кор. Нужны только петли и точка крепления.",lvl:1,maxLvl:2,where:"home",mins:30,perWeek:3,goal:"relief",style:"std",tags:["TRX","Дом","Всё тело"],eqs:["trx","body"],types:["fullA","fullB","fullC"]},
  {id:"tpl-glutes-home",name:"Ягодицы и ноги дома",desc:"12 тренировок за 6 недель на ягодицы и ноги: мостики, отведения и приседания с резинкой и собственным весом.",lvl:1,maxLvl:2,where:"home",mins:30,perWeek:2,goal:"stroy",style:"stroy",tags:["Ягодицы","Ноги","Дом","Резинка"],eqs:["body","band"],types:["lower","lower2"]},
  {id:"tpl-dumbbell-home",name:"Гантели дома: всё тело",desc:"12 тренировок за 4 недели на всё тело с гантелями: базовые движения на ноги, спину, грудь и плечи.",lvl:1,maxLvl:2,where:"home",mins:45,perWeek:3,goal:"relief",style:"std",tags:["Гантели","Дом","Всё тело"],eqs:["dumbbell","body"],types:["fullA","fullB","fullC"]},
  {id:"tpl-gym-novice",name:"Зал: база для новичка",desc:"12 тренировок за 4 недели в зале на простых тренажёрах и с гантелями. Осваиваем технику и набираем рабочую базу.",lvl:1,maxLvl:1,where:"gym",mins:45,perWeek:3,goal:"start",style:"std",tags:["Зал","Новичок","Тренажёры"],eqs:["machine","dumbbell","cable","body"],types:["fullA","fullB","fullC"]},
  {id:"tpl-posture",name:"Верх тела и осанка",desc:"12 тренировок за 6 недель на верх тела: спина, задние дельты и грудь. Снимают нагрузку с шеи и плеч.",lvl:1,maxLvl:2,where:"both",mins:30,perWeek:2,goal:"recover",style:"std",tags:["Осанка","Спина","Плечи"],eqs:["trx","band","dumbbell","body"],types:["posture","upper"]},
  {id:"tpl-core20",name:"Кор и пресс 20 минут",desc:"12 коротких тренировок за 4 недели на кор и стабилизацию. По 20 минут в любом месте.",lvl:1,maxLvl:2,where:"both",mins:20,perWeek:3,goal:"relief",style:"std",tags:["Кор","Пресс","20 минут"],eqs:["body","band","trx"],types:["core"]},
  {id:"tpl-soft-start",name:"Мягкий старт",desc:"12 тренировок за 4 недели: по два подхода, без прыжков и перегрузок. Чтобы вернуться в ритм и не бросить.",lvl:1,maxLvl:1,where:"both",mins:20,perWeek:3,goal:"start",style:"start",tags:["Новичок","Мягко","Дом"],eqs:["body","band","mob"],types:["fullA","fullB"]},
  {id:"tpl-force-barbell",name:"Сила: база со штангой",desc:"12 силовых тренировок за 4 недели: присед, жим, тяга. Мало повторов, рабочий вес, длинный отдых.",lvl:3,maxLvl:3,where:"gym",mins:60,perWeek:3,goal:"force",style:"force",tags:["Сила","Штанга","Зал"],eqs:["barbell","machine","dumbbell","body"],types:["fullA","fullB","fullC"]},
  {id:"tpl-split-gym",name:"Верх / низ: 4 дня",desc:"12 тренировок за 3 недели в формате верх / низ: четыре дня в неделю и больше объёма на каждую группу мышц.",lvl:2,maxLvl:2,where:"gym",mins:45,perWeek:4,goal:"stroy",style:"std",tags:["Зал","Сплит","4 дня"],eqs:["barbell","dumbbell","machine","cable","body"],types:["upper","lower","upper2","lower2"]},
  {id:"tpl-glutes-gym",name:"Ягодицы: зал",desc:"12 тренировок за 6 недель на ягодицы и заднюю поверхность бедра: мостик со штангой, тяги и тренажёры.",lvl:2,maxLvl:2,where:"gym",mins:45,perWeek:2,goal:"stroy",style:"stroy",tags:["Ягодицы","Зал"],eqs:["barbell","machine","dumbbell","band","body"],types:["glute","lower2"]},
  {id:"tpl-relief-home",name:"Рельеф дома: всё тело",desc:"12 тренировок за 4 недели в плотном темпе: больше повторов, короткий отдых, круговой формат.",lvl:2,maxLvl:2,where:"home",mins:30,perWeek:3,goal:"relief",style:"relief",tags:["Рельеф","Дом","Круговая"],eqs:["body","band","dumbbell","trx"],types:["fullA","fullB","fullC"]},
  {id:"tpl-gentle",name:"Бережная: колени и спина",desc:"12 щадящих тренировок за 4 недели без прыжков и тяжёлых осевых нагрузок, с мобилизацией в начале.",lvl:1,maxLvl:1,where:"both",mins:30,perWeek:3,goal:"recover",style:"recover",tags:["Бережно","Колени","Спина"],eqs:["body","band","trx","mob"],types:["fullA","fullB"],cau:["Колени","Спина"]}
 ];

var PITCH={"tpl-trx-full": "Тонус всего тела за 4 недели: ноги, плечи, живот. Только петли TRX и 30 минут, зал не нужен.", "tpl-glutes-home": "Подтяните ягодицы и ноги за 6 недель дома. Резинка и два занятия в неделю по 30 минут.", "tpl-dumbbell-home": "Сильное подтянутое тело с парой гантелей. За 12 занятий базовые движения станут уверенными.", "tpl-gym-novice": "Придите в зал без страха. Простые тренажёры, чёткая техника и первый прогресс за 4 недели.", "tpl-posture": "Расправьте плечи и снимите напряжение с шеи за 6 недель. Для тех, кто весь день за столом.", "tpl-core20": "Крепкий кор и подтянутый живот за 20 минут. Подходит для самых занятых дней.", "tpl-soft-start": "Вернитесь в движение без боли и срывов. Короткие занятия без прыжков, чтобы не бросить.", "tpl-force-barbell": "Прибавьте в силе в приседе, жиме и тяге за 4 недели. Рабочие веса и длинный отдых.", "tpl-split-gym": "Больше объёма на каждую группу мышц за 3 недели. Верх / низ четыре дня в неделю.", "tpl-glutes-gym": "Ягодицы в центре внимания 6 недель: мостики со штангой, тяги и тренажёры. Когда дома мало.", "tpl-relief-home": "Максимум работы за 30 минут в круговом темпе. Меньше пауз, и рельеф становится заметнее.", "tpl-gentle": "Тренируйтесь бережно, когда колени и спина просят покоя. Без прыжков и тяжёлых нагрузок."};
var GETS={relief:["Подтянутое тело и заметный рельеф","Больше энергии и выносливости","Привычку тренироваться по плану"],stroy:["Тонус и форму ягодиц, ног и корпуса","Рост силы в базовых движениях","Понятный прогресс неделя за неделей"],start:["Освоенную технику базовых движений","Уверенность и привычку заниматься","Мягкий старт без перегрузок"],recover:["Меньше напряжения в шее, плечах и пояснице","Ровную осанку и подвижные суставы","Тренировки без боли и лишнего риска"],force:["Рост рабочих весов в базовых движениях","Чёткую технику под тяжёлой нагрузкой","Прогрессию нагрузки на каждую неделю"]};
var TPX={"tpl-trx-full": {"price": 2490, "trailer": "1:20", "long": "Четыре недели по три тренировки. Каждая неделя чуть сложнее предыдущей: растут объём, угол наклона и время под нагрузкой. В программе все базовые движения на петлях: приседания и выпады, горизонтальные тяги, жимы и работа на кор. Подходит тем, кто хочет заниматься дома без тяжёлого инвентаря.", "titles": ["Знакомство с петлями: всё тело", "Приседания и тяги", "Жимы и кор", "Всё тело: база", "Ноги и спина", "Грудь, плечи и пресс", "Силовая выносливость", "Ноги, тяги и баланс", "Жимы и кор: усложнение", "Всё тело: круг", "Ноги и спина: пик", "Финал: всё тело"]}, "tpl-glutes-home": {"price": 1990, "trailer": "1:05", "long": "Шесть недель по две тренировки. Начинаем с активации ягодичных мышц, затем добавляем объём, упражнения на одной ноге и сопротивление резинки. Подходит для первых месяцев занятий и тем, кто хочет тренироваться дома.", "titles": ["Активация ягодиц", "Мостики и отведения", "Приседания с резинкой", "Ягодицы и задняя поверхность", "Выпады и степ-апы", "Ягодицы: объём", "Мостик на одной ноге", "Ноги и ягодицы с резинкой", "Ягодицы: плотный круг", "Сумо и боковые шаги", "Ягодицы: пиковая нагрузка", "Финал: ноги и ягодицы"]}, "tpl-dumbbell-home": {"price": 2490, "trailer": "1:15", "long": "Четыре недели по три тренировки на всё тело. Хватит одной пары гантелей и стула: базовые приседания, тяги, жимы и работа на кор. Нагрузка растёт за счёт повторов и темпа, вес гантелей вы подбираете сами.", "titles": ["Гантели: знакомство", "Ноги и спина", "Грудь и плечи", "Всё тело: база", "Тяги и приседания", "Жимы и руки", "Всё тело: объём", "Ноги с гантелями", "Спина и плечи", "Всё тело: плотный темп", "Ноги и ягодицы", "Финал: всё тело"]}, "tpl-gym-novice": {"price": 2990, "trailer": "1:30", "long": "Четыре недели по три тренировки. В начале простые тренажёры и гантели, чтобы освоить технику, затем постепенно добавляется рабочий вес. После программы вы уверенно ориентируетесь в зале и готовы к следующему уровню.", "titles": ["Знакомство с залом", "Ноги: тренажёры", "Спина и грудь", "Всё тело: база", "Жим ногами и тяги", "Плечи и руки", "Всё тело: техника", "Ноги и ягодицы", "Спина и грудь: объём", "Всё тело: рабочие веса", "Ноги: добавляем нагрузку", "Финал: проверка прогресса"]}, "tpl-posture": {"price": 1990, "trailer": "1:10", "long": "Шесть недель по две тренировки. Работаем со спиной, задними дельтами и грудью, учимся включать лопатки и снимаем лишнюю нагрузку с шеи. Подходит после долгого сидения за столом.", "titles": ["Грудной отдел: мобилизация", "Спина и задние дельты", "Лопатки: контроль", "Тяги и разведения", "Плечи без напряжения шеи", "Грудь и спина: баланс", "Осанка: объём", "Тяги на петлях", "Задние дельты и ротаторы", "Верх тела: плотный круг", "Осанка: закрепление", "Финал: верх тела"]}, "tpl-core20": {"price": 1490, "trailer": "0:55", "long": "Четыре недели по три коротких тренировки, около 20 минут. Основа: планки, стабилизация и работа на пресс. Достаточно коврика, резинку или петли можно добавить по желанию. Легко вписывается в загруженный день.", "titles": ["Кор: основа", "Стабилизация", "Пресс и косые", "Планки: вариации", "Кор: баланс", "Пресс: объём", "Кор в движении", "Стабилизация: усложнение", "Пресс и поясница", "Кор: плотный круг", "Планки: максимум", "Финал: кор и пресс"]}, "tpl-soft-start": {"price": 1490, "trailer": "1:00", "long": "Четыре недели по три коротких тренировки. По два подхода, без прыжков и перегрузок. Цель программы не устать, а вернуть привычку заниматься и почувствовать, что тело снова слушается.", "titles": ["Первый шаг", "Мягкая мобилизация", "Основы движения", "Всё тело: лёгкий круг", "Ноги и спина", "Кор и баланс", "Всё тело: два подхода", "Ноги, тяги и жимы", "Мобилизация и сила", "Всё тело: уверенный темп", "Ноги и кор", "Финал: я в ритме"]}, "tpl-force-barbell": {"price": 3490, "trailer": "1:40", "long": "Четыре недели по три силовые тренировки. Основа: присед, жим, тяга и тяга в наклоне. Мало повторов, рабочие веса и длинный отдых. Нужна уверенная техника и страховка в зале.", "titles": ["Присед: техника", "Жим: техника", "Тяга: техника", "Присед и тяга", "Жим и тяга в наклоне", "Всё тело: база", "Тяжёлый присед", "Тяжёлый жим", "Тяжёлая тяга", "Силовой пик: присед и жим", "Силовой пик: тяга", "Финал: проверка рабочих весов"]}, "tpl-split-gym": {"price": 3990, "trailer": "1:25", "long": "Три недели по четыре тренировки: два дня на верх и два на низ. Каждая неделя добавляет объём, на третьей выходим на пиковую нагрузку. Для тех, кто уже тренируется регулярно.", "titles": ["Верх A: грудь и спина", "Низ A: ноги и ягодицы", "Верх B: плечи и руки", "Низ B: задняя цепь", "Верх A: больше объёма", "Низ A: больше объёма", "Верх B: больше объёма", "Низ B: больше объёма", "Верх A: пик", "Низ A: пик", "Верх B: пик", "Низ B: пик"]}, "tpl-glutes-gym": {"price": 2990, "trailer": "1:15", "long": "Шесть недель по две тренировки. Мостик со штангой, тяги и тренажёры на ягодицы и заднюю поверхность бедра. Рабочий вес растёт постепенно от недели к неделе.", "titles": ["Ягодицы: активация и техника", "Задняя цепь: тяги", "Мостик со штангой", "Ягодицы и тренажёры", "Выпады и жим ногами", "Ягодицы: объём", "Румынская тяга", "Ягодицы: плотный круг", "Мостик: рабочие веса", "Ягодицы и задняя поверхность", "Ягодицы: пик", "Финал: ягодицы и ноги"]}, "tpl-relief-home": {"price": 2490, "trailer": "1:10", "long": "Четыре недели по три тренировки в круговом формате: больше повторов и короткий отдых. Подойдут гантели, резинка или петли, а часть упражнений можно делать без инвентаря. Плотный темп для тех, у кого мало времени.", "titles": ["Круг: всё тело", "Ноги и кор: круг", "Верх тела: круг", "Всё тело: 40 на 20", "Ноги: плотный темп", "Верх и пресс", "Всё тело: больше повторов", "Ноги и ягодицы: круг", "Спина, плечи и кор", "Всё тело: короткий отдых", "Ноги: финишер", "Финал: всё тело"]}, "tpl-gentle": {"price": 2490, "trailer": "1:05", "long": "Четыре недели по три щадящие тренировки. Без прыжков и тяжёлых осевых нагрузок, каждая начинается с мобилизации. Упражнения подобраны с учётом чувствительных коленей и спины. Это ориентир, а не медицинская рекомендация.", "titles": ["Мобилизация и дыхание", "Ноги без нагрузки на колени", "Спина: стабилизация", "Всё тело: бережно", "Ягодицы и кор", "Тяги без нагрузки на позвоночник", "Всё тело: объём", "Ноги: контролируемые движения", "Спина и плечи", "Всё тело: уверенный темп", "Ягодицы и мобилизация", "Финал: всё тело бережно"]}};
 function cyc(a,n){var o=[];for(var i=0;i<n;i++)o.push(a[i%a.length]);return o}
 function cloneW(w,k){var q;try{q=JSON.parse(JSON.stringify(w))}catch(e){return null}q.id=uid();q.done=false;(q.ex||[]).forEach(function(e){e.u=uid()});return q}
 function templates(profile){
  ensure();var res=[],pf=profile&&typeof profile==="object"?profile:null;
  TPL.forEach(function(d){
   try{
    var eq={};d.eqs.forEach(function(k){eq[k]=1});
    var cau=(d.cau||[]).concat(pf&&typeof RX!=="undefined"?RX.cauOf(pf):[]),soft=!!SOFT[d.style],knees=hasRe(cau,/колен/),back=hasRe(cau,/спин|поясниц/);
    function mkc(types){return mkCtx({types:types,goal:d.style,soft:soft,noJump:soft||knees||back,eq:eq,maxLvl:d.maxLvl||d.lvl,mins:d.mins,count:countFor(d.mins,d.lvl),
     lvl:d.lvl,strict:true,cautious:knees||back,knees:knees,prof:pf||{},softSets:2})}
    var X=TPX[d.id]||{},w=null;
    try{w=buildWorkouts(mkc(cyc(d.types,12)))}catch(e){w=null}
    if(!w||w.length<12){var w0=buildWorkouts(mkc(d.types));if(!w0||!w0.length)return;w=[];for(var i=0;i<12;i++){var c=cloneW(w0[i%w0.length]);if(c)w.push(c)}}
    w=w.slice(0,12);
    if(X.titles)w.forEach(function(x,i){if(X.titles[i]){x.name=X.titles[i]}});
    res.push({id:d.id,name:d.name,desc:d.desc,pitch:PITCH[d.id]||"",gets:GETS[d.goal]||GETS.start,long:X.long||"",price:X.price||0,trailer:X.trailer||"",titles:(X.titles||[]).slice(),weeks:Math.round(12/d.perWeek),lvl:d.lvl,where:d.where,mins:d.mins,perWeek:d.perWeek,tags:d.tags.slice(),goal:d.goal,eqs:d.eqs.slice(),workouts:w});
   }catch(e){}
  });
  return res}

 /* ---------- утилиты ---------- */
 function copyProgram(p){
  if(!p)return null;var q;try{q=JSON.parse(JSON.stringify(p))}catch(e){return null}
  q.id=uid();
  (Array.isArray(q.workouts)?q.workouts:[]).forEach(function(w){
   w.id=uid();w.done=false;
   (Array.isArray(w.ex)?w.ex:[]).forEach(function(e){e.u=uid();(Array.isArray(e.sets)?e.sets:[]).forEach(function(s){if(s&&typeof s==="object")delete s.done})})});
  return q}
 function estSec(w){
  var s=180;
  (w&&Array.isArray(w.ex)?w.ex:[]).forEach(function(e){
   (e&&Array.isArray(e.sets)?e.sets:[]).forEach(function(st){
    var work=40;if(e.mode==="time"&&st&&+st.t>0)work=Math.min(+st.t*Math.max(1,+st.v||1),300);
    var r=st&&st.rest!=null&&st.rest!==""&&isFinite(+st.rest)?+st.rest:60;s+=work+r})});
  return s}
 function estMin(w){if(!w)return 0;return Math.max(5,Math.round(estSec(w)/300)*5)}
 function stats(w){
  var ex=w&&Array.isArray(w.ex)?w.ex:[],sets=0;
  ex.forEach(function(e){sets+=e&&Array.isArray(e.sets)?e.sets.length:0});
  return {ex:ex.length,sets:sets,min:w?estMin(w):0}}

 return {mkEx:mkEx,defaults:defaults,starter:starter,templates:templates,copyProgram:copyProgram,estMin:estMin,stats:stats,setCat:setCat,
  cat:function(){ensure();return CAT}};
})();
/*GEN_END*/

(function(){
"use strict";
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
function ic(n){return '<svg class="i"><use href="#'+n+'"/></svg>'}
var hl=null;function hlEl(){if(hl)return hl;try{hl=document.createElement("label");hl.setAttribute("aria-hidden","true");hl.style.cssText="position:fixed;left:-9999px;top:0;opacity:0;pointer-events:none";hl.innerHTML='<input type="checkbox" switch tabindex="-1">';document.body.appendChild(hl)}catch(e){}return hl}
function buzz(p){try{if(navigator.vibrate){navigator.vibrate(p);return}}catch(e){}
  var a=[].concat(p),t=0;a.forEach(function(v,i){if(i%2===0)setTimeout(function(){try{hlEl().click()}catch(e){}},t);t+=v})}
function uid(){return Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-3)}
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function clone(o){return JSON.parse(JSON.stringify(o))}
function plural(n,f){var m=n%10,k=n%100;return n+" "+(m===1&&k!==11?f[0]:(m>=2&&m<=4&&(k<10||k>=20)?f[1]:f[2]))}
function nz(v,d){v=+v;return isFinite(v)?v:d}
function fmt(s){s=Math.max(0,Math.floor(s||0));var h=Math.floor(s/3600),m=Math.floor(s%3600/60);s=s%60;return (h?h+":"+("0"+m).slice(-2):("0"+m).slice(-2))+":"+("0"+s).slice(-2)}
function f1(n){return (Math.round(n*10)/10).toString().replace(".",",")}
function kgTxt(v){return String(v).replace(".",",")}
function ini(n){var w=String(n||"").trim().split(/\s+/).filter(Boolean);return ((w[0]||"?").charAt(0)+(w[1]?w[1].charAt(0):"")).toUpperCase()}
function daysBetween(a,b){var p=a.split("-"),q=b.split("-");return Math.round((Date.UTC(+q[0],+q[1]-1,+q[2])-Date.UTC(+p[0],+p[1]-1,+p[2]))/864e5)}
function agoTxt(d){var n=daysBetween(d,todayIso());return n<=0?"сегодня":n===1?"вчера":plural(n,["день","дня","дней"])+" назад"}
var app=$("#app"),tt=null,HASP=false;try{HASP=parent!==window}catch(e){}
var EMB=window.name==="forma-emb"||(!HASP&&window.innerWidth<=480);if(EMB)document.documentElement.classList.add("emb");
function send(m){m.f="forma";m.from="work";try{if(HASP)parent.postMessage(m,"*")}catch(e){}}
function toast(t,act,fn){var e=$("#toast");e.innerHTML="";var s=document.createElement("span");s.textContent=t;e.appendChild(s);e.classList.toggle("act",!!act);
 if(act){var b=document.createElement("button");b.className="tact";b.textContent=act;b.onclick=function(){e.classList.remove("on");fn&&fn()};e.appendChild(b)}
 e.classList.add("on");clearTimeout(tt);tt=setTimeout(function(){e.classList.remove("on")},act?4800:2400)}
function pls(el,col){try{pulseAt(el,col)}catch(e){}}

/* ---------- каталог упражнений (parent.FCAT / window.FCAT) ---------- */
var ZN={shoulders:"Плечи",chest:"Грудь",arms:"Руки",forearms:"Предплечья",core:"Пресс",quads:"Бёдра",calves:"Икры",traps:"Трапеции",back:"Спина",lowback:"Поясница",glutes:"Ягодицы",hamstrings:"Бёдра сзади"};
var EQN={trx:"TRX",dumbbell:"Гантели",barbell:"Штанга",machine:"Тренажёры",band:"Резинка",body:"Свой вес",kettlebell:"Гиря",cable:"Кроссовер",other:"Прочий инвентарь",cond:"Кондиция и плиометрика",mob:"Мобильность",land:"Лэндмайн"};
var EQORD=["trx","body","dumbbell","barbell","machine","cable","kettlebell","band","land","other","cond","mob"];
var MUSC=[["Мышцы груди","Грудь"],["Мышцы спины","Спина"],["Плечи","Плечи"],["Бицепс","Бицепс"],["Трицепс","Трицепс"],["Предплечье","Предплечье"],["Мышцы кора","Кор"],["Ягодицы","Ягодицы"],["Передняя поверхность бедра","Бедро спереди"],["Задняя поверхность бедра","Бедро сзади"],["Мышцы голени","Голень"]];
var MSH={};MUSC.forEach(function(r){MSH[r[0]]=r[1]});
var STD={shoulders:"Плечи",chest:"Мышцы груди",forearms:"Предплечье",core:"Мышцы кора",quads:"Передняя поверхность бедра",calves:"Мышцы голени",traps:"Мышцы спины",back:"Мышцы спины",lowback:"Мышцы спины",glutes:"Ягодицы",hamstrings:"Задняя поверхность бедра"};
var M2Z={"Ягодицы":"glutes","Передняя поверхность бедра":"quads","Задняя поверхность бедра":"hamstrings","Мышцы голени":"calves","Бицепс":"arms","Трицепс":"arms","Предплечье":"forearms","Плечи":"shoulders","Мышцы груди":"chest","Мышцы спины":"back","Мышцы кора":"core"};
var LV=["","лёгкое","среднее","сложное"];
var FOCUS={glutes:"Держите таз ровно и чувствуйте работу в ягодицах, а не в пояснице.",hamstrings:"Спина нейтральная, движение идёт от таза. Колени чуть мягкие.",quads:"Колени по линии носков, вес на всей стопе.",back:"Сначала сводите лопатки, потом сгибайте руки.",chest:"Лопатки сведены и опущены, плечи не поднимаются к ушам.",shoulders:"Локти чуть ниже плеч, без рывков и раскачки корпуса.",arms:"Локти неподвижны, работает только сустав, который нужен.",core:"Рёбра опущены, поясница не прогибается. Дышите ровно.",calves:"Полная амплитуда: вверх до упора, вниз с растяжением.",traps:"Поднимайте плечи вертикально, без вращения.",lowback:"Двигайтесь плавно, без прогиба в верхней точке.",forearms:"Хват уверенный, запястья не заваливаются."};
var FIELDS=[{k:"n",main:1},{k:"en",main:1},{k:"m",main:1},{k:"c"},{k:"inv"},{k:"sy"},{k:"pat"}];
var CATSRC=null,catLen=-1,EX=[],EXM={},EQP=[],EQC={},IX=null,IXP=null,STUBS={};
function readCat(){var c=null;try{if(HASP&&parent.FCAT)c=parent.FCAT}catch(e){}if(!c&&window.FCAT)c=window.FCAT;return Array.isArray(c)?c:[]}
function buildCat(){var c=readCat();if(c===CATSRC&&c.length===catLen)return false;CATSRC=c;catLen=c.length;IX=null;IXP=null;RK=null;EX=[];EXM={};EQC={};var seen={};
 c.forEach(function(r){if(!r||r.id==null)return;var e={},k;for(k in r)e[k]=r[k];
  var z=(r.z&&ZN[r.z])?r.z:(M2Z[r.m]||"core"),zs=[];
  if(Array.isArray(r.zs))zs=r.zs.filter(function(q){return ZN[q]&&q!==z});
  else if(Array.isArray(r.pc))r.pc.slice(1,3).forEach(function(q){var zz=q&&M2Z[q[0]];if(zz&&zz!==z&&zs.indexOf(zz)<0)zs.push(zz)});
  e.id=r.id;e.n=String(r.n||r.id);e.p=z;e.s=zs;e.eq=r.eq||"body";e.l=+r.lvl>=1&&+r.lvl<=3?+r.lvl:1;e.r=String(r.rng==null?"":r.rng);e.cue=String(r.tech||"");e.err=String(r.err||"");
  EX.push(e);EXM[e.id]=e;seen[e.eq]=1;EQC[e.eq]=(EQC[e.eq]||0)+1});
 EQP=EQORD.filter(function(k){return seen[k]});Object.keys(seen).forEach(function(k){if(EQP.indexOf(k)<0)EQP.push(k)});return true}
/* индекс поиска строим кусками в простое: ~1000 строк за один заход блокируют главный поток на 100+ мс */
function ixGet(){if(IX)return IX;var a=IXP?IXP.a:[],i=a.length;if(i<EX.length)a=a.concat(FZ.build(EX.slice(i),FIELDS));IXP=null;IX=a;return IX}
function ixWarm(){var src=EX;if(IX||!src.length)return;if(!IXP||IXP.src!==src)IXP={src:src,a:[]};
 var step=function(){if(IX||EX!==src)return;var a=IXP.a,i=a.length;if(i>=src.length){IX=a;IXP=null;return}
  IXP.a=a.concat(FZ.build(src.slice(i,i+45),FIELDS));idle(step)};idle(step)}
function idle(f){if(window.requestIdleCallback)requestIdleCallback(f,{timeout:1500});else setTimeout(f,40)}
function exOf(id){var e=EXM[id];if(e)return e;return STUBS[id]||(STUBS[id]={id:id,n:"Упражнение не найдено в каталоге",p:"core",s:[],eq:"other",l:1,r:"",cue:"",err:"",stub:1})}
function eqName(k){return EQN[k]||k||""}
function sexNow(){var p=FS.get("profile")||{};return p.sex==="m"?"m":"f"}

/* ---------- нагрузка по группам ---------- */
function armG(e){return e.p==="arms"?(/Сгиб|curl/i.test(e.n)?"Бицепс":"Трицепс"):((e.p==="back"||e.p==="traps"||e.p==="lowback")?"Бицепс":"Трицепс")}
function grp(z,e){return z==="arms"?armG(e):(STD[z]||"")}
function mainG(e){return e.m||grp(e.p,e)}
function exShare(e){var o={},t=0;if(e.stub)return o;
 if(Array.isArray(e.pc)){e.pc.forEach(function(r){if(r&&r[0]&&+r[1]>0){o[r[0]]=(o[r[0]]||0)+(+r[1]);t+=+r[1]}});if(t>0){Object.keys(o).forEach(function(g){o[g]=o[g]/t*100});return o}}
 var z=[e.p].concat((e.s||[]).slice(0,2)),w=z.length===1?[100]:z.length===2?[70,30]:[55,30,15];o={};
 z.forEach(function(k,i){var g=grp(k,e);if(g)o[g]=(o[g]||0)+w[i]});return o}
function loadStd(exs){var T={},tot=0;exs.forEach(function(x){var e=exOf(x.id),n=x.sets.length,sh=exShare(e);Object.keys(sh).forEach(function(g){T[g]=(T[g]||0)+sh[g]*n;tot+=sh[g]*n})});
 if(!tot)return [];return Object.keys(T).map(function(g){return [g,T[g]/tot*100]}).sort(function(a,b){return b[1]-a[1]})}
function barsHtml(a){if(!a.length)return '<span class="small">Добавьте упражнения, и здесь появится нагрузка по группам мышц</span>';return a.slice(0,4).map(function(r){var p=Math.round(r[1]);return '<div class="lb" data-g="'+esc(r[0])+'"><span class="ln">'+esc(r[0])+'</span><span class="lp">'+p+'%</span><span class="lt"><i data-w="'+p+'"></i></span></div>'}).join("")}
/* обновление полос на месте: полосы плавно меняют ширину, а не пересоздаются при каждом вводе */
function setBars(host,a){var rows=a.slice(0,4),cur=$$(".lb",host);
 if(rows.length&&cur.length===rows.length&&cur.every(function(el,i){return el.dataset.g===rows[i][0]})){rows.forEach(function(r,i){var p=Math.round(r[1]);cur[i].querySelector(".lp").textContent=p+"%";cur[i].querySelector(".lt i").style.width=p+"%"});return}
 host.innerHTML=barsHtml(a);animBars(host)}
function animBars(root){requestAnimationFrame(function(){requestAnimationFrame(function(){$$(".lt i",root).forEach(function(i){i.style.width=i.dataset.w+"%"})})})}
function loadOf(exs){var L={};exs.forEach(function(x){var e=exOf(x.id),n=x.sets.length;if(e.stub)return;L[e.p]=(L[e.p]||0)+n;(e.s||[]).forEach(function(z){L[z]=(L[z]||0)+n*.5})});Object.keys(L).forEach(function(z){L[z]=Math.min(1,L[z]/10)});return L}
function estMin(ex){return ex&&ex.length?GEN.estMin({ex:ex}):0}
function exSum(x){var n=x.sets.length,k=x.mode==="time"?"t":"v",f=x.sets[0]||{},same=x.sets.every(function(t){return t[k]===f[k]&&t.v===f.v});
  var body=same?n+" × "+(x.mode==="time"?(f.v>1?f.v+" × ":"")+f.t+" с":f.v):plural(n,["подход","подхода","подходов"]);
  return body+" · отдых "+(f.rest==null||f.rest===""?60:f.rest)+" с"}

/* ---------- данные: программы ---------- */
/* поля подходов: без отрицательных и абсурдных значений (повторы ≤999, кг ≤1000, секунды и отдых ≤3600) */
function capNum(t){var k=t.dataset.k,mx=k==="w"?1000:(k==="rest"||k==="t")?3600:999,s=t.value;if(s==="")return "";var n=+s;if(!isFinite(n))return "";if(n<0){n=0;t.value="0"}else if(n>mx){n=mx;t.value=String(mx)}return n}
function numOr(v,d){return v===""||v==null?d:(isFinite(+v)?+v:d)}
function normD(d){if(!d||typeof d!=="object"||!Array.isArray(d.programs))return {programs:[]};
 d.programs=d.programs.filter(function(p){return p&&typeof p==="object"});
 d.programs.forEach(function(p){if(!p.id)p.id=uid();p.name=String(p.name||"Программа");if(p.desc==null)p.desc="";if(!Array.isArray(p.workouts))p.workouts=[];
  p.workouts=p.workouts.filter(function(w){return w&&typeof w==="object"});
  p.workouts.forEach(function(w){if(!w.id)w.id=uid();w.name=String(w.name||"Тренировка");if(w.desc==null)w.desc="";if(w.tnote==null)w.tnote="";if(!Array.isArray(w.ex))w.ex=[];
   w.ex=w.ex.filter(function(x){return x&&typeof x==="object"&&x.id!=null});
   w.ex.forEach(function(x){if(!x.u)x.u=uid();x.mode=x.mode==="time"?"time":"kg";x.note=x.note==null?"":String(x.note);x.link=!!x.link;
    if(!Array.isArray(x.sets))x.sets=[];x.sets=x.sets.filter(function(s){return s&&typeof s==="object"});
    if(!x.sets.length)x.sets=[{v:10,w:"",t:30,rest:60}];
    x.sets.forEach(function(s){s.v=numOr(s.v,10);if(s.w==null)s.w="";s.t=numOr(s.t,30);s.rest=numOr(s.rest,60)})})})});
 return d}
function readD(){return normD(FS.get("progs"))}
var D=readD(),lastJ={},svT=0,conT=0;D.programs.forEach(function(p){p.open=false});
function hk(w){return w.key||w.id}
function findP(id){return D.programs.filter(function(p){return p.id===id})[0]}
function findW(p,id){return p&&p.workouts.filter(function(w){return w.id===id})[0]}
function progOf(w){return D.programs.filter(function(p){return p.workouts.indexOf(w)>-1})[0]}
function sameW(h,p,w){if(h.wid)return h.wid===w.id;return (h.k===hk(w)||h.wn===w.name)&&(!h.pn||!p||h.pn===p.name)}
function weekFrom(){return weekStartOf(todayIso())}
function isDone(p,w){var ws=weekFrom();for(var i=HIST.length-1;i>=0;i--){var h=HIST[i];if(h.d<ws)continue;if(sameW(h,p,w))return true}return false}
function cleanHist(){if(!Array.isArray(HIST))HIST=[];HIST=HIST.filter(function(h){return h&&typeof h==="object"&&/^\d{4}-\d\d-\d\d$/.test(String(h.d))})}
cleanHist();
function xaCnt(keys){var set={};keys.forEach(function(k){set[String(k)]=1});return HIST.filter(function(h){return h&&set[String(h.k)]}).length}
function xaMove(keys){var set={};keys.forEach(function(k){set[String(k)]=1});var a=FS.get("xarch");a=Array.isArray(a)?a:[];var keep=[];HIST.forEach(function(h){if(h&&set[String(h.k)])a.push(h);else keep.push(h)});HIST=keep;FS.set("hist",HIST);FS.set("xarch",a)}
function lastFor(p,w,before){for(var i=HIST.length-1;i>=0;i--){var h=HIST[i];if((!before||h.d<before)&&sameW(h,p,w))return h}return null}
function lastW(p,w){return lastFor(p,w,todayIso())}
function lwOf(p,w,id){var h=lastW(p,w);if(!h||!Array.isArray(h.ex))return null;var e=h.ex.filter(function(x){return x.id===id})[0];return e&&Array.isArray(e.sets)&&e.sets.length?{h:h,e:e}:null}
function effTxt(e){return e.eff?" · усилие "+e.eff:""}
function syncDone(){D.programs.forEach(function(p){p.workouts.forEach(function(w){w.done=isDone(p,w)})})}
function applyCon(){if(!con)return;con.w.name=con.cw.name||con.w.name;con.w.ex=clone(con.cw.ex);con.w.tnote=con.cw.tn||""}
function saveNow(){clearTimeout(svT);svT=0;if(conT){clearTimeout(conT);conT=0;applyCon()}syncDone();lastJ.progs=JSON.stringify(D);FS.set("progs",D)}
function save(){clearTimeout(svT);svT=setTimeout(saveNow,250)}
function sysProg(){var p=D.programs.filter(function(x){return x.name==="Мои тренировки"})[0];if(!p){p={id:uid(),name:"Мои тренировки",desc:"Тренировки, которые вы собрали сами",open:true,workouts:[]};D.programs.push(p)}return p}

/* ---------- сегменты: initSeg / swapPane из common.js (единый стандарт v7) ---------- */
/* ---------- листы и окна ---------- */
function syncScrim(){var on=$$(".sheet.on,.win.on").length>0;$("#scrim").classList.toggle("on",on)}
function openSheet(id){$$(".sheet.on").forEach(function(s){if(s.id!==id)s.classList.remove("on")});$("#"+id).classList.add("on");syncScrim();buzz(8)}
function blurIn(el){try{var a=document.activeElement;if(a&&a!==document.body&&el.contains(a))a.blur()}catch(e){}}
function closeSheet(id){var e=$("#"+id);blurIn(e);e.classList.remove("on");syncScrim()}
function closeAll(){$$(".sheet.on,.win.on").forEach(function(s){blurIn(s);s.classList.remove("on")});syncScrim()}
/* закрыть самый верхний слой; итог тренировки закрывается только его кнопками */
var dlgDis=null;
function dismissTop(){if($("#sum.on"))return true;
 var w=$("#winInfo.on")||$(".win.on");if(w){closeSheet(w.id);return true}
 var d=$("#dlg.on");if(d){var f=dlgDis;dlgDis=null;closeSheet("dlg");if(f)f();return true}
 var sh=$(".sheet.on");if(sh){closeSheet(sh.id);return true}
 return false}
$("#scrim").onclick=function(){dismissTop()};
function dlgForm(o){var h='<div class="grab"></div><h3>'+o.title+'</h3>'+(o.sub?'<p class="sub">'+o.sub+'</p>':'');
 o.fields.forEach(function(f){h+='<input class="fld" data-k="'+f.k+'" placeholder="'+f.ph+'" value="'+esc(f.val||"")+'" maxlength="'+(f.max||48)+'" autocomplete="off">'});
 h+='<button class="cta" id="dOk">'+o.ok+'</button>';
 var d=$("#dlg");d.innerHTML=h;var ok=$("#dOk"),fl=$$(".fld",d);
 function chk(){ok.disabled=!fl[0].value.trim()}chk();
 function go(){if(ok.disabled)return;ok.disabled=true;var v={};fl.forEach(function(f){v[f.dataset.k]=f.value.trim()});closeSheet("dlg");o.fn(v)}
 fl.forEach(function(f){f.oninput=chk;f.onkeydown=function(e){if(e.key==="Enter")go()}});ok.onclick=go;dlgDis=null;openSheet("dlg");try{fl[0].focus({preventScroll:true})}catch(e){}setTimeout(function(){if(document.activeElement!==fl[0]&&$("#dlg.on"))fl[0].focus()},450)}
function dlgConfirm(o){var d=$("#dlg");d.innerHTML='<div class="grab"></div><h3>'+o.title+'</h3>'+(o.sub?'<p class="sub">'+o.sub+'</p>':'')+'<button class="cta '+(o.danger?"d":"")+'" id="dY">'+o.ok+'</button><button class="cta l" id="dN">'+(o.no||"Оставить")+'</button>';
 var once=false;$("#dY").onclick=function(){if(once)return;once=true;dlgDis=null;closeSheet("dlg");o.fn()};$("#dN").onclick=function(){if(once)return;once=true;dlgDis=null;closeSheet("dlg");o.nofn&&o.nofn()};dlgDis=o.dis||null;openSheet("dlg")}
function menu(items){var m=$("#menu");m.innerHTML='<div class="grab"></div>'+items.map(function(it,i){return '<button class="mi'+(it.dn?" dn":"")+'" data-i="'+i+'">'+ic(it.ic)+it.t+'</button>'}).join("");
 var used=false;$$(".mi",m).forEach(function(b){b.onclick=function(){if(used)return;used=true;closeSheet("menu");setTimeout(items[+b.dataset.i].fn,260)}});openSheet("menu")}

/* ---------- силуэты ---------- */
var OUT="M150,92 C146,94 140,96 136,99 C124,102 108,104 98,112 C90,118 88,132 87,148 C86,168 84,190 82,208 C80,228 76,248 72,266 C70,274 68,282 67,290 C70,296 78,296 81,290 C84,278 88,262 92,246 C96,230 99,214 102,200 C105,184 108,168 111,152 C113,170 117,192 119,214 C120,236 112,258 106,282 C101,304 100,326 103,350 C106,384 110,414 112,440 C112,462 108,486 108,508 C108,540 114,566 116,586 C116,594 114,602 112,608 C120,612 134,612 134,606 C134,596 134,588 134,580 C136,556 140,528 140,500 C142,476 142,458 142,440 C144,410 148,380 150,344";
var NECK="M141,76 C141,84 140,92 137,99";
var ZP={
 shoulders:"M99,113 C92,120 88,134 87,148 C94,158 104,158 111,152 C113,136 112,124 116,116 C110,110 104,110 99,113 Z",
 chest:"M118,118 C128,108 142,108 150,112 L150,158 C138,166 124,162 116,152 C114,140 114,128 118,118 Z",
 arms:"M87,150 C94,160 104,160 111,154 C109,168 106,184 102,200 C94,202 86,206 82,208 C84,190 86,170 87,150 Z",
 forearms:"M82,211 C86,207 94,205 102,203 C99,217 96,231 92,247 C86,251 79,257 73,267 C77,249 80,231 82,211 Z",
 core:"M120,168 L150,168 L150,236 C136,240 126,238 120,230 C118,206 118,188 120,168 Z",
 quads:"M102,338 C118,332 136,340 150,352 C148,382 144,412 142,438 C132,445 120,445 112,438 C110,412 106,384 102,338 Z",
 calves:"M110,456 C122,452 134,454 141,458 C141,478 140,498 139,514 C133,538 129,558 125,572 C118,560 112,532 109,506 C108,490 109,472 110,456 Z",
 traps:"M150,92 C142,96 136,99 134,100 C122,104 112,108 104,114 C112,127 134,137 150,148 Z",
 back:"M112,134 C122,140 138,148 150,152 L150,205 C140,209 128,209 120,205 C116,190 112,170 111,152 C111,146 111,140 112,134 Z",
 lowback:"M121,209 C132,213 142,215 150,215 L150,246 C138,248 128,246 121,240 C119,230 120,218 121,209 Z",
 glutes:"M108,288 C120,280 138,284 150,292 L150,348 C138,358 120,356 110,346 C105,330 105,306 108,288 Z",
 hamstrings:"M104,358 C120,362 138,362 150,358 C148,386 144,414 142,438 C132,445 120,445 112,438 C110,414 106,386 104,358 Z"};
var DET={
 front:["M150,110 C140,108 128,110 118,116","M121,147 C130,157 142,159 150,155","M150,114 L150,238","M138,176 L150,176","M137,194 L150,194","M137,212 L150,212","M139,228 L150,228","M138,172 C136,190 136,214 139,232","M121,178 C120,198 120,214 123,232","M99,118 C100,132 104,144 111,152","M96,163 C99,177 98,191 94,203","M126,350 C129,380 129,410 127,436","M112,362 C116,392 118,418 118,436","M118,437 C126,443 136,443 143,437","M123,462 C127,490 127,520 124,558"],
 back:["M150,100 L150,246","M150,100 C140,112 130,124 118,128","M127,138 C119,150 119,166 128,182","M114,172 C118,196 124,210 131,214","M150,292 L150,350","M108,348 C120,358 138,358 150,350","M126,362 C128,392 128,418 127,436","M99,118 C100,132 104,144 111,152","M96,163 C99,177 98,191 94,203","M123,462 C127,490 127,520 124,558"]};
var ZV={front:["shoulders","chest","arms","forearms","core","quads","calves"],back:["traps","shoulders","back","lowback","arms","forearms","glutes","hamstrings","calves"]};
var BACKZ={traps:1,back:1,lowback:1,glutes:1,hamstrings:1};
var WT={m:[[90,1.05],[150,1.09],[230,1.0],[300,.98],[450,1.0],[620,1.0]],f:[[90,.9],[130,.87],[150,.87],[190,.8],[230,.74],[270,.92],[320,1.1],[360,1.14],[450,.97],[540,.9],[620,.88]]};
function wf(y,g){var t=WT[g],i=0;if(y<=t[0][0])return t[0][1];for(i=0;i<t.length-1;i++){if(y<=t[i+1][0]){var k=(y-t[i][0])/(t[i+1][0]-t[i][0]);return t[i][1]+(t[i+1][1]-t[i][1])*k}}return t[t.length-1][1]}
var PT=/(-?\d+\.?\d*),(-?\d+\.?\d*)/g;
function tx(x,y,g){return (150-(150-x)*wf(y,g)).toFixed(1)+","+y}
function ax(x,y,g){if(g==="m")return tx(x,y,"m");var tip=150-52*wf(112,"f");return (tip+.82*(x-98)).toFixed(1)+","+(112+.9*(y-112)).toFixed(1)}
function warp(d,g,arm){return d.replace(PT,function(m,x,y){return arm?ax(+x,+y,g):tx(+x,+y,g)})}
function warpOut(d,g){var p=d.split(" C"),o=[warp(p[0],g,false)];for(var i=1;i<p.length;i++)o.push(warp(p[i],g,i>=3&&i<=10));return o.join(" C")}
var WC={};
function wpaths(g){if(WC[g])return WC[g];var o={OUT:warpOut(OUT,g),NECK:warp(NECK,g),Z:{},D:{}};Object.keys(ZP).forEach(function(z){o.Z[z]=warp(ZP[z],g,z==="arms"||z==="forearms")});["front","back"].forEach(function(k){o.D[k]=DET[k].map(function(d){return warp(d,g,d.indexOf("M96,163")===0)})});return WC[g]=o}
function figSvg(side,g,cls){var P=wpaths(g),z=ZV[side];
 var halves=["L","R"].map(function(h){var t=h==="R"?' transform="translate(300 0) scale(-1 1)"':"";
  var zs=z.map(function(k){return '<path class="zn base" data-z="'+k+'" d="'+P.Z[k]+'"/><path class="zn hatch" data-z="'+k+'" d="'+P.Z[k]+'"/>'}).join("");
  return '<g'+t+'><path class="bodyfill" d="'+P.OUT+' L150,92 Z"/>'+zs+'<g filter="url(#rough)"><path class="pencil soft" d="'+P.OUT+'" transform="translate(1.4 .9)"/><path class="pencil draw" pathLength="1" d="'+P.OUT+'"/><path class="pencil draw" pathLength="1" d="'+P.NECK+'"/></g><g class="det" filter="url(#rough)">'+P.D[side].map(function(d){return '<path class="pencil draw" pathLength="1" d="'+d+'"/>'}).join("")+'</g></g>'}).join("");
 var hr=g==="f"?'rx="17" ry="22" cy="54"':'rx="20" ry="25"';
 return '<svg class="'+(cls||"")+'" data-g="'+g+'" viewBox="50 0 200 626" preserveAspectRatio="xMidYMid meet" aria-hidden="true">'+halves+'<g filter="url(#rough)"><ellipse class="pencil draw" pathLength="1" cx="150" '+(g==="f"?"":'cy="52" ')+hr+'/>'+(g==="f"?'<path class="pencil draw" pathLength="1" d="M131,50 C127,30 146,23 161,28 C173,34 173,58 168,74"/><path class="pencil draw" pathLength="1" d="M131,52 C128,64 130,76 135,84"/>':'<path class="pencil draw" pathLength="1" d="M131,47 C130,32 141,26 152,26 C164,26 170,35 169,46"/>')+'</g></svg>'}

function paintMap(root,L){$$(".zn",root).forEach(function(el){var l=L[el.dataset.z]||0;
  if(el.classList.contains("base")){el.style.fillOpacity=l?(.1+.3*l):0;el.style.stroke=l?"#E0572F":"";el.style.strokeOpacity=l?(.5+.4*l):""}
  else el.style.opacity=l?(.3+.7*l):0})}

function replay(root){root.classList.remove("figon");void root.offsetWidth;root.classList.add("figon")}
var con=null,lv=null,openSet={},subTab=0,fresh=null;

/* ---------- вкладка «Мои» ---------- */
var scList=$("#scList");
function flagTxt(exs){var c=flagCount(exs),h="";if(c[1])h+='<i class="rxt r2">не рекомендуется: '+c[1]+"</i>";if(c[0])h+=(h?" · ":"")+'<i class="rxt r1">осторожно: '+c[0]+"</i>";return h?'<span class="rxm">'+h+"</span>":""}
function wtHtml(p,w,isF){var n=w.ex.length,dn=isDone(p,w),wi=p.workouts.indexOf(w)+1,wc=p.workouts.length;
 return '<div class="wt'+(isF?" rise":"")+'" data-w="'+esc(w.id)+'"><button class="wmain" data-wo><em class="wno">'+wi+'/'+wc+'</em><b>'+esc(w.name)+'</b>'+(w.desc?'<span class="d">'+esc(w.desc)+'</span>':'')+'<span class="m">'+(n?plural(n,["упражнение","упражнения","упражнений"])+" · ~"+estMin(w.ex)+" мин"+flagTxt(w.ex):"Пока пусто · добавьте упражнения")+'</span></button><span class="chk'+(dn&&fresh!==w.id?" on":"")+'" data-chk><svg viewBox="0 0 28 28"><circle cx="14" cy="14" r="12" pathLength="1"/></svg><i>'+ic("check")+'</i></span><button class="dots" data-wm aria-label="Действия с тренировкой">'+ic("dots")+'</button></div>'}
function progName(p){var n=String(p.name||"");return /в неделю/i.test(p.desc||"")?n.replace(/\s*·\s*\d+\s+(?:день|дня|дней|раз|раза)\s+в\s+неделю\s*$/i,"")||n:n}
function progHtml(p){var n=p.workouts.length,d=p.workouts.filter(function(w){return isDone(p,w)}).length;
 return '<div class="prog'+(p.open?" open":"")+'" data-p="'+esc(p.id)+'"><div class="ph"><button class="pt" data-pt aria-expanded="'+!!p.open+'"><em class="plb">программа</em><b>'+esc(progName(p))+'</b>'+(p.desc?'<span class="d">'+esc(p.desc)+'</span>':'')+(n?'':'<span class="m">Добавьте первую тренировку</span>')+'</button><button class="dots" data-pm aria-label="Действия с программой">'+ic("dots")+'</button></div>'+
 '<div class="acc"><div><div class="wl">'+p.workouts.map(function(w){return wtHtml(p,w,fresh===w.id)}).join("")+'<button class="addw" data-aw><span class="pl">'+ic("plus")+'</span>Тренировка</button></div></div></div></div>'}
function savedLive(){var s=FS.get("live");return s&&typeof s==="object"&&Array.isArray(s.ex)&&s.ex.length&&+s.t0>0?s:null}
function liveSec(s,now){now=now||Date.now();return Math.max(0,Math.floor(((s.paused?(+s.pAt||now):now)-s.t0-(+s.pSum||0))/1000))}
function liveCnt(s){var d=0,t=0;s.ex.forEach(function(x){(x.sets||[]).forEach(function(q){t++;if(q.done)d++})});return [d,t]}
function resumeHtml(s){var c=liveCnt(s);
 return '<div class="rsm rise"><div class="rh"><i></i>Тренировка не завершена</div><b>'+esc(s.name||"Тренировка")+'</b><p>Отмечено '+c[0]+' из '+c[1]+' · прошло '+fmt(liveSec(s,Math.max(+s.last||0,s.paused?+s.pAt||0:0)||Date.now()))+'</p><div class="rb2"><button class="cta go" data-a="resume">Продолжить</button><button class="cta l" data-a="dropLive">Завершить без сохранения</button></div></div>'}
function emptyHtml(){
 return '<div class="empty rise"><div class="big">'+ic("dumb")+'</div><b>Создайте первую тренировку</b><span>Соберите свою, возьмите готовую программу или мы подберём тренировки под вашу цель и оборудование.</span><div class="ecta"><button class="cta go" data-a="mine">'+ic("plus")+'Собрать самой</button><button class="cta" data-a="tpl">'+ic("book")+'Готовые программы</button><button class="cta" data-a="auto">'+ic("spark")+'Подобрать автоматически</button></div></div>'}
var rcnOpen=false;
function recentHtml(){var a=HIST.slice(-3).reverse();
 var h='<div class="rcn'+(rcnOpen?' open':'')+'"><button class="rch" data-rcn aria-expanded="'+rcnOpen+'"><span>Недавние тренировки</span>'+ic("down")+'</button><div class="acc"><div>';
 if(!a.length)return h+'<p class="rce">Здесь появятся проведённые тренировки: дата, длительность и выполнение. Завершите первую, и она запишется сюда.</p></div></div></div>';
 return h+a.map(function(e){return '<button class="rcr" data-hk="'+esc(e.k||"")+'" data-hw="'+esc(e.wid||"")+'"><span class="rt1"><b>'+esc(e.wn||"Тренировка")+'</b><small>'+dmy(e.d)+(e.sec>0?" · "+Math.max(1,Math.round(e.sec/60))+" мин":"")+(e.pct!=null?" · "+Math.round(nz(e.pct,0))+"%":"")+'</small></span>'+ic("chev")+'</button>'}).join("")+'</div></div></div>'}
scList.addEventListener("click",function(e){var b=e.target.closest("[data-rcn]");if(!b||subTab!==0)return;var r=b.closest(".rcn");rcnOpen=!rcnOpen;r.classList.toggle("open",rcnOpen);b.setAttribute("aria-expanded",rcnOpen);buzz(5);lastHtml=""});
var lastHtml="",firstPaint=true;
/* пишем в DOM только если разметка изменилась: клики и события из других экранов не перерисовывают список зря и не повторяют анимации появления */
function setList(h,force){if(!force&&h===lastHtml&&scList.firstChild)return false;lastHtml=h;scList.classList.toggle("noanim",!firstPaint);firstPaint=false;scList.innerHTML=h;return true}
function renderList(force){
 tabLbl();
 if(subTab===3)return;
 if(subTab===1){renderTpl(force);return}
 if(subTab===2){renderClients(force);return}
 var h="",done=0,tot=0,sv=savedLive();
 D.programs.forEach(function(p){p.workouts.forEach(function(w){tot++;if(isDone(p,w))done++})});
 if(sv&&!lv)h+=resumeHtml(sv);
 if(!D.programs.length)h+=emptyHtml();
 else{D.programs.forEach(function(p){h+=progHtml(p)});
  h+='<button class="addp addnp" data-a="newp"><b>+</b> Создать программу</button>'+recentHtml()}
 if(!setList(h,force))return;
 if(fresh){var id=fresh;setTimeout(function(){var c=$('[data-w="'+id+'"] .chk');if(c){c.classList.add("on");pls(c)}},500);fresh=null}}
function newProgram(){dlgForm({title:"Новая программа",sub:"Название и короткое описание",fields:[{k:"name",ph:"Название, например «Ягодицы и ноги»"},{k:"desc",ph:"Описание, не обязательно",max:70}],ok:"Создать",fn:function(v){var p={id:uid(),name:v.name,desc:v.desc,open:true,workouts:[]};D.programs.push(p);save();renderList();toast("Программа создана");setTimeout(function(){scList.scrollTo({top:scList.scrollHeight,behavior:"smooth"})},120)}})}
function newWorkout(p){dlgForm({title:"Новая тренировка",sub:"Программа «"+esc(p.name)+"»",fields:[{k:"name",ph:"Название, например «A · Ягодицы»"},{k:"desc",ph:"Описание, не обязательно",max:70}],ok:"Создать и открыть конструктор",fn:function(v){var w={id:uid(),name:v.name,desc:v.desc,done:false,tnote:"",ex:[]};p.workouts.push(w);p.open=true;saveNow();renderList();setTimeout(function(){openCon(p.id,w.id)},200)}})}
function newQuick(){dlgForm({title:"Новая тренировка",sub:"Попадёт в «Мои тренировки», позже её можно перенести в программу",fields:[{k:"name",ph:"Название тренировки"}],ok:"Создать и открыть конструктор",fn:function(v){var p=sysProg(),w={id:uid(),name:v.name,desc:"",done:false,tnote:"",ex:[]};p.workouts.push(w);p.open=true;saveNow();if(subTab!==0){segTab.set(0);setSub(0)}else renderList();setTimeout(function(){openCon(p.id,w.id)},200)}})}
var autoBusy=0;
function autoStart(){if(autoBusy)return;autoBusy=1;setTimeout(function(){autoBusy=0},1500);buildCat();var pr=FS.get("profile")||{},pl=FS.get("plan"),days=3,mins=45,time;
 if(pl&&typeof pl==="object"){if(Array.isArray(pl.days)&&pl.days.length)days=Math.min(6,pl.days.length);if(+pl.mins>0)mins=+pl.mins;time=pl.time}
 var r;try{r=GEN.starter(pr,{days:days,mins:mins,time:time})}catch(e){r=null}
 var prog=r&&r.progs&&r.progs.programs&&r.progs.programs[0];
 if(!prog||!prog.workouts||!prog.workouts.length){toast("Каталог упражнений пока пуст. Попробуйте позже");return}
 prog.open=true;D.programs.push(prog);
 if(pl&&typeof pl==="object"&&Array.isArray(pl.days)&&pl.days.length){pl.prog=prog.id;FS.save("plan")}else FS.set("plan",r.plan);
 saveNow();renderList();buzz([8,30,8]);toast("Собрали программу: "+plural(prog.workouts.length,["тренировка","тренировки","тренировок"]),"Открыть",function(){goProg(prog.id)})}
function dropProgram(p){D.programs=D.programs.filter(function(x){return x!==p});var pl=FS.get("plan");if(pl&&typeof pl==="object"&&pl.prog===p.id){pl.prog=D.programs[0]?D.programs[0].id:"";FS.save("plan")}saveNow();renderList();toast("Программа удалена")}
scList.addEventListener("click",function(e){
 var t=e.target,a=t.closest("[data-a]");
 if(a){var k=a.dataset.a;
  if(k==="newp"){newProgram();return}
  if(k==="mine"){buzz(8);newQuick();return}
  if(k==="tpl"){buzz(6);segTab.set(1);setSub(1);return}
  if(k==="auto"){autoStart();return}
  if(k==="resume"){resumeLive();return}
  if(k==="dropLive"){dlgConfirm({title:"Завершить без сохранения?",sub:"Отмеченные подходы не попадут в историю.",ok:"Завершить без сохранения",danger:true,no:"Вернуться",fn:function(){FS.set("live",null);if(lv)endLive();else renderList();toast("Тренировка закрыта без записи")}});return}
 }
 var rc=t.closest("[data-hk]");if(rc){if(rc.dataset.hw&&goWid(rc.dataset.hw,false,0))return;if(rc.dataset.hk&&openByKey(rc.dataset.hk))return;toast("Эта тренировка удалена из программ");return}
 var pe=t.closest("[data-p]");if(!pe)return;var p=findP(pe.dataset.p);if(!p)return;
 if(t.closest("[data-pt]")){p.open=!p.open;pe.classList.toggle("open",p.open);$("[data-pt]",pe).setAttribute("aria-expanded",p.open);save();buzz(6);return}
 if(t.closest("[data-pm]")){menu([{ic:"edit",t:"Переименовать",fn:function(){dlgForm({title:"Переименовать программу",fields:[{k:"name",ph:"Название",val:p.name},{k:"desc",ph:"Описание",val:p.desc,max:70}],ok:"Сохранить",fn:function(v){p.name=v.name;p.desc=v.desc;save();renderList();toast("Сохранено")}})}},{ic:"chart",t:"Подробнее",fn:function(){openProg(p)}},{ic:"trash",t:"Удалить",dn:true,fn:function(){var pk=p.workouts.map(hk),nk=xaCnt(pk);dlgConfirm({title:"Удалить программу?",sub:"«"+esc(p.name)+"» и "+plural(p.workouts.length,["тренировка","тренировки","тренировок"])+" внутри будут удалены."+(nk?" <b>История этих тренировок ("+plural(nk,["выполнение","выполнения","выполнений"])+") будет потеряна</b>. История отдельных упражнений останется в разделе «Упражнения».":""),ok:"Удалить",danger:true,fn:function(){if(nk)xaMove(pk);dropProgram(p)}})}}]);return}
 if(t.closest("[data-aw]")){newWorkout(p);return}
 var we=t.closest("[data-w]");if(!we)return;var w=findW(p,we.dataset.w);if(!w)return;
 if(t.closest("[data-wm]")){menu([{ic:"edit",t:"Переименовать",fn:function(){dlgForm({title:"Переименовать тренировку",fields:[{k:"name",ph:"Название",val:w.name},{k:"desc",ph:"Описание",val:w.desc,max:70}],ok:"Сохранить",fn:function(v){w.name=v.name;w.desc=v.desc;save();renderList();toast("Сохранено")}})}},{ic:"trash",t:"Удалить тренировку",dn:true,fn:function(){var nk=xaCnt([hk(w)]);dlgConfirm({title:"Удалить тренировку?",sub:"«"+esc(w.name)+"» будет удалена из программы."+(nk?" <b>История этой тренировки ("+plural(nk,["выполнение","выполнения","выполнений"])+") будет потеряна</b>: она исчезнет из календаря и истории тренировок. История отдельных упражнений останется в разделе «Упражнения».":""),ok:"Удалить",danger:true,fn:function(){if(nk)xaMove([hk(w)]);p.workouts=p.workouts.filter(function(x){return x!==w});saveNow();renderList();toast("Тренировка удалена")}})}}]);return}
 if(t.closest("[data-wo]")){openCon(p.id,w.id)}
});
/* свайп между подвкладками */
(function(){var sx=0,sy=0,on=false;var host=$("#sList");
 host.addEventListener("pointerdown",function(e){if(e.target.closest("input,textarea,.seg,.tfr,.chips,.acc textarea"))return;on=true;sx=e.clientX;sy=e.clientY});
 host.addEventListener("pointerup",function(e){if(!on)return;on=false;var dx=e.clientX-sx,dy=e.clientY-sy;if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*1.6){var n=subTab+(dx<0?1:-1);if(n>=0&&n<3){segTab.set(n);setSub(n)}}});
 host.addEventListener("pointercancel",function(){on=false})})();
var SUBT=["Мои программы","Готовые программы","Клиенты","Библиотека"];
var SUBD=["Здесь живут тренировки, которые создали вы, ваш тренер или приобретённые готовые программы","Программы под вашу цель и оборудование. После покупки они будут ждать старта во вкладке «Мои»","","Все упражнения с техникой: находите, изучайте и пробуйте в тренировках"];
function subDesc(i){return i===2?(isCoach()?"Здесь ваши клиенты: их успехи и ваши заметки":"Здесь ваш тренер видит ваши успехи и помогает в процессе"):SUBD[i]}
function subTitle(i){return i===2&&!isCoach()?"Тренер":SUBT[i]}
function tabLbl(){var b=$$("#sgTab button")[2],t=isCoach()?"Клиенты":"Тренер";if(b&&b.textContent!==t)b.textContent=t}
var libF=null;
var libReq=null;
function libShow(){try{if(libF&&libF._ld&&libF.contentWindow){libF.contentWindow.postMessage({f:"forma",from:"shell",t:"show"},"*");if(libReq){var r=libReq;libReq=null;r.f="forma";r.t="find";r.from="work";libF.contentWindow.postMessage(r,"*")}}}catch(e){}}
/* заявка на Библиотеку от shell ({t:"find",id|q|eq} → forma.libq): читаем напрямую из хранилища, кэш FS мог устареть */
function takeLibQ(){var s=null,o=null;try{s=localStorage.getItem("forma.libq")}catch(e){}if(s==null){try{s=parent.__FM.libq}catch(e){}}
 try{o=s?JSON.parse(s):null}catch(e){o=null}
 if(o&&typeof o==="object"&&(o.id!=null||o.q||o.eq)){libReq=o;try{localStorage.setItem("forma.libq","null")}catch(e){}try{parent.__FM.libq="null"}catch(e){}}}
function ensureLib(){if(libF)return;var FR=null;try{FR=window.parent&&window.parent.FRAMES}catch(e){}if(!FR||!FR.lib)return;
 libF=document.createElement("iframe");libF.title="Библиотека";libF.name="forma-lib-emb";
 libF.addEventListener("load",function(){libF._ld=1;try{var d=libF.contentDocument.documentElement,p=document.documentElement;["t","r","b","l"].forEach(function(k){var v=p.style.getPropertyValue("--sai-"+k);if(v)d.style.setProperty("--sai-"+k,v)})}catch(e){}libShow()});
 libF.srcdoc='<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="color-scheme" content="light"><style>.dock,.lhd{display:none!important}.scroll{padding-top:8px!important}</style></head><body><script>window.LIBEMB=1<\/script>'+FR.lib+'</body></html>';
 $("#libHost").appendChild(libF)}
function setSub(i){if(i===subTab)return;var prev=subTab;subTab=i;buzz(6);if(prev===3)app.classList.remove("libsheet");var sg=$("#sgTab");if(sg)sg.classList.toggle("lib3",i===3);var h=$("#pTitle");if(h)swapPane(h,function(){h.textContent=subTitle(i)});var hd=$("#pSub");if(hd)swapPane(hd,function(){hd.textContent=subDesc(i)});
 if(i===3){$("#sList").classList.add("lib");ensureLib();libShow();return}
 if(prev===3)$("#sList").classList.remove("lib");
 swapPane(scList,function(){renderList(true)},{top:true})}
var segTab=initSeg($("#sgTab"),function(i){setSub(i)});
function goProg(pid){if(subTab!==0){segTab.set(0);setSub(0)}var p=findP(pid);if(!p)return;p.open=true;renderList();setTimeout(function(){var e=$('[data-p="'+pid+'"]');if(e)scList.scrollTo({top:Math.max(0,e.offsetTop-70),behavior:"smooth"})},subTab===0?220:60)}

/* ---------- вкладка «Готовые» ---------- */
var TPL=null,tplSig=-1,tplF={place:"all",lvl:0,mus:[],eq:[]},tplOpen={},tplAdded={};
var LVT=["","Новичок","Средний","Продвинутый"],WHT={gym:"В зале",home:"Дома",both:"Дома и в зале"};
/* шаблоны зависят от профиля (уровень, цель, место, инвентарь, ограничения): пересобираем при смене этих полей, иначе купленная программа не учтёт новые ограничения */
function tplKey(){var p=FS.get("profile")||{};return [catLen,p.lvl,p.goal,p.where,p.sex,(p.eq||[]).join(","),(p.cau||[]).join(","),(p.cx||[]).join(","),p.preg].join("|")}
function getTpl(){buildCat();var k=tplKey();if(!TPL||tplSig!==k){try{TPL=GEN.templates(FS.get("profile"))||[]}catch(e){TPL=[]}tplSig=k}return TPL}
function boughtP(id){return D.programs.filter(function(p){return p.tpl===id})[0]}
function pr(n){return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,"\u00a0")+"\u00a0₽"}
function tplFilt(t){if(boughtP(t.id))return false;var pl=tplF.place;if(pl==="home"&&t.where==="gym")return false;if(pl==="gym"&&t.where==="home")return false;if(tplF.lvl&&t.lvl!==tplF.lvl)return false;
 if(tplF.eq.length&&!tplF.eq.some(function(k){return (t.eqs||[]).indexOf(k)>=0}))return false;
 if(tplF.mus.length){var m=tplMus(t);if(!tplF.mus.some(function(g){return m.indexOf(g)>=0}))return false}
 return true}
/* целевые мышцы программы: группы с заметной долей подходов */
function tplMus(t){if(t._mus)return t._mus;var r=progStats(t),G=r.G,tot=0;Object.keys(G).forEach(function(g){tot+=G[g]});
 return t._mus=GR_ALL.filter(function(g){return tot>0&&G[g]/tot>=.09})}
var MUSL={"Плечи":"Плечи","Мышцы груди":"Грудь","Мышцы спины":"Спина","Бицепс":"Бицепс","Трицепс":"Трицепс","Предплечье":"Предплечья","Мышцы кора":"Кор","Ягодицы":"Ягодицы","Передняя поверхность бедра":"Бёдра спереди","Задняя поверхность бедра":"Бёдра сзади","Мышцы голени":"Икры"};
var EQL={trx:"TRX",body:"Свой вес",dumbbell:"Гантели",barbell:"Штанга",machine:"Тренажёры",cable:"Блок",kettlebell:"Гиря",band:"Резинка"};
function tplFcnt(){return (tplF.place!=="all"?1:0)+(tplF.lvl?1:0)+tplF.mus.length+tplF.eq.length}
var EQT={trx:"TRX",band:"резинка",dumbbell:"гантели",barbell:"штанга",machine:"тренажёры",cable:"блок",kettlebell:"гиря"};
function eqTxt(t){var a=(t.eqs||[]).filter(function(e){return EQT[e]}).map(function(e){return EQT[e]});if(!a.length)return "без инвентаря";return a.slice(0,2).join(", ")+(a.length>2?" +"+(a.length-2):"")}
function tplHtml(t){return '<button class="tpc" data-t="'+esc(t.id)+'" data-tt><span class="tph"><em class="plb">программа</em><b>'+esc(t.name)+'</b><span class="d">'+esc(t.pitch||t.desc)+'</span><span class="mt"><span class="c1">'+ic("clock")+'~'+t.mins+' мин</span><span class="c2">'+ic("chart")+LVT[t.lvl]+'</span><span class="c3">'+ic("dumb")+eqTxt(t)+'</span></span>'+ic("chev")+'</span></button>'}
function openTplWin(tp,btn){var w=$("#winTp"),n=tp.workouts.length,pc=tp.price?pr(tp.price):"",wk=tp.weeks||Math.round(n/(tp.perWeek||3));
 var rows=tp.workouts.map(function(x,i){return '<div class="lkw"><em>'+(i+1)+'/'+n+'</em><b>'+esc(x.name)+'</b>'+ic("lock")+'</div>'}).join("");
 var gets=(tp.gets||[]).map(function(g){return '<li>'+ic("check")+'<span>'+esc(g)+'</span></li>'}).join("");
 var tile=function(b,s){return '<div class="st"><b>'+b+'</b><span>'+s+'</span></div>'};
 w.dataset.t=tp.id;
 w.innerHTML='<div class="wb"><span class="eyebrow tpe">Готовая программа</span><h3>'+esc(tp.name)+'</h3><p class="tpp">'+esc(tp.pitch||tp.desc)+'</p><div class="tpm"><span class="c1">'+ic("clock")+'~'+tp.mins+' мин</span><span class="c2">'+ic("chart")+LVT[tp.lvl]+'</span><span class="c3">'+ic("dumb")+eqTxt(tp)+'</span></div>'+
  '<div class="stats">'+tile(n,"тренировок")+tile(wk,plural(wk,["неделя","недели","недель"]).replace(/^\d+\s/,""))+tile(tp.perWeek,"в неделю")+'</div>'+
  '<button class="trl" data-trw aria-label="Смотреть трейлер"><span class="pl">'+ic("play")+'</span><span class="tl">Трейлер'+(tp.trailer?' · '+tp.trailer:'')+'</span><i class="tbar"><s></s></i></button>'+
  '<div class="sec"><h4>Что вы получите</h4><ul class="tgt">'+gets+'</ul></div>'+
  '<div class="sec"><h4>О программе</h4><p class="tlong">'+esc(tp.long||tp.desc)+'</p></div>'+
  '<div class="sec"><h4>'+n+' тренировок<small>откроются после покупки</small></h4><div class="lkl">'+rows+'</div></div></div>'+
  '<div class="wf"><button class="cta l" id="tpX">Закрыть</button><button class="cta buy" id="tpB">'+ic("lock")+'Купить'+(pc?' · '+pc:'')+'</button></div>';
 $("#tpX").onclick=function(){closeSheet("winTp")};
 $("#tpB").onclick=function(){buyTpl(tp)};
 var tb=$("[data-trw]",w);tb.onclick=function(){var on2=tb.classList.toggle("play");buzz(5);var s=$(".tbar s",tb);if(s){s.style.animation="none";void s.offsetWidth;s.style.animation=on2?"trl "+(tp.trailer==="0:55"?8:12)+"s linear forwards":"none"}};
 var b0=$(".wb",w);if(b0)b0.scrollTop=0;
 if(btn)openWin(w,btn);else{w.classList.add("on");syncScrim();buzz(8)}}
function buyTpl(tp){
 var had=boughtP(tp.id);if(had){closeSheet("winTp");segTab.set(0);setSub(0);setTimeout(function(){goProg(had.id);toast("Программа уже у вас, во вкладке «Мои»")},120);return}
 dlgConfirm({title:"Купить программу?",sub:esc(tp.name)+" · "+plural(tp.workouts.length,["тренировка","тренировки","тренировок"])+(tp.price?" · "+pr(tp.price):"")+". После оплаты программа появится во вкладке «Мои».",ok:tp.price?"Оплатить "+pr(tp.price):"Получить",no:"Отмена",fn:function(){
   if(boughtP(tp.id)){closeSheet("winTp");return}
   var q=GEN.copyProgram(tp);if(!q){toast("Не удалось добавить");return}q.tpl=tp.id;q.open=true;D.programs.push(q);
   var pl=FS.get("plan");if(pl&&typeof pl==="object"&&!pl.prog){pl.prog=q.id;FS.save("plan")}
   closeSheet("winTp");
   saveNow();buzz([8,30,8]);segTab.set(0);setSub(0);setTimeout(function(){goProg(q.id);toast("Программа куплена и добавлена в «Мои»")},120)}})}
function tplBody(all,list){var h="";
 if(!all.length)h+='<div class="stubc rise"><b>Каталог упражнений не загружен</b><span>Готовые программы собираются из каталога. Обновите приложение, и они появятся здесь.</span></div>';
 else if(!list.length&&all.every(function(t){return boughtP(t.id)}))h+='<div class="stubc rise"><b>Все готовые программы уже у вас</b><span>Они лежат во вкладке «Мои». Новые появятся здесь.</span><button class="cta l" data-a="tplm" style="margin-top:6px">Открыть «Мои»</button></div>';
 else if(!list.length)h+='<div class="stubc rise"><b>Под такие условия программ нет</b><span>Попробуйте другое место или уровень.</span><button class="cta l" data-a="tplr" style="margin-top:6px">Сбросить фильтры</button></div>';
 else h+=list.map(tplHtml).join("");
 return h}
function tplBar(all,list){var n=tplFcnt();
 return '<div class="wkline tbar2"><span><b>'+plural(list.length,["программа","программы","программ"])+'</b>'+(all.length&&!n?' · добавьте и меняйте под себя':'')+'</span><button class="fbtn'+(n?' on':'')+'" data-a="tfl" aria-label="Фильтры'+(n?', выбрано '+n:'')+'">'+ic("filt")+(n?'<i>'+n+'</i>':'')+'</button></div>'}
function renderTpl(force){var all=getTpl(),list=all.filter(tplFilt);setList('<div id="tpBar">'+tplBar(all,list)+'</div><div class="tpl" id="tpList">'+tplBody(all,list)+'</div>',force)}
/* фильтры: чипы меняются на месте (индикатор выбора плавный), список — мягкая смена без пересборки чипов */
function tplRefresh(){var host=$("#tpList");if(!host){renderTpl(true);return}
 var all=getTpl(),list=all.filter(tplFilt);lastHtml=null;var tb=$("#tpBar");if(tb)tb.innerHTML=tplBar(all,list);
 swapPane(host,function(){host.innerHTML=tplBody(all,list)},{out:false})}
scList.addEventListener("click",function(e){if(subTab!==1)return;var t=e.target,b;
 if(t.closest("[data-a=tfl]")){openTplFilter();return}
 if(t.closest("[data-a=tplr]")){tplF={place:"all",lvl:0,mus:[],eq:[]};buzz(5);tplRefresh();return}
 if(t.closest("[data-a=tplm]")){buzz(6);segTab.set(0);setSub(0);return}
 var c=t.closest("[data-t]");if(!c)return;var tp=getTpl().filter(function(x){return x.id===c.dataset.t})[0];if(!tp)return;
 openTplWin(tp,c)
});

function openTplFilter(){var all=getTpl(),d=$("#dlg");
 var eqs=EQORD.filter(function(k){return EQL[k]&&all.some(function(t){return (t.eqs||[]).indexOf(k)>=0})});
 var mus=GR_ALL.filter(function(g){return all.some(function(t){return tplMus(t).indexOf(g)>=0})});
 function chips(attr,items,on){return '<div class="fw">'+items.map(function(r){var a=on(r[0]);return '<button class="chip'+(a?" on":"")+'" data-'+attr+'="'+r[0]+'" aria-pressed="'+a+'">'+r[1]+'</button>'}).join("")+'</div>'}
 d.innerHTML='<div class="grab"></div><h3>Фильтры</h3><div class="fscr">'+
  '<div class="fh">Место</div>'+chips("fp",[["all","Любое"],["home","Дома"],["gym","В зале"]],function(k){return tplF.place===k})+
  '<div class="fh">Уровень</div>'+chips("fl",[[0,"Любой"],[1,"Новичок"],[2,"Средний"],[3,"Продвинутый"]],function(k){return tplF.lvl===+k})+
  '<div class="fh">Целевые мышцы</div>'+chips("fm",mus.map(function(g){return [g,MUSL[g]||g]}),function(k){return tplF.mus.indexOf(k)>=0})+
  '<div class="fh">Оборудование</div>'+chips("fe",eqs.map(function(k){return [k,EQL[k]]}),function(k){return tplF.eq.indexOf(k)>=0})+'</div>'+
  '<div class="frow"><button class="cta l" id="fRs">Сбросить</button><button class="cta" id="fOk"></button></div>';
 function upd(){var n=all.filter(tplFilt).length;$("#fOk").textContent=n?"Показать: "+n:"Ничего не найдено";$("#fRs").style.visibility=tplFcnt()?"visible":"hidden"}
 d.onclick=function(e){var t=e.target,b;
  function tg(a,v){var i=a.indexOf(v);if(i<0)a.push(v);else a.splice(i,1)}
  function sync(){$$(".chip",d).forEach(function(c){var k,on;if(c.dataset.fp!=null)on=tplF.place===c.dataset.fp;else if(c.dataset.fl!=null)on=tplF.lvl===+c.dataset.fl;else if(c.dataset.fm!=null)on=tplF.mus.indexOf(c.dataset.fm)>=0;else on=tplF.eq.indexOf(c.dataset.fe)>=0;c.classList.toggle("on",on);c.setAttribute("aria-pressed",on)});upd();tplRefresh()}
  if((b=t.closest("[data-fp]"))){tplF.place=b.dataset.fp}
  else if((b=t.closest("[data-fl]"))){tplF.lvl=+b.dataset.fl}
  else if((b=t.closest("[data-fm]"))){tg(tplF.mus,b.dataset.fm)}
  else if((b=t.closest("[data-fe]"))){tg(tplF.eq,b.dataset.fe)}
  else if(t.closest("#fRs")){tplF={place:"all",lvl:0,mus:[],eq:[]}}
  else if(t.closest("#fOk")){closeSheet("dlg");return}
  else return;
  buzz(5);sync()};
 dlgDis=function(){d.onclick=null};upd();openSheet("dlg")}

/* ---------- вкладка «Клиенты» / связь с тренером ---------- */
function SY(){var s=FS.get("sync");return s&&typeof s==="object"?s:{}}
function isCoach(){return SY().role==="coach"}
function lastDate(c){var m="";c.hist.forEach(function(h){if(h&&h.d>m)m=h.d});return m}
function clientsArr(){var c=SY().clients;if(!c||typeof c!=="object")return [];
 return Object.keys(c).map(function(id){var o=c[id]||{};var hh=(Array.isArray(o.hist)?o.hist:[]).filter(function(h){return h&&typeof h==="object"&&h.d});hh.sort(function(a,b){return a.d<b.d?1:a.d>b.d?-1:0});
  var wt=(Array.isArray(o.wt)?o.wt:[]).filter(function(r){return r&&r.d&&isFinite(+r.v)});wt.sort(function(a,b){return a.d<b.d?-1:a.d>b.d?1:0});
  return {id:id,name:String(o.name||"Клиент"),updated:o.updated,profile:o.profile&&typeof o.profile==="object"?o.profile:{},stats:o.stats||{},wt:wt,hist:hh}}).sort(function(a,b){return (lastDate(b)||"")<(lastDate(a)||"")?-1:1})}
function cntIn(c,n){var from=addDays(todayIso(),-(n-1));return c.hist.filter(function(h){return h.d>=from}).length}
function wtInfo(c){var w=c.wt;if(!w.length){var pw=+c.profile.w;return pw>0?{v:pw,dl:null}:null}var last=w[w.length-1],from=addDays(last.d,-30),ref=null;
 for(var i=0;i<w.length-1;i++){if(w[i].d>=from){ref=w[i];break}}return {v:+last.v,dl:ref?+last.v-+ref.v:null}}
function sessFlags(s){var p=0,e=0,n=0;(s.ex||[]).forEach(function(x){if(x.pain)p++;if(+x.eff>0){e+=+x.eff;n++}});return {pain:p,avg:n?e/n:0}}
function statusTxt(s){var st=s.status;return st==="ok"?"на связи":st==="offline"?"нет сети":st==="badcode"?"код не найден":st==="nolink"?"облако недоступно":st==="wait"?"проверяем код":"ожидание"}
function clip(txt,done){var ok=false;try{if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(function(){done(true)},function(){done(fb())});return}}catch(e){}done(fb());
 function fb(){try{var t=document.createElement("textarea");t.value=txt;t.style.cssText="position:fixed;opacity:0;left:-99px";document.body.appendChild(t);t.select();var r=document.execCommand("copy");t.remove();return r}catch(e){return false}}}
function coachNoteRecent(){var n=SY().note;if(!n||!n.text)return "";var t=+n.t;if(t>0&&Date.now()-t>7*864e5)return "";return String(n.text)}
function renderClients(force){
 if(!isCoach()){renderLink(force);return}
 var s=SY(),cl=clientsArr(),h="";
 if(!cl.length){h='<div class="empty rise"><div class="big">'+ic("user")+'</div><b>Клиенты появятся здесь</b><span>Когда клиенты подключатся по вашему коду, вы увидите их тренировки и сможете писать поправки.</span>'+(s.code?'<div class="cdbox"><small>Ваш код тренера</small><b id="cdv">'+esc(s.code)+'</b></div><div class="ecta"><button class="cta go" data-a="copy">'+ic("copy")+'Скопировать код</button><button class="cta l" data-a="demoOn">Показать на примере</button></div>':'<span class="small">Код появится, когда приложение выйдет на связь.</span>')+'</div>';setList(h,force);return}
 renderCl(force,cl)}
function renderLink(force){var old=$("#lkIn"),oldV=old?old.value:"",oldF=!!old&&document.activeElement===old,pr=FS.get("profile")||{},co=pr.coach&&typeof pr.coach==="object"?pr.coach:{},code=String(co.code||"").trim(),s=SY(),nt=s.note&&s.note.text?s.note:null,h="";
 h+='<div class="stubc lnk rise"><div class="lk1">'+ic("link")+'<b>'+(code&&!lnkEdit?"Ваш тренер":"Подключить тренера")+'</b></div>';
 if(code&&!lnkEdit){
  h+='<div class="lkst"><i class="'+(s.status==="ok"?"ok":"")+'"></i>Подключено · '+esc(statusTxt(s))+'</div><span>Код тренера: <b class="cdv">'+esc(code)+'</b>'+(co.name?' · '+esc(co.name):'')+'</span><span>Тренер видит ваши завершённые тренировки, заметки и отметки дискомфорта и может присылать поправки.</span><button class="cta l" data-a="lkedit">Изменить код</button>';
 }else{
  h+='<span>Введите код, который вам дал тренер. После подключения он увидит ваши тренировки и сможет присылать поправки к ним.</span><input class="fld" id="lkIn" placeholder="Код тренера" maxlength="32" autocomplete="off" autocapitalize="characters" spellcheck="false" value="'+esc(lnkEdit?code:"")+'"><button class="cta go" data-a="lkgo" id="lkGo" disabled>Подключиться</button>'+(lnkEdit?'<button class="cta l" data-a="lkno">Оставить прежний</button>':'');
 }
 h+='</div>';
 h+='<button class="addp addnp dmo" data-a="demoOn">Открыть как тренер, на примере</button>';
 if(nt){var when=+nt.t>0?new Date(+nt.t):null;h+='<div class="tcard rise"><div class="tl">'+ic("note")+'<b>Заметка тренера'+(nt.from?" · "+esc(nt.from):"")+(when?" · "+dmy(isoOf(when)):"")+'</b></div><p>'+esc(nt.text)+'</p></div>'}
 else if(code)h+='<div class="stubc rise"><b>Заметок пока нет</b><span>Когда тренер пришлёт поправку, она появится здесь и в начале тренировки.</span></div>';
 if(!setList(h,force))return;var inp=$("#lkIn");if(inp){if(oldV&&!lnkEdit){inp.value=oldV;if(oldF)inp.focus()}var go=$("#lkGo");go.disabled=!inp.value.trim();inp.oninput=function(){go.disabled=!inp.value.trim()};inp.onkeydown=function(e){if(e.key==="Enter"&&!go.disabled)go.click()}}}
var lnkEdit=false;
scList.addEventListener("click",function(e){if(subTab!==2)return;var t=e.target,a=t.closest("[data-a]");
 if(a){var k=a.dataset.a;
  if(k==="copy"){var code=SY().code;if(!code)return;clip(String(code),function(ok){toast(ok?"Код скопирован":"Не удалось скопировать. Код: "+code);if(ok)buzz(8)});return}
  if(k==="demoOn"){cDemoOn();buzz([8,30,8]);return}
  if(k==="lkedit"){lnkEdit=true;buzz(6);renderLink();var i=$("#lkIn");if(i)i.focus();return}
  if(k==="lkno"){lnkEdit=false;buzz(5);renderLink();return}
  if(k==="lkgo"){var v=($("#lkIn").value||"").replace(/\s+/g,"");if(!v)return;FS.patch("profile",{coach:{mode:"has",code:v,name:""}});send({t:"coach-link",code:v});lnkEdit=false;buzz([8,30,8]);toast("Код отправлен. Ждём ответа тренера");renderLink();return}
 }
 var b=t.closest("[data-cl]");if(b)openClient(b.dataset.cl)});
function exLines(s){return (s.ex||[]).map(function(x){var sets=Array.isArray(x.sets)?x.sets:[];if(!sets.length)return "";var dn=sets.filter(function(q){return q.done!==false}).length,part=dn<sets.length?'<em class="pk">'+dn+' из '+sets.length+' подх.</em>':'';
  return '<div class="cx"><div class="cxh"><b>'+esc(x.n||exOf(x.id).n)+'</b>'+(x.pain?'<em class="pk">Дискомфорт</em>':'')+part+'</div><span class="cxs">'+setsLine({mode:x.mode,sets:sets})+effTxt(x)+'</span>'+(x.my?'<p>'+esc(x.my)+'</p>':'')+'</div>'}).join("")}
function cnOf(uidv){var s=FS.get("set"),m=s&&s.cn&&s.cn[uidv];return m&&m.text?m:null}
/* ---------- ДАШБОРД КЛИЕНТОВ (режим тренера) ---------- */
var cF=null,cQ="",cPer="w",cDay=0,cCur=null;
var SGN={g:"В ритме",a:"Внимание",r:"Пауза",n:"Новые"};
function cSig(c){var h=c.hist;if(!h.length)return {k:"n",why:"ждёт первую тренировку",days:999};
 var s0=h[0],days=daysBetween(s0.d,todayIso()),pain=sessFlags(s0).pain;
 if(days>=14)return {k:"r",why:"пауза "+plural(days,["день","дня","дней"]),days:days};
 if(pain)return {k:"a",why:"дискомфорт: "+pain,days:days};
 if(days>=7)return {k:"a",why:"нет "+plural(days,["день","дня","дней"]),days:days};
 return {k:"g",why:"",days:days}}
var SORDER={r:0,a:1,g:2,n:3};
function cStrip(c,n){var t=todayIso(),set={};c.hist.forEach(function(h){set[h.d]=1});var o="";for(var i=n-1;i>=0;i--){o+='<i'+(set[addDays(t,-i)]?' class="on"':'')+'></i>'}return '<span class="strip" aria-hidden="true">'+o+'</span>'}
function cList(cl){var q=cQ.trim().toLowerCase();
 return cl.map(function(c){return {c:c,s:cSig(c)}}).filter(function(r){return (!cF||r.s.k===cF)&&(!q||r.c.name.toLowerCase().indexOf(q)>=0)})
  .sort(function(a,b){return SORDER[a.s.k]-SORDER[b.s.k]||b.s.days-a.s.days||(a.c.name<b.c.name?-1:1)})}
function cRows(cl){var L=cList(cl);if(!L.length)return '<div class="stubc"><b>Никого не нашлось</b><span>Смените фильтр или поиск.</span></div>';
 return L.map(function(r){var c=r.c,s0=c.hist[0],w=wtInfo(c);
  return '<button class="cli crow rise" data-cl="'+esc(c.id)+'"><span class="av s-'+r.s.k+'">'+esc(ini(c.name))+'<i></i></span><span class="ct"><b>'+esc(c.name)+'</b><small>'+(s0?agoTxt(s0.d)+' · '+esc(s0.wn||"Тренировка"):'Пока без тренировок')+'</small>'+(r.s.why&&r.s.k!=="g"?'<em class="why w-'+r.s.k+'">'+esc(r.s.why)+'</em>':'')+'</span><span class="rt2">'+cStrip(c,10)+'<small>'+(w&&w.dl!=null?(w.dl>0?"+":w.dl<0?"−":"")+kgTxt(f1(Math.abs(w.dl)))+" кг/мес":(w?kgTxt(f1(w.v))+" кг":""))+'</small></span></button>'}).join("")}
function cTiles(cl){var n={g:0,a:0,r:0,n:0};cl.forEach(function(c){n[cSig(c).k]++});
 return '<div class="ctl" id="ctl">'+["g","a","r","n"].map(function(k){return '<button class="ct1 s-'+k+(cF===k?" on":"")+'" data-cf="'+k+'" aria-pressed="'+(cF===k)+'"><b>'+n[k]+'</b><span>'+SGN[k]+'</span></button>'}).join("")+'</div>'}
function renderCl(force,cl){var s=SY(),h='';
 h+=cTiles(cl);
 if(cl.length>8)h+='<div class="search cs2"><svg class="i"><use href="#search"/></svg><input id="cQ" type="search" placeholder="Найти клиента" autocomplete="off" value="'+esc(cQ)+'"></div>';
 h+='<div class="clst" id="clList">'+cRows(cl)+'</div>';
 if(s.demoC)h+='<button class="addp addnp" data-a="demoOff">Убрать демо-клиентов</button>';
 else if(s.code)h+='<button class="addp" data-a="copy"><span class="pl">'+ic("copy")+'</span>Скопировать мой код · '+esc(s.code)+'</button>';
 var inp=$("#cQ"),f=!!inp&&document.activeElement===inp;
 if(!setList(h,force))return;
 var i2=$("#cQ");if(i2){if(f)i2.focus()}}
function clRefresh(){var cl=clientsArr(),host=$("#clList");if(!host){renderClients(true);return}
 var t=$("#ctl");if(t)t.outerHTML=cTiles(cl);lastHtml=null;
 swapPane(host,function(){host.innerHTML=cRows(cl)},{out:false})}
scList.addEventListener("click",function(e){if(subTab!==2||!isCoach())return;var b=e.target.closest("[data-cf]");
 if(b){cF=cF===b.dataset.cf?null:b.dataset.cf;buzz(5);clRefresh();return}
 var a=e.target.closest("[data-a=demoOff]");if(a){cDemoOff();return}});
scList.addEventListener("input",function(e){if(e.target.id!=="cQ")return;cQ=e.target.value;var host=$("#clList");if(host){host.innerHTML=cRows(clientsArr())}});

/* показ на примере: демо-клиенты за год (помечены, удаляются без следа) */
function cDemoOn(){buildCat();var ids=(typeof CAT!=="undefined"?CAT:[]).filter(function(x){return x&&x.id!=null&&x.m&&x.eq!=="mob"}).slice(0,60);if(ids.length<12)ids=Object.keys(EXM||{}).slice(0,40).map(function(k){return EXM[k]});
 var seed=7;function rnd(){seed=(seed*16807)%2147483647;return seed/2147483647}
 var NM=["Анна К.","Мария С.","Ольга В.","Елена Т.","Ирина Л.","Дарья М.","Светлана Н.","Наталья Р.","Юлия Б.","Алексей П.","Виктория Г.","Татьяна Ш."];
 var PROG=[["A · Ягодицы и ноги","B · Спина и плечи","C · Кор и мобильность"],["Верх тела","Низ тела","Всё тело"]];
 var cl={},t=todayIso();
 NM.forEach(function(nm,i){var hist=[],wt=[],perW=2+Math.floor(rnd()*3),start=120+Math.floor(rnd()*240),paused=i%4===1?(8+Math.floor(rnd()*14)):(i===6?16:(i===9?9:(i===11?0:0)));
  var base=[],names=PROG[i%2],ex0=[];for(var k=0;k<5;k++)ex0.push(ids[(i*5+k)%ids.length]);
  var w0=58+rnd()*22,wi=0;
  for(var d=start;d>=paused;d--){var dow=(new Date(+t.slice(0,4),+t.slice(5,7)-1,+t.slice(8)-d)).getDay();var dayOk=(perW===2?[2,5]:perW===3?[1,3,5]:[1,2,4,6]).indexOf(dow)>=0;
   if(i===11&&d>start-9)continue;
   if(dayOk&&rnd()<.88){var prog=(start-d)/start,wk=Math.floor((start-d)/7);
    var ex=ex0.map(function(x,j){var kg=x.eq==="body"?"":Math.round((10+j*2+prog*8)*2)/2,pain=(d<paused+3&&j===2&&i%3===0)||(rnd()<.015);var sets=[];for(var q=0;q<3;q++)sets.push({v:12,w:kg,t:30,rest:60,done:true});return {u:"u"+j,id:x.id,n:x.n,mode:"kg",sets:sets,eff:6+Math.floor(rnd()*3),pain:pain?1:0,my:pain?"Тянет в колене на последнем подходе":""}});
    var vol=0;ex.forEach(function(x){x.sets.forEach(function(s){vol+=(+s.w||0)*s.v})});
    var dd=addDays(t,-d);hist.push({d:dd,k:"w"+(wk%3),wn:names[wk%3],pn:"Программа",t:"19:00",sec:(40+Math.floor(rnd()*25))*60,kcal:300,pct:rnd()<.8?100:Math.round(70+rnd()*25),vol:Math.round(vol),ex:ex,g:rnd()<.1?"Было тяжело, но закончила":""})}
   if(d%7===0){wt.push({d:addDays(t,-d),v:Math.round((w0+(d/start)*(i%5===4?-1.5:2.4+rnd()))*10)/10})}}
  cl["demo"+i]={name:nm,updated:Date.now(),profile:{w:Math.round(w0)},stats:{},wt:wt,hist:hist}});
 FS.patch("sync",{role:"coach",code:"FORMA1",status:"ok",clients:cl,demoC:1});renderList(true)}
function cDemoOff(){FS.set("sync",{});buzz(8);toast("Демо-клиенты убраны");renderList(true)}

/* ---------- экран клиента ---------- */
var PERN={d:"День",w:"Неделя",m:"Месяц",y:"Год",a:"Всё"};
function perR(per,off){var t=todayIso();
 if(per==="d"){var d=addDays(t,-off);return {a:d,b:d,pa:addDays(d,-1),pb:addDays(d,-1)}}
 if(per==="a")return {a:"0000-01-01",b:t,pa:"",pb:""};
 var n={w:7,m:30,y:365}[per];return {a:addDays(t,-(n-1)),b:t,pa:addDays(t,-(2*n-1)),pb:addDays(t,-n)}}
function inR(c,a,b){return c.hist.filter(function(h){return h.d>=a&&h.d<=b})}
function agg(ss){var n=ss.length,pc=0,sec=0,vol=0,pn=0,ef=0,en=0;ss.forEach(function(s){pc+=nz(s.pct,100);sec+=nz(s.sec,0);vol+=nz(s.vol,0);var f=sessFlags(s);if(f.pain)pn++;if(f.avg){ef+=f.avg;en++}});
 return {n:n,pct:n?Math.round(pc/n):null,sec:sec,vol:vol,pain:pn,eff:en?ef/en:null}}
function hm(sec){var m=Math.round(sec/60);return m>=600?Math.round(m/60)+" ч":m>=60?Math.floor(m/60)+" ч "+(m%60)+" м":m+" мин"}
function dlt(a,b,fmt,inv){if(b==null||a==null)return "";var d=a-b;if(!d)return '<em class="dl">как раньше</em>';var good=inv?d<0:d>0;return '<em class="dl '+(good?"up":"fl")+'">'+(d>0?"+":"−")+fmt(Math.abs(d))+'</em>'}
function kpi(b,l,sub){return '<div class="kp"><b>'+b+'</b><span>'+l+'</span>'+(sub||"")+'</div>'}
function actChart(c,per){if(per==="d")return "";var t=todayIso(),bars=[],lab=[];
 function dayVal(d){return c.hist.filter(function(h){return h.d===d}).reduce(function(s,h){return s+Math.max(1,nz(h.sec,2400)/60)},0)}
 if(per==="w"){for(var i=6;i>=0;i--){var d=addDays(t,-i),p=d.split("-"),wd=["вс","пн","вт","ср","чт","пт","сб"][new Date(+p[0],+p[1]-1,+p[2]).getDay()];bars.push(dayVal(d));lab.push(wd)}}
 else if(per==="m"){for(var j=29;j>=0;j--){var d2=addDays(t,-j);bars.push(dayVal(d2));lab.push(j%7===0?String(+d2.slice(8)):"")}}
 else{var wk=per==="y"?52:0;
  if(per==="y"){for(var k=wk-1;k>=0;k--){var s=0;for(var q=0;q<7;q++)s+=c.hist.filter(function(h){return h.d===addDays(t,-(k*7+q))}).length;bars.push(s);var d3=addDays(t,-(k*7));lab.push(k%9===0?MR[+d3.slice(5,7)-1].slice(0,3):"")}}
  else{var first=c.hist.length?c.hist[c.hist.length-1].d:t,months=Math.min(36,Math.max(3,Math.round(daysBetween(first,t)/30)+1));for(var m=months-1;m>=0;m--){var a=addDays(t,-(m*30+29)),b=addDays(t,-m*30);bars.push(c.hist.filter(function(h){return h.d>=a&&h.d<=b}).length);lab.push(m%6===0?MR[+b.slice(5,7)-1].slice(0,3):"")}}}
 var mx=Math.max.apply(null,bars)||1;
 return '<div class="card2"><div class="ch2"><h4>Активность</h4><span>'+(per==="w"?"минут по дням":per==="m"?"минут по дням":per==="y"?"тренировок по неделям":"тренировок по месяцам")+'</span></div><div class="act a-'+per+'">'+bars.map(function(v,i){return '<span class="b'+(v?" on":"")+'"><s style="--h:'+(v?Math.max(8,Math.round(v/mx*100)):3)+'%;--d:'+(i*14)+'ms"></s><em>'+lab[i]+'</em></span>'}).join("")+'</div></div>'}
function wtChart(c,r,per){var pts=c.wt.filter(function(p){return p.d<=r.b});if(!pts.length)return "";var inn=pts.filter(function(p){return p.d>=r.a});var prev=pts.filter(function(p){return p.d<r.a}).slice(-1);var use=prev.concat(inn);
 if(per==="d")return "";
 if(use.length<2)return '<div class="card2"><div class="ch2"><h4>Вес</h4><span>'+kgTxt(f1(pts[pts.length-1].v))+' кг</span></div><p class="small">Для графика за этот период нужно хотя бы два взвешивания.</p></div>';
 var d0=use[0].d,d1=use[use.length-1].d,span=Math.max(1,daysBetween(d0,d1)),vs=use.map(function(p){return p.v}),mn=Math.min.apply(null,vs),mxv=Math.max.apply(null,vs),pad=Math.max(.3,(mxv-mn)*.2);mn-=pad;mxv+=pad;
 var X=function(p){return 8+(daysBetween(d0,p.d)/span)*284},Y=function(v){return 70-(v-mn)/(mxv-mn)*58};
 var pth=use.map(function(p,i){return (i?"L":"M")+X(p).toFixed(1)+","+Y(p.v).toFixed(1)}).join(" "),area=pth+" L"+X(use[use.length-1]).toFixed(1)+",76 L"+X(use[0]).toFixed(1)+",76 Z",dl=use[use.length-1].v-use[0].v;
 return '<div class="card2"><div class="ch2"><h4>Вес</h4><span>'+kgTxt(f1(use[use.length-1].v))+' кг · '+(dl>0?"+":dl<0?"−":"")+kgTxt(f1(Math.abs(dl)))+'</span></div><svg class="wch" viewBox="0 0 300 80" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4FB874" stop-opacity=".22"/><stop offset="1" stop-color="#4FB874" stop-opacity="0"/></linearGradient></defs><path d="'+area+'" fill="url(#wg)"/><path class="ln" pathLength="1" d="'+pth+'" fill="none" stroke="#2B8A52" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg></div>'}
function exProg(ss){var asc=ss.slice().sort(function(a,b){return a.d<b.d?-1:1}),m={};
 asc.forEach(function(s){(s.ex||[]).forEach(function(x){var sets=(x.sets||[]).filter(function(q){return q.done!==false});if(!sets.length)return;var tm=x.mode==="time",best=Math.max.apply(null,sets.map(function(q){return tm?(+q.t||0):(+q.w||0)}));var o=m[x.id]||(m[x.id]={n:x.n||exOf(x.id).n,tm:tm,a:null,b:null,c:0});if(o.a==null)o.a=best;o.b=best;o.c++})});
 var L=Object.keys(m).map(function(k){return m[k]}).filter(function(o){return o.c>=2&&(o.a>0||o.b>0)}).sort(function(x,y){return y.c-x.c}).slice(0,6);if(!L.length)return "";
 return '<div class="card2"><div class="ch2"><h4>Прогресс в упражнениях</h4><span>первая → последняя</span></div>'+L.map(function(o){var d=o.b-o.a,u=o.tm?" с":" кг";return '<div class="xp"><span>'+esc(o.n)+'</span><b>'+kgTxt(o.a)+' → '+kgTxt(o.b)+u+'</b><em class="'+(d>0?"up":d<0?"fl":"")+'">'+(d>0?"+":d<0?"−":"=")+(d?kgTxt(Math.abs(d)):"")+'</em></div>'}).join("")+'</div>'}
var cLim=8;
function feed(ss,pid){var sh=ss.slice(0,cLim),body=sh.map(function(s,i){var fl=sessFlags(s);return '<div class="cs'+(i===0&&sh.length<=3?" open":"")+'"><button class="csh" data-cs aria-expanded="'+(i===0&&sh.length<=3)+'"><span><b>'+esc(s.wn||"Тренировка")+'</b><small>'+dmy(s.d)+' · '+agoTxt(s.d)+(s.sec?' · '+Math.max(1,Math.round(s.sec/60))+' мин':'')+(s.pct!=null&&s.pct<100?' · '+Math.round(s.pct)+'%':'')+(fl.pain?' · дискомфорт: '+fl.pain:'')+'</small></span>'+ic("down")+'</button><div class="acc"><div><div class="csb">'+(typeof s.g==="string"&&s.g?'<p class="gn2">'+esc(s.g)+'</p>':'')+exLines(s)+'</div></div></div></div>'}).join("");
 return '<div class="card2"><div class="ch2"><h4>Тренировки</h4><span>'+ss.length+'</span></div>'+(body||'<p class="small">В этом периоде тренировок нет.</p>')+(ss.length>cLim?'<button class="cta l more" data-cmore>Показать ещё '+Math.min(8,ss.length-cLim)+'</button>':'')+'</div>'}
function sentLog(id){var s=FS.get("set"),a=s&&s.sent&&Array.isArray(s.sent[id])?s.sent[id]:[];return a}
function clBody(c){var sg=cSig(c);
 return '<div class="clh"><span class="sg s-'+sg.k+'"><i></i>'+SGN[sg.k]+'</span><span class="lw">'+(c.hist[0]?'Последняя тренировка · '+agoTxt(c.hist[0].d):'Тренировок ещё не было')+'</span></div>'+
 '<div class="seg pseg" id="clPer"><div class="ind"></div>'+["d","w","m","y","a"].map(function(k){return '<button data-per="'+k+'"'+(k===cPer?' class="on"':'')+'>'+PERN[k]+'</button>'}).join("")+'</div><div id="clRest">'+clRest(c)+'</div>'}
function clRest(c){var r=perR(cPer,cDay),ss=inR(c,r.a,r.b),pv=r.pa?inR(c,r.pa,r.pb):[],A=agg(ss),P=r.pa?agg(pv):null,wi=wtInfo(c);
 var pTxt={d:"вчера",w:"прошлые 7 дн.",m:"прошлые 30 дн.",y:"прошлый год",a:""}[cPer];
 var h='';
 if(cPer==="d"){var dd=r.a;h+='<div class="dnav"><button data-dn="1" aria-label="Предыдущий день">'+ic("back")+'</button><b>'+(cDay===0?"Сегодня":cDay===1?"Вчера":"")+(cDay<2?" · ":"")+dmy(dd)+'</b><button data-dn="-1" aria-label="Следующий день"'+(cDay===0?' disabled':'')+' class="r">'+ic("back")+'</button></div>'}
 h+='<div class="kps">'+kpi(A.n,"тренировок",P?'<small>'+pTxt+': '+P.n+' '+dlt(A.n,P.n,String)+'</small>':'')+kpi(A.pct!=null?A.pct+"%":"—","выполнение",P&&P.pct!=null&&A.pct!=null?'<small>'+dlt(A.pct,P.pct,function(v){return v+"%"})+'</small>':'')+kpi(A.sec?hm(A.sec):"—","время")+kpi(A.vol?(A.vol>=1000?f1(A.vol/1000)+" т":Math.round(A.vol)+" кг"):"—","объём",P&&P.vol&&A.vol?'<small>'+dlt(A.vol,P.vol,function(v){return v>=1000?f1(v/1000)+" т":Math.round(v)+" кг"})+'</small>':'')+kpi(wi?kgTxt(f1(wi.v))+" кг":"—","вес",wi&&wi.dl!=null?'<small>'+(wi.dl>0?"+":wi.dl<0?"−":"")+kgTxt(f1(Math.abs(wi.dl)))+' за мес.</small>':'')+kpi(A.pain?'<span class="pk">'+A.pain+'</span>':'0',"с дискомфортом")+'</div>';
 h+=actChart(c,cPer)+wtChart(c,r,cPer)+exProg(ss)+feed(ss);
 var lg=sentLog(c.id);
 if(lg.length)h+='<div class="card2"><div class="ch2"><h4>Отправлено клиенту</h4><span>'+lg.length+'</span></div>'+lg.slice(0,5).map(function(x){return '<div class="sl"><span>'+({note:"Заметка",prog:"Программа",work:"Тренировка"}[x.k]||"")+'</span><b>'+esc(x.n)+'</b><small>'+dmy(x.d)+'</small></div>'}).join("")+'</div>';
 return h}
function openClient(id){var c=clientsArr().filter(function(q){return q.id===id})[0];if(!c)return;cCur=id;cPer="w";cDay=0;cLim=8;
 $("#clName").textContent=c.name;
 var sc=$("#scCl");sc.classList.remove("go");sc.innerHTML=clBody(c);bindCl();app.dataset.mode="cl";$("#sCl").classList.add("on");sc.scrollTop=0;buzz(8);
 setTimeout(function(){sc.classList.add("go")},380)}
function closeClient(){$("#sCl").classList.remove("on");if(app.dataset.mode==="cl")app.dataset.mode="list";cCur=null;renderList()}
function curC(){return clientsArr().filter(function(q){return q.id===cCur})[0]}
function clSwap(){var c=curC();if(!c)return;var rest=$("#clRest"),sc=$("#scCl");swapPane(rest,function(){rest.innerHTML=clRest(c);sc.classList.remove("go");void sc.offsetWidth;sc.classList.add("go")},{out:false})}
function bindCl(){var el=$("#clPer"),ind=$(".ind",el);
 function pl(){var b=$("button.on",el);if(!b||!b.offsetWidth)return;ind.style.width="auto";ind.style.transition="none";ind.style.left=b.offsetLeft+"px";ind.style.right=(el.clientWidth-b.offsetLeft-b.offsetWidth)+"px"}
 setTimeout(pl,30);if(document.fonts)document.fonts.ready.then(pl)}
$("#scCl").addEventListener("click",function(e){var t=e.target,b;
 if((b=t.closest("[data-per]"))){if(b.dataset.per===cPer)return;var el=$("#clPer"),ind=$(".ind",el),bs=$$("button",el),prev=$("button.on",el),fw=bs.indexOf(b)>bs.indexOf(prev);prev.classList.remove("on");b.classList.add("on");
  ind.style.transition="left "+(fw?".55s":".32s")+" var(--glassease),right "+(fw?".32s":".55s")+" var(--glassease)";ind.style.left=b.offsetLeft+"px";ind.style.right=(el.clientWidth-b.offsetLeft-b.offsetWidth)+"px";
  cPer=b.dataset.per;cDay=0;cLim=8;buzz(6);clSwap();return}
 if((b=t.closest("[data-dn]"))){if(b.disabled)return;cDay=Math.max(0,cDay+(+b.dataset.dn));buzz(5);clSwap();return}
 if((b=t.closest("[data-cs]"))){var p=b.parentNode,on=!p.classList.contains("open");p.classList.toggle("open",on);b.setAttribute("aria-expanded",on);buzz(5);return}
 if(t.closest("[data-cmore]")){cLim+=8;var c=curC();if(c)$("#clRest").innerHTML=clRest(c);return}});
$("#clBack").onclick=function(){closeClient()};
/* заметка клиенту */
var QN=["Следите за темпом: 3 секунды вниз","Снизьте вес, добавьте контроль","Отлично! В следующий раз добавьте 2 кг","Больше воды и сна на этой неделе"];
function logSent(id,k,n){var s=FS.get("set");s=s&&typeof s==="object"?s:{wRem:true,notif:[]};s.sent=s.sent&&typeof s.sent==="object"?s.sent:{};var a=Array.isArray(s.sent[id])?s.sent[id]:[];a.unshift({k:k,n:n,d:todayIso(),t:Date.now()});s.sent[id]=a.slice(0,30);FS.set("set",s)}
function openNote(){var c=curC();if(!c)return;var w=$("#winCl"),ln=cnOf(c.id);
 w.innerHTML='<div class="wb"><span class="eyebrow">Заметка клиенту</span><h3>'+esc(c.name)+'</h3>'+(ln?'<p class="gn2" style="margin-bottom:8px">Последняя · '+dmy(ln.d)+': «'+esc(ln.text)+'»</p>':'')+'<div class="qn">'+QN.map(function(q,i){return '<button class="chip sm" data-q="'+i+'">'+esc(q)+'</button>'}).join("")+'</div><textarea class="note" id="clN" rows="3" placeholder="Темп, акцент, что изменить. Клиент увидит это перед тренировкой"></textarea></div><div class="wf"><button class="cta l" id="clX">Закрыть</button><button class="cta go" id="clS" disabled>Отправить</button></div>';
 $("#clX").onclick=function(){closeSheet("winCl")};
 var ta=$("#clN"),sb=$("#clS");ta.oninput=function(){sb.disabled=!ta.value.trim();grow(ta)};
 $$("[data-q]",w).forEach(function(b){b.onclick=function(){var q=QN[+b.dataset.q];ta.value=ta.value?ta.value.replace(/\s+$/,"")+" "+q:q;ta.oninput();buzz(4)}});
 sb.onclick=function(){var tx=ta.value.trim();if(!tx)return;send({t:"coach-note",uid:c.id,text:tx});var s=FS.get("set");s=s&&typeof s==="object"?s:{wRem:true,notif:[]};s.cn=s.cn&&typeof s.cn==="object"?s.cn:{};s.cn[c.id]={text:tx,d:todayIso(),t:Date.now()};FS.set("set",s);logSent(c.id,"note",tx.length>40?tx.slice(0,40)+"…":tx);buzz([8,30,8]);closeSheet("winCl");toast("Отправлено: "+c.name);clSwap()};
 openWin(w,$('[data-ca="note"]'))}
/* отправить тренировку или программу */
function openSend(step){var c=curC();if(!c)return;var d=$("#dlg"),h='<div class="grab"></div><h3>Отправить клиенту</h3><p class="sub">'+esc(c.name)+'</p>';
 if(!D.programs.length){d.innerHTML=h+'<p class="small" style="text-align:center">У вас пока нет программ. Соберите программу во вкладке «Мои».</p><button class="cta l" id="sdX">Закрыть</button>';$("#sdX").onclick=function(){closeSheet("dlg")};dlgDis=null;openSheet("dlg");return}
 if(!step){h+='<button class="cta" data-sd="prog">'+ic("book")+'Программу целиком</button><button class="cta" data-sd="work">'+ic("dumb")+'Одну тренировку</button>'}
 else if(step==="prog"){h+='<div class="sdl">'+D.programs.map(function(p){return '<button class="rcr" data-sp="'+esc(p.id)+'"><span class="rt1"><b>'+esc(progName(p))+'</b><small>'+plural(p.workouts.length,["тренировка","тренировки","тренировок"])+'</small></span>'+ic("chev")+'</button>'}).join("")+'</div>'}
 else{h+='<div class="sdl">'+D.programs.map(function(p){return p.workouts.map(function(w){return '<button class="rcr" data-sw="'+esc(p.id)+'|'+esc(w.id)+'"><span class="rt1"><b>'+esc(w.name)+'</b><small>'+esc(progName(p))+' · '+plural(w.ex.length,["упражнение","упражнения","упражнений"])+'</small></span>'+ic("chev")+'</button>'}).join("")}).join("")+'</div>'}
 d.innerHTML=h;
 d.onclick=function(e){var b;
  if((b=e.target.closest("[data-sd]"))){buzz(5);openSend(b.dataset.sd);return}
  if((b=e.target.closest("[data-sp]"))){var p=findP(b.dataset.sp);if(!p)return;doSend(c,"prog",progName(p),JSON.parse(JSON.stringify(p)));return}
  if((b=e.target.closest("[data-sw]"))){var ids=b.dataset.sw.split("|"),p2=findP(ids[0]),w2=findW(p2,ids[1]);if(!w2)return;doSend(c,"work",w2.name,JSON.parse(JSON.stringify(w2)))}};
 dlgDis=function(){d.onclick=null};openSheet("dlg")}
function doSend(c,kind,name,data){send({t:"coach-prog",uid:c.id,kind:kind,name:name,data:data});logSent(c.id,kind,name);$("#dlg").onclick=null;closeSheet("dlg");buzz([8,30,8]);toast("Отправлено: "+name);clSwap()}
$("#clAct").addEventListener("click",function(e){var b=e.target.closest("[data-ca]");if(!b)return;if(b.dataset.ca==="note")openNote();else openSend()});


/* ---------- конструктор ---------- */
var cs=$("#scCon");
function snapOf(){if(!con||!con.cw)return"";return JSON.stringify([con.cw.name,con.cw.ex,con.cw.tn])}
function isDirty(){return con&&snapOf()!==con.snap}
function schedCon(){clearTimeout(conT);conT=setTimeout(function(){conT=0;applyCon();save()},250)}
function openCon(pid,wid){var p=findP(pid),w=findW(p,wid);if(!w)return;
 if(lv&&app.dataset.mode==="live")minLive();
 con={p:p,w:w,cw:{name:w.name,ex:clone(w.ex),tn:w.tnote||""},sub:false,pre:null,orphan:false};con.snap=snapOf();openSet={};barSt=null;
 $("#cName").value=w.name;$("#cCrumb").textContent=p.name+" · тренировка";
 cs.innerHTML='<div id="mapHost"></div>'+'<div class="tnb rise"'+((isCoach()||con.cw.tn)?'':' style="display:none"')+'><div class="tl">'+ic("note")+'<b>'+(isCoach()?"Поправка тренера к тренировке":"Мой акцент на тренировку")+'</b></div><textarea class="note" id="wNote" rows="1" placeholder="'+(isCoach()?"Темп, акцент, что изменить на этой неделе. Человек увидит это перед началом и во время тренировки":"Темп, акцент, что помнить на этой тренировке")+'">'+esc(con.cw.tn)+'</textarea></div><div id="prevHost"></div><div class="xlist" id="xl"></div><button class="addx" id="addX">'+ic("plus")+'Добавить упражнение</button>';
 buildMap();renderPrev();renderX();refreshBar();grow($("#wNote"));app.dataset.mode="con";$("#sCon").classList.add("on");cs.scrollTop=0;
 $("#addX").onclick=function(){openSearch()}}
function closeCon(){if(con){if(con.orphan){var sp=sysProg();if(sp.workouts.indexOf(con.w)<0)sp.workouts.push(con.w);con.orphan=false}saveNow()}
 $("#sCon").classList.remove("on");if(app.dataset.mode==="con")app.dataset.mode="list";con=null;renderList()}
function relink(){if(!con)return;var p=findP(con.p.id),w=p&&findW(p,con.w.id);if(w){con.p=p;con.w=w;con.orphan=false}else con.orphan=true}
function buildMap(){var h=$("#mapHost");if(!h)return;
 h.innerHTML='<div class="mapc rise"><div class="h"><b>Карта нагрузки</b><span class="small" id="mapMin"></span></div><div class="mbody"><div class="lbs" id="lbs"></div><div class="figs figon"><div class="fg">'+figSvg("front",sexNow())+'<small>спереди</small></div><div class="fg">'+figSvg("back",sexNow())+'<small>сзади</small></div></div></div></div>';updateMap()}
/* значения прошлой недели */
function renderPrev(){var h=$("#prevHost");if(!h||!con)return;var L=lastW(con.p,con.w);
 if(!L||!Array.isArray(L.ex)||!con.cw.ex.length){h.innerHTML="";return}
 var m=con.cw.ex.filter(function(x){return L.ex.some(function(l){return l.id===x.id})}).length;
 if(!m&&!con.sub){h.innerHTML="";return}
 h.innerHTML=con.sub?'<div class="prevb ap rise" style="cursor:default"><span class="pi">'+ic("check")+'</span><span><b>Значения прошлой недели подставлены</b><small>Подставлено упражнений: '+m+'. Можно править</small></span><button class="rv" id="prevRv">Вернуть</button></div>':'<button class="prevb rise" id="prevB"><span class="pi">'+ic("clock")+'</span><span><b>Подставить значения прошлой недели</b><small>Тренировка от '+dmy(L.d)+' · совпадает упражнений: '+m+'</small></span></button>';
 var pb=$("#prevB"),rv=$("#prevRv");
 if(pb)pb.onclick=function(){applyLast()};if(rv)rv.onclick=function(){revertLast()}}
function applyLast(){if(!con||!con.cw)return;var last=lastW(con.p,con.w),n=0;if(!last)return;con.pre=clone(con.cw.ex);
 con.cw.ex.forEach(function(x){var l=last.ex.filter(function(q){return q.id===x.id})[0];if(!l||!Array.isArray(l.sets)||!l.sets.length)return;n++;x.mode=l.mode==="time"?"time":"kg";x.sets=l.sets.map(function(s,k){var o=x.sets[k]||x.sets[x.sets.length-1]||{};return {v:numOr(s.v,10),w:s.w==null?"":s.w,t:numOr(s.t,30),rest:o.rest||s.rest||60}})});
 con.sub=true;buzz([8,30,8]);renderX();renderPrev();touch();toast("Подставлено: "+n+" из "+con.cw.ex.length+" упражнений")}
function revertLast(){if(!con||!con.cw)return;if(con.pre){con.cw.ex=con.pre;con.pre=null}con.sub=false;buzz(8);renderX();renderPrev();touch();toast("Прежние значения возвращены")}
/* прошлая неделя по упражнению: только предыдущая тренировка, без накопления */
function lwBtn(r,att){return '<button class="lwp" '+att+' aria-expanded="false">'+ic("clock")+'Прошлая неделя'+((r.e.my||r.e.pain)?'<i class="dt'+(r.e.pain?" pk":"")+'"></i>':'')+'</button>'}
function lwBox(r){var e=r.e;return '<div class="acc lwa"><div><div class="lwb"><div class="lwh"><span class="lwd">'+dmy(r.h.d)+'</span>'+(e.pain?'<em class="pn">Дискомфорт</em>':'')+'</div><b>'+setsLine(e)+effTxt(e)+'</b><p>'+(e.my?esc(e.my):'Заметки не было')+'</p></div></div></div>'}
function updateMap(){var h=$("#mapHost");if(!h||!con)return;var L=loadOf(con.cw.ex);paintMap(h,L);setBars($("#lbs"),loadStd(con.cw.ex));$("#mapMin").textContent=con.cw.ex.length?plural(con.cw.ex.length,["упражнение","упражнения","упражнений"])+" · ~"+estMin(con.cw.ex)+" мин":""}
function xLab(ex){var out=[],g=0,L="абвгдежзик",k=0;
 for(var i=0;i<ex.length;i++){var s=i;while(i<ex.length-1&&ex[i].link)i++;g++;
  if(i>s){for(var j=s;j<=i;j++)out[j]=g+(L[j-s]||"")}else out[s]=String(g)}
 return out}
function xHtml(x,i,n){var e=exOf(x.id),ex=con.cw.ex,isOpen=!!openSet[x.u],pl=i>0&&ex[i-1].link,cls="xc"+(isOpen?" open":"")+(x.link?" sl":"")+(pl?" sp":""),tm=x.mode==="time",th=tm?"Сек":"Кг",kk=tm?"t":"w",lw=lwOf(con.p,con.w,x.id),fl=exFlag(x);
 var rows=x.sets.map(function(s,k){return '<span class="sn">'+(k+1)+'</span><input class="cell" type="number" inputmode="numeric" min="0" data-s="'+k+'" data-k="v" value="'+esc(s.v)+'" aria-label="Повторы, подход '+(k+1)+'"><input class="cell" type="number" inputmode="decimal" min="0" step="0.5" data-s="'+k+'" data-k="'+kk+'" value="'+esc(s[kk])+'" placeholder="—" aria-label="'+th+', подход '+(k+1)+'"><input class="cell" type="number" inputmode="numeric" min="0" data-s="'+k+'" data-k="rest" value="'+esc(s.rest)+'" aria-label="Отдых, подход '+(k+1)+'">'}).join("");
 var h='<div class="'+cls+'" data-u="'+esc(x.u)+'">'+(x.link&&!pl?'<span class="sstag">Суперсет</span>':"")+
 '<div class="xh"><button class="xtog" data-x="tog" aria-expanded="'+isOpen+'"><i class="n">'+xLab(ex)[i]+'</i><span class="t"><span class="xn">'+esc(e.n)+'</span><small data-sm>'+exSum(x)+'</small>'+flagLine(fl)+'</span></button><button class="ibtn" data-x="info" aria-label="Пояснение к упражнению">'+ic("info")+'</button><button class="dots" data-x="menu" aria-label="Действия">'+ic("dots")+'</button></div>'+
 '<div class="acc mn"><div><div class="xb">'+(fl?'<div class="rxx r'+fl.st+'"><span>'+(fl.stub?"Этого упражнения нет в каталоге":(fl.st===2?"Не рекомендуется при: ":"Осторожно при: ")+esc(whyTxt(e,0)))+'</span><button data-x="swap">Заменить</button></div>':"")+'<div class="tbl"><span class="th">№</span><span class="th">Повт.</span><button class="th gl" data-x="mode" aria-label="Переключить килограммы и секунды">'+th+ic("swap")+'</button><span class="th">Отдых, с</span>'+rows+'</div>'+
 '<div class="xtools"><button class="pbtn" data-x="addset">'+ic("plus")+'Подход</button><button class="pbtn" data-x="delset"'+(x.sets.length<2?" disabled":"")+'>'+ic("minus")+'Подход</button></div>'+
 (lw?'<div class="lwr">'+lwBtn(lw,'data-x="lw"')+'</div>'+lwBox(lw):'')+'<textarea class="note" rows="1" data-k="note" placeholder="Заметка тренера: темп, акцент, поправка">'+esc(x.note)+'</textarea></div></div></div></div>';
 if(i<n-1)h+='<div class="lkrow"><button class="lk'+(x.link?" on":"")+'" data-x="link" data-u="'+esc(x.u)+'" aria-label="Объединить в суперсет" aria-pressed="'+!!x.link+'">'+ic("link")+'</button></div>';
 return h}
function renderX(){if(!con||!con.cw)return;var ex=con.cw.ex,xl=$("#xl");
 xl.innerHTML=ex.length?ex.map(function(x,i){return xHtml(x,i,ex.length)}).join(""):'<div class="stubc"><b>Пока нет упражнений</b><span>Нажмите «Добавить упражнение», найдите нужное в библиотеке и добавьте. Подходы и отдых поставятся сами.</span></div>';
 $$("textarea.note",xl).forEach(grow)}
function grow(t){t.style.height="auto";t.style.height=Math.max(32,t.scrollHeight)+"px"}
/* перерисовать только тело одной карточки (подходы/режим), остальной список не трогаем */
function cardRefresh(x){if(!con||!con.cw)return;var i=con.cw.ex.indexOf(x),c=$('[data-u="'+x.u+'"]',cs);if(!c||i<0){renderX();return}
 var tmp=document.createElement("div");tmp.innerHTML=xHtml(x,i,con.cw.ex.length);var nc=tmp.firstElementChild,ob=$(".xb",c),nb=nc&&$(".xb",nc);if(!ob||!nb){renderX();return}
 swapPane(ob,function(){ob.innerHTML=nb.innerHTML;$$("textarea.note",ob).forEach(grow)},{out:false});
 var a=$("[data-sm]",c),b=$("[data-sm]",nc);if(a&&b)a.textContent=b.textContent}
var barSt=null;
function refreshBar(){var d=isDirty(),b=$("#cSave");
 if(barSt!==d){barSt=d;b.className="abtn main "+(d?"hl":"back");b.innerHTML=d?ic("disk")+"Сохранить":ic("back")+"Назад"}
 var c=$("#cCancel");c.disabled=!d;c.title=d?"Вернуть, как было":"Нет изменений"}
function touch(){if(!con)return;updateMap();refreshBar();schedCon()}
/* ввод в поля не меняет карту нагрузки: обновляем только кнопки и автосохранение */
function typed(){refreshBar();schedCon()}
function saveCon(quiet){if(!con||!con.cw)return;applyCon();con.snap=snapOf();refreshBar();saveNow();renderList();if(!quiet)toast("Сохранено")}
function xOf(el){var c=el.closest("[data-u]");if(!c)return null;var u=c.dataset.u;return {c:c,i:con.cw.ex.map(function(x){return x.u}).indexOf(u)}}
cs.addEventListener("input",function(e){var t=e.target;if(!con)return;if(t.id==="wNote"){con.cw.tn=t.value;grow(t);typed();return}var o=xOf(t);if(!o||o.i<0)return;var x=con.cw.ex[o.i];
 if(t.dataset.k==="note"){x.note=t.value;grow(t)}
 else if(t.dataset.s!=null){var v=capNum(t);x.sets[+t.dataset.s][t.dataset.k]=v;var sm=$("[data-sm]",o.c);if(sm)sm.textContent=exSum(x)}
 typed()});
cs.addEventListener("click",function(e){var b=e.target.closest("[data-x]");if(!b||!con)return;var k=b.dataset.x,ex=con.cw.ex;
 if(k==="link"){var i=ex.map(function(x){return x.u}).indexOf(b.dataset.u);if(i<0)return;ex[i].link=!ex[i].link;buzz(10);renderX();touch();toast(ex[i].link?"Суперсет: упражнения выполняются подряд":"Суперсет разъединён");return}
 var o=xOf(b);if(!o||o.i<0)return;var x=ex[o.i];
 if(k==="lw"){var a=o.c.querySelector(".lwa"),on=!a.classList.contains("open");a.classList.toggle("open",on);b.classList.toggle("on",on);b.setAttribute("aria-expanded",on);buzz(5);return}
 if(k==="tog"){var on2=!openSet[x.u];openSet[x.u]=on2;o.c.classList.toggle("open",on2);b.setAttribute("aria-expanded",on2);buzz(5)}
 else if(k==="mode"){x.mode=x.mode==="time"?"kg":"time";x.sets.forEach(function(s){if(x.mode==="time"){if(!s.t)s.t=30;s.v=1}else if(!(+s.v>1))s.v=10});buzz(8);openSet[x.u]=true;cardRefresh(x);touch();var g=$('[data-u="'+x.u+'"] .th.gl',cs);if(g){g.classList.add("spin")}}
 else if(k==="addset"){var l=x.sets[x.sets.length-1]||{v:12,w:"",t:30,rest:60};x.sets.push({v:l.v,w:l.w,t:l.t||30,rest:l.rest});openSet[x.u]=true;buzz(6);cardRefresh(x);touch()}
 else if(k==="delset"){if(x.sets.length>1){x.sets.pop();openSet[x.u]=true;buzz(5);cardRefresh(x);touch()}}
 else if(k==="info"){openInfo(x.id,false,x.u)}
 else if(k==="swap"){startSwap(x.u)}
 else if(k==="menu"){var it=[];if(o.i>0)it.push({ic:"up",t:"Выше",fn:function(){ex.splice(o.i-1,0,ex.splice(o.i,1)[0]);if(ex.length)ex[ex.length-1].link=false;renderX();touch()}});if(o.i<ex.length-1)it.push({ic:"down",t:"Ниже",fn:function(){ex.splice(o.i+1,0,ex.splice(o.i,1)[0]);if(ex.length)ex[ex.length-1].link=false;renderX();touch()}});it.push({ic:"trash",t:"Удалить упражнение",dn:true,fn:function(){ex.splice(o.i,1);if(ex[o.i-1]&&o.i>=ex.length)ex[o.i-1].link=false;renderPrev();renderX();touch();toast("Упражнение удалено")}});menu(it)}
});
$("#cName").addEventListener("keydown",function(e){if(e.key==="Enter")this.blur()});
$("#cName").addEventListener("input",function(){if(con){con.cw.name=this.value;refreshBar();schedCon()}});
$("#cCancel").onclick=function(){if(!con||!isDirty())return;revertCon();buzz(8);toast("Изменения отменены")};
function revertCon(){var s=JSON.parse(con.snap);con.cw.name=s[0];con.cw.ex=s[1];con.cw.tn=s[2]||"";$("#wNote").value=con.cw.tn;grow($("#wNote"));con.sub=false;con.pre=null;renderPrev();$("#cName").value=s[0];renderX();updateMap();refreshBar();applyCon();saveNow()}
$("#cSave").onclick=function(){if(!con)return;if(isDirty()){buzz([8,30,8]);saveCon()}else{closeCon()}};
$("#cBack").onclick=function(){if(!con)return;if(isDirty())dlgConfirm({title:"Оставить правки?",sub:"Изменения уже сохраняются сами. Можно оставить их или вернуть тренировку как она была.",ok:"Оставить и выйти",no:"Вернуть как было",fn:function(){saveCon(true);closeCon()},nofn:function(){revertCon();closeCon()}});else closeCon()};
$("#cGo").onclick=function(){if(!con)return;if(!con.cw.ex.length){toast("Сначала добавьте упражнение");openSearch();return}if(isDirty())saveCon(true);else saveNow();startLive(con.p,con.w)};

/* ---------- ограничения здоровья (RX) для текущего профиля ---------- */
function myProf(){var p=FS.get("profile");return p&&typeof p==="object"?p:{}}
function rxOn(){var p=myProf();try{return RX.keysOf(p).length>0||RX.pregOf(p)>0}catch(e){return false}}
function rxSig(){var p=myProf(),k="";try{k=RX.keysOf(p).join(",")+"|"+RX.pregOf(p)}catch(e){}return k}
function rxSt(e){if(!e||e.stub)return 0;try{return RX.status(e,myProf())}catch(err){return 0}}
function rxWhy(e,sev){if(!e||e.stub)return [];var a=[];try{a=RX.why(e,myProf())}catch(err){}return sev?a.filter(function(r){return r.sev===sev}):a}
function whyTxt(e,sev,n){var t=rxWhy(e,sev).map(function(r){return r.t});if(n&&t.length>n)t=t.slice(0,n).concat(["ещё "+(t.length-n)]);return t.join(", ")}
function rxLbl(st){return st===2?"не рекомендуется":"осторожно"}
function rxBadge(st,first){return st?'<i class="rx r'+st+(first?" f":"")+'">'+rxLbl(st)+'</i>':""}
/* упражнение, которого нет в каталоге (старые программы): тоже требует замены */
function exFlag(x){var e=exOf(x.id);if(e.stub)return {st:1,txt:"нет в каталоге",stub:true};var st=rxSt(e);return st?{st:st,txt:whyTxt(e,0,2)}:null}
function flagLine(f){return f?'<small class="rxl">'+(f.stub?'<i class="rx r1 f">нет в каталоге</i>Выберите замену':rxBadge(f.st,true)+esc(f.txt))+'</small>':""}
function flagCount(exs){var a=0,b=0;exs.forEach(function(x){var f=exFlag(x);if(f){if(f.st===2)b++;else a++}});return [a,b]}

/* ---------- поиск: нечёткий (FZ) + фильтры, по 40 + «Показать ещё» ---------- */
var sf={eq:"all",m:"all",lv:0,fit:false},swapU=null,swapOld=null,qv="",pick=[],sx={list:[],shown:0,hid:0},sxIO=null,sxT=0,PG=40,RK=null,rkSig="",fltDone=false;
function openSearch(o){buildCat();o=o||{};$("#q").value="";qv="";pick=[];
 swapU=o.swap||null;swapOld=null;
 if(swapU&&con){var xo=con.cw.ex.filter(function(x){return x.u===swapU})[0];swapOld=xo?exOf(xo.id):null}
 sf={eq:"all",m:o.m&&MSH[o.m]?o.m:"all",lv:0,fit:rxOn()};
 buildFilters();syncFilters();
 renderSearch();spUpd();openSheet("srchSheet");$("#slist").scrollTop=0;
 var ch=$("#mus .on");if(ch)$("#mus").scrollLeft=Math.max(0,ch.offsetLeft-60);else $("#mus").scrollLeft=0;$("#eqs").scrollLeft=0;
}
function buildFilters(){if(fltDone&&$("#eqs").dataset.n===String(catLen))return;fltDone=true;$("#eqs").dataset.n=String(catLen);
 $("#eqs").innerHTML='<button class="chip" data-e="all">Все</button>'+EQP.map(function(k){return '<button class="chip" data-e="'+esc(k)+'">'+esc(eqName(k))+'<small>'+(EQC[k]||0)+'</small></button>'}).join("");
 $("#mus").innerHTML='<button class="chip sm" data-m="all">Все мышцы</button>'+MUSC.map(function(r){return '<button class="chip sm" data-m="'+esc(r[0])+'">'+esc(r[1])+'</button>'}).join("");
 $("#lvs").innerHTML='<button class="chip sm" data-l="0">Любой уровень</button>'+[1,2,3].map(function(l){return '<button class="chip sm" data-l="'+l+'">'+LV[l].charAt(0).toUpperCase()+LV[l].slice(1)+'</button>'}).join("")}
function syncFilters(){
 $$("#eqs [data-e]").forEach(function(b){var on=b.dataset.e===sf.eq;b.classList.toggle("on",on);b.setAttribute("aria-pressed",on)});
 $$("#mus [data-m]").forEach(function(b){var on=b.dataset.m===sf.m;b.classList.toggle("on",on);b.setAttribute("aria-pressed",on)});
 $$("#lvs [data-l]").forEach(function(b){var on=+b.dataset.l===sf.lv;b.classList.toggle("on",on);b.setAttribute("aria-pressed",on)});
 var f=$("#fit"),has=rxOn();f.style.display=has?"":"none";f.classList.toggle("on",sf.fit&&has);f.setAttribute("aria-checked",!!(sf.fit&&has));
 var sw=$("#swn");sw.style.display=swapU?"":"none";if(swapU)sw.innerHTML='<span>Замена: <b>'+esc(swapOld?swapOld.n:"упражнение")+'</b></span><button data-swx aria-label="Отменить замену">'+ic("x")+'</button>'}
function filtChanged(){syncFilters();swapPane("#slist",renderSearch,{out:false,top:true})}
$("#eqs").addEventListener("click",function(e){var b=e.target.closest("[data-e]");if(!b||sf.eq===b.dataset.e)return;sf.eq=b.dataset.e;buzz(5);filtChanged()});
$("#mus").addEventListener("click",function(e){var b=e.target.closest("[data-m]");if(!b)return;sf.m=sf.m===b.dataset.m?"all":b.dataset.m;buzz(5);filtChanged()});
$("#lvs").addEventListener("click",function(e){var b=e.target.closest("[data-l]");if(!b)return;var v=+b.dataset.l;sf.lv=sf.lv===v?0:v;buzz(5);filtChanged()});
$("#fit").addEventListener("click",function(){sf.fit=!sf.fit;buzz(6);filtChanged()});
$("#swn").addEventListener("click",function(e){if(e.target.closest("[data-swx]")){closeSheet("srchSheet");swapU=null}});
$("#q").addEventListener("keydown",function(e){if(e.key==="Enter")this.blur()});
$("#slist").addEventListener("touchmove",function(){var q=$("#q");if(document.activeElement===q)q.blur()},{passive:true});
$("#q").addEventListener("input",function(){var v=this.value.trim();clearTimeout(sxT);sxT=setTimeout(function(){qv=v;renderSearch()},120)});
/* порядок без запроса: подходящие по ограничениям, затем своё оборудование и посильный уровень; при замене сначала тот же паттерн движения */
function baseOrder(){var p=myProf(),pat=swapOld&&swapOld.pat?swapOld.pat:"",sig=rxSig()+"|"+(p.eq||[]).join(",")+"|"+(+p.lvl||1)+"|"+pat+"|"+catLen;
 if(RK&&rkSig===sig)return RK;var own={body:1},lv=+p.lvl>0?+p.lvl:1;(Array.isArray(p.eq)?p.eq:[]).forEach(function(k){own[k]=1});
 var a=EX.map(function(e,i){return [pat&&e.pat===pat?0:1,rxSt(e),own[e.eq]?0:1,e.l>lv+1?1:0,i,e]});
 a.sort(function(x,y){for(var k=0;k<5;k++)if(x[k]!==y[k])return x[k]-y[k];return 0});rkSig=sig;RK=a.map(function(r){return r[5]});return RK}
var IXR=null,IXRk=null;
function ixRanked(){var ix=ixGet(),rk=baseOrder();if(IXR&&IXRk===rk&&IXR.n===ix)return IXR.a;var by={};ix.forEach(function(r){by[r.it.id]=r});IXR={n:ix,a:rk.map(function(e){return by[e.id]}).filter(Boolean)};IXRk=rk;return IXR.a}
function searchList(){var base=qv?FZ.search(ixRanked(),qv):baseOrder(),out=[],hid=0,inW={},fit=sf.fit&&rxOn(),i,e;
 if(swapU&&con)con.cw.ex.forEach(function(x){inW[x.id]=1});
 for(i=0;i<base.length;i++){e=base[i];if(sf.eq!=="all"&&e.eq!==sf.eq)continue;if(sf.m!=="all"&&e.m!==sf.m)continue;if(sf.lv&&e.l!==sf.lv)continue;if(inW[e.id])continue;
  if(fit&&rxSt(e)===2){hid++;continue}out.push(e)}
 if(qv&&!fit&&rxOn()){var ok=[],bad=[];out.forEach(function(x){(rxSt(x)===2?bad:ok).push(x)});out=ok.concat(bad)}
 sx.hid=hid;return out}
function srRow(e){var on=pick.indexOf(e.id)>-1,st=rxSt(e),sub=[MSH[e.m]||mainG(e),eqName(e.eq),LV[e.l]].filter(Boolean).join(" · ");
 return '<div class="sr" data-id="'+esc(e.id)+'"><button class="tx" data-pv><b>'+esc(e.n)+'</b><span>'+esc(sub)+'</span>'+(st?'<span class="rxr">'+rxBadge(st,true)+'<u>'+esc(whyTxt(e,0,2))+'</u></span>':'')+'</button><button class="rbtn" data-pv aria-label="Предпросмотр">'+ic("eye")+'</button><button class="rbtn add'+(on?" in":"")+'" data-add aria-pressed="'+on+'" aria-label="'+(on?"Убрать из выбора":"Выбрать")+'">'+ic(on?"check":"plus")+'</button></div>'}
function filtOn(){return !!(qv||sf.eq!=="all"||sf.m!=="all"||sf.lv)}
function renderSearch(){var host=$("#slist");if(sxIO){sxIO.disconnect();sxIO=null}
 if(!EX.length){host.innerHTML='<div class="stubc"><b>Каталог не загружен</b><span>Обновите приложение, и упражнения появятся здесь.</span></div>';$("#scnt").textContent="";return}
 sx.list=searchList();sx.shown=0;host.innerHTML="";host.scrollTop=0;
 $("#scnt").innerHTML=(sx.list.length?(filtOn()?"Найдено: ":"Всего: ")+sx.list.length:"")+(sx.hid?(sx.list.length?" · ":"")+'скрыто: '+sx.hid:"");
 if(!sx.list.length){var hv=sx.hid>0;host.innerHTML='<div class="stubc"><b>'+(hv?"Всё скрыто по ограничениям":"Ничего не нашли")+'</b><span>'+(hv?"Подходящих под эти фильтры нет. Можно показать и те, что не рекомендуются при ваших ограничениях, или сменить фильтры.":"Попробуйте часть слова, другое слово, мышцу или оборудование. Поиск понимает окончания и опечатки.")+'</span>'+(hv?'<button class="cta l" id="sFit" style="margin-top:8px">Показать все</button>':'')+(filtOn()?'<button class="cta l" id="sRst" style="margin-top:8px">Сбросить поиск и фильтры</button>':'')+'</div>';
  var r=$("#sRst");if(r)r.onclick=function(){$("#q").value="";qv="";sf.eq="all";sf.m="all";sf.lv=0;syncFilters();renderSearch()};var f=$("#sFit");if(f)f.onclick=function(){sf.fit=false;syncFilters();renderSearch()};return}
 appendRows()}
function appendRows(){var L=sx.list,from=sx.shown,chunk=L.slice(from,from+PG),host=$("#slist"),m=$("#smore");if(m)m.remove();sx.shown=from+chunk.length;
 host.insertAdjacentHTML("beforeend",chunk.map(srRow).join(""));
 if(sx.shown<L.length){host.insertAdjacentHTML("beforeend",'<div class="smore" id="smore"><button class="cta l" id="smb">Показать ещё '+Math.min(PG,L.length-sx.shown)+' из '+(L.length-sx.shown)+'</button></div>');
  $("#smb").onclick=function(){buzz(5);appendRows()};
  if(sxIO)sxIO.disconnect();
  if("IntersectionObserver" in window){sxIO=new IntersectionObserver(function(en){if(en[0].isIntersecting){sxIO.disconnect();appendRows()}},{root:host,rootMargin:"260px"});sxIO.observe($("#smore"))}}}
function spUpd(){var sp=$("#spick"),n=pick.length;sp.classList.toggle("on",n>0);if(n)$("#spOk").textContent=swapU?"Заменить на выбранное":(n===1?"Добавить в тренировку":"Добавить в тренировку · "+n)}
function rowOf(id){return $$("#slist .sr").filter(function(r){return r.dataset.id===id})[0]}
function togPick(id,btn){var i=pick.indexOf(id),on=i<0;
 if(swapU&&on&&pick.length){pick.forEach(function(o){var r=rowOf(o);if(r){var b=$("[data-add]",r);b.classList.remove("in");b.setAttribute("aria-pressed","false");b.innerHTML=ic("plus")}});pick=[]}
 if(on)pick.push(id);else pick.splice(i,1);buzz(on?[6,24,6]:5);
 if(btn){btn.classList.toggle("in",on);btn.setAttribute("aria-pressed",on);btn.innerHTML=ic(on?"check":"plus");if(on)pls(btn,"var(--coral)")}spUpd()}
$("#slist").addEventListener("click",function(e){var r=e.target.closest(".sr");if(!r)return;var id=r.dataset.id;if(e.target.closest("[data-add]"))togPick(id,e.target.closest("[data-add]"));else if(e.target.closest("[data-pv]"))openInfo(id,true)});
$("#spOk").onclick=function(){if(swapU)doSwap(pick[0]);else addMany(pick.slice())};
/* мягкое подтверждение для упражнений «не рекомендуется» */
function rxGate(ids,go){var bad=ids.map(exOf).filter(function(e){return rxSt(e)===2});if(!bad.length){go();return}
 var one=bad.length===1;
 dlgConfirm({title:one?esc(bad[0].n):"Не рекомендуется при ваших ограничениях",sub:one?"Не рекомендуется при: "+esc(whyTxt(bad[0],2))+". Добавить всё равно?":bad.map(function(e){return "«"+esc(e.n)+"»"}).join(", ")+". Добавить всё равно?",ok:"Добавить всё равно",no:"Выбрать другое",danger:true,fn:go,nofn:reopenSearch,dis:reopenSearch})}
function reopenSearch(){if($("#srchSheet")&&!$("#sum.on"))openSheet("srchSheet")}
function cautionToast(es){var a=es.filter(function(e){return rxSt(e)===1});if(!a.length)return false;
 toast(es.length===1?"Осторожно: "+whyTxt(a[0],1,2):"Добавлено: "+es.length+" · осторожно: "+a.map(function(e){return e.n}).slice(0,1).join("")+(a.length>1?" и ещё "+(a.length-1):""));return true}
function addMany(ids){if(!con||!ids.length)return;rxGate(ids,function(){doAdd(ids)})}
function doAdd(ids){if(!con)return;var first=null;ids.forEach(function(id){var x=GEN.mkEx(id);con.cw.ex.push(x);if(!first)first=x;openSet[x.u]=ids.length===1});closeAll();pick=[];con.sub=false;renderPrev();renderX();touch();buzz([8,30,8]);
 if(!cautionToast(ids.map(exOf)))toast(ids.length===1?"Добавлено: "+plural(first.sets.length,["подход","подхода","подходов"])+", отдых "+(first.sets[0]?first.sets[0].rest:60)+" с":"Добавлено упражнений: "+ids.length);
 setTimeout(function(){var c=$('[data-u="'+first.u+'"]',cs);if(c)cs.scrollTo({top:c.offsetTop-120,behavior:"smooth"})},250)}
/* замена упражнения: тот же номер, число подходов и отдых сохраняются */
function startSwap(u){if(!con)return;var x=con.cw.ex.filter(function(q){return q.u===u})[0];if(!x)return;var e=exOf(x.id);closeSheet("winInfo");buzz(6);openSearch({swap:u,m:e.stub?"":e.m})}
function doSwap(id){if(!con||!swapU||!id)return;var u=swapU;rxGate([id],function(){var i=con.cw.ex.map(function(q){return q.u}).indexOf(u);if(i<0){closeAll();return}
  var old=con.cw.ex[i],nx=GEN.mkEx(id,{n:old.sets.length,rest:old.sets[0]&&old.sets[0].rest!==""?old.sets[0].rest:undefined});nx.link=!!old.link;
  con.cw.ex[i]=nx;swapU=null;swapOld=null;openSet[nx.u]=true;closeAll();pick=[];con.sub=false;renderPrev();renderX();touch();buzz([8,30,8]);
  if(!cautionToast([exOf(id)]))toast("Заменено: "+plural(nx.sets.length,["подход","подхода","подходов"])+" сохранено");
  setTimeout(function(){var c=$('[data-u="'+nx.u+'"]',cs);if(c)cs.scrollTo({top:c.offsetTop-120,behavior:"smooth"})},250)})}

function uniq(a){return a.filter(function(v,i){return a.indexOf(v)===i})}
/* ---------- карточка упражнения (стеклянное окно) ---------- */
function secG(e){var g=[];if(Array.isArray(e.pc))e.pc.forEach(function(r){if(r&&r[0])g.push(r[0])});else (e.s||[]).forEach(function(z){g.push(grp(z,e))});return uniq(g.filter(function(x){return x&&x!==mainG(e)}))}
/* блок «Ограничения»: сначала не рекомендуется, потом с осторожностью; внутри — по группам RX.GROUPS, совпадения с профилем выделены */
function rxBlock(e){var all=RX.all(e),pt=RX.pregTxt(e),mine={},p=myProf(),pr=RX.pregOf(p);rxWhy(e).forEach(function(r){mine[r.key]=r.sev});
 if(!all.length&&(!e.pg||/^0*$/.test(e.pg)))return "";
 var h='<div class="sec sm rxs"><h4>Ограничения</h4>';
 [[2,"Не рекомендуется при"],[1,"С осторожностью при"]].forEach(function(sv){var rows="";
  RX.GROUPS.forEach(function(g){var it=all.filter(function(r){return r.sev===sv[0]&&r.g===g[0]});if(!it.length)return;
   it.sort(function(a,b){return (mine[b.key]?1:0)-(mine[a.key]?1:0)});
   rows+='<div class="rxg"><span class="gl">'+esc(g[1])+'</span>'+it.map(function(r){return '<span class="rp'+(mine[r.key]?" m r"+sv[0]:"")+'">'+esc(r.t)+'</span>'}).join("")+'</div>'});
  if(rows)h+='<div class="rxb"><div class="rxh r'+sv[0]+'">'+sv[1]+'</div>'+rows+'</div>'});
 if(pt&&e.pg&&!/^0+$/.test(e.pg)){var parts=pt.split(" · "),g=String(e.pg||"");
  h+='<div class="rxb"><div class="rxh">Беременность</div><div class="rxg">'+parts.map(function(t,i){var v=+g[i]||0,m=pr===4?(v>0&&v===Math.max(+g[0]||0,+g[1]||0,+g[2]||0)):pr===i+1;return '<span class="rp'+(m&&v?" m r"+v:"")+'">'+esc(t)+'</span>'}).join("")+'</div></div>'}
 if(all.length||pt)h+='<p class="rxn">Подсвечено то, что относится к вам. Ориентир, не медицинская рекомендация.</p>';
 return h+'</div>'}
function openInfo(id,fromSearch,fromU){var e=exOf(id),side=({back:1,traps:1,lowback:1,glutes:1,hamstrings:1})[e.p]?"back":"front",L={};L[e.p]=1;(e.s||[]).forEach(function(z){L[z]=Math.max(L[z]||0,.45)});
 var w=$("#winInfo"),sec=function(t,x,c){return x?'<div class="sec'+(c?" "+c:"")+'"><h4>'+t+'</h4><p>'+esc(x)+'</p></div>':""},st=rxSt(e),why=rxWhy(e),mob=String(e.mob||"").trim();
 var errs=String(e.err||"").split("·").map(function(s){return s.trim()}).filter(Boolean);
 var verdict=e.stub?'<div class="rxv r1"><b>Нет в каталоге</b>Это упражнение из старой версии каталога. Выберите замену.</div>':(st?'<div class="rxv r'+st+'"><b>'+(st===2?"Для вас: не рекомендуется":"Для вас: с осторожностью")+'</b>'+esc(why.map(function(r){return r.t}).join(", "))+'</div>':"");
 w.innerHTML='<div class="wb"><h3>'+esc(e.n)+'</h3><div class="tgs">'+(mainG(e)?'<span class="tg p">'+esc(mainG(e))+'</span>':'')+secG(e).slice(0,3).map(function(g){return '<span class="tg">'+esc(g)+'</span>'}).join("")+'<span class="tg">'+esc(eqName(e.eq))+'</span>'+(LV[e.l]?'<span class="tg">'+LV[e.l]+'</span>':'')+(e.fmt==="time"?'<span class="tg">на время</span>':'')+'</div>'+
 '<div class="vid" id="vid">'+figSvg(side,sexNow(),"fg figon")+'<span class="bd">Нагрузка</span></div><p class="small" style="text-align:center;margin-top:-4px">Видеоразбор появится после съёмки</p>'+verdict+
 sec("Техника",e.cue)+(errs.length?'<div class="sec"><h4>Частые ошибки</h4><ul class="el">'+errs.map(function(s){return '<li>'+esc(s)+'</li>'}).join("")+'</ul></div>':"")+sec("Особое внимание",FOCUS[e.p]||"")+
 (e.stub?"":rxBlock(e))+sec("Прогрессия",e.up,"sm")+sec("Регрессия",e.dn,"sm")+(mob&&!/^не критич/i.test(mob)?sec("Предусловия по мобильности",mob,"sm"):"")+
 (e.pl||e.r?'<div class="sec sm kv">'+(e.pl?'<p><span>Где</span>'+esc(e.pl)+'</p>':'')+(e.r?'<p><span>Диапазон</span>'+esc(e.r)+'</p>':'')+'</div>':"")+'</div>'+
 '<div class="wf"><button class="cta l" id="iX">Закрыть</button>'+(fromSearch?'<button class="cta go" id="iA">'+(pick.indexOf(id)>-1?"Убрать из выбора":(swapU?"Выбрать для замены":"Выбрать"))+'</button>':(fromU&&(st||e.stub)?'<button class="cta go" id="iS">Заменить</button>':''))+'</div>';
 paintMap($("#vid"),L);
 $("#iX").onclick=function(){closeSheet("winInfo")};
 var isb=$("#iS");if(isb)isb.onclick=function(){startSwap(fromU)};
 if(fromSearch)$("#iA").onclick=function(){closeSheet("winInfo");var r=rowOf(id);if(r)togPick(id,$("[data-add]",r));else{var i=pick.indexOf(id);if(i<0)pick.push(id);else pick.splice(i,1);spUpd()}};
 w.classList.add("on");syncScrim();buzz(8);var wb=$(".wb",w);if(wb)wb.scrollTop=0}

/* ---------- программа: «Подробнее» ---------- */
var GR_ALL=["Плечи","Мышцы груди","Мышцы спины","Бицепс","Трицепс","Предплечье","Мышцы кора","Ягодицы","Передняя поверхность бедра","Задняя поверхность бедра","Мышцы голени"];
var GP={UP:["Плечи","Мышцы груди","Мышцы спины","Бицепс","Трицепс","Предплечье"],LO:["Ягодицы","Передняя поверхность бедра","Задняя поверхность бедра","Мышцы голени"],PU:["Мышцы груди","Плечи","Трицепс"],PL:["Мышцы спины","Бицепс","Предплечье"],FR:["Мышцы груди","Мышцы кора","Передняя поверхность бедра"],BK:["Мышцы спины","Ягодицы","Задняя поверхность бедра"]};
function gsum(G,a){return a.reduce(function(s,g){return s+(G[g]||0)},0)}
function progStats(p){var G={},st={w:p.workouts.length,ex:0,sets:0,min:0,vol:0,rest:0,rn:0};GR_ALL.forEach(function(g){G[g]=0});
 p.workouts.forEach(function(w){st.min+=estMin(w.ex);w.ex.forEach(function(x){st.ex++;var sh=exShare(exOf(x.id)),n=x.sets.length;st.sets+=n;Object.keys(sh).forEach(function(g){G[g]=(G[g]||0)+n*sh[g]/100});x.sets.forEach(function(s){st.rest+=nz(s.rest,60);st.rn++;if(x.mode==="kg"&&+s.w>0)st.vol+=nz(s.v,0)*(+s.w)})})});
 var pairs=[["Верх","Низ",gsum(G,GP.UP),gsum(G,GP.LO)],["Жим","Тяга",gsum(G,GP.PU),gsum(G,GP.PL)],["Передняя цепь","Задняя цепь",gsum(G,GP.FR),gsum(G,GP.BK)]].map(function(r){var t=r[2]+r[3],sh=t?r[2]/t:.5;return {a:r[0],b:r[1],va:r[2],vb:r[3],sh:sh,sc:t?1-Math.abs(2*sh-1):null,t:t}});
 var sc=pairs.filter(function(q){return q.sc!=null}),score=sc.length?Math.round(sc.reduce(function(s,q){return s+q.sc},0)/sc.length*100):0;
 return {G:G,st:st,pairs:pairs,score:score,core:G["Мышцы кора"]||0}}
function pairVerdict(q){if(!q.t)return {t:"Пока нет данных",c:"n"};var d=Math.abs(q.sh-.5);if(d<=.1)return {t:"Ровно",c:"g"};var big=q.sh>.5?q.a:q.b;return {t:"Акцент: "+big.toLowerCase(),c:d<=.25?"n":"p"}}
function progHist(p){var ids={};p.workouts.forEach(function(w){ids[w.id]=w});var from=addDays(todayIso(),-27),ws=weekFrom(),n4=0,wk=0,last=null,sp=0,sn=0;
 HIST.forEach(function(h){var mine=h.wid?!!ids[h.wid]:(h.pn===p.name);if(!mine)return;if(!last||h.d>last.d)last=h;if(h.d>=from){n4++;if(h.pct!=null&&isFinite(+h.pct)){sp+=+h.pct;sn++}}if(h.d>=ws)wk++});
 return {n4:n4,wk:wk,last:last,avg:sn?Math.round(sp/sn):null}}
function openProg(p){var w=$("#winPg"),S=progStats(p);
 if(!p.workouts.length||!S.st.sets){w.innerHTML='<div class="wb"><span class="eyebrow">Программа</span><h3>'+esc(p.name)+'</h3><p class="small" style="font-size:14px;color:var(--ink2)">Здесь появится нагрузка по группам мышц и баланс программы. Добавьте тренировки и упражнения.</p></div><div class="wf"><button class="cta l" id="pgX">Закрыть</button><button class="cta go" id="pgG">К тренировкам</button></div>';$("#pgX").onclick=function(){closeSheet("winPg")};$("#pgG").onclick=function(){closeSheet("winPg");goProg(p.id)};w.classList.add("on");syncScrim();buzz(8);return}
 var st=S.st,maxG=Math.max.apply(null,GR_ALL.map(function(g){return S.G[g]})),PH=progHist(p);
 var tile=function(b,s){return '<div class="st"><b>'+b+'</b><span>'+s+'</span></div>'};
 var rows=GR_ALL.map(function(g){return [g,S.G[g]]}).sort(function(a,b){return b[1]-a[1]}).map(function(r){var n=r[1],cls=n===0?"z":n<6?"lo":n>20?"hi":"ok",tx=n===0?"нет нагрузки":n<6?"мало":n>20?"много":"в норме";
  return '<div class="pgr '+cls+'"><span class="pn">'+r[0]+'<em>'+tx+'</em></span><b>'+f1(n)+'</b><i><s data-w="'+(maxG>0?Math.round(n/maxG*100):0)+'"></s></i></div>'}).join("");
 var pr=S.pairs.map(function(q){var v=pairVerdict(q),pa=Math.round(q.sh*100);return '<div class="bal"><div class="bt"><span>'+q.a+'</span><span>'+q.b+'</span></div><div class="bb"><i data-w="'+(q.t?pa:0)+'"></i></div><div class="bp"><b>'+(q.t?pa:"—")+'%</b><span class="'+v.c+'">'+v.t+'</span><b>'+(q.t?100-pa:"—")+'%</b></div></div>'}).join("");
 var zero=GR_ALL.filter(function(g){return S.G[g]===0}),many=GR_ALL.filter(function(g){return S.G[g]>20}),recs=[];
 if(zero.length)recs.push("Нет нагрузки: "+zero.slice(0,4).join(", ").toLowerCase()+(zero.length>4?" и ещё "+(zero.length-4):"")+". Добавьте по одному-два упражнения, если это не часть замысла.");
 S.pairs.forEach(function(q){if(q.t&&q.sc<.6&&q.a!=="Верх"){var big=q.sh>.5?q.a:q.b,sm=q.sh>.5?q.b:q.a;recs.push("Сейчас больше «"+big.toLowerCase()+"», чем «"+sm.toLowerCase()+"». Добавьте 2–3 подхода на «"+sm.toLowerCase()+"».")}});
 var up=S.pairs[0];if(up.t&&up.sc<.6)recs.push("Заметный акцент: "+(up.sh>.5?"верх":"низ")+" тела. Для целевой программы это нормально, для общей подготовки стоит выровнять.");
 if(many.length)recs.push("Много подходов на «"+many[0].toLowerCase()+"». Следите за восстановлением и сном.");
 if(!recs.length)recs.push("Нагрузка распределена ровно. Можно прогрессировать весом или повторами.");
 var avgRest=st.rn?Math.round(st.rest/st.rn):0;
 var hsec='<div class="sec"><h4>Выполнение</h4>'+(PH.last?'<div class="stats">'+tile(PH.wk+" из "+st.w,"на этой неделе")+tile(PH.n4,"за 4 недели")+tile(PH.avg!=null?PH.avg+"%":"—","выполнение, ср.")+'</div><p class="small sm2">Последняя тренировка: '+dmy(PH.last.d)+' · '+agoTxt(PH.last.d)+'</p>':'<p class="small" style="font-size:13px;color:var(--ink2)">По этой программе пока не было тренировок. После первой здесь появятся цифры выполнения.</p>')+'</div>';
 w.innerHTML='<div class="wb"><span class="eyebrow">Программа · подробнее</span><h3>'+esc(p.name)+'</h3>'+(p.desc?'<p class="small" style="font-size:13px;color:var(--ink2);margin-top:-6px">'+esc(p.desc)+'</p>':'')+
  '<div class="stats s6">'+tile(st.w,"тренировок")+tile(st.ex,"упражнений")+tile(st.sets,"подходов в неделю")+tile("~"+st.min,"мин в неделю")+tile(st.vol?Math.round(st.vol).toLocaleString("ru-RU"):"—","кг объём")+tile(avgRest+" с","отдых, средний")+'</div>'+hsec+
  '<div class="sec"><h4>Подходы по группам мышц, в неделю</h4><div class="pgl">'+rows+'</div><p class="small" style="margin-top:6px">Ориентир: 6–20 подходов в неделю на группу. Подходы делятся между основной и вспомогательными мышцами.</p></div>'+
  '<div class="sec"><h4>Сбалансированность нагрузки</h4><div class="score"><span class="sv">'+S.score+'</span><span class="sl">из 100<small>Чем ближе пары к 50/50, тем выше</small></span></div>'+pr+'<p class="small sm2">Кор: '+f1(S.core)+' '+(Math.round(S.core)===1?"подход":"подходов")+' в неделю</p></div>'+
  '<div class="sec"><h4>Что можно улучшить</h4><div class="rcs">'+recs.map(function(r){return '<p>'+r+'</p>'}).join("")+'</div></div></div>'+
  '<div class="wf"><button class="cta l" id="pgX">Закрыть</button><button class="cta go" id="pgG">К тренировкам</button></div>';
 $("#pgX").onclick=function(){closeSheet("winPg")};
 $("#pgG").onclick=function(){closeSheet("winPg");goProg(p.id)};
 w.classList.add("on");syncScrim();buzz(8);
 requestAnimationFrame(function(){requestAnimationFrame(function(){$$("[data-w]",w).forEach(function(i){i.style.width=i.dataset.w+"%"})})});
 var wb=$(".wb",w);if(wb)wb.scrollTop=0}


/* ---------- режим тренировки (состояние хранится в FS.live, таймеры по меткам времени) ---------- */
var lvTick=null,lvT=0,sl=$("#scLive");
function liveSnap(){var gn=$("#gNote");if(gn)lv.g=gn.value;
 return {v:1,pid:lv.pid,wid:lv.wid,k:lv.k,pn:lv.pn,name:lv.name,tn:lv.tn,t0:lv.t0,pSum:lv.pSum||0,paused:!!lv.paused,pAt:lv.pAt||0,last:Date.now(),g:lv.g||"",
  ex:lv.ex.map(function(x){return {u:x.u,id:x.id,mode:x.mode,sets:x.sets,eff:x.eff||0,my:x.my||"",pain:!!x.pain,note:x.note||"",open:!!x.open}}),
  rt:{pre:rt.pre,tot:rt.tot,end:rt.run?rt.end:0}}}
function saveLive(now){if(!lv)return;clearTimeout(lvT);if(now){lvT=0;FS.set("live",liveSnap())}else lvT=setTimeout(function(){lvT=0;if(lv)FS.set("live",liveSnap())},200)}
function lvSec(){return lv?liveSec(lv):0}
function lvTickFn(){if(!lv)return;var s=lvSec();$("#lClock").textContent=fmt(s);$("#pillT").textContent=(lv.paused?"Пауза ":"Тренировка ")+fmt(s)}
function coachRecent(){return coachNoteRecent()}
function enterLive(){renderLive();app.dataset.mode="live";$("#sLive").classList.add("on");$("#pillL").classList.remove("on");sl.scrollTop=0;
 $("#lclk").classList.toggle("paused",!!lv.paused);
 con=null;setTimeout(function(){if(app.dataset.mode!=="con")$("#sCon").classList.remove("on")},720);
 clearInterval(lvTick);lvTick=setInterval(lvTickFn,1000);lvTickFn()}
function startLive(p,w){
 if(lv){showLive();if(lv.wid!==w.id)toast("Сначала завершите текущую тренировку");return}
 saveNow();
 lv={v:1,pid:p.id,wid:w.id,k:hk(w),pn:p.name,name:w.name,tn:w.tnote||coachRecent()||"",t0:Date.now(),pSum:0,paused:false,pAt:0,g:"",
  ex:clone(w.ex).map(function(x){x.sets.forEach(function(s){s.done=false});x.eff=0;x.my="";x.open=true;x.nt=false;x.pain=false;x.lw=lwOf(p,w,x.id);if(x.lw)x.sets.forEach(function(s,k){var o=x.lw.e.sets[k];if(!o)return;if(o.v!=null&&o.v!=="")s.v=o.v;if(o.w!=null&&o.w!=="")s.w=o.w;if(o.t!=null&&o.t!==""&&x.mode==="time")s.t=o.t});return x})};
 rtReset(+(lv.ex[0]&&lv.ex[0].sets[0]&&lv.ex[0].sets[0].rest)||60);
 enterLive();saveLive(true);buzz([10,40,10]);toast("Тренировка началась")}
function resumeLive(){var s=savedLive();if(!s){renderList();return}if(lv){showLive();return}s=clone(s);
 var p=findP(s.pid),w=p&&findW(p,s.wid),now=Date.now(),last=+s.last||now;
 s.pSum=+s.pSum||0;if(!s.paused&&now-last>45*60000)s.pSum+=now-last-60000;
 s.tn=s.tn||"";s.g=s.g||"";
 s.ex.forEach(function(x){x.sets=Array.isArray(x.sets)?x.sets:[];x.eff=+x.eff||0;x.my=x.my||"";x.pain=!!x.pain;x.note=x.note||"";x.nt=false;if(x.open==null)x.open=true;if(!x.u)x.u=uid();
  x.sets.forEach(function(q){q.v=numOr(q.v,10);if(q.w==null)q.w="";q.t=numOr(q.t,30);q.rest=numOr(q.rest,60);q.done=!!q.done});
  x.lw=w?lwOf(p,w,x.id):null});
 lv=s;rtRestore(s.rt);enterLive();saveLive(true);buzz([8,30,8])}
function showLive(){if(!lv)return;app.dataset.mode="live";$("#sLive").classList.add("on");$("#pillL").classList.remove("on")}
function minLive(){if(!lv)return;app.dataset.mode="list";$("#sLive").classList.remove("on");$("#pillL").classList.add("on")}
function effCap(v){return v>=10?"На пределе, запаса не осталось":v>=6?"В запасе ещё "+plural(10-v,["повтор","повтора","повторов"]):"Лёгкая работа, большой запас"}
function effPill(x){return x.eff?"Усилие "+x.eff+" · изменить":"Оценить усилие"}
function lxHtml(x,i){var e=exOf(x.id),finished=x.sets.every(function(s){return s.done}),tm=x.mode==="time",th=tm?"Сек":"Кг",kk=tm?"t":"w";
 var rows=x.sets.map(function(s,k){return '<div class="lrow'+(s.done?" done":"")+'"><span class="sn">'+(k+1)+'</span><input class="cell" type="number" inputmode="numeric" data-s="'+k+'" data-k="v" value="'+esc(s.v)+'" aria-label="Повторы, подход '+(k+1)+'"><input class="cell" type="number" inputmode="decimal" data-s="'+k+'" data-k="'+kk+'" value="'+esc(s[kk])+'" placeholder="—" aria-label="'+th+', подход '+(k+1)+'"><input class="cell" type="number" inputmode="numeric" data-s="'+k+'" data-k="rest" value="'+esc(s.rest)+'" aria-label="Отдых, подход '+(k+1)+'"><button class="dnb" data-l="done" data-s="'+k+'" aria-label="Подход '+(k+1)+' выполнен" aria-pressed="'+!!s.done+'">'+ic("check")+'</button></div>'}).join("");
 var wheel="";for(var q=1;q<=10;q++)wheel+='<div class="wi" data-v="'+q+'">'+q+'</div>';
 return '<div class="xc lx'+(x.open?" open":"")+'" data-u="'+esc(x.u)+'"><div class="xh"><button class="xtog" data-l="tog" aria-expanded="'+!!x.open+'"><i class="n" style="'+(finished?"background:var(--green);color:#fff":"")+'">'+(finished?ic("check").replace('class="i"','class="i" style="width:14px;height:14px;stroke-width:2.6"'):xLab(lv.ex)[i])+'</i><span class="t"><span class="xn">'+esc(e.n)+'</span><small data-sm>'+exSum(x)+'</small>'+flagLine(exFlag(x))+'</span></button><button class="ibtn" data-l="info" aria-label="Информация об упражнении">'+ic("info")+'</button></div>'+
 '<div class="pills">'+(x.note?'<button class="pl2" data-l="nt">'+ic("note")+'Заметка тренера · '+(x.nt?"Скрыть":"Посмотреть")+'</button>':"")+(x.lw?lwBtn(x.lw,'data-l="lw"'):"")+'<button class="pl2 pn'+(x.pain?" on":"")+'" data-l="pain" aria-pressed="'+!!x.pain+'">Дискомфорт</button><button class="pl2 ef'+(finished||x.eff?" show":"")+'" data-l="efp">'+effPill(x)+'</button></div>'+
 (x.note?'<div class="acc'+(x.nt?" open":"")+'"><div><div style="padding:0 14px 10px"><div class="trn">'+esc(x.note)+'</div></div></div></div>':"")+(x.lw?'<div class="lwx">'+lwBox(x.lw)+'</div>':"")+
 '<div class="acc mn"><div><div class="xb"><div class="ltbl"><span class="th">№</span><span class="th">Повт.</span><span class="th">'+th+'</span><span class="th">Отдых</span><span class="th"></span>'+rows+'</div>'+
 '<div class="acc effp"><div><div class="efb"><div class="efh"><span>Усилие</span><button class="ibtn sm" data-l="efi" aria-label="Что такое усилие">'+ic("info")+'</button></div><div class="tip glass">Сколько повторений оставалось в запасе, или субъективная оценка нагрузки по 10-балльной шкале. 10 — на пределе, 7 — ещё три повтора в запасе.</div><div class="whw"><div class="wh" data-wh>'+wheel+'</div><div class="wband"></div></div><div class="efcap">'+effCap(x.eff||7)+'</div><button class="cta" data-l="efok">Готово</button></div></div></div>'+
 '<textarea class="note" rows="1" data-l="my" placeholder="'+(x.pain?"Опишите, где и что чувствуете. Тренер увидит это в сводке":"Моя заметка: что почувствовали")+'">'+esc(x.my)+'</textarea></div></div></div></div>'}
function renderLive(){var L=loadOf(lv.ex);
 var h=(lv.tn?'<div class="tcard rise"><div class="tl">'+ic("note")+'<b>Поправка тренера</b></div><p>'+esc(lv.tn)+'</p></div>':"")+'<div class="lm"><div class="figs figon">'+figSvg("front",sexNow())+figSvg("back",sexNow())+'</div><div class="tx"><b>Нагрузка сегодня</b><div class="lbs sm" id="lbl"></div></div></div>'+
 lv.ex.map(function(x,i){return lxHtml(x,i)}).join("")+
 '<div class="xc open" style="padding:14px"><textarea class="note" rows="2" id="gNote" placeholder="Общая заметка: самочувствие, итоги">'+esc(lv.g||"")+'</textarea></div>'+
 '<div class="fin"><div class="row"><button class="abtn ghost" id="fCancel">Отменить</button><button class="abtn ghost" id="fDraft" aria-label="Сохранить черновик">'+ic("disk")+'Черновик</button><button class="abtn fill" id="fDone">Завершить</button></div></div>';
 sl.innerHTML=h;paintMap($(".lm",sl),L);var lb=$("#lbl");lb.innerHTML=barsHtml(loadStd(lv.ex));animBars(lb);$("#lName").textContent=lv.name;$$("textarea",sl).forEach(grow);lvProg()}
function lvProg(){var t=0,d=0,fe=0,sg=$("#lSeg");lv.ex.forEach(function(x){var n=x.sets.length,k=0;x.sets.forEach(function(s){t++;if(s.done){d++;k++}});if(n&&k===n)fe++});
 $("#lProg").textContent=fe+" из "+plural(lv.ex.length,["упражнения","упражнений","упражнений"]);
 if(sg){if(sg.children.length!==lv.ex.length){sg.innerHTML=lv.ex.map(function(){return "<i><b></b></i>"}).join("")}
  lv.ex.forEach(function(x,q){var n=x.sets.length,k=x.sets.filter(function(s){return s.done}).length,e=sg.children[q];if(e){e.firstChild.style.width=(n?k/n*100:0)+"%";e.classList.toggle("ok",n>0&&k===n)}})}
 return [d,t]}
function lxOf(el){var c=el.closest("[data-u]");if(!c||!lv)return null;var i=lv.ex.map(function(x){return x.u}).indexOf(c.dataset.u);return {c:c,i:i,x:lv.ex[i]}}
function whVal(w){return Math.max(1,Math.min(10,Math.round(w.scrollTop/40)+1))}
function whSet(w,v){w.scrollTop=(v-1)*40;whMark(w)}
function whMark(w){var v=whVal(w);$$(".wi",w).forEach(function(n){n.classList.toggle("sel",+n.dataset.v===v)})}
sl.addEventListener("scroll",function(e){var w=e.target;if(!w.classList||!w.classList.contains("wh"))return;var v=whVal(w);if(w._v!==v){if(w._v!=null)buzz(4);w._v=v;whMark(w);var c=w.closest(".efb").querySelector(".efcap");c.textContent=effCap(v)}},true);
function effOpen(o,on){var p=$(".effp",o.c);p.classList.toggle("open",on);if(on){var w=$(".wh",o.c);w._v=null;setTimeout(function(){whSet(w,o.x.eff||7)},30)}$(".tip",o.c).classList.remove("on")}
sl.addEventListener("input",function(e){var t=e.target;if(t.id==="gNote"){grow(t);saveLive();return}var o=lxOf(t);if(!o||!o.x)return;if(t.dataset.l==="my"){o.x.my=t.value;grow(t)}else if(t.dataset.s!=null){o.x.sets[+t.dataset.s][t.dataset.k]=capNum(t);if(t.dataset.k!=="rest"){var sm=$("[data-sm]",o.c);if(sm)sm.textContent=exSum(o.x)+(o.x.eff?" · усилие "+o.x.eff:"")}}saveLive()});
function lxFold(o){setTimeout(function(){if(!lv||!o.x||!o.x.sets.every(function(q){return q.done}))return;var x=o.x;x.open=false;o.c.classList.remove("open");var tg=$(".xtog",o.c);if(tg)tg.setAttribute("aria-expanded","false");saveLive(true);
  var nx=lv.ex[o.i+1];if(nx)setTimeout(function(){var c=$('[data-u="'+nx.u+'"]',sl);if(c)sl.scrollTo({top:Math.max(0,c.offsetTop-84),behavior:"smooth"})},620)},520)}
sl.addEventListener("click",function(e){var b=e.target.closest("[data-l]");if(!b||!lv)return;var k=b.dataset.l,o=lxOf(b);if(!o||!o.x)return;var x=o.x;
 if(k==="tog"){x.open=!x.open;o.c.classList.toggle("open",x.open);b.setAttribute("aria-expanded",x.open);buzz(5)}
 else if(k==="info")openInfo(x.id,false);
 else if(k==="lw"){var a=o.c.querySelector(".lwa"),on=!a.classList.contains("open");a.classList.toggle("open",on);b.classList.toggle("on",on);b.setAttribute("aria-expanded",on);buzz(5)}
 else if(k==="pain"){x.pain=!x.pain;b.classList.toggle("on",x.pain);b.setAttribute("aria-pressed",x.pain);var ta=$("textarea.note",o.c);if(ta)ta.placeholder=x.pain?"Опишите, где и что чувствуете. Тренер увидит это в сводке":"Моя заметка: что почувствовали";buzz(x.pain?[8,30,8]:5);if(x.pain){toast("Отмечено. Опишите в заметке, что именно");if(ta&&!x.open)ta.focus()}saveLive(true)}
 else if(k==="nt"){x.nt=!x.nt;var a2=b.parentNode.nextElementSibling;a2.classList.toggle("open",x.nt);b.innerHTML=ic("note")+"Заметка тренера · "+(x.nt?"Скрыть":"Посмотреть");buzz(5)}
 else if(k==="done"){var s=x.sets[+b.dataset.s];if(!s)return;s.done=!s.done;var r=b.closest(".lrow");r.classList.toggle("done",s.done);b.setAttribute("aria-pressed",s.done);buzz(s.done?[8,30,8]:5);
  if(s.done){var rr=s.rest===""||s.rest==null?60:nz(s.rest,60);if(rr>0)rtPrime(rr);pls(b,"var(--green)")}
  var fin=x.sets.every(function(q){return q.done});var n=$(".xtog .n",o.c);n.style.cssText=fin?"background:var(--green);color:#fff":"";n.innerHTML=fin?ic("check").replace('class="i"','class="i" style="width:14px;height:14px;stroke-width:2.6"'):xLab(lv.ex)[o.i];
  if(fin&&s.done)pls(n,"var(--green)");
  $(".pl2.ef",o.c).classList.toggle("show",fin||!!x.eff);
  lvProg();saveLive(true);
  if(fin&&s.done&&!x.eff){effOpen(o,true);setTimeout(function(){var c=$(".effp",o.c);sl.scrollTo({top:Math.max(0,c.getBoundingClientRect().top-sl.getBoundingClientRect().top+sl.scrollTop-170),behavior:"smooth"})},380)}
  else if(fin&&s.done)lxFold(o)}
 else if(k==="efp"){effOpen(o,!$(".effp",o.c).classList.contains("open"));buzz(5)}
 else if(k==="efi"){$(".tip",o.c).classList.toggle("on");buzz(5)}
 else if(k==="efok"){x.eff=whVal($(".wh",o.c));effOpen(o,false);var pl=$(".pl2.ef",o.c);pl.textContent=effPill(x);pl.classList.add("show");$("[data-sm]",o.c).textContent=exSum(x)+" · усилие "+x.eff;buzz([8,30,8]);pls(b,"var(--green)");saveLive(true);
  if(x.sets.every(function(q){return q.done}))lxFold(o)}
});
$("#lBack").onclick=function(){minLive();renderList();toast("Тренировка идёт. Вернуться — плашка сверху")};
$("#pillL").onclick=function(){showLive()};
$("#pillL").addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();showLive()}});
$("#lclk").onclick=function(){if(!lv)return;var now=Date.now();if(lv.paused){lv.pSum=(lv.pSum||0)+(now-lv.pAt);lv.paused=false;lv.pAt=0;toast("Продолжаем")}else{lv.paused=true;lv.pAt=now;toast("Пауза. Нажмите на таймер, чтобы продолжить")}
 $("#lclk").classList.toggle("paused",lv.paused);buzz(8);lvTickFn();saveLive(true)};
sl.addEventListener("click",function(e){var b=e.target.closest("#fCancel,#fDraft,#fDone");if(!b||!lv)return;
 if(b.id==="fDraft"){saveLive(true);buzz([8,30,8]);toast("Черновик сохранён. Тренировку можно продолжить");return}
 if(b.id==="fCancel"){dlgConfirm({title:"Отменить тренировку?",sub:"Отмеченные подходы не сохранятся.",ok:"Отменить тренировку",no:"Продолжить",danger:true,fn:function(){endLive();toast("Тренировка отменена")}});return}
 if(b.id==="fDone")finishLive()});
function endLive(){clearInterval(lvTick);clearTimeout(lvT);lvT=0;rtStop();lv=null;FS.set("live",null);$("#sLive").classList.remove("on");$("#pillL").classList.remove("on");if(app.dataset.mode!=="con")app.dataset.mode="list";renderList()}
function recBest(id,skipK,skipWid){var w=0,t=0;HIST.forEach(function(h){if(h.d===todayIso()&&(h.wid?h.wid===skipWid:h.k===skipK))return;(Array.isArray(h.ex)?h.ex:[]).forEach(function(x){if(!x||x.id!==id)return;(Array.isArray(x.sets)?x.sets:[]).forEach(function(s){if(!s||s.done===false)return;if(x.mode==="kg"&&+s.w>0)w=Math.max(w,+s.w);if(x.mode==="time")t=Math.max(t,+s.t||0)})})});return {w:w,t:t}}
function hhmm(d){return ("0"+d.getHours()).slice(-2)+":"+("0"+d.getMinutes()).slice(-2)}
function finishLive(){var d=0,t=0,vol=0,eff=0,en=0,recs=[],G={};var gn=$("#gNote");lv.g=gn?gn.value.trim():(lv.g||"");
  lv.ex.forEach(function(x){x.sets.forEach(function(s){t++;if(s.done)d++})});
 if(!d){dlgConfirm({title:"Нет отмеченных подходов",sub:"Отметьте хотя бы один подход, чтобы тренировка попала в историю. Или выйдите без записи.",ok:"Выйти без записи",danger:true,no:"Продолжить",fn:function(){endLive();toast("Тренировка закрыта без записи")}});return}
 var sec=lvSec();
 lv.ex.forEach(function(x){var e=exOf(x.id),dn=0,mw=0,mt=0;if(x.eff){eff+=x.eff;en++}
  x.sets.forEach(function(s){if(s.done){dn++;if(x.mode==="kg"&&+s.w>0){vol+=nz(s.v,0)*(+s.w);mw=Math.max(mw,+s.w)}if(x.mode==="time")mt=Math.max(mt,+s.t||0)}});
  if(dn){var sh=exShare(e);Object.keys(sh).forEach(function(g){G[g]=(G[g]||0)+dn*sh[g]/100})}
  var r=recBest(x.id,lv.k,lv.wid);
  if(mw&&r.w&&mw>r.w)recs.push({n:e.n,t:"Вес "+kgTxt(mw)+" кг",o:"было "+kgTxt(r.w)});
  if(mt&&r.t&&mt>r.t)recs.push({n:e.n,t:"Время "+mt+" с",o:"было "+r.t})});
 var pct=t?Math.round(d/t*100):0,avg=en?eff/en:6,pr=FS.get("profile")||{},bw=+pr.w>0?+pr.w:(sexNow()==="f"?64:80),kcal=Math.max(0,Math.round(((3.5+.2*avg)*bw*sec/3600)/10)*10);
 var gs=Object.keys(G).map(function(g){return [g,G[g]]}).sort(function(a,b){return b[1]-a[1]}),gsum2=gs.reduce(function(s,r){return s+r[1]},0),gtop=gs.slice(0,4),gmax=gtop.length?gtop[0][1]:1;
 var gArr=gs.map(function(r){return [r[0],gsum2?Math.round(r[1]/gsum2*100):0]}).filter(function(r){return r[1]>0});
 var entry={d:todayIso(),k:lv.k,wn:lv.name,pn:lv.pn,wid:lv.wid,t:hhmm(new Date(lv.t0)),sec:sec,kcal:kcal,pct:pct,vol:Math.round(vol*10)/10,g:gArr,gn:lv.g||"",tn:lv.tn||"",
  ex:lv.ex.map(function(x){return {id:x.id,n:exOf(x.id).n,mode:x.mode,sets:x.sets.map(function(s){return {v:s.v,w:s.w,t:s.t,rest:s.rest,done:!!s.done}}),eff:x.eff||0,my:(x.my||"").trim(),pain:!!x.pain,tn:x.note||""}})};
 var wid=lv.wid,wp=findP(lv.pid),wkk=wp&&findW(wp,wid),name=lv.name;
 var dnW=0,totW=0;D.programs.forEach(function(p){p.workouts.forEach(function(w){totW++;if(w===wkk||isDone(p,w))dnW++})});
 var st=function(b,s){return '<div class="st"><b>'+b+'</b><span>'+s+'</span></div>'};
 var w=$("#sum");w.innerHTML='<div class="wb"><span class="eyebrow">Тренировка завершена</span><h3>'+esc(name)+'</h3>'+
  '<div class="stats s6">'+st(fmt(sec),"время")+st(pct+"%","от плана")+st(kcal>=10?"≈ "+kcal:"—","ккал")+st(vol?Math.round(vol).toLocaleString("ru-RU"):"—","кг объём")+st(d+"/"+t,"подходов")+st(en?avg.toFixed(1).replace(".",","):"—","усилие, ср.")+'</div>'+
  (recs.length?'<div class="sec"><h4>Рекорды</h4><div class="recs">'+recs.map(function(r){return '<div class="rec">'+ic("trophy")+'<span>'+esc(r.n)+' · '+r.t+'</span><small>'+r.o+'</small></div>'}).join("")+'</div></div>':"")+
  (gtop.length?'<div class="sec"><h4>Подходы по группам мышц, примерно</h4><div class="gsets">'+gtop.map(function(r){var n=Math.max(1,Math.round(r[1]));return '<div class="gs"><span>'+esc(r[0])+'</span><b>'+n+'</b><i><s data-w="'+Math.round(r[1]/gmax*100)+'"></s></i></div>'}).join("")+'</div></div>':"")+
  '<div class="sec"><h4>Сводка для тренера</h4><div class="cxl">'+exLines(entry)+'</div>'+(lv.g?'<p class="gn2" style="margin-top:8px">'+esc(lv.g)+'</p>':'')+'</div><p class="small" style="font-size:13px;color:var(--ink3)">Результаты и заметки сохранены в календаре за сегодня. Расход калорий примерный: по весу и усилию. На этой неделе проведено '+dnW+' из '+totW+'.</p></div><div class="wf"><button class="cta l" id="sPr">В Прогресс</button><button class="cta go" id="sOk">Готово</button></div>';
 var fin=false;
 function commit(goProgress){if(fin)return;fin=true;
  addHist(entry);if(wkk)fresh=wkk.id;if(wp)wp.open=true;
  endLive();saveNow();closeSheet("sum");buzz([12,50,12]);
  if(goProgress)send({t:"tab",to:"prog"});else toast("Тренировка записана в календарь")}
 $("#sOk").onclick=function(){pls(this,"var(--green)");commit(false)};
 $("#sPr").onclick=function(){commit(true)};
 saveLive(true);
 w.classList.add("on");syncScrim();buzz([12,50,12]);
 setTimeout(function(){$$(".gs s",w).forEach(function(s){s.style.width=s.dataset.w+"%"})},350)}

/* ---------- таймер отдыха и звук ---------- */
var AC=null;function ac(){if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(AC&&AC.state==="suspended")AC.resume();return AC}
function beep(f,d,v){var c=ac();if(!c)return;window.__beeps&&window.__beeps.push([f,d,Math.round(performance.now())]);var o=c.createOscillator(),g=c.createGain();o.type="sine";o.frequency.value=f;var t=c.currentTime;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v||.22,t+.015);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+d+.03)}
var rt={pre:60,tot:60,left:60,ex:60,run:false,end:0,raf:0},rtEl=$("#rt"),rArc=$("#rArc"),rtG={w:0,h:0};
function rtGeom(){}
function rtSnake(f){f=isFinite(f)?Math.max(0,Math.min(1,f)):1;rArc.style.strokeDasharray=f+" 2"}
function rtShow(){var s=Math.max(0,rt.left);$("#rVt").textContent=Math.floor(s/60)+":"+("0"+s%60).slice(-2);rtEl.classList.toggle("run",rt.run);rtEl.classList.toggle("warn",(rt.run||rt.paused)&&s<=10);rtEl.classList.toggle("paused",!!rt.paused&&!rt.run);$("#rR").tabIndex=rt.paused&&!rt.run?0:-1;rtGeom();if(!rt.run&&!rt.paused)rtSnake(rt.ex/rt.tot)}
function rtCancel(){cancelAnimationFrame(rt.raf);rt.run=false;rt.paused=false}
function rtReset(sec){sec=+sec>0?+sec:60;rtCancel();rt.pre=rt.tot=rt.left=rt.ex=sec;rtShow();saveLive()}
function rtPrime(sec){sec=+sec>0?+sec:(rt.pre>0?rt.pre:60);rtReset(sec);rtEl.classList.remove("prime");void rtEl.offsetWidth;rtEl.classList.add("prime")}
function rtStop(){rtCancel();rtShow()}
function rtRestore(r){r=r||{};var pre=+r.pre>0?+r.pre:60;rtCancel();rt.pre=pre;rt.tot=+r.tot>0?+r.tot:pre;rt.left=rt.ex=rt.tot;
 if(+r.end>Date.now()){rt.end=+r.end;rt.run=true;rt.ex=(rt.end-Date.now())/1000;rt.left=Math.ceil(rt.ex);rtShow();rt.raf=requestAnimationFrame(rtFrame)}else{rt.run=false;rt.pre=rt.tot=rt.left=rt.ex=pre;rtShow()}}
/* сигналы: за 30, 10, 5, 4, 3 секунд; если кадр пропущен (вкладка в фоне), срабатывает ближайший пройденный порог */
var RTC=[[30,523,.1,.16],[10,660,.14,.2],[5,784,.12,.2],[4,784,.12,.2],[3,880,.12,.22]];
function rtCue(pv,sec){var hit=null;RTC.forEach(function(c){if(pv>c[0]&&sec<=c[0])hit=c});if(hit){beep(hit[1],hit[2],hit[3]);buzz(hit[0]>=30?10:hit[0]===10?15:20)}}
function rtFrame(){var rem=Math.max(0,(rt.end-Date.now())/1000),sec=Math.ceil(rem);rt.ex=rem;
 if(sec!==rt.left){var pv=rt.left;rt.left=sec;rtCue(pv,sec);rtShow()}
 rtSnake(rem/rt.tot);
 if(rem<=0){rt.run=false;beep(1040,1.1,.3);buzz([60,40,60,40,200]);rtEl.classList.remove("flash");void rtEl.offsetWidth;rtEl.classList.add("flash");setTimeout(function(){if(rt.run)return;rt.left=rt.ex=rt.tot=rt.pre;rtShow()},1300);rtEl.classList.remove("run","warn");saveLive();return}
 rt.raf=requestAnimationFrame(rtFrame)}
function rtStart(){var fresh=!rt.paused;ac();if(fresh)beep(587,.09,.14);buzz([12,50,12]);rt.paused=false;if(rt.ex<=0){rt.ex=rt.left=rt.tot=rt.pre}rt.run=true;rt.end=Date.now()+rt.ex*1000;rtShow();cancelAnimationFrame(rt.raf);rt.raf=requestAnimationFrame(rtFrame);saveLive()}
$("#rV").onclick=function(){if(rt.run){rtPause();buzz(8)}else{rtStart();buzz(10)}};
$("#rR").onclick=function(){rtReset(rt.pre);buzz([8,30,8])};
function rtPause(){cancelAnimationFrame(rt.raf);rt.ex=Math.max(0,(rt.end-Date.now())/1000);rt.run=false;rt.paused=true;rt.left=Math.ceil(rt.ex);rtShow();rtSnake(rt.ex/rt.tot);saveLive()}
function rtAdj(d){buzz(6);if(rt.run){rt.end+=d*1000;rt.tot=Math.max(5,rt.tot+d)}else if(rt.paused){rt.ex=Math.max(1,rt.ex+d);rt.tot=Math.max(rt.ex,rt.tot+d);rt.left=Math.ceil(rt.ex);rtSnake(rt.ex/rt.tot)}else{rt.ex=Math.max(5,rt.ex+d);rt.left=Math.ceil(rt.ex);rt.pre=rt.tot=rt.ex}rtShow();saveLive()}
$("#rM").onclick=function(){rtAdj(-15)};$("#rP").onclick=function(){rtAdj(15)};
setTimeout(rtGeom,300);if(document.fonts)document.fonts.ready.then(function(){rtG.w=0;rtGeom()});

/* ---------- нижняя панель, плюс ---------- */
var TABS=[["home","Главная","home"],["dumb","Тренировки","work"],["food","Питание","nutr"],["chart","Прогресс","prog"],["user","Профиль","prof"]],tb=$("#tabbar"),ind=document.createElement("div");ind.className="ind";tb.appendChild(ind);var btns=[];
TABS.forEach(function(t,i){var b=document.createElement("button");b.className="tab"+(t[2]==="work"?" on":"");b.setAttribute("aria-label",t[1]);b.innerHTML=dockIc(t[0])+'<span class="lbl">'+t[1]+'</span>';
 b.onclick=function(){if(t[2]==="work"){if(app.dataset.mode==="live")sl.scrollTo({top:0,behavior:"smooth"});else if(app.dataset.mode==="con")cs.scrollTo({top:0,behavior:"smooth"});else scList.scrollTo({top:0,behavior:"smooth"});buzz(5);return}
  if(!HASP){toast("Вкладка «"+t[1]+"» откроется в приложении");return}buzz(6);send({t:"tab",to:t[2]})};tb.appendChild(b);btns.push(b)});
function place(){var b=btns[1];if(!b||!b.offsetWidth)return;ind.style.transform="translateX("+b.offsetLeft+"px)";ind.style.width=b.offsetWidth+"px"}
setTimeout(place,80);addEventListener("resize",place);if(document.fonts)document.fonts.ready.then(place);setTimeout(place,600);try{new ResizeObserver(place).observe(tb)}catch(e){}
$("#fab").onclick=function(){buzz(8);newQuick()};

/* ---------- связь с оболочкой и другими экранами ---------- */
function openByKey(k,pn){var hit=null;D.programs.forEach(function(p){p.workouts.forEach(function(w){if(hk(w)===k&&(!pn||p.name===pn||!hit))hit=[p,w]})});if(!hit)return false;
 closeAll();if(subTab!==0){segTab.set(0);setSub(0)}
 if(lv&&lv.wid===hit[1].id){showLive();return true}
 hit[0].open=true;renderList();setTimeout(function(){openCon(hit[0].id,hit[1].id)},120);return true}
function goWid(wid,start,tries){var hit=null;D.programs.forEach(function(p){var w=findW(p,wid);if(w)hit=[p,w]});
 if(!hit){if(tries<4){setTimeout(function(){goWid(wid,start,tries+1)},180)}else toast("Тренировка не найдена");return false}
 var p=hit[0],w=hit[1];closeAll();if(subTab!==0){segTab.set(0);setSub(0)}
 if(lv){if(lv.wid===wid){showLive();return true}if(start){showLive();toast("Сначала завершите текущую тренировку");return true}}
 if(start){if(!w.ex.length){p.open=true;renderList();setTimeout(function(){openCon(p.id,w.id);toast("Сначала добавьте упражнения")},120);return true}startLive(p,w);return true}
 p.open=true;renderList();setTimeout(function(){openCon(p.id,w.id)},120);return true}
/* готовая программа по id (из Главной/Библиотеки): вкладка «Готовые», карточка раскрыта и показана */
function openTpl(id){var t=getTpl().filter(function(x){return x.id===id})[0];if(!t){toast("Программа не найдена");return}
 closeAll();if(lv&&app.dataset.mode==="live")minLive();leaveCon();
 var bp=boughtP(id);if(bp){goProg(bp.id);toast("Программа уже у вас, во вкладке «Мои»");return}
 if(!tplFilt(t))tplF={place:"all",lvl:0,mus:[],eq:[]};
 if(subTab!==1){segTab.set(1);setSub(1)}else renderTpl(true);
 var tries=0;(function go(){var e=null;$$("[data-t]").forEach(function(x){if(x.dataset.t===id)e=x});
  if(e){scList.scrollTo({top:Math.max(0,e.offsetTop-70),behavior:"instant"});setTimeout(function(){openTplWin(t,e)},260)}else if(tries++<6)setTimeout(go,150)})()}
/* к конкретному упражнению внутри тренировки: {t:"open",wid|k|start,xid:"<id из каталога>"}; раскрывает карточку и прокручивает к ней */
function focusEx(xid){if(xid==null||xid==="")return;xid=String(xid);var tries=0;(function go(){
 if(app.dataset.mode==="con"&&con&&tries>0){var x=con.cw.ex.filter(function(q){return String(q.id)===xid})[0];if(!x){toast("В этой тренировке нет такого упражнения");return}
  openSet[x.u]=true;renderX();setTimeout(function(){var c=$('[data-u="'+x.u+'"]',cs);if(c)cs.scrollTo({top:Math.max(0,c.offsetTop-120),behavior:"smooth"})},60);return}
 if(app.dataset.mode==="live"&&lv&&tries>0){var y=lv.ex.filter(function(q){return String(q.id)===xid})[0];if(y){var c2=$('[data-u="'+y.u+'"]',sl);if(c2){y.open=true;c2.classList.add("open");var tg=$(".xtog",c2);if(tg)tg.setAttribute("aria-expanded","true");sl.scrollTo({top:Math.max(0,c2.offsetTop-84),behavior:"smooth"})}}return}
 if(tries++<10)setTimeout(go,200)})()}
function leaveCon(){if(con&&app.dataset.mode==="con")closeCon()}
function handleOpen(m){
 if($("#sum.on"))return;
 if(con)saveNow();
 if(m.start){goWid(m.start,true,0);focusEx(m.xid);return}
 if(m.wid){goWid(m.wid,false,0);focusEx(m.xid);return}
 if(m.pid){var tries=0;(function go(){if(findP(m.pid)){closeAll();if(lv&&app.dataset.mode==="live")minLive();leaveCon();goProg(m.pid)}else if(tries++<4)setTimeout(go,180)})();return}
 if(m.k){if(!openByKey(m.k,m.pn))toast("Тренировка не найдена");else focusEx(m.xid);return}
 if(m.tpl){openTpl(String(m.tpl));return}
 /* упражнение из каталога: {t:"open",ex:"<id>"[,q:"текст"]}. Из конструктора открывается карточка поверх, иначе — Библиотека с раскрытым упражнением */
 if(m.ex!=null&&m.ex!==""){var xid=String(m.ex);if(app.dataset.mode==="con"){openInfo(xid,false);return}closeAll();if(lv&&app.dataset.mode==="live")minLive();libReq={id:xid};if(m.q!=null)libReq.q=String(m.q);if(subTab===3)libShow();else{segTab.set(3);setSub(3)}return}
 if(m.nw){closeAll();if(lv&&app.dataset.mode==="live")minLive();leaveCon();if(subTab!==0){segTab.set(0);setSub(0)}newQuick()}}
function closeSoft(){$$(".sheet.on,.win.on").forEach(function(x){if(x.id!=="sum")x.classList.remove("on")});syncScrim()}
function onShow(){if(subTab===3)libShow();reloadHist();cleanHist();if(buildCat())idle(ixWarm);closeSoft();if(app.dataset.mode==="list")renderList();else if(con)renderPrev();setTimeout(place,40);setTimeout(rtGeom,60)}
addEventListener("message",function(e){var m=e.data;if(!m||m.f!=="forma"||m.from==="work")return;
 if(m.t==="open")handleOpen(m);
 else if(m.t==="sub"){var i=+m.i;if(i>=0&&i<4){if(i===3)takeLibQ();closeAll();if(lv&&app.dataset.mode==="live")minLive();if(con)saveNow();leaveCon();segTab.set(i);setSub(i);if(i===3)libShow()}}
 else if(m.t==="libdock"){if(m.from==="lib")app.classList.toggle("libsheet",!!m.hide&&subTab===3)}
 else if(m.t==="show")onShow()});
/* изменения из других экранов */
FS.on(function(k){
 if(k==="progs"){var nv=FS.get("progs"),s=JSON.stringify(nv==null?null:nv);if(s===lastJ.progs)return;lastJ.progs=s;D=normD(nv);relink();
  if(con&&!isDirty()&&!conT){con.cw={name:con.w.name,ex:clone(con.w.ex),tn:con.w.tnote||""};con.snap=snapOf();if(app.dataset.mode==="con"){renderX();renderPrev();updateMap();refreshBar();$("#cName").value=con.cw.name}}
  renderList()}
 else if(k==="hist"){reloadHist();cleanHist();renderList();if(con&&!con.sub)renderPrev()}
 else if(k==="live"){var sv=savedLive();if(lv&&!sv){clearInterval(lvTick);rtStop();lv=null;$("#sLive").classList.remove("on");$("#pillL").classList.remove("on");if(app.dataset.mode==="live")app.dataset.mode="list";toast("Тренировка завершена на другом экране")}renderList()}
 else if(k==="plan"||k==="profile"){if(app.dataset.mode==="list"||subTab!==0)renderList();if(con){updateMap();if(k==="profile"&&app.dataset.mode==="con")renderX()}}
 else if(k==="sync"||k==="set"){if(subTab===2&&!$("#winCl.on"))renderList();tabLbl();$("#pTitle").textContent=subTitle(subTab)}
});
function flush(){if(conT||svT)saveNow();if(lv)saveLive(true)}
addEventListener("pagehide",flush);document.addEventListener("visibilitychange",function(){if(document.hidden)flush()});
/* ---------- «назад»: Escape, свайп от левого края, смахивание шторки вниз ---------- */
function backNav(){if(dismissTop())return true;var m=app.dataset.mode;
 if(m==="con"){$("#cBack").click();return true}
 if(m==="live"){$("#lBack").click();return true}
 return false}
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&backNav())e.preventDefault()});
(function(){var sx=0,sy=0,id=null;
 app.addEventListener("pointerdown",function(e){id=null;if(app.dataset.mode==="list"||e.target.closest("input,textarea,.sheet,.win"))return;if(e.clientX-app.getBoundingClientRect().left>26)return;id=e.pointerId;sx=e.clientX;sy=e.clientY});
 app.addEventListener("pointerup",function(e){if(id!==e.pointerId)return;id=null;var dx=e.clientX-sx,dy=Math.abs(e.clientY-sy);if(dx>70&&dy<dx*.6&&!$$(".sheet.on,.win.on").length)backNav()});
 app.addEventListener("pointercancel",function(){id=null})})();
(function(){var d=null;
 app.addEventListener("pointerdown",function(e){var g=e.target.closest(".grab"),sh=g&&g.closest(".sheet");if(!sh||!sh.classList.contains("on"))return;d={sh:sh,y:e.clientY,id:e.pointerId,dy:0};sh.classList.add("drag");try{g.setPointerCapture(e.pointerId)}catch(x){}});
 app.addEventListener("pointermove",function(e){if(!d||e.pointerId!==d.id)return;d.dy=Math.max(0,e.clientY-d.y);d.sh.style.transform="translateY("+d.dy+"px)"});
 function end(e,cancel){if(!d||e.pointerId!==d.id)return;var o=d;d=null;o.sh.classList.remove("drag");o.sh.style.transform="";if(!cancel&&o.dy>90){if(o.sh.id==="dlg"){var f=dlgDis;dlgDis=null;closeSheet("dlg");if(f)f()}else closeSheet(o.sh.id)}}
 app.addEventListener("pointerup",function(e){end(e,false)});app.addEventListener("pointercancel",function(e){end(e,true)})})();
/* старт */
buildCat();
idle(ixWarm);
renderList(true);
send({t:"hello"});

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


(function(){var d=new Date(),W=["воскресенье","понедельник","вторник","среда","четверг","пятница","суббота"],M=["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"],w=W[d.getDay()];var e=document.getElementById("wDate");if(e)e.textContent=w.charAt(0).toUpperCase()+w.slice(1)+", "+d.getDate()+" "+M[d.getMonth()]})()


/* выделение содержимого ячейки при входе: сразу вводим новое значение, не стирая старое */
(function(){function isC(t){return t&&t.classList&&t.classList.contains("cell")}
 function pick(el){try{el.select()}catch(e){}try{el.setSelectionRange(0,String(el.value).length)}catch(e){}}
 function pickAll(t){pick(t);setTimeout(function(){pick(t)},0);setTimeout(function(){pick(t)},60);setTimeout(function(){pick(t)},160)}
 var fresh=null;
 document.addEventListener("focusin",function(e){if(isC(e.target)){fresh=e.target;pickAll(e.target);setTimeout(function(){fresh=null},400)}});
 document.addEventListener("mousedown",function(e){var t=e.target;if(isC(t)&&document.activeElement!==t){e.preventDefault();t.focus();pickAll(t)}});
 document.addEventListener("mouseup",function(e){if(isC(e.target)&&fresh===e.target)e.preventDefault()});
 document.addEventListener("click",function(e){if(isC(e.target)&&fresh===e.target)pickAll(e.target)});
 document.addEventListener("touchend",function(e){var t=e.target;if(isC(t))setTimeout(function(){if(document.activeElement===t)pickAll(t)},20)},{passive:true})})();
