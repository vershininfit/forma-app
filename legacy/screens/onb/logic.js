
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




(function(){
if(window.name==="forma-emb")document.documentElement.classList.add("emb");
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
function ic(n){return '<svg class="i"><use href="#'+n+'"/></svg>'}
var hl=null;function hlEl(){if(hl)return hl;try{hl=document.createElement("label");hl.setAttribute("aria-hidden","true");hl.style.cssText="position:fixed;left:-9999px;top:0;opacity:0;pointer-events:none";hl.innerHTML='<input type="checkbox" switch tabindex="-1">';document.body.appendChild(hl)}catch(e){}return hl}
function buzz(p){try{if(navigator.vibrate){navigator.vibrate(p);return}}catch(e){}
  var a=[].concat(p),t=0;a.forEach(function(v,i){if(i%2===0)setTimeout(function(){try{hlEl().click()}catch(e){}},t);t+=v})}
function raf(fn,ms){var s=performance.now();(function f(n){var t=n-s;fn(Math.min(t,ms));if(t<ms)requestAnimationFrame(f)})(s)}
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function clamp(x,a,b){return Math.max(a,Math.min(b,x))}
function pad2(n){return (n<10?"0":"")+n}
function plural(n,f){var m=n%10,k=n%100;return m===1&&k!==11?f[0]:(m>=2&&m<=4&&(k<10||k>=20)?f[1]:f[2])}
function send(m){m.f="forma";m.from="onb";try{parent!==window&&parent.postMessage(m,"*")}catch(e){}}
var reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
function pu(el,col){if(el&&el.classList&&el.classList.contains("chip"))return;try{pulseRing(el,col||"var(--green)")}catch(e){}}

/* state */
var S={preg:null,name:"",sex:null,goal:null,clar:{},where:null,eq:{body:true},exp:null,days:3,mins:45,h:168,w:62.0,d:12,m:5,y:1990,noAge:false,cau:{},cW:false,coach:null,code:"",rem:"19:00"};
var ST={welcome:0,name:1,goal:2,exp:3,where:4,rhythm:5,sex:6,age:7,h:8,w:9,cau:10,coach:11,plan:12};
var STEPS=13,idx=0,maxSeen=0,finished=false,BUILT=null;
var LIM={age:[14,100],h:[120,230],w:[30,250]};
function nowY(){return new Date().getFullYear()}

/* data */
var GOALS=[
 ["stroy","Стройность и тонус","Лёгкие формы и подтянутое тело","g-stroy",["Подтянуть ягодицы и ноги","Подтянуть живот","Красивые руки и плечи","Осанка и лёгкость","К отпуску или событию","Не знаю, подберите"]],
 ["relief","Рельеф и меньше жира","Снизить процент жира, сохранить мышцы","g-relief",["Снизить процент жира","Сохранить мышцы","Проработать пресс","Рельеф рук и плеч","Больше шагов и активности","Не знаю, подберите"]],
 ["force","Сила и выносливость","Стать сильнее и выносливее","g-force",["Повысить силу","Повысить выносливость","Начать бегать","Подтягивания и отжимания","Базовые движения с весом","Функциональная сила","Не знаю, подберите"]],
 ["start","С нуля или после перерыва","Мягкий и понятный старт","g-start",["Освоить технику","Вернуться после перерыва","Без нагрузки на суставы","Привыкнуть к залу","Заниматься дома","Короткие тренировки","Найти свой формат"]],
 ["recover","Восстановление","После беременности, травм, боли","g-recover",["После беременности","Пресс и тазовое дно","После травмы","Облегчить боль в спине","Колени и суставы","Вернуть энергию"]],
 ["reg","Регулярность и здоровье","Просто заниматься своим телом","g-reg",["Энергия и бодрость","Крепкая спина и осанка","Здоровье сердца","Баланс и гибкость","Меньше стресса","Привычка заниматься","Сила с возрастом"]]];
var PLACES=[["gym","Зал","Полный набор оборудования","gym"],["home","Дома","С минимумом инвентаря","home2"],["both","И там и там","Подстроим под день","both"]];
var EQ=[["body","Своё тело","body",1],["mat","Коврик","mat"],["band","Резинки","band"],["trx","Петли TRX","trx"],["dumb","Гантели","dumb"],["kb","Гири","kb"],["bar","Штанга","bar"],["mach","Тренажёры","mach"],["cable","Кроссовер","cable"],["land","Лэндмайн","land"],["more","Прочее: степ, фитбол, скамья","more"]];
/* ключи оборудования онбординга -> ключи каталога */
var EQMAP={body:"body",dumb:"dumbbell",kb:"kettlebell",bar:"barbell",mach:"machine",cable:"cable",land:"land",mat:"other",more:"other",band:"band",trx:"trx"};
var EQBACK={body:"body",dumbbell:"dumb",kettlebell:"kb",barbell:"bar",machine:"mach",cable:"cable",land:"land",other:"mat",band:"band",trx:"trx"};
var EXP=[["new","Новичок","До 3 месяцев занятий"],["mid","Средний","От 3 месяцев до года"],["adv","Продвинутый","Больше года регулярно: 3 и больше раз в неделю"]];
var LVL={new:1,mid:2,adv:3},LVLBACK={1:"new",2:"mid",3:"adv"};
var SEX=[["f","Женщина","","sx-f"],["m","Мужчина","","sx-m"]];
var CAU=[["Колени"],["Спина"],["Плечи"],["Шея"],["Беременность или после родов"],["Сердце или давление"],["Другое"],["Ничего из этого"]];
var COACH=[["has","У меня есть тренер","Введу код, он увидит мой прогресс","user"],["self","Хочу программу сама","Подберёт приложение, тренера можно подключить позже","dumb"]];
var REM=[["08:00","Утром, 8:00"],["13:00","Днём, 13:00"],["19:00","Вечером, 19:00"],["none","Не напоминать"]];
var MINS=[20,30,45,60];
var DAYSF={1:[2],2:[1,4],3:[0,2,4],4:[0,1,3,4],5:[0,1,2,3,4],6:[0,1,2,3,4,5]};
var DN=["Пн","Вт","Ср","Чт","Пт","Сб","Вс"],DLONG=["в понедельник","во вторник","в среду","в четверг","в пятницу","в субботу","в воскресенье"];

/* helpers */
function mk(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e}
function lv(n){var h=[6,10,14];return '<svg class="i" viewBox="0 0 24 24">'+h.map(function(v,i){return '<path d="M'+(6+i*6)+' 19v-'+v+'" style="opacity:'+(i<n?1:.22)+';stroke-width:2.6"/>'}).join('')+'</svg>'}
function ic2(n){return /^lv/.test(n)?lv(+n[2]):ic(n)}
function opt(d,onClick){var b=mk("button","opt",'<div class="icb">'+ic2(d[3])+'</div><div><b>'+d[1]+'</b><span class="d">'+d[2]+'</span></div><span class="ck">'+ic("check")+'</span>');b.onclick=function(){onClick(b)};return b}
function toast(t){var e=$("#toast");e.textContent=t;e.classList.add("on");clearTimeout(toast._t);toast._t=setTimeout(function(){e.classList.remove("on")},2800)}
function chipOn(c,on){c.classList.toggle("on",!!on)}

/* имя */
var nm=$("#nm");
function cleanName(v){return String(v||"").replace(/[<>]/g,"").replace(/\s+/g," ").replace(/^\s+/,"").slice(0,30)}
nm.addEventListener("input",function(){var v=cleanName(nm.value);if(v!==nm.value)nm.value=v;S.name=v.trim()});
nm.addEventListener("keydown",function(e){if(e.key==="Enter"){e.preventDefault();nm.blur();cta.click()}});

/* цель + уточнения */
var gl=$("#goals"),clarW=$("#clar"),cc=$("#clarChips"),gBtns=[];
GOALS.forEach(function(g,i){var b=opt(g,function(){var again=S.goal===i;setGoal(again?null:i);buzz(8);upd();var sc=$$(".scr")[ST.goal];sc.scrollTo({top:0,behavior:"smooth"});setTimeout(function(){sc.scrollTo({top:0,behavior:"smooth"})},560)});gl.appendChild(b);gBtns.push(b)});
function setGoal(i,clar){S.goal=i;S.clar={};
 gBtns.forEach(function(b,j){b.classList.toggle("on",S.goal===j);b.classList.toggle("gone",S.goal!==null&&S.goal!==j)});
 if(i===null){clarW.classList.remove("on");cc.innerHTML=""}
 else{cc.innerHTML="";GOALS[i][4].forEach(function(t){var c=mk("button","chip",t);if(clar&&clar.indexOf(t)>-1){S.clar[t]=true;c.classList.add("on")}
  c.onclick=function(){S.clar[t]=!S.clar[t];chipOn(c,S.clar[t]);if(S.clar[t])pu(c,"var(--ink3)");buzz(6)};cc.appendChild(c)});clarW.classList.add("on")}}

/* где + оборудование */
var wh=$("#where"),eqw=$("#eqw"),eqc=$("#eq"),pBtns=[];
PLACES.forEach(function(p){var b=opt(p,function(){var again=S.where===p[0];clearTimeout(foldT);if(again){whFold=!whFold}else{S.where=p[0];whFold=false;presetEq();foldT=setTimeout(function(){whFold=true;renderWhere()},650)}renderWhere();renderEq();buzz(8);upd()});wh.appendChild(b);pBtns.push(b)});
EQ.forEach(function(e){var c=mk("button","chip"+(e[3]?" lock on":""),ic(e[2])+e[1]);c.dataset.k=e[0];
 c.onclick=function(){S.eq[e[0]]=!S.eq[e[0]];chipOn(c,S.eq[e[0]]);if(S.eq[e[0]])pu(c,"var(--ink3)");buzz(6);eqn()};eqc.appendChild(c)});
var whFold=false,foldT=0;
function renderWhere(){pBtns.forEach(function(x,j){x.classList.toggle("on",S.where===PLACES[j][0]);x.classList.toggle("gone",whFold&&S.where!==null&&S.where!==PLACES[j][0])});eqw.classList.toggle("on",whFold&&!!S.where)}
function renderEq(){S.eq.body=true;$$(".chip",eqc).forEach(function(c){chipOn(c,S.eq[c.dataset.k])});eqn()}
function presetEq(){var set={gym:["body","dumb","kb","bar","mach","cable","land","mat","band"],home:["body","mat","band"],both:["body","mat","band","trx","dumb","kb"]}[S.where];S.eq={};set.forEach(function(k){S.eq[k]=true})}
function eqn(){var n=Object.keys(S.eq).filter(function(k){return S.eq[k]}).length;$("#eqCount").textContent="выбрано "+n+" из "+EQ.length}

/* пол, уровень */
var sexEl=$("#sex"),sBtns=[];SEX.forEach(function(g){var b=opt([0,g[1],g[2],g[3]],function(){S.sex=g[0];renderSex();buzz(8);upd();autoNext(ST.sex)});sexEl.appendChild(b);sBtns.push(b)});
function renderSex(){sBtns.forEach(function(b,j){b.classList.toggle("on",S.sex===SEX[j][0])})}
var ex=$("#exp"),eBtns=[];EXP.forEach(function(e){var b=opt([0,e[1],e[2],"lv"+LVL[e[0]]],function(){S.exp=e[0];renderExp();buzz(8);upd();autoNext(ST.exp)});ex.appendChild(b);eBtns.push(b)});
function renderExp(){eBtns.forEach(function(b,j){b.classList.toggle("on",S.exp===EXP[j][0])})}

/* segmented */
function seg(el,cb){var bs=$$("button",el),ind=$(".ind",el),cur=0;function place(){var b=bs[cur];if(!b||!b.offsetWidth)return;ind.style.width=b.offsetWidth+"px";ind.style.transform="translateX("+b.offsetLeft+"px)"}
 function mark(i){cur=i;bs.forEach(function(x,j){x.classList.toggle("on",j===i)})}
 bs.forEach(function(b,i){if(b.classList.contains("on"))cur=i;b.onclick=function(){mark(i);place();cb&&cb(i);buzz(6)}});
 setTimeout(place,80);addEventListener("resize",place);if(document.fonts)document.fonts.ready.then(place);return {place:place,set:function(i){mark(i);place()}}}

/* ритм */
var dys=$("#days"),rbf=$("#rbf"),rbk=$("#rbk"),demoT=[];
var dind=mk("i","dind sq");dys.appendChild(dind);
function dPlace(first){var b=$$(".dpick",dys)[S.days-1];if(!b||!b.offsetWidth)return;if(first)dind.classList.add("sq");dind.style.transform="translate("+b.offsetLeft+"px,"+b.offsetTop+"px)";if(first){dind.offsetWidth;dind.classList.remove("sq")}}
function renderDays(){$$(".dpick",dys).forEach(function(x,j){x.classList.toggle("on",j===S.days-1)})}
for(var d=1;d<=6;d++)(function(d){var b=mk("button","dpick"+(d===3?" on":""),d);b.onclick=function(){S.days=d;renderDays();dPlace();buzz(8);demo()};dys.appendChild(b)})(d);
setTimeout(function(){dPlace(true)},200);addEventListener("resize",function(){dPlace(true)});if(document.fonts)document.fonts.ready.then(function(){dPlace(true)});
var minsSeg=seg($("#mins"),function(i){S.mins=MINS[i]});
function ticks(el,n){el.innerHTML="";for(var i=0;i<n;i++)el.appendChild(document.createElement("i"))}
function paint(f,p){f.style.width=p+"%"}
var cur={a:0,b:0};
function animBar(f,key,to,ms,after){var from=cur[key];raf(function(t){var e=1-Math.pow(1-t/ms,3),v=from+(to-from)*e;cur[key]=v;paint(f,v);after&&after(v)},ms)}
function labels(c,p,done,total,v){$(c).textContent=done+" из "+total;$(p).textContent=Math.round(v)+"%"}
function demo(){demoT.forEach(clearTimeout);demoT=[];var n=S.days;ticks(rbk,n);cur.a=0;paint(rbf,0);labels("#rbc","#rbp",0,n,0);
 for(var k=1;k<=n;k++)(function(k){demoT.push(setTimeout(function(){animBar(rbf,"a",k/n*100,900,function(v){labels("#rbc","#rbp",k,n,v)});buzz(10)},500+(k-1)*1100))})(k);demoT.push(setTimeout(function(){if(idx===ST.rhythm)demo()},500+(n-1)*1100+900+2000))}


/* шкалы: рост и вес */
function ruler(id,o){var r=$(id),tk=$(".ticks",r),last=null,vt=!!r.closest(".vr"),N=Math.round((o.max-o.min)/o.step);
 for(var k=0;k<=N;k++){var v=vt?N-k:k;var t=mk("div","t"+(v%o.maj===0?" m10":v%(o.maj/2)===0?" m5":""));if(v%o.maj===0){t.appendChild(mk("em","",Math.round(o.min+v*o.step)))}tk.appendChild(t)}
 var box=r.closest(".rbox"),mark=$(".rmark",box),big=$(".big",box);
 function pos(){return vt?r.scrollTop:r.scrollLeft-5}
 function idx(){var i=Math.round(pos()/10);return vt?N-i:i}
 function setPos(v){var i=clamp(Math.round((v-o.min)/o.step),0,N);var q=(vt?N-i:i)*10;if(vt)r.scrollTop=q;else r.scrollLeft=q+5}
 var ready=false,rt=null;r.addEventListener("scroll",function(){if(!ready)return;var v=Math.round((o.min+clamp(idx(),0,N)*o.step)*10)/10;if(v!==last){if(last!==null){mark.classList.remove("p");big.classList.remove("p");mark.offsetWidth;mark.classList.add("p");big.classList.add("p");buzz(4)}last=v;o.on(v)}},{passive:true});
 function apply(){ready=false;clearTimeout(rt);var t=o.get();setPos(t);last=Math.round(clamp(t,o.min,o.max)*10)/10;rt=setTimeout(function(){ready=true},140)}
 setTimeout(apply,150);if(document.fonts)document.fonts.ready.then(apply);
 return {apply:apply}}
function fmt1(v){return v.toFixed(1).replace(".",",")}
var rH=ruler("#hr",{min:LIM.h[0],max:LIM.h[1],step:1,maj:10,get:function(){return S.h},on:function(v){S.h=v;$("#hv").textContent=v}});
var rW=ruler("#wr",{min:LIM.w[0],max:LIM.w[1],step:.1,maj:10,get:function(){return S.w},on:function(v){S.w=v;$("#wv").textContent=fmt1(v)}});

/* дата рождения: три колеса, возраст 14–100 */
var MON=["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
function wheel(id,items,on){var w=$(id),els=[],last=-1;w.appendChild(mk("div","pad"));items.forEach(function(t){var e=mk("div","it",t);w.appendChild(e);els.push(e)});w.appendChild(mk("div","pad"));
 function paintI(i){els.forEach(function(e,j){e.classList.toggle("on",j===i)})}
 w.addEventListener("scroll",function(){var i=clamp(Math.round(w.scrollTop/44),0,items.length-1);if(i!==last){if(last>=0)buzz(5);paintI(i);last=i;on(i)}},{passive:true});
 return {set:function(i){i=clamp(i,0,items.length-1);w.scrollTop=i*44;paintI(i);last=i}}}
var days31=[];for(var i=1;i<=31;i++)days31.push(i);
var yrs=[];for(var y=nowY()-LIM.age[0];y>=nowY()-LIM.age[1];y--)yrs.push(y);
function age(){var n=new Date(),a=n.getFullYear()-S.y;if(n.getMonth()<S.m-1||(n.getMonth()===S.m-1&&n.getDate()<S.d))a--;return a}
function ageOk(){var a=age();return a>=LIM.age[0]&&a<=LIM.age[1]}
function ageT(){var a=age();$("#av").textContent=a;$("#avu").textContent=plural(Math.abs(a),["год","года","лет"])}
var ageTm=null,noteTm=null;
function ageChanged(){ageT();upd();clearTimeout(ageTm);ageTm=setTimeout(fixAge,260)}
var wD=wheel("#wd",days31,function(i){S.d=i+1;ageChanged()}),wM=wheel("#wm",MON,function(i){S.m=i+1;ageChanged()}),wY=wheel("#wy",yrs,function(i){S.y=yrs[i];ageChanged()});
function setWheels(){S.y=clamp(S.y,yrs[yrs.length-1],yrs[0]);wD.set(S.d-1);wM.set(S.m-1);wY.set(yrs.indexOf(S.y));ageT()}
function ageNote(t){var e=$("#ageNote");e.textContent=t;e.classList.add("on");clearTimeout(noteTm);noteTm=setTimeout(function(){e.classList.remove("on")},3600)}
function fixAge(){var ch=false,msg="",dim=new Date(S.y,S.m,0).getDate();
 if(S.d>dim){S.d=dim;ch=true}
 if(!ageOk()){var n=new Date(),a=age();S.y=a<LIM.age[0]?n.getFullYear()-LIM.age[0]:n.getFullYear()-LIM.age[1];S.m=n.getMonth()+1;S.d=n.getDate();S.d=Math.min(S.d,new Date(S.y,S.m,0).getDate());ch=true;msg="Forma рассчитана на возраст от "+LIM.age[0]+" до "+LIM.age[1]+" лет"}
 if(ch){setWheels();upd();if(msg)ageNote(msg)}}
setTimeout(setWheels,160);if(document.fonts)document.fonts.ready.then(setWheels);

/* осторожность + согласие */
var cau=$("#cau");
CAU.forEach(function(c,i){var b=mk("button","chip",c[0]);b.onclick=function(){var none=i===CAU.length-1;if(none){S.cau={none:true}}else{S.cau.none=false;S.cau[c[0]]=!S.cau[c[0]]}renderCau();if(S.cau[c[0]])pu(b,"var(--ink3)");buzz(6)};cau.appendChild(b)});
var PREGO=[["1","Беременность · 1 триместр"],["2","Беременность · 2 триместр"],["3","Беременность · 3 триместр"],["pp","После родов"],["4","Срок не знаю"]],pregBtns=[];
PREGO.forEach(function(o){var b=mk("button","chip",o[1]);b.onclick=function(){S.preg=S.preg===o[0]?null:o[0];renderCau();buzz(6)};$("#pregRow").appendChild(b);pregBtns.push(b)});
function renderCau(){var men=S.sex==="m",pcb=$$(".chip",cau)[4];if(pcb)pcb.style.display=men?"none":"";if(men){S.cau["Беременность или после родов"]=false;S.preg=null}
 $$(".chip",cau).forEach(function(x,j){var k=CAU[j][0];chipOn(x,j===CAU.length-1?S.cau.none:S.cau[k])});
 var on=!!S.cau["Беременность или после родов"];$("#pregW").style.display=on?"":"none";pregBtns.forEach(function(b,i){chipOn(b,on&&S.preg===PREGO[i][0])})}
$("#cbW").onclick=function(){S.cW=!S.cW;this.classList.toggle("on",S.cW);buzz(8);upd()};

/* тренер + напоминания */
var ch=$("#coach"),cw=$("#codew"),cBtns=[],code=$("#code"),trn=$("#trainer");
COACH.forEach(function(c){var b=opt(c,function(){S.coach=c[0];renderCoach();buzz(8);upd()});ch.appendChild(b);cBtns.push(b)});
function coachLbl(){var b=cBtns[1]&&cBtns[1].querySelector("b");if(b)b.textContent=S.sex==="m"?"Хочу начать сам":S.sex==="f"?"Хочу начать сама":"Хочу начать сам(а)"}
function renderCoach(){coachLbl();cBtns.forEach(function(b,j){b.classList.toggle("on",S.coach===COACH[j][0])});cw.classList.toggle("on",S.coach==="has")}
function codeOk(){return S.coach!=="has"||S.code===""||S.code.length>=4}
function showTrainer(ok){trn.innerHTML=ok?'<div class="trainer"><div class="av">'+ic("check")+'</div><div><b>Код '+esc(S.code)+'</b><div class="small">Тренер подключится после запуска</div></div></div>':'<p class="small">Введите код, который прислал тренер: от 4 символов.</p>'}
code.addEventListener("input",function(){var v=code.value.replace(/[^0-9A-Za-z]/g,"").toUpperCase().slice(0,8);if(v!==code.value)code.value=v;S.code=v;trn.innerHTML="";upd()});
function addCode(){if(S.code.length<4){showTrainer(false);return}showTrainer(true);pu($("#codeok"));buzz([8,30,8])}
$("#codeok").onclick=addCode;
code.addEventListener("keydown",function(e){if(e.key==="Enter"){e.preventDefault();code.blur();if(S.code.length>=4)addCode();else if(S.code===""){}else showTrainer(false)}});
var rm=$("#rem");REM.forEach(function(r){var b=mk("button","chip"+(r[0]===S.rem?" on":""),r[1]);b.dataset.k=r[0];b.onclick=function(){S.rem=r[0];renderRem();pu(b,"var(--ink3)");buzz(6)};rm.appendChild(b)});
function renderRem(){$$(".chip",rm).forEach(function(x){chipOn(x,x.dataset.k===S.rem)})}

/* профиль <-> состояние */
function nowIso(){return todayIso()}
function oldProfile(){var p=null;try{p=FS.get("profile")}catch(e){}return p&&typeof p==="object"&&!Array.isArray(p)?p:{}}
function hasProfile(p){return !!(p&&(p.created||p.name||p.sex||p.goal))}
function fromProfile(){var P=oldProfile();if(!hasProfile(P))return false;
 var N=function(v,a,b,dflt){v=+v;return isFinite(v)&&v>=a&&v<=b?v:dflt};
 S.name=cleanName(P.name).trim();
 S.sex=P.sex==="f"||P.sex==="m"?P.sex:null;
 S.h=Math.round(N(P.h,LIM.h[0],LIM.h[1],168));S.w=Math.round(N(P.w,LIM.w[0],LIM.w[1],62)*10)/10;
 var b=/^(\d{4})-(\d{2})-(\d{2})$/.exec(P.birth||"");
 if(b){S.y=+b[1];S.m=+b[2];S.d=+b[3];S.noAge=false}else{S.noAge=!!P.birth||P.birth===null}
 var gi=-1;GOALS.forEach(function(g,i){if(g[0]===P.goal)gi=i});S.goal=gi>=0?gi:null;
 S.clar={};var cl=Array.isArray(P.clar)?P.clar.filter(function(x){return typeof x==="string"}):[];
 S._clar=cl;
 S.where=P.where==="gym"||P.where==="home"||P.where==="both"?P.where:null;
 S.eq={body:true};(Array.isArray(P.eq)?P.eq:[]).forEach(function(k){if(EQBACK[k])S.eq[EQBACK[k]]=true});
 S.exp=LVLBACK[P.lvl]||null;
 S.cau={};if(Array.isArray(P.cau)){if(P.cau.length)P.cau.forEach(function(c){if(typeof c==="string")S.cau[c]=true});else S.cau.none=true}
 S.preg=P.preg>=1&&P.preg<=4?String(P.preg):(RX.keysOf(P).indexOf("pp")>=0?"pp":null);
 S.cW=true;
 var co=P.coach&&typeof P.coach==="object"?P.coach:{};S.coach=co.mode==="has"||co.mode==="self"?co.mode:null;S.code=String(co.code||"").slice(0,8);
 S.rem=P.rem==="none"||/^([01]\d|2[0-3]):[0-5]\d$/.test(P.rem||"")?P.rem:"19:00";
 try{var pl=FS.get("plan");if(pl&&typeof pl==="object"){var dn=Array.isArray(pl.days)?pl.days.length:0;if(dn>=1&&dn<=6)S.days=dn;if(MINS.indexOf(+pl.mins)>-1)S.mins=+pl.mins}}catch(e){}
 return true}
function syncUI(){
 nm.value=S.name;
 var cl=S._clar||[];setGoal(S.goal,cl);S._clar=null;
 renderWhere();renderEq();renderExp();renderSex();
 renderDays();dPlace(true);minsSeg.set(MINS.indexOf(S.mins)>-1?MINS.indexOf(S.mins):2);ticks(rbk,S.days);
 $("#hv").textContent=S.h;$("#wv").textContent=fmt1(S.w);rH.apply();rW.apply();
 setWheels();
 renderCau();$("#cbW").classList.toggle("on",S.cW);
 renderCoach();code.value=S.code;trn.innerHTML="";if(S.coach==="has"&&S.code.length>=4)showTrainer(true);renderRem();
 upd()}
function makeProfile(){
 var old=oldProfile(),g=GOALS[S.goal==null?0:S.goal],eq=["body"];
 Object.keys(S.eq).forEach(function(k){if(S.eq[k]){var c=EQMAP[k];if(c&&eq.indexOf(c)<0)eq.push(c)}});
 var cau=[];if(!S.cau.none)CAU.forEach(function(c,i){if(i<CAU.length-1&&S.cau[c[0]])cau.push(c[0])});
 var clar=GOALS[S.goal==null?0:S.goal][4].filter(function(t){return S.clar[t]});
 var code=S.coach==="has"?S.code:"",oc=old.coach&&typeof old.coach==="object"?old.coach:{};
 var p={};for(var k in old)p[k]=old[k];
 p.name=S.name;p.sex=S.sex||"f";p.birth=S.noAge?null:S.y+"-"+pad2(S.m)+"-"+pad2(S.d);
 p.h=Math.round(S.h);p.w=Math.round(S.w*10)/10;
 p.bf=old.bf!=null?old.bf:null;p.neck=old.neck!=null?old.neck:null;p.waist=old.waist!=null?old.waist:null;p.hip=old.hip!=null?old.hip:null;
 /* активность по числу тренировок, как CALC.actFor */
 p.act=[1.2,1.375,1.55,1.725,1.9].indexOf(+old.act)>-1?+old.act:(S.days<=3?1.375:S.days<=5?1.55:1.725);
 p.goal=g[0];p.clar=clar;p.where=S.where||"both";p.eq=eq;p.lvl=LVL[S.exp]||1;
 /* ограничения: быстрые зоны из онбординга + то, что человек отметил в профиле сам */
 var oq=RX.keysOf({cau:Array.isArray(old.cau)?old.cau:[]}),extra=(Array.isArray(old.cx)?old.cx:[]).filter(function(k){return oq.indexOf(k)<0}),nq=RX.keysOf({cau:cau}),cx=nq.slice();
 extra.forEach(function(k){if(cx.indexOf(k)<0)cx.push(k)});
 var hasPg=cau.indexOf("Беременность или после родов")>=0;
 p.preg=hasPg?(S.preg==="pp"?0:S.preg?+S.preg:4):(+old.preg>=1?+old.preg:0);
 p.cx=cx;p.cau=RX.cauOf({cx:cx,preg:p.preg,cau:cau});
 p.coach={mode:S.coach==="has"?"has":"self",code:code,name:code&&oc.code===code&&typeof oc.name==="string"?oc.name:""};
 p.rem=S.rem;p.created=old.created||nowIso();
 return p}

/* план */
function planTime(){return S.rem!=="none"?S.rem:"19:00"}
function buildPlan(){
 var prof=makeProfile(),res=null,prog=null,ws=[];
 try{res=GEN.starter(prof,{days:S.days,mins:S.mins,time:planTime()})}catch(e){res=null}
 try{prog=res&&res.progs&&Array.isArray(res.progs.programs)?res.progs.programs[0]:null;
  ws=prog&&Array.isArray(prog.workouts)?prog.workouts.filter(function(w){return w&&Array.isArray(w.ex)&&w.ex.length}):[]}catch(e){prog=null;ws=[]}
 var empty=!prog||!ws.length,plan=res&&res.plan&&Array.isArray(res.plan.days)?res.plan:{days:(DAYSF[S.days]||DAYSF[3]).slice(),mins:S.mins,time:planTime(),prog:null};
 if(empty){plan={days:plan.days.slice(),mins:plan.mins||S.mins,time:plan.time||planTime(),prog:null}}else prog.workouts=ws;
 var today=nowIso(),wt=[];try{var ow=FS.get("wt");if(Array.isArray(ow))wt=ow.filter(function(x){return x&&x.d&&x.d!==today})}catch(e){}
 wt.push({d:today,v:prof.w});wt.sort(function(a,b){return a.d<b.d?-1:a.d>b.d?1:0});
 BUILT={profile:prof,prog:empty?null:prog,plan:plan,wt:wt,empty:empty};
 renderPlan()}
function renderPlan(){
 var B=BUILT,n=B.plan.days.length,tw=dowOf(nowIso()),words=["Одна тренировка","Две тренировки","Три тренировки","Четыре тренировки","Пять тренировок","Шесть тренировок"];
 var nxt=0;for(var k=0;k<7;k++){if(B.plan.days.indexOf((tw+k)%7)>-1){nxt=k;break}}
 var nxtDow=(tw+nxt)%7,when=nxt===0?"сегодня":nxt===1?"завтра":DLONG[nxtDow];
 var nmp=S.name?esc(S.name)+", ":"";
 var wl=$("#wlist");wl.innerHTML="";
 if(B.empty){$("#planT").textContent="Соберём вместе";$("#planS").textContent="Откройте конструктор: подберём упражнения под вашу цель и оборудование.";wl.style.display="none"}
 else{wl.style.display="";var em=B.prog.workouts.map(function(w){return GEN.stats(w).min}),ea=em.length?Math.round(em.reduce(function(a,b){return a+b},0)/em.length/5)*5:B.plan.mins,mt=Math.abs(ea-B.plan.mins)>=10&&ea>0?"≈"+ea:String(B.plan.mins);
  $("#planT").textContent=words[clamp(n,1,6)-1]+" по "+mt+" минут";
  $("#planS").innerHTML=nmp+"ближайшая тренировка "+when+".";
  B.prog.workouts.forEach(function(w,i){var dw=B.plan.days[i],st=GEN.stats(w),title=String(w.name||"").replace(/^[A-Z0-9]\s*·\s*/,"");
   var r=mk("div","wrow"+(dw===nxtDow?" nx":""),'<span class="wk">'+esc(w.key||String.fromCharCode(65+i))+'</span><div class="wt"><b>'+esc(title)+'</b><span>≈ '+st.min+' мин · '+st.ex+' '+plural(st.ex,["упражнение","упражнения","упражнений"])+'</span></div><em>'+(dw!=null?DN[dw]:"")+'</em>');wl.appendChild(r)})}
 var wk=$("#week");wk.innerHTML="";for(var i=0;i<7;i++){var dw=(tw+i)%7;wk.appendChild(mk("div","wd"+(B.plan.days.indexOf(dw)>-1?" plan":"")+(i===0?" today":""),"<i>"+ic("check")+"</i><b>"+DN[dw]+"</b>"))}
 ticks($("#rbk2"),n);cur.b=0;paint($("#rbf2"),0);labels("#rbc2","#rbp2",0,n,0);
 CTAT[ST.plan]=B.empty?"Открыть конструктор":"Начать";if(idx===ST.plan)setCta(CTAT[ST.plan])}

/* сохранение и выход */
function finish(){
 if(finished)return;if(!BUILT)buildPlan();var B=BUILT,ok=true;finished=true;
 try{
  FS.set("profile",B.profile);
  if(!B.empty){var op=FS.get("progs"),np={};if(op&&typeof op==="object")for(var k in op)np[k]=op[k];
   np.programs=[B.prog].concat(op&&Array.isArray(op.programs)?op.programs:[]);FS.set("progs",np)}
  var opl=FS.get("plan"),npl=B.plan;if(opl&&typeof opl==="object"&&!Array.isArray(opl)){if(Array.isArray(opl.items)&&opl.items.length)npl.items=opl.items;if(Array.isArray(opl.ex)&&opl.ex.length)npl.ex=opl.ex}npl.since=nowIso();FS.set("plan",npl);FS.set("wt",B.wt);FS.set("ob",1);FS.patch("set",{wRem:S.rem!=="none"});
 }catch(e){ok=false}
 if(!ok){finished=false;toast("Не удалось сохранить. Попробуйте ещё раз");return}
 if(!FS.persistent())toast("Память браузера недоступна, данные сохранятся до закрытия");
 setCta("Готово");hint.textContent="";pu(cta);pulse(mark);buzz([10,40,10]);
 if(B.profile.coach.mode==="has"&&B.profile.coach.code)send({t:"coach-link",code:B.profile.coach.code});
 setTimeout(function(){send({t:"ob-done"})},480)}

/* навигация */
var strip=$("#strip"),scrs=$$(".scr"),cta=$("#cta"),hint=$("#hint"),app=$("#app"),top=$("#top"),markf=$("#markf"),mark=$("#mark");
function valid(){switch(idx){case ST.goal:return S.goal!==null;case ST.where:return !!S.where;case ST.exp:return !!S.exp;case ST.sex:return !!S.sex;case ST.age:return ageOk();case ST.cau:return S.cW;case ST.coach:return !!S.coach&&codeOk();default:return true}}
var HINT={};HINT[ST.goal]="Выберите цель";HINT[ST.where]="Выберите, где занимаетесь";HINT[ST.exp]="Выберите уровень";HINT[ST.sex]="Выберите вариант";HINT[ST.age]="Подходит возраст от 14 до 100 лет";HINT[ST.cau]="Отметьте, что согласны и принимаете ответственность";HINT[ST.coach]="Выберите вариант";
function upd(){var ok=valid(),h=HINT[idx]||"";if(idx===ST.coach&&S.coach&&!codeOk())h="Код тренера: от 4 символов, или оставьте поле пустым";cta.disabled=!ok;if(!(finished&&idx===ST.plan))hint.textContent=ok?"":h}
var CTAT=["Начать","Дальше","Дальше","Дальше","Дальше","Дальше","Дальше","Дальше","Дальше","Дальше","Дальше","Показать мой план","Начать"];
var desktop=false;try{desktop=matchMedia("(hover:hover) and (pointer:fine)").matches}catch(e){}
function zone(){app.style.setProperty('--bz',Math.round(app.clientHeight*(idx===ST.cau?.2:.27))+'px');app.style.setProperty('--wz',Math.round(app.clientHeight*.104)+'px')}
function fit(){zone();return;if(idx===0){view.style.height="";return}var bot=$(".bot"),sc=scrs[idx],avail=app.clientHeight-top.offsetHeight-bot.offsetHeight-8,h=Math.min(sc.scrollHeight,avail);view.style.height=Math.max(120,h)+"px"}
function setCta(t){cta.setAttribute("aria-label",t||"Дальше");cta.dataset.cap=(idx===ST.coach||idx===ST.plan||finished)?(t||""):"";hint.dataset.cap=cta.dataset.cap}
function go(i,free){i=clamp(i,0,STEPS-1);if(!free&&i>idx&&!valid())return;
 if(i===ST.plan)buildPlan();
 if(idx===ST.age&&i>idx)S.noAge=false;
 if(i!==ST.name&&document.activeElement&&(document.activeElement===nm||document.activeElement===code))document.activeElement.blur();
 idx=i;app.classList.toggle("w0",i===0);fit();setTimeout(fit,0);maxSeen=Math.max(maxSeen,i);strip.style.transform="translateX(-"+i*100+"%)";
 scrs.forEach(function(s,j){if(j===i)setTimeout(function(){s.classList.add("live")},120);else s.classList.remove("live")});
 top.classList.toggle("hide",i===0);var stp=$("#stp");stp.textContent=(i>=1&&i<=ST.coach)?"Шаг "+i+" из "+ST.coach:"";$("button#back").classList.toggle("off",i<1);$("#skip").classList.toggle("off",i!==ST.name&&i!==ST.age);
 markf.style.strokeDashoffset=1-Math.min(1,i/(STEPS-2));setCta(CTAT[i]);upd();
 if(i===ST.rhythm){setTimeout(function(){dPlace(true)},60);setTimeout(function(){if(idx===ST.rhythm)demo()},500)}
 if(i===ST.h)rH.apply();if(i===ST.w)rW.apply();if(i===ST.age)setWheels();if(i===ST.cau)renderCau();if(i===ST.coach)coachLbl();
 if(i===ST.name&&desktop)setTimeout(function(){if(idx===ST.name)try{nm.focus({preventScroll:true})}catch(e){}},700);
 scrs[i].scrollTop=0}
function autoNext(from){return;clearTimeout(autoNext._t);autoNext._t=setTimeout(function(){if(idx===from){pulse(mark);go(idx+1)}},520)}
function pulse(el){el.classList.remove("pulse");el.offsetWidth;el.classList.add("pulse")}
function orbTap(el){el.classList.remove("tap");el.offsetWidth;el.classList.add("tap");clearTimeout(el._t);el._t=setTimeout(function(){el.classList.remove("tap")},900)}
var orbEl=$("#orb");function startOb(){if(idx!==ST.welcome)return;orbTap(orbEl);pulse(orbEl);buzz([14,30,10]);setTimeout(function(){if(idx===ST.welcome)go(ST.name)},420)}
orbEl.onclick=startOb;orbEl.onkeydown=function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();startOb()}};
cta.addEventListener("pointerdown",function(){if(!cta.disabled)buzz(10)});
cta.onclick=function(){if(cta.disabled)return;orbTap(cta);
 if(idx===ST.welcome){startOb();return}
 if(idx===ST.plan){finish();return}
 pulse(mark);buzz([10,24,8]);setTimeout(function(){go(idx+1)},260)};
$("button#back").onclick=function(){go(idx-1,true)};
$("#skip").onclick=function(){if(idx===ST.name){S.name="";nm.value="";go(idx+1,true)}else if(idx===ST.age){go(idx+1,true);S.noAge=true}};
/* свайп между шагами */
var sx=null,sy=null,moved=false,view=$("#view");
view.addEventListener("pointerdown",function(e){return;if(e.target.closest(".ruler,.wheel,.sig,.chips,input"))return;sx=e.clientX;sy=e.clientY;moved=false});
view.addEventListener("pointermove",function(e){if(sx==null)return;var dx=e.clientX-sx,dy=e.clientY-sy;if(!moved&&Math.abs(dx)>14&&Math.abs(dx)>Math.abs(dy)*1.4){moved=true;strip.classList.add("drag")}if(moved){var w=view.offsetWidth;if((idx===0&&dx>0)||(idx===STEPS-1&&dx<0))dx*=.3;strip.style.transform="translateX("+(-idx*w+dx)+"px)"}});
var noClk=false;view.addEventListener("click",function(e){if(noClk){e.stopPropagation();e.preventDefault()}},true);
function sEnd(e){if(sx==null)return;var dx=e.clientX-sx;sx=null;if(moved){noClk=true;setTimeout(function(){noClk=false},80)}strip.classList.remove("drag");if(moved&&Math.abs(dx)>view.offsetWidth*.22){go(idx+(dx<0?1:-1),dx>0)}strip.style.transform="translateX(-"+idx*100+"%)";moved=false}
view.addEventListener("pointerup",sEnd);view.addEventListener("pointercancel",sEnd);

/* повторное прохождение и сообщения shell */
function redo(){finished=false;BUILT=null;if(fromProfile())syncUI();setCta(CTAT[idx]);go(ST.name,true)}
addEventListener("message",function(e){var m=e.data;if(!m||m.f!=="forma"||m.from!=="shell")return;
 if(m.t==="redo")redo();
 else if(m.t==="show"){dPlace(true);minsSeg.place();if(idx===ST.h)rH.apply();if(idx===ST.w)rW.apply();if(idx===ST.age)setWheels()}});

var isRedo=/[?&]redo\b/.test(location.search);
if(fromProfile())syncUI();
go(0,true);try{var ro=new ResizeObserver(function(){fit()});scrs.forEach(function(x){ro.observe(x);Array.prototype.forEach.call(x.children,function(c){ro.observe(c)})})}catch(e){}window.addEventListener("resize",fit);ticks(rbk,S.days);
if(isRedo)go(ST.name,true);
send({t:"hello"});
})();

function fitQ(){Array.prototype.forEach.call(document.querySelectorAll(".scr .q,.welcome .wtx h2"),function(q){q.style.fontSize="";var fs=20,w=q.clientWidth;while(q.scrollWidth>w+0.5&&fs>13){fs-=.5;q.style.fontSize=fs+"px"}})}
addEventListener("resize",fitQ);if(document.fonts)document.fonts.ready.then(fitQ);setTimeout(fitQ,50);
