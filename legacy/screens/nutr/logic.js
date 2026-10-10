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
(function(){
"use strict";
window.PAGE="nutr";
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
function ic(n){return '<svg class="i"><use href="#'+n+'"/></svg>'}
function uid(){return Math.random().toString(36).slice(2,9)}
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function nf(n){return Math.round(n).toLocaleString("ru-RU")}
function r1(n){return (Math.round(n*10)/10).toString().replace(".",",")}
function r2(n){return (Math.round(n*100)/100).toString().replace(".",",")}

/* вибро: Android через vibrate, iPhone через скрытый switch (Safari 17.4+) */
var hl=document.createElement("label");hl.setAttribute("aria-hidden","true");hl.style.cssText="position:fixed;left:-9999px;top:0;opacity:0;pointer-events:none";hl.innerHTML='<input type="checkbox" switch tabindex="-1">';document.body.appendChild(hl);
function buzz(p){try{if(navigator.vibrate){navigator.vibrate(p);return}}catch(e){}
  var a=[].concat(p),t=0;a.forEach(function(v,i){if(i%2===0)setTimeout(function(){try{hl.click()}catch(e){}},t);t+=v})}
var app=$("#app"),tt=null;
function toast(t){var e=$("#toast");e.textContent=t;e.classList.add("on");clearTimeout(tt);tt=setTimeout(function(){e.classList.remove("on")},2400)}
function play(root){$$("[data-off]",root).forEach(function(c){if(c.dataset.col)c.style.stroke=c.dataset.col});$$("[data-w]",root).forEach(function(b){if(b.dataset.col)b.style.background=b.dataset.col});requestAnimationFrame(function(){requestAnimationFrame(function(){$$("[data-off]",root).forEach(function(c){c.style.strokeDashoffset=c.dataset.off});$$("[data-w]",root).forEach(function(b){b.style.width=b.dataset.w})})})}

/* универсальный сегмент */
function mkSeg(el,cb){var bs=$$("button",el),ind=$(".ind",el),cur=-1;
 /* «Капля»: ведущий край индикатора идёт первым, задний догоняет */
 function pl(anim){var b=$("button.on",el);if(!b||!b.offsetWidth)return;var i=bs.indexOf(b),l=b.offsetLeft,r=el.clientWidth-(b.offsetLeft+b.offsetWidth);
  if(!anim||cur<0){ind.style.transition="none";ind.style.left=l+"px";ind.style.right=r+"px";cur=i;el.classList.add("rdy");void ind.offsetWidth;return}
  var fwd=i>cur;ind.style.transition="left "+(fwd?".6s":".34s")+" var(--glassease),right "+(fwd?".34s":".6s")+" var(--glassease)";
  ind.style.left=l+"px";ind.style.right=r+"px";cur=i}
 bs.forEach(function(b,i){b.onclick=function(){bs.forEach(function(x){x.classList.remove("on")});b.classList.add("on");pl(true);buzz(6);cb&&cb(i)}});
 setTimeout(function(){pl(false)},80);setTimeout(function(){pl(false)},500);if(document.fonts)document.fonts.ready.then(function(){pl(false)});addEventListener("resize",function(){pl(false)});
 return {set:function(i){bs.forEach(function(x,j){x.classList.toggle("on",j===i)});pl(true)},pl:function(){pl(false)}}}



/* одометр: цифры прокручиваются; ведущие нули схлопываются */
function mkOd(el,len){el.classList.add("od");el.innerHTML="";var cols=[],ds=[];
 for(var i=0;i<len;i++){if(len===4&&i===1){var sp=document.createElement("span");sp.className="sp";el.appendChild(sp)}
  var d=document.createElement("span");d.className="dg";var inn=document.createElement("i");
  for(var n=0;n<10;n++){var u=document.createElement("u");u.textContent=n;inn.appendChild(u)}
  d.appendChild(inn);el.appendChild(d);cols.push(inn);ds.push(d)}
 var o={set:function(v){var s=String(Math.max(0,Math.round(v)));var real=s.length;while(s.length<len)s="0"+s;s=s.slice(-len);
   cols.forEach(function(c,i){c.style.transitionDelay=((len-1-i)*45)+"ms";c.style.transform="translateY(-"+(+s[i]*1.1)+"em)";ds[i].classList.toggle("z",len>3&&false||(len===3&&i<len-real))})},
  reset:function(){cols.forEach(function(c){c.style.transition="none";c.style.transform="translateY(0)";void c.offsetWidth;c.style.transition=""})}};
 return o}
/* ползунок-сфера: сфера следует за пальцем, значение меняется на ближайшей отметке, на отпускании мягко «садится» на неё */
function mkSl(el,get,cb,opt){opt=opt||{};var tr=$(".tr2s",el),kn=$(".kn2",el),tk=$$(".tkr button",el),val=$(".s2lv",el),n=tk.length,cur=-1,off=false,tm=null,ct=null,dragging=false;
 function pct(i){return i/(n-1)*100}
 function lbl(i){val.textContent=off?"—":tk[i].textContent;tk.forEach(function(b,j){b.classList.toggle("on",j===i&&!off)})}
 function paint(){var i=get();cur=i;if(!dragging)kn.style.left=pct(i)+"%";lbl(i)}
 function ring(){kn.classList.remove("pl");void kn.offsetWidth;kn.classList.add("pl");clearTimeout(tm);tm=setTimeout(function(){kn.classList.remove("pl")},900)}
 function pick(i,viaTap){if(i===cur)return false;if(opt.blocked&&opt.blocked(i)){if(viaTap&&opt.onBlocked)opt.onBlocked(i);return false}
  cur=i;lbl(i);if(!dragging)kn.style.left=pct(i)+"%";ring();buzz(4);clearTimeout(ct);ct=setTimeout(function(){requestAnimationFrame(function(){cb(i)})},60);return true}
 function idxAt(e){var r=tr.getBoundingClientRect(),f=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));return{f:f,i:Math.round(f*(n-1))}}
  function follow(e){var a=idxAt(e);if(opt.blocked&&opt.blocked(a.i)){kn.style.left=pct(cur)+"%";return}kn.style.left=(a.f*100)+"%";pick(a.i,false)}
var down=false,sx0=0;
 tr.addEventListener("pointerdown",function(e){if(off)return;var a=idxAt(e);if(opt.blocked&&opt.blocked(a.i)){if(opt.onBlocked)opt.onBlocked(a.i);return}try{tr.setPointerCapture(e.pointerId)}catch(x){}down=true;dragging=false;sx0=e.clientX;tr.classList.add("drag");buzz(3)});
 tr.addEventListener("pointermove",function(e){if(!down)return;if(!dragging){if(Math.abs(e.clientX-sx0)<5)return;dragging=true;kn.style.transition="transform .35s cubic-bezier(.3,1.5,.5,1),box-shadow .3s"}follow(e)});
 function up(e){if(!down)return;var wasDrag=dragging;down=false;dragging=false;tr.classList.remove("drag");kn.style.transition="";
  if(!wasDrag&&e&&e.type==="pointerup"){var a=idxAt(e);if(pick(a.i,true))buzz([5,45,3]);kn.style.left=pct(cur)+"%";return}
  kn.style.left=pct(cur)+"%";buzz([5,45,3])}
 ["pointerup","pointercancel"].forEach(function(k){tr.addEventListener(k,up)});
 tk.forEach(function(b,i){b.addEventListener("click",function(){if(off)return;if(pick(i,true))buzz([5,45,3])})});
 paint();
 return{set:function(i){if(i===cur)return;paint()},pl:function(){paint()},setOff:function(o){off=o;el.classList.toggle("off",o);paint()},dim:function(i,d){tk[i].classList.toggle("dim",d)}}}

/* ---------- общее хранилище: дневник и настройки нормы ---------- */
var ND=FS.get("nutr");if(!ND||typeof ND!=="object"||Array.isArray(ND))ND={v:1};
ND.days=ND.days&&typeof ND.days==="object"?ND.days:{};ND.bc=ND.bc&&typeof ND.bc==="object"?ND.bc:{};
(function(){var n=function(x){x=+x;return isFinite(x)&&x>=0?x:0};Object.keys(ND.days).forEach(function(d){var L=ND.days[d];if(!/^\d{4}-\d{2}-\d{2}$/.test(d)||!Array.isArray(L)){delete ND.days[d];return}
 ND.days[d]=L.filter(function(e){return e&&typeof e==="object"&&!Array.isArray(e)}).map(function(e){e.name=String(e.name==null?"":e.name);e.g=n(e.g);e.k=n(e.k);e.p=n(e.p);e.f=n(e.f);e.c=n(e.c);var m=+e.meal;e.meal=m>=0&&m<4?Math.floor(m):3;if(!e.id)e.id="e"+Math.random().toString(36).slice(2,8);return e})});
 Object.keys(ND.bc).forEach(function(c){var o=ND.bc[c];if(!o||typeof o!=="object"||Array.isArray(o))delete ND.bc[c]})})();
function saveND(){try{FS.set("nutr",ND)}catch(e){}}
function haveData(){var p=pf();return !!(ND.dataSet||(+p.h&&(+p.w||lastW())&&ageOf(p.birth)))}
function pf(){var p=FS.get("profile");return p&&typeof p==="object"&&!Array.isArray(p)?p:{}}
function ageOf(b){if(!b)return null;var m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(b);if(!m)return null;var t=new Date(),a=t.getFullYear()-(+m[1]);if(t.getMonth()+1<+m[2]||(t.getMonth()+1===+m[2]&&t.getDate()<+m[3]))a--;return a>=14&&a<=100?a:null}
function lastW(){var w=FS.get("wt");if(!Array.isArray(w)||!w.length)return null;var v=+w[w.length-1].v;return isFinite(v)&&v>=30&&v<=250?v:null}
function tIso(){var d=new Date();return d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2)}
function seedP(){var p=pf(),pl=FS.get("plan")||{},n=Array.isArray(pl.days)?pl.days.length:0,nut=p.nut&&typeof p.nut==="object"?p.nut:{};
 var goal=nut.goal==="lose"?0:nut.goal==="gain"?2:nut.goal==="keep"?1:((p.goal==="relief"||p.goal==="stroy")?0:(p.goal==="force"?2:1));
 var pc=+nut.pace,pace=0;if(goal===0&&pc>0)pace=pc<.15?0:(pc<.25?1:2);if(goal===2&&pc>0)pace=pc<.075?0:(pc<.15?1:2);
 return {sex:p.sex==="m"?"m":"f",h:+p.h||168,w:lastW()||+p.w||68,a:ageOf(p.birth)||34,bf:(+p.bf>=3&&+p.bf<=60)?+p.bf:null,wc:+p.waist||76,nk:+p.neck||32,hp:+p.hip||100,
  act:n<=0?0:(n<=3?1:(n<=5?2:3)),goal:goal,pace:pace,style:0,formula:3}}
if(!ND.P||typeof ND.P!=="object"){ND.P=seedP();ND.seen={h:ND.P.h,w:ND.P.w,a:ND.P.a,bf:ND.P.bf,sex:ND.P.sex};saveND()}
ND.seen=ND.seen||{};
/* профиль → вкладка: если рост, вес, возраст, пол или % жира изменили в другом месте, подхватываем */
function pullProfile(){var p=pf(),S=ND.seen,ch=false,w=lastW()||(+p.w||null),a=ageOf(p.birth),bf=(+p.bf>=3&&+p.bf<=60)?+p.bf:null;
 [["h",+p.h||null],["w",w],["a",a],["bf",bf],["sex",p.sex==="m"?"m":(p.sex==="f"?"f":null)]].forEach(function(x){var k=x[0],v=x[1];if(v==null)return;if(S[k]!==v){S[k]=v;if(ND.P[k]!==v){ND.P[k]=v;ch=true}}});
 if(!ND.actSet){var pl=FS.get("plan")||{},n=Array.isArray(pl.days)?pl.days.length:0,ac=n<=0?0:(n<=3?1:(n<=5?2:3));if(ND.P.act!==ac){ND.P.act=ac;ch=true}}
 if(ch)saveND();return ch}
function birthFor(age,old){var t=new Date(),m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(old||""),mo=m?+m[2]:t.getMonth()+1,d=m?+m[3]:t.getDate(),y=t.getFullYear()-age;if(t.getMonth()+1<mo||(t.getMonth()+1===mo&&t.getDate()<d))y--;return y+"-"+("0"+mo).slice(-2)+"-"+("0"+d).slice(-2)}
/* вкладка → профиль: правки в «Моих данных» видны везде (Прогресс, Профиль, тренер) */
function pushProfile(k){var p=pf(),S=ND.seen,P=ND.P;if(k==="h"||k==="w"||k==="a"){ND.dataSet=1}
 if(k==="h"){p.h=P.h;S.h=P.h}
 else if(k==="w"){var v=Math.round(P.w*10)/10,t=tIso(),w=(Array.isArray(FS.get("wt"))?FS.get("wt"):[]).filter(function(x){return x&&x.d!==t});w.push({d:t,v:v});w.sort(function(a,b){return a.d<b.d?-1:1});FS.set("wt",w);p.w=v;S.w=P.w}
 else if(k==="a"){p.birth=birthFor(P.a,p.birth);S.a=P.a}
 else if(k==="bf"){if(P.bf==null)delete p.bf;else p.bf=P.bf;S.bf=P.bf}
 else if(k==="sex"){p.sex=P.sex;S.sex=P.sex}
 else if(k==="wc"){p.waist=P.wc}else if(k==="nk"){p.neck=P.nk}else if(k==="hp"){p.hip=P.hp}
 else {saveND();return}
 FS.set("profile",p);saveND()}

/* ---------- профиль и норма (калькулятор калорий) ---------- */
/* QA: защита от битых данных в хранилище (NaN, строки, выход за границы, лишние индексы) */
(function(){var D=seedP(),R={h:[100,250],w:[30,300],a:[14,100],wc:[40,200],nk:[15,80],hp:[50,200]},ch=false;
 Object.keys(R).forEach(function(k){var v=+ND.P[k];if(!isFinite(v)||v<R[k][0]||v>R[k][1]){ND.P[k]=D[k];ch=true}else if(v!==ND.P[k]){ND.P[k]=v;ch=true}});
 if(ND.P.bf!=null){var f=+ND.P.bf;if(!isFinite(f)||f<3||f>60){ND.P.bf=null;ch=true}else ND.P.bf=f}
 [["goal",2],["pace",2],["act",3],["style",2],["formula",3]].forEach(function(x){var v=+ND.P[x[0]];if(!(v>=0&&v<=x[1])||v!==Math.floor(v)){ND.P[x[0]]=D[x[0]];ch=true}else ND.P[x[0]]=v});
 if(ND.P.sex!=="m"&&ND.P.sex!=="f"){ND.P.sex=D.sex;ch=true}
 if(ND.P.formula===2&&ND.P.bf==null){ND.P.formula=3;ch=true}
 if(ch)saveND()})();
var P=ND.P;
var ACT=[1.2,1.375,1.55,1.725],ACTN=["Сидячая","Лёгкая","Средняя","Высокая"],
 ACTD=["Почти нет тренировок, сидячая работа","1–3 тренировки в неделю или работа на ногах","3–5 тренировок в неделю","6–7 тренировок или физический труд"];
var GOALN=["Похудение","Поддержание","Набор"],PCT={0:[10,20,30],2:[5,10,20]},PACEN=["Мягко","Умеренно","Быстро"];
/* QA: минимум калорий при похудении по AHA/ACC/TOS 2013: 1200 ккал женщинам, 1500 мужчинам (было 1200 всем); для поддержания и набора пол не применяется */
function flo(){return P.goal!==0?0:(P.sex==="m"?1500:1200)}
var STYLEN=["Сбаланси­рованный","Высоко­белковый","Низко­углеводный"],STYLE=[{fat:.27,dp:0},{fat:.25,dp:.4},{fat:.35,dp:0}];
var STYLED=["Белок по цели, жиры 27% калорий, остальное углеводы","Больше белка, жиры 25% калорий","Жиры 35% калорий, углеводов меньше"];
function bmrSet(){
 var mif=10*P.w+6.25*P.h-5*P.a+(P.sex==="f"?-161:5);
 var hb=P.sex==="f"?447.593+9.247*P.w+3.098*P.h-4.33*P.a:88.362+13.397*P.w+4.799*P.h-5.677*P.a;
 return {mif:mif,hb:hb,kat:P.bf==null?null:370+21.6*P.w*(1-P.bf/100)}}
