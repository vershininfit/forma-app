
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
function send(m){m.f="forma";m.from=PAGE;try{var T=window.LIBEMB?parent.parent:parent;T!==window&&T.postMessage(m,"*")}catch(e){}}
function toast(t,act,fn){var e=$("#toast");if(!e)return;e.innerHTML="";e.classList.toggle("act",!!act);var s=document.createElement("span");s.textContent=t;e.appendChild(s);if(act){var b=document.createElement("button");b.className="tact";b.textContent=act;b.onclick=function(){e.classList.remove("on");fn&&fn()};e.appendChild(b)}e.classList.add("on");clearTimeout(toast._t);toast._t=setTimeout(function(){e.classList.remove("on")},act?4200:2600)}
/* нижнее меню */
var TABS=[["home","Главная","home"],["dumb","Тренировки","work"],["food","Питание","nutr"],["chart","Прогресс","prog"],["user","Профиль","prof"]];
function initTabs(active){var tb=$("#tabbar"),ind=document.createElement("div");ind.className="ind";tb.appendChild(ind);var btns=[];
 TABS.forEach(function(t,i){var b=document.createElement("button");b.className="tab"+(t[2]===active?" on":"");b.setAttribute("aria-label",t[1]);b.innerHTML=ic(t[0])+'<span class="lbl">'+t[1]+'</span>';
  b.onclick=function(){if(t[2]===active){var s=$("#scroll");s&&s.scrollTo({top:0,behavior:"smooth"});return}buzz(6);send({t:"tab",to:t[2]})};tb.appendChild(b);btns.push(b)});
 function place(){var b=btns[TABS.map(function(t){return t[2]}).indexOf(active)];if(!b)return;ind.style.transform="translateX("+b.offsetLeft+"px)";ind.style.width=b.offsetWidth+"px"}
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
window.PAGE="lib";
var CAT=(function(){try{var w=window;for(var i=0;i<4;i++){var p=w.parent;if(!p||p===w)break;void p.document;w=p;if(w.FCAT)return w.FCAT}}catch(e){}return window.FCAT||[]})();
var EQN={trx:"TRX / петли",dumbbell:"Гантели",barbell:"Штанга",machine:"Тренажёры",cable:"Блоки и кроссовер",band:"Резинки",body:"Свой вес",kettlebell:"Гири",other:"Прочий инвентарь",cond:"Кондиция и прыжки",mob:"Мобильность",land:"Лэндмайн"};
var EQS={trx:"TRX",dumbbell:"Гантели",barbell:"Штанга",machine:"Тренажёры",cable:"Блоки",band:"Резинки",body:"Свой вес",kettlebell:"Гири",other:"Прочее",cond:"Кондиция",mob:"Мобильность",land:"Лэндмайн"};
var EQORD=["trx","dumbbell","barbell","machine","cable","band","body","kettlebell","other","cond","mob","land"];
var MUS=["Ягодицы","Передняя поверхность бедра","Задняя поверхность бедра","Мышцы голени","Мышцы груди","Мышцы спины","Плечи","Бицепс","Трицепс","Предплечье","Мышцы кора"];
var MUSS={"Ягодицы":"Ягодицы","Передняя поверхность бедра":"Квадрицепс","Задняя поверхность бедра":"Бицепс бедра","Мышцы голени":"Голень","Мышцы груди":"Грудь","Мышцы спины":"Спина","Плечи":"Плечи","Бицепс":"Бицепс","Трицепс":"Трицепс","Предплечье":"Предплечье","Мышцы кора":"Кор"};
var LVN=["","начальный","средний","продвинутый"];
var POS=[["w","Разминка"],["m","Основная часть"],["c","Финишер"],["d","Заминка"]];
var LT=["Сила","Гипертрофия","Силовая выносливость","Мощность","Кондиция","Стабильность","Мобильность"];
var LTL={"Гипертрофия":"Рост мышц","Силовая выносливость":"Выносливость","Мощность":"Взрывная сила","Кондиция":"Тонус и форма","Стабильность":"Устойчивость"};function ltl(t){return LTL[t]||t}
var FMT=[["reps","Повторы"],["time","На время"]];
var FIELDS=[{k:"n",main:1},{k:"en",main:1},{k:"m",main:1},{k:"c"},{k:"inv"},{k:"sy"},{k:"pat"},{k:"lt"}];
var BYID={};CAT.forEach(function(c){BYID[c.id]=c});
var IX=null;function ix(){return IX||(IX=FZ.build(CAT,FIELDS))}
function prof(){return FS.get("profile")||{}}
function has(a,v){return Array.isArray(a)&&a.indexOf(v)>=0}
/* счётчики для листа фильтров */
var CNT={eq:{},m:{},lvl:{},pos:{},lt:{},fmt:{},uni:0,home:0};
CAT.forEach(function(c){CNT.eq[c.eq]=(CNT.eq[c.eq]||0)+1;CNT.m[c.m]=(CNT.m[c.m]||0)+1;CNT.lvl[c.lvl]=(CNT.lvl[c.lvl]||0)+1;
 String(c.pos||"").split("").forEach(function(p){CNT.pos[p]=(CNT.pos[p]||0)+1});
 LT.forEach(function(t){if(String(c.lt||"").indexOf(t)>=0)CNT.lt[t]=(CNT.lt[t]||0)+1});
 CNT.fmt[c.fmt]=(CNT.fmt[c.fmt]||0)+1;if(c.uni)CNT.uni++;if(c.hm==="b")CNT.home++});
var st={q:"",eqs:{},mus:{},lvl:{},place:null,pos:{},lt:{},fmt:{},uni:false,mine:false,cx:{},preg:0,hide:false,cxTouched:false,cgo:{},
 sel:{},open:null,shown:40,list:CAT.slice(),hidden:0,P:null,fd:0};
var tabsPlace=initTabs("lib");
function eqName(c){return EQS[c.eq]||c.c||""}
/* ---- ограничения: локальный выбор для подбора (начало = профиль) ---- */
function selKeys(){return Object.keys(st.cx).filter(function(k){return st.cx[k]})}
function hasSel(){return selKeys().length>0||st.preg>0}
function seedFromProfile(){var p=prof(),k=RX.keysOf(p);st.cx={};k.forEach(function(x){st.cx[x]=1});st.preg=RX.pregOf(p);st.hide=hasSel();st.cxTouched=false;
 RX.GROUPS.forEach(function(g){if(RX.CONDS.some(function(c){return c[3]===g[0]&&st.cx[c[0]]}))st.cgo[g[0]]=1})}
function effP(){return {cx:selKeys(),preg:st.preg}}
function selLabel(){var a=selKeys().map(function(k){return RX.BY[k]?RX.BY[k][2]:k});if(st.preg)a.push(st.preg===4?"Беременность":"Беременность, "+st.preg+" тр.");return a}
/* ---- мое оборудование ---- */
var LEGACY={dumb:"dumbbell",kb:"kettlebell",bar:"barbell",mach:"machine",mat:"body",more:"other"};
function mineEq(){var p=prof(),e=p.eq,arr=[];
 if(Array.isArray(e))arr=e;else if(e&&typeof e==="object")arr=Object.keys(e).filter(function(k){return e[k]}).map(function(k){return LEGACY[k]||k});
 if(p.where==="gym"&&!arr.length)return null;
 var ok={body:1,mob:1};arr.forEach(function(k){if(EQN[k])ok[k]=1});return ok}
function mineTxt(){var ok=mineEq();if(!ok)return "В зале доступно всё — фильтр ничего не скроет.";var a=EQORD.filter(function(k){return ok[k]&&k!=="mob"}).map(function(k){return EQS[k]});return "Ваш инвентарь: "+a.join(", ")+" и мобильность."}
/* ---- фильтрация ---- */
function hasAny(m){for(var k in m)if(m[k])return true;return false}
/* разговорные слова → слова каталога (запасной поиск, если по исходному запросу пусто) */
var ALIAS=[[/(^|\s)трх(?=\s|$)/gi,"$1trx"],[/греб[а-яё]*/gi,"тяга"]];
function alias(q){var r=q;ALIAS.forEach(function(a){r=r.replace(a[0],a[1])});return r}
function searchQ(qq){var r=FZ.search(ix(),qq);if(!r.length){var a=alias(qq);if(a!==qq)r=FZ.search(ix(),a)}return r}
function pass(c,F){
 if(F.E&&!F.E[c.eq])return false;
 if(F.ok&&!F.ok[c.eq])return false;
 if(F.M&&!F.M[c.m])return false;
 if(F.L&&!F.L[c.lvl])return false;
 if(F.home&&c.hm!=="b")return false;
 if(F.uni&&!c.uni)return false;
 if(F.Fm&&!F.Fm[c.fmt])return false;
 if(F.Po){var ps=String(c.pos||""),o=false;for(var k in F.Po)if(ps.indexOf(k)>=0){o=true;break}if(!o)return false}
 if(F.Lt){var l=String(c.lt||""),o2=false;for(var k2 in F.Lt)if(l.indexOf(k2)>=0){o2=true;break}if(!o2)return false}
 return true}
function sub(m){var o=null;for(var k in m)if(m[k]){o=o||{};o[k]=1}return o}
function nActive(){return (hasAny(st.eqs)?Object.keys(st.eqs).filter(function(k){return st.eqs[k]}).length:0)+Object.keys(st.mus).filter(function(k){return st.mus[k]}).length+Object.keys(st.lvl).filter(function(k){return st.lvl[k]}).length+Object.keys(st.pos).filter(function(k){return st.pos[k]}).length+Object.keys(st.lt).filter(function(k){return st.lt[k]}).length+Object.keys(st.fmt).filter(function(k){return st.fmt[k]}).length+(st.place==="home"?1:0)+(st.uni?1:0)+(st.mine?1:0)+(st.cxTouched&&hasSel()&&st.hide?1:0)}
function apply(){
 var t0=performance.now(),qq=st.q.trim(),base=qq?searchQ(qq):CAT;
 var F={E:sub(st.eqs),ok:st.mine?mineEq():null,M:sub(st.mus),L:sub(st.lvl),home:st.place==="home",uni:st.uni,Fm:sub(st.fmt),Po:sub(st.pos),Lt:sub(st.lt)};
 var P=effP(),useR=st.hide&&(P.cx.length>0||P.preg>0),out=[],hid=0,i,c;
 for(i=0;i<base.length;i++){c=base[i];if(!pass(c,F))continue;if(useR&&RX.status(c,P)===2){hid++;continue}out.push(c)}
 st.list=out;st.hidden=hid;st.P=(P.cx.length||P.preg)?P:null;st.shown=40;
 var n=nActive();$("#fnb").textContent=n;$("#fnb").classList.toggle("on",n>0);
 $("#rst").style.display=(n||qq||st.cxTouched)?"":"none";
 apply.ms=performance.now()-t0}
/* ---- строки ---- */
function pcOf(c){return c.pc&&c.pc.length?c.pc:(c.m?[[c.m,100]]:[])}
function barRows(c){return pcOf(c).map(function(r){return '<div class="r"><span>'+esc(MUSS[r[0]]||r[0])+'</span><div class="tk"><i data-w="'+(+r[1]||0)+'"></i></div><span class="v">'+(+r[1]||0)+'%</span></div>'}).join("")}
function badge(c){var P=st.P;if(!P)return "";var w=RX.why(c,P);if(!w.length)return "";var mx=w[0].sev,rs=w.filter(function(x){return x.sev===mx}).map(function(x){return x.t}),txt=rs.slice(0,2).join(", ")+(rs.length>2?" +"+(rs.length-2):"");
 return '<span class="xw"><span class="bdg c'+mx+'">'+(mx===2?"не рекомендуется":"осторожно")+'</span><em>'+esc(txt)+'</em></span>'}
function rowHtml(c,i,fresh){var sel=!!st.sel[c.id],op=st.open===c.id;
 return '<div class="xr'+(sel?" sel":"")+(op?" open":"")+(fresh?" nw":"")+'" data-id="'+esc(c.id)+'"><div class="xh" role="button" tabindex="0"><span class="xk" data-k aria-label="Выбрать">'+ic("check")+'</span><span class="xt"><b>'+esc(c.n)+'</b><span class="xs">'+esc([MUSS[c.m]||c.m,eqName(c),c.lvl?LVN[c.lvl]:""].filter(Boolean).join(" · "))+'</span>'+badge(c)+'</span><svg class="i xc"><use href="#chevd"/></svg></div><div class="xbd"><div class="xi-w">'+(op?bodyHtml(c):"")+'</div></div></div>'}
function posWords(c){var s=String(c.pos||"");return POS.filter(function(p){return s.indexOf(p[0])>=0}).map(function(p){return p[1]})}
function hitKeys(){var m={};RX.keysOf(prof()).forEach(function(k){m[k]=1});selKeys().forEach(function(k){m[k]=1});return m}
function pregHit(){return !!(RX.pregOf(prof())||st.preg)}
function restrHtml(c){var all=RX.all(c),hk=hitKeys(),h="",any=false,hp={cx:Object.keys(hk),preg:RX.pregOf(prof())||st.preg},w=hp.cx.length||hp.preg?RX.why(c,hp):[];
 if(w.length){[2,1].forEach(function(sev){var r=w.filter(function(x){return x.sev===sev}).map(function(x){return x.t});if(r.length)h+='<p class="pgl hit"><b>Для вас: '+(sev===2?"не рекомендуется":"осторожно")+'.</b> '+esc(r.join(", "))+'</p>'})}
 var g2="";
 [2,1].forEach(function(sev){var rows=all.filter(function(r){return r.sev===sev});if(!rows.length)return;
  g2+='<div class="rv"><div class="rt s'+sev+'">'+(sev===2?"Не рекомендуется при":"С осторожностью при")+'</div>';
  RX.GROUPS.forEach(function(g){var rr=rows.filter(function(r){return r.g===g[0]});if(!rr.length)return;
   g2+='<div class="rgp"><span class="gn">'+esc(g[1])+'</span><div class="rcxs">'+rr.map(function(r){var hit=hk[r.key];if(hit)any=true;return '<span class="rcx'+(hit?" hit"+sev:"")+'">'+esc(r.t)+'</span>'}).join("")+'</div></div>'});
  g2+='</div>'});
 if(g2){if(any)g2+='<p class="lg">Выделено то, что совпадает с вашими ограничениями.</p>';
  h+=all.length>4?'<div class="acw"><button class="ac sm" data-a="acc"><span>Все ограничения · '+all.length+'</span>'+ic("chevd")+'</button><div class="ab"><div><div class="ab-i" style="gap:0;padding-top:12px">'+g2+'</div></div></div></div>':g2}
 var pt=RX.pregTxt(c);if(pt){var z=String(c.pg||"");if(/^0+$/.test(z))pt="подходит на любом сроке";h+='<p class="pgl'+(pregHit()&&/[12]/.test(z)?" hit":"")+'" style="margin-top:8px"><b>Беременность.</b> '+esc(pt)+'</p>'}
 if(!h)h='<p class="errs">Особых ограничений для этого упражнения нет.</p>';
 return '<div><h5>Ограничения</h5>'+h+'</div>'}
function errList(s){var a=String(s||"").split(/\s*·\s*/).filter(Boolean);return a.length?'<ul class="el">'+a.map(function(x){return '<li>'+esc(x)+'</li>'}).join("")+'</ul>':""}
function recTxt(c){var r=String(c.rng||"");if(!r)return "";return /подход|×|\+|проход/.test(r)?r:(c.sets||3)+" × "+r}
function ytUrl(c){return "https://www.youtube.com/results?search_query="+encodeURIComponent((c.en||c.n)+" exercise technique")}
function bodyHtml(c){var h='<div class="xi">',tg=[];
 if(c.uni)tg.push('<span class="u">Односторонняя</span>');
 String(c.lt||"").split(/\s*\+\s*/).filter(Boolean).forEach(function(t){tg.push('<span>'+esc(ltl(t))+'</span>')});
 if(c.lvl)tg.push('<span>'+esc(LVN[c.lvl])+' уровень</span>');
 if(tg.length)h+='<div class="tags">'+tg.join("")+'</div>';
 if(c.pc||c.m)h+='<div><h5>Работа мышц</h5><div class="mb">'+barRows(c)+'</div>'+(c.sy?'<p class="errs" style="margin-top:8px">Помогают: '+esc(c.sy)+'</p>':'')+'</div>';
 h+=restrHtml(c);
 var kv="",pw=posWords(c);
 if(c.rng)kv+='<dt>Формат</dt><dd>'+esc(recTxt(c))+'</dd>';
 if(pw.length)kv+='<dt>Назначение</dt><dd>'+esc(pw.join(" · "))+'</dd>';
 if(c.pl)kv+='<dt>Где</dt><dd>'+esc(c.pl)+'</dd>';
 if(c.inv&&!/см\. название/i.test(c.inv))kv+='<dt>Инвентарь</dt><dd>'+esc(c.inv)+'</dd>';
 if(kv)h+='<dl class="kvg">'+kv+'</dl>';
 if(c.up||c.dn)h+='<div><h5>Прогрессия и регрессия</h5><div class="pr">'+(c.up?'<div><i>↑</i><span><b>Прогрессия.</b> '+esc(c.up)+'</span></div>':'')+(c.dn?'<div><i>↓</i><span><b>Регрессия.</b> '+esc(c.dn)+'</span></div>':'')+'</div></div>';
 var mb=c.mob&&c.mob!=="Не критична"&&c.mob!=="undefined"?c.mob:"";
 if(c.tech||c.err||mb){h+='<div class="acw"><button class="ac" data-a="acc"><span>Подробнее: техника и ошибки</span>'+ic("chevd")+'</button><div class="ab"><div><div class="ab-i">'
  +(c.tech?'<div><h5>Техника</h5><p class="tech">'+esc(c.tech)+'</p></div>':'')
  +(c.err?'<div><h5>Частые ошибки</h5>'+errList(c.err)+'</div>':'')
  +(mb?'<div><h5>Предусловия по мобильности</h5><p class="errs">'+esc(mb)+'</p></div>':'')+'</div></div></div></div>'}
 h+='<a class="vid" href="'+esc(ytUrl(c))+'" target="_blank" rel="noopener"><span class="pl">'+ic("play")+'</span><small>Найти разбор техники в видео</small></a>';
 h+='<div class="xa"><button class="cta go" data-a="add">Добавить в тренировку</button><button class="cta rg" data-a="sel">'+selTxt(!!st.sel[c.id])+'</button></div>';
 return h+'</div>'}
function selTxt(on){return on?"Снять отметку":"Выбрать несколько"}
function plr(n){return plural(n,["упражнение","упражнения","упражнений"])}
function emptyHtml(){var b="",q=st.q.trim(),n=nActive();
 var tt=q&&!n&&!st.hidden?"Ничего не нашли по «"+esc(q)+"»":"Ничего не нашли при выбранных фильтрах";
 var sp=st.hidden>0?"Часть упражнений скрыта из-за ваших ограничений ("+st.hidden+"). Можно показать их с пометками.":"Ослабьте фильтр или попробуйте другое слово — поиск понимает окончания и опечатки.";
 if(st.hidden>0)b+='<button class="cta" data-e="show">Показать скрытые · '+st.hidden+'</button>';
 if(n||st.cxTouched)b+='<button class="cta" data-e="flt">Сбросить фильтры</button>';
 if(q)b+='<button class="cta" data-e="q">Сбросить поиск</button>';
 if(!b)b='<button class="cta" data-e="flt">Показать всё</button>';
 return '<div class="empty3"><b>'+tt+'</b><span>'+sp+'</span><div class="eb">'+b+'</div></div>'}
function infoRender(){var el=$("#rinfo"),on=hasSel(),lb=selLabel();
 if(!on){el.classList.remove("on");el.innerHTML="";return}
 var nm=lb.slice(0,2).join(", ")+(lb.length>2?" и ещё "+(lb.length-2):"");
 el.innerHTML=(st.hide?'<span>Учитываем: <b>'+esc(nm)+'</b>'+(st.hidden?' · скрыто '+st.hidden:'')+'</span><button id="rinb">Показать все</button>':'<span>Ограничения не скрываются: <b>'+esc(nm)+'</b>. Неподходящее помечено.</span><button id="rinb">Скрыть</button>');
 el.classList.add("on");$("#rinb").onclick=function(){buzz(6);st.hide=!st.hide;st.cxTouched=true;apply();st.open=null;renderList(true)}}
var io=null,RM=false;try{RM=!!(window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches)}catch(e){}
/* смена списка — общий swapPane из common.js: старое уходит 160ms, новое входит .45s (opacity + translateY 8→0 + blur 4→0) */
function pswap(el,fn,mode){if(mode===2&&!RM)swapPane(el,fn,{out:true});else{fn();if(!RM&&mode===1&&el.animate)el.animate([{opacity:0,transform:"translateY(8px)",filter:"blur(4px)"},{opacity:1,transform:"none",filter:"blur(0)"}],{duration:450,easing:"cubic-bezier(.32,.72,0,1)"})}}
var listDrawn=false;
function renderList(anim){var q=st.q.trim(),L0=st.list;
 $("#lcnt").textContent=(q||nActive()||st.cxTouched||st.hidden)?(nActive()||st.cxTouched||st.hidden?"Подобрано по фильтрам":"Результаты поиска"):"Все упражнения · "+CAT.length;
 $("#rc").textContent=!L0.length?"":((q||nActive()||st.cxTouched||st.hidden)?plr(L0.length)+" из "+CAT.length:"Откройте упражнение или отметьте кружком");infoRender();
 pswap($("#lpane"),function(){var L=st.list,show=L.slice(0,st.shown);
  if(io){io.disconnect()}
  if(!L.length){$("#ll").innerHTML=emptyHtml();$("#mw").innerHTML="";return}
  $("#ll").innerHTML=show.map(function(c,i){return rowHtml(c,i)}).join("");
  $("#mw").innerHTML=L.length>show.length?'<button class="cta more" id="more" style="width:100%">Показать ещё '+Math.min(40,L.length-show.length)+'</button>':"";
  var m=$("#more");if(m){m.onclick=function(){loadMore()};
   if("IntersectionObserver" in window){io=new IntersectionObserver(function(es){if(es[0].isIntersecting)loadMore()},{root:$("#scroll"),rootMargin:"0px 0px 300px 0px"});io.observe(m)}}},listDrawn?(anim?2:0):1);listDrawn=true}
function loadMore(){var m=$("#more");if(!m)return;var from=st.shown;if(from>=st.list.length){m.remove();return}buzz(6);st.shown+=40;
 var add=st.list.slice(from,st.shown);$("#ll").insertAdjacentHTML("beforeend",add.map(function(c,i){return rowHtml(c,i,true)}).join(""));
 if(st.shown>=st.list.length){m.remove();if(io)io.disconnect()}else m.textContent="Показать ещё "+Math.min(40,st.list.length-st.shown)}
$("#ll").addEventListener("click",function(e){
 var eb=e.target.closest("[data-e]");if(eb){buzz(6);var k=eb.dataset.e;if(k==="show"){st.hide=false;st.cxTouched=true}else if(k==="q"){q.value="";clr.classList.remove("on");st.q=""}else resetFilters();apply();drawQ();renderList(true);return}
 var row=e.target.closest(".xr");if(!row)return;var id=row.dataset.id,c=BYID[id];
 if(e.target.closest("[data-k]")){e.stopPropagation();toggleSel(id,row);return}
 var a=e.target.closest("[data-a]");if(a){if(a.dataset.a==="acc"){var w=a.closest(".acw");w.classList.toggle("open");buzz(5);return}
  if(a.dataset.a==="sel"){toggleSel(id,row)}else{var ids=selIds();if(ids.indexOf(id)<0){st.sel[id]=1;syncSel();$$(".xr[data-id='"+id+"']").forEach(function(r){r.classList.add("sel")})}openPick(a)}return}
 if(e.target.closest(".xh")){toggleOpen(row,c)}});
function toggleOpen(row,c){var was=row.classList.contains("open");
 $$(".xr.open").forEach(function(r){if(r!==row){r.classList.remove("open");setTimeout(function(){if(!r.classList.contains("open"))$(".xi-w",r).innerHTML=""},600)}});
 if(was){row.classList.remove("open");st.open=null;setTimeout(function(){if(!row.classList.contains("open"))$(".xi-w",row).innerHTML=""},600)}
 else{st.open=c.id;$(".xi-w",row).innerHTML=bodyHtml(c);void row.offsetWidth;row.classList.add("open");animBars(row);buzz(6);setTimeout(function(){var r=row.getBoundingClientRect(),s=$("#scroll").getBoundingClientRect();if(r.top<s.top+70)$("#scroll").scrollBy({top:r.top-s.top-80,behavior:"smooth"});else if(r.bottom>s.bottom-110)$("#scroll").scrollBy({top:Math.min(r.bottom-s.bottom+130,r.top-s.top-80),behavior:"smooth"})},380)}}
function animBars(r){requestAnimationFrame(function(){requestAnimationFrame(function(){$$(".mb .tk i",r).forEach(function(i){i.style.width=i.dataset.w+"%"})})})}
function toggleSel(id,row){var on=!st.sel[id];if(on)st.sel[id]=1;else delete st.sel[id];row.classList.toggle("sel",on);var k=$("[data-k]",row);if(on)pulseAt(k,"var(--green)",10);else buzz(5);var b=$('[data-a="sel"]',row);if(b)b.textContent=selTxt(on);syncSel()}
function selIds(){return Object.keys(st.sel).filter(function(k){return st.sel[k]})}
function syncSel(){var n=selIds().length,bar=$("#selbar");bar.classList.toggle("on",n>0);$("#sadd").textContent=n>1?"Добавить в тренировку · "+n:"Добавить в тренировку"}
$("#sback").onclick=function(){buzz(6);st.sel={};$$(".xr.sel").forEach(function(r){r.classList.remove("sel");var b=$('[data-a="sel"]',r);if(b)b.textContent=selTxt(false)});syncSel();toast("Выбор снят")};
$("#sadd").onclick=function(){openPick(this)};
/* ---- поиск ---- */
var qt=null,q=$("#q"),clr=$("#clr");
q.oninput=function(){clr.classList.toggle("on",!!q.value);clearTimeout(qt);qt=setTimeout(function(){st.q=q.value;apply();st.open=null;renderList(true)},140)};
clr.onclick=function(){q.value="";clr.classList.remove("on");st.q="";apply();renderList(true);buzz(5);q.focus()};
q.onkeydown=function(e){if(e.key==="Enter")q.blur()};
function resetFilters(){st.eqs={};st.mus={};st.lvl={};st.place=null;st.pos={};st.lt={};st.fmt={};st.uni=false;st.mine=false;seedFromProfile()}
function reset(){st.q="";q.value="";clr.classList.remove("on");resetFilters();apply();drawQ();renderList(true)}
$("#rst").onclick=function(){buzz(6);reset()};
/* быстрые чипы по оборудованию: один сегмент, индикатор скользит; несколько выбранных в листе фильтров — подсветка у каждого */
var qFirst=true;
function placeQ(){var row=$("#qrow"),ind=$("#qind");if(!ind)return;var on=$$(".chp.on",row);
 row.classList.toggle("multi",on.length>1);
 if(on.length!==1){ind.classList.remove("on");return}
 var b=on[0],fst=qFirst||!ind.classList.contains("on");
 if(fst){ind.classList.add("fst")}
 ind.style.top=b.offsetTop+"px";ind.style.height=b.offsetHeight+"px";ind.style.width=b.offsetWidth+"px";ind.style.transform="translateX("+b.offsetLeft+"px)";
 if(fst){ind.getBoundingClientRect();ind.classList.remove("fst")}
 ind.classList.add("on");qFirst=false;
 var l=b.offsetLeft-(row.clientWidth-b.offsetWidth)/2;row.scrollTo({left:Math.max(0,l),behavior:RM?"auto":"smooth"})}
function drawQ(){var keys=EQORD.filter(function(k){return CNT.eq[k]}).sort(function(a,b){return CNT.eq[b]-CNT.eq[a]}),anyE=hasAny(st.eqs);
 $("#qrow").innerHTML='<i class="qind" id="qind"></i><button class="chp'+(anyE?"":" on")+'" data-e="">Все</button>'+keys.map(function(k){return '<button class="chp'+(st.eqs[k]?" on":"")+'" data-e="'+k+'">'+EQS[k]+'</button>'}).join("");qFirst=true;placeQ()}
$("#qrow").addEventListener("click",function(e){var b=e.target.closest(".chp");if(!b)return;var k=b.dataset.e;st.eqs={};if(k)st.eqs[k]=1;buzz(5);
 $$("#qrow .chp").forEach(function(x){x.classList.toggle("on",k?x.dataset.e===k:x.dataset.e==="")});placeQ();apply();st.open=null;renderList(true)});
/* ---- лист фильтров ---- */
function chp(g,v,label,cnt,on){return '<button class="chp'+(on?" on":"")+'" data-g="'+g+'" data-v="'+esc(v)+'">'+esc(label)+(cnt!=null?'<i>'+cnt+'</i>':'')+'</button>'}
function drawF(){var h='';
 h+='<h5>Оборудование</h5><div class="chips">'+EQORD.filter(function(k){return CNT.eq[k]}).map(function(k){return chp("eqs",k,EQN[k],CNT.eq[k],st.eqs[k])}).join("")+'</div>';
 h+='<div class="chips" style="margin-top:8px">'+chp("mine","1","Только моё оборудование",null,st.mine)+'</div><p class="fnt" id="mnote">'+esc(mineTxt())+'</p>';
 h+='<h5>Мышцы</h5><div class="chips">'+MUS.filter(function(m){return CNT.m[m]}).map(function(m){return chp("mus",m,MUSS[m],CNT.m[m],st.mus[m])}).join("")+'</div>';
 h+='<h5>Сложность</h5><div class="chips">'+[1,2,3].map(function(l){return chp("lvl",l,LVN[l][0].toUpperCase()+LVN[l].slice(1),CNT.lvl[l]||0,st.lvl[l])}).join("")+'</div>';
 h+='<h5>Где занимаетесь</h5><div class="chips">'+chp("place","home","Дома",CNT.home,st.place==="home")+chp("place","gym","В зале",CAT.length,st.place==="gym")+'</div><p class="fnt">Дома — то, что можно сделать без зала. В зале доступно всё.</p>';
 h+='<h5>Назначение</h5><div class="chips">'+POS.map(function(p){return chp("pos",p[0],p[1],CNT.pos[p[0]]||0,st.pos[p[0]])}).join("")+'</div>';
 h+='<h5>Тип нагрузки</h5><div class="chips">'+LT.map(function(t){return chp("lt",t,ltl(t),CNT.lt[t]||0,st.lt[t])}).join("")+'</div>';
 h+='<h5>Формат</h5><div class="chips">'+FMT.map(function(f){return chp("fmt",f[0],f[1],CNT.fmt[f[0]]||0,st.fmt[f[0]])}).join("")+chp("uni","1","На одну сторону",CNT.uni,st.uni)+'</div>';
 h+='<h5>Мои ограничения</h5><div class="tw'+(hasSel()?" on":"")+'" id="tw"><div><div class="trow"><span class="tt"><b>Скрывать то, что мне не рекомендовано</b><span id="tsub"></span></span><button class="tgl'+(st.hide?" on":"")+'" id="thide" role="switch" aria-checked="'+(!!st.hide)+'" aria-label="Скрывать нерекомендованное"><i></i></button></div></div></div>';
 h+='<p class="fnt" style="margin:0 2px 8px">Подобрать с учётом… Выбор действует только в фильтре, профиль не меняется.</p>';
 RX.GROUPS.forEach(function(g){var cs=RX.CONDS.filter(function(c){return c[3]===g[0]}),n=cs.filter(function(c){return st.cx[c[0]]}).length;
  h+='<div class="cg'+(st.cgo[g[0]]?" open":"")+'" data-cg="'+g[0]+'"><button class="cgh" data-a="cg"><span>'+esc(g[1])+'</span><em class="'+(n?"on":"")+'">'+n+'</em>'+ic("chevd")+'</button><div class="cgb"><div><div class="chips">'+cs.map(function(c){return chp("cx",c[0],c[2],null,st.cx[c[0]])}).join("")+'</div></div></div></div>'});
 h+='<h5>Беременность <small>для подбора</small></h5><div class="chips" id="pgc">'+[0,1,2,3].concat(RX.PREGN.length>4&&st.preg===4?[4]:[]).map(function(i){return chp("preg",i,i===0?"Нет":i===4?"Срок не знаю":i+" триместр",null,st.preg===i)}).join("")+'</div>';
 $("#fbody").innerHTML=h;syncF()}
function syncF(){var n=st.list.length;$("#fclr").disabled=!(nActive()||st.cxTouched);$("#fok").textContent=n?"Показать "+n:"Ничего не найдено";
 var tw=$("#tw");if(tw){tw.classList.toggle("on",hasSel());var th=$("#thide");th.classList.toggle("on",!!st.hide);th.setAttribute("aria-checked",String(!!st.hide));$("#tsub").textContent=st.hide?(st.hidden?"Сейчас скрыто: "+st.hidden:"Скрывать пока нечего"):"Только пометки «осторожно»"}
 $$(".cg").forEach(function(g){var k=g.dataset.cg,c=RX.CONDS.filter(function(x){return x[3]===k&&st.cx[x[0]]}).length,em=$(".cgh em",g);em.textContent=c;em.classList.toggle("on",c>0)})}
function afterF(){apply();syncF();st.fd=1}
$("#fbody").addEventListener("click",function(e){
 var cg=e.target.closest("[data-a='cg']");if(cg){var g=cg.closest(".cg");g.classList.toggle("open");st.cgo[g.dataset.cg]=g.classList.contains("open");buzz(5);return}
 var tg=e.target.closest("#thide");if(tg){st.hide=!st.hide;st.cxTouched=true;pulseAt(tg,"var(--coral)",8);afterF();return}
 var b=e.target.closest(".chp[data-g]");if(!b)return;var g2=b.dataset.g,v=b.dataset.v,on;
 if(g2==="place"){st.place=st.place===v?null:v;$$('[data-g="place"]').forEach(function(x){x.classList.toggle("on",st.place===x.dataset.v)})}
 else if(g2==="mine"){st.mine=!st.mine;b.classList.toggle("on",st.mine)}
 else if(g2==="uni"){st.uni=!st.uni;b.classList.toggle("on",st.uni)}
 else if(g2==="preg"){var was=hasSel();st.preg=(+v>0&&st.preg===+v)?0:+v;st.cxTouched=true;$$('[data-g="preg"]').forEach(function(x){x.classList.toggle("on",st.preg===+x.dataset.v)});if(!was&&hasSel())st.hide=true;if(!hasSel())st.hide=false}
 else if(g2==="cx"){var was2=hasSel();st.cx[v]=!st.cx[v];st.cxTouched=true;b.classList.toggle("on",!!st.cx[v]);if(!was2&&hasSel())st.hide=true;if(!hasSel())st.hide=false}
 else{var key=g2==="lvl"||g2==="lt"||g2==="fmt"||g2==="pos"||g2==="mus"||g2==="eqs"?g2:null;if(!key)return;on=!st[key][v];st[key][v]=on;b.classList.toggle("on",on)}
 buzz(5);afterF()});
function closeF(){var d=st.fd;st.fd=0;closeLayers();if(d){st.open=null;drawQ();renderList();$("#scroll").scrollTo({top:0,behavior:"smooth"})}}
$("#fbtn").onclick=function(){st.fd=0;drawF();openSheet("shF")};
$("#fok").onclick=closeF;
$("#fclr").onclick=function(){buzz(6);resetFilters();afterF();drawF()};
$("#scrim").onclick=closeF;
/* ---- параметры по умолчанию для добавления ---- */
function lowOf(s){var r=String(s).match(/(\d+)(?:\s*[–\-]\s*(\d+))?/);return r?+r[1]:0}
function defaults(c){c=c||{};
 var t=String(c.rng||"").replace(/\s+/g," ").trim(),time=c.fmt==="time",n=c.sets>0?+c.sets:3,v=12,tt=30,m,mode=time?"time":"kg";
 function fin(){return {n:Math.max(1,Math.min(6,n)),v:Math.max(3,Math.min(30,v)),t:Math.max(5,Math.min(300,tt)),mode:mode}}
 if(/PAIL|RAIL|пассивно/i.test(t)){n=2;mode="time";tt=30;return fin()}
 if((m=t.match(/^(\d+)(?:\s*[–\-]\s*\d+)?\s*(?:подход|прох)\S*(?:\s+по)?\s*(.*)$/i))){n=+m[1];t=m[2]||""}
 else if((m=t.match(/^(\d+)\s*[×x]\s*(\d+.*)$/i))){n=+m[1];t=m[2]}
 var best=null,re=/(\d+)(?:\s*[–\-]\s*\d+)?\s*\(([^)]*)\)/g;
 while((m=re.exec(t))){if(/гипертроф/i.test(m[2])){best=+m[1];break}if(best==null&&/выносл|контрол/i.test(m[2]))best=+m[1]}
 var um=t.match(/(\d+)(?:\s*[–\-]\s*\d+)?\s*([а-яёa-z]*)/i),unit=um?um[2].toLowerCase():"",first=um?+um[1]:0,sec=t.match(/(\d+)(?:\s*[–\-]\s*\d+)?\s*сек/i);
 if(best!=null){if(time){mode="time";tt=best}else v=best}
 else if(unit==="м"){mode="time";tt=30}
 else if(unit==="сек"||unit==="с"){mode="time";tt=first||30}
 else if(unit.indexOf("мин")===0){mode="time";tt=(first||1)*60}
 else if(time){mode="time";tt=sec?+sec[1]:30}
 else v=first||12;
 return fin()}
