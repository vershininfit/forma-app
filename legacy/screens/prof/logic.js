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

/*CALC_BEGIN*/
/* Формулы. Все функции возвращают {ok:false,err:"..."} при недопустимых данных и никогда не NaN */
var CALC=(function(){
 function num(v){if(typeof v==="string")v=v.replace(",",".").trim();var n=parseFloat(v);return (typeof v==="number"||(typeof v==="string"&&v!==""))&&isFinite(n)&&isFinite(+v)?+v:NaN}
 function inr(v,a,b){return isFinite(v)&&v>=a&&v<=b}
 function r0(v){return Math.round(v)}function r1(v){return Math.round(v*10)/10}
 var LIM={age:[14,100],h:[120,230],w:[30,250],bf:[3,60],neck:[20,70],waist:[40,200],hip:[50,200]};
 function chk(o,keys){for(var i=0;i<keys.length;i++){var k=keys[i],v=num(o[k]),L=LIM[k];if(!isFinite(v))return {ok:false,err:NAMES[k]+": введите число"};if(!inr(v,L[0],L[1]))return {ok:false,err:NAMES[k]+": допустимо от "+L[0]+" до "+L[1]}}return null}
 var NAMES={age:"Возраст",h:"Рост",w:"Вес",bf:"Процент жира",neck:"Шея",waist:"Талия",hip:"Бёдра"};
 /* BMR, ккал/сутки */
 function mifflin(sex,w,h,a){return 10*w+6.25*h-5*a+(sex==="m"?5:-161)}
 function harris(sex,w,h,a){return sex==="m"?88.362+13.397*w+4.799*h-5.677*a:447.593+9.247*w+3.098*h-4.330*a}
 function katch(w,bf){return 370+21.6*w*(1-bf/100)}
 var ACT=[["1.2","Сидячий образ жизни, тренировок нет"],["1.375","Лёгкая активность: 1–3 тренировки в неделю"],["1.55","Умеренная: 3–5 тренировок в неделю"],["1.725","Высокая: 6–7 тренировок в неделю"],["1.9","Очень высокая: тяжёлый труд и ежедневные тренировки"]];
 function actFor(days){return days<=0?1.2:days<=3?1.375:days<=5?1.55:1.725}
 function bmr(o){ /* sex: m|f ; age,h,w ; bf (необязательно) */
  var sex=o.sex==="m"?"m":"f",e=chk(o,["age","h","w"]);if(e)return e;
  var a=num(o.age),h=num(o.h),w=num(o.w),res={ok:true,sex:sex,m:r0(mifflin(sex,w,h,a)),hb:r0(harris(sex,w,h,a)),kt:null};
  var bf=num(o.bf);if(o.bf!==""&&o.bf!=null&&inr(bf,LIM.bf[0],LIM.bf[1]))res.kt=r0(katch(w,bf));
  var v=[res.m,res.hb].concat(res.kt!=null?[res.kt]:[]);res.avg=r0(v.reduce(function(s,x){return s+x},0)/v.length);return res}
 /* цель: lose|keep|gain ; pace — доля от TDEE */
 function target(tdee,bmrV,sex,goal,pace){
  var f=goal==="lose"?-(pace||.18):goal==="gain"?(pace||.1):0,kc=tdee*(1+f),floor=Math.max(sex==="m"?1500:1200,0);
  var low=kc<floor;if(low)kc=Math.min(Math.max(kc,floor),tdee);return {kcal:r0(kc),floored:low,delta:r0(kc-tdee)}}
 function macros(kcal,w,goal,sex,h){
  /* опорный вес: при ИМТ > 27 белок и жиры считаем от веса при ИМТ 27, иначе цифры завышены */
  var hm=num(h)/100,wr=isFinite(hm)&&hm>1?Math.min(w,27*hm*hm):w;
  var p=goal==="lose"?2.0:goal==="gain"?1.8:1.6,pr=r0(p*wr),fat=Math.max(r0(.9*wr),r0(kcal*.2/9)),
  carb=Math.round((kcal-pr*4-fat*9)/4);
  if(carb<50){ /* калорий слишком мало для такого белка: пересчёт по долям */pr=r0(kcal*.3/4);fat=r0(kcal*.3/9);carb=r0(kcal*.4/4)}
  return {p:pr,f:fat,c:carb}}
 /* ориентир по ИМТ и возрасту (Deurenberg 1991) — для сверки с замерами */
 function deur(sex,bmiV,age){var v=1.2*bmiV+.23*age-10.8*(sex==='m'?1:0)-5.4;return r1(Math.max(2,Math.min(60,v)))}
 function bmi(w,h){var m=h/100;return r1(w/(m*m))}
 function bmiCat(v){return v<18.5?"Ниже нормы":v<25?"Норма":v<30?"Выше нормы":"Ожирение"}
 /* ВМС США, см. Hodgdon & Beckett 1984 */
 function navy(o){var sex=o.sex==="m"?"m":"f",keys=["h","neck","waist"].concat(sex==="f"?["hip"]:[]),e=chk(o,keys.concat(["w"]));if(e)return e;
  var h=num(o.h),n=num(o.neck),wa=num(o.waist),hi=sex==="f"?num(o.hip):0,w=num(o.w),bf;
  if(sex==="m"){if(wa<=n)return {ok:false,err:"Талия должна быть больше шеи"};bf=495/(1.0324-.19077*Math.log10(wa-n)+.15456*Math.log10(h))-450}
  else{if(wa+hi<=n)return {ok:false,err:"Талия и бёдра вместе должны быть больше шеи"};bf=495/(1.29579-.35004*Math.log10(wa+hi-n)+.22100*Math.log10(h))-450}
  if(!isFinite(bf))return {ok:false,err:"Не удалось посчитать, проверьте замеры"};
  var raw=bf;bf=Math.max(2,Math.min(60,bf));var fat=w*bf/100;
  return {ok:true,bf:r1(bf),clamped:raw<2||raw>60,fat:r1(fat),lean:r1(w-fat),cat:bfCat(sex,bf),sex:sex}}
 function bfCat(sex,v){var T=sex==="m"?[[6,"Критический минимум"],[14,"Атлетичный"],[18,"Подтянутый"],[25,"Средний"],[999,"Повышенный"]]:[[14,"Критический минимум"],[21,"Атлетичный"],[25,"Подтянутый"],[32,"Средний"],[999,"Повышенный"]];for(var i=0;i<T.length;i++)if(v<T[i][0])return T[i][1];return T[T.length-1][1]}
 return {num:num,bmr:bmr,target:target,macros:macros,bmi:bmi,deur:deur,bmiCat:bmiCat,navy:navy,bfCat:bfCat,ACT:ACT,actFor:actFor,LIM:LIM,mifflin:mifflin,harris:harris,katch:katch,r0:r0,r1:r1}})();