function bmrOf(){var b=bmrSet();if(P.formula===0)return b.mif;if(P.formula===1)return b.hb;if(P.formula===2&&b.kat!=null)return b.kat;
 var a=[b.mif,b.hb];if(b.kat!=null)a.push(b.kat);return a.reduce(function(x,y){return x+y},0)/a.length}
function tdeeOf(){return bmrOf()*ACT[P.act]}
/* уровень темпа: процент от поддержания, потолок 1% веса в неделю (≈11 ккал/кг в день), жёсткий пол 1200 ккал */
function tier(goal,i,tdee){
 var d=goal===1?0:tdee*PCT[goal][i]/100,capped=false,clamped=false;
 if(goal===0){var cap=P.w*11;if(d>cap){d=cap;capped=true}}
 var t=goal===0?tdee-d:(goal===2?tdee+d:tdee),raw=t;
 if(t<flo()){t=flo();clamped=true}
 return {t:t,raw:raw,d:t-tdee,capped:capped,clamped:clamped}}
function calcNorm(){
 var tdee=tdeeOf(),r=tier(P.goal,P.pace,tdee),target=Math.max(flo(),Math.round(r.t/10)*10),diff=target-tdee;
 var pace=P.goal===0?Math.max(0,-diff)*7/7700:(P.goal===2?Math.max(0,diff)*7/7700:0);
 var st=STYLE[P.style],base=P.goal===1?1.6:1.8;
 var prot=Math.min(P.w*(base+st.dp),target*.35/4),fat=target*st.fat/9,carb=Math.max(0,(target-prot*4-fat*9)/4);
 return {tdee:tdee,k:target,raw:Math.round(r.raw/10)*10,p:Math.round(prot),f:Math.round(fat),c:Math.round(carb),prk:prot/P.w,maint:Math.round(tdee/10)*10,pace:pace,delta:Math.round(Math.abs(diff)),clamped:r.clamped,capped:r.capped}}
var NORM=calcNorm();


