/* ---------- ассистент тренера: «Надиктуйте или вставьте тренировку» (этап 1, без сети) ---------- */
var aib = { st: null, rec: null, recOn: false, stopping: false, base: "", t: 0 };
function aibSet() { var s = FS.get("set"); return s && typeof s === "object" && !Array.isArray(s) ? s : { wRem: true, notif: [] }; }
function aibSaveSet(f) { var s = aibSet(); f(s); FS.set("set", s); }
function aibAliases() { var a = aibSet().aia; return a && typeof a === "object" ? a : {}; }
function aibHist() {
  var h = {};
  (D.programs || []).forEach(function (p) { (p.workouts || []).forEach(function (w) { (w.ex || []).forEach(function (x) { if (x && x.id) h[x.id] = (h[x.id] || 0) + 1; }); }); });
  return h;
}
function aibCtx() { buildCat(); return { cat: EX, hist: aibHist(), aliases: aibAliases(), prof: myProf(), rx: rxSt }; }
function aibSheet() {
  var s = $("#aibSheet");
  if (!s) { $("#srchSheet").insertAdjacentHTML("afterend", '<div class="sheet" id="aibSheet"><div class="grab"></div><div class="aib-b" id="aibB"></div></div>'); s = $("#aibSheet"); aibBindSheet(s); }
  return s;
}
function aibOpen(withMic) {
  if (!con) return; aibSheet(); aibInput(aibSet().aib || ""); openSheet("aibSheet");
  if (withMic) setTimeout(aibMicStart, 260);
}
/* --- экран ввода --- */
function aibInput(text) {
  aib.st = null;
  $("#aibB").innerHTML = '<h3>Собрать тренировку</h3><div class="sub">Вставьте из заметок или надиктуйте упражнения, подходы, вес и отдых</div>' +
    '<div class="aib-tw"><textarea id="aibT" class="aib-t" rows="6" autocapitalize="sentences" spellcheck="false" placeholder="Присед 4×8 60 кг, отдых 2 мин&#10;Румынка 3×10 40&#10;Планка 3×45 с"></textarea><div class="aib-live" id="aibL"></div></div>' +
    '<div class="aib-hint" id="aibH"></div>' +
    '<div class="aib-row"><button class="aib-mic" id="aibMic" type="button" aria-label="Диктовать">' + ic("mic") + '</button><button class="cta go" id="aibGo" type="button" disabled>Собрать</button></div>';
  var t = $("#aibT"); t.value = text || ""; aibGoSync();
}
function aibGoSync() { var t = $("#aibT"), g = $("#aibGo"); if (t && g) g.disabled = !t.value.trim(); }
function aibHint(s, warn) { var h = $("#aibH"); if (!h) return; h.textContent = s || ""; h.classList.toggle("on", !!s); h.classList.toggle("w", !!warn); }
/* --- голос: распознавание браузера (бесплатно); если недоступно, диктовка с клавиатуры iPhone --- */
function aibSR() { return window.SpeechRecognition || window.webkitSpeechRecognition || null; }
function aibKbd(why) {
  aibRecUi(false);
  aibHint((why ? why + " " : "") + "Нажмите значок микрофона на клавиатуре и диктуйте, затем «Собрать».");
  var t = $("#aibT"); if (t) { try { t.focus(); var n = t.value.length; t.setSelectionRange(n, n); } catch (e) {} }
}
function aibRecUi(on) { var m = $("#aibMic"); if (m) { m.classList.toggle("aib-on", on); m.setAttribute("aria-label", on ? "Остановить" : "Диктовать"); } if (!on) { var l = $("#aibL"); if (l) l.textContent = ""; } }
function aibMicStart() {
  var SR = aibSR(), t = $("#aibT"); if (!t) return;
  if (!SR) { aibKbd(); return; }
  if (aib.recOn) { aibMicStop(false); return; }
  var r; try { r = new SR(); } catch (e) { aibKbd(); return; }
  aib.rec = r; aib.recOn = true; aib.stopping = false; aib.base = t.value.trim() ? t.value.replace(/\s*$/, "\n") : "";
  r.lang = "ru-RU"; r.continuous = true; r.interimResults = true;
  var started = false;
  r.onstart = function () { started = true; aibRecUi(true); aibHint("Говорите. Скажите «готово» или нажмите на круг, чтобы закончить."); buzz(8); };
  r.onresult = function (e) {
    if (!$("#aibSheet.on")) { aibMicStop(false); return; }
    var fin = "", tmp = "";
    for (var i = 0; i < e.results.length; i++) { var x = e.results[i]; if (x.isFinal) fin += x[0].transcript + " "; else tmp += x[0].transcript; }
    var done = /(^|\s)готово[\s.!]*$/i.test(fin.trim());
    if (done) fin = fin.replace(/(^|\s)готово[\s.!]*$/i, " ");
    t.value = (aib.base + fin.replace(/\s+/g, " ").trim()).replace(/^\s+/, ""); aibGoSync();
    var l = $("#aibL"); if (l) l.textContent = tmp;
    if (done) { aibMicStop(true); }
  };
  r.onerror = function (e) {
    var er = e && e.error;
    if (er === "no-speech" || er === "aborted") return;
    aib.recOn = false; aibRecUi(false);
    aibKbd(er === "not-allowed" || er === "service-not-allowed" ? "Доступ к микрофону закрыт для приложения." : "Распознавание речи недоступно.");
  };
  r.onend = function () {
    if (aib.recOn && !aib.stopping) { aib.base = t.value.trim() ? t.value.replace(/\s*$/, " ") : ""; try { r.start(); return; } catch (e) {} }
    aib.recOn = false; aibRecUi(false);
    if (aib.stopping === "go") aibRun();
    else if (!$("#aibH") || !/микрофон|недоступно/.test($("#aibH").textContent)) aibHint("");
  };
  try { r.start(); } catch (e) { aib.recOn = false; aibKbd(); return; }
  clearTimeout(aib.t); aib.t = setTimeout(function () { if (!started && aib.recOn) { aib.recOn = false; try { r.abort(); } catch (e) {} aibKbd("Распознавание речи недоступно."); } }, 2500);
}
function aibMicStop(go) { aib.stopping = go ? "go" : true; aib.recOn = false; try { aib.rec && aib.rec.stop(); } catch (e) {} aibRecUi(false); buzz(6); if (!aib.rec) { if (go) aibRun(); } }
/* --- разбор --- */
function aibRun() {
  var t = $("#aibT"); if (!t || !t.value.trim()) return;
  var text = t.value; aibSaveSet(function (s) { s.aib = text; });
  var res; try { res = AIB.parse(text, aibCtx()); } catch (e) { aibHint("Не получилось разобрать текст. Проверьте запись и попробуйте ещё раз.", true); return; }
  var items = []; res.days.forEach(function (d, di) { d.items.forEach(function (it) { it.day = di; it.picked = false; it.alts = []; items.push(it); }); });
  if (!items.length) { aibHint("Не нашёл упражнений. Пример: «Присед 4×8 60 кг, отдых 2 мин».", true); return; }
  aib.st = { text: text, res: res, items: items };
  items.forEach(aibAltsOf);
  buzz([8, 30, 8]); aibDraft();
}
function aibAltsOf(it) {
  if (!it.id) { it.alts = []; return; }
  var ex = {}; aib.st.items.forEach(function (o) { if (o.id) ex[o.id] = 1; });
  try { it.alts = AIB.alts(it.id, { cat: EX, prof: myProf(), rx: rxSt, exclude: ex }); } catch (e) { it.alts = []; }
}
/* --- черновик --- */
function aibVal(it) {
  var e = it.id ? exOf(it.id) : null, a = [], n = it.sets || (it.reps && it.reps.length > 1 ? it.reps.length : null);
  var time = !!it.sec || (e && e.fmt === "time" && it.reps && !it.sec);
  var vv = time ? (it.sec || it.reps) : it.reps, nums = function (l, suf) { var u = l.filter(function (v, i) { return l.indexOf(v) === i; }); return (u.length === 1 ? String(u[0]) : l.join("/")).replace(/\./g, ",") + (suf || ""); };
  if (n || vv) a.push((n ? n + " × " : "") + (vv ? nums(vv, time ? " с" : "") : (time ? "" : "…")));
  if (it.kg) a.push(nums(it.kg, " кг"));
  if (it.rest != null) a.push("отдых " + it.rest + " с");
  if (it.side) a.push("на сторону");
  return a.length ? a.join(" · ") : "подходы по умолчанию";
}
function aibLabels(items) {
  var lab = [], n = 0, gseen = {}, letters = "абвгдеж";
  items.forEach(function (it, i) {
    var prev = items[i - 1];
    if (it.group && prev && prev.group === it.group && prev.day === it.day) { gseen[it.group]++; lab.push(n + letters.charAt(gseen[it.group])); }
    else { n++; if (it.group) { gseen[it.group] = 0; var nx = items[i + 1]; lab.push(nx && nx.group === it.group ? n + "а" : String(n)); } else lab.push(String(n)); }
    if (i + 1 < items.length && items[i + 1].day !== it.day) n = 0;
  });
  return lab;
}
function aibDraft() {
  var st = aib.st, items = st.items, chk = items.filter(function (it) { return it.conf !== "ok" && !it.picked && !it.skip; }).length, live = items.filter(function (it) { return !it.skip; }).length;
  var lab = aibLabels(items), h = "", lastDay = -1;
  h += '<div class="aib-top"><button class="aib-bk" id="aibBk" type="button">' + ic("back") + 'Текст</button><div class="aib-sum"><b>' + plural(live, ["упражнение", "упражнения", "упражнений"]) + '</b>' + (chk ? ' · <i>' + chk + ' проверить</i>' : '') + '</div></div>';
  h += '<div class="aib-list" id="aibList">';
  items.forEach(function (it, i) {
    if (st.res.days.length > 1 && it.day !== lastDay) { lastDay = it.day; var d = st.res.days[it.day]; h += '<div class="aib-day">' + esc(d.title || ("Тренировка " + (it.day + 1))) + (it.day > 0 ? '<span>новая тренировка в программе</span>' : '<span>в эту тренировку</span>') + '</div>'; }
    if (it.skip) { h += '<div class="aib-c skip" data-i="' + i + '"><span class="aib-raw">«' + esc(it.raw) + '» пропущено</span><button class="aib-lnk" data-a="unskip" type="button">Вернуть</button></div>'; return; }
    var e = it.id ? exOf(it.id) : null, st2 = e ? rxSt(e) : 0, need = (it.conf !== "ok" && !it.picked) || it.open;
    h += '<div class="aib-c' + (need ? " need" : "") + (it.id ? "" : " none") + (it.group ? " grp" : "") + '" data-i="' + i + '">';
    h += '<div class="aib-h"><i class="aib-n">' + lab[i] + '</i><button class="aib-t2" data-a="names" type="button">' + (need && it.conf !== "none" && !it.picked ? '<em class="aib-dot" aria-label="Проверьте"></em>' : '') +
      (e ? esc(e.n) : '<span class="aib-nf">Не нашёл в библиотеке</span>') + (st2 ? ' ' + rxBadge(st2) : '') + '</button><button class="aib-x" data-a="skip" type="button" aria-label="Убрать">' + ic("x") + '</button></div>';
    h += '<button class="aib-v" data-a="edit" type="button">' + esc(aibVal(it)) + '</button>';
    if (it.ed) {
      var time = !!it.sec || (e && e.fmt === "time" && !it.reps);
      h += '<div class="aib-ed">' +
        '<label>Подходы<input inputmode="numeric" data-f="sets" value="' + esc(it.sets || "") + '"></label>' +
        '<label>' + (time ? "Секунды" : "Повторы") + '<input inputmode="text" data-f="' + (time ? "sec" : "reps") + '" value="' + esc(((time ? it.sec : it.reps) || []).join("/")) + '"></label>' +
        '<label>Кг<input inputmode="text" data-f="kg" value="' + esc((it.kg || []).join("/").replace(/\./g, ",")) + '"></label>' +
        '<label>Отдых, с<input inputmode="numeric" data-f="rest" value="' + esc(it.rest == null ? "" : it.rest) + '"></label></div>';
    }
    h += '<div class="aib-raw">«' + esc(it.raw) + '»' + (function () { var rl = String(it.raw).toLowerCase(), nn = (it.notes || []).filter(function (x) { return rl.indexOf(String(x).toLowerCase()) < 0; }); return nn.length ? ' · ' + esc(nn.join("; ")) : ''; })() + '</div>';
    if (need) {
      var cs2 = (it.cand || []).filter(function (c) { return c.score !== 9; }).slice(0, 3);
      h += '<div class="aib-q">' + (it.id ? "Это упражнение? Нажмите на нужное" : "Похожие упражнения") + '</div><div class="aib-ch">' +
        cs2.map(function (c) { return '<button class="aib-chip' + (c.id === it.id ? " on" : "") + '" data-a="pick" data-id="' + esc(c.id) + '" type="button">' + esc(exOf(c.id).n) + '</button>'; }).join("") +
        '</div><div class="aib-sx"><input class="aib-si" data-a="find" placeholder="Найти другое" value="' + esc(it.q || "") + '" autocomplete="off" autocapitalize="off"></div>';
      if (it.found && it.found.length) h += '<div class="aib-ch">' + it.found.map(function (id) { return '<button class="aib-chip' + (id === it.id ? " on" : "") + '" data-a="pick" data-id="' + esc(id) + '" type="button">' + esc(exOf(id).n) + '</button>'; }).join("") + '</div>';
    }
    if (it.alts && it.alts.length) h += '<div class="aib-alt"><span>Замены</span>' + it.alts.map(function (id) { return '<button data-a="alt" data-id="' + esc(id) + '" type="button">' + esc(exOf(id).n) + '</button>'; }).join("") + '</div>';
    h += '</div>';
  });
  h += '</div><div class="aib-acts"><button class="cta l" id="aibNo" type="button">Отменить</button><button class="cta go" id="aibOk" type="button"' + (live ? "" : " disabled") + '>Добавить в тренировку</button></div>';
  $("#aibB").innerHTML = h;
}
function aibNum(s, int) { var v = String(s || "").replace(",", ".").trim(); if (!v) return null; var n = +v; if (!isFinite(n) || n < 0) return null; return int ? Math.round(n) : Math.round(n * 2) / 2; }
function aibList(s, int) { var a = String(s || "").split(/[\/\s;]+/).map(function (x) { return aibNum(x, int); }).filter(function (x) { return x != null; }); return a.length ? a : null; }
function aibBindSheet(sh) {
  sh.addEventListener("input", function (e) {
    var t = e.target;
    if (t.id === "aibT") { aibGoSync(); clearTimeout(aib.sv); aib.sv = setTimeout(function () { var v = t.value; aibSaveSet(function (s) { s.aib = v; }); }, 500); return; }
    var c = t.closest(".aib-c"); if (!c || !aib.st) return; var it = aib.st.items[+c.dataset.i];
    if (t.dataset.f) { var f = t.dataset.f; if (f === "sets" || f === "rest") it[f] = aibNum(t.value, true); else it[f] = aibList(t.value, f !== "kg");
      if (f === "sec" && it.sec) it.reps = null; var v = c.querySelector(".aib-v"); if (v) v.textContent = aibVal(it); return; }
    if (t.dataset.a === "find") { it.q = t.value; clearTimeout(aib.ft); aib.ft = setTimeout(function () {
      var m = t.value.trim().length > 1 ? AIB.match(t.value, aibCtx()) : { cand: [] }; it.found = m.cand.slice(0, 5).map(function (x) { return x.id; });
      var box = c.querySelector(".aib-sx"), nx = box.nextElementSibling; if (nx && nx.classList.contains("aib-ch")) nx.remove();
      if (it.found.length) box.insertAdjacentHTML("afterend", '<div class="aib-ch">' + it.found.map(function (id) { return '<button class="aib-chip" data-a="pick" data-id="' + esc(id) + '" type="button">' + esc(exOf(id).n) + '</button>'; }).join("") + '</div>');
    }, 160); }
  });
  sh.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    if (b.id === "aibMic") { if (aib.recOn) aibMicStop(false); else aibMicStart(); return; }
    if (b.id === "aibGo") { if (aib.recOn) { aibMicStop(true); return; } aibRun(); return; }
    if (b.id === "aibBk") { aibInput(aib.st ? aib.st.text : aibSet().aib || ""); return; }
    if (b.id === "aibNo") { closeSheet("aibSheet"); return; }
    if (b.id === "aibOk") { aibCommit(); return; }
    var c = b.closest(".aib-c"); if (!c || !aib.st) return; var i = +c.dataset.i, it = aib.st.items[i], a = b.dataset.a;
    if (a === "skip") { it.skip = true; buzz(5); aibDraft(); }
    else if (a === "unskip") { it.skip = false; aibDraft(); }
    else if (a === "names") { it.open = !it.open; buzz(5); aibDraft(); }
    else if (a === "edit") { it.ed = !it.ed; buzz(5); aibDraft(); if (it.ed) setTimeout(function () { var q = $('.aib-c[data-i="' + i + '"] .aib-ed input'); if (q) q.focus(); }, 30); }
    else if (a === "pick") { it.id = b.dataset.id; it.picked = true; it.open = false; it.found = null; it.q = ""; aibAltsOf(it); buzz(8); aibDraft(); }
    else if (a === "alt") { var old = it.id; it.id = b.dataset.id; it.picked = true; aibAltsOf(it); if (old && it.alts.indexOf(old) < 0) it.alts = [old].concat(it.alts).slice(0, 2); buzz(8); aibDraft(); }
  });
}
function aibPick(l, k) { return l && l.length ? l[Math.min(k, l.length - 1)] : null; }
function aibMk(it) {
  var c = exOf(it.id), time = !!it.sec || (c.fmt === "time" && !!it.reps), o = {}, vv = time ? (it.sec || it.reps) : it.reps;
  if (it.sets) o.n = it.sets; else if (vv && vv.length > 1) o.n = vv.length; else if (it.kg && it.kg.length > 1) o.n = it.kg.length;
  if (it.rest != null) o.rest = it.rest;
  if (vv) { if (time) o.t = vv[0]; else o.v = vv[0]; }
  var x = GEN.mkEx(it.id, o);
  if (time && x.mode !== "time") { x.mode = "time"; }
  x.sets.forEach(function (s, k) {
    if (time) { s.v = 1; var tv = aibPick(vv, k); if (tv) s.t = tv; } else if (vv) s.v = aibPick(vv, k);
    if (it.kg) s.w = aibPick(it.kg, k);
  });
  var notes = (it.notes || []).slice(); if (it.side) notes.unshift("На каждую сторону");
  if (notes.length) x.note = notes.join(". ");
  if (it.alts && it.alts.length) x.alts = it.alts.slice(0, 2);
  x.src = it.raw;
  return x;
}
function aibLink(list, items) {
  list.forEach(function (x, k) {
    var it = items[k], nx = items[k + 1];
    if (it.group && nx && nx.group === it.group) { x.link = true; if (it.rest == null) x.sets.forEach(function (s) { s.rest = 30; }); }
  });
}
function aibCommit() {
  if (!con || !aib.st) return;
  var st = aib.st, live = st.items.filter(function (it) { return !it.skip && it.id; });
  var lost = st.items.filter(function (it) { return !it.skip && !it.id; }).length;
  if (!live.length) { toast("Выберите упражнения из библиотеки или уберите лишние строки"); return; }
  var snap = clone(con.cw.ex), added = 0, newW = [], prog = con.orphan ? sysProg() : con.p;
  var byDay = {}; live.forEach(function (it) { (byDay[it.day] = byDay[it.day] || []).push(it); });
  Object.keys(byDay).map(Number).sort(function (a, b) { return a - b; }).forEach(function (di, k) {
    var its = byDay[di], xs = its.map(aibMk); aibLink(xs, its); added += xs.length;
    if (k === 0) { xs.forEach(function (x) { con.cw.ex.push(x); }); }
    else { var d = st.res.days[di], w = { id: uid(), name: (d.title || ("Тренировка " + (di + 1))).slice(0, 40), desc: "", done: false, tnote: "", ex: xs }; prog.workouts.push(w); newW.push(w); }
  });
  if (st.res.title && !String(con.cw.name || "").trim()) { con.cw.name = st.res.title.slice(0, 40); var cn = $("#cName"); if (cn) cn.value = con.cw.name; }
  aibSaveSet(function (s) {
    var al = s.aia && typeof s.aia === "object" ? s.aia : {};
    st.items.forEach(function (it) { if (it.picked && it.id && !it.skip) { var k = AIB.learnKey(it.name); if (k) { delete al[k]; al[k] = it.id; } } });
    var ks = Object.keys(al); if (ks.length > 600) ks.slice(0, ks.length - 600).forEach(function (k) { delete al[k]; });
    s.aia = al; delete s.aib;
  });
  aib.st = null; closeSheet("aibSheet"); con.sub = false; renderPrev(); renderX(); touch(); if (newW.length) saveNow(); buzz([8, 30, 8]);
  var msg = "Добавлено " + plural(added, ["упражнение", "упражнения", "упражнений"]) + (newW.length ? " и " + plural(newW.length, ["тренировка", "тренировки", "тренировок"]) : "");
  toast(msg, "Вернуть", function () {
    if (!con) return; con.cw.ex = snap; newW.forEach(function (w) { var i = prog.workouts.indexOf(w); if (i > -1) prog.workouts.splice(i, 1); });
    renderPrev(); renderX(); touch(); saveNow(); toast("Вернул, как было");
  });
}
/* замены в карточке конструктора */
function aibAltLine(x) {
  if (!x.alts || !x.alts.length) return "";
  return '<div class="xalt"><span>Замены</span>' + x.alts.map(function (id) { var e = exOf(id); return e.stub ? "" : '<button data-x="alt" data-id="' + esc(id) + '" type="button">' + esc(e.n) + '</button>'; }).join("") + '</div>';
}
function aibAltSwap(x, id) {
  if (!x || !id) return; var old = x.id, c = exOf(id);
  x.id = id; x.alts = (x.alts || []).map(function (a) { return a === id ? old : a; });
  if (c.fmt === "time" && x.mode !== "time") { x.mode = "time"; x.sets.forEach(function (s) { if (!s.t) s.t = 30; s.v = 1; }); }
  else if (c.fmt !== "time" && x.mode === "time") { x.mode = "kg"; x.sets.forEach(function (s) { if (!(+s.v > 1)) s.v = 10; }); }
  openSet[x.u] = true; buzz([8, 30, 8]); renderX(); touch(); toast("Заменено: " + c.n);
}
/* вход в конструкторе */
cs.addEventListener("click", function (e) {
  if (e.target.closest("#aibM")) { e.stopPropagation(); buzz(6); aibOpen(true); return; }
  if (e.target.closest("#aibE")) { buzz(6); aibOpen(false); }
});
cs.addEventListener("keydown", function (e) { if (e.target.id === "aibE" && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); aibOpen(false); } });
