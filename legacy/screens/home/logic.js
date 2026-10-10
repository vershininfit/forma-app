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

window.SHELL=(window.name==="forma-emb");


window.PAGE="home";
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
function send(m){m.f="forma";m.from=PAGE;try{if(window.SHELL)parent.postMessage(m,"*");else if(m.t==="tab"||m.t==="sub"||m.t==="open")toast("В полном приложении здесь откроется другой экран")}catch(e){}}
function toast(t,act,fn){var e=$("#toast");if(!e)return;e.innerHTML="";e.classList.toggle("act",!!act);var s=document.createElement("span");s.textContent=t;e.appendChild(s);if(act){var b=document.createElement("button");b.className="tact";b.textContent=act;b.onclick=function(){e.classList.remove("on");fn&&fn()};e.appendChild(b)}e.classList.add("on");clearTimeout(toast._t);toast._t=setTimeout(function(){e.classList.remove("on")},act?4200:2600)}
/* нижнее меню */
var TABS=[["home","Главная","home"],["dumb","Тренировки","work"],["food","Питание","nutr"],["chart","Прогресс","prog"],["user","Профиль","prof"]];
function initTabs(active){var tb=$("#tabbar"),ind=document.createElement("div");ind.className="ind";tb.appendChild(ind);var btns=[],cur=active,alone=!window.SHELL,ikeys=TABS.map(function(t){return t[2]});
 var SOON={work:"Скоро здесь будут тренировки",nutr:"Скоро здесь будет питание",prog:"Скоро здесь будет прогресс",prof:"Скоро здесь будет профиль"},panes={};
 function paneOf(k){if(k==="home")return $("#scroll");if(panes[k])return panes[k];var t=TABS[ikeys.indexOf(k)],e=document.createElement("div");e.className="tabpane";e.hidden=true;e.innerHTML='<div class="tpi"><span class="tpc">'+ic(t[0])+'</span><h2>'+SOON[k]+'</h2><p>Раздел в разработке</p></div>';$("#app").insertBefore(e,$(".dock"));return panes[k]=e}
 function place(){var b=btns[ikeys.indexOf(cur)];if(!b)return;ind.style.transition="none";ind.style.transform="translateX("+b.offsetLeft+"px)";ind.style.width=b.offsetWidth+"px"}
 function drop(a,b){var A=btns[a],B=btns[b],dur=540,t0=performance.now(),rm=false;try{rm=matchMedia("(prefers-reduced-motion:reduce)").matches}catch(e){}
  ind.style.transition="none";if(rm){setTimeout(place,480);return}
  function io(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}
  function step(now){var t=Math.min(1,(now-t0)/dur),e=io(t),c0=A.offsetLeft+A.offsetWidth/2,c1=B.offsetLeft+B.offsetWidth/2,c=c0+(c1-c0)*e,w=(A.offsetWidth+(B.offsetWidth-A.offsetWidth)*e)*(1+.12*Math.sin(Math.PI*t));
   ind.style.transform="translateX("+(c-w/2)+"px)";ind.style.width=w+"px";if(t<1)requestAnimationFrame(step);else place()}
  requestAnimationFrame(step)}
 function go(k){var from=cur;cur=k;btns.forEach(function(b,i){b.classList.toggle("on",ikeys[i]===k)});drop(ikeys.indexOf(from),ikeys.indexOf(k));window.__tabPlay&&__tabPlay(btns[ikeys.indexOf(k)]);swapPanes(paneOf(from),paneOf(k))}
 TABS.forEach(function(t,i){var b=document.createElement("button");b.className="tab"+(t[2]===active?" on":"");b.setAttribute("aria-label",t[1]);b.innerHTML=dockIc(t[0])+'<span class="lbl">'+t[1]+'</span>';
  b.onclick=function(){if(alone){if(t[2]===cur){if(cur==="home"){var s=$("#scroll");s&&s.scrollTo({top:0,behavior:"smooth"})}return}buzz(6);go(t[2]);return}
   if(t[2]===active){var s=$("#scroll");s&&s.scrollTo({top:0,behavior:"smooth"});return}buzz(6);send({t:"tab",to:t[2]})};tb.appendChild(b);btns.push(b)});
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
  var r=String(c&&c.rng||""),time=!!(c&&c.fmt==="time"),m,n=3;
  if(c&&c.eq==="mob")n=2;
  else if(c&&c.pos&&c.pos.indexOf("m")<0&&c.pos.indexOf("c")<0)n=2;
  if((m=/(\d+)\s*подход/i.exec(r)))n=Math.max(1,Math.min(6,+m[1]));
  var v=null,t=null;
  if(time){
   if((m=/(\d+)(?:\s*[–-]\s*\d+)?\s*сек/i.exec(r)))t=+m[1];
   else if((m=/(\d+)(?:\s*[–-]\s*\d+)?\s*мин/i.exec(r)))t=Math.min(120,+m[1]*60);
   else if(/\d+\s*(?:[–-]\s*\d+\s*)?м\b/.test(r))t=30;
   else{m=/(\d+)/.exec(r);t=m?+m[1]:30}
   if(!(t>=5))t=30;t=Math.min(t,300);return {n:n,mode:"time",v:1,t:t}}
  if((m=/(\d+)(?:\s*[–-]\s*\d+)?\s*\((?:гипертроф|контрол)/i.exec(r)))v=+m[1];
  else if((m=/по\s*(\d+)/i.exec(r)))v=+m[1];
  else if((m=/(\d+)/.exec(r)))v=+m[1];
  if(!(v>=1))v=10;v=Math.max(3,Math.min(30,v));
  return {n:n,mode:"kg",v:v,t:30}}


 /* ---------- упражнение ---------- */
 function mkEx(id,o){
  ensure();o=o||{};var c=BY[id]||null,time=!!(c&&c.fmt==="time"),D=c?defaults(c):null,base=D?(time?D.t:D.v):null;
  var n=+o.n>0?Math.round(+o.n):(c&&+c.sets>0?Math.round(+c.sets):(D&&/\d+\s*подход/i.test(String(c.rng||""))?D.n:3));
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
    var work=40;if(e.mode==="time"&&st&&+st.t>0)work=Math.min(+st.t,180);
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
var EMB=window.name==="forma-emb";if(EMB)document.documentElement.classList.add("emb");

/* ---------- словари ---------- */
var WD=["Пн","Вт","Ср","Чт","Пт","Сб","Вс"],
 WDF=["Понедельник","Вторник","Среда","Четверг","Пятница","Суббота","Воскресенье"],
 WDL=["понедельник","вторник","среда","четверг","пятница","суббота","воскресенье"],
 WDV=["в понедельник","во вторник","в среду","в четверг","в пятницу","в субботу","в воскресенье"],
 WDJ=["сдвинулся","сдвинулся","сдвинулась","сдвинулся","сдвинулась","сдвинулась","сдвинулось"],
 MSH=["янв","фев","мар","апр","мая","июн","июл","авг","сен","окт","ноя","дек"],
 MNF=["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],
 WH={home:"дома",gym:"в зале",both:"дома или в зале"};

/* ---------- безопасные хелперы ---------- */
function arr(x){return Array.isArray(x)?x:[]}
function obj(x){return x&&typeof x==="object"&&!Array.isArray(x)?x:{}}
function num(x,d){x=+x;return isFinite(x)?x:(d||0)}
function clamp(x,a,b){return Math.max(a,Math.min(b,x))}
function isIso(s){return typeof s==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&!isNaN(new Date(+s.slice(0,4),+s.slice(5,7)-1,+s.slice(8,10)).getTime())}
function isTime(s){return typeof s==="string"&&/^([01]\d|2[0-3]):[0-5]\d$/.test(s)}
function p2(n){return ("0"+n).slice(-2)}
function dnum(iso){return Math.round(Date.UTC(+iso.slice(0,4),+iso.slice(5,7)-1,+iso.slice(8,10))/864e5)}
function diffDays(a,b){return dnum(b)-dnum(a)}
function dayOfMonth(iso){return +iso.slice(8,10)}
function shortDate(iso){return dayOfMonth(iso)+" "+MSH[+iso.slice(5,7)-1]}
function str(x,d){return typeof x==="string"?x:(d||"")}
function r1(x){return Math.round(x*10)/10}
function fvol(v){v=Math.max(0,Math.round(num(v)));return v>=1000?[fi(v/1000),"т"]:[String(v),"кг"]}
function agoTxt(n){return n<=0?"сегодня":n===1?"вчера":plural(n,["день","дня","дней"])+" назад"}
function ringic(f,ico,col,frac){return '<div class="ringic"><svg viewBox="0 0 52 52"><circle class="t" cx="26" cy="26" r="24"/>'+(f?'<circle class="f" cx="26" cy="26" r="24" pathLength="1" '+(f==="full"?'style="stroke-dashoffset:0;stroke:var(--green)"':'data-f="'+clamp(frac||0,0,1)+'"')+'/>':'')+'</svg><i'+(col?' style="color:'+col+'"':'')+'>'+ic(ico)+'</i></div>'}

/* ---------- состояние ---------- */
var wkOpen=true;
var TD=todayIso(),C=null,selIso=null,wkVis=null,firstDraw=true,cache={},wAsk="ask",lastPct=0,lastSel=null,heroSwap=false,drawn={},celebrated="",offReady=false,rq=0;

function remCfg(S){S=S||{};var r=obj(S.rem);return {w:S.wRem===false?"off":(r.w==="weekly"?"weekly":"daily"),f:r.f!=="off",mk:r.mk!=="off"}}
function getSet(){var s=FS.get("set");if(!s||typeof s!=="object"||Array.isArray(s)){s={wRem:true,notif:[]}}if(!Array.isArray(s.notif))s.notif=[];return s}
function saveSet(s){FS.set("set",s)}

/* ---------- чтение и нормализация данных ---------- */
function uniqDays(a){var o={};a.forEach(function(x){x=+x;if(x>=0&&x<=6&&x%1===0)o[x]=1});return Object.keys(o).map(Number).sort(function(a,b){return a-b})}
function normH(h){
 if(!h||typeof h!=="object"||!isIso(h.d))return null;
 var ex=arr(h.ex).filter(function(x){return x&&typeof x==="object"}).map(function(x){return {n:str(x.n)||"Упражнение",mode:x.mode==="time"?"time":"kg",sets:arr(x.sets).filter(function(s){return s&&typeof s==="object"}),eff:num(x.eff),my:str(x.my),pain:!!x.pain}});
 return {d:h.d,k:h.k==null?"":String(h.k),wn:str(h.wn)||str(h.pn)||"Тренировка",pn:str(h.pn),t:isTime(h.t)?h.t:"",sec:Math.max(0,num(h.sec)),kcal:Math.max(0,num(h.kcal)),pct:clamp(h.pct==null?100:num(h.pct,100),0,100),vol:Math.max(0,num(h.vol)),g:str(h.g),tn:str(h.tn),ex:ex}}
function matchW(h,w){return (h.k!==""&&(h.k===String(w.key)||h.k===String(w.id)))||(!!h.wn&&h.wn===w.name)}
function liveOk(l){return !!l&&typeof l==="object"&&!Array.isArray(l)&&!!(l.wid||l.name||arr(l.ex).length)}
function load(){
 var c={};C=c;c._r={};c._p={};c._bs=null;
 c.P=obj(FS.get("profile"));
 var pl=obj(FS.get("plan"));c.plan=pl;c.PD=uniqDays(arr(pl.days));
 c.exm={};c.mv={};arr(pl.ex).forEach(function(x){if(!x||typeof x!=="object"||!isIso(x.iso)||!x.src)return;if(x.kind==="cancel"||x.kind==="swap"||x.kind==="move"){c.exm[x.iso+"|"+x.src]=x;if(x.kind==="move"&&isIso(x.to))(c.mv[x.to]=c.mv[x.to]||[]).push(x)}});
 c.time=isTime(pl.time)?pl.time:(isTime(c.P.rem)?c.P.rem:"");
 var progs=arr(obj(FS.get("progs")).programs).filter(function(p){return p&&typeof p==="object"});
 c.programs=progs;
 var pr=null;progs.forEach(function(p){if(!pr&&pl.prog!=null&&p.id===pl.prog&&arr(p.workouts).length)pr=p});
 if(!pr)progs.forEach(function(p){if(!pr&&arr(p.workouts).some(function(w){return w&&typeof w==="object"}))pr=p});
 c.prog=pr;c.WK=pr?arr(pr.workouts).filter(function(w){return w&&typeof w==="object"}):[];
 /* история: только валидные записи, не из будущего */
 c.HS=arr(FS.get("hist")).map(normH).filter(function(h){return h&&h.d<=TD}).sort(function(a,b){return a.d<b.d?-1:a.d>b.d?1:0});
 c.byDay={};c.HS.forEach(function(h){(c.byDay[h.d]=c.byDay[h.d]||[]).push(h)});
 c.ws=weekStartOf(TD);c.todayDow=dowOf(TD);
 c.wk=[0,1,2,3,4,5,6].map(function(i){return addDays(c.ws,i)});
 c.todayEntries=c.byDay[TD]||[];
 c.weekEntries=c.HS.filter(function(h){return h.d>=c.ws});
 c.k=c.weekEntries.length;
 c.wMin=Math.round(c.weekEntries.reduce(function(s,h){return s+h.sec},0)/60);
 c.wVol=c.weekEntries.reduce(function(s,h){return s+h.vol},0);
 c.wKcal=c.weekEntries.reduce(function(s,h){return s+h.kcal},0);
 /* ротация: какая тренировка программы следующая */
 var dn={};c.WK.forEach(function(w,i){if(c.weekEntries.some(function(h){return matchW(h,w)}))dn[i]=1});
 var ni=-1;for(var i=0;i<c.WK.length;i++){if(!dn[i]){ni=i;break}}
 if(ni<0&&c.WK.length){var li=-1;c.weekEntries.forEach(function(h){c.WK.forEach(function(w,j){if(matchW(h,w))li=j})});ni=(li+1)%c.WK.length}
 c.nextIdx=Math.max(0,ni);
 c.n=0;c.wk.forEach(function(iso){c.n+=rawOn(iso).filter(function(o){return !o.cancelled}).length});
 /* серия недель: неделя «в ритме», если выполнен недельный план (как в Прогрессе); без плана — цель по профилю. Текущая неделя ещё не закончена: если в ней порог не достигнут,
    серия считается до прошлой недели и не обрывается. */
 var need=Math.max(1,c.n||goalTarget()),cnt={};
 c.HS.forEach(function(h){var w=weekStartOf(h.d);cnt[w]=(cnt[w]||0)+1});
 var w=c.ws;if((cnt[w]||0)<need)w=addDays(w,-7);
 var st=0,g=0;while((cnt[w]||0)>=need&&g++<700){st++;w=addDays(w,-7)}
 c.streak=st;
 var best=0,run=0;
 if(c.HS.length){var w2=weekStartOf(c.HS[0].d);g=0;while(w2<=c.ws&&g++<900){if((cnt[w2]||0)>=need){run++;best=Math.max(best,run)}else if(w2!==c.ws)run=0;w2=addDays(w2,7)}}
 c.best=best;
 c.since=c.HS.length?Math.max(0,diffDays(c.HS[c.HS.length-1].d,TD)):-1;
 /* вес */
 var wt=arr(FS.get("wt")).filter(function(x){return x&&typeof x==="object"&&isIso(x.d)&&x.d<=TD&&isFinite(+x.v)&&+x.v>=30&&+x.v<=250}).map(function(x){return {d:x.d,v:+x.v}}).sort(function(a,b){return a.d<b.d?-1:a.d>b.d?1:0});
 c.wl=wt;c.wAgo=wt.length?diffDays(wt[wt.length-1].d,TD):-1;
 var S=getSet();c.S=S;c.wRem=S.wRem!==false;
 /* напоминание «позже» */
 var sz=obj(S.snooze);c.snooze=(sz.d===TD&&(isTime(sz.t)||sz.t==="skip"))?sz:null;
 /* тренер */
 var sy=obj(FS.get("sync")),nt=obj(sy.note);c.note=null;
 if(sy.role!=="coach"&&str(nt.text).trim()){var stamp=String(nt.t!=null?nt.t:nt.text);c.note={text:str(nt.text).trim(),from:str(nt.from)||str(obj(c.P.coach).name)||"Тренер",t:nt.t,stamp:stamp,read:String(S.noteRead)===stamp}}
 c.live=liveOk(FS.get("live"))?FS.get("live"):null;
 /* состояние */
 c.state=c.live?"live":c.todayEntries.length?"done":(!c.WK.length)?"noplan":activeOn(TD).length?"train":(c.PD.length||nextPlannedIso())?"rest":"nodays";
 /* пропущенные ранее на этой неделе */
 c.missed=null;c.missedAll=[];
 if(false&&c.HS.length&&c.WK.length){
  var skip=arr(S.skip),since=isIso(c.plan.since)?c.plan.since:"",first=c.HS[0].d,past=[];
  c.wk.forEach(function(iso,d){if(iso>=TD||iso<=first||iso<since||skip.indexOf(iso)>=0)return;if(activeOn(iso).length)past.push(d)});
  var extra=0;c.wk.forEach(function(iso){if(iso<=TD&&c.byDay[iso]&&!rawOn(iso).some(function(o){return !o.cancelled}))extra++});
  past=past.slice(Math.min(extra,past.length));
  if(past.length){var d=past[past.length-1];c.missed={dow:d,iso:c.wk[d]}}
  c.missedAll=past}
 return c}

/* ---------- модель плана: базовые дни + добавленные тренировки + исключения ---------- */
/* plan.days (Пн=0) — базовый недельный шаблон; plan.daysEnd {dow:iso} — последняя дата, когда базовый день ещё действует;
   plan.items [{id,iso,wid,time?,rep:null|{every:1..4,until:iso|null}}]; plan.ex [{iso,src:"base"|itemId,kind:"cancel"|"move"|"swap",to?,wid?,time?,del?}] */
function wAll(id){if(id==null)return null;for(var i=0;i<C.programs.length;i++){var ws=arr(C.programs[i].workouts);for(var j=0;j<ws.length;j++){var w=ws[j];if(w&&typeof w==="object"&&String(w.id)===String(id))return w}}return null}
function getItems(){return arr(C.plan.items).filter(function(it){return it&&typeof it==="object"&&it.id!=null&&isIso(it.iso)&&it.wid!=null})}
function itemById(id){var L=getItems();for(var i=0;i<L.length;i++)if(L[i].id===id)return L[i];return null}
function itEvery(it){var r=it&&it.rep;if(!r||typeof r!=="object")return 0;return clamp(Math.round(num(r.every,1)),1,4)||1}
function itOn(it,iso){if(iso<it.iso)return false;var ev=itEvery(it),df=diffDays(it.iso,iso);if(!ev)return df===0;if(df%(ev*7)!==0)return false;var u=it.rep&&it.rep.until;if(isIso(u)&&iso>u)return false;return true}
function baseAct(iso){var d=dowOf(iso);if(!C.WK.length||C.PD.indexOf(d)<0)return false;var e=obj(C.plan.daysEnd)[d];if(isIso(e)&&iso>e)return false;return true}
function baseWid(iso){
 if(iso<TD||!C.WK.length)return null;
 if(!C._bs){var m={},k=0,d=C.todayEntries.length?addDays(TD,1):TD,g=0,n=C.WK.length;
  while(g++<500){if(baseAct(d)){var x=C.exm[d+"|base"],cn=x&&x.kind==="cancel";m[d]=(C.nextIdx+k)%n;if(!cn)k++}d=addDays(d,1)}
  C._bs=m}
 var i=C._bs[iso];return i==null?null:C.WK[i].id}
function mkOcc(src,iso,wid,time,rep,x){
 var o={src:src,iso:iso,own:iso,wid:wid,time:time||"",rep:rep||null,cancelled:false,moved:false};
 if(x){if(x.kind==="cancel"){if(x.del)return null;o.cancelled=true}
  else{if(x.kind==="move")return null;if(x.wid!=null)o.wid=x.wid;if(isTime(x.time))o.time=x.time}}
 return o}
/* все вхождения даты (включая отменённые, но без удалённых), до учёта уже выполненных */
function rawOn(iso){
 if(C._r[iso])return C._r[iso];
 var out=[];
 if(baseAct(iso)){var o=mkOcc("base",iso,baseWid(iso),C.time,{every:1,until:null},C.exm[iso+"|base"]);if(o)out.push(o)}
 getItems().forEach(function(it){if(!itOn(it,iso))return;var o=mkOcc(it.id,iso,it.wid,isTime(it.time)?it.time:C.time,itEvery(it)?it.rep:null,C.exm[iso+"|"+it.id]);if(o){o.item=it;out.push(o)}});
 arr(C.mv[iso]).forEach(function(x){var it=x.src==="base"?null:itemById(x.src);if(x.src!=="base"&&!it)return;
  if(x.src==="base"&&!C.WK.length)return;
  var wid=x.wid!=null?x.wid:(it?it.wid:baseWid(x.iso));
  out.push({src:x.src,iso:iso,own:x.iso,wid:wid,time:isTime(x.time)?x.time:(it&&isTime(it.time)?it.time:C.time),rep:it?(itEvery(it)?it.rep:null):{every:1,until:null},cancelled:false,moved:true,item:it})});
 out=out.filter(function(o){o.w=wAll(o.wid);return o.src==="base"&&o.wid==null?true:!!o.w});
 out.sort(function(a,b){return (a.time||"99")<(b.time||"99")?-1:(a.time||"99")>(b.time||"99")?1:0});
 C._r[iso]=out;return out}
/* единая функция: что запланировано на дату (без уже выполненного) → [{src,wid,time,rep,cancelled,...}] */
function plannedOn(iso){
 if(C._p[iso])return C._p[iso];
 var raw=rawOn(iso),H=C.byDay[iso]||[],res=raw;
 if(H.length){var used=H.map(function(){return false}),sat=[];
  raw.forEach(function(o,ix){if(o.src==="base"||o.cancelled||!o.w)return;for(var j=0;j<H.length;j++)if(!used[j]&&matchW(H[j],o.w)){used[j]=true;sat[ix]=1;break}});
  raw.forEach(function(o,ix){if(o.src!=="base"||o.cancelled)return;for(var j=0;j<H.length;j++)if(!used[j]){used[j]=true;sat[ix]=1;break}});
  res=raw.filter(function(o,ix){return !sat[ix]})}
 C._p[iso]=res;return res}
function activeOn(iso){return plannedOn(iso).filter(function(o){return !o.cancelled})}
function nextPlannedIso(){for(var i=1;i<=150;i++){var iso=addDays(TD,i);if(activeOn(iso).length)return iso}return null}
function dayDone(iso){return !!C.byDay[iso]}
function isMissed(i){return !!(C.missedAll&&C.missedAll.indexOf(i)>=0)}
function wName(o){return o&&o.w?(str(o.w.name)||"Тренировка"):"Тренировка по плану"}
function wMeta(w){var st=w?GEN.stats(w):null;return st?{min:st.min,ex:st.ex}:null}
function repName(e){return e===1?"Каждую неделю":e===2?"Раз в 2 недели":e===3?"Раз в три недели":e===4?"Раз в месяц":"Один раз"}
function repTxt(o){if(!o||!o.rep)return "";var e=o.src==="base"?1:itEvery(o.item||itemById(o.src));if(!e)return "";var u=o.rep&&isIso(o.rep.until)?" · до "+shortDate(o.rep.until):"";return repName(e)+u}
function inSeries(o){if(!o||o.moved)return false;if(o.src==="base")return true;return itEvery(o.item||itemById(o.src))>0}
function findOcc(src,own,iso){var L=plannedOn(iso);for(var i=0;i<L.length;i++)if(L[i].src===src&&L[i].own===own)return L[i];return null}
/* нормализация: действующие базовые дни, закончившиеся в прошлом, убираем из plan.days; чистим старые исключения */
function normPlan(){
 var raw=FS.get("plan");if(!raw||typeof raw!=="object"||Array.isArray(raw))return;
 var ch=false,de=obj(raw.daysEnd),days=Array.isArray(raw.days)?raw.days.slice():[];
 Object.keys(de).forEach(function(k){var e=de[k],d=+k;if(!isIso(e)){delete de[k];ch=true;return}
  if(e<TD){days=days.filter(function(x){return +x!==d});delete de[k];ch=true}});
 if(ch){raw.days=days;if(Object.keys(de).length)raw.daysEnd=de;else delete raw.daysEnd}
 if(Array.isArray(raw.ex)){var lim=addDays(TD,-60),ex=raw.ex.filter(function(x){return x&&typeof x==="object"&&isIso(x.iso)&&(x.iso>=lim||(isIso(x.to)&&x.to>=lim))});if(ex.length!==raw.ex.length){raw.ex=ex;ch=true}}
 if(ch)FS.set("plan",raw)}

/* ---------- навигация ---------- */
function goWork(i){send({t:"tab",to:"work"});if(i!=null)send({t:"sub",i:i})}
/* в библиотеку с готовым фильтром (одноразовая заявка через хранилище; библиотека читает её при показе) */
function toLib(o){try{FS.set("libq",o)}catch(e){}send({t:"sub",i:3})}
function startW(w){buzz(10);if(w&&w.id)send({t:"open",start:w.id});else if(w&&w.key!=null)send({t:"open",k:w.key});else goWork(0)}
function detW(w){buzz(6);if(w&&w.id)send({t:"open",wid:w.id});else if(w&&w.key!=null)send({t:"open",k:w.key});else goWork(0)}
function wById(id){for(var i=0;i<C.WK.length;i++)if(String(C.WK[i].id)===String(id))return C.WK[i];return null}

/* ---------- вывод секциями ---------- */
var RM=false;try{RM=!!(window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches)}catch(e){}
/* mode: "swap" — старое уходит 160ms, новое входит .45s (общий swapPane); "none" — без анимации секции; иначе — только мягкое появление */
function put(id,html,after,mode){var el=document.getElementById(id);if(!el)return;if(cache[id]===html)return;var first=cache[id]===undefined;cache[id]=html;
 function draw(){el.innerHTML=cache[id];if(after)after(el)}
 if(first||firstDraw||mode==="none"||RM){draw();return}
 swapPane(el,draw,{out:mode==="swap"})}
function safe(fn,id){try{return fn()}catch(e){try{console.warn("home:"+id,e)}catch(_){}return cache[id]===undefined?"":cache[id]}}

function greet(){var h=new Date().getHours(),g=h>=5&&h<12?"Доброе утро":h>=12&&h<18?"Добрый день":h>=18&&h<23?"Добрый вечер":"Доброй ночи",n=str(C.P.name).trim().split(/\s+/)[0];return n?g+", "+esc(n):g}

function secHd(){var nb=C.nt.filter(function(n){return n.unread}).length;
 return '<div class="hd"><div><div class="date">'+WDF[C.todayDow]+', '+dmy(TD)+'</div><h2>'+greet()+'</h2></div><div class="hbs"><button class="bellb calb" data-a="cal" aria-label="Календарь тренировок">'+ic("calic")+'</button><button class="bellb" data-a="bell" aria-label="Уведомления">'+ic("bell")+(nb?'<span class="bd">'+(nb>9?"9+":nb)+'</span>':'')+'</button></div></div>'}

/* неделя */
function dayPct(iso){var l=C.byDay[iso];return l&&l.length?1:0}

function goalTarget(){var m={stroy:4,relief:3,force:3,start:2,recover:2,reg:3};return m[str(C.P.goal)]||3}
function wkList(){var first=C.HS.length?weekStartOf(C.HS[0].d):C.ws,st=addDays(C.ws,-28);if(first<st)st=first;var lim=addDays(C.ws,-84);if(st<lim)st=lim;var out=[],w=st,end=addDays(C.ws,56);while(w<=end){out.push(w);w=addDays(w,7)}return out}
var FLM='<svg class="flm" viewBox="0 0 24 24" aria-hidden="true"><path class="fo" d="M12.6 2c.5 3.3-1.4 5-3 6.8C7.8 10.7 6 12.7 6 15.6A6 6 0 0 0 18 15.6c0-2.5-1.1-4.2-2.2-5.6-.3 1.5-1 2.4-2.1 3C14.1 9.3 13.5 5 12.6 2z"/><path class="fi" d="M12 21a3.2 3.2 0 0 1-3.2-3.3c0-1.4.8-2.2 1.6-3.1.6-.7 1.1-1.3 1.2-2.3 1.3 1 2.7 2.7 2.7 5A3.2 3.2 0 0 1 12 21z"/></svg>';
var FEM=["ноль","одна","две","три","четыре","пять","шесть","семь","восемь","девять","десять"];
function nTr(k){return plural(k,["тренировка","тренировки","тренировок"])}
function wkStat(ws){var we=addDays(ws,6),k=0,n=0,i;C.HS.forEach(function(h){if(h.d>=ws&&h.d<=we)k++});
 for(i=0;i<7;i++)n+=rawOn(addDays(ws,i)).filter(function(o){return !o.cancelled}).length;
 var cur=ws===C.ws,txt,hint="",pct;
 if(cur){if(!n)n=goalTarget();if(n<k)n=k;pct=Math.min(100,Math.round(k/n*100));
  txt="Ваш тренировочный ритм: "+k+" из "+n;
  hint=k===0?"Первый шаг запустит ритм вашей недели":k<n?"Ещё "+FEM[Math.min(n-k,10)]+", и вы закроете свою цель":"Цель недели выполнена, так держать";
  if(C.streak>=2)hint+=". Серия: "+plural(C.streak,["неделя","недели","недель"])+" подряд"}
 else if(we<TD){if(!(isIso(C.plan.since)&&we>=C.plan.since))n=0;if(n<k)n=k;pct=n?Math.round(k/n*100):0;
  txt=k===0?"Тренировок не было":n>k?"Проведено "+k+" из "+n:"Проведено: "+nTr(k)}
 else{pct=0;txt=n?"Запланировано: "+nTr(n):"Пока ничего не запланировано"}
 var seg=(cur||(we<TD&&n>0)),lt=seg?(cur?"Ваш ритм: ":"Ритм: ")+plural(k,["тренировка","тренировки","тренировок"])+" из "+n:txt;return {k:k,n:n,pct:pct,txt:txt,hint:hint,lt:lt,pr:seg?pct+"%":""}}
function secWeek(){
 var W=wkList(),st=wkStat(wkVis),pages=W.map(function(ws){var hs=selIso>=ws&&selIso<=addDays(ws,6),days="";
  for(var i=0;i<7;i++){var iso=addDays(ws,i),done=dayDone(iso),planned=activeOn(iso).length>0&&!done,td=iso===TD;
   var cls="wd"+(td?" today":"")+(iso===selIso?" sel":"")+(done?" done":"")+(planned&&iso>=TD?" plan":"");
   var lab=done?"выполнено":planned&&iso>=TD?"по плану":"отдых";
   days+='<button class="'+cls+'" data-a="day" data-i="'+i+'" data-iso="'+iso+'" aria-label="'+WDF[i]+', '+dmy(iso)+', '+lab+'"><div class="rg"><svg viewBox="0 0 36 36"><circle class="t" cx="18" cy="18" r="15"/><circle class="f" cx="18" cy="18" r="15" pathLength="1"'+(done?' data-f="1.000"':'')+'/></svg><i>'+(done?ic("check"):dayOfMonth(iso))+'</i></div><b>'+WD[i]+'</b></button>'}
  return '<div class="wkp" data-ws="'+ws+'"><div class="week">'+(hs?'<i class="wsel" style="--i:'+dowOf(selIso)+'"></i>':'')+days+'</div></div>'}).join("");
 var showBack=selIso!==TD||wkVis!==C.ws;
 return '<div class="card wk"><div class="wkscroll" id="wkscroll">'+pages+'</div><button class="rb rbbtn" data-a="wkfold" aria-expanded="'+(!!st.hint&&wkOpen)+'" aria-label="Ритм недели"><div class="rbt" style="--n:'+Math.max(1,Math.min(st.n,12))+'"><i class="rbf'+(st.pct?"":" z")+'" data-p="'+st.pct+'"><b class="rbg"></b><u class="rbfl">'+FLM+'</u></i></div></button><button class="rbl wkl2 wkmain" data-a="wkfold" aria-expanded="'+(!!st.hint&&wkOpen)+'"><span id="wkTxt">'+st.lt+'</span><span class="wkpc">'+st.pr+'</span></button>'+(st.hint?'<div class="wkfold'+(wkOpen?" open":"")+'"><div><div class="wkhint">'+st.hint+'</div></div></div>':'')+'<div class="rtip" id="wkTip" role="status">Индикатор тренировочного ритма помогает вам выбрать желаемую регулярность тренировок и еженедельно придерживаться цели</div></div>'}
function dropMove(ws,wk,from,to){
 var cw=(wk.clientWidth-8)/7,x0=4+from*cw,x1=4+to*cw;
 ws.style.setProperty("--i",0);ws.style.width=cw+"px";ws.style.left=x0+"px";ws.style.transform="none";
 if(from===to||RM){ws.style.left=x1+"px";return}
 var dur=560,t0=performance.now();
 function io(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}
 function step(now){var t=Math.min(1,(now-t0)/dur),c=x0+cw/2+(x1-x0)*io(t),w=cw*(1+.16*Math.sin(Math.PI*t));
  ws.style.left=(c-w/2)+"px";ws.style.width=w+"px";
  if(t<1)requestAnimationFrame(step);else{ws.style.left=x1+"px";ws.style.width=cw+"px"}}
 requestAnimationFrame(step)}
function afterWeek(el){
 var f=$(".rbf",el),ws=$(".wsel",el),sc=$("#wkscroll",el),W=wkList(),ix=W.indexOf(wkVis);
 if(sc&&ix>=0){sc.style.scrollSnapType="none";sc.scrollLeft=ix*sc.clientWidth;requestAnimationFrame(function(){sc.style.scrollSnapType=""});
  var tm=null;sc.addEventListener("scroll",function(){clearTimeout(tm);tm=setTimeout(function(){var w=sc.clientWidth;if(!w)return;var j=Math.max(0,Math.min(W.length-1,Math.round(sc.scrollLeft/w))),nw=W[j];
   if(nw&&nw!==wkVis){wkVis=nw;selIso=nw===C.ws?TD:addDays(nw,dowOf(selIso));heroSwap=true;buzz(6);render(true)}},110)},{passive:true})}
 if(ws){var to=dowOf(selIso),from=(lastSel&&isIso(lastSel)&&weekStartOf(lastSel)===wkVis)?dowOf(lastSel):to;dropMove(ws,ws.parentNode,from,to)}
 lastSel=selIso;
 $$(".wd.done",el).forEach(function(b,j){var iso=b.dataset.iso,c=$(".f",b),to=0;if(drawn[iso]){c.style.transition="none";c.style.strokeDashoffset=to;requestAnimationFrame(function(){requestAnimationFrame(function(){c.style.transition=""})})}else{drawn[iso]=1;setTimeout(function(){c.style.strokeDashoffset=to},260+j*70)}});
 if(f){var tr=f.parentNode;tr.style.setProperty("--tw",tr.offsetWidth+"px");var to2=+f.dataset.p||0;f.style.transition="none";f.style.width=lastPct+"%";f.getBoundingClientRect();f.style.transition="";f.style.width=to2+"%";lastPct=to2}}

/* главная карточка: одна компактная плашка (текст слева, действие справа) */
function dat(o){var s="";for(var k in o)if(k!=="a"&&k!=="l"&&k!=="cls")s+=' data-'+k+'="'+esc(o[k])+'"';return s}
function heroBox(o){
 var l=(o.det!=null?'<button class="hl" data-a="det" data-w="'+esc(o.det)+'" aria-label="Подробнее о тренировке">':'<div class="hl">')+
  (o.eb?'<span class="eyebrow">'+(o.dot?'<i class="dot"></i>':'')+esc(o.eb)+'</span>':'')+'<h3'+(o.dim?' class="dim"':'')+'>'+esc(o.h)+'</h3>'+(o.m?'<span class="hm">'+esc(o.m)+'</span>':'')+(o.det!=null?'</button>':'</div>'),a="";
 if(o.b)a+='<button class="pb '+(o.b.cls||"go")+'" data-a="'+o.b.a+'"'+dat(o.b)+'>'+esc(o.b.l)+'</button>';
 if(o.k)a+='<button class="pk" data-a="'+o.k.a+'"'+dat(o.k)+'>'+esc(o.k.l)+'</button>';
 return '<div class="hero cmp'+(o.cls?" "+o.cls:"")+'" id="hero" data-noswipe="1">'+(o.dot?'':'<button class="hx" data-a="hclose" aria-label="Закрыть"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>')+(o.ok?'<span class="okc">'+ic("check")+'</span>':'')+l+'<div class="ha">'+a+'</div></div>'}
function metaTxt(w,extra){var m=wMeta(w),p=[];if(m){p.push(m.min+" мин");p.push(plural(m.ex,["упражнение","упражнения","упражнений"]))}if(extra)p.push(extra);return p.join(" · ")}
function doneCard(iso,list,isToday){
 var e=list[list.length-1],mn=Math.max(1,Math.round(e.sec/60));
 return heroBox({ok:1,cls:"dn",eb:dLine(iso),h:e.wn+(list.length>1?" · ещё "+(list.length-1):""),
  m:"Завершена за "+mn+" мин на "+Math.round(e.pct)+" %",b:{a:"sum",l:"Итоги",cls:"l",iso:iso}})}
function heroLive(){var l=C.live,tot=0,dn=0;arr(l.ex).forEach(function(x){arr(obj(x).sets).forEach(function(q){tot++;if(q&&q.done)dn++})});
 var nm=str(l.name)||str(l.wn)||"Тренировка";
 return heroBox({cls:"big",dot:1,eb:dLine(TD),h:nm,m:tot?"Сделано "+dn+" из "+tot+" подходов":"Можно продолжить с того же места",b:{a:"live",l:"Продолжить"}})}
var EQL={trx:"TRX",dumbbell:"гантели",barbell:"штанга",machine:"тренажёры",cable:"блок",band:"резинка",kettlebell:"гиря"},EQIX=null,EQN0=-1;
function eqIndex(){var c=[];try{c=GEN.cat()}catch(e){}if(!EQIX||c.length!==EQN0){EQIX={};c.forEach(function(x){EQIX[x.id]=x.eq});EQN0=c.length}return EQIX}
function eqTxt(w){var ix=eqIndex(),seen={},out=[];arr(w&&w.ex).forEach(function(x){var k=ix[x&&x.id];if(k&&EQL[k]&&!seen[k]){seen[k]=1;out.push(EQL[k])}});
 if(!out.length)return "без инвентаря";var t=out.join(", ");return t.charAt(0).toUpperCase()+t.slice(1)}
function dayMeta(w){var m=wMeta(w);return (m&&m.min?"≈ "+m.min+" мин · ":"")+eqTxt(w)}
function dLine(iso){return WDF[dowOf(iso)]+", "+dmy(iso)}
function heroEmpty(iso){return heroBox({cls:"big",eb:dLine(iso||TD),h:"Нет тренировки",b:{a:"pickw",l:"Выбрать",cls:"gl",iso:iso||TD}})}
function heroTrain(){
 var es=activeOn(TD),e=es[0]||{},w=e.w||C.WK[C.nextIdx],sz=C.snooze,wid=w&&w.id!=null?w.id:"";
 if(sz&&sz.t==="skip")return heroBox({cls:"big",eb:dLine(TD),h:"Сегодня пропускаем",m:"Это нормально, вернёмся завтра",b:{a:"start",l:"Всё-таки начать",w:wid}});
 return heroBox({cls:"big",eb:dLine(TD),h:str(w&&w.name)||"Тренировка",m:dayMeta(w)+(es.length>1?" · ещё "+(es.length-1):""),det:wid,b:{a:"start",l:"Начать тренировку",w:wid}})}
function cap(t){return t.charAt(0).toUpperCase()+t.slice(1)}
function relDay(iso){var d=diffDays(TD,iso);return d===1?"завтра":d<7?WDV[dowOf(iso)]:shortDate(iso)}
function heroRest(){
 var ni=nextPlannedIso(),e=ni?activeOn(ni)[0]:null;
 return heroBox({cls:"big",eb:dLine(TD),h:"День отдыха",m:ni?cap(relDay(ni))+(e?": "+wName(e):" по плану"):"",b:{a:"pickw",l:"Выбрать",cls:"gl",iso:TD}})}
function heroNone(){
 if(!C.WK.length)return heroBox({cls:"big",eb:dLine(TD),h:"Пока нет тренировок",m:"Соберите свою или возьмите готовую программу",b:{a:"mkown",l:"Собрать",cls:"gl"}});
 if(C.state==="nodays")return heroBox({cls:"big",eb:dLine(TD),h:"Нет тренировки",m:"Дни занятий не выбраны",b:{a:"pickdays",l:"Выбрать дни",cls:"gl"},k:{a:"pickw",l:"На сегодня",iso:TD}});
 return heroEmpty(TD)}
function dayCard(iso){
 var list=C.byDay[iso];if(list)return doneCard(iso,list,false);
 if(iso>=TD){var es=activeOn(iso),e=es[0];
  if(e)return heroBox({cls:"big",eb:dLine(iso),h:wName(e),m:dayMeta(e.w)+(es.length>1?" · ещё "+(es.length-1):""),det:e.wid!=null?e.wid:"",b:{a:"calday",l:"Изменить",cls:"l",iso:iso}});
  return heroEmpty(iso)}
 return heroBox({cls:"big",eb:dLine(iso),h:"Тренировки не было"})}
var HDIS={};
function heroKey(){return selIso+"|"+C.state}
function secHero(){
 if(C.state==="live")return heroLive();
 if(HDIS[heroKey()])return "";
 if(selIso!==TD)return dayCard(selIso);
 if(C.state==="done")return doneCard(TD,C.todayEntries,true);
 if(C.state==="train")return heroTrain();
 if(C.state==="rest")return heroRest();
 return heroNone()}
function afterHero(el){
 if(C.state==="done"&&selIso===TD){var key=TD+":"+C.todayEntries.length;if(celebrated!==key){celebrated=key;var ua=navigator.userActivation;if(!ua||ua.hasBeenActive)setTimeout(function(){pulseAt($(".okc",el))},500)}}}

/* сдвиг пропущенной тренировки */
function secMiss(){
 if(!C.missed||selIso!==TD||C.state==="live")return "";
 var m=C.missed,canToday=activeOn(TD).length===0&&!C.todayEntries.length&&C.state!=="done";
 return '<div class="pl"><span class="pi">'+ic("calic")+'</span><div class="pt"><b>Тренировка сдвинулась</b><span>'+WDF[m.dow]+(canToday?" — на сегодня?":" — на другой день?")+'</span></div><div class="pa">'+(canToday?'<button class="pb go" data-a="mvt" data-iso="'+m.iso+'">На сегодня</button><button class="pk" data-a="mvd" data-iso="'+m.iso+'">Другой день</button>':'<button class="pb go" data-a="mvd" data-iso="'+m.iso+'">Другой день</button>')+'</div><button class="px" data-a="skm" data-iso="'+m.iso+'" aria-label="Оставить как есть">'+ic("x")+'</button></div>'}

/* сообщение тренера */
function initials(s){var p=str(s).trim().split(/\s+/).filter(Boolean);return esc((p[0]?p[0].charAt(0):"Т")+(p[1]?p[1].charAt(0):"")).toUpperCase()}
function whenTxt(t){if(t==null||t==="")return "";var d=typeof t==="number"||/^\d{9,}$/.test(String(t))?new Date(+t):new Date(String(t));if(isNaN(d.getTime()))return "";var iso=isoOf(d),df=diffDays(iso,TD);return df===0?"сегодня":df===1?"вчера":df>1&&df<400?shortDate(iso):""}
function secCoach(){var n=C.note;if(!n||n.read)return "";var w=whenTxt(n.t);
 return '<div class="pl top"><span class="pi av">'+initials(n.from)+'</span><div class="pt"><b>'+esc(n.from)+' · тренер'+(w?'<em class="when">'+w+'</em>':'')+'</b><span class="q">'+esc(n.text)+'</span></div><div class="pa"><button class="pb go" data-a="reply">Открыть</button><button class="pk" data-a="noteread">Прочитано</button></div></div>'}

/* вес */
function wDyn(){var L=C.wl;if(!L.length)return "";var last=L[L.length-1],base=null;
 for(var i=0;i<L.length-1;i++){if(L[i].d>=addDays(last.d,-30)){base=L[i];break}}
 if(!base)return L.length===1?"Сравним со следующим разом":"За 30 дней других записей не было";
 var d=r1(last.v-base.v),n=diffDays(base.d,last.d);return (d===0?"без изменений":(d>0?"+":"−")+fk(Math.abs(d))+" кг")+" за "+(n>=28?"30 дней":plural(n,["день","дня","дней"]))}
function plCard(k,ico,title,sub,a){
 return '<div class="pl mk2 plw"><button class="plm" data-a="'+a+'"><span class="pi cr">'+ic(ico)+'</span><div class="pt"><b>'+title+'</b><span>'+sub+'</span></div></button><div class="pla"><button class="plp" data-a="'+a+'" aria-label="Добавить">'+ic("plus")+'</button><button class="plh" data-a="hide" data-k="'+k+'" aria-label="Закрыть">'+ic("x")+'</button></div></div>'}
function secWeight(){
 var L=C.wl,last=L[L.length-1];
 var wm=remCfg(C.S).w;
 if(wm==="off"||C.S.wSkip===TD||obj(C.S.hide).w===C.ws)return "";
 if(last&&last.d===TD)return "";/* вес за сегодня внесён: больше не напоминаем */
 if(wm==="weekly"&&L.length&&C.wAgo<7)return "";
 return plCard("w","scale","Вес",L.length?"Последний: "+fk(last.v)+" кг, "+agoTxt(C.wAgo):"Это будет точка отсчёта","wopen")}
/* питание: сколько записано сегодня (данные вкладки «Питание»), норма — если она сохранена в профиле */
function nfmt(v){return String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g,"\u2009")}
function foodToday(){var l=arr(obj(obj(FS.get("nutr")).days)[TD]),k=0,n=0;l.forEach(function(e){if(e&&typeof e==="object"){var v=+e.k;if(isFinite(v)&&v>0){k+=v;n++}}});return {k:Math.round(k),n:n}}
function secFood(){
 if(obj(C.S.hide).f===C.ws||!remCfg(C.S).f)return "";
 var f=foodToday(),norm=Math.round(num(obj(C.P.nut).kcal)),sub;
 if(f.n&&norm>0)sub="Сегодня "+nfmt(f.k)+" из "+nfmt(norm)+" ккал";
 else if(f.n)sub="Сегодня "+nfmt(f.k)+" ккал";
 else if(norm>0)sub="Сегодня пока пусто · норма "+nfmt(norm)+" ккал";
 else sub="Приёмы пищи и норма калорий";
 return plCard("f","food","Питание",sub,"food")}
/* готовые программы по профилю */
var OFF=[],offKey=null;
function getOffers(){
 var P=C.P,lv=clamp(Math.round(num(P.lvl,1))||1,1,3),wh=P.where,bought={};try{arr(obj(FS.get("progs")).programs).forEach(function(p){if(p&&p.tpl)bought[p.tpl]=1})}catch(e){}
 var key=[wh,lv,P.goal,arr(P.cau).join(","),arr(P.cx).join(","),P.preg,arr(P.eq).join(","),GEN.cat().length,Object.keys(bought).join(",")].join("|");
 if(offKey===key)return OFF;
 var T=[];try{T=GEN.templates(FS.get("profile"))}catch(e){T=[]}
 var cau=arr(P.cau).join(" ").toLowerCase(),ls=[];try{cau+=" "+RX.cauOf(P).join(" ").toLowerCase()}catch(e){}
 T.forEach(function(t,i){
  if(!t||!arr(t.workouts).length)return;
  if(t.lvl>lv+1)return;
  if(bought[t.id])return;
  if((wh==="gym"&&t.where==="home")||(wh==="home"&&t.where==="gym"))return;
  var s=t.lvl===lv?2:(Math.abs(t.lvl-lv)===1?1:0);
  if(wh==="gym"||wh==="home")s+=t.where===wh?3:1;else s+=t.where==="both"?1:0.5;
  if(P.goal&&t.goal===P.goal)s+=1.5;
  if(/колен|спин|поясниц|сердц|беремен/.test(cau)&&t.id==="tpl-gentle")s+=6;
  ls.push({t:t,s:s,i:i})});
 ls.sort(function(a,b){return b.s-a.s||a.i-b.i});
 OFF=ls.slice(0,3).map(function(x){return x.t});offKey=key;return OFF}
function secOffers(){
 if(!offReady)return "";
 var T=getOffers();if(!T.length)return "";
 var LV=["","Новичок","Средний","Продвинутый"];
 var cards=T.slice(0,3).map(function(t,i){var n=arr(t.workouts).length;
  return '<button class="of" data-a="off" data-t="'+esc(t.id)+'"><span class="tg">'+(i===0?"Для вас":"Программа")+'</span><h4>'+esc(t.name)+'</h4><span class="t">'+LV[clamp(num(t.lvl,1),1,3)]+" · ~"+num(t.mins,30)+" мин · "+plural(n,["тренировка","тренировки","тренировок"])+'</span></button>'}).join("");
 return '<div class="sech"><b>Готовые программы для вас</b></div><div class="offers" id="offers">'+cards+'<button class="of ofall" data-a="all"><span class="ofa">'+ic("chev")+'</span><b>Все готовые программы</b></button></div>'}
function secMk(){
 if(obj(C.S.hide).mk===C.ws||!remCfg(C.S).mk)return "";
 if(C.state==="live"||C.state==="done")return "";/* тренировка начата или проведена: подсказка не нужна */
 var g="dumb";
 return plCard("mk",g,"Собрать свою тренировку","Под ваше оборудование","mkown")}

/* ---------- уведомления ---------- */
function notifs(){
 var S=C.S,cr=obj(S.cread),L=[];
 function add(id,stamp,o){o.id=id;o.stamp=String(stamp);o.unread=cr[id]!==o.stamp;L.push(o)}
 if(C.live)add("c:live",C.live.wid||"x",{ic:"dumb",bg:"var(--coral-soft)",fg:"var(--coral)",title:"Тренировка не закончена",text:"«"+(str(C.live.name)||"Тренировка")+"»: можно продолжить с того места, где остановились",a:"live"});
 if(C.note)add("c:coach",C.note.stamp,{ic:"chat",bg:"var(--coral-soft)",fg:"var(--coral)",title:C.note.from,text:C.note.text,a:"reply",unreadByNote:true});
 if(C.state==="train"&&!(C.snooze&&C.snooze.t==="skip")){var pe=activeOn(TD)[0]||{};add("c:train",TD,{ic:"clock",bg:"var(--coral-soft)",fg:"var(--coral)",title:"Сегодня по плану"+(pe.time?" в "+pe.time:""),text:str(pe.w&&pe.w.name)||"По плану",a:"hero"})}
 if(C.missed)add("c:miss",C.missed.iso,{ic:"calic",bg:"var(--pink-soft)",fg:"var(--pink-ink)",title:WDF[C.missed.dow]+" "+WDJ[C.missed.dow],text:"Перенесём на другой день? Без спешки.",a:"mvd"});
 if(C.wRem){if(!C.wl.length)add("c:w",TD,{ic:"scale",bg:"var(--green-soft)",fg:"var(--green-ink)",title:"Запишите свой вес",text:"Это точка отсчёта для ваших изменений",a:"wopen"});
  else if(C.wAgo>=7)add("c:w",TD,{ic:"scale",bg:"var(--green-soft)",fg:"var(--green-ink)",title:"Взвесимся на этой неделе?",text:"Последний раз: "+agoTxt(C.wAgo)+" ("+fk(C.wl[C.wl.length-1].v)+" кг)",a:"wopen"})}
 if(C.since>=5&&C.state!=="live"&&C.state!=="done")add("c:pause",TD,{ic:"leaf",bg:"var(--surface2)",fg:"var(--ink2)",title:"Пауза уже "+plural(C.since,["день","дня","дней"]),text:"Можно вернуться мягко: 10 минут разминки",a:"mob"});
 var TM={coach:["chat","var(--coral-soft)","var(--coral)","Тренер","reply"],remind:["clock","var(--coral-soft)","var(--coral)","Напоминание","hero"],medal:["medal","var(--surface2)","var(--ink2)","Достижение","prog"],weight:["scale","var(--green-soft)","var(--green-ink)","Вес","wopen"]};
 var raw=arr(S.notif),st=[];raw.forEach(function(n,ix){if(n&&typeof n==="object")st.push({n:n,ix:ix})});
 st.slice(-30).reverse().forEach(function(o){var n=o.n,t=TM[n.t]||["bell","var(--surface2)","var(--ink2)","Forma",""];
  L.push({id:"s:"+o.ix,ix:o.ix,stored:true,ic:t[0],bg:t[1],fg:t[2],title:t[3],text:str(n.text),a:t[4],unread:n.read!==true,stamp:"1"})});
 return L}
function readNotif(n,v){
 var S=getSet();
 if(n.stored){var x=S.notif[n.ix];if(x&&typeof x==="object")x.read=!!v}
 else if(n.unreadByNote){S.noteRead=v?n.stamp:null}
 else{S.cread=obj(S.cread);if(v)S.cread[n.id]=n.stamp;else delete S.cread[n.id]}
 saveSet(S)}
function drawNotifs(){
 var L=C.nt,el=$("#nlist");
 if(!L.length){el.innerHTML='<div class="nempty"><b>Пока всё спокойно</b><span>Здесь появятся напоминания о тренировках, весе и сообщения тренера.</span><button class="pb l" data-go="prof">Настроить напоминания</button></div>';$("#nall").style.visibility="hidden";return}
 $("#nall").style.visibility=L.some(function(n){return n.unread})?"visible":"hidden";
 el.innerHTML=L.map(function(n,i){return '<button class="nc'+(n.unread?"":" rd")+'" data-i="'+i+'"><div class="ic" style="background:'+n.bg+';color:'+n.fg+'">'+ic(n.ic)+'</div><div class="nt"><b>'+esc(n.title)+'</b><span>'+esc(n.text)+'</span></div><i class="ud"></i></button>'}).join("")}
function openNotifs(btn){drawNotifs();openSheet("shN")}
$("#nlist").addEventListener("click",function(e){var g=e.target.closest("[data-go]");if(g){buzz(6);closeAll();setTimeout(function(){send({t:"tab",to:g.dataset.go})},260);return}var b=e.target.closest(".nc");if(!b)return;var n=C.nt[+b.dataset.i];if(!n)return;buzz(6);
 if(n.unread){readNotif(n,true);b.classList.add("rd");render(true)}
 var a=n.a;if(!a){drawNotifs();return}
 closeAll();setTimeout(function(){act(a,{})},260)});
$("#nall").onclick=function(){buzz(8);C.nt.forEach(function(n){if(n.unread)readNotif(n,true)});render(true);drawNotifs();pulseAt($("#nall"))};

/* ---------- окно выбора дней ---------- */
var DPS=null;
function drawDays(){var h="";for(var i=0;i<7;i++){var on=DPS.sel.indexOf(i)>=0,dis=DPS.dis.indexOf(i)>=0;h+='<button class="dpc'+(on?" on":"")+(dis?" dis":"")+(i===C.todayDow?" td":"")+'" data-d="'+i+'" aria-pressed="'+on+'"><b>'+WD[i]+'</b><i>'+dayOfMonth(C.wk[i])+'</i></button>'}
 $("#dpd").innerHTML=h;$("#dpok").disabled=DPS.sel.length<DPS.min}
function openDays(o,btn){DPS={multi:!!o.multi,sel:arr(o.sel).slice(),dis:arr(o.dis),min:o.min||1,done:o.done};
 $("#dpe").textContent=o.eyebrow||"";$("#dpt").textContent=o.title||"Выберите день";$("#dpsub").textContent=o.sub||"";$("#dph").textContent=o.hint||"";drawDays();openWin("#dp",btn)}
function closeDp(){$("#dp").classList.remove("on");if(!$$(".win.on,.sheet.on").length)$("#scrim").classList.remove("on")}
$("#dpd").addEventListener("click",function(e){var b=e.target.closest(".dpc");if(!b||!DPS)return;var d=+b.dataset.d,j=DPS.sel.indexOf(d);
 if(DPS.multi){if(j>=0)DPS.sel.splice(j,1);else DPS.sel.push(d)}else DPS.sel=[d];
 drawDays();var nb=$('.dpc[data-d="'+d+'"]',$("#dpd"));if(nb&&DPS.sel.indexOf(d)>=0)pulseAt(nb,"var(--coral)");buzz(6)});
$("#dpc").onclick=function(){buzz(6);DPS=null;closeDp()};
$("#dpok").onclick=function(){if(!DPS||DPS.sel.length<DPS.min)return;var s=DPS.sel.slice().sort(function(a,b){return a-b}),fn=DPS.done;pulseAt($("#dpok"));buzz([8,30,8]);DPS=null;setTimeout(function(){closeDp();fn&&fn(s)},380)};


/* ---------- «Позже» ---------- */
function snoozeOpts(){var now=new Date(),o=[];[1,2].forEach(function(h){var t=new Date(now.getTime()+h*36e5),m=Math.ceil(t.getMinutes()/5)*5,hh=t.getHours();if(m===60){m=0;hh++}var d=new Date(t.getFullYear(),t.getMonth(),t.getDate(),hh,m);if(isoOf(d)===TD)o.push({h:h,t:p2(d.getHours())+":"+p2(d.getMinutes())})});return o}
function openSnooze(){
 var p=activeOn(TD)[0],w=p&&p.w,o=snoozeOpts(),h="";
 o.forEach(function(x){h+='<button class="snz" data-t="'+x.t+'">Через '+(x.h===1?"1 час":"2 часа")+'<em>'+x.t+'</em></button>'});
 if(C.snooze&&isTime(C.snooze.t)&&C.time)h+='<button class="snz q" data-t="'+C.time+'" data-reset="1">Вернуть по плану<em>'+C.time+'</em></button>';
 h+='<button class="snz q" data-t="skip">Пропустить сегодня<em></em></button>';
 $("#shSs").textContent=(w&&w.name?"«"+w.name+"». ":"")+"Напомним в выбранное время, без давления.";
 $("#snzl").innerHTML=h;openSheet("shS")}
$("#snzl").addEventListener("click",function(e){var b=e.target.closest(".snz");if(!b)return;var t=b.dataset.t,S=getSet();
 if(b.dataset.reset){delete S.snooze}else S.snooze={d:TD,t:t};saveSet(S);pulseAt(b);buzz([8,30,8]);
 var msg=t==="skip"?"Сегодня без тренировки. Это нормально":b.dataset.reset?"Вернули время по плану: "+t:"Напомним в "+t;
 setTimeout(function(){closeAll();toast(msg);render(true)},320)});

/* ---------- вес ---------- */
var W_MIN=30,W_MAX=250,wv=60,wok=true,wlast=null,rulerBuilt=false;
function buildRuler(){if(rulerBuilt)return;rulerBuilt=true;var tk=$("#wr .ticks"),f=document.createDocumentFragment();
 for(var v=0;v<=(W_MAX-W_MIN)*10;v++){var t=document.createElement("div");t.className="t1"+(v%10===0?" m10":v%5===0?" m5":"");if(v%10===0){var e=document.createElement("em");e.textContent=W_MIN+v/10;t.appendChild(e)}f.appendChild(t)}tk.appendChild(f)}
function wHint(){var h=$("#whint");if(!wok){h.textContent="Введите вес от 30 до 250 кг";return}
 if(wlast==null){h.textContent="Первая запись станет отправной точкой";return}
 var d=r1(wv-wlast);h.textContent=d===0?"Как в прошлый раз":(d>0?"+":"−")+fk(Math.abs(d))+" кг к прошлому разу"}
function setW(v,src){v=clamp(r1(num(v,wv)),W_MIN,W_MAX);var ch=v!==wv;wv=v;wok=true;
 var inp=$("#wv");if(src!=="input")inp.value=fk(wv);
 if(src!=="ruler"){var r=$("#wr");r.style.scrollSnapType="none";r.scrollLeft=Math.round((wv-W_MIN)*10)*10;setTimeout(function(){r.style.scrollSnapType=""},60)}
 if(ch&&src&&src!=="ruler"){var m=$(".rmark");m.classList.remove("p");void m.offsetWidth;m.classList.add("p");var bg=$("#shW .big");bg.classList.remove("p");void bg.offsetWidth;bg.classList.add("p");buzz(4)}
 $("#wsave").disabled=false;wHint()}
function openWeight(){buildRuler();var L=C.wl,p=num(C.P.w);
 wlast=L.length?L[L.length-1].v:null;
 var v=L.length?L[L.length-1].v:(p>=W_MIN&&p<=W_MAX?p:60);wv=-1;setW(v);openSheet("shW");
 setTimeout(function(){setW(wv)},120);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){setW(wv)})}
