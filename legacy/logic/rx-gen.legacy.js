/* Извлечено из PWA (legacy/screens/work/logic.js, блоки RX и GEN) без изменений. Чистый JS, зависит только от FCAT.
   Использование в Node: см. golden/make-golden.js. Эталон для проверки переноса на TypeScript. */
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
if(typeof module!=="undefined")module.exports={RX:typeof RX!=="undefined"?RX:null,GEN:GEN};
