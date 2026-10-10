/*STORE_BEGIN*/
/* Хранилище Forma: данные живут на устройстве (localStorage), общие для всех экранов приложения */
var FS=(function(){
 var P="forma.",cache={},subs=[],okLS=true,MEMO=(function(){var w=window;try{for(var i=0;i<4;i++){var p=w.parent;if(!p||p===w)break;void p.document;w=p}}catch(e){}w.__FM=w.__FM||{};return w.__FM})();
 var DEF={profile:{},hist:[],wt:[],progs:null,plan:null,live:null,set:{wRem:true,notif:[]},ob:0,sync:{},demo:0,pend:[],nutr:null};
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

/*SYNC_BEGIN*/
/* Связь тренер–клиент через общую базу артефакта (db). Данные всегда сначала в телефоне; облако — копия для тренера.
   Документы:  meta/coach {code,name}  — код тренера (создаёт владелец артефакта)
               clients/<uid> {...}      — снимок клиента (пишет клиент, читает тренер)
               inbox/<uid>   {text,t,from} — заметка тренера клиенту (пишет тренер, читает клиент) */
var SYNC=(function(){
 var db=null,uid=null,owner=false,H=null,unsub=[],pushT=null,lastPush=0,codeSeen=null;
 function gen(){var a="ABCDEFGHJKLMNPQRSTUVWXYZ23456789",s="";for(var i=0;i<6;i++)s+=a.charAt(Math.floor(Math.random()*a.length));return s}
 function sy(o){H.setSync(o)}
 function snapshot(){
  var p=H.get("profile")||{},hist=(H.get("hist")||[]).filter(function(h){return h&&h.d}).slice(-40),wt=(H.get("wt")||[]).filter(function(x){return x&&x.d&&isFinite(+x.v)}).slice(-60),
  today=H.today(),d7=H.add(today,-6),d30=H.add(today,-29);
  function cmp(h){return {d:h.d,k:h.k||"",wn:h.wn||"",pn:h.pn||"",t:h.t||"",sec:+h.sec||0,kcal:+h.kcal||0,pct:+h.pct||0,vol:+h.vol||0,tn:h.tn||"",
   ex:(h.ex||[]).map(function(x){return {id:x.id,n:x.n||"",mode:x.mode,eff:x.eff||0,my:x.my||"",pain:!!x.pain,sets:(x.sets||[]).map(function(s){return {v:s.v,w:s.w,t:s.t,done:!!s.done}})}})}}
  var o={name:p.name||"Клиент",updated:Date.now(),
   profile:{name:p.name||"",sex:p.sex||"",birth:p.birth||"",h:p.h||null,w:p.w||null,bf:p.bf||null,goal:p.goal||"",lvl:p.lvl||1,where:p.where||"",cau:p.cau||[],nut:p.nut||null},
   stats:{n7:hist.filter(function(h){return h.d>=d7}).length,n30:hist.filter(function(h){return h.d>=d30}).length,last:hist.length?hist[hist.length-1].d:""},
   wt:wt,hist:hist.map(cmp)};
  var guard=0;while(JSON.stringify(o).length>200000&&guard++<6){o.hist=o.hist.slice(Math.ceil(o.hist.length/3));o.wt=o.wt.slice(-30)}
  return o}
 function push(){if(!db||owner||!uid)return Promise.resolve();var p=H.get("profile")||{},co=p.coach||{};if(!co.code||H.getSync().status==="badcode")return Promise.resolve();
  lastPush=Date.now();return db.doc("clients/"+uid).set(snapshot()).then(function(){sy({status:"ok",pushed:Date.now()})},function(e){sy({status:"offline",err:String(e&&e.code||"")})})}
 function schedule(){if(!db||owner)return;clearTimeout(pushT);pushT=setTimeout(push,Math.max(1500,4000-(Date.now()-lastPush)))}
 function watchClients(){var u=db.collection("clients").onSnapshot(function(q){var m={};q.docs.forEach(function(d){var v=d.data();if(v)m[d.id]=v});sy({clients:m,status:"ok"})},function(e){sy({status:"offline",err:String(e&&e.code||"")})});unsub.push(u)}
 function watchInbox(){var u=db.doc("inbox/"+uid).onSnapshot(function(s){if(!s.exists)return;var d=s.data()||{};if(!d.text)return;var cur=(H.getSync().note)||{};if(+cur.t===+d.t&&cur.text===d.text)return;sy({note:{text:String(d.text),from:String(d.from||"Тренер"),t:+d.t||Date.now()}})},function(){});unsub.push(u)}
 function link(code){ /* клиент вводит код тренера */
  if(!db||owner)return;code=String(code||"").toUpperCase().replace(/[^A-Z0-9]/g,"");if(!code)return;sy({status:"wait"});
  db.doc("meta/coach").get().then(function(s){var d=s.exists?s.data():null;
   if(!d||String(d.code)!==code){sy({status:"badcode"});return}
   var p=H.get("profile")||{};p.coach={mode:"has",code:code,name:d.name||""};H.set("profile",p);sy({status:"ok",role:"client"});push();watchInbox()},
   function(){sy({status:"offline"})})}
 function unlink(){sy({status:"idle",note:null});unsub.forEach(function(u){try{u()}catch(e){}});unsub=[]}
 function note(cid,text){if(!db||!owner||!cid)return Promise.reject();text=String(text||"").trim().slice(0,1500);if(!text)return Promise.reject();
  var p=H.get("profile")||{};return db.doc("inbox/"+cid).set({text:text,t:Date.now(),from:p.name||"Тренер"})}
 return {
  init:function(hooks,dbns,user){H=hooks;db=dbns;if(!db||!user){sy({status:"nolink",role:H.getSync().role==="coach"?"coach":"client"});return Promise.resolve(false)}
   return Promise.all([user.isOwner(),user.id?user.id():null]).then(function(r){owner=!!r[0];uid=r[1]||null;
    if(owner){sy({role:"coach",uid:uid,status:"wait"});
     return db.doc("meta/coach").get().then(function(s){var d=s.exists?s.data():null,code=d&&d.code;
      var p=H.get("profile")||{};
      if(!code){code=gen();return db.doc("meta/coach").set({code:code,name:p.name||"Тренер",t:Date.now()}).then(function(){sy({code:code});watchClients();return true})}
      sy({code:code});if(p.name&&d.name!==p.name)db.doc("meta/coach").update({name:p.name}).catch(function(){});watchClients();return true})}
    sy({role:"client",uid:uid,status:uid?"idle":"nolink"});if(!uid)return false;
    var co=(H.get("profile")||{}).coach||{};if(co.code){link(co.code)}return true})},
  onStore:function(k){if(k==="hist"||k==="wt"||k==="profile"||k==="plan")schedule()},
  link:link,unlink:unlink,note:note,push:push,snapshot:snapshot,_gen:gen};
})();
/*SYNC_END*/

/*MIG_BEGIN*/
/* Миграция: старые id демо-каталога (45 упражнений) → id полного каталога. Идемпотентно. */
(function(){
var MAP={"trx-bridge":"276","trx-curl":"275","trx-bulg":"273","trx-squat":"269","trx-row":"252","trx-chest":"257","trx-fly":"261","trx-y":"262","trx-face":"266","trx-pike":"277","trx-tri":"268","trx-bi":"267","trx-sldl":"522","trx-saw":"839",
"rdl":"82","hipthrust":"100","bsquat":"63","bench":"71","brow":"87","dpress":"113","lateral":"126","incline":"111","drow":"123","dcurl":"131","fpress":"142","lunge":"149","goblet":"143","calf":"757","heel":"758","shrug":"130","latpull":"24","legpress":"1","legcurl":"7","hyper":"227","cable":"54",
"bandbr":"305","bandab":"306","bandpull":"295","bandpu":"311","plank":"230","crunch":"237","legraise":"240","pushk":"196","wrist":"755","farmer":"157"};
function fix(ex){var n=0;(ex||[]).forEach(function(x){if(x&&MAP[x.id]){x.id=MAP[x.id];n++}});return n}
window.FMIG=function(){var ch=0,pg,h,lv;
 try{pg=FS.get("progs");if(pg&&Array.isArray(pg.programs)){pg.programs.forEach(function(p){(p.workouts||[]).forEach(function(w){ch+=fix(w.ex)})});if(ch)FS.save("progs")}}catch(e){}
 try{h=FS.get("hist");if(Array.isArray(h)){var c2=0;h.forEach(function(e){c2+=fix(e.ex)});if(c2){FS.save("hist");ch+=c2}}}catch(e){}
 try{lv=FS.get("live");if(lv&&Array.isArray(lv.ex)){var c3=fix(lv.ex);if(c3){FS.save("live");ch+=c3}}}catch(e){}
 return ch};
window.FMIG_MAP=MAP;
})();
/*MIG_END*/


/* Зеркало данных в IndexedDB: если система очистила localStorage, данные и онбординг возвращаются из копии */
var MIR=(function(){var DB="forma-mirror",ST="kv",KEY="snap",T=0;
 function open(){return new Promise(function(res,rej){try{var r=indexedDB.open(DB,1);r.onupgradeneeded=function(){r.result.createObjectStore(ST)};r.onsuccess=function(){res(r.result)};r.onerror=function(){rej(r.error)}}catch(e){rej(e)}})}
 function ls(){var o={};try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf("forma.")===0)o[k]=localStorage.getItem(k)}}catch(e){}return o}
 function put(v){return open().then(function(db){return new Promise(function(res){var tx=db.transaction(ST,"readwrite"),os=tx.objectStore(ST);if(v)os.put(v,KEY);else os.delete(KEY);tx.oncomplete=function(){db.close();res()};tx.onerror=function(){db.close();res()}})}).catch(function(){})}
 function save(){clearTimeout(T);T=setTimeout(function(){var o=ls();if(o["forma.ob"]==="1")put({t:Date.now(),d:o});else put(null)},1200)}
 function need(){try{return localStorage.getItem("forma.ob")==null}catch(e){return true}}
 function restore(){return Promise.race([open().then(function(db){return new Promise(function(res){var rq=db.transaction(ST).objectStore(ST).get(KEY);
  rq.onsuccess=function(){db.close();var v=rq.result;if(v&&v.d&&v.d["forma.ob"]==="1"){try{Object.keys(v.d).forEach(function(k){if(localStorage.getItem(k)==null)localStorage.setItem(k,v.d[k])})}catch(e){}}res()};rq.onerror=function(){db.close();res()}})}).catch(function(){}),new Promise(function(res){setTimeout(res,1500)})])}
 return {save:save,need:need,restore:restore}})();