(function(){var r=$("#wr"),inp=$("#wv");
 var rst=null;r.addEventListener("scroll",function(){var v=r1(W_MIN+Math.round(r.scrollLeft/10)/10);if(Math.abs(v-wv)>0.001&&document.activeElement!==inp)setW(v,"ruler");clearTimeout(rst);rst=setTimeout(function(){var t=Math.round(r.scrollLeft/10)*10;if(Math.abs(r.scrollLeft-t)>.6)r.scrollTo({left:t,behavior:"smooth"})},130)},{passive:true});
 inp.addEventListener("input",function(){var x=parseFloat(inp.value.replace(",","."));if(isFinite(x)&&x>=W_MIN&&x<=W_MAX){var v=r1(x),ch=v!==wv;wv=v;wok=true;var rr=$("#wr");rr.style.scrollSnapType="none";rr.scrollLeft=Math.round((wv-W_MIN)*10)*10;setTimeout(function(){rr.style.scrollSnapType=""},60);$("#wsave").disabled=false;wHint()}else{wok=false;$("#wsave").disabled=true;wHint()}});
 inp.addEventListener("blur",function(){inp.value=fk(wv);wok=true;$("#wsave").disabled=false;wHint()});
 inp.addEventListener("focus",function(){try{inp.select()}catch(e){}});
 inp.addEventListener("keydown",function(e){if(e.key==="Enter"){e.preventDefault();inp.blur()}});
 function hold(btn,d){var t1,t2;function step(){setW(wv+d,"step")}function stop(){clearTimeout(t1);clearInterval(t2)}
  btn.addEventListener("pointerdown",function(e){e.preventDefault();step();t1=setTimeout(function(){t2=setInterval(step,70)},380)});
  ["pointerup","pointerleave","pointercancel"].forEach(function(n){btn.addEventListener(n,stop)});
  btn.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();step()}})}
 hold($("#wm"),-0.1);hold($("#wp"),0.1)})();