/* ---------- дневник ---------- */
var MEALS=["Завтрак","Обед","Ужин","Перекус"],WD=["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];
function p2(n){return ("0"+n).slice(-2)}
function dk(d){return d.getFullYear()+"-"+p2(d.getMonth()+1)+"-"+p2(d.getDate())}
var today,dow,week;
function calcWeek(){today=new Date();today.setHours(0,0,0,0);dow=(today.getDay()+6)%7;week=[];for(var wi=0;wi<7;wi++){var wd=new Date(today);wd.setDate(today.getDate()-dow+wi);week.push(wd)}}
calcWeek();
var DAYS=ND.days,selKey=dk(today),lastId=null,pend=null,lastToday=dk(today);

/* цвет прогресса: зелёный; при превышении нормы оранжевый (для белка превышения нет) */
var MCOL={p:["#4FB874","#2B8A52"],f:["#E0572F","#A83A1B"],c:["#F2A27C","#D4743F"]};
function pcol(p,over){return over&&p>1?"var(--coral)":"var(--green)"}
function sumOf(l){var t={k:0,p:0,f:0,c:0};l.forEach(function(e){t.k+=e.k;t.p+=e.p;t.f+=e.f;t.c+=e.c});return t}
function keyDate(k){return new Date(+k.slice(0,4),+k.slice(5,7)-1,+k.slice(8,10))}
function setDateLabel(){var d=keyDate(selKey),s="";try{s=d.toLocaleDateString("ru-RU",{weekday:"long",day:"numeric",month:"long"})}catch(e){}$("#dt").textContent=s.charAt(0).toUpperCase()+s.slice(1)}
function hintHtml(t,list){var N=NORM,remP=N.p-t.p,rem=N.k-t.k,fut=selKey>dk(today);
 if(fut&&haveData()){if(!list.length)return '<div class="hint">Планируйте рацион наперёд: добавьте продукты в нужные приёмы пищи. Последние продукты каждого приёма подставятся первыми.</div>';return '<div class="hint">План на день: '+nf(t.k)+' из '+nf(N.k)+' ккал'+(rem>0?', свободно '+nf(rem):', выше нормы на '+nf(-rem))+'.</div>'}
 if(!haveData())return '<div class="hint">Норма пока считается по средним данным. Укажите свои рост, вес и возраст, и она станет точной.<button data-go="data">Указать данные</button></div>';
 if(!list.length)return '<div class="hint">Начните с первого приёма пищи: отсканируйте штрихкод, найдите продукт по названию или добавьте вручную через «+».</div>';
 if(rem<0)return '<div class="hint">Чуть выше нормы на '+nf(-rem)+' ккал, это нормально. Один день ничего не решает, завтра вернётесь в свой ритм.</div>';
 if(remP>25)return '<div class="hint">Белка пока '+nf(t.p)+' г из '+nf(N.p)+'. На ближайший приём подойдут рыба, творог или яйца.<button data-go="rec">Подобрать блюда</button></div>';
 return '<div class="hint">Хороший ритм: до нормы осталось '+nf(rem)+' ккал, белок почти набран.</div>'}
var RM=false;try{RM=!!(window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches)}catch(e){}
function monOf(d){var x=new Date(d);x.setHours(0,0,0,0);x.setDate(x.getDate()-((x.getDay()+6)%7));return x}
function keyDow(k){return (keyDate(k).getDay()+6)%7}
var nLast=null;
function nWeekHtml(N,tk){var sel=keyDate(selKey),off=Math.max(-52,Math.min(12,Math.round((monOf(today)-monOf(sel))/6048e5))),pages="";
 for(var o=12;o>=-52;o--){var days=[];for(var i=0;i<7;i++){var d=new Date(today);d.setDate(today.getDate()-dow+i-o*7);days.push(d)}
  var btn=days.map(function(d,i){var key=dk(d),fut=d>today,td=key===tk,pct=(DAYS[key]?sumOf(DAYS[key]).k:0)/N.k;
   return '<button class="wd'+(td?" today":"")+(key===selKey?" sel":"")+(fut?" fu":"")+'" data-d="'+key+'" aria-label="'+WD[i]+', '+d.getDate()+'"><b>'+WD[i]+'</b><span class="dr"><svg viewBox="0 0 36 36" aria-hidden="true"><circle class="t" cx="18" cy="18" r="15"/><circle class="p'+(pct>0?"":" z")+'" cx="18" cy="18" r="15" pathLength="1" data-off="'+(1-Math.min(1,pct))+'" data-col="'+pcol(pct,true)+'"/></svg><i>'+d.getDate()+'</i></span></button>'}).join("");
  pages+='<div class="wkp"><div class="week">'+(o===off?'<i class="wsel"></i>':'')+btn+'</div></div>'}
 return '<div class="card nwk"><div class="wkscroll" id="nwk">'+pages+'</div></div>'}
function nDrop(ws,wk,from,to){var cw=(wk.clientWidth-8)/7,x0=4+from*cw,x1=4+to*cw;
 ws.style.width=cw+"px";ws.style.left=x0+"px";if(from===to||RM){ws.style.left=x1+"px";return}
 var dur=560,t0=performance.now();function io(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}
 function step(now){var t=Math.min(1,(now-t0)/dur),c=x0+cw/2+(x1-x0)*io(t),w=cw*(1+.16*Math.sin(Math.PI*t));ws.style.left=(c-w/2)+"px";ws.style.width=w+"px";
  if(t<1)requestAnimationFrame(step);else{ws.style.left=x1+"px";ws.style.width=cw+"px"}}
 requestAnimationFrame(step)}
function nWeekAfter(pane){var sc=$("#nwk",pane),ws=$(".wsel",pane);if(!sc||!ws)return;var pages=$$(".wkp",sc),ix=pages.indexOf(ws.closest(".wkp")),to=keyDow(selKey),from=(nLast&&nLast.ix===ix)?nLast.dow:to;
 sc.style.scrollSnapType="none";sc.scrollLeft=ix*sc.clientWidth;requestAnimationFrame(function(){sc.style.scrollSnapType=""});
 nDrop(ws,ws.parentNode,from,to);nLast={ix:ix,dow:to};
 var tm=null;sc.addEventListener("scroll",function(){clearTimeout(tm);tm=setTimeout(function(){var w=sc.clientWidth;if(!w)return;var j=Math.max(0,Math.min(pages.length-1,Math.round(sc.scrollLeft/w)));
  if(j!==ix){var o=12-j,tg=new Date(today);tg.setDate(today.getDate()-dow+to-o*7);selKey=dk(tg);buzz(6);renderDiary()}},110)},{passive:true})}
function renderDiary(){
 var list=DAYS[selKey]||(DAYS[selKey]=[]),t=sumOf(list),N=NORM,rem=N.k-t.k,over=rem<0,tk=dk(today);
 var h=nWeekHtml(N,tk);
 h+='<div class="sum"><div class="ring"><svg viewBox="0 0 118 118" aria-hidden="true"><circle class="tr" cx="59" cy="59" r="49"/><circle class="pg" cx="59" cy="59" r="49" pathLength="1" data-off="'+(1-Math.min(1,t.k/N.k))+'" data-col="var(--green)"/>'+(t.k>N.k?'<circle class="tr tr2" cx="59" cy="59" r="56.5"/><circle class="pg pg2" cx="59" cy="59" r="56.5" pathLength="1" data-off="'+(1-Math.min(1,t.k/N.k-1))+'" data-col="var(--coral)"/>':'')+'</svg><div class="c"><b>'+(over?"+"+nf(-rem):nf(rem))+'</b><small>'+(over?"выше нормы":"осталось ккал")+'</small></div></div><div class="macros">'+
  [["Белки","p"],["Жиры","f"],["Углеводы","c"]].map(function(m){return '<div class="mc"><div class="t"><span><i class="md '+m[1]+'"></i>'+m[0]+'</span><b>'+nf(t[m[1]])+' / '+N[m[1]]+' г</b></div><div class="bar"><i data-w="'+Math.min(100,t[m[1]]/N[m[1]]*100)+'%" data-col="'+MCOL[m[1]][0]+'"></i>'+(t[m[1]]>N[m[1]]?'<i class="ov" data-w="'+Math.min(100,(t[m[1]]/N[m[1]]-1)*100)+'%" data-col="'+MCOL[m[1]][1]+'"></i>':'')+'</div></div>'}).join("")+'</div></div>';
 h+='<button class="gchip" data-go="norm"><span>Цель: <b>'+GOALN[P.goal].toLowerCase()+'</b> · норма <b>'+nf(N.k)+' ккал</b></span>'+ic("chev")+'</button>';
 h+=hintHtml(t,list);
 MEALS.forEach(function(name,mi){var es=list.filter(function(e){return e.meal===mi}),kk=es.reduce(function(s,e){return s+e.k},0);
  h+='<div class="grp"><div class="gh"><b>'+name+'</b><span class="r">'+(es.length?nf(kk)+' ккал':'')+'<button class="pb" data-add="'+mi+'" aria-label="Добавить: '+name+'"><i>'+ic("plus")+'</i></button></span></div>'+
   (es.length?es.map(function(e){return '<div class="en'+(e.id===lastId?" new":"")+'" data-id="'+e.id+'"><div class="tx"><b>'+esc(e.name)+'</b><span>'+(e.g?nf(e.g)+' г · ':'')+'Б '+nf(e.p)+' · Ж '+nf(e.f)+' · У '+nf(e.c)+'</span></div><div class="kc"><b>'+nf(e.k)+'</b><span>ккал</span></div><button class="del" data-del aria-label="Удалить запись">'+ic("trash")+'</button></div>'}).join(""):'<div class="emp">Пока пусто</div>')+'</div>'});
 var pane=$("#pDiary");pane.innerHTML=h;lastId=null;setDateLabel();play(pane);nWeekAfter(pane)}
$("#pDiary").addEventListener("click",function(e){var t=e.target,b;
 if((b=t.closest("[data-d]"))){selKey=b.dataset.d;buzz(5);renderDiary();return}
 if((b=t.closest("[data-add]"))){openPick(+b.dataset.add,false);return}
 if((b=t.closest("[data-del]"))){var id=b.closest("[data-id]").dataset.id;DAYS[selKey]=DAYS[selKey].filter(function(x){return x.id!==id});saveND();buzz(8);renderDiary();toast("Запись удалена");return}
 if((b=t.closest("[data-go]"))){var g=b.dataset.go;if(g==="data"){setSub(1);setTimeout(openData,350)}else setSub(g==="norm"?1:2)}});

/* ---------- моя норма ---------- */
var chPts=[],chSel=0;
function chDate(wk){if(!wk)return"Сегодня";var d=new Date();d.setDate(d.getDate()+wk*7);try{return d.toLocaleDateString("ru-RU",{day:"numeric",month:"long"})}catch(e){return""}}
function placeSph(pulse,showTip){var p=chPts[chSel];if(!p)return;var g=$("#chSph");g.style.transform="translate("+p.x.toFixed(1)+"px,"+p.y.toFixed(1)+"px)";
 if(pulse){var u=$("#chPu");u.classList.remove("on");void u.getBoundingClientRect();u.classList.add("on")}
 var t=$("#chTip"),w=$("svg.chart").getBoundingClientRect().width||300;
 if(showTip!=null){t.classList.toggle("on",!!showTip)}
 t.innerHTML="<b>"+chDate(p.wk)+"</b><span>≈ "+r1(p.v)+" кг</span>";var f=p.x/320;t.style.left=Math.max(62,Math.min(w-62,f*w))+"px";t.style.top=(p.y/146*($("svg.chart").getBoundingClientRect().height||146)-16)+"px"}
(function(){document.addEventListener("click",function(e){var c=e.target.closest&&e.target.closest("#chart");if(!c)return;var r0=c.getBoundingClientRect(),x=(e.clientX-r0.left)/r0.width*320,b=0,bd=1e9;chPts.forEach(function(p,i){var d=Math.abs(p.x-x);if(d<bd){bd=d;b=i}});
 if(b===chSel&&$("#chTip").classList.contains("on")){$("#chTip").classList.remove("on");buzz(3);return}
 chSel=b;placeSph(true,true);buzz([4,30,3])})})();
var NB="\u00a0",fcRec=null,bfManual=false,bfD=null,bfDirty=false,segN={},OD={};
function ib(id){return '<button class="ib" data-inf="'+id+'" aria-expanded="false" aria-label="Пояснение"><i>i</i></button>'}
function inf(id,txt){return '<div class="inf" id="inf_'+id+'"><div><p>'+txt+'</p></div></div>'}
var INF={
 act:"Коэффициент умножает расход в покое на ваш обычный день: работу, шаги и тренировки. Если вы не тренируетесь и в основном сидите, выбирайте «Сидячая» (×1,2). 1–3 тренировки в неделю при сидячей работе обычно дают «Лёгкую» (×1,375), а не «Среднюю». Людям свойственно завышать активность, поэтому при сомнении берите уровень ниже и сверяйте с весом через 2–3 недели.",
 style:"Рацион меняет распределение калорий, но не их количество. «Баланс»: белок по цели, жиры 27% калорий, остальное углеводы. «Белковый»: белка на 0,4 г/кг больше (не выше 2,2 г/кг), жиры 25%. «Мало углеводов»: жиры 35% калорий (верхняя граница допустимого диапазона), углеводов меньше, но не меньше примерно 30% калорий.",
 form:"У каждой формулы своя типичная погрешность. Миффлин–Сан-Жеор чаще других попадает в реальность, когда процент жира неизвестен. Харрис–Бенедикт (редакция 1984) в среднем даёт чуть больше. Кэтч–Макардл считает по безжировой массе и хорош для тренированных, но только при точном проценте жира: его ошибка целиком переходит в расчёт. Среднее смягчает перекосы отдельных формул (с процентом жира берутся все три), поэтому мы рекомендуем его как старт. Дальше сверяйте с весом через 2–3 недели и сдвигайте норму."
};
function macroText(N){var st=STYLE[P.style];
 return "Сначала считаем калории, затем делим их на белки, жиры и углеводы. Белок: "+r1(N.prk)+" г на кг веса ("+N.p+" г). Для тренирующихся ISSN называет достаточным диапазон 1,4–2,0 г/кг, при дефиците тренированным может понадобиться больше. Белок не выше 35% калорий. Жиры: "+Math.round(st.fat*100)+"% калорий ("+N.f+" г), допустимый диапазон для взрослых 20–35%. Углеводы: всё остальное ("+N.c+" г). В 1 г белка и углеводов 4 ккал, в 1 г жира 9 ккал."}
function floorText(N){
 return "Мы не опускаем норму ниже "+nf(flo())+" ккал. Расчёт дал "+nf(N.raw)+" ккал, поэтому показываем минимум. В клинических рекомендациях по снижению веса (AHA/ACC/TOS, 2013) рацион начинают с 1"+NB+"200–1"+NB+"500 ккал для женщин и 1"+NB+"500–1"+NB+"800 для мужчин, а меньше 800 ккал допускается только под наблюдением врача. У тренирующихся при нехватке энергии (ниже примерно 30 ккал на кг безжировой массы в сутки) растёт риск гормональных нарушений и потери костной массы, точный порог обсуждается. Если вам нужен рацион меньше, обсудите это с врачом."}
function pctOf(g,t,td){return Math.round(Math.max(0,g===0?td-t:t-td)/td*100)}
function cl(v){return Math.max(3,Math.min(60,v))}
function navyBF(){var x,v;
 if(P.sex==="m"){x=P.wc-P.nk;if(x<=0)return null;v=495/(1.0324-0.19077*Math.log10(x)+0.15456*Math.log10(P.h))-450}
 else{x=P.wc+P.hp-P.nk;if(x<=0)return null;v=495/(1.29579-0.35004*Math.log10(x)+0.221*Math.log10(P.h))-450}
 return cl(v)}
function bmiBF(){var bmi=P.w/Math.pow(P.h/100,2);return cl(1.2*bmi+.23*P.a-10.8*(P.sex==="m"?1:0)-5.4)}
function ptile(k,l){return '<button class="ptile" data-p="'+k+'"><span>'+l+'</span><b id="v_'+k+'"></b></button>'}
function stepRow(k,l){return '<div class="row2"'+(k==="hp"?' id="r_hp"':'')+'><span>'+l+'</span><div class="step"><button data-k="'+k+'" data-st="-1" aria-label="'+l+': меньше">'+ic("minus")+'</button><span class="v" id="v_'+k+'"></span><button data-k="'+k+'" data-st="1" aria-label="'+l+': больше">'+ic("plus")+'</button></div></div>'}
function segH(id,labels,on){return '<div class="seg" id="'+id+'"><div class="ind"></div>'+labels.map(function(l,i){return '<button'+(i===on?' class="on"':'')+'>'+l+'</button>'}).join("")+'</div>'}
function fcDelta(N,t){var D=N.delta,Lf=(D/24)*(1-Math.exp(-24*7*t/7700)),E=.8*Math.min(1,D/800);return Lf+E*(1-Math.exp(-t))}
function expText(N,pct){
 var a="Мы оценили, сколько калорий вы тратите за день: около "+nf(N.maint)+" ккал с учётом роста, веса, возраста и активности. ";
 var b=P.goal===1?"Для поддержания веса оставили этот уровень и разложили его на белки, жиры и углеводы.":(pct===0?"Для вашей цели взяли минимальную рекомендуемую норму и разложили её на белки, жиры и углеводы.":"Для цели «"+GOALN[P.goal].toLowerCase()+"» "+(P.goal===0?"вычли ":"добавили ")+pct+"% и разложили результат на белки, жиры и углеводы.");
 return a+b}
function plAll(){Object.keys(segN).forEach(function(k){segN[k].pl()})}
function toggleInf(id,btn){var t=$("#inf_"+id),on=!t.classList.contains("open");if(t.closest(".sl2")){closePops(t);if(on)clearTimeout(t._h),t._h=setTimeout(function(){closePops()},6000)}t.classList.toggle("open",on);if(btn){btn.classList.toggle("on",on);btn.setAttribute("aria-expanded",on)}return on}
function openChange(){}
function openData(tab){var t=tab==null?0:tab;if(window.__acc){window.__acc(t,true);setTimeout(function(){var c=$("#calcCard"+t);if(c)c.scrollIntoView({behavior:"smooth",block:"start"})},140)}}

/* ---------- выбор величин на линейке: рост, вес, возраст, замеры, процент жира ---------- */
var NP=null,npT=null;
var NPC={h:{t:"Рост",u:"см",min:140,max:210,tick:1,snap:1,dec:0,lab:10,mid:5},w:{t:"Вес",u:"кг",min:35,max:200,tick:.1,snap:.1,dec:1,lab:1,mid:.5},
 a:{t:"Возраст",u:"",min:16,max:80,tick:.2,snap:1,dec:0,lab:10,mid:1},wc:{t:"Талия",u:"см",min:50,max:160,tick:1,snap:1,dec:0,lab:10,mid:5,hint:function(){return "В самом узком месте"}},
 nk:{t:"Шея",u:"см",min:20,max:60,tick:.5,snap:.5,dec:1,lab:5,mid:1,hint:function(){return P.sex==="m"?"В самом тонком месте, под кадыком":"В самом тонком месте"}},hp:{t:"Бёдра",u:"см",min:60,max:160,tick:1,snap:1,dec:0,lab:10,mid:5},
 bf:{t:"Процент жира",u:"%",min:5,max:60,tick:.5,snap:.5,dec:1,lab:5,mid:1}};
function ageWord(a){var m=a%10,k=a%100;return m===1&&k!==11?"год":(m>=2&&m<=4&&(k<10||k>=20)?"года":"лет")}
function npFmt(v,dec){return dec?String(Math.round(v*10)/10).replace(".",","):String(Math.round(v))}
function accSum(){var a=$("#as0"),b=$("#as1");if(a)a.textContent=GOALN[P.goal]+" · "+ACTN[P.act].toLowerCase()+" · "+FNAME[P.formula];if(b)b.textContent=P.bf==null?"Не задан":"В расчёте "+r1(P.bf)+"%"}
function tileTxt(){accSum();var T={h:P.h+"<small>см</small>",w:r1(P.w)+"<small>кг</small>",a:P.a+"<small>"+ageWord(P.a)+"</small>",wc:P.wc+"<small>см</small>",nk:r1(P.nk)+"<small>см</small>",hp:P.hp+"<small>см</small>",bf:P.bf==null?"—":r1(P.bf)+"<small>%</small>"};
 Object.keys(T).forEach(function(k){var e=$("#v_"+k);if(e)e.innerHTML=T[k]})}
/* лёгкое обновление при прокрутке: цифры нормы и плитки, без перерисовки графика и дневника */
function npLive(){if(!NP)return;var k=NP.k;if(P[k]===NP.v)return;P[k]=NP.v;NP.dirty=true;
 if(k==="h"||k==="w"||k==="a"){var N=calcNorm();NORM=N;OD.k.set(N.k);OD.p.set(N.p);OD.f.set(N.f);OD.c.set(N.c)}
 tileTxt()}
/* полный пересчёт один раз, когда пальцы остановились или лист закрыт */
function autoBF(){var nv=navyBF(),bm=bmiBF(),v=nv!=null?(nv+bm)/2:bm;if(v==null||isNaN(v))return;bfD=Math.max(5,Math.min(60,Math.round(v*2)/2));bfManual=false;bfDirty=true}
function npApply(){if(!NP||!NP.dirty)return;NP.dirty=false;var k=NP.k;if(k==="wc"||k==="nk"||k==="hp"){autoBF()}else if(k==="bf"){bfManual=true;bfD=P.bf;bfDirty=false}pushProfile(k);paintNorm(false)}
function closeNP(){clearTimeout(npT);npApply();$("#shP").classList.remove("on");syncScrim();NP=null}
function isMul(v,m){var q=v/m;return Math.abs(q-Math.round(q))<1e-6}
function openNP(k){var c=NPC[k],B=$("#pkB"),cur=P[k]!=null?P[k]:(k==="bf"?(P.sex==="f"?25:15):c.min);NP={k:k,v:cur,dirty:false};$("#pkT").textContent=c.t;
 B.innerHTML='<div class="rbox"><div class="wnum"><button class="sbt" id="pm" aria-label="Меньше">−</button><div class="num big"><input id="pv" type="text" inputmode="decimal" autocomplete="off" maxlength="6" aria-label="'+c.t+'"><small id="pkU">'+(k==="a"?ageWord(cur):c.u)+'</small></div><button class="sbt" id="pp" aria-label="Больше">+</button></div><div class="ruler" id="pr" data-noswipe="1"><div class="ticks"></div></div><i class="rmark"></i></div><p class="pk-hint">'+(c.hint?c.hint():"")+'</p>';
 var tk=$("#pr .ticks"),fr=document.createDocumentFragment(),cnt=Math.round((c.max-c.min)/c.tick);
 for(var i=0;i<=cnt;i++){var val=Math.round((c.min+i*c.tick)*1000)/1000,t=document.createElement("div");t.className="t1"+(isMul(val,c.lab)?" m10":isMul(val,c.mid)?" m5":"");if(isMul(val,c.lab)){var e=document.createElement("em");e.textContent=Math.round(val*10)/10;t.appendChild(e)}fr.appendChild(t)}tk.appendChild(fr);
 var r=$("#pr"),inp=$("#pv"),rst=null,lastP=0;
 function clampV(v){v=Math.max(c.min,Math.min(c.max,Math.round(v/c.snap)*c.snap));return Math.round(v*100)/100}
 function px(v){return Math.round((v-c.min)/c.tick)*10}
 function pulse(){var now=Date.now();if(now-lastP<120)return;lastP=now;var m=$("#shP .rmark");m.classList.remove("p");void m.offsetWidth;m.classList.add("p")}
 function show(v){inp.value=npFmt(v,c.dec);if(k==="a")$("#pkU").textContent=ageWord(v)}
 /* из кнопок и поля: мгновенно ставим шкалу и значение */
 function setV(v,src){if(!NP)return;v=clampV(v);var ch=v!==NP.v;NP.v=v;if(src!=="input")show(v);
  if(src!=="input"){r.scrollLeft=px(v)}
  if(ch){npLive();if(src){pulse();buzz(4)}clearTimeout(npT);npT=setTimeout(npApply,260)}}
 /* из жеста: значение по положению шкалы, без анимаций; после остановки мягко подтягиваем к ближайшему делению */
 r.addEventListener("scroll",function(){var v=clampV(c.min+Math.round(r.scrollLeft/10)*c.tick);
  if(NP&&document.activeElement!==inp&&Math.abs(v-NP.v)>1e-6){NP.v=v;show(v);npLive();buzz(2)}
  clearTimeout(rst);rst=setTimeout(function(){var tg=px(clampV(c.min+Math.round(r.scrollLeft/10)*c.tick));if(Math.abs(r.scrollLeft-tg)>.6)r.scrollTo({left:tg,behavior:"smooth"});clearTimeout(npT);npT=setTimeout(npApply,180)},130)},{passive:true});
 inp.addEventListener("input",function(){if(!NP)return;var x=parseFloat(inp.value.replace(",","."));if(isFinite(x)&&x>=c.min&&x<=c.max){var v=clampV(x);if(v!==NP.v){NP.v=v;if(k==="a")$("#pkU").textContent=ageWord(v);npLive();r.scrollLeft=px(v);clearTimeout(npT);npT=setTimeout(npApply,400)}}});
 inp.addEventListener("blur",function(){if(NP)show(NP.v)});inp.addEventListener("focus",function(){try{inp.select()}catch(e){}});
 inp.addEventListener("keydown",function(e){if(e.key==="Enter"){e.preventDefault();inp.blur()}});
 function hold(btn,d){var t1,t2;function st(){if(NP)setV(NP.v+d,"step")}function stop(){clearTimeout(t1);clearInterval(t2)}
  btn.addEventListener("pointerdown",function(e){e.preventDefault();st();t1=setTimeout(function(){t2=setInterval(st,90)},380)});["pointerup","pointerleave","pointercancel"].forEach(function(nm){btn.addEventListener(nm,stop)})}
 hold($("#pm"),-c.snap);hold($("#pp"),c.snap);
 $("#shP").classList.add("on");syncScrim();buzz(8);setTimeout(function(){if(NP){show(NP.v);r.scrollLeft=px(NP.v)}},60);setTimeout(function(){if(NP)r.scrollLeft=px(NP.v)},320)}
$("#pkX").onclick=function(){buzz(5);closeNP()};$("#pkOk").onclick=function(){buzz([8,30,8]);closeNP()};
/* ---------- пояснения к переключателям: второе нажатие на выбранное показывает подсказку, третье убирает ---------- */
var TIPS={
 sgGoal:["Калорий чуть меньше, чем вы тратите: вес снижается постепенно.","Калорий столько, сколько вы тратите: вес держится на месте.","Калорий чуть больше, чем вы тратите: растут вес и мышцы."],
 sgPace:["Небольшое изменение калорий: комфортно и без стресса.","Золотая середина между скоростью результата и комфортом.","Заметный результат быстрее, но нужно больше дисциплины."],
 sgAct:["Почти нет тренировок, работа сидячая.","1–3 тренировки в неделю или работа на ногах.","3–5 тренировок в неделю.","6–7 тренировок в неделю или физический труд."],
 sgStyle:["Привычное соотношение белков, жиров и углеводов на каждый день.","Больше белка: он помогает сохранять мышцы и дольше держит сытость.","Меньше углеводов и больше жиров, подходит тем, кто легче сыт на жирной пище."],
 sgForm:["Миффлин–Сан-Жеор: самая распространённая формула, подходит большинству людей.","Харрис–Бенедикт: классическая формула, проверенная десятилетиями.","Кэтч–Макардл: считает по безжировой массе, точнее, когда известен процент жира.","Среднее по формулам: сглаживает погрешность каждой, мы рекомендуем этот вариант."]};
function closePops(except){$$(".sl2 .inf.open").forEach(function(t){if(t===except)return;t.classList.remove("open");var q=t.parentNode.querySelector(".qm");if(q){q.classList.remove("on");q.setAttribute("aria-expanded",false)}})}
var tipOn=null;
function hideTip(){if(!tipOn)return;tipOn.el.classList.remove("on");tipOn=null}
(function(){var pane=$("#pNorm");
 pane.addEventListener("click",function(e){if(!e.target.closest(".qm,.sl2 .inf"))closePops();var b=e.target.closest(".seg button");if(!b){if(tipOn&&!e.target.closest(".tip"))hideTip();return}
  var seg=b.closest(".seg"),T=TIPS[seg.id];if(!T){hideTip();return}
  var bs=[].slice.call(seg.querySelectorAll("button")),i=bs.indexOf(b);
  if(!b.classList.contains("on")){hideTip();return}
  e.stopPropagation();e.preventDefault();
  if(tipOn&&tipOn.seg===seg.id&&tipOn.i===i){hideTip();buzz(3);return}
  hideTip();var blk=seg.closest(".blk")||seg.parentNode,el=blk.querySelector(".tip");
  if(!el){el=document.createElement("div");el.className="tip";el.setAttribute("role","status");blk.appendChild(el)}
  el.textContent=T[i];var br=blk.getBoundingClientRect(),sr=seg.getBoundingClientRect(),bb=b.getBoundingClientRect();
  el.style.bottom=Math.round(br.bottom-sr.top+8)+"px";el.style.setProperty("--ax",Math.round(bb.left+bb.width/2-br.left)+"px");
  void el.offsetWidth;el.classList.add("on");tipOn={el:el,seg:seg.id,i:i};buzz(4)},true)})();
var TAPE='<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M4 5v10M7.5 9v6M11 5v10M14.5 9v6M18 5v10" transform="translate(-1 0)"/></svg>';
var RGT={wc:"Талия: самое узкое место торса, обычно на уровне пупка. Лента идёт горизонтально, живот не втягивайте, измеряйте на выдохе.",nk:"Шея: измеряйте под кадыком, лента ровно по кругу, плечи расслаблены, голова прямо, подбородок не опускайте.",hp:"Бёдра: самое широкое место ягодиц. Встаньте ноги вместе, лента идёт горизонтально и не провисает."};
function rgH(id,name,k,hid){return '<div class="sl2 rg'+(hid?' hid':'')+'" data-noswipe id="'+id+'"><div class="lb2"><span class="bl">'+name+'</span>'+(RGT[k]?'<button class="qm" data-q="'+k+'" aria-expanded="false" aria-label="Как измерять: '+name+'">?</button>':'')+'<button class="tp" data-p="'+k+'" aria-label="Ввести точное значение: '+name+'">'+TAPE+'</button></div><div class="s2c"><div class="tr2s"><div class="s2rl"></div><div class="s2dt" style="left:0"></div><div class="s2dt" style="left:100%"></div><div class="kn2"></div></div><div class="tkr"><b class="rgv" id="v_'+k+'"></b></div></div>'+(RGT[k]?'<div class="inf" id="inf_'+k+'"><div><p>'+RGT[k]+'</p></div></div>':'')+'</div>'}
var RGL={wc:[50,160,1],nk:[20,60,.5],hp:[60,160,1],bf:[5,60,.5]};
function mkRg(el,k){var lim=RGL[k],tr=$(".tr2s",el),kn=$(".kn2",el),vv=$(".rgv",el),dragging=false,raf=0,last=null;
  function gv(){return k==="bf"?bfD:P[k]}
  function cur(){var v=gv();return v==null?(k==="bf"?(P.sex==="f"?25:15):lim[0]+(lim[1]-lim[0])/2):v}
  function fr(v){return Math.max(0,Math.min(1,(v-lim[0])/(lim[1]-lim[0])))}
  function paint(){var f=fr(cur());if(!dragging)kn.style.left=f*100+"%";var lf=Math.max(.09,Math.min(.91,f));vv.style.left="calc(11.25px + (100% - 22.5px)*"+lf+")";el.classList.toggle("unset",gv()==null)}
  function val(e){var r=tr.getBoundingClientRect(),f=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));var v=lim[0]+f*(lim[1]-lim[0]);v=Math.round(v/lim[2])*lim[2];return{f:f,v:Math.round(v*10)/10}}
  function move(e){var a=val(e);kn.style.left=a.f*100+"%";if(a.v!==gv()){if(k==="bf"){bfD=a.v;bfManual=true;bfDirty=true}else{P[k]=a.v;autoBF()}buzz(2);paint();if(!raf)raf=requestAnimationFrame(function(){raf=0;paintNorm(false)})}else paint()}
  var down=false,sx0=0;
  tr.addEventListener("pointerdown",function(e){try{tr.setPointerCapture(e.pointerId)}catch(x){}down=true;dragging=false;sx0=e.clientX;tr.classList.add("drag");buzz(3);move(e)});
  tr.addEventListener("pointermove",function(e){if(!down)return;if(!dragging){if(Math.abs(e.clientX-sx0)<5)return;dragging=true;kn.style.transition="transform .35s cubic-bezier(.3,1.5,.5,1),box-shadow .3s"}move(e)});
  function up(){if(!down)return;down=false;dragging=false;tr.classList.remove("drag");kn.style.transition="";paint();if(k!=="bf")pushProfile(k);buzz([5,45,3]);paintNorm(true)}
  ["pointerup","pointercancel"].forEach(function(n){tr.addEventListener(n,up)});
  paint();return{pl:paint}}