function mkEx(c){var d=defaults(c),time=d.mode==="time",sets=[];for(var i=0;i<d.n;i++)sets.push(time?{v:1,w:"",t:d.t,rest:60}:{v:d.v,w:"",t:30,rest:60});return {u:uid(),id:c.id,mode:time?"time":"kg",sets:sets,note:"",link:false}}
/* ---- добавить в тренировку ---- */
var pk={sel:null};
function progs(){var D=FS.get("progs");return D&&Array.isArray(D.programs)?D:{programs:[]}}
/* та же оценка, что в конструкторе: разминка 3 мин + на подход работа (40 с или время) + отдых, шаг 5 мин */
function estMin(ex){if(!ex||!ex.length)return 0;var s=180;ex.forEach(function(x){(x&&Array.isArray(x.sets)?x.sets:[]).forEach(function(t){var w=40;if(x.mode==="time"&&t&&+t.t>0)w=Math.min(+t.t*Math.max(1,+t.v||1),300);var r=t&&t.rest!=null&&t.rest!==""&&isFinite(+t.rest)?+t.rest:60;s+=w+r})});return Math.max(5,Math.round(s/300)*5)}
function badOf(ids){var p=prof(),o=[];ids.forEach(function(id){var c=BYID[id];if(!c)return;var w=RX.why(c,p);if(w.length&&w[0].sev===2)o.push({c:c,w:w.filter(function(x){return x.sev===2})})});return o}
function footN(){var f=$("#pkf");f.className="pk-f";f.innerHTML='<button class="cta rg" id="pkc">Отмена</button><button class="cta go" id="pkg"'+(pk.sel?"":" disabled")+'>Добавить</button>';
 $("#pkc").onclick=function(){closeLayers();buzz(6)};$("#pkg").onclick=function(){tryCommit()}}