$("#wsave").onclick=function(){
 var inp=$("#wv"),x=parseFloat(inp.value.replace(",","."));if(isFinite(x)&&x>=W_MIN&&x<=W_MAX)wv=r1(x);
 if(!(wv>=W_MIN&&wv<=W_MAX)){wok=false;wHint();return}
 var L=arr(FS.get("wt")).filter(function(q){return q&&typeof q==="object"&&isIso(q.d)&&isFinite(+q.v)&&q.d!==TD}).map(function(q){var o={d:q.d,v:+q.v};if(q.demo)o.demo=q.demo;return o});
 L.push({d:TD,v:wv});L.sort(function(a,b){return a.d<b.d?-1:a.d>b.d?1:0});FS.set("wt",L);
 var P=obj(FS.get("profile")),P2={};for(var k in P)P2[k]=P[k];P2.w=wv;FS.set("profile",P2);
 pulseAt(this);buzz([8,30,8]);var v=wv;
 setTimeout(function(){closeAll();toast("Вес "+fk(v)+" кг записан");wAsk="ask";render(true)},520)};

/* ---------- календарь ---------- */
var calSel=null,CATI=null,CATL=-1;
function catName(id){var c=GEN.cat();if(CATL!==c.length){CATI={};c.forEach(function(x){if(x&&x.id!=null)CATI[x.id]=x});CATL=c.length}var x=CATI[id];return x&&x.n?x.n:null}
function calMonths(){var now=new Date(+TD.slice(0,4),+TD.slice(5,7)-1,1),first=C.HS.length?C.HS[0].d:TD,fm=new Date(+first.slice(0,4),+first.slice(5,7)-1,1),
 start=new Date(now.getFullYear(),now.getMonth()-1,1);if(fm<start)start=fm;var lim=new Date(now.getFullYear(),now.getMonth()-11,1);if(start<lim)start=lim;
 var out=[],d=new Date(start.getFullYear(),start.getMonth(),1),endM=new Date(now.getFullYear(),now.getMonth()+2,1);
 while(d<=endM){out.push([d.getFullYear(),d.getMonth()]);d=new Date(d.getFullYear(),d.getMonth()+1,1)}return out}