function slH(id,name,labels,key){var n=labels.length;
 return '<div class="sl2" data-noswipe id="'+id+'"><div class="lb2"><span class="bl">'+name+'</span><button class="qm" data-q="'+key+'" aria-expanded="false" aria-label="Пояснение: '+name+'">?</button><span class="s2lv"></span></div>'+
  '<div class="s2c"><div class="tr2s"><div class="s2rl"></div>'+labels.map(function(l,i){return '<div class="s2dt" style="left:'+(i/(n-1)*100)+'%"></div>'}).join("")+'<div class="kn2"></div></div>'+
  '<div class="tkr">'+labels.map(function(l,i){return '<button class="'+(i===0?"f":i===n-1?"l":"")+'" style="'+(i===0?"left:0":i===n-1?"right:0":"left:calc(11.25px + (100% - 22.5px)*"+(i/(n-1))+")")+'">'+l+'</button>'}).join("")+'</div></div>'+
  '<div class="inf" id="inf_'+key+'"><div><p></p></div></div></div>'}
var SLN={style:["Баланс","Белковый","Мало углев."],form:["Среднее","Миффлин","Харрис","Кэтч"]};var FORD=[3,0,1,2],FNAME=["Миффлин","Харрис","Кэтч","Среднее"];
function buildNorm(){
 var pane=$("#pNorm");
 pane.innerHTML=
 '<div class="card nm" id="nmCard"><button class="ib hid" id="ibFloor" data-inf="floor" aria-expanded="false" aria-label="Пояснение"><i>i</i></button><span class="chip2 hid" id="nChip"></span>'+
  '<p class="nm-title hid" id="nmTitle"></p>'+
  '<div class="nk"><b id="nK"></b><span class="nu">ккал</span></div><span class="cap" id="nSub"></span>'+
  '<div class="inf" id="inf_floor"><div><p id="floorTx"></p></div></div>'+
  '<div class="mt3"><div class="t-p"><span><i class="md"></i>Белки</span><b><span id="nP"></span><small>г</small></b><div class="bar"><i id="bP"></i></div></div><div class="t-f"><span><i class="md"></i>Жиры</span><b><span id="nF"></span><small>г</small></b><div class="bar"><i id="bF"></i></div></div><div class="t-c"><span><i class="md"></i>Углеводы</span><b><span id="nC"></span><small>г</small></b><div class="bar"><i id="bC"></i></div></div></div></div>'+
 '<div class="card acc2" id="calcCard0"><button class="ah" id="ah0" aria-expanded="false"><span class="ai">'+ic("food")+'</span><span class="at"><b>Калькулятор калорий</b><span id="as0"></span></span>'+ic("down")+'</button><div class="box"><div><div class="cpg" id="cpg0">'+
   '<div class="slblk">'+slH("slGoal","Цель",GOALN,"goal")+slH("slPace","Скорость",PACEN,"pace")+slH("slAct","Активность",ACTN,"act")+slH("slForm","Формула",SLN.form,"form").replace(/<\/div>$/,'<div class="inf" id="inf_katch"><div><p>Для формулы Кэтча нужен процент жира. Его можно измерить ниже в калькуляторе.</p></div></div></div>')+slH("slStyle","Рацион",SLN.style,"style")+'</div>'+
   '<div class="chain hid" id="chain"></div>'+
  '</div></div></div></div>'+
 '<div class="card acc2" id="calcCard1"><button class="ah" id="ah1" aria-expanded="false"><span class="ai">'+ic("pct")+'</span><span class="at"><b>Калькулятор процента жира</b><span id="as1"></span></span>'+ic("down")+'</button><div class="box"><div><div class="cpg" id="cpg1">'+
   '<div class="slblk">'+rgH("rgWc","Талия","wc")+rgH("rgNk","Шея","nk")+rgH("r_hp","Бёдра","hp",P.sex==="m")+'</div>'+
   '<span class="cap hid" id="fatBase"></span>'+
   '<div class="fatres"><span class="bl">Ваш процент жира</span><div class="fatbig"><b id="fatBig">—</b><span id="fatSub"></span></div><div class="cap" id="fcRes"></div></div>'+
   '<div class="slblk">'+rgH("rgBf","Вручную","bf")+'</div><span class="cap" id="bfCap"></span><div class="btns"><button class="pbtn go hid" id="bfApply">Сохранить</button></div>'+
  '</div></div></div></div>'+
 '<div class="card acc2" id="fcCard"><button class="ah" id="fcH" aria-expanded="false"><span class="ai">'+ic("chart")+'</span><span class="at"><b>Прогноз веса</b><span id="fcS"></span></span>'+ic("down")+'</button><div class="box"><div><div class="cpg fbody">'+
  '<p class="fsent" id="fcSent"></p>'+
  '<div class="chw" id="chw"><svg class="chart" id="chart" viewBox="0 0 320 146" aria-hidden="true"><line class="gl" x1="40" x2="296" y1="14" y2="14"/><line class="gl" x1="40" x2="296" y1="60" y2="60"/><line class="gl" x1="40" x2="296" y1="106" y2="106"/><text class="ya" id="yl0" x="32" y="17.5"></text><text class="ya" id="yl1" x="32" y="63.5"></text><text class="ya" id="yl2" x="32" y="109.5"></text><path class="ar" id="chArea" d=""/><path class="ln" id="chPath" pathLength="1" d=""/><defs><linearGradient id="fcg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4FB874" stop-opacity=".16"/><stop offset="1" stop-color="#4FB874" stop-opacity="0"/></linearGradient><radialGradient id="fcsp" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#E4E5EC"/></radialGradient></defs><circle class="dt s" id="chD0" r="3.6"/><circle class="dt m" id="chD1" r="3.6"/><circle class="dt m" id="chD2" r="3.6"/><circle class="dt g" id="chD3" r="3.6"/><g id="chSph"><circle class="pu" id="chPu" r="9" fill="none" stroke="#4FB874" stroke-width="1"/><circle r="8.5" fill="url(#fcsp)" stroke="rgba(23,23,26,.14)" stroke-width="1"/></g><text class="xa" x="46" y="130" text-anchor="middle">сейчас</text><text class="xa" x="127.3" y="130" text-anchor="middle">4 нед.</text><text class="xa" x="208.7" y="130" text-anchor="middle">8 нед.</text><text class="xa" x="290" y="130" text-anchor="middle">12 нед.</text></svg><div class="chtip" id="chTip" role="status"></div></div>'+
  '<div class="cl"><span><i class="dot c"></i>сейчас <b id="cW0"></b></span><span><i class="dot g"></i>через 12 недель <b id="cW1"></b></span></div><div class="cap" id="chTx"></div></div></div></div></div>'+
 '<div class="nfoot"><button class="lnk" id="srcB">Источники</button><div class="inf" id="inf_src"><div><div class="pbox"><ul class="srcl">'+
   '<li>Расход в покое: формулы Миффлина–Сан-Жеора, Харриса–Бенедикта (1984), Кэтча–Макардла.</li>'+
   '<li>Процент жира: формула ВМС США и формула Дёренберга по ИМТ (1991).</li>'+
   '<li>Темп и калории: Helms 2014, Garthe 2011, Iraki 2019, AHA/ACC/TOS 2013.</li>'+
   '<li>Белок: ISSN, 2017. Прогноз веса: Hall et al., Lancet, 2011.</li></ul>'+
   '<p class="why">Проценты темпа, коэффициенты активности и стили питания собраны нами из этих работ и практики, единого стандарта для них нет.</p></div></div></div>'+
 '<p class="disc">Расчёт ориентировочный. При заболеваниях, беременности и после родов обсудите питание с врачом.</p></div>';
 segN.goal=mkSl($("#slGoal"),function(){return P.goal},function(i){P.goal=i;P.pace=Math.min(P.pace,2);ND.goalSet=1;saveND();paintNorm(true,true)});
 segN.pace=mkSl($("#slPace"),function(){return P.pace},function(i){P.pace=i;saveND();paintNorm(true)});
 segN.act=mkSl($("#slAct"),function(){return P.act},function(i){P.act=i;ND.actSet=1;saveND();paintNorm(true)});
 segN.style=mkSl($("#slStyle"),function(){return P.style},function(i){P.style=i;saveND();paintNorm(true)});
 segN.form=mkSl($("#slForm"),function(){return FORD.indexOf(P.formula)},function(i){P.formula=FORD[i];saveND();paintNorm(true)},{blocked:function(i){return FORD[i]===2&&P.bf==null},onBlocked:function(){var t=$("#inf_katch");if(t){closePops(t);t.classList.add("open");clearTimeout(t._h);t._h=setTimeout(function(){t.classList.remove("open")},3200)}}});
 OD.k=mkOd($("#nK"),4);OD.p=mkOd($("#nP"),3);OD.f=mkOd($("#nF"),3);OD.c=mkOd($("#nC"),3);
 function accSet(i,on){var c=$("#calcCard"+i),h=$("#ah"+i);if(!c)return;c.classList.toggle("open",on);h.setAttribute("aria-expanded",on);hideTip();setTimeout(plAll,80);setTimeout(plAll,540)}
 $("#ah0").onclick=function(){accSet(0,!$("#calcCard0").classList.contains("open"));buzz(5)};
 $("#ah1").onclick=function(){accSet(1,!$("#calcCard1").classList.contains("open"));buzz(5)};
 window.__acc=accSet;
 $("#srcB").onclick=function(){toggleInf("src");buzz(5)};
 $("#fcH").onclick=function(){var c=$("#fcCard"),on=!c.classList.contains("open");c.classList.toggle("open",on);this.setAttribute("aria-expanded",on);buzz(5);if(on){var ch=$("svg.chart"),ln=$("#chPath");if(ch&&ln){ch.classList.remove("go");ln.style.transition="none";ln.style.strokeDashoffset=1;void ln.getBoundingClientRect();setTimeout(function(){ln.style.transition="";ln.style.strokeDashoffset=0;ch.classList.add("go")},120)}}};
 segN.wc=mkRg($("#rgWc"),"wc");segN.nk=mkRg($("#rgNk"),"nk");segN.hp=mkRg($("#r_hp"),"hp");segN.bf=mkRg($("#rgBf"),"bf");
 $("#bfApply").onclick=function(){var v=bfD!=null?bfD:(fcRec==null?null:Math.round(fcRec*2)/2);if(v==null)return;P.bf=v;bfD=v;bfDirty=false;buzz([10,40,10]);pushProfile("bf");toast("Процент жира "+r1(v)+"% сохранён в профиле");accSet(1,false);paintNorm(true)};
 pane.addEventListener("click",function(e){
  var b=e.target.closest("[data-st]");
  if(b){var k=b.dataset.k,d=+b.dataset.st,lim={h:[140,210,1],w:[35,200,.5],a:[16,80,1],bf:[5,60,.5],wc:[50,160,1],nk:[20,60,.5],hp:[60,160,1]}[k];
   if(k==="bf"&&P.bf==null)P.bf=P.sex==="f"?25:15;
   else P[k]=Math.max(lim[0],Math.min(lim[1],Math.round((P[k]+d*lim[2])*10)/10));
   pushProfile(k);buzz(5);paintNorm(true);return}
  var pt=e.target.closest("[data-p]");if(pt){hideTip();openNP(pt.dataset.p);buzz(5);return}
  var qm=e.target.closest(".qm");if(qm){toggleInf(qm.dataset.q,qm);buzz(5);return}
  var q=e.target.closest(".ib");
  if(q){toggleInf(q.dataset.inf,q);buzz(5)}})}