function footW(bad){var f=$("#pkf");f.className="pk-f wn";var one=bad.length===1;
 var tx=bad.slice(0,3).map(function(b){return (one?"":"«"+esc(b.c.n)+"»: ")+'<em>'+esc(b.w.map(function(x){return x.t}).join(", "))+'</em>'}).join("<br>")+(bad.length>3?"<br>и ещё "+(bad.length-3):"");
 f.innerHTML='<div class="wt"><b>Не рекомендуется при:</b>'+tx+'<br>Всё равно добавить?</div><div class="wr"><button class="cta rg" id="pkb">Назад</button><button class="cta go" id="pky">Всё равно добавить</button></div>';
 $("#pkb").onclick=function(){buzz(5);footN()};$("#pky").onclick=function(){commit(selIds())}}
function tryCommit(){var ids=selIds(),bad=badOf(ids);if(bad.length){buzz(8);footW(bad)}else commit(ids)}
function openPick(btn){var ids=selIds();if(!ids.length)return;pk.sel=null;var D=progs(),h='<div class="pk-h"><span class="eyebrow">В тренировку</span><h3>Куда добавить?</h3><p class="sub">'+plr(ids.length)+': '+esc(BYID[ids[0]].n)+(ids.length>1?" и ещё "+(ids.length-1):"")+'</p></div><div class="pk-l" id="pkl">';
 h+='<button class="pk-r nw" data-w="new"><span class="xk">'+ic("plus")+'</span><span class="t"><b>Новая тренировка</b><span class="s">Создадим и добавим упражнения</span></span></button><div class="pk-in" id="pkin"><input id="pkname" placeholder="Название, например «Ноги дома»" maxlength="40" autocomplete="off"></div>';
 D.programs.forEach(function(p){h+='<div class="pk-p">'+esc(p.name)+'</div>';(p.workouts||[]).forEach(function(w){h+='<button class="pk-r" data-w="'+esc(w.id)+'" data-p="'+esc(p.id)+'"><span class="xk">'+ic("check")+'</span><span class="t"><b>'+esc(w.name)+'</b><span class="s">'+plr((w.ex||[]).length)+' · ≈ '+estMin(w.ex||[])+' мин</span></span></button>'})});
 if(!D.programs.length)h+='<p class="sub" style="padding:6px 8px;font-size:13px;color:var(--ink2)">Тренировок пока нет, создайте первую.</p>';
 h+='</div><div class="pk-f" id="pkf"></div>';
 var w=$("#pick");w.innerHTML=h;footN();
 $$(".pk-r",w).forEach(function(b){b.onclick=function(){$$(".pk-r",w).forEach(function(x){x.classList.remove("on")});b.classList.add("on");pk.sel=b.dataset.w;var k=$(".xk",b);pulseAt(k,b.dataset.w==="new"?"var(--coral)":"var(--green)",8);$("#pkin").classList.toggle("on",pk.sel==="new");var g=$("#pkg");if(g)g.disabled=false;if(pk.sel==="new")setTimeout(function(){$("#pkname").focus()},260)}});
 openWin(w,btn)}
function commit(ids){var D=progs(),exs=ids.filter(function(id){return BYID[id]}).map(function(id){return mkEx(BYID[id])}),wk=null,wn="",p0=prof(),cau=[];
 ids.forEach(function(id){var c=BYID[id];if(!c)return;var w=RX.why(c,p0);if(w.length&&w[0].sev===1)cau.push({c:c,w:w})});
 if(pk.sel==="new"){var nm=($("#pkname").value||"").trim()||"Новая тренировка";var p=D.programs.filter(function(x){return x.name==="Мои тренировки"})[0];if(!p){p={id:uid(),name:"Мои тренировки",desc:"Тренировки, которые вы собрали сами",open:true,workouts:[]};D.programs.push(p)}
  wk={id:uid(),name:nm,desc:"",done:false,tnote:"",ex:exs};p.workouts.push(wk)}
 else{D.programs.forEach(function(p){(p.workouts||[]).forEach(function(w){if(w.id===pk.sel){wk=w}})});if(!wk)return;if(!Array.isArray(wk.ex))wk.ex=[];exs.forEach(function(x){wk.ex.push(x)})}
 wn=wk.name;D.programs.forEach(function(p){if(p.workouts.indexOf(wk)>-1)p.open=true});FS.set("progs",D);closeLayers();buzz([8,30,8]);
 st.sel={};$$(".xr.sel").forEach(function(r){r.classList.remove("sel");var b=$('[data-a="sel"]',r);if(b)b.textContent=selTxt(false)});syncSel();
 var wid=wk.id,msg=pk.sel==="new"?"Создали тренировку «"+wn+"»":"Добавили в «"+wn+"»";
 if(cau.length){var rs=[];cau.forEach(function(x){x.w.forEach(function(y){if(rs.indexOf(y.t)<0)rs.push(y.t)})});msg+=". Осторожно: "+rs.slice(0,3).join(", ")+(rs.length>3?" и ещё "+(rs.length-3):"")}
 toast(msg,"Открыть",function(){send({t:"open",wid:wid})});
 if(cau.length){clearTimeout(toast._t);toast._t=setTimeout(function(){$("#toast").classList.remove("on")},5200)}}