function cState(iso){if(dayDone(iso))return "done";if(iso===TD)return "today";
 if(iso>TD){if(activeOn(iso).length)return "plan";}
 return ""}
function cellHtml(y,m,d){var iso=y+"-"+p2(m+1)+"-"+p2(d),st=cState(iso),hs=C.byDay[iso]||[],note=hs.some(function(x){return x.g||x.ex.some(function(q){return q.my})}),pain=hs.some(function(x){return x.ex.some(function(q){return q.pain})});
 var tp=iso===TD&&activeOn(iso).length&&!dayDone(iso)?" plan":"";
 return '<button class="cd '+st+tp+(iso===calSel?" sel":"")+'" data-d="'+iso+'" aria-label="'+d+' '+MR[m]+'"><span class="rg"><svg viewBox="0 0 36 36"><circle class="t" cx="18" cy="18" r="15"/><circle class="f" cx="18" cy="18" r="15" pathLength="1"'+(st==="done"?' style="stroke-dashoffset:'+(1-dayPct(iso)).toFixed(3)+'"':'')+'/></svg><i>'+d+'</i></span><u class="nds"></u></button>'}
function renderCal(){var s=$("#calS"),top=s.scrollTop,h="";
 calMonths().forEach(function(M){var y=M[0],m=M[1],n=new Date(y,m+1,0).getDate(),off=(new Date(y,m,1).getDay()+6)%7,dn=0,pl=0,c="";
  for(var i=0;i<off;i++)c+='<span></span>';
  for(var d=1;d<=n;d++){var iso=y+"-"+p2(m+1)+"-"+p2(d),st=cState(iso);if(st==="done")dn++;else if(st==="plan"||(st==="today"&&activeOn(iso).length))pl++;c+=cellHtml(y,m,d)}
  var sm=dn&&pl?"сделано "+dn+" из "+(dn+pl):dn?"сделано "+dn:pl?"запланировано "+pl:"";
  h+='<div class="mo" data-mo="'+y+"-"+p2(m+1)+'"><div class="mh"><h4>'+MNF[m]+' '+y+'</h4><span>'+sm+'</span></div><div class="mg">'+c+'</div></div>'});
 s.innerHTML=h;s.scrollTop=top}