function paintNorm(anim,goalChanged){
 NORM=calcNorm();var N=NORM,tr=tier(P.goal,P.pace,N.tdee),pct=pctOf(P.goal,Math.max(flo(),tr.t),N.tdee);
 $("#nChip").textContent=GOALN[P.goal]+(P.goal===1||!pct?"":" · "+(P.goal===0?"−":"+")+pct+"%");
 OD.k.set(N.k);accSum();var hk=$("#nK").parentNode;hk.classList.remove("pop");void hk.offsetWidth;hk.classList.add("pop");
 var PW=["в мягком темпе","в умеренном темпе","в быстром темпе"];
 $("#nmTitle").textContent="Ваша норма калорий для "+(P.goal===0?"похудения":P.goal===2?"набора массы":"поддержания веса")+(P.goal===1?"":" "+PW[P.pace]);
 var fl=$("#ibFloor");fl.classList.toggle("hid",!N.clamped);
 if(N.clamped)$("#floorTx").textContent=floorText(N);else{$("#inf_floor").classList.remove("open");fl.classList.remove("on")}
 OD.p.set(N.p);OD.f.set(N.f);OD.c.set(N.c);
 var sh=[N.p*4/N.k,N.f*9/N.k,N.c*4/N.k];
 if(anim!=="reset"){[["bP",0],["bF",1],["bC",2]].forEach(function(b){$("#"+b[0]).style.width=Math.round(sh[b[1]]*100)+"%"})}
 var isK=P.goal===1;segN.pace.setOff(isK);
 var paceTx=isK?"Вес держится на месте":(P.goal===0?"≈ −":"≈ +")+r2(N.pace)+" кг в неделю · "+(P.goal===0?"дефицит ":"профицит ")+nf(N.delta)+" ккал в день"+(N.capped?" · ограничено 1% веса в неделю":"");
 $("#nSub").textContent=paceTx;
 ["goal","pace","act","form","style"].forEach(function(k){segN[k].pl()});
 var B=bmrSet(),av=[B.mif,B.hb].concat(B.kat!=null?[B.kat]:[]).reduce(function(x,y){return x+y},0)/(B.kat!=null?3:2);
 var fv=[B.mif,B.hb,B.kat,av].map(function(v,i){return FNAME[i]+" "+(v==null?"нужен % жира":nf(Math.round(v)))}).join(" · ");
 var IP={goal:TIPS.sgGoal[P.goal],pace:isK?"Для поддержания скорость не нужна: калорий столько, сколько вы тратите.":TIPS.sgPace[P.pace],act:TIPS.sgAct[P.act],form:TIPS.sgForm[P.formula],style:TIPS.sgStyle[P.style]};
 Object.keys(IP).forEach(function(k){var p=$("#inf_"+k+" p");if(p)p.innerHTML=IP[k]});
 $("#chain").innerHTML='<span>Покой <b>'+nf(Math.round(bmrOf()))+'</b></span><i>×'+String(ACT[P.act]).replace(".",",")+'</i><span>с активностью <b>'+nf(Math.round(tdeeOf()))+'</b></span><i>'+(P.goal===1?"=":(P.goal===0?"−":"+")+nf(N.delta))+'</i><span>норма <b>'+nf(N.k)+'</b></span>';
 segN.form.dim(3,P.bf==null);
 /* прогноз: быстрее в начале, затем ровнее (правило Холла + небольшая «водная» составляющая) */
 var sign=P.goal===0?-1:(P.goal===2?1:0),w0=P.w,vals=[],i;
 for(i=0;i<=24;i++)vals.push(w0+sign*fcDelta(N,i/2));
 var w1=vals[24],lo=Math.min(w0,w1),hi=Math.max(w0,w1),pad=Math.max(.8,(hi-lo)*.45),mn=lo-pad,mx=hi+pad;
 var aMin=Math.floor(mn),aMax=Math.ceil(mx);if((aMax-aMin)%2)aMax++;mn=aMin;mx=aMax;function X(k){return 46+k*(244/24)}function Y(v){return 14+(1-(v-mn)/(mx-mn))*92}
 var pts=vals.map(function(v,k){return X(k).toFixed(1)+","+Y(v).toFixed(1)}),dd="M"+pts.join(" L");
 $("#chPath").setAttribute("d",dd);$("#chArea").setAttribute("d",dd+" L"+X(24).toFixed(1)+",106 L"+X(0).toFixed(1)+",106 Z");
 [[0,0],[1,8],[2,16],[3,24]].forEach(function(m){var c=$("#chD"+m[0]);c.setAttribute("cx",X(m[1]).toFixed(1));c.setAttribute("cy",Y(vals[m[1]]).toFixed(1))});
 chPts=[0,8,16,24].map(function(k){return{k:k,x:X(k),y:Y(vals[k]),v:vals[k],wk:k/2}});placeSph(false);
 var fy=function(v){return String(Math.round(v))};
 $("#yl0").textContent=fy(mx);$("#yl1").textContent=fy((mx+mn)/2);$("#yl2").textContent=fy(mn);
 $("#cW0").textContent=r1(w0)+" кг";$("#cW1").textContent=r1(w1)+" кг";
 $("#fcS").textContent="ориентир на 12 недель";
 var dW=Math.abs(w1-w0);
 $("#fcSent").innerHTML=P.goal===1?("Соблюдая норму в <b class=\"k\">"+nf(N.k)+" ккал</b> в день, вы сохраните вес около <b>"+r1(w0)+" кг</b>."):("Соблюдая норму в <b class=\"k\">"+nf(N.k)+" ккал</b> в день, вы можете "+(P.goal===0?"снизить вес примерно на ":"набрать примерно ")+"<b>"+r1(dW)+" кг</b> за 12 недель.");
 $("#chTx").textContent=P.goal===0?"Снижение веса всегда происходит нелинейно.":P.goal===2?"Набор веса тоже идёт нелинейно.":"При поддержании вес колеблется в пределах 1–2 кг.";
 if(!bfDirty)bfD=P.bf;
 $("#v_bf").innerHTML=bfD==null?"—":r1(bfD)+"<small>%</small>";
 $("#bfCap").textContent=P.bf==null?"Сейчас не задан, формула Кэтча выключена.":"В расчёте: "+r1(P.bf)+"%";
 $("#r_hp").classList.toggle("hid",P.sex==="m");["wc","nk","hp","bf"].forEach(function(k){segN[k]&&segN[k].pl()});
 $("#v_wc").innerHTML=P.wc+"<small>см</small>";$("#v_nk").innerHTML=r1(P.nk)+"<small>см</small>";$("#v_hp").innerHTML=P.hp+"<small>см</small>";
 var nv=navyBF(),bm=bmiBF();fcRec=nv!=null?(nv+bm)/2:bm;
 
 $("#fatBig").innerHTML=r1(bfD!=null?bfD:fcRec)+"<small>%</small>";$("#fatSub").textContent=bfD==null?"оценка по замерам":bfManual?"вручную":"по замерам";$("#fcRes").textContent=bfDirty||bfD==null?"Нажмите «Сохранить», и значение попадёт в профиль и расчёт.":bfManual?"Введено вручную, замеры не влияют.":"Среднее по замерам и ИМТ.";$("#bfApply").classList.toggle("hid",!(bfDirty||P.bf==null));
 
 var yr=P.a%10===1&&P.a!==11?"год":(P.a%10>=2&&P.a%10<=4&&(P.a<10||P.a>20)?"года":"лет");
 
 var ch=$("#chart");if(anim){ch.classList.remove("go");var ln=$("#chPath");ln.style.transition="none";ln.style.strokeDashoffset=1;void ln.getBoundingClientRect();requestAnimationFrame(function(){ln.style.transition="";ln.style.strokeDashoffset=0;ch.classList.add("go")})}
 renderDiary()}
function replayNorm(){Object.keys(OD).forEach(function(k){OD[k].reset()});["bP","bF","bC"].forEach(function(id){var b=$("#"+id);b.style.transition="none";b.style.width="0";void b.offsetWidth;b.style.transition=""});paintNorm(true);plAll()}

/* ---------- рецепты (заглушка) ---------- */
$("#pRec").innerHTML='<div class="stubc rise"><b>Рецепты под вашу норму</b><span>Здесь появятся блюда, которые помогут добрать белок и уложиться в калории: с готовым КБЖУ и добавлением в дневник в одно касание. Это следующий шаг.</span></div><div class="stubc"><b>Подсказки дня</b><span>Короткие мягкие советы по вашему рациону: чего не хватает и что выбрать на ужин. Первые подсказки уже работают в дневнике.</span></div>';

/* ---------- подвкладки ---------- */
var sub=0,panes=[$("#pDiary"),$("#pNorm"),$("#pRec")],subSeg=mkSeg($("#sgSub"),function(i){setSub(i,true)});
var SUBD=["Всё, что вы съели сегодня: следите за своими КБЖУ в одном месте","Суточная норма калорий и БЖУ, рассчитанная индивидуально под вас","Блюда под вашу норму: идеи для простых и полезных рецептов"];
function descSet(el,t){if(!el||el.textContent===t)return;el.style.opacity="0";setTimeout(function(){el.textContent=t;el.style.opacity="1"},160)}
function setSub(i,fromSeg){descSet($("#sSub"),SUBD[i]);if(i===sub&&fromSeg!==false&&$$(".pane.on")[0]===panes[i])return;sub=i;panes.forEach(function(p,k){p.classList.toggle("on",k===i);p.classList.toggle("l",k<i);if(k===i)p.scrollTop=0});if(!fromSeg)subSeg.set(i);
 if(i===0)renderDiary();if(i===1)setTimeout(replayNorm,120);if(i===2){var s=$(".stubc",panes[2]);s.classList.remove("rise");void s.offsetWidth;s.classList.add("rise")}}
(function(){var sx=0,sy=0,on=false,host=$("#panes");
 host.addEventListener("pointerdown",function(e){if(e.target.closest("input,.seg,.chips,.wkscroll,[data-noswipe]"))return;on=true;sx=e.clientX;sy=e.clientY});
 host.addEventListener("pointerup",function(e){if(!on)return;on=false;var dx=e.clientX-sx,dy=e.clientY-sy;if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*1.6){var n=sub+(dx<0?1:-1);if(n>=0&&n<3){buzz(6);setSub(n)}}});
 host.addEventListener("pointercancel",function(){on=false})})();

/* ---------- нижнее меню и связь с оболочкой ---------- */
var PAGE="nutr";
function send(m){m.f="forma";m.from=PAGE;try{parent!==window&&parent.postMessage(m,"*")}catch(e){}}
var TABS=[["home","Главная","home"],["dumb","Тренировки","work"],["food","Питание","nutr"],["chart","Прогресс","prog"],["user","Профиль","prof"]];
function initTabs(active){var tb=$("#tabbar"),ind=document.createElement("div");ind.className="ind";tb.appendChild(ind);var btns=[];
 TABS.forEach(function(t){var b=document.createElement("button");b.className="tab"+(t[2]===active?" on":"");b.setAttribute("aria-label",t[1]);b.innerHTML=dockIc(t[0])+'<span class="lbl">'+t[1]+'</span>';
  b.onclick=function(){if(t[2]===active){panes[sub].scrollTo({top:0,behavior:"smooth"});return}buzz(6);send({t:"tab",to:t[2]})};tb.appendChild(b);btns.push(b)});
 function place(){var b=btns[TABS.map(function(t){return t[2]}).indexOf(active)];ind.style.transform="translateX("+b.offsetLeft+"px)";ind.style.width=b.offsetWidth+"px"}
 setTimeout(place,60);addEventListener("resize",place);if(document.fonts)document.fonts.ready.then(place);return place}
var tabsPlace=initTabs("nutr");

function barsSvg(x,y,h){var pat=[2,1,3,1,1,2,3,1,2,2,1,3,1,2,1,1,3,2,1,2,3,1,1,2],cx=x,s="";pat.forEach(function(v,i){if(i%2===0)s+='<rect x="'+cx+'" y="'+y+'" width="'+(v*2.6).toFixed(1)+'" height="'+h+'" fill="var(--ink)" opacity=".8"/>';cx+=v*2.6});return s}
function sceneSvg(){return '<svg viewBox="0 0 300 300" aria-hidden="true"><rect x="40" y="50" width="220" height="190" rx="26" fill="var(--surface)" stroke="var(--ink3)" stroke-width="1.5"/><path d="M40 106V76a26 26 0 0 1 26-26h168a26 26 0 0 1 26 26v30z" fill="var(--coral-soft)"/><rect x="64" y="72" width="96" height="9" rx="4.5" fill="var(--coral)" opacity=".55"/><rect x="64" y="88" width="62" height="6" rx="3" fill="var(--coral)" opacity=".35"/><rect x="85" y="132" width="130" height="84" rx="10" fill="var(--bg)" stroke="var(--line)"/>'+barsSvg(95,144,46)+'<rect x="100" y="196" width="100" height="5" rx="2.5" fill="var(--ink3)" opacity=".5"/></svg>'}

/* ---------- лист «Всё верно?» ---------- */
var cur=null,sheet=$("#sheet"),sh2=$("#sh2"),scrim=$("#scrim"),shMeal=0;
function syncScrim(){scrim.classList.toggle("on",sheet.classList.contains("on")||sh2.classList.contains("on")||$("#shP").classList.contains("on"))}
function mealNow(){var h=new Date().getHours();return h<11?0:(h<16?1:(h<21?2:3))}
function calc(){var t={k:0,p:0,f:0,c:0,g:0};cur.items.forEach(function(it){var m=(+it.g||0)/100;t.k+=it.per[0]*m;t.p+=it.per[1]*m;t.f+=it.per[2]*m;t.c+=it.per[3]*m;t.g+=(+it.g||0)});return t}
var TL={barcode:"Штрихкод",search:"Из базы",recent:"Недавнее"};
var SUB={barcode:"Нашёл по штрихкоду. Проверьте порцию.",search:"Данные открытой базы. Проверьте порцию.",recent:"Как в прошлый раз. Проверьте порцию."};
function itemHtml(it,i){return '<div class="it" data-i="'+i+'"><div class="it1"><div class="itn"><b>'+esc(it.n)+'</b><span>'+esc(it.sub)+'</span></div></div><div class="it2"><div class="step"><button data-st="-1" aria-label="Меньше">'+ic("minus")+'</button><input type="number" inputmode="numeric" min="0" value="'+it.g+'" aria-label="Граммы"><em>г</em><button data-st="1" aria-label="Больше">'+ic("plus")+'</button></div><div class="itk"><b data-ik>0</b><span>ккал</span></div></div></div>'}
function renderSheet(){
 var thumb=cur.thumb?'<div class="thumb" style="background-image:url('+cur.thumb+')"></div>':'<div class="thumb">'+sceneSvg()+'</div>';
 sheet.innerHTML='<div class="grab"></div><div class="sbody"><div class="shead">'+thumb+'<div class="stx"><span class="tg g">'+TL[cur.type]+'</span><h3>Всё верно?</h3><p>'+SUB[cur.type]+'</p></div></div>'+
 '<div class="items" id="items"></div>'+
 '<div class="tot"><div class="tk"><b id="tK">0</b><span>ккал</span></div><div class="mt"><div><b id="tP">0</b><span>белки, г</span></div><div><b id="tF">0</b><span>жиры, г</span></div><div><b id="tC">0</b><span>углеводы, г</span></div></div></div>'+
 '<div class="chips" id="meals">'+MEALS.map(function(m,i){return '<button class="chip'+(i===cur.meal?" on":"")+'" data-m="'+i+'">'+m+'</button>'}).join("")+'</div>'+(cur.off?'<p class="attr">Данные: Open Food Facts contributors</p>':'')+'</div>'+
 '<div class="srow"><button class="cta l" id="again">'+(cur.back==="scan"?"Сканировать ещё":"Назад")+'</button><button class="cta" id="addD">Добавить в дневник</button></div>';
 renderItems()}