/*CALC_END*/

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
  {id:"tpl-trx-full",name:"TRX дома: всё тело",desc:"Три тренировки на петлях: приседания, тяги, жимы и кор. Нужны только петли.",lvl:1,maxLvl:2,where:"home",mins:30,perWeek:3,goal:"relief",style:"std",tags:["TRX","Дом","Всё тело"],eqs:["trx","body"],types:["fullA","fullB","fullC"]},
  {id:"tpl-glutes-home",name:"Ягодицы и ноги дома",desc:"Мостики, отведения и приседания с резинкой и собственным весом.",lvl:1,maxLvl:2,where:"home",mins:30,perWeek:2,goal:"stroy",style:"stroy",tags:["Ягодицы","Ноги","Дом","Резинка"],eqs:["body","band"],types:["lower","lower2"]},
  {id:"tpl-dumbbell-home",name:"Гантели дома: всё тело",desc:"Базовые упражнения с гантелями на все группы мышц.",lvl:1,maxLvl:2,where:"home",mins:45,perWeek:3,goal:"relief",style:"std",tags:["Гантели","Дом","Всё тело"],eqs:["dumbbell","body"],types:["fullA","fullB","fullC"]},
  {id:"tpl-gym-novice",name:"Зал: база для новичка",desc:"Простые тренажёры и гантели: учимся технике и набираем рабочую базу.",lvl:1,maxLvl:1,where:"gym",mins:45,perWeek:3,goal:"start",style:"std",tags:["Зал","Новичок","Тренажёры"],eqs:["machine","dumbbell","cable","body"],types:["fullA","fullB","fullC"]},
  {id:"tpl-posture",name:"Верх тела и осанка",desc:"Спина, задние дельты и грудь: разгрузка шеи и плеч после сидячего дня.",lvl:1,maxLvl:2,where:"both",mins:30,perWeek:2,goal:"recover",style:"std",tags:["Осанка","Спина","Плечи"],eqs:["trx","band","dumbbell","body"],types:["posture","upper"]},
  {id:"tpl-core20",name:"Кор и пресс 20 минут",desc:"Короткая тренировка на кор и стабилизацию. Можно повторять 3 раза в неделю.",lvl:1,maxLvl:2,where:"both",mins:20,perWeek:3,goal:"relief",style:"std",tags:["Кор","Пресс","20 минут"],eqs:["body","band","trx"],types:["core"]},
  {id:"tpl-soft-start",name:"Мягкий старт",desc:"Два подхода, без прыжков и перегрузок. Чтобы втянуться и не бросить.",lvl:1,maxLvl:1,where:"both",mins:20,perWeek:3,goal:"start",style:"start",tags:["Новичок","Мягко","Дом"],eqs:["body","band","mob"],types:["fullA","fullB"]},
  {id:"tpl-force-barbell",name:"Сила: база со штангой",desc:"Присед, тяга, жим и тяга в наклоне: меньше повторов, больше веса, длиннее отдых.",lvl:3,maxLvl:3,where:"gym",mins:60,perWeek:3,goal:"force",style:"force",tags:["Сила","Штанга","Зал"],eqs:["barbell","machine","dumbbell","body"],types:["fullA","fullB","fullC"]},
  {id:"tpl-split-gym",name:"Верх / низ: 4 дня",desc:"Две тренировки на верх и две на низ в неделю. Для тех, кто уже в ритме.",lvl:2,maxLvl:2,where:"gym",mins:45,perWeek:4,goal:"stroy",style:"std",tags:["Зал","Сплит","4 дня"],eqs:["barbell","dumbbell","machine","cable","body"],types:["upper","lower","upper2","lower2"]},
  {id:"tpl-glutes-gym",name:"Ягодицы: зал",desc:"Мостик со штангой, тяги и тренажёры на ягодицы и заднюю поверхность бедра.",lvl:2,maxLvl:2,where:"gym",mins:45,perWeek:2,goal:"stroy",style:"stroy",tags:["Ягодицы","Зал"],eqs:["barbell","machine","dumbbell","band","body"],types:["glute","lower2"]},
  {id:"tpl-relief-home",name:"Рельеф дома: всё тело",desc:"Больше повторов и короткий отдых: тренировка в плотном темпе.",lvl:2,maxLvl:2,where:"home",mins:30,perWeek:3,goal:"relief",style:"relief",tags:["Рельеф","Дом","Круговая"],eqs:["body","band","dumbbell","trx"],types:["fullA","fullB","fullC"]},
  {id:"tpl-gentle",name:"Бережная: колени и спина",desc:"Без прыжков и тяжёлых осевых нагрузок, с мобилизацией в начале.",lvl:1,maxLvl:1,where:"both",mins:30,perWeek:3,goal:"recover",style:"recover",tags:["Бережно","Колени","Спина"],eqs:["body","band","trx","mob"],types:["fullA","fullB"],cau:["Колени","Спина"]}
 ];

 function templates(profile){
  ensure();var res=[],pf=profile&&typeof profile==="object"?profile:null;
  TPL.forEach(function(d){
   try{
    var eq={};d.eqs.forEach(function(k){eq[k]=1});
    var cau=(d.cau||[]).concat(pf&&typeof RX!=="undefined"?RX.cauOf(pf):[]),soft=!!SOFT[d.style],knees=hasRe(cau,/колен/),back=hasRe(cau,/спин|поясниц/);
    var ctx=mkCtx({types:d.types,goal:d.style,soft:soft,noJump:soft||knees||back,eq:eq,maxLvl:d.maxLvl||d.lvl,mins:d.mins,count:countFor(d.mins,d.lvl),
     lvl:d.lvl,strict:true,cautious:knees||back,knees:knees,prof:pf||{},softSets:2});
    var w=buildWorkouts(ctx);
    if(!w||!w.length)return;
    res.push({id:d.id,name:d.name,desc:d.desc,lvl:d.lvl,where:d.where,mins:d.mins,perWeek:d.perWeek,tags:d.tags.slice(),goal:d.goal,eqs:d.eqs.slice(),workouts:w});
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
window.PAGE="prof";
var GOALS=[["stroy","Стройность и тонус"],["relief","Рельеф и меньше жира"],["force","Сила и выносливость"],["start","С нуля или после перерыва"],["recover","Восстановление"],["reg","Регулярность и здоровье"]];
var EQS=[["body","Свой вес"],["trx","TRX"],["dumbbell","Гантели"],["kettlebell","Гири"],["barbell","Штанга"],["machine","Тренажёры"],["cable","Кроссовер"],["band","Резинки"],["other","Коврик"]];
var CAUS=["Колени","Спина","Плечи","Шея","Беременность или после родов","Сердце или давление","Другое"];
var DAYS=["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];
var tabsPlace=initTabs("prof");
var C={goal:null,pace:null,fsel:null,act:null,sex:null,age:"",h:"",w:"",bf:"",neck:"",waist:"",hip:""}; /* локальные значения калькулятора (подставляются из профиля, правятся независимо) */
var seeded=false;
function P(){return FS.get("profile")||{}}
function setP(o,silent){var p=P();for(var k in o)p[k]=o[k];FS.set("profile",p)}
function ageOf(b){if(!b)return null;var m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(b);if(!m)return null;var t=new Date(),a=t.getFullYear()-(+m[1]);if(t.getMonth()+1<+m[2]||(t.getMonth()+1===+m[2]&&t.getDate()<+m[3]))a--;return a>=0&&a<130?a:null}
function nf(n){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,"\u2009")}
function num(v){return CALC.num(v)}
function goalName(k){for(var i=0;i<GOALS.length;i++)if(GOALS[i][0]===k)return GOALS[i][1];return ""}
function lastW(){var w=FS.get("wt")||[];return w.length?w[w.length-1].v:null}
function wtSet(v){v=Math.round(v*10)/10;var w=(FS.get("wt")||[]).filter(function(x){return x.d!==TODAY_ISO});w.push({d:TODAY_ISO,v:v});w.sort(function(a,b){return a.d<b.d?-1:1});FS.set("wt",w)}
/* ---------- сегмент ---------- */
function mkSeg(box,opts,val,fn){box.innerHTML="";var ind=document.createElement("div");ind.className="ind";box.appendChild(ind);var bs=[];
 opts.forEach(function(o){var b=document.createElement("button");b.textContent=o[1];b.dataset.v=o[0];box.appendChild(b);bs.push(b);b.onclick=function(){if(b.classList.contains("on"))return;set(o[0],true);fn(o[0]);pulseAt(b,"rgba(23,23,26,.35)",6)}});
 function set(v,anim){bs.forEach(function(b){b.classList.toggle("on",b.dataset.v===String(v))});var on=box.querySelector("button.on");if(on){if(!anim)ind.style.transition="none";ind.style.width=on.offsetWidth+"px";ind.style.transform="translateX("+on.offsetLeft+"px)";if(!anim){void ind.offsetWidth;ind.style.transition=""}}else{ind.style.width="0"}}
 requestAnimationFrame(function(){set(val,false)});setTimeout(function(){set(val,false)},120);return set}
function chips(box,opts,sel,multi,fn){box.innerHTML="";box.className="p-chips";opts.forEach(function(o){var k=Array.isArray(o)?o[0]:o,l=Array.isArray(o)?o[1]:o,b=document.createElement("button");b.className="p-chp"+(sel(k)?" on":"");b.textContent=l;b.onclick=function(){fn(k,b);b.classList.toggle("on",!!sel(k));if(b.classList.contains("on"))pulseAt(b,"rgba(23,23,26,.35)",6);if(!multi)$$(".p-chp",box).forEach(function(x){if(x!==b)x.classList.remove("on")})};box.appendChild(b)})}
function toggle(el,on,fn){el.classList.toggle("on",!!on);el.onclick=function(){var v=!el.classList.contains("on");el.classList.toggle("on",v);pulseAt(el,"var(--green)",8);fn(v)}}
/* ---------- сводка ---------- */
function renderSum(){var p=P(),a=ageOf(p.birth),w=lastW()||p.w,h=p.h,bits=[];if(a!=null)bits.push(plural(a,["год","года","лет"]));if(h)bits.push(h+" см");if(w)bits.push(fk(w)+" кг");
 var bmi=(w&&h&&w>=30&&w<=250&&h>=120&&h<=230)?CALC.bmi(w,h):null,nut=p.nut;
 $("#cSum").innerHTML='<div class="p-sum"><div class="p-av">'+esc((p.name||"?").trim().charAt(0).toUpperCase()||"?")+'</div><div><b>'+esc(p.name||"Без имени")+'</b><span>'+esc(bits.join(" · ")||"Заполните данные ниже")+'</span>'+(p.goal?'<br><span>'+esc(goalName(p.goal))+'</span>':'')+'</div></div>'
  +'<div class="p-tiles"><div class="p-t"><b>'+(bmi?fi(bmi):"—")+'</b><small>ИМТ'+(bmi?" · "+CALC.bmiCat(bmi).toLowerCase():"")+'</small></div><div class="p-t"><b>'+(p.bf?fi(p.bf)+"%":"—")+'</b><small>жир</small></div><div class="p-t"'+(nut&&nut.kcal?'':' data-go="nutr" role="button" tabindex="0"')+'><b>'+(nut&&nut.kcal?nf(nut.kcal):"—")+'</b><small>'+(nut&&nut.kcal?"норма ккал":"рассчитать норму")+'</small></div></div>';
 var hl=(FS.get("hist")||[]).length;$("#pdate").textContent=hl?plural(hl,["тренировка","тренировки","тренировок"])+" в истории":"Настройки и данные"}
/* ---------- сворачиваемые карточки ---------- */
function fixSegs(root){$$(".p-seg",root).forEach(function(box){var ind=$(".ind",box),on=box.querySelector("button.on");if(!ind)return;if(on&&on.offsetWidth){ind.style.transition="none";ind.style.width=on.offsetWidth+"px";ind.style.transform="translateX("+on.offsetLeft+"px)";void ind.offsetWidth;ind.style.transition=""}})}
function setAcc(id,open){var c=$(id),h=$(".p-ah",c);c.classList.toggle("open",open);h.setAttribute("aria-expanded",open);if(open){fixSegs(c);setTimeout(function(){fixSegs(c)},140)}}
function acc(id){var c=$(id),h=$(".p-ah",c);h.onclick=function(){var o=!c.classList.contains("open");buzz(6);setAcc(id,o);if(o)setTimeout(function(){try{c.scrollIntoView({behavior:"smooth",block:"nearest"})}catch(e){}},380)}}
/* ---------- калькуляторы ---------- */
var SX={};
function seedCalc(){var p=P(),a=ageOf(p.birth);
 C.sex=C.sex||(p.sex==="m"?"m":"f");if(C.age===""&&a!=null)C.age=String(a);if(C.h===""&&p.h)C.h=String(p.h);var w=lastW()||p.w;if(C.w===""&&w)C.w=String(w);if(C.bf===""&&p.bf)C.bf=String(p.bf);
 if(C.neck===""&&p.neck)C.neck=String(p.neck);if(C.waist===""&&p.waist)C.waist=String(p.waist);if(C.hip===""&&p.hip)C.hip=String(p.hip);
 if(!C.act){var pl=FS.get("plan");C.act=p.actSet&&p.act?p.act:CALC.actFor(pl&&pl.days?pl.days.length:0)}
 if(!C.goal){C.goal=p.nut&&p.nut.goal||({relief:"lose",stroy:"lose"}[p.goal]||(p.goal==="force"?"gain":"keep"))}
 if(!C.pace)C.pace=p.nut&&p.nut.pace||0;if(!C.fsel)C.fsel=p.nut&&p.nut.fm||"avg"}
function renderCalc(){seedCalc();drawCal($("#calBody"));drawFat($("#fatBody"));updSubs()}
function fld(id,label,val,ph,mode){return '<div class="p-f"><label for="'+id+'">'+label+'</label><input class="p-in" id="'+id+'" inputmode="'+(mode||"decimal")+'" autocomplete="off" placeholder="'+(ph||"")+'" value="'+esc(val)+'"></div>'}
function sexSeg(id){return '<div class="p-f"><label>Пол</label><div class="p-seg" id="'+id+'"></div></div>'}
function bind(id,key,after){var e=$("#"+id);if(!e)return;e.oninput=function(){C[key]=e.value;after()}}
function onSex(v){C.sex=v;if(SX.c)SX.c(v,true);if(SX.f)SX.f(v,true);var hw=$("#fHipW");if(hw){hw.innerHTML=v==="f"?fld("fHip","Бёдра, см (по самому широкому месту)",C.hip,"98"):"";bind("fHip","hip",fatRes)}var wl=$("#fWaist");if(wl)wl.placeholder=v==="f"?"по самому узкому":"на уровне пупка";calcRes();fatRes()}
function updSubs(){var p=P(),n=p.nut,a=ageOf(p.birth),w=lastW()||p.w,bits=[];
 if(p.name)bits.push(p.name);bits.push(p.sex==="m"?"мужчина":"женщина");if(a!=null)bits.push(plural(a,["год","года","лет"]));if(p.h)bits.push(p.h+" см");if(w)bits.push(fk(w)+" кг");
 $("#meSub").textContent=bits.join(" · ");
 $("#calSub").textContent=n&&n.kcal?"Моя норма: "+nf(n.kcal)+" ккал · Б "+n.p+" · Ж "+n.fat+" · У "+n.c:"Норма по цели: белки, жиры, углеводы";
 $("#fatSub").textContent=p.bf?"Сейчас около "+fi(p.bf)+" %":"По замерам тела"}
/* калории */
var GN={lose:"снижение веса",keep:"поддержание",gain:"набор массы"};
function drawCal(b){
 b.innerHTML=sexSeg("cSexC")
  +'<div class="p-row">'+fld("cAge","Возраст, лет",C.age,"35","numeric")+fld("cH","Рост, см",C.h,"168","numeric")+'</div>'
  +'<div class="p-row">'+fld("cW","Вес, кг",C.w,"62,5")+fld("cBf","% жира (по желанию)",C.bf,"—")+'</div>'
  +'<div class="p-f"><label>Активность</label><div class="p-chips" id="cAct"></div><p class="p-note" id="cActT"></p></div>'
  +'<div class="p-f"><label>Цель</label><div class="p-seg" id="cGoal"></div></div><div class="p-f" id="cPaceW"></div>'
  +'<p class="p-note" id="calMsg"></p>'
  +'<div id="calWrap" style="display:flex;flex-direction:column;gap:12px">'
  +'<div class="p-big"><div class="p-seg p-fseg" id="fmSeg"></div><div class="s" id="coT"></div><div class="k"><span id="coK">0</span><small>ккал в день</small></div><div class="s m" id="coS"></div>'
  +'<div class="p-mac">'+["Белки:p","Жиры:f","Углеводы:c"].map(function(x){var q=x.split(":");return '<div class="r"><span>'+q[0]+'</span><div class="tk"><i id="mk'+q[1]+'"></i></div><span class="v" id="mv'+q[1]+'">—</span></div>'}).join("")+'</div>'
  +'<p class="p-note w" id="coW" style="display:none"></p></div>'
  +'<div class="p-btns"><button class="cta go" id="nutSave">Сохранить как мою норму</button></div>'
  +'<p class="p-note">Это ориентир, а не точное число. Через 2–3 недели сравните с тем, как меняется ваш вес, и поправьте норму на 100–200 ккал.</p></div>';
 SX.c=mkSeg($("#cSexC"),[["f","Женщина"],["m","Мужчина"]],C.sex,onSex);
 ["cAge:age","cH:h","cW:w","cBf:bf"].forEach(function(s){var q=s.split(":");bind(q[0],q[1],calcRes)});
 chips($("#cAct"),CALC.ACT.map(function(a,i){return [a[0],["Нет","Лёгкая","Средняя","Высокая","Очень высокая"][i]]}),function(k){return String(C.act)===k},false,function(k){C.act=+k;C.actSet=1;actTxt();calcRes()});actTxt();
 function actTxt(){var a=CALC.ACT.filter(function(x){return +x[0]===+C.act})[0];$("#cActT").textContent=a?a[1]+" · множитель "+String(a[0]).replace(".",","):""}
 mkSeg($("#cGoal"),[["lose","Похудеть"],["keep","Держать"],["gain","Набрать"]],C.goal,function(v){C.goal=v;C.pace=0;drawPace();calcRes()});drawPace();
 var fmSet=mkSeg($("#fmSeg"),[["m","Миффлин"],["hb","Харрис"],["kt","Кэтч"],["avg","Среднее"]],C.fsel,function(v){
  if(v==="kt"&&!(CALC.num(C.bf)>=3)){fmSet(C.fsel,true);setAcc("#cFat",true);toast("Эта формула считает по проценту жира — измерьте его ниже");setTimeout(function(){$("#cFat").scrollIntoView({behavior:"smooth",block:"nearest"})},300);return}
  C.fsel=v;calcRes()});
 $("#fmSeg").classList.add("p-fseg");
 calcRes()}
function drawPace(){var w=$("#cPaceW");if(C.goal==="keep"){w.style.display="none";w.innerHTML="";return}w.style.display="";
 var pace=C.pace||(C.goal==="lose"?.18:.1);w.innerHTML='<label>Темп</label><div class="p-seg" id="cPace"></div>';
 mkSeg($("#cPace"),C.goal==="lose"?[["0.10","Мягко −10%"],["0.18","Средне −18%"],["0.25","Быстро −25%"]]:[["0.05","+5%"],["0.10","+10%"],["0.15","+15%"]],pace.toFixed(2),function(v){C.pace=+v;calcRes()})}
function tween(el,to){var from=el._v||0;el._v=to;if(el._r)cancelAnimationFrame(el._r);var t0=performance.now(),d=Math.min(600,Math.abs(to-from)*3+200);if(from===to||(window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches)){el.textContent=nf(to);return}
 (function f(n){var k=Math.min(1,(n-t0)/d),e=1-Math.pow(1-k,3);el.textContent=nf(from+(to-from)*e);if(k<1)el._r=requestAnimationFrame(f)})(t0)}
var calLast=null;
function calcRes(){var wrap=$("#calWrap");if(!wrap)return;
 var r=CALC.bmr({sex:C.sex,age:C.age,h:C.h,w:C.w,bf:C.bf}),msg=$("#calMsg"),empty=(C.age===""||C.h===""||C.w==="");
 var kt=$('#fmSeg button[data-v="kt"]');if(kt)kt.classList.toggle("off",!r.ok||r.kt==null);
 if(!r.ok){wrap.style.display="none";msg.style.display="";msg.className="p-note"+(empty?"":" w");msg.textContent=empty?"Заполните возраст, рост и вес — числа появятся здесь.":r.err;calLast=null;return}
 msg.style.display="none";wrap.style.display="flex";
 var fk2=C.fsel,vals={m:r.m,hb:r.hb,kt:r.kt,avg:r.avg};if(fk2==="kt"&&r.kt==null){fk2="avg";C.fsel="avg";$$("#fmSeg button").forEach(function(x){x.classList.toggle("on",x.dataset.v==="avg")});fixSegs($("#cCal"))}
 var bmrV=vals[fk2],tdee=Math.round(bmrV*(+C.act||1.2)),sex=r.sex;
 var pace=C.goal==="keep"?0:(C.pace||(C.goal==="lose"?.18:.1)),t=CALC.target(tdee,bmrV,sex,C.goal,pace),mc=CALC.macros(t.kcal,CALC.num(C.w),C.goal,sex,CALC.num(C.h));
 var fn={m:"Миффлин — Сан-Жеор",hb:"Харрис — Бенедикт",kt:"Кэтч — Макардл",avg:"среднее по формулам"}[fk2];
 $("#coT").textContent="Норма на цель «"+GN[C.goal]+"» · "+fn;
 tween($("#coK"),t.kcal);
 $("#coS").textContent="В покое "+nf(bmrV)+" · за день "+nf(tdee)+(t.delta?" · "+(t.delta>0?"+":"−")+nf(Math.abs(t.delta)):"")+" ккал";
 [["p",mc.p,4],["f",mc.f,9],["c",mc.c,4]].forEach(function(x){var pc=t.kcal>0?Math.max(0,Math.min(100,x[1]*x[2]/t.kcal*100)):0;$("#mk"+x[0]).style.width=Math.round(pc)+"%";$("#mv"+x[0]).textContent=nf(x[1])+" г"});
 var w=$("#coW");if(t.floored){w.style.display="";w.textContent="Так мало есть небезопасно — норма поднята до "+nf(t.kcal)+" ккал. Быстрее худеть лучше только вместе с врачом."}else w.style.display="none";
 $("#nutSave").onclick=function(){setP({nut:{kcal:t.kcal,p:mc.p,fat:mc.f,c:mc.c,fm:fk2,goal:C.goal,pace:pace,tdee:tdee,d:TODAY_ISO},act:+C.act,actSet:(C.actSet||P().actSet)?1:0});pulseAt($("#nutSave"),null,10);toast("Норма сохранена: "+nf(t.kcal)+" ккал");renderSum();updSubs()}}
/* % жира */
function drawFat(b){
 b.innerHTML='<p class="p-lead">Считаем по росту, шее и талии. Мерьте утром мягкой лентой, без натяжения.</p>'+sexSeg("fSex")
  +'<div class="p-row">'+fld("fH","Рост, см",C.h,"168","numeric")+fld("fW","Вес, кг",C.w,"62,5")+'</div>'
  +'<div class="p-row">'+fld("fNeck","Шея, см",C.neck,"33")+fld("fWaist","Талия, см",C.waist,(C.sex==="f"?"по самому узкому":"на уровне пупка"))+'</div>'
  +'<div id="fHipW">'+(C.sex==="f"?fld("fHip","Бёдра, см (по самому широкому месту)",C.hip,"98"):"")+'</div>'
  +'<div id="fatRes" style="display:flex;flex-direction:column;gap:14px"></div>';
 SX.f=mkSeg($("#fSex"),[["f","Женщина"],["m","Мужчина"]],C.sex,onSex);
 [["fH","h"],["fW","w"],["fNeck","neck"],["fWaist","waist"],["fHip","hip"]].forEach(function(q){bind(q[0],q[1],fatRes)});fatRes()}
function fatRes(){var box=$("#fatRes");if(!box)return;
 var any=C.h===""||C.w===""||C.neck===""||C.waist===""||(C.sex==="f"&&C.hip==="");
 if(any){box.innerHTML='<p class="p-note">Введите рост, вес и замеры — результат появится здесь.</p>';return}
 var r=CALC.navy({sex:C.sex,h:C.h,w:C.w,neck:C.neck,waist:C.waist,hip:C.hip});
 if(!r.ok){box.innerHTML='<p class="p-err">'+esc(r.err)+'</p>';return}
 var rg=C.sex==="m"?[[2,6,"rgba(229,138,160,.5)"],[6,14,"rgba(79,184,116,.55)"],[14,25,"rgba(79,184,116,.3)"],[25,60,"rgba(229,138,160,.4)"]]:[[2,14,"rgba(229,138,160,.5)"],[14,21,"rgba(79,184,116,.55)"],[21,32,"rgba(79,184,116,.3)"],[32,60,"rgba(229,138,160,.4)"]];
 var sc=rg.map(function(x){return '<i style="left:'+((x[0]-2)/58*100)+'%;width:'+((x[1]-x[0])/58*100)+'%;background:'+x[2]+'"></i>'}).join("");
 var bmi=CALC.bmi(CALC.num(C.w),CALC.num(C.h)),age=CALC.num(C.age),ref=isFinite(age)&&age>=14?CALC.deur(r.sex,bmi,age):null,far=ref!=null&&Math.abs(ref-r.bf)>8;
 var lo=Math.max(2,r.bf-4),hi=Math.min(60,r.bf+4);
 box.innerHTML='<div class="p-big"><div class="s">Процент жира</div><div class="k">'+fi(r.bf)+'<small>%</small></div><div class="s">'+esc(r.cat)+(r.clamped?" · необычное значение, проверьте замеры":"")+'</div><div class="s m">Скорее всего: '+Math.round(lo)+'–'+Math.round(hi)+' % (замер может ошибаться на 3–4 %)</div>'
  +'<div class="p-scale">'+sc+'<span class="p-pin" id="fPin" style="left:'+((Math.max(2,Math.min(60,r.bf))-2)/58*100)+'%"></span></div>'
  +'<div class="p-tiles"><div class="p-t"><b>'+fi(r.fat)+'</b><small>жир, кг</small></div><div class="p-t"><b>'+fi(r.lean)+'</b><small>без жира, кг</small></div><div class="p-t"><b>'+fi(bmi)+'</b><small>ИМТ</small></div></div>'
  +(ref!=null?'<p class="p-note'+(far?' w':'')+'">Для сравнения, по росту, весу и возрасту: около '+fi(ref)+' %.'+(far?' Числа сильно расходятся — перемерьте шею и талию (лента ровно, без натяжения) в сантиметрах.':' Разница небольшая — замеры похожи на правду.')+'</p>':'')+'</div>'
  +'<div class="p-btns"><button class="cta go" id="bfSave">Сохранить % жира</button><button class="cta" id="bfCal">Учесть в калориях</button></div>'
  +'<p class="p-note">Для динамики важнее мерить одинаково — в одно время и в одном месте. Если жир «скачет» на 5 пунктов за неделю, это погрешность замера, а не потеря жира.</p>';
 $("#bfSave").onclick=function(){setP({bf:r.bf,neck:+C.neck,waist:+C.waist,hip:C.sex==="f"?+C.hip:null,sex:P().sex||C.sex});C.bf=String(r.bf);pulseAt($("#bfSave"),null,10);toast("Сохранено: "+fi(r.bf)+"% жира");renderSum();updSubs()};
 $("#bfCal").onclick=function(){C.bf=String(r.bf);C.fsel="kt";drawCal($("#calBody"));setAcc("#cCal",true);setTimeout(function(){$("#cCal").scrollIntoView({behavior:"smooth",block:"start"})},200)}}
/* ---------- обо мне ---------- */
function renderMe(){var p=P(),b=$("#meBody"),a=ageOf(p.birth);
 b.innerHTML='<div class="p-f"><label for="mName">Имя</label><input class="p-in" id="mName" maxlength="30" placeholder="Как к вам обращаться" value="'+esc(p.name||"")+'" autocomplete="given-name"></div>'
  +'<div class="p-f"><label>Пол</label><div class="p-seg" id="mSex"></div></div>'
  +'<div class="p-f"><label for="mBirth">Дата рождения'+(a!=null?" · "+plural(a,["год","года","лет"]):"")+'</label><input class="p-in" type="date" id="mBirth" min="1920-01-01" max="'+TODAY_ISO+'" value="'+esc(p.birth||"")+'"></div>'
  +'<div class="p-row"><div class="p-f"><label>Рост</label><div class="p-stp"><button data-d="-1" aria-label="Меньше">−</button><input id="mH" inputmode="numeric" value="'+(p.h||"")+'" placeholder="—"><em>см</em><button data-d="1" aria-label="Больше">+</button></div></div>'
  +'<div class="p-f"><label>Вес</label><div class="p-stp"><button data-d="-.1" aria-label="Меньше">−</button><input id="mW" inputmode="decimal" value="'+(lastW()||p.w?fk(lastW()||p.w):"")+'" placeholder="—"><em>кг</em><button data-d=".1" aria-label="Больше">+</button></div></div></div>'
  +'<div class="p-f"><label>Оборудование</label><div id="mEq"></div></div>'
  +'<div class="p-sub">Тренировки</div>'
  +'<div class="p-f"><label>Опыт</label><div class="p-seg" id="mLvl"></div></div>'
  +'<div class="p-f"><label>Цель</label><div id="mGoal"></div></div>'
  +'<div class="p-f"><label>Где тренируетесь</label><div class="p-seg" id="mWhere"></div></div>'
  +'<div class="p-f"><label>Ограничения здоровья</label><button class="p-rxb" id="mRx"></button></div>';
 var nm=$("#mName");nm.onchange=nm.onblur=function(){var v=nm.value.trim().slice(0,30);if(v!==(P().name||"")){setP({name:v});renderSum();updSubs()}};nm.onkeydown=function(e){if(e.key==="Enter")nm.blur()};
 mkSeg($("#mSex"),[["f","Женщина"],["m","Мужчина"]],p.sex==="m"?"m":"f",function(v){setP({sex:v});onSex(v);renderSum();updSubs()});
 var bd=$("#mBirth");bd.onchange=function(){var v=bd.value,ag=ageOf(v);if(v&&(ag==null||ag<14||ag>100)){bd.classList.add("bad");toast("Возраст от 14 до 100 лет");return}bd.classList.remove("bad");setP({birth:v||null});C.age=ag!=null?String(ag):"";renderMe();renderSum();if($("#cAge")){$("#cAge").value=C.age;calcRes()}fatRes();updSubs()};
 var H=$("#mH"),W=$("#mW");
 function saveH(v){v=Math.round(v);if(!(v>=120&&v<=230)){H.classList.add("bad");toast("Рост от 120 до 230 см");H.value=P().h||"";return}H.classList.remove("bad");H.value=v;setP({h:v});C.h=String(v);renderSum();updSubs();if($("#cH"))$("#cH").value=v;if($("#fH"))$("#fH").value=v;calcRes();fatRes()}
 function saveW(v){v=Math.round(v*10)/10;if(!(v>=30&&v<=250)){W.classList.add("bad");toast("Вес от 30 до 250 кг");W.value=lastW()?fk(lastW()):"";return}W.classList.remove("bad");W.value=fk(v);setP({w:v});wtSet(v);C.w=String(v);renderSum();updSubs();["cW","fW"].forEach(function(id){if($("#"+id))$("#"+id).value=fk(v).replace(",",".")});calcRes();fatRes()}
 H.onchange=function(){var v=num(H.value);saveH(isFinite(v)?v:NaN)};W.onchange=function(){var v=num(W.value);saveW(isFinite(v)?v:NaN)};
 [H,W].forEach(function(inp){inp.onkeydown=function(e){if(e.key==="Enter")inp.blur()}});
 $$(".p-stp button",b).forEach(function(bt){bt.onclick=function(){var inp=bt.parentNode.querySelector("input"),d=+bt.dataset.d,cur=num(inp.value);if(!isFinite(cur))cur=inp===H?168:62;(inp===H?saveH:saveW)(cur+d);pulseAt(bt,"rgba(23,23,26,.35)",5)}});
 mkSeg($("#mLvl"),[["1","Новичок"],["2","Средний"],["3","Продвинутый"]],String(p.lvl||1),function(v){setP({lvl:+v})});
 chips($("#mGoal"),GOALS,function(k){return P().goal===k},false,function(k){setP({goal:P().goal===k?null:k});renderSum()});
 mkSeg($("#mWhere"),[["gym","Зал"],["home","Дома"],["both","Везде"]],p.where||"home",function(v){setP({where:v})});
 var eq=p.eq||[];chips($("#mEq"),EQS,function(k){return (P().eq||[]).indexOf(k)>=0},true,function(k){var e=(P().eq||[]).slice(),i=e.indexOf(k);if(i>=0){if(k==="body"&&e.length===1)return;e.splice(i,1)}else e.push(k);if(e.indexOf("body")<0)e.push("body");setP({eq:e})});
 rxSum();$("#mRx").onclick=function(){buzz(6);drawRx();openSheet("shRx")}}
/* ---------- ограничения здоровья ---------- */
function rxSum(){var b=$("#mRx");if(!b)return;var p=P(),k=RX.keysOf(p),pr=RX.pregOf(p),bits=[];
 if(k.length)bits.push(plural(k.length,["состояние","состояния","состояний"]));if(pr)bits.push(pr<4?"беременность, "+pr+" триместр":"беременность, срок не указан");
 var names=k.slice(0,3).map(function(c){return RX.BY[c][2]}).join(", ")+(k.length>3?" и ещё "+(k.length-3):"");
 b.innerHTML='<span>'+(bits.length?esc(bits.join(" · ")):"Нет ограничений")+'<small>'+(k.length?esc(names):"Укажите, что беречь — подбор исключит неподходящие упражнения")+'</small></span><svg class="i" style="width:18px;height:18px;color:var(--ink3);flex:none"><use href="#chev"/></svg>'}
function rxConflicts(){var pg=FS.get("progs"),n=0,by=FCATBY(),p=P();if(!pg||!Array.isArray(pg.programs))return 0;pg.programs.forEach(function(r){(r.workouts||[]).forEach(function(w){(w.ex||[]).forEach(function(x){var c=by[x.id];if(c&&RX.status(c,p)===2)n++})})});return n}
function rxSave(cx,preg){var p=P();setP({cx:cx,preg:preg,cau:RX.cauOf({cx:cx,preg:preg,cau:p.cau})});rxSum();updSubs();drawRxNote()}
function drawRxNote(){var el=$("#rxNote");if(!el)return;var n=rxConflicts();el.textContent=n?"Не рекомендованных при этом упражнений в ваших программах: "+n+". Они помечены в «Тренировках», там же их можно заменить.":"Подбор программ и библиотека будут учитывать эти пометки."}
function drawRx(){var p=P(),sel=RX.keysOf(p),pr=RX.pregOf(p),b=$("#rxBody"),men=p.sex==="m",hasW=sel.some(function(k){return RX.BY[k]&&RX.BY[k][3]==="wom"}),GR=RX.GROUPS.filter(function(g){return !(men&&g[0]==="wom"&&!hasW)}),showPreg=!men||pr>0;
 b.innerHTML='<h3>Ограничения здоровья</h3><p class="p-note">Отметьте то, что есть. Упражнения, которые при этом не рекомендованы, не попадут в подбор программ и будут скрыты в библиотеке; «с осторожностью» — помечаются. Это не заменяет врача.</p>'
  +(showPreg?'<div class="p-f"><label>Беременность</label><div id="rxPreg" class="p-chips"></div></div>':'')
  +GR.map(function(g){var n=RX.CONDS.filter(function(c){return c[3]===g[0]&&sel.indexOf(c[0])>=0}).length;
   return '<div class="p-acc p-rxg'+(n?" open":"")+'" data-g="'+g[0]+'"><button class="p-ah"><span class="t"><h4>'+esc(g[1])+'</h4><small>'+(n?"отмечено: "+n:"ничего не отмечено")+'</small></span><svg class="i chev"><use href="#chev"/></svg></button><div class="p-ab"><div class="p-abi"><div class="in"><div class="p-chips" id="rxg-'+g[0]+'"></div></div></div></div></div>'}).join("")
  +'<p class="p-rxn" id="rxNote"></p><div class="fa"><button class="cta go" id="rxOk">Готово</button></div>';
 if(showPreg)chips($("#rxPreg"),[[0,"Нет"],[1,"1 триместр"],[2,"2 триместр"],[3,"3 триместр"],[4,"Срок не знаю"]],function(k){return RX.pregOf(P())===+k},false,function(k,bt){var v=+k;if(RX.pregOf(P())===v&&v!==0){v=0}rxSave(RX.keysOf(P()),v);$$(".p-chp",$("#rxPreg")).forEach(function(x,i){x.classList.toggle("on",i===v)})});
 GR.forEach(function(g){var opts=RX.CONDS.filter(function(c){return c[3]===g[0]}).map(function(c){return [c[0],c[2]]});
  chips($("#rxg-"+g[0]),opts,function(k){return RX.keysOf(P()).indexOf(k)>=0},true,function(k,bt){var cur=RX.keysOf(P()).slice(),i=cur.indexOf(k);if(i>=0)cur.splice(i,1);else cur.push(k);rxSave(cur,RX.pregOf(P()));bt.classList.toggle("on",cur.indexOf(k)>=0);
   var box=bt.closest(".p-rxg"),n=$$(".p-chp.on",box).length,sm=$(".p-ah small",box);if(sm)sm.textContent=n?"отмечено: "+n:"ничего не отмечено"})});
 $$(".p-rxg .p-ah",b).forEach(function(h){h.onclick=function(){var g=h.closest(".p-rxg");g.classList.toggle("open");h.setAttribute("aria-expanded",g.classList.contains("open"));buzz(5)}});
 $("#rxOk").onclick=function(){closeLayers();var n=rxConflicts();if(n)toast("В программах есть упражнения с пометкой «не рекомендуется»: "+n,"Открыть",function(){send({t:"tab",to:"work"})})};
 drawRxNote()}
/* ---------- расписание ---------- */
function planObj(){var pl=FS.get("plan"),pg=FS.get("progs");if(!pl||typeof pl!=="object"||Array.isArray(pl))pl={days:[],mins:45,time:"19:00",prog:pg&&pg.programs&&pg.programs[0]?pg.programs[0].id:null};if(!Array.isArray(pl.days))pl.days=[];return pl}
function renderPlan(){var pl=planObj(),set=FS.get("set")||{},on=set.wRem!==false,b=$("#planBody");
 b.innerHTML='<div class="p-f"><label>Дни тренировок</label><div class="p-days" id="pDays"></div><p class="p-note" id="pDN"></p></div>'
  +'<div class="p-row"><div class="p-f"><label for="pTime">Время</label><input class="p-in" type="time" id="pTime" value="'+esc(pl.time||"19:00")+'"></div><div class="p-f"><label>Длительность для подбора</label><div class="p-seg" id="pMins"></div></div></div>'
  +'<div class="p-sw"><div><b>Напоминать о тренировке</b><span>Один раз в день тренировки, без повторов</span></div><button class="p-tg'+(on?" on":"")+'" id="pRem" aria-label="Напоминания"><i></i></button></div>'
  +'<div class="p-btns"><button class="cta" id="pAuto">Подобрать программу заново</button></div>';
 var d=$("#pDays");DAYS.forEach(function(n,i){var bt=document.createElement("button");bt.textContent=n;bt.className=pl.days.indexOf(i)>=0?"on":"";bt.onclick=function(){var p=planObj(),ix=p.days.indexOf(i);if(ix>=0){if(p.days.length<=1){toast("Оставьте хотя бы один день");return}p.days.splice(ix,1)}else{p.days.push(i);p.days.sort()}FS.set("plan",p);bt.classList.toggle("on",p.days.indexOf(i)>=0);if(bt.classList.contains("on"))pulseAt(bt,"rgba(23,23,26,.35)",6);dn(p)};d.appendChild(bt)});
 function dn(p){$("#pDN").textContent=p.days.length?plural(p.days.length,["тренировка","тренировки","тренировок"])+" в неделю · "+p.days.map(function(i){return DAYS[i]}).join(", "):"Дни не выбраны"}dn(pl);
 $("#pTime").onchange=function(){var v=$("#pTime").value;if(!/^\d\d:\d\d$/.test(v))return;var p=planObj();p.time=v;FS.set("plan",p);if((FS.get("set")||{}).wRem!==false)setP({rem:v});toast("Время сохранено: "+v)};
 mkSeg($("#pMins"),[["20","20"],["30","30"],["45","45"],["60","60 мин"]],String(pl.mins||45),function(v){var p=planObj();p.mins=+v;FS.set("plan",p)});
 toggle($("#pRem"),on,function(v){var s=FS.get("set")||{};s.wRem=v;FS.set("set",s);setP({rem:v?(planObj().time||"19:00"):"none"});toast(v?"Напоминания включены":"Напоминания выключены")});
 $("#pAuto").onclick=function(){var p=P(),pl2=planObj(),r=GEN.starter(p,{days:Math.max(1,pl2.days.length),mins:pl2.mins||45,time:pl2.time||"19:00"});
  if(!r||!r.progs||!r.progs.programs||!r.progs.programs[0]||!r.progs.programs[0].workouts.length){toast("Каталог пуст — соберите тренировку вручную");return}
  var cur=FS.get("progs")||{programs:[]};cur.programs.push(r.progs.programs[0]);FS.set("progs",cur);pl2.prog=r.progs.programs[0].id;FS.set("plan",pl2);pulseAt($("#pAuto"),"var(--green)",10);toast("Новая программа добавлена в «Тренировки»","Открыть",function(){send({t:"tab",to:"work"})})}}
/* ---------- тренер ---------- */
function renderCoach(){var s=FS.get("sync")||{},p=P(),co=p.coach||{},b=$("#coachBody");
 if(s.role==="coach"){var n=Object.keys(s.clients||{}).length;
  b.innerHTML='<p class="p-lead">Вы — тренер. Клиенты вводят этот код в своём профиле и сразу появляются у вас во вкладке «Тренировки → Клиенты».</p><div class="p-code">'+esc(s.code||"······")+'</div><div class="p-st"><i class="'+(s.status==="ok"?"ok":"")+'"></i>'+esc(syncTxt(s))+' · клиентов: '+n+'</div><div class="p-btns"><button class="cta" id="cpCode">Скопировать код</button><button class="cta go" id="cpGo">Открыть клиентов</button></div>';
  $("#cpCode").onclick=function(){copyTxt(s.code||"",function(){pulseAt($("#cpCode"),"var(--green)",8);toast("Код скопирован")})};$("#cpGo").onclick=function(){send({t:"tab",to:"work"});send({t:"sub",i:2})};return}
 if(co.code){b.innerHTML='<div class="p-st"><i class="'+(s.status==="ok"?"ok":"")+'"></i>'+esc(syncTxt(s))+'</div><p class="p-lead">Подключено к тренеру'+(co.name?" · "+esc(co.name):"")+'. Тренер видит ваши тренировки, вес и профиль и может написать вам.</p><div class="p-code" style="font-size:24px">'+esc(co.code)+'</div><div class="p-btns"><button class="cta" id="cpOff">Отключиться</button></div>';
  $("#cpOff").onclick=function(){setP({coach:{mode:"self",code:"",name:""}});send({t:"coach-unlink"});toast("Вы отключены от тренера");renderCoach()};return}
 b.innerHTML='<p class="p-lead">Если вы занимаетесь с тренером — введите его код. Приложение работает и без него.</p><div class="p-f"><label for="cpIn">Код тренера</label><input class="p-in" id="cpIn" autocapitalize="characters" autocomplete="off" spellcheck="false" placeholder="например, A7K9Q2" maxlength="12"></div><div class="p-btns"><button class="cta go" id="cpOn">Подключиться</button></div><p class="p-err" id="cpErr"></p>';
 $("#cpOn").onclick=function(){var v=$("#cpIn").value.trim().toUpperCase().replace(/[^A-Z0-9]/g,"");if(v.length<4){$("#cpErr").textContent="Код — от 4 символов";return}$("#cpErr").textContent="";setP({coach:{mode:"has",code:v,name:""}});send({t:"coach-link",code:v});pulseAt($("#cpOn"),"var(--green)",10);toast("Код сохранён. Подключаем…");renderCoach()}}
function syncTxt(s){return {ok:"На связи",offline:"Нет связи — данные сохранены на телефоне",wait:"Проверяем код…",badcode:"Такой код не найден — проверьте у тренера",nolink:"Облачная связь недоступна в этом окне"}[s.status]||"Данные сохраняются на телефоне"}
/* ---------- данные ---------- */
function copyTxt(t,ok){function fb(){var ta=document.createElement("textarea");ta.value=t;ta.style.cssText="position:fixed;opacity:0";document.body.appendChild(ta);ta.select();try{document.execCommand("copy");ok&&ok()}catch(e){toast("Не удалось скопировать")}ta.remove()}
 try{navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(t).then(function(){ok&&ok()},fb):fb()}catch(e){fb()}}
function renderData(){var b=$("#dataBody"),demo=FS.get("demo")===1,per=FS.persistent();
 b.innerHTML=(per?'':'<p class="p-note w">В этом окне браузер не разрешает хранить данные надолго: после закрытия они могут пропасть. Сделайте копию ниже или добавьте приложение на экран «Домой».</p>')
  +'<div class="p-hint"><svg class="i"><use href="#download"/></svg><span>Приложение на телефон: откройте ссылку в Safari, нажмите «Поделиться» → «На экран “Домой”». Данные хранятся на вашем телефоне.</span></div>'
  +'<div class="p-btns"><button class="cta" id="dCopy">Скопировать копию данных</button><button class="cta" id="dImp">Восстановить из копии</button></div>'
  +'<div class="p-btns"><button class="cta" id="dRedo">Ответить на вопросы заново</button><button class="cta" id="dDemo">'+(demo?"Убрать демо-данные":"Показать на примере")+'</button></div>'
  +'<button class="p-lnk p-danger" id="dWipe">Стереть все данные на этом телефоне</button>';
 $("#dCopy").onclick=function(){var s=JSON.stringify(FS.dump());copyTxt(s,function(){pulseAt($("#dCopy"),"var(--green)",8);toast("Копия скопирована ("+Math.round(s.length/1024)+" КБ). Вставьте её в заметки")})};
 $("#dImp").onclick=function(){$("#impErr").textContent="";openSheet("shImp")};
 $("#impNo").onclick=closeLayers;
 $("#impOk").onclick=function(){var t=$("#impTa").value.trim();try{var o=JSON.parse(t);if(!o||typeof o!=="object"||(o.profile===undefined&&o.hist===undefined&&o.progs===undefined))throw 0;FS.load(o);closeLayers();toast("Данные восстановлены");send({t:"reload"})}catch(e){$("#impErr").textContent="Это не похоже на копию Forma. Скопируйте текст целиком."}};
 $("#dRedo").onclick=function(){send({t:"redo"})};
 $("#dDemo").onclick=function(){if(FS.get("demo")===1){removeDemo();toast("Демо-данные убраны")}else{if(!addDemo()){toast("Сначала создайте программу в «Тренировках»");return}toast("Добавлена история за 5 недель — для примера","Убрать",function(){removeDemo()})}renderData();renderSum()};
 $("#dWipe").onclick=function(){openSheet("shWipe")};$("#wipeNo").onclick=closeLayers;
 $("#wipeOk").onclick=function(){closeLayers();wiped=true;FS.wipe();send({t:"reload"})}}
/* демо-данные (помечаются demo:1 — удаляются без следа) */
function addDemo(){var pg=FS.get("progs"),pl=planObj();if(!pg||!pg.programs||!pg.programs.length)return false;
 var prog=pg.programs.filter(function(x){return x.id===pl.prog})[0]||pg.programs[0];if(!prog||!prog.workouts||!prog.workouts.length)return false;
 var days=pl.days&&pl.days.length?pl.days:[0,2,4],hist=(FS.get("hist")||[]).slice(),wt=(FS.get("wt")||[]).slice(),k=0,w0=lastW()||P().w||64;
 for(var back=35;back>=1;back--){var d=addDays(TODAY_ISO,-back);
  if(days.indexOf(dowOf(d))<0||(back%9===0))continue;var wk=prog.workouts[k%prog.workouts.length];k++;
  if(hist.some(function(h){return h.d===d}))continue;
  var prog_=1+(35-back)/35*0.12;
  var ex=wk.ex.map(function(x){var base=x.sets&&x.sets[0]||{v:10,w:"",t:30};return {id:x.id,n:(FCATBY()[x.id]||{}).n||x.id,mode:x.mode,sets:x.sets.map(function(s){var ww=(+s.w>0)?Math.round(+s.w*prog_*2)/2:s.w;return {v:s.v,w:ww===0?"":ww,t:s.t,rest:s.rest||60,done:true}}),eff:3+(k%2),my:"",pain:false}});
  var vol=0;ex.forEach(function(x){x.sets.forEach(function(s){vol+=(+s.w>0?+s.w:0)*(+s.v||0)})});
  hist.push({d:d,k:wk.key||wk.id,wn:wk.name,pn:prog.name,t:pl.time||"19:00",sec:(pl.mins||45)*60,kcal:Math.round((pl.mins||45)*6.5),pct:100,vol:Math.round(vol),g:[],tn:"",ex:ex,demo:1})}
 for(var i=35;i>=0;i-=7){var dd=addDays(TODAY_ISO,-i);if(!wt.some(function(x){return x.d===dd}))wt.push({d:dd,v:Math.round((w0+(i/35)*1.1)*10)/10,demo:1})}
 hist.sort(function(a,b){return a.d<b.d?-1:1});wt.sort(function(a,b){return a.d<b.d?-1:1});
 FS.set("hist",hist);FS.set("wt",wt);FS.set("demo",1);reloadHist();return true}
function FCATBY(){if(FCATBY.m)return FCATBY.m;var m={},c=(window.parent&&window.parent.FCAT)||window.FCAT||[];c.forEach(function(x){m[x.id]=x});return FCATBY.m=m}
function removeDemo(){FS.set("hist",(FS.get("hist")||[]).filter(function(h){return !h.demo}));FS.set("wt",(FS.get("wt")||[]).filter(function(x){return !x.demo}));FS.set("demo",0);reloadHist()}
/* ---------- запуск ---------- */
function remGet(){var s=FS.get("set")||{},r=s.rem&&typeof s.rem==="object"?s.rem:{};return {w:s.wRem===false?"off":(r.w==="weekly"?"weekly":"daily"),f:r.f!=="off"?"on":"off",mk:r.mk!=="off"?"on":"off"}}
function remPut(k,v){var s=FS.get("set");if(!s||typeof s!=="object"||Array.isArray(s))s={wRem:true,notif:[]};s.rem=s.rem&&typeof s.rem==="object"?s.rem:{};if(k==="w"){if(v==="off")s.wRem=false;else{s.wRem=true;s.rem.w=v}}else s.rem[k]=v;FS.set("set",s)}
function renderRem(){var b=$("#remBody");if(!b)return;var g=remGet();
 b.innerHTML='<div class="p-f"><label>Взвешивание</label><div class="p-seg" id="rmW"></div><p class="p-note">Напоминание исчезает, как только вы внесли вес за сегодня</p></div><div class="p-f"><label>Плашка «Питание»</label><div class="p-seg" id="rmF"></div></div><div class="p-f"><label>Плашка «Собрать свою тренировку»</label><div class="p-seg" id="rmM"></div><p class="p-note">Плашки можно закрыть крестиком прямо на Главной, а здесь отключить совсем</p></div>';
 mkSeg($("#rmW"),[["daily","Каждый день"],["weekly","Раз в неделю"],["off","Выключить"]],g.w,function(v){remPut("w",v);toast(v==="off"?"Напоминания о весе выключены":v==="weekly"?"Напомним о весе раз в неделю":"Напомним о весе каждый день")});
 mkSeg($("#rmF"),[["on","Показывать"],["off","Скрыть"]],g.f,function(v){remPut("f",v)});
 mkSeg($("#rmM"),[["on","Показывать"],["off","Скрыть"]],g.mk,function(v){remPut("mk",v)})}
function all(){renderSum();renderMe();renderCalc();renderPlan();renderRem();renderCoach();renderData()}
["#cMe","#cCal","#cFat"].forEach(acc);
$("#fab").onclick=function(){buzz(8);send({t:"open",nw:1})};
$("#scrim").onclick=closeLayers;
/* при перезагрузке экранов вкладка «Питание» успевает дописать свои данные на выгрузке: после стирания повторяем стирание, когда она уже выгружена */
var wiped=false;addEventListener("pagehide",function(){if(wiped){try{FS.wipe()}catch(e){}}});
$("#cSum").addEventListener("click",function(e){var g=e.target.closest("[data-go]");if(g){buzz(6);send({t:"tab",to:g.dataset.go})}});
var busy=false;function refresh(){var ae=document.activeElement;if(ae&&/INPUT|TEXTAREA/.test(ae.tagName)&&$("#scroll").contains(ae))return;reloadHist();C.age=C.h=C.w=C.bf="";C.neck=C.waist=C.hip="";seeded=false;all()}
FS.on(function(k){if(k==="profile"||k==="wt"||k==="plan"||k==="sync"||k==="hist"||k==="set"||k==="demo"||k==="progs"){var ae=document.activeElement;if(ae&&/INPUT|TEXTAREA/.test(ae.tagName))return;clearTimeout(refresh._t);refresh._t=setTimeout(refresh,60)}});
addEventListener("message",function(e){var m=e.data;if(!m||m.f!=="forma"||m.from==="prof")return;if(m.t==="show"){refresh();$("#scroll").scrollTo({top:0});setTimeout(tabsPlace,30)}});
all();send({t:"hello"});
})();
var _ng=document.getElementById("nutGo");if(_ng)_ng.onclick=function(){buzz(6);send({t:"tab",to:"nutr"})};



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