try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}

(function(){
"use strict";
var HEAD='<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="color-scheme" content="light"></head><body>';
var ORDER=["home","work","nutr","prog","prof","onb"],F={},ready={},pend=[],cur=null,stage=document.getElementById("stage");
window.FCAT=FCAT;
function mk(id){var f=document.createElement("iframe");f.name="forma-emb";f.title=id;f.dataset.id=id;f.setAttribute("allow","clipboard-write"+(id==="nutr"?"; camera":""));f.addEventListener("load",function(){if(f.dataset.ld){sai(f);nat(f)}});stage.appendChild(f);F[id]=f;ready[id]=false;return f}
/* кадр получает разметку при первом показе; остальные подгружаются по очереди после первого, чтобы запуск не парсил шесть экранов разом */
function load(id){var f=F[id];if(!f||f.dataset.ld||!FRAMES[id])return;f.dataset.ld="1";f.srcdoc=HEAD+FRAMES[id]+"</body></html>"}
var PT=[];
function warm(first){PT.forEach(clearTimeout);PT=[];if(route()==="onb")return;var go=function(){var i=0;ORDER.forEach(function(id){if(id===first||id==="onb")return;PT.push(setTimeout(function(){load(id)},120*(++i)))})};
 var f=F[first];if(f&&f.dataset.ld){var done=false,run=function(){if(done)return;done=true;setTimeout(go,100)};f.addEventListener("load",run);setTimeout(run,1500)}else go()}
function build(){PT.forEach(clearTimeout);stage.innerHTML="";F={};ready={};ORDER.forEach(function(id){if(FRAMES[id])mk(id)})}
/* безопасные зоны iPhone: env() внутри iframe ненадёжен, поэтому shell измеряет их сам и отдаёт кадрам как --sai-* */
function saiVals(){try{var cs=getComputedStyle(document.getElementById("sai"));return [cs.paddingTop,cs.paddingRight,cs.paddingBottom,cs.paddingLeft]}catch(e){return ["0px","0px","0px","0px"]}}
function sai(f){try{var d=f.contentDocument&&f.contentDocument.documentElement;if(!d)return;var v=saiVals();["t","r","b","l"].forEach(function(k,i){d.style.setProperty("--sai-"+k,v[i])})}catch(e){}}
function saiAll(){for(var k in F)if(F[k].dataset.ld)sai(F[k])}
/* единая «нативность» для всех экранов: без 300 мс задержки и серой вспышки, без выделения текста на кнопках, поля не меньше 16px (иначе iOS зумит страницу) */
var NAT="html{-webkit-tap-highlight-color:transparent;touch-action:manipulation;-webkit-text-size-adjust:100%}body{-webkit-touch-callout:none;-webkit-user-select:none;user-select:none}button,[role=button],a,summary,label{touch-action:manipulation;-webkit-tap-highlight-color:transparent}input,textarea,[contenteditable=true],.sel,[data-sel],code{-webkit-user-select:text;user-select:text;-webkit-touch-callout:default}";
function nat(f){try{var d=f.contentDocument;if(!d||!d.head||d.getElementById("forma-native"))return;var st=d.createElement("style");st.id="forma-native";st.textContent=NAT;d.head.appendChild(st);
 var fix=function(t){try{t=t&&t.closest&&t.closest("input,textarea,select");if(t&&parseFloat(f.contentWindow.getComputedStyle(t).fontSize)<16)t.style.fontSize="16px"}catch(e){}};
 d.addEventListener("pointerdown",function(e){fix(e.target)},true);d.addEventListener("focusin",function(e){fix(e.target)},true)}catch(e){}}
addEventListener("resize",saiAll);addEventListener("orientationchange",function(){setTimeout(saiAll,250)});
function post(w,m){m.f="forma";m.from="shell";try{F[w]&&F[w].contentWindow&&F[w].contentWindow.postMessage(m,"*")}catch(e){}}
function bcast(k,except){for(var id in F)if(id!==except)post(id,{t:"fs",k:k})}
var trT=0;
var TABO=["home","work","nutr","prog","prof"];
function show(w,dirOpt){if(!F[w]){return}load(w);var prev=cur;cur=w;var ip=TABO.indexOf(prev),iw=TABO.indexOf(w),dir=dirOpt||((ip>=0&&iw>=0&&ip!==iw)?(iw>ip?1:-1):0);
 if(prev!==w){for(var k in F)if(k===w||k===prev)F[k].classList.add("tr");clearTimeout(trT);trT=setTimeout(function(){for(var k in F)F[k].classList.remove("tr")},900);
  if(dir&&F[prev]){var o=F[prev],nw=F[w];nw.style.transition="none";nw.style.transform="translateX("+(dir*28)+"px) scale(.985)";void nw.offsetWidth;nw.style.transition="";nw.style.transform="";o.style.transform="translateX("+(-dir*28)+"px) scale(.985)";setTimeout(function(){o.style.transform=""},780)}}
 for(var k in F)F[k].classList.toggle("on",k===w);post(w,{t:"show",from:ip,to:iw,fi:ip})}
function whenReady(w,fn){var n=0,t=setInterval(function(){if(ready[w]||++n>40){clearInterval(t);setTimeout(fn,300)}},80)}
function flush(){pend=pend.filter(function(m){if(!ready.work)return true;post("work",m);return false})}
function route(){return FS.get("ob")===1?"home":"onb"}
/* ----- хуки для sync ----- */
var hooks={get:function(k){return FS.get(k)},set:function(k,v){FS.set(k,v);bcast(k)},today:todayIso,add:addDays,
 getSync:function(){var v=FS.get("sync");return v&&typeof v==="object"&&!Array.isArray(v)?v:{}},
 setSync:function(o){var s=FS.get("sync")||{};for(var k in o)s[k]=o[k];FS.set("sync",s);bcast("sync")}};
/* ----- сообщения от экранов ----- */
addEventListener("message",function(e){var m=e.data;if(!m||m.f!=="forma"||!m.from||m.from==="shell")return;
 switch(m.t){
  case "hello":ready[m.from]=true;if(m.from==="work")flush();break;
  case "fs":bcast(m.k,m.from);try{SYNC.onStore(m.k)}catch(x){}MIR.save();break;
  case "tab":if(F[m.to]){show(m.to)}break;
  case "swipe":{var si=TABO.indexOf(cur)+(m.dir>0?1:-1);if(si>=0&&si<TABO.length)show(TABO[si],m.dir>0?1:-1);break}
  case "find":{/* глубокая ссылка в Библиотеку: {t:"find", q|eq|id} → заявка libq, экран читает её один раз при показе */
   var o={};if(m.q!=null&&m.q!=="")o.q=String(m.q);if(m.eq)o.eq=String(m.eq);if(m.id)o.id=String(m.id);
   try{FS.set("libq",o)}catch(x){}show("work");pend.push({t:"sub",i:3,f:"forma",from:"home"});flush();break}
  case "open":case "sub":show("work");pend.push(m);flush();break;case "meal":show("nutr");whenReady("nutr",function(){post("nutr",{t:"addmeal"})});break;
  case "ob-done":show("home");post("home",{t:"show"});warm("home");var pl=FS.get("plan"),pg=FS.get("progs");if(!(pg&&pg.programs&&pg.programs.length)){/* пустой старт — конструктор */setTimeout(function(){show("work");pend.push({t:"open",nw:1,f:"forma",from:"home"});flush()},500)}break;
  case "redo":show("onb");post("onb",{t:"redo"});break;
  case "reload":build();setTimeout(function(){show(route());warm(cur)},60);break;
  case "coach-link":try{SYNC.link(m.code)}catch(x){}break;
  case "coach-unlink":try{SYNC.unlink()}catch(x){}break;
  case "coach-note":try{SYNC.note(m.uid,m.text).then(function(){},function(){hooks.setSync({noteErr:Date.now()})})}catch(x){}break;
 }});
/* ----- запуск ----- */
function boot(){try{FMIG()}catch(e){}build();show(route());warm(cur)}
if(MIR.need())MIR.restore().then(boot,boot);else boot();setInterval(MIR.save,30000);addEventListener("pagehide",function(){MIR.save()});
document.addEventListener("visibilitychange",function(){if(document.visibilityState==="visible"&&F[cur])post(cur,{t:"show"});else{try{SYNC.push()}catch(e){}}});
window.__forma={show:show,frames:F,hooks:hooks};
/* ----- установка на экран «Домой» (подсказки для Safari) ----- */
(function(){try{var h=document.head,add=function(t,a){var e=document.createElement(t);for(var k in a)e.setAttribute(k,a[k]);h.appendChild(e)};
 var vp=h.querySelector('meta[name="viewport"]');if(vp){if(!/viewport-fit/.test(vp.content))vp.content=vp.content+(vp.content?",":"")+"viewport-fit=cover"}else add("meta",{name:"viewport",content:"width=device-width,initial-scale=1,viewport-fit=cover"});
 add("meta",{name:"apple-mobile-web-app-capable",content:"yes"});add("meta",{name:"mobile-web-app-capable",content:"yes"});add("meta",{name:"apple-mobile-web-app-title",content:"Forma"});add("meta",{name:"apple-mobile-web-app-status-bar-style",content:"default"});add("meta",{name:"theme-color",content:"#ffffff"});
 }catch(e){}})();
/* ----- облачная связь тренер–клиент (только внутри артефакта) ----- */
(function(){var n=0;function go(){try{if(!window.claude||!claude.use){hooks.setSync({status:"nolink"});return}
 Promise.all([claude.use("db"),claude.use("user")]).then(function(r){SYNC.init(hooks,r[0],r[1])},function(){hooks.setSync({status:"nolink"})})}catch(e){hooks.setSync({status:"nolink"})}}
 setTimeout(go,400)})();
})();