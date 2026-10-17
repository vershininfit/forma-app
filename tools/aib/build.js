// Сборка: встраивает ассистента тренера в кадр «Тренировки» index.html.
// node build.js <in index.html> <out index.html> [--gfonts]
const fs = require("fs");
const [, , IN, OUT, ...flags] = process.argv;
const src = fs.readFileSync(IN, "utf8");
const i = src.indexOf("var FRAMES="), e = src.indexOf("\n", i);
const line = src.slice(i, e);
let F; eval(line.replace("var FRAMES=", "F="));
let w = F.work;
if (w.includes("id=\"aibE\"")) { console.error("уже встроено"); process.exit(1); }
const once = (s, a, b, label) => { const n = s.split(a).length - 1; if (n !== 1) throw new Error("якорь " + label + ": найдено " + n); return s.replace(a, () => b); };
const css = fs.readFileSync(__dirname + "/aib.css", "utf8");
const eng = fs.readFileSync(__dirname + "/aib.js", "utf8");
const ui = fs.readFileSync(__dirname + "/aib-ui.js", "utf8");
// 1) стили — в конец первого <style> (второе вхождение — строка внутри JS)
const st = w.indexOf("</style>"); w = w.slice(0, st) + css + "\n" + w.slice(st);
// 2) иконки
w = once(w, '<symbol id="note" viewBox="0 0 24 24"><path d="M5 4h14v12l-4 4H5zM15 20v-4h4M8.5 9h7M8.5 13h4"/></symbol>',
  '<symbol id="note" viewBox="0 0 24 24"><path d="M5 4h14v12l-4 4H5zM15 20v-4h4M8.5 9h7M8.5 13h4"/></symbol>' +
  '<symbol id="mic" viewBox="0 0 24 24"><path d="M12 3.5a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0v-5a3 3 0 0 0-3-3zM6 11a6 6 0 0 0 12 0M12 17v3.5M9 20.5h6"/></symbol>' +
  '<symbol id="aibw" viewBox="0 0 24 24"><path d="M4 7h10M4 12h7M4 17h9M18 4.5l.9 2 2 .9-2 .9-.9 2-.9-2-2-.9 2-.9zM17.5 13.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z"/></symbol>', "иконки");
// 3) строка входа в конструкторе
w = once(w, `'<div id="mapHost"></div>'+'<div class="addx sfield" id="addX"`,
  `'<div id="mapHost"></div>'+'<div class="aibe" id="aibE" role="button" tabindex="0" aria-label="Надиктуйте или вставьте тренировку">'+ic("aibw")+'<span>Надиктуйте или вставьте тренировку</span><button class="aibm" id="aibM" type="button" aria-label="Диктовать">'+ic("mic")+'</button></div>'+'<div class="addx sfield" id="addX"`, "вход");
// 4) замены в карточке упражнения
w = once(w, `+'<div class="tbl"><span class="th">№</span>`, `+aibAltLine(x)+'<div class="tbl"><span class="th">№</span>`, "карточка");
w = once(w, `else if(k==="swap"){startSwap(x.u)}`, `else if(k==="swap"){startSwap(x.u)}\n else if(k==="alt"){aibAltSwap(x,b.dataset.id)}`, "клик");
// 5) движок + интерфейс перед стартом кадра
w = once(w, "/* старт */\nbuildCat();", eng + "\n" + ui + "\n/* старт */\nbuildCat();", "старт");
if (flags.includes("--gfonts")) w = w.replace('<link rel="stylesheet" href="fonts/fonts.css">', '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@300;400;500;600&display=swap">');
F.work = w;
const newLine = "var FRAMES=" + JSON.stringify(F).replace(/<\//g, "<\\/").split(String.fromCharCode(0x2028)).join("\\u2028").split(String.fromCharCode(0x2029)).join("\\u2029") + ";";
let out = src.slice(0, i) + newLine + src.slice(e);
// 6) микрофон для кадра «Тренировки»
const allowOld = `f.setAttribute("allow","clipboard-write; web-share"+(id==="nutr"?"; camera":""));`;
if (out.includes(allowOld)) out = out.replace(allowOld, `f.setAttribute("allow","clipboard-write; web-share"+(id==="nutr"?"; camera":"")+(id==="work"?"; microphone":""));`);
else console.warn("allow-атрибут не найден: микрофон в кадре может быть закрыт");
fs.writeFileSync(OUT, out);
console.log("ok", OUT, (out.length / 1e6).toFixed(2) + " МБ");