function renderItems(){$("#items").innerHTML=cur.items.map(itemHtml).join("");$("#addD").disabled=!cur.items.length;paint()}
function paint(){var t=calc();var ad=$("#addD");if(ad)ad.disabled=!(t.g>0);$("#tK").textContent=nf(t.k);$("#tP").textContent=r1(t.p);$("#tF").textContent=r1(t.f);$("#tC").textContent=r1(t.c);
 $$("#items .it").forEach(function(el,i){var it=cur.items[i];$("[data-ik]",el).textContent=nf(it.per[0]*(+it.g||0)/100)})}
function openSheet(){sheet.classList.add("on");syncScrim();buzz(8)}
function closeSheet(silent){sheet.classList.remove("on");syncScrim();if(silent)cur=null}
sheet.addEventListener("input",function(e){var t=e.target;if(t.tagName!=="INPUT")return;var el=t.closest(".it");var gv=t.value===""?0:Math.min(5000,Math.max(0,+t.value||0));if(t.value!==""&&+t.value!==gv)t.value=gv;cur.items[+el.dataset.i].g=gv;paint()});
sheet.addEventListener("click",function(e){var t=e.target;
 var st=t.closest("[data-st]");if(st){var el=st.closest(".it"),it=cur.items[+el.dataset.i],stp=it.g<30?5:10;it.g=Math.max(0,Math.round(((+it.g||0)+(+st.dataset.st)*stp)/stp)*stp);$("input",el).value=it.g;buzz(5);paint();return}
 var m=t.closest("[data-m]");if(m){cur.meal=+m.dataset.m;$$("#meals .chip").forEach(function(c){c.classList.toggle("on",+c.dataset.m===cur.meal)});buzz(5);return}
 if(t.closest("#again")){var b=cur.back,mi=cur.meal;closeSheet(true);buzz(8);if(b==="scan")rescan();else openSearch(mi);return}
 if(t.closest("#addD"))addCur()});
function rescan(){cam.busy=false;camEl.classList.remove("hold");vf.className="vf bc";setStat("Наведите на штрихкод")}
function addToDay(e){var l=DAYS[selKey]||(DAYS[selKey]=[]);l.push(e);lastId=e.id}
function cacheBc(code,pr){if(!code)return;ND.bc[code]={n:pr.n,per:pr.per,g:pr.g};var ks=Object.keys(ND.bc);if(ks.length>300)delete ND.bc[ks[0]]}
function afterAdd(k){saveND();buzz([12,50,12]);closeCam();closeSh2();setSub(0);renderDiary();toast("Добавлено · "+nf(k)+" ккал");setTimeout(function(){var n=$(".en.new");if(n)n.scrollIntoView({block:"center",behavior:"smooth"})},500)}
function addCur(){if(!cur||!cur.items.length)return;var t=calc(),it=cur.items[0],single=cur.items.length===1,k=t.k,code=cur.code,pr=cur.pr;
 addToDay({id:uid(),name:single?it.n:cur.title,g:t.g,meal:cur.meal,k:t.k,p:t.p,f:t.f,c:t.c,per:single?it.per:null});
 if(code&&pr)cacheBc(code,pr);afterAdd(k)}
function showProduct(type,pr,src,mi,extra){cur={type:type,est:false,title:pr.n,items:[{n:pr.n,sub:src,per:pr.per,g:pr.g}],meal:mi,thumb:type==="barcode"?snap():null,back:type==="barcode"?"scan":"search",off:/Open Food Facts/.test(src)};if(extra)for(var k in extra)cur[k]=extra[k];renderSheet();openSheet()}

/* ---------- база продуктов (Open Food Facts) ---------- */
/* ---------- локальная база продуктов (офлайн): data/base_products.json (справочник) + data/ru_products.json (Open Food Facts, Россия) ---------- */
/* строка: [код,название,бренд,ккал,Б,Ж,У,порция г,сети,доверие(3 справочник,2 полные данные,1 проверить),синонимы] */
var LDB={rows:null,by:null,p:null};
function lnorm(s){return String(s||"").toLowerCase().replace(/ё/g,"е").replace(/[^a-z0-9а-я%]+/g," ").trim()}
function ldbLoad(){if(LDB.p)return LDB.p;
 LDB.p=Promise.all(["data/base_products.json","data/ru_products.json"].map(function(u){return fetch(u).then(function(r){if(!r.ok)throw new Error("http");return r.json()}).catch(function(){return[]})})).then(function(a){
  var rows=a[0].concat(a[1]),by={};for(var i=0;i<rows.length;i++){var r=rows[i];r[11]=" "+lnorm(r[1]+" "+r[2]+" "+(r[10]||"")+" "+(r[8]||[]).join(" "));if(r[0])by[r[0]]=i}LDB.rows=rows;LDB.by=by;return LDB});return LDB.p}
function lrowPr(r){var br=r[2]||"",nm=r[1];return {n:br&&nm.toLowerCase().indexOf(br.toLowerCase())<0?nm+" · "+br:nm,per:[r[3],r[4],r[5],r[6]],g:r[7]>0&&r[7]<=1500?r[7]:100,code:/^\d{8,13}$/.test(r[0])?r[0]:"",src:r[9]===3?"Справочник Forma":"Open Food Facts · база в приложении"}}
function ldbFind(q,lim){var L=LDB.rows;if(!L)return[];var t=lnorm(q).split(" ").filter(Boolean);if(!t.length)return[];var qn=t.join(" "),out=[];
 for(var i=0;i<L.length;i++){var h=L[i][11],ok=true,sc=0;for(var j=0;j<t.length;j++){var p=h.indexOf(" "+t[j]);if(p<0){var p2=h.indexOf(t[j]);if(p2<0){var tj=t[j].length>=6?t[j].slice(0,-2):"";if(tj&&h.indexOf(" "+tj)>=0)sc+=2;else{ok=false;break}}else sc+=1}else sc+=3}
  if(!ok)continue;var nm=lnorm(L[i][1]);if(nm===qn)sc+=20;else if((" "+nm).indexOf(" "+qn)===0||nm.indexOf(qn)===0)sc+=8;sc+=(L[i][9]===3?25:0)+(L[i][8]&&L[i][8].length?1:0)-nm.length/80;out.push([sc,i])}
 out.sort(function(a,b){return b[0]-a[0]});var seen={},res=[];for(var m=0;m<out.length&&res.length<(lim||15);m++){var r=L[out[m][1]],key=lnorm(r[1])+"|"+lnorm(r[2])+"|"+r[3];if(seen[key])continue;seen[key]=1;res.push(lrowPr(r))}return res}
function ldbCode(code){if(!LDB.by)return null;var c=String(code);var i=LDB.by[c];if(i==null&&c.length===12)i=LDB.by["0"+c];if(i==null&&c.length===13&&c.charAt(0)==="0")i=LDB.by[c.slice(1)];return i==null?null:lrowPr(LDB.rows[i])}
function eanOk(c){c=String(c);if(!/^\d+$/.test(c))return false;if(c.length===12)c="0"+c;if(c.length!==13&&c.length!==8)return false;var d=c.split("").map(Number),n=d.length-1,s=0;for(var i=0;i<n;i++){var w=((n-i)%2===1)?3:1;s+=d[i]*w}return(10-s%10)%10===d[n]}
ldbLoad();window.__ldb={find:ldbFind,code:ldbCode,ean:eanOk,db:LDB,search:function(m){openSearch(m)},lookup:function(c){lookup(c)}};
function offFetch(u){return Promise.race([fetch(u).then(function(r){if(!r.ok)throw new Error("http");return r.json()}),new Promise(function(_,rej){setTimeout(function(){rej(new Error("timeout"))},9000)})])}
function n1(v){v=parseFloat(v);return isFinite(v)?v:null}
function r1n(v){return v==null?0:Math.round(v*10)/10}
function prodFrom(o){if(!o)return null;var nm=o.nutriments||{},k=n1(nm["energy-kcal_100g"]);if(k==null){var kj=n1(nm["energy_100g"]);if(kj!=null)k=kj/4.184}
 if(k==null)return null;var name=String(o.product_name_ru||o.product_name||"").trim();if(!name)return null;var br=String(o.brands||"").split(",")[0].trim(),g=n1(o.serving_quantity);if(!g||g<=0||g>1500)g=100;
 return {n:br&&name.toLowerCase().indexOf(br.toLowerCase())<0?name+" · "+br:name,per:[Math.round(k),r1n(n1(nm.proteins_100g)),r1n(n1(nm.fat_100g)),r1n(n1(nm.carbohydrates_100g))],g:Math.round(g)}}

/* ---------- камера и штрихкод ---------- */
var camEl=$("#cam"),vid=$("#vid"),vf=$("#vf"),stat=$("#stat");
var cam={on:false,stream:null,timer:0,det:null,busy:false,canvas:null};
function setStat(t,k){$("#stTx").textContent=t;stat.className="stat glass"+(k?" "+k:"")}
function stopDecode(){clearInterval(cam.timer);cam.timer=0}
function stopStream(){if(cam.stream){cam.stream.getTracks().forEach(function(t){t.stop()});cam.stream=null}vid.srcObject=null;camEl.classList.remove("live")}
function snap(){if(!cam.stream||!vid.videoWidth)return null;try{var c=document.createElement("canvas"),w=200,h=Math.round(w*vid.videoHeight/vid.videoWidth);c.width=w;c.height=h;c.getContext("2d").drawImage(vid,0,0,w,h);return c.toDataURL("image/jpeg",.7)}catch(e){return null}}
function noCam(msg){camEl.classList.add("demo-on");setStat(msg||"Камера недоступна. Найдите продукт по названию или добавьте вручную","warn")}
function openCam(){var fr=$("#fab").getBoundingClientRect(),ar=app.getBoundingClientRect();
 camEl.style.setProperty("--ox",(fr.left+fr.width/2-ar.left)+"px");camEl.style.setProperty("--oy",(fr.top+fr.height/2-ar.top)+"px");
 cam.on=true;cam.busy=false;camEl.classList.add("on");camEl.classList.remove("hold","demo-on");vf.className="vf bc";setStat("Наведите на штрихкод");startCam()}
function closeCam(){var was=cam.on;cam.on=false;pend=null;stopDecode();stopStream();camEl.classList.remove("on","hold","demo-on");closeSheet(true)}
function startCam(){
 if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){noCam();return}
 navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"}},audio:false}).then(function(s){
  if(!cam.on){s.getTracks().forEach(function(t){t.stop()});return}
  cam.stream=s;vid.srcObject=s;try{var pr=vid.play();pr&&pr.catch&&pr.catch(function(){})}catch(e){}
  camEl.classList.add("live");camEl.classList.remove("demo-on");startDecode()},function(){if(cam.on)noCam("Нет доступа к камере. Разрешите её в настройках или добавьте продукт вручную")})}
function loadZX(cb){if(window.ZXing){cb(true);return}if(loadZX.q){loadZX.q.push(cb);return}loadZX.q=[cb];var s=document.createElement("script");s.src="lib/zxing.min.js";
 s.onload=function(){var q=loadZX.q;loadZX.q=null;q.forEach(function(f){f(!!window.ZXing)})};s.onerror=function(){var q=loadZX.q;loadZX.q=null;q.forEach(function(f){f(false)})};document.head.appendChild(s)}
function startDecode(){stopDecode();
 if("BarcodeDetector" in window){try{cam.det=new BarcodeDetector({formats:["ean_13","ean_8","upc_a","upc_e"]})}catch(e){cam.det=null}}
 if(cam.det){cam.timer=setInterval(function(){if(cam.busy||!vid.videoWidth)return;cam.det.detect(vid).then(function(r){if(r&&r.length&&r[0].rawValue)found(r[0].rawValue)}).catch(function(){})},220);return}
 loadZX(function(ok){if(!cam.on)return;if(!ok){setStat("Сканер штрихкодов недоступен. Найдите продукт по названию или добавьте вручную","warn");return}
  var cv=cam.canvas||(cam.canvas=document.createElement("canvas")),ctx=cv.getContext("2d",{willReadFrequently:true}),rd=new ZXing.MultiFormatReader(),h=new Map();
  h.set(ZXing.DecodeHintType.POSSIBLE_FORMATS,[ZXing.BarcodeFormat.EAN_13,ZXing.BarcodeFormat.EAN_8,ZXing.BarcodeFormat.UPC_A,ZXing.BarcodeFormat.UPC_E]);h.set(ZXing.DecodeHintType.TRY_HARDER,true);rd.setHints(h);
  cam.timer=setInterval(function(){if(cam.busy||!vid.videoWidth)return;var w=Math.min(960,vid.videoWidth),hh=Math.round(w*vid.videoHeight/vid.videoWidth);cv.width=w;cv.height=hh;ctx.drawImage(vid,0,0,w,hh);
   try{var res=rd.decode(new ZXing.BinaryBitmap(new ZXing.HybridBinarizer(new ZXing.HTMLCanvasElementLuminanceSource(cv))));if(res&&res.getText())found(res.getText())}catch(e){}},260)})}
function found(code){code=String(code).replace(/\D/g,"");if(code.length<8||cam.busy)return;cam.busy=true;buzz([12,40,12]);vf.className="vf bc ok";setStat("Штрихкод найден · "+code,"ok");lookup(code)}
function gotProduct(code,pr,src){camEl.classList.add("hold");showProduct("barcode",pr,"Штрихкод "+code+" · "+src,pend!=null?pend:mealNow(),{code:code,pr:pr})}
function lookup(code){var c=ND.bc[code];if(c){gotProduct(code,c,"сохранённый продукт");return}
 if(!eanOk(code)){notFound(code,"Код прочитан с ошибкой, наведите ещё раз");return}
 if(LDB.rows){var lp=ldbCode(code);if(lp){gotProduct(code,lp,lp.src);return}}else{setStat("Ищу в базе продуктов…");ldbLoad().then(function(){if(cam.on)lookup(code)});return}
 setStat("Ищу в базе продуктов…");
 offFetch("https://world.openfoodfacts.org/api/v2/product/"+code+".json?fields=product_name,product_name_ru,brands,nutriments,serving_quantity").then(function(r){if(!cam.on)return;
  var pr=r&&r.status===1&&r.product?prodFrom(r.product):null;if(pr)gotProduct(code,pr,"Open Food Facts");else notFound(code,r&&r.status===1?"В базе нет данных о КБЖУ":"Этого штрихкода нет в базе")},
  function(){if(!cam.on)return;notFound(code,"Нет связи с базой. Проверьте интернет")})}
function notFound(code,msg){setStat(msg,"warn");camEl.classList.add("hold");buzz([12,40,12]);var mi=pend!=null?pend:mealNow();
 setTimeout(function(){if(!cam.on)return;closeCam();setTimeout(function(){renderNotFound(mi,code,msg);openSh2()},260)},1100)}
function renderNotFound(mi,code,msg){sh2.innerHTML='<div class="grab"></div><div class="sbody"><h3>Этого продукта нет в базе</h3><p class="note2">'+esc(msg)+'. Сфотографируйте таблицу пищевой ценности, я заполню калории, белки, жиры и углеводы. Продукт сохранится по штрихкоду '+esc(code)+'.</p><button class="mi" id="nfLbl">'+ic("lbl")+'<span class="t">Сфотографировать этикетку<small>Распознаю на телефоне, интернет не нужен</small></span></button><button class="mi" id="nfMan">'+ic("edit")+'Ввести вручную</button></div><div style="height:calc(18px + var(--sai-b,0px))"></div>';
 $("#nfLbl").onclick=function(){labelPick(mi,code,"all")};$("#nfMan").onclick=function(){renderManual(mi,{bc:code,note:"Продукт сохранится по штрихкоду "+code+"."})}}
$("#camX").onclick=function(){buzz(6);closeCam()};
$("#camLbl").onclick=function(){var mi=pend!=null?pend:mealNow();buzz(6);labelPick(mi,"","all")};
$("#camMan").onclick=function(){var mi=pend!=null?pend:mealNow();buzz(6);closeCam();setTimeout(function(){renderManual(mi);openSh2()},260)};
$("#camSrch").onclick=function(){var mi=pend!=null?pend:mealNow();buzz(6);closeCam();setTimeout(function(){openSearch(mi)},260)};

/*LBL-START*/
/* ---------- разбор текста этикетки (OCR): КБЖУ на 100 г, название, порция ---------- */
var LBL_STOP=/(состав|пищев|энергет|ценност|срок|годн|хранить|хранени|изготов|производ|гост|\bту\b|масса|нетто|вес\b|штрихкод|www|http|\.ru|\.com|тел\b|адрес|температур|упаков|белк|белок|жир|углев|ккал|кдж|kcal|на 100|страна|россия|обратит|дата|условия|продукт не|для детей|может содержать|аллерген|рекоменд|потреблен|вскрыт|после|упаковк|сделано|произведено|торгов|марка|партия|организац)/;
function lblNum(s){s=String(s).replace(/[oOоО]/g,"0").replace(/[lI|]/g,"1").replace(/[,]/g,".");var v=parseFloat(s);return isFinite(v)?v:null}
function lblNorm(t){return String(t||"").toLowerCase().replace(/ё/g,"е").replace(/ /g," ").replace(/[|¦]/g," ").replace(/[ \t]+/g," ")}
var LBL_NUM="(?<![A-Za-zА-Яа-яЁё])((?=[0-9oоlI.,]*[0-9])[0-9oоlI]{1,4}(?:[.,][0-9oо]{1,2})?)";
function lblAfter(t,key,span){var re=new RegExp(key,"g"),m,best=null;
 while((m=re.exec(t))){var seg=t.slice(m.index+m[0].length,m.index+m[0].length+(span||36)),nr=new RegExp(LBL_NUM+"\\s*(%|г|g|гр|мг|mg|ккал|кдж)?","g"),x;
  while((x=nr.exec(seg))){if(x[2]==="%"||x[2]==="мг"||x[2]==="mg"||x[2]==="ккал"||x[2]==="кдж")continue;var v=lblNum(x[1]);if(v!=null&&v<=1000){return v}}}
 return best}
function lblEnergy(t){var m=t.match(/(?<![A-Za-zА-Яа-яЁё0-9])((?:[0-9oо][ ]?){1,4}(?:[.,][0-9])?)\s*(?:ккал|kcal|кка[лпи1]|kkal|ккa)/i);if(m){var v=lblNum(m[1].replace(/ /g,""));if(v!=null&&v>0&&v<=1000)return {k:v,src:"kcal"}}
 var m2=t.match(/(?:энергетическая ценность|калорийность|энергия|energy)[^0-9]{0,24}([0-9oо]{1,4}(?:[.,][0-9])?)\s*(к?дж|kj)?/);
 if(m2){var v2=lblNum(m2[1]);if(v2!=null){if(m2[2]){return {k:v2/4.184,src:"kj"}}if(v2>0&&v2<=900)return {k:v2,src:"kcal"}}}
 var m3=t.match(new RegExp(LBL_NUM+"\\s*(?:кдж|kj)","i"));if(m3){var v3=lblNum(m3[1]);if(v3)return {k:v3/4.184,src:"kj"}}
 return null}
function lblTitle(s){s=s.replace(/^[^A-Za-zА-Яа-яЁё0-9«"]+|[^A-Za-zА-Яа-яЁё0-9»"%.)]+$/g,"").replace(/\s+/g," ").trim();
 var L=s.replace(/[^A-Za-zА-Яа-яЁё]/g,"");if(L.length>3&&L===L.toUpperCase()){s=s.charAt(0)+s.slice(1).toLowerCase()}return s}
function lblName(lines){var best=null;
 for(var i=0;i<lines.length;i++){var l=lines[i],tx=String(l.text||"").trim();if(tx.length<4||tx.length>70)continue;
  var n=lblNorm(tx);if(LBL_STOP.test(n))continue;var letters=tx.replace(/[^A-Za-zА-Яа-яЁё]/g,""),cyr=tx.replace(/[^А-Яа-яЁё]/g,"");
  if(letters.length<4||cyr.length/letters.length<.7||letters.length/tx.replace(/\s/g,"").length<.7)continue;
  if(/\d{3,}/.test(tx))continue;var words=tx.split(/\s+/).filter(function(w){return w.replace(/[^А-Яа-яЁё]/g,"").length>=2});if(!words.length)continue;
  var sc=(l.h||12)*(l.conf!=null?Math.min(1,l.conf/80):1)-i*0.3;if(!best||sc>best.sc)best={sc:sc,t:tx,conf:l.conf}}
 if(!best)return "";if(best.conf!=null&&best.conf<45)return "";return lblTitle(best.t)}