function exRows(e){return e.ex.map(function(x){var dn=x.sets.filter(function(q){return q.done!==false}).length;return '<div class="cx"><div class="cxh"><b>'+esc(x.n)+'</b>'+(x.pain?'<em class="pk">Дискомфорт</em>':'')+(x.sets.length&&dn<x.sets.length?'<em class="pk">'+dn+' из '+x.sets.length+' подх.</em>':'')+'</div>'+(x.sets.length?'<span class="cxs">'+setsLine(x)+(x.eff?" · усилие "+x.eff:"")+'</span>':'')+(x.my?'<p>'+esc(x.my)+'</p>':'')+'</div>'}).join("")}
function plEx(w){return arr(w&&w.ex).filter(function(x){return x&&typeof x==="object"}).map(function(x){var sets=arr(x.sets).filter(function(s){return s&&typeof s==="object"});return '<div class="cx"><div class="cxh"><b>'+esc(catName(x.id)||str(x.n)||"Упражнение")+'</b></div>'+(sets.length?'<span class="cxs">'+setsLine({mode:x.mode==="time"?"time":"kg",sets:sets})+'</span>':'')+'</div>'}).join("")}
function chevTog(){return '<svg class="i cv"><use href="#chev"/></svg>'}
function doneRow(e,open){
 var mn=Math.max(1,Math.round(e.sec/60));
 return '<div class="dc dn'+(open?" open":"")+'"><button class="dch" data-act="tog" aria-expanded="'+(!!open)+'"><span class="okd">'+ic("check")+'</span><span class="dct"><b>'+esc(e.wn)+'</b><span class="dcm">'+(e.t?e.t+' · ':'')+mn+' мин · '+plural(e.ex.length,["упражнение","упражнения","упражнений"])+'</span></span>'+chevTog()+'</button><div class="dcx">'+(e.tn?'<p class="gn2 tn2">Тренер: '+esc(e.tn)+'</p>':'')+(e.g?'<p class="gn2">'+esc(e.g)+'</p>':'')+'<div class="cxl">'+exRows(e)+'</div></div></div>'}
