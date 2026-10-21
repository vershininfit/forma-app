// Обновление уже встроенного ассистента в index.html: node patch.js <index.html> <old-dir> <out> [--gfonts]
// old-dir — папка с версиями aib.js/aib-ui.js/aib.css, которые сейчас стоят в index.html.
const fs = require("fs");
const [, , IN, OLD, OUT, ...flags] = process.argv;
const src = fs.readFileSync(IN, "utf8");
const i = src.indexOf("var FRAMES="), e = src.indexOf("\n", i);
let F; eval(src.slice(i, e).replace("var FRAMES=", "F="));
let w = F.work;
const once = (s, a, b, label) => { const n = s.split(a).length - 1; if (n !== 1) throw new Error("якорь " + label + ": найдено " + n); return s.replace(a, () => b); };
for (const f of ["aib.js", "aib-ui.js", "aib.css"]) {
  const o = fs.readFileSync(OLD + "/" + f, "utf8"), nw = fs.readFileSync(__dirname + "/" + f, "utf8");
  if (o !== nw) w = once(w, o, nw, f);
}
if (!w.includes('<symbol id="aibimg"')) w = once(w, '<symbol id="mic" ', '<symbol id="aibimg" viewBox="0 0 24 24"><path d="M5 5.5h14a1.5 1.5 0 0 1 1.5 1.5v10a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 17V7A1.5 1.5 0 0 1 5 5.5zM3.8 15.5l4.6-4.4 3.6 3.4 2.6-2.4 5.6 5.1"/><circle cx="15.5" cy="9.5" r="1.4"/></symbol><symbol id="mic" ', "иконка");
const entryOld = `<span>Надиктуйте или вставьте тренировку</span><button class="aibm" id="aibM" type="button" aria-label="Диктовать">'+ic("mic")+'</button></div>'`;
if (w.includes(entryOld)) w = once(w, entryOld, `<span>Голос, текст или скриншот</span><button class="aibm" id="aibI" type="button" aria-label="Со скриншота">'+ic("aibimg")+'</button><button class="aibm" id="aibM" type="button" aria-label="Диктовать">'+ic("mic")+'</button></div>'`, "вход");
w = w.split('aria-label="Надиктуйте или вставьте тренировку"').join('aria-label="Надиктуйте, вставьте или загрузите скриншот тренировки"');
if (flags.includes("--gfonts")) w = w.replace('<link rel="stylesheet" href="fonts/fonts.css">', '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@300;400;500;600&display=swap">');
F.work = w;
const line = "var FRAMES=" + JSON.stringify(F).replace(/<\//g, "<\\/").split(String.fromCharCode(0x2028)).join("\\u2028").split(String.fromCharCode(0x2029)).join("\\u2029") + ";";
fs.writeFileSync(OUT, src.slice(0, i) + line + src.slice(e));
console.log("ok", OUT, ((src.length - (e - i) + line.length) / 1e6).toFixed(2) + " МБ");