$("#fab").onclick=function(){buzz(8);send({t:"open",nw:1})};
function reseed(){if(!st.cxTouched){seedFromProfile()}}
FS.on(function(k){if(k==="profile"){reseed();apply();renderList()}});
/* заявка из других экранов: FS.set("libq",{eq:"mob"|q:"название"|id:"id упражнения"}) + переход на вкладку; читаем один раз */
function takeQ(){var o=FS.get("libq");if(!o||typeof o!=="object")return false;try{FS.set("libq",null)}catch(e){}
 st.q=String(o.q||"");q.value=st.q;clr.classList.toggle("on",!!st.q);resetFilters();
 if(o.eq&&EQN[o.eq])st.eqs[o.eq]=1;
 apply();st.open=null;var oid=null;
 /* переход на конкретное упражнение: скрытое по ограничениям показываем с пометкой, дальние строки подгружаем, строку раскрываем и прокручиваем */
 if(o.id){var oc=BYID[String(o.id)];
  if(!oc){try{toast("Упражнение не найдено в каталоге")}catch(e){}}
  else{var ix=st.list.indexOf(oc);
   if(ix<0&&st.hide){st.hide=false;st.cxTouched=true;apply();ix=st.list.indexOf(oc)}
   if(ix<0){var q0=st.q;st.q="";q.value="";clr.classList.remove("on");resetFilters();st.hide=false;st.cxTouched=true;apply();ix=st.list.indexOf(oc)}
   if(ix>=0){oid=oc.id;st.open=oc.id;if(ix>=st.shown)st.shown=Math.ceil((ix+1)/40)*40}}}
 drawQ();renderList(true);
 setTimeout(function(){var sc=$("#scroll");if(!sc)return;var r=oid&&$$(".xr").filter(function(x){return x.dataset.id===String(oid)})[0];
  if(r){var a=r.getBoundingClientRect(),b=sc.getBoundingClientRect();sc.scrollTo({top:Math.max(0,sc.scrollTop+a.top-b.top-80),behavior:"auto"});animBars(r);if(o.sec){var hh=[].slice.call(r.querySelectorAll("h5")).filter(function(h){return o.sec==="tech"?/техник/i.test(h.textContent):/Прогресси/.test(h.textContent)})[0];if(hh){var a2=hh.getBoundingClientRect(),b2=sc.getBoundingClientRect();sc.scrollTo({top:Math.max(0,sc.scrollTop+a2.top-b2.top-90),behavior:"auto"});var pp=hh.parentNode.querySelector(".pr>div:"+(o.sec==="dn"?"last-child":"first-child"));if(pp){pp.style.transition="background .6s";pp.style.background="rgba(224,90,48,.12)";pp.style.borderRadius="12px";setTimeout(function(){pp.style.background=""},1800)}}}}else sc.scrollTo({top:0,behavior:"auto"})},60);return true}