function occRow(o,iso){
 var m=wMeta(o.w),past=iso<TD,key=' data-src="'+esc(o.src)+'" data-own="'+o.own+'" data-iso="'+iso+'"',tags=[];
 if(o.time)tags.push(o.time);if(m){tags.push(m.min+" мин");tags.push(plural(m.ex,["упражнение","упражнения","упражнений"]))}
 var rp=repTxt(o);if(rp)tags.push(rp);if(o.moved)tags.push("перенесена с "+shortDate(o.own));
 var st='';
 var acts;
 if(o.cancelled)acts='<button class="pb l" data-act="restore"'+key+'>Вернуть в план</button><button class="pb l dgr" data-act="del"'+key+'>Удалить</button>';
 else if(past)acts='<button class="pb l" data-act="mvd"'+key+'>Перенести</button><button class="pb l" data-act="skip"'+key+'>Оставить как есть</button>';
 else acts='<button class="pb l" data-act="edit"'+key+'>Изменить</button><button class="pb l" data-act="mvd"'+key+'>Перенести</button><button class="pb l dgr" data-act="del"'+key+'>Удалить</button>';
 return '<div class="dc'+(o.cancelled?" cn":"")+'"><button class="dch" data-act="tog" aria-expanded="false"><span class="dct"><b>'+esc(wName(o))+'</b><span class="dcm">'+esc(tags.join(" · "))+'</span></span>'+st+chevTog()+'</button><div class="dcx"><div class="cxl">'+(o.w?plEx(o.w):'<p class="gn2">Состав появится, когда тренировка определится по плану</p>')+'</div></div>'+
  (iso===TD&&!o.cancelled&&o.wid!=null?'<button class="cta go dcs" data-act="start" data-w="'+esc(o.wid)+'">Начать</button>':'')+'<div class="dca">'+acts+'</div></div>'}
function dayDetail(iso){var el=$("#calD");if(!iso)return;calSel=iso;
 var d=new Date(+iso.slice(0,4),+iso.slice(5,7)-1,+iso.slice(8,10)),lab=d.getDate()+" "+MR[d.getMonth()]+" · "+WDL[dowOf(iso)],hs=C.byDay[iso]||[],pn=plannedOn(iso),html="";
 var sub=iso>=TD?pn.filter(function(o){return !o.cancelled}):[];
 $$(".cd",$("#calS")).forEach(function(b){b.classList.toggle("sel",b.dataset.d===iso)});
 html+='<div class="dhd"><span class="eyebrow">'+lab+(iso===TD?" · сегодня":"")+'</span></div>';
 var one=hs.length===1&&!sub.length;
 if(hs.length){if(sub.length)html+='<div class="dsec">Сделано</div>';hs.forEach(function(e){html+=doneRow(e,one)})}
 if(sub.length){if(hs.length)html+='<div class="dsec">Запланировано</div>';sub.forEach(function(o){html+=occRow(o,iso)})}
 if(!hs.length&&!sub.length){
  html+=iso<TD?'<p class="gn2">В этот день тренировки не было. Записи и заметки появятся здесь, когда вы позанимаетесь.</p>':'<p class="gn2">'+(iso===TD&&C.state==="done"?"Сегодня уже готово.":"День отдыха.")+' Отдых тоже часть плана. Можно добавить свою тренировку.</p>'}
 if(iso>=TD)html+='<button class="cta rg addb" data-act="add" data-iso="'+iso+'">'+ic("plus")+'Добавить тренировку</button>';
 el.classList.remove("sw");void el.offsetWidth;el.innerHTML=html;el.classList.add("sw");el.scrollTop=0}
function openCal(btn,iso){var w=$("#cal");calSel=iso&&isIso(iso)&&iso<=addDays(TD,400)?iso:TD;
 if(!w._b){w._b=1;w.innerHTML='<div class="ch"><div><h3>Календарь</h3><small>История, план и заметки</small></div><button class="xb" id="calX" aria-label="Закрыть">'+ic("x")+'</button></div><div class="cw"><span>Пн</span><span>Вт</span><span>Ср</span><span>Чт</span><span>Пт</span><span>Сб</span><span>Вс</span></div><div class="cs" id="calS"></div><div class="cdet" id="calD"></div><div class="cleg"><span><i class="g"></i>проведена</span><span><i class="d"></i>запланирована</span></div>';
  $("#calX").onclick=function(){closeAll();buzz(6)};
  $("#calS").addEventListener("click",function(e){var b=e.target.closest("[data-d]");if(!b)return;buzz(5);dayDetail(b.dataset.d)});
  $("#calD").addEventListener("click",function(e){var b=e.target.closest("[data-act]");if(!b)return;calAct(b.dataset.act,b)})}
 renderCal();dayDetail(calSel);
 btn=btn||$('[data-a="cal"]');if(!w.classList.contains("on"))openWin(w,btn);
 var mo=$('[data-mo="'+calSel.slice(0,7)+'"]'),s=$("#calS");s.style.scrollBehavior="auto";s.scrollTop=mo?mo.offsetTop-s.offsetTop-6:0}
function calAct(a,b){var d=b.dataset;buzz(6);
 if(a==="tog"){var dc=b.closest(".dc");dc.classList.toggle("open");b.setAttribute("aria-expanded",dc.classList.contains("open"));return}
 if(a==="start"){closeAll();setTimeout(function(){act("start",{w:d.w})},300);return}
 if(a==="add"){openForm({mode:"add",iso:d.iso});return}
 var o=findOcc(d.src,d.own,d.iso);if(!o){render(true);return}
 if(a==="edit")openForm({mode:"edit",iso:o.iso,o:o});
 else if(a==="mvd")openForm({mode:"move",iso:o.iso,o:o});
 else if(a==="cancel")askCancel(o);
 else if(a==="del")askDelete(o);
 else if(a==="restore")opRestore(o);
 else if(a==="skip"){var S=getSet(),sk=arr(S.skip).filter(function(x){return isIso(x)&&x>=C.ws});sk.push(o.iso);S.skip=sk;saveSet(S);render(true)}}