function lblParse(text,lines){var raw=String(text||""),t=lblNorm(raw),out={name:"",k:null,p:null,f:null,c:null,g:100,basis:"100",flags:{k:"miss",p:"miss",f:"miss",c:"miss"},found:0,note:""};
 var e=lblEnergy(t);if(e){out.k=Math.round(e.k);out.flags.k="ok"}
 var p=lblAfter(t,"(?:белки|белок|белков|протеин|protein)",34),f=lblAfter(t,"(?:жиры|жир(?!н)|жиров|fat)",34),c=lblAfter(t,"(?:углеводы|углевод|углеводов|carbohydrate)",34);
 if(p!=null){out.p=p;out.flags.p="ok"}if(f!=null){out.f=f;out.flags.f="ok"}if(c!=null){out.c=c;out.flags.c="ok"}
 /* основа: 100 г или порция */
 var per100=/(?:на|в|per)\s*100\s*(?:г|гр|мл|g|ml)|100\s*(?:г|гр|мл|g|ml)\s*(?:продукта|product)?|100\s*г/.test(t);
 var sv=t.match(/порци[юияе]\s*(?:\(|-|:)?\s*(?:около\s*)?([0-9]{1,4})\s*(?:г|гр|мл|g|ml)/)||t.match(/(?:в|на)\s*1\s*порци[ииюя]\s*\(?\s*([0-9]{1,4})\s*(?:г|мл)/);
 var svg=sv?parseInt(sv[1],10):0;
 if(!per100&&/порци/.test(t)){out.basis="serving";if(svg>0&&svg<=1000){var kf=100/svg;["k","p","f","c"].forEach(function(x){if(out[x]!=null)out[x]=Math.round(out[x]*kf*10)/10});out.k=out.k!=null?Math.round(out.k):null;out.g=svg;out.note="Значения на порцию ("+svg+" г) пересчитаны на 100 г."}else{out.note="Значения указаны на порцию, вес порции не распознан. Проверьте и пересчитайте на 100 г.";["k","p","f","c"].forEach(function(x){if(out.flags[x]==="ok")out.flags[x]="chk"})}}
 else if(svg>0&&svg<=1000)out.g=svg;
 /* недостающее и проверка */
 var miss=["p","f","c"].filter(function(x){return out[x]==null});
 if(out.k!=null&&miss.length===1){var w={p:4,f:9,c:4},rest=out.k;["p","f","c"].forEach(function(x){if(out[x]!=null)rest-=w[x]*out[x]});out[miss[0]]=Math.max(0,Math.round(rest/w[miss[0]]*10)/10);out.flags[miss[0]]="calc"}
 else if(out.k==null&&!miss.length){out.k=Math.round(4*out.p+9*out.f+4*out.c);out.flags.k="calc"}
 ["p","f","c"].forEach(function(x){if(out[x]!=null&&(out[x]>100||out[x]<0))out.flags[x]="chk"});
 if(out.k!=null&&out.k>900)out.flags.k="chk";
 if(out.k!=null&&out.p!=null&&out.f!=null&&out.c!=null){var est=4*out.p+9*out.f+4*out.c;if(Math.abs(est-out.k)>Math.max(30,.25*out.k)){["k","p","f","c"].forEach(function(x){if(out.flags[x]==="ok")out.flags[x]="chk"});out.note=(out.note?out.note+" ":"")+"Калории не сходятся с белками, жирами и углеводами. Сверьте с упаковкой."}
  if(out.p+out.f+out.c>101)["p","f","c"].forEach(function(x){out.flags[x]="chk"})}
 out.found=["k","p","f","c"].filter(function(x){return out[x]!=null}).length;
 var ls=lines&&lines.length?lines:raw.split(/\n+/).map(function(x){return {text:x}});out.name=lblName(ls);
 return out}
/*LBL-END*/

/* ---------- сканер этикетки: распознавание на устройстве (tesseract.js, офлайн) ---------- */
var OCR={W:null,P:null,prog:null},LBL={mi:0,code:"",mode:"all",pre:null,tok:0,thumb:""};
function ocrURL(p){try{return new URL(p,document.baseURI).href}catch(e){return p}}
function ocrLoadLib(){return new Promise(function(res,rej){if(window.Tesseract)return res();var s=document.createElement("script");s.src="lib/ocr/tesseract.min.js";s.onload=function(){window.Tesseract?res():rej(new Error("lib"))};s.onerror=function(){rej(new Error("lib"))};document.head.appendChild(s)})}
function ocrWorker(){if(OCR.P)return OCR.P;OCR.P=ocrLoadLib().then(function(){return Tesseract.createWorker(["rus","eng"],1,{workerPath:ocrURL("lib/ocr/worker.min.js"),corePath:ocrURL("lib/ocr"),langPath:ocrURL("lib/ocr/lang"),gzip:true,logger:function(m){if(OCR.prog)OCR.prog(m)}})}).then(function(w){OCR.W=w;return w}).catch(function(e){OCR.P=null;throw e});return OCR.P}
function ocrWarm(){try{var c=navigator.connection;if(c&&(c.saveData||c.type==="cellular"))return;if(navigator.onLine===false)return;ocrWorker().catch(function(){})}catch(e){}}
setTimeout(function(){if("requestIdleCallback"in window)requestIdleCallback(ocrWarm,{timeout:20000});else ocrWarm()},9000);
function ocrPrep(file){return(window.createImageBitmap?createImageBitmap(file,{imageOrientation:"from-image"}):Promise.reject()).catch(function(){return new Promise(function(res,rej){var im=new Image();im.onload=function(){res(im)};im.onerror=rej;im.src=URL.createObjectURL(file)})}).then(function(im){
 var w=im.width||im.naturalWidth,h=im.height||im.naturalHeight,L=Math.max(w,h),sc=L>2000?2000/L:(L<1200?Math.min(2,1200/L):1),cv=document.createElement("canvas");cv.width=Math.round(w*sc);cv.height=Math.round(h*sc);
 var x=cv.getContext("2d",{willReadFrequently:true});x.drawImage(im,0,0,cv.width,cv.height);
 var th=document.createElement("canvas"),tk=Math.min(1,480/cv.width);th.width=Math.round(cv.width*tk);th.height=Math.round(cv.height*tk);th.getContext("2d").drawImage(cv,0,0,th.width,th.height);LBL.thumb=th.toDataURL("image/jpeg",.6);
 var d=x.getImageData(0,0,cv.width,cv.height),a=d.data,hist=new Uint32Array(256),n=cv.width*cv.height,i;
 for(i=0;i<a.length;i+=4){var g=(a[i]*299+a[i+1]*587+a[i+2]*114)/1000|0;a[i]=g;hist[g]++}
 var lo=0,hi=255,c=0;while(lo<255&&(c+=hist[lo])<n*.02)lo++;c=0;while(hi>0&&(c+=hist[hi])<n*.02)hi--;var k=hi>lo+20?255/(hi-lo):1;
 for(i=0;i<a.length;i+=4){var v=Math.max(0,Math.min(255,(a[i]-lo)*k))|0;a[i]=a[i+1]=a[i+2]=v;a[i+3]=255}
 x.putImageData(d,0,0);return cv})}
function ocrLines(d){var out=[];((d&&d.blocks)||[]).forEach(function(b){(b.paragraphs||[]).forEach(function(p){(p.lines||[]).forEach(function(l){var bb=l.bbox||{};out.push({text:String(l.text||"").trim(),h:(bb.y1||0)-(bb.y0||0)||12,conf:l.confidence})})})});return out}
function ocrRead(cv,psm){return ocrWorker().then(function(w){return(w.setParameters({tessedit_pageseg_mode:psm||"3"})).then(function(){return w.recognize(cv,{},{blocks:true,text:true})})}).then(function(r){var d=r.data||r;return{text:d.text||"",lines:ocrLines(d)}})}
var lblF=document.createElement("input");lblF.type="file";lblF.accept="image/*";lblF.setAttribute("aria-hidden","true");lblF.tabIndex=-1;lblF.style.cssText="position:fixed;left:-9999px;top:0;opacity:0;width:1px;height:1px";document.body.appendChild(lblF);
function labelPick(mi,code,mode){LBL.mi=mi;LBL.code=code||"";LBL.mode=mode||"all";lblF.value="";lblF.click()}
lblF.onchange=function(){var f=lblF.files&&lblF.files[0];if(f)labelRun(f)};
function lblSetP(f,t){var b=$("#lbBar"),x=$("#lbTx");if(b)b.style.width=Math.max(6,Math.min(100,Math.round(f*100)))+"%";if(x&&t)x.textContent=t}
function renderLabelBusy(img){sh2.innerHTML='<div class="grab"></div><div class="sbody"><h3>Читаю этикетку</h3><div class="lbusy">'+(img?'<img alt="" src="'+img+'">':'')+'<div class="lb"><i id="lbBar"></i></div><p id="lbTx">Готовлю фото…</p></div></div><div style="height:calc(18px + var(--sai-b,0px))"></div>';openSh2()}
function renderLabelFail(msg){var mi=LBL.mi,code=LBL.code;sh2.innerHTML='<div class="grab"></div><div class="sbody"><h3>Не удалось прочитать</h3><p class="note2">'+esc(msg||"Не получилось разобрать таблицу пищевой ценности.")+' Снимайте ровно и при хорошем свете, чтобы таблица заняла почти весь кадр.</p><button class="mi" id="lfRe">'+ic("lbl")+'Переснять</button><button class="mi" id="lfMan">'+ic("edit")+'Ввести вручную</button></div><div style="height:calc(18px + var(--sai-b,0px))"></div>';
 $("#lfRe").onclick=function(){labelPick(mi,code,"all")};$("#lfMan").onclick=function(){renderManual(mi,{bc:code||"",note:code?"Продукт сохранится по штрихкоду "+code+".":""})};openSh2()}
function labelRun(file){var tok=++LBL.tok,mode=LBL.mode,mi=LBL.mi,code=LBL.code;if(cam.on)closeCam();renderLabelBusy("");
 var bad=function(e){if(tok!==LBL.tok)return;OCR.prog=null;renderLabelFail(e&&e.message==="lib"?"Модуль распознавания не загружен. Нужен интернет при первом запуске, затем он работает офлайн.":"")};
 OCR.prog=function(m){if(tok!==LBL.tok)return;var s=String(m.status||""),p=+m.progress||0;if(/loading|initializ/.test(s)){lblSetP(.06+p*.24,"Загружаю модуль распознавания…")}else if(/recogniz/.test(s)){lblSetP(.34+p*.6,"Читаю текст…")}};
 ocrPrep(file).then(function(cv){if(tok!==LBL.tok)return;var im=$(".lbusy");if(im&&LBL.thumb&&!$(".lbusy img")){var i=document.createElement("img");i.alt="";i.src=LBL.thumb;im.insertBefore(i,im.firstChild)}lblSetP(.1,"Загружаю модуль распознавания…");
  return ocrRead(cv,"3").then(function(r1){var p1=lblParse(r1.text,r1.lines);if(mode==="name"||p1.found>=3)return p1;lblSetP(.9,"Пробую ещё раз…");
   return ocrRead(cv,"6").then(function(r2){var p2=lblParse(r2.text,r2.lines);if(p2.found>p1.found){p1.found=p2.found;["k","p","f","c","g","basis","note"].forEach(function(x){p1[x]=p2[x]});p1.flags=p2.flags}if(!p1.name)p1.name=p2.name;return p1})})}).then(function(r){if(tok!==LBL.tok||!r)return;OCR.prog=null;if(!sh2.classList.contains("on"))return;
  if(mode==="name"){var pre=LBL.pre||{};if(r.name)pre.name=r.name;LBL.pre=pre;buzz(r.name?[10,40,10]:[14,50,14]);renderManual(mi,{bc:code,per:!!code||!!pre.per,pre:pre,img:LBL.thumb,note:r.name?"":"Название не разобрано. Введите вручную."});return}
  if(r.found<2){buzz([14,50,14]);renderLabelFail();return}
  buzz([10,40,10]);LBL.pre={name:r.name,k:r.k,p:r.p,f:r.f,c:r.c,g:r.g,flags:r.flags,lnote:r.note,per:true};renderManual(mi,{bc:code,per:true,pre:LBL.pre,img:LBL.thumb})}).catch(bad)}

/* ---------- «+»: выбор способа, поиск, ручной ввод ---------- */
function openSh2(){sh2.classList.add("on");syncScrim();buzz(8)}
function closeSh2(){sh2.classList.remove("on");syncScrim()}
var pickGen=false;
function openPick(mi,gen){if(gen!==undefined)pickGen=!!gen;shMeal=mi;
 sh2.innerHTML='<div class="grab"></div><div class="sbody"><h3>'+(pickGen?'Добавить приём пищи':MEALS[mi])+'</h3><button class="mi" id="pScan">'+ic("scan")+'Сканировать штрихкод</button><button class="mi" id="pLbl">'+ic("lbl")+'<span class="t">Фото этикетки<small>Заполню калории и БЖУ сам</small></span></button><button class="mi" id="pSrch">'+ic("search")+'Найти продукт</button><button class="mi" id="pMan">'+ic("edit")+'Ввести вручную</button></div><div style="height:calc(18px + var(--sai-b,0px))"></div>';
 $("#pScan").onclick=function(){closeSh2();pend=mi;setTimeout(openCam,250)};
 $("#pLbl").onclick=function(){labelPick(mi,"","all")};
 $("#pSrch").onclick=function(){openSearch(mi)};
 $("#pMan").onclick=function(){renderManual(mi)};openSh2()}
var srchTok=0,srchT=0;
function recents(ex){var keys=Object.keys(DAYS).sort().reverse(),seen={},out=[];ex=ex||{};for(var i=0;i<keys.length&&out.length<12;i++){var l=DAYS[keys[i]]||[];for(var j=l.length-1;j>=0&&out.length<12;j--){var e=l[j],n=String(e.name||"").toLowerCase();if(!n||seen[n]||ex[n])continue;seen[n]=1;out.push(e)}}return out}
function lastMeal(mi){var ks=Object.keys(DAYS).filter(function(k){return k!==selKey&&(DAYS[k]||[]).some(function(e){return e.meal===mi})}).sort(),b=null,a=null;
 ks.forEach(function(k){if(k<selKey)b=k;else if(!a)a=k});var k=b||a;if(!k)return null;return {key:k,list:DAYS[k].filter(function(e){return e.meal===mi})}}
function relDay(k){var d=Math.round((keyDate(k)-keyDate(dk(today)))/864e5);if(d===0)return"сегодня";if(d===-1)return"вчера";if(d===1)return"завтра";if(d===-2)return"позавчера";var x=keyDate(k),s="";try{s=x.toLocaleDateString("ru-RU",{day:"numeric",month:"long"})}catch(e){}return s}
function rrHtml(e,i){return '<button class="rr" data-rc="'+i+'"><span class="tx"><b>'+esc(e.name)+'</b><span>'+(e.g?nf(e.g)+" г · ":"")+nf(e.k)+' ккал</span></span><span class="ad">'+ic("plus")+'</span></button>'}
function renderRecents(lead){var lm=lastMeal(shMeal),ex={},first=[];if(lm){lm.list.forEach(function(e){ex[String(e.name||"").toLowerCase()]=1;first.push(e)})}
 var rs=first.concat(recents(ex)),box=$("#rL");if(!box)return;var h=lead?'<div class="note2">'+lead+'</div>':'';
 if(first.length){h+='<div class="rh">'+MEALS[shMeal]+' · '+relDay(lm.key)+'</div>'+first.map(function(e,i){return rrHtml(e,i)}).join("")+(first.length>1?'<button class="rall" data-all="1">Повторить весь приём · '+nf(first.reduce(function(s,e){return s+e.k},0))+' ккал</button>':'')}
 if(rs.length>first.length)h+='<div class="rh">Недавние</div>'+rs.slice(first.length).map(function(e,i){return rrHtml(e,i+first.length)}).join("");
 else if(!rs.length&&!lead)h+='<div class="note2">Начните вводить название, и я поищу в базе. Добавленные продукты появятся здесь.</div>';
 box.innerHTML=h;box._rs=rs;box._first=first;box._ps=null}
function openSearch(mi){shMeal=mi;
 sh2.innerHTML='<div class="grab"></div><div class="sbody"><button class="bk" id="bkP">'+ic("back")+'К выбору</button><h3>Найти продукт</h3><div class="srch">'+ic("search")+'<input id="qS" type="search" placeholder="Например, творог 5%" autocomplete="off" enterkeyhint="search" aria-label="Название продукта"></div><div class="rl" id="rL"></div><p class="attr">Справочник Forma и Open Food Facts: база встроена в приложение, интернет нужен только для новых продуктов</p></div><div style="height:calc(18px + var(--sai-b,0px))"></div>';
 $("#bkP").onclick=function(){openPick(mi)};
 var qi=$("#qS");qi.oninput=function(){clearTimeout(srchT);var v=qi.value.trim();if(v.length<3){srchTok++;renderRecents();return}srchT=setTimeout(function(){doSearch(v)},600)};
 renderRecents();openSh2();setTimeout(function(){try{qi.focus()}catch(e){}},520)}
function doSearch(v){var tok=++srchTok,box=$("#rL");if(!box)return;
 var render=function(ps,tail){var b2=$("#rL");if(!b2)return;b2._ps=ps;
  b2.innerHTML=(tail||"")+'<div class="rh">Найдено</div>'+ps.map(function(p,i){return '<button class="rr" data-sp="'+i+'"><span class="tx"><b>'+esc(p.n)+'</b><span>'+nf(p.per[0])+' ккал на 100 г</span></span><span class="ad">'+ic("plus")+'</span></button>'}).join("")};
 ldbLoad().then(function(){if(tok!==srchTok||!$("#rL"))return;var loc=ldbFind(v,15);
  if(loc.length)render(loc);else box.innerHTML='<div class="note2">Ищу…</div>';
  if(loc.length>=8)return;
  offFetch("https://world.openfoodfacts.org/cgi/search.pl?search_terms="+encodeURIComponent(v)+"&search_simple=1&action=process&json=1&page_size=20&lc=ru&fields=code,product_name,product_name_ru,brands,nutriments,serving_quantity").then(function(r){
   if(tok!==srchTok||!$("#rL"))return;var seen={};loc.forEach(function(p){if(p.code)seen[p.code]=1});
   var ps=((r&&r.products)||[]).map(function(o){var pr=prodFrom(o);if(pr){pr.code=o.code;pr.src="Open Food Facts"}return pr}).filter(function(p){return p&&!(p.code&&seen[p.code])});
   var all=loc.concat(ps).slice(0,20);
   if(!all.length){$("#rL").innerHTML='<div class="note2">Ничего не нашлось. Попробуйте другое слово или добавьте продукт вручную.</div>';return}
   render(all)},
   function(){if(tok!==srchTok||!$("#rL"))return;if(loc.length)return;renderRecents("Ничего не нашлось в базе приложения, а связи с интернетом нет. Попробуйте другое слово или добавьте вручную.")})})}
sh2.addEventListener("click",function(e){var b=e.target.closest("[data-rc],[data-sp],[data-all]");if(!b)return;var box=$("#rL");buzz(6);
 if(b.dataset.all){var f=box._first||[],tk=0;f.forEach(function(en){tk+=en.k;var n={id:uid(),name:en.name,g:en.g||0,meal:shMeal,k:en.k,p:en.p,f:en.f,c:en.c};if(en.per)n.per=en.per;addToDay(n)});afterAdd(tk);return}
 if(b.dataset.rc!=null){var en=(box._rs||[])[+b.dataset.rc];if(!en)return;
  if(en.per&&en.g){closeSh2();showProduct("recent",{n:en.name,per:en.per,g:en.g},"из вашего дневника",shMeal)}
  else{addToDay({id:uid(),name:en.name,g:0,meal:shMeal,k:en.k,p:en.p,f:en.f,c:en.c});afterAdd(en.k)}return}
 var pr=(box._ps||[])[+b.dataset.sp];if(!pr)return;closeSh2();showProduct("search",pr,pr.src||"Open Food Facts",shMeal,{code:pr.code,pr:pr})});
function renderManual(mi,o){o=o||{};var per=!!o.bc||!!o.per,sel=mi,pre=o.pre||null;
 var pf=pre&&pre.flags||{},lbl=!!pre&&(pre.k!=null||pre.p!=null||pre.f!=null||pre.c!=null);
 sh2.innerHTML='<div class="grab"></div><div class="sbody"><button class="bk" id="bkP">'+ic("back")+'К выбору</button><h3>'+(lbl?"Проверьте данные":per?"Новый продукт":"Добавить вручную")+'</h3>'+
 (lbl?'<div class="lbtop">'+(o.img?'<img alt="" src="'+o.img+'">':'')+'<div class="lt"><b>Данные с этикетки, на 100 г</b><span>'+esc(pre.lnote||"Сверьте значения с упаковкой.")+'</span></div><button id="lblRe">Переснять</button></div><div class="lblg"><span><i></i>Проверьте</span><span><i class="m"></i>Не найдено</span></div>':'')+
 (o.note?'<p class="note2">'+esc(o.note)+'</p>':'')+
 '<input class="fld" id="mN" placeholder="Название" maxlength="48" autocomplete="off">'+(lbl&&!(pre&&pre.name)?'<button class="lbnm" id="lblNm">Сфотографировать название</button>':'')+'<div class="f4"><label>Ккал'+(per?" на 100 г":"")+'<input class="fld" id="mK" type="number" inputmode="numeric" min="0"></label><label>Белки<input class="fld" id="mP" type="number" inputmode="decimal" min="0"></label><label>Жиры<input class="fld" id="mF" type="number" inputmode="decimal" min="0"></label><label>Углеводы<input class="fld" id="mC" type="number" inputmode="decimal" min="0"></label></div>'+
 (per?'<label class="pg">Порция, г<input class="fld" id="mG" type="number" inputmode="numeric" min="1" value="100"></label>':'')+
 '<div class="chips" id="mm">'+MEALS.map(function(m,i){return '<button class="chip'+(i===mi?" on":"")+'" data-m="'+i+'">'+m+'</button>'}).join("")+'</div></div><div class="srow"><button class="cta" id="mOk" disabled>Добавить</button></div>';
 var kDirty=false;
 function chk(){$("#mOk").disabled=!($("#mN").value.trim()&&+$("#mK").value>0)}
 $("#bkP").onclick=function(){openPick(mi)};
 if(pre){var sv=function(id,v){var e=$("#"+id);if(e&&v!=null&&v!=="")e.value=v};sv("mN",pre.name);sv("mK",pre.k);sv("mP",pre.p);sv("mF",pre.f);sv("mC",pre.c);sv("mG",pre.g);if(pre.k!=null)kDirty=true;
  if(lbl){[["mK","k"],["mP","p"],["mF","f"],["mC","c"]].forEach(function(q){var e=$("#"+q[0]),fl=pf[q[1]];if(!e)return;if(fl==="miss")e.classList.add("m");else if(fl==="chk"||fl==="calc")e.classList.add("w");e.addEventListener("input",function(){e.classList.remove("w","m")})});
   var rb=$("#lblRe");if(rb)rb.onclick=function(){labelPick(mi,o.bc||"","all")};
   var nb=$("#lblNm");if(nb)nb.onclick=function(){var g=function(id){var e=$("#"+id);return e&&e.value!==""?+e.value:null};LBL.pre={name:$("#mN").value.trim(),k:g("mK"),p:g("mP"),f:g("mF"),c:g("mC"),g:g("mG")||100,flags:pre.flags,lnote:pre.lnote,per:true};labelPick(mi,o.bc||"","name")}}
  chk()}
 ["mP","mF","mC"].forEach(function(id){$("#"+id).oninput=function(){if(!kDirty){var k=4*Math.max(0,+$("#mP").value||0)+9*Math.max(0,+$("#mF").value||0)+4*Math.max(0,+$("#mC").value||0);$("#mK").value=k?Math.round(k):""}chk()}});
 $("#mK").oninput=function(){kDirty=true;chk()};$("#mN").oninput=chk;
 $("#mm").onclick=function(e){var b=e.target.closest("[data-m]");if(!b)return;sel=+b.dataset.m;$$("#mm .chip").forEach(function(c){c.classList.toggle("on",+c.dataset.m===sel)});buzz(5)};
 $("#mOk").onclick=function(){var cp=function(v,m){v=+v;return isFinite(v)?Math.max(0,Math.min(m,v)):0},k=cp($("#mK").value,per?900:20000),p=cp($("#mP").value,per?100:2000),f=cp($("#mF").value,per?100:2000),c=cp($("#mC").value,per?100:2000),name=$("#mN").value.trim();if(!(k>0))return;
  if(per){var g=Math.min(5000,Math.max(1,+$("#mG").value||100)),m=g/100,pr={n:name,per:[k,p,f,c],g:g};cacheBc(o.bc,pr);addToDay({id:uid(),name:name,g:g,meal:sel,k:k*m,p:p*m,f:f*m,c:c*m,per:pr.per});k=k*m}
  else addToDay({id:uid(),name:name,g:0,meal:sel,k:k,p:p,f:f,c:c});afterAdd(k)};
 setTimeout(function(){var n=$("#mN");if(n&&!pre)n.focus()},500)}
scrim.onclick=function(){if($("#shP").classList.contains("on")){closeNP();return}if(sheet.classList.contains("on")){var c=cam.on;closeSheet(true);if(c)rescan()}else if(sh2.classList.contains("on"))closeSh2()};
$("#fab").onclick=function(){var b=this;buzz(14);b.classList.remove("press");void b.offsetWidth;b.classList.add("press");pend=null;openCam()};
document.addEventListener("keydown",function(e){if(e.key!=="Escape")return;if(sheet.classList.contains("on")){var c=cam.on;closeSheet(true);if(c)rescan()}else if(sh2.classList.contains("on"))closeSh2();else if(cam.on)closeCam()});
document.addEventListener("visibilitychange",function(){if(document.hidden&&cam.on)closeCam()});

/* ---------- связь с оболочкой ---------- */
function onShow(){calcWeek();if(dk(today)!==lastToday){lastToday=dk(today);selKey=lastToday}
 if(cam.on)closeCam();closeSheet(true);closeSh2();var ch=pullProfile();tabsPlace();if(ch)paintNorm(false);else renderDiary();if(sub===1)setTimeout(replayNorm,60)}
addEventListener("message",function(e){var m=e.data;if(m&&m.f==="forma"&&m.from==="shell"&&m.t==="show")onShow()});
addEventListener("message",function(e){var m=e.data;if(m&&m.f==="forma"&&m.from==="shell"&&m.t==="addmeal"){if(cam.on)closeCam();closeSheet(true);closeSh2();setTimeout(function(){pend=null;openPick(mealNow(),true)},60)}});
FS.on(function(k){if(k==="profile"||k==="wt"||k==="plan"){if(pullProfile())paintNorm(false)}else if(k==="nutr"){/* изменили в другом окне */}});
addEventListener("pagehide",function(){saveND()});
buildNorm();paintNorm(false);renderDiary();
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