FS.on(function(k){if(k==="libq")takeQ()});
addEventListener("message",function(e){var m=e.data;if(m&&m.f==="forma"&&m.from==="shell"&&m.t==="show"){tabsPlace();closeLayers();if(!takeQ()){reseed();apply();renderList()}placeQ()}if(m&&m.f==="forma"&&m.t==="find"&&m.from!=="lib"&&(m.id!=null||m.eq)){var fo={};if(m.q!=null)fo.q=String(m.q);if(m.eq)fo.eq=String(m.eq);if(m.id!=null)fo.id=String(m.id);FS.set("libq",fo);takeQ()}else if(m&&m.t==="find"&&m.q!=null){q.value=m.q;q.oninput()}});
/* ---- запуск ---- */
window.LIB={st:st,CAT:CAT,apply:apply,render:renderList,mineEq:mineEq,defaults:defaults,mkEx:mkEx,ix:ix,seed:seedFromProfile,effP:effP};
if(!CAT.length){$("#ll").innerHTML='<div class="empty3"><b>Каталог не загрузился</b><span>Такое бывает при плохой связи. Обновите приложение.</span><div class="eb"><button class="cta go" id="rl">Обновить</button></div></div>';var rl=$("#rl");if(rl)rl.onclick=function(){try{(window.LIBEMB?parent.parent:parent).location.reload()}catch(e){location.reload()}}}
else{seedFromProfile();var t0=performance.now();apply();drawQ();renderList();window.LIB.first=performance.now()-t0;
 var idle=window.requestIdleCallback||function(f){return setTimeout(f,350)};idle(function(){var b0=performance.now();ix();window.LIB.build=performance.now()-b0},{timeout:1500})}
send({t:"hello"});
/* во встроенной Библиотеке нижняя панель вкладок принадлежит экрану «Тренировки» и лежит поверх iframe: пока открыт лист или окно, просим её спрятаться, иначе кнопки внизу листа (Показать, Добавить) недоступны */
if(window.LIBEMB){(function(){var last=null;function n(){var on=!!document.querySelector(".sheet.on,.win.on");if(on===last)return;last=on;try{parent.postMessage({f:"forma",t:"libdock",hide:on,from:"lib"},"*")}catch(e){}}
 try{new MutationObserver(n).observe(document.body,{subtree:true,attributes:true,attributeFilter:["class"]})}catch(e){}})()}
})();