/* ---------- изменение плана: исключения, серии, «как в Apple» ---------- */
function topOn(id){$$(".sheet.top.on").forEach(function(s){s.classList.remove("on")});$("#"+id).classList.add("on");$("#scrim2").classList.add("on");buzz(8)}
function closeTop(){$$(".sheet.top.on").forEach(function(s){s.classList.remove("on")});$("#scrim2").classList.remove("on")}
function closeAll(){closeTop();closeLayers()}
function mut(fn,msg){
 var raw=FS.get("plan"),before=raw==null?null:clone(raw),pl=raw&&typeof raw==="object"&&!Array.isArray(raw)?clone(raw):{days:[],mins:45,time:isTime(C.P.rem)?C.P.rem:"18:00",prog:C.prog&&C.prog.id!=null?C.prog.id:"",since:TD};
 pl.items=arr(pl.items).filter(function(x){return x&&typeof x==="object"});pl.ex=arr(pl.ex).filter(function(x){return x&&typeof x==="object"});if(!Array.isArray(pl.days))pl.days=[];
 fn(pl);FS.set("plan",pl);render(true);
 if(msg)toast(msg,"Вернуть",function(){FS.set("plan",before);render(true)})}
function setEx(pl,x){pl.ex=pl.ex.filter(function(y){return !(y.iso===x.iso&&y.src===x.src)});pl.ex.push(x)}
function dropEx(pl,iso,src){pl.ex=pl.ex.filter(function(y){return !(y.iso===iso&&y.src===src)})}
function plItem(pl,id){for(var i=0;i<pl.items.length;i++)if(pl.items[i].id===id)return pl.items[i];return null}
/* «эту и все следующие»: серия заканчивается накануне */
function endFrom(pl,o){var from=o.own;
 pl.ex=pl.ex.filter(function(x){return !(x.src===o.src&&x.iso>=from&&(o.src!=="base"||dowOf(x.iso)===dowOf(from)))});
 if(o.src==="base"){pl.daysEnd=obj(pl.daysEnd);pl.daysEnd[dowOf(from)]=addDays(from,-7)}
 else{var it=plItem(pl,o.src);if(!it)return;var ev=itEvery(it)||1;
  if(from<=it.iso){pl.items=pl.items.filter(function(x){return x!==it});pl.ex=pl.ex.filter(function(x){return x.src!==it.id})}
  else{it.rep=it.rep&&typeof it.rep==="object"?it.rep:{every:ev,until:null};it.rep.until=addDays(from,-ev*7)}}}
function opCancel(o,scope){
 mut(function(pl){if(scope==="fwd")endFrom(pl,o);else setEx(pl,{iso:o.own,src:o.src,kind:"cancel"})},scope==="fwd"?"Серия завершена с "+shortDate(o.iso):"Отменено на "+shortDate(o.iso))}
function opDelete(o,scope){
 mut(function(pl){
  if(scope==="fwd")endFrom(pl,o);
  else if(o.src!=="base"&&!o.moved&&!itEvery(plItem(pl,o.src))){pl.items=pl.items.filter(function(x){return x.id!==o.src});pl.ex=pl.ex.filter(function(x){return x.src!==o.src})}
  else setEx(pl,{iso:o.own,src:o.src,kind:"cancel",del:1})},scope==="fwd"?"Удалено: "+shortDate(o.iso)+" и следующие":"Удалено: "+shortDate(o.iso))}
function opRestore(o){mut(function(pl){dropEx(pl,o.own,o.src)},"Вернули в план: "+shortDate(o.iso))}
function opAdd(f){
 mut(function(pl){var it={id:"i"+uid(),iso:f.date,wid:f.wid,rep:f.every?{every:f.every,until:f.until||null}:null};if(f.time)it.time=f.time;pl.items.push(it)},
  "Добавили на "+shortDate(f.date)+(f.every?" · "+repName(f.every).toLowerCase():""))}
function opEdit(o,f,scope){
 mut(function(pl){
  var it=o.src==="base"?null:plItem(pl,o.src),ev=o.src==="base"?1:itEvery(it),until=it&&it.rep&&isIso(it.rep.until)?it.rep.until:null;
  if(it&&!ev&&!o.moved){it.iso=f.date;it.wid=f.wid;if(f.time)it.time=f.time;else delete it.time;return}
  if(scope==="fwd"&&!o.moved){endFrom(pl,o);var n={id:"i"+uid(),iso:f.date,wid:f.wid,rep:{every:ev,until:until&&until>f.date?until:null}};if(f.time)n.time=f.time;pl.items.push(n);return}
  var mv=f.date!==o.own,x={iso:o.own,src:o.src,kind:mv?"move":"swap",wid:f.wid};if(mv)x.to=f.date;if(f.time)x.time=f.time;setEx(pl,x)},
  "Сохранили: "+shortDate(f.date))}
/* лист-вопрос */
var QB=[];
function ask(o){$("#qT").textContent=o.t;$("#qS").textContent=o.s||"";
 $("#qB").innerHTML=o.btns.map(function(b,i){return '<button class="cta '+(b.cls||"")+'" data-i="'+i+'">'+esc(b.l)+'</button>'}).join("")+'<button class="cta rg" data-i="x">Отмена</button>';
 QB=o.btns;topOn("shQ")}
$("#qB").addEventListener("click",function(e){var b=e.target.closest("[data-i]");if(!b)return;var i=b.dataset.i,fn=i==="x"?null:QB[+i]&&QB[+i].fn;pulseAt(b);buzz(6);closeTop();if(fn)setTimeout(fn,260)});
function askSeries(o,t,fn){
 var e=o.src==="base"?1:itEvery(o.item||itemById(o.src)),ph=e===1?"повторяется каждую неделю":e===2?"повторяется раз в две недели":e===3?"повторяется раз в три недели":"повторяется раз в 4 недели";
 ask({t:t,s:"«"+wName(o)+"», "+shortDate(o.iso)+". Тренировка "+ph+".",btns:[{l:"Только эту",fn:function(){fn("one")}},{l:"Эту и все следующие",fn:function(){fn("fwd")}}]})}
function askCancel(o){
 if(inSeries(o))askSeries(o,"Отменить тренировку?",function(sc){opCancel(o,sc)});
 else opCancel(o,"one")}
function askDelete(o){
 if(inSeries(o))askSeries(o,"Удалить тренировку?",function(sc){opDelete(o,sc)});
 else ask({t:"Удалить тренировку?",s:"«"+wName(o)+"», "+shortDate(o.iso)+". Она исчезнет из плана.",btns:[{l:"Удалить",cls:"dgr",fn:function(){opDelete(o,"one")}}]})}
/* форма: добавить / изменить / перенести */
var AF=null,FQ=[["0","Один раз"],["1","Каждую неделю"],["2","Раз в две недели"],["3","Раз в три недели"],["4","Раз в 4 недели"]];
function defWid(){var w=C.WK[C.nextIdx]||C.WK[0];if(w)return w.id;for(var i=0;i<C.programs.length;i++){var ws=arr(C.programs[i].workouts);if(ws.length&&ws[0])return ws[0].id}return null}
function drawWL(){
 var box=$("#aWL"),top=box.scrollTop,h="";C.programs.forEach(function(p){var ws=arr(p.workouts).filter(function(w){return w&&typeof w==="object"&&w.id!=null});if(!ws.length)return;
  if(C.programs.length>1)h+='<div class="wgh">'+esc(str(p.name)||"Программа")+'</div>';
  ws.forEach(function(w){var on=String(w.id)===String(AF.wid),m=wMeta(w);h+='<button class="wo'+(on?" on":"")+'" data-w="'+esc(w.id)+'" aria-pressed="'+on+'"><span class="won">'+esc(str(w.name)||"Тренировка")+'</span><span class="wom">'+(m?"~"+m.min+" мин":"")+'</span>'+(on?ic("check"):"")+'</button>'})});
 var hadList=!!h;if(!h)h='<div class="nempty"><b>Пока нет тренировок</b><span>Соберите первую с нуля, и она появится в этом списке.</span><button class="pb go" id="aMk">Собрать с нуля</button></div>';
 if(hadList&&(AF.mode==="add"||AF.mode==="pick"))h+='<button class="wo mk" id="aMk2"><span class="won">+ Создать новую тренировку</span></button>';box.innerHTML=h;box.scrollTop=top;var mk=$("#aMk")||$("#aMk2");if(mk)mk.onclick=function(){closeAll();setTimeout(function(){if(window.SHELL)send({t:"open",nw:1});else toast("В приложении откроется конструктор из вкладки «Тренировки»")},260)}}
function drawForm(){
 var pk=AF.mode==="pick",add=AF.mode==="add"||pk,mv=AF.mode==="move";
 [$("#aQ").closest(".fld"),$("#aTm").closest(".fld"),$("#aHint"),$(".pw-f",$("#shA"))].forEach(function(e){if(e)e.style.display=pk?"none":""});
 $("#aT").textContent=pk?"Выбрать тренировку":add?"Добавить тренировку":mv?"Перенести тренировку":"Изменить тренировку";
 $("#aSub").style.display=add?"none":"";$("#aSub").textContent=add?"":mv?(AF.occ?wName(AF.occ)+". Остальной план не изменится.":""):"Можно заменить тренировку, перенести день или время.";
 $("#aWf").style.display=mv?"none":"";$("#aRf").style.display=add&&!pk?"":"none";$("#aUf").style.display=add&&!pk&&AF.every?"":"none";
 if(!mv)drawWL();
 $("#aD").min=TD;if($("#aD").value!==(AF.date||""))$("#aD").value=AF.date||"";if($("#aTm").value!==(AF.time||""))$("#aTm").value=AF.time||"";
 $$("#aQ .chip").forEach(function(b){b.classList.toggle("on",addDays(TD,+b.dataset.q)===AF.date)});
 $$("#aR .chip").forEach(function(b){b.classList.toggle("on",+b.dataset.e===AF.every)});
 $("#aU").min=AF.date||TD;if($("#aU").value!==(AF.until||""))$("#aU").value=AF.until||"";$$("#aUq .chip").forEach(function(b){b.classList.toggle("on",!AF.until)});
 var okd=isIso(AF.date)&&AF.date>=TD,okw=mv||(AF.wid!=null&&!!wAll(AF.wid)),oku=!AF.every||!AF.until||(isIso(AF.until)&&AF.until>AF.date);
 $("#aOK").disabled=!(okd&&okw&&oku);$("#aOK").textContent=add?"Добавить":"Сохранить";
 $("#aHint").textContent=!okd?"Выберите сегодняшний день или позже":!oku?"Дата окончания должна быть позже начала":(add&&AF.every?"Повтор: "+repName(AF.every).toLowerCase()+(AF.every===4?" (каждые 4 недели)":"")+(AF.until?" до "+shortDate(AF.until):", без конца"):"")}
function openForm(o){
 var occ=o.o||null;
 AF={mode:o.mode,occ:occ,date:o.iso&&o.iso>=TD?o.iso:TD,wid:occ&&occ.wid!=null?occ.wid:defWid(),time:occ?occ.time:(isTime(C.time)?C.time:""),every:0,until:""};
 drawForm();topOn("shA");$("#shA").scrollTop=0}
function submitForm(){
 if(!AF||$("#aOK").disabled)return;var f={wid:AF.wid,date:AF.date,time:AF.time&&isTime(AF.time)&&AF.time!==C.time?AF.time:"",every:AF.every,until:AF.until},o=AF.occ,mode=AF.mode;
 pulseAt($("#aOK"));buzz([8,30,8]);closeTop();
 setTimeout(function(){
  if(mode==="add"){opAdd(f);calSel=f.date;selIso=f.date;wkVis=weekStartOf(f.date);render(true);if($("#cal").classList.contains("on"))dayDetail(f.date);return}
  if(mode==="move"&&o)f.wid=o.wid!=null?o.wid:defWid();
  var go=function(sc){opEdit(o,f,sc);calSel=f.date;if($("#cal").classList.contains("on"))dayDetail(f.date)};
  if(inSeries(o)&&o.iso>=TD)askSeries(o,mode==="move"?"Перенести тренировку?":"Изменить тренировку?",go);else go("one")},300)}
(function(){
 function keep(){var d=document.activeElement,id=d&&d.id;drawForm();if(id==="aD"||id==="aU")try{$("#"+id).focus()}catch(e){}}
 $("#aWL").addEventListener("click",function(e){var b=e.target.closest(".wo");if(!b||!AF||b.id==="aMk2")return;AF.wid=b.dataset.w;buzz(5);if(AF.mode==="pick"){var w0=wAll(AF.wid),dt=AF.date;pulseAt(b);buzz([8,30,8]);closeTop();setTimeout(function(){opAdd({wid:AF.wid,date:dt,time:"",every:0,until:""});calSel=dt;selIso=dt;wkVis=weekStartOf(dt);render(true);toast("Добавлено: "+str(w0&&w0.name)+", "+dLine(dt).toLowerCase())},300);return}drawForm()});
 $("#aQ").addEventListener("click",function(e){var b=e.target.closest(".chip");if(!b||!AF)return;AF.date=addDays(TD,+b.dataset.q);buzz(5);drawForm()});
 $("#aR").addEventListener("click",function(e){var b=e.target.closest(".chip");if(!b||!AF)return;AF.every=+b.dataset.e;if(!AF.every)AF.until="";buzz(5);drawForm()});
 $("#aUq").addEventListener("click",function(e){var b=e.target.closest(".chip");if(!b||!AF)return;AF.until="";buzz(5);drawForm()});
 $("#aD").addEventListener("input",function(){if(!AF)return;AF.date=this.value;keep()});
 $("#aU").addEventListener("input",function(){if(!AF)return;AF.until=this.value;keep()});
 $("#aTm").addEventListener("input",function(){if(AF)AF.time=this.value});
 $("#aOK").onclick=submitForm;$("#aC").onclick=function(){buzz(6);closeTop()};$("#aX").onclick=function(){buzz(6);closeTop()};
 $("#scrim2").onclick=function(){closeTop()}})();
/* ---------- действия ---------- */
function autoPlan(btn){
 var P=C.P,res=null;
 try{res=GEN.starter(P,{days:3,mins:45,time:P.rem})}catch(e){res=null}
 var pg=res&&res.progs&&arr(res.progs.programs)[0];
 if(!pg||!arr(pg.workouts).length){toast("Упражнения ещё загружаются. Попробуйте «Собрать свою»");return}
 var ex=obj(FS.get("progs")),list=arr(ex.programs);
 if(list.length){var np=obj(ex);np.programs=list.concat([pg]);FS.set("progs",np)}else FS.set("progs",res.progs);
 var pl=res.plan;pl.since=TD;var op=obj(FS.get("plan"));if(arr(op.items).length)pl.items=op.items;if(arr(op.ex).length)pl.ex=op.ex;FS.set("plan",pl);
 if(btn)pulseAt(btn);buzz([8,30,8]);
 toast("План готов: "+plural(pl.days.length,["тренировка","тренировки","тренировок"])+" в неделю","Открыть",function(){goWork(0)});
 render(true)}
function pickDays(btn){
 var avg=0;C.WK.forEach(function(w){avg+=GEN.estMin(w)});avg=C.WK.length?avg/C.WK.length:45;
 var mins=[20,30,45,60].reduce(function(b,x){return Math.abs(x-avg)<Math.abs(b-avg)?x:b},45);
 openDays({eyebrow:"Ваш план",title:"Когда тренируемся?",sub:"Выберите от 1 до 6 дней. Время и длину тренировок можно поменять позже.",multi:true,sel:[0,2,4],min:1,hint:"Три дня в неделю, через день, хороший старт.",
  done:function(s){if(s.length>6)s=s.slice(0,6);var pl=obj(FS.get("plan"));pl.days=s;pl.mins=pl.mins||mins;pl.time=isTime(pl.time)?pl.time:(isTime(C.P.rem)?C.P.rem:"18:00");pl.prog=C.prog&&C.prog.id!=null?C.prog.id:pl.prog;pl.since=TD;delete pl.daysEnd;FS.set("plan",pl);toast("План готов: "+plural(s.length,["тренировка","тренировки","тренировок"])+" в неделю");render(true)}},btn)}
(function(){var h=null,sx=0,sy=0,base=0,on=false,moved=false,tx=0,lock=0;
 function setX(v,anim){tx=v;h.style.transition=anim?"transform .45s var(--glassease)":"none";h.style.transform=v?"translateX("+v+"px)":"";h.style.setProperty("--hxp",Math.min(1,-v/56))}
 document.addEventListener("pointerdown",function(e){var t=e.target,x=t.closest&&t.closest("#hero");
  var op=document.querySelector("#hero.sw");if(op&&op!==x){op.classList.remove("sw");h=op;setX(0,true)}
  if(!x||!x.querySelector(".hx")||(t.closest&&t.closest(".hx")))return;h=x;on=true;moved=false;sx=e.clientX;sy=e.clientY;base=x.classList.contains("sw")?-56:0});
 document.addEventListener("pointermove",function(e){if(!on)return;var dx=e.clientX-sx,dy=e.clientY-sy;if(!moved){if(Math.abs(dy)>8&&Math.abs(dy)>Math.abs(dx)){on=false;return}if(Math.abs(dx)<6)return;moved=true}
  var v=base+dx;v=Math.max(-72,Math.min(0,v));setX(v,false)});
 function end(){if(!on)return;on=false;if(!moved)return;lock=Date.now();var open=tx<-28;h.classList.toggle("sw",open);setX(open?-56:0,true);if(open)buzz(4)}
 document.addEventListener("pointerup",end);document.addEventListener("pointercancel",end);
 document.addEventListener("click",function(e){if(Date.now()-lock<250&&e.target.closest&&e.target.closest("#hero")){e.stopPropagation();e.preventDefault()}},true)})();
function act(a,d,el){
 switch(a){
  case "hclose":{var hh=$("#hero"),key=heroKey();buzz(6);if(hh){hh.style.transition="opacity .25s ease,transform .4s var(--glassease)";hh.style.opacity="0";hh.style.transform="translateX(-110%)"}setTimeout(function(){HDIS[key]=1;render(true)},300);break}
  case "cal":buzz(8);openCal(el);break;
  case "bell":buzz(8);openNotifs(el);break;
  case "day":{var iso=d.iso;if(!isIso(iso))break;if(iso===selIso){buzz(8);openCal(el,iso);break}selIso=iso;wkVis=weekStartOf(iso);heroSwap=true;buzz(6);if(el)pulseAt($(".rg",el));render(true);break}
  case "wkfold":{var tp=$("#wkTip"),bt=$(".rbbtn");if(!tp)break;var on=!tp.classList.contains("on");clearTimeout(tp._t);if(on&&bt){tp.style.top=(bt.offsetTop+bt.offsetHeight+4)+"px"}tp.classList.toggle("on",on);if(on)tp._t=setTimeout(function(){tp.classList.remove("on")},5500);buzz(on?6:3);break;var fo=$(".wkfold");if(!fo){buzz(4);break}wkOpen=!wkOpen;try{localStorage.setItem("forma.wkhint",wkOpen?"1":"0")}catch(e){}fo.classList.toggle("open",wkOpen);$$("[data-a=wkfold]").forEach(function(x){x.setAttribute("aria-expanded",wkOpen)});buzz(6);break}
  case "today":buzz(6);selIso=TD;wkVis=C.ws;heroSwap=true;render(true);break;
  case "calsel":buzz(8);openCal(el,selIso);break;
  case "pickw":buzz(8);openForm({mode:"pick",iso:d.iso||selIso||TD});break;
  case "hide":{var S5=getSet();S5.hide=obj(S5.hide);var dly=d.k==="w"&&remCfg(S5).w==="daily";if(dly)S5.wSkip=TD;else S5.hide[d.k]=C.ws;saveSet(S5);buzz(6);toast(dly?"Скрыто до завтра":"Скрыто до следующей недели");render(true);break}
  case "calday":buzz(8);openCal(el,d.iso);break;
  case "addday":buzz(8);openForm({mode:"add",iso:d.iso||TD});break;
  case "restore":{var ro=findOcc(d.src,d.own,d.iso);buzz(6);if(ro)opRestore(ro);break}
  case "start":startW((d.w?wAll(d.w):null)||(activeOn(TD)[0]||{}).w||C.WK[C.nextIdx]);break;
  case "det":detW((d.w?wAll(d.w):null)||C.WK[C.nextIdx]);break;
  case "snz":buzz(6);openSnooze();break;
  case "live":buzz(10);if(C.live&&C.live.wid)send({t:"open",start:C.live.wid});else goWork(0);break;
  case "sum":buzz(6);openCal(el,d.iso);break;
  case "mob":buzz(8);toLib({eq:"mob"});break;
  case "mine":buzz(6);goWork(0);break;
  case "mkown":{buzz(8);var S6=getSet();S6.hide=obj(S6.hide);S6.hide.mk=C.ws;saveSet(S6);send({t:"open",nw:1});break}
  case "auto":autoPlan(el);break;
  case "pickdays":pickDays(el);break;
  case "mvt":{var mo=plannedOn(d.iso).filter(function(o){return !o.cancelled})[0];buzz(8);if(mo)opEdit(mo,{wid:mo.wid!=null?mo.wid:defWid(),date:TD,time:mo.time},"one");break}
  case "mvd":{var iso0=d.iso||(C.missed&&C.missed.iso)||TD,vo=plannedOn(iso0).filter(function(o){return !o.cancelled})[0];buzz(8);if(vo)openForm({mode:"move",iso:vo.iso,o:vo});else openCal(el,iso0);break}
  case "skm":{var S=getSet(),sk=arr(S.skip).filter(function(x){return isIso(x)&&x>=C.ws});sk.push(d.iso);S.skip=sk;saveSet(S);buzz(6);render(true);break}
  case "reply":buzz(8);send({t:"tab",to:"work"});send({t:"sub",i:2});break;
  case "noteread":{var S2=getSet();if(C.note)S2.noteRead=C.note.stamp;saveSet(S2);buzz(6);pulseAt(el);render(true);break}
  case "wopen":buzz(8);openWeight();break;
  case "food":buzz(8);send({t:"tab",to:"nutr"});break;
  case "wno":buzz(6);wAsk="off";render(true);break;
  case "wstop":{var S3=getSet();S3.wRem=false;saveSet(S3);wAsk="ask";buzz(6);toast("Напоминания о весе выключены. Включить: «Прогресс», рядом с графиком веса");render(true);break}
  case "wkeep":case "wlater":{var S4=getSet();S4.wSkip=TD;saveSet(S4);wAsk="ask";buzz(6);render(true);break}
  case "all":buzz(6);goWork(1);break;
  case "off":buzz(6);if(d&&d.t)send({t:"open",tpl:d.t});else goWork(1);break;
  case "prog":send({t:"tab",to:"prog"});break;
  case "hero":{var h=$("#s-hero");if(h)h.scrollIntoView({behavior:"smooth",block:"center"});break}
 }}
$("#scroll").addEventListener("click",function(e){var b=e.target.closest("[data-a]");if(!b)return;act(b.dataset.a,b.dataset,b)});
$("#fab").onclick=function(){buzz(8);send({t:"open",nw:1})};
$("#scrim").onclick=function(){DPS=null;closeAll()};

/* ---------- главный рендер ---------- */
function render(soft){
 var td=todayIso();
 if(td!==TD){TD=td;TODAY_ISO=td;selIso=null;wkVis=null;drawn={};wAsk="ask";lastPct=0}
 try{reloadHist()}catch(e){}
 try{TD=todayIso();normPlan()}catch(e){}
 C=load();C.nt=notifs();
 if(!isIso(selIso))selIso=TD;if(!isIso(wkVis))wkVis=weekStartOf(selIso);
 put("s-hd",safe(secHd,"s-hd"));
 put("s-week",safe(secWeek,"s-week"),afterWeek,"none");
 put("s-hero",safe(secHero,"s-hero"),afterHero,heroSwap?"swap":"");heroSwap=false;
 put("s-miss",safe(secMiss,"s-miss"));
 put("s-coach",safe(secCoach,"s-coach"));
 put("s-w",safe(secWeight,"s-w"));
 put("s-f",safe(secFood,"s-f"));
 put("s-of",safe(secOffers,"s-of"));
 put("s-mk",safe(secMk,"s-mk"));
 if($("#shN").classList.contains("on"))drawNotifs();
 if($("#cal").classList.contains("on")){renderCal();if(calSel)dayDetail(calSel)}
 if(firstDraw){firstDraw=false;requestAnimationFrame(function(){requestAnimationFrame(function(){$("#scroll").classList.add("go")})})}}
function later(){if(rq)return;rq=requestAnimationFrame(function(){rq=0;render()})}

/* смена суток и «пора» по напоминанию */
function tick(){
 if(todayIso()!==TD){render();return}
 render();
 if(document.visibilityState==="visible"&&C&&C.state==="train"&&C.snooze&&isTime(C.snooze.t)&&!C.snooze.fired){
  var n=new Date(),hm=p2(n.getHours())+":"+p2(n.getMinutes());
  if(hm>=C.snooze.t){var S=getSet();S.snooze=obj(S.snooze);S.snooze.fired=true;saveSet(S);buzz(10);toast("Пора на тренировку. Начнём?","Начать",function(){act("start",{})})}}}
setInterval(tick,60000);
document.addEventListener("visibilitychange",function(){if(document.visibilityState==="visible")tick()});
FS.on(function(){later()});
var place=initTabs("home");
addEventListener("message",function(e){var m=e.data;if(!m||m.f!=="forma"||m.from===PAGE)return;if(m.t==="show"){selIso=null;wkVis=null;drawn={};lastPct=0;cache["s-week"]=undefined;render();place()}});

render();
send({t:"hello"});
setTimeout(function(){offReady=true;render()},140);
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
