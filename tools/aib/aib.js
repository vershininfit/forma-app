/* AIB — ассистент тренера: разбор текста/речи в черновик тренировки. Без сети, без внешних сервисов.
   API: AIB.parse(text, {cat, hist, aliases, prof, rx}) → {title, days:[{title, items:[...]}], stats}
        AIB.alts(id, {cat, prof, rx, exclude}) → [id, id]
        AIB.learnKey(raw) → нормализованный ключ для личного словаря */
(function (root) {
  "use strict";
  /* \\b в JS не видит кириллицу: граница слова по своему набору букв */
  var WCH = "[а-яёa-z0-9_]", BND = "(?:(?<!" + WCH + ")(?=" + WCH + ")|(?<=" + WCH + ")(?!" + WCH + "))";
  function B(re) { return new RegExp(re.source.split("\\b").join(BND).split("\\w").join(WCH), re.flags); }

  /* ---------- нормализация ---------- */
  function low(s) { return String(s == null ? "" : s).toLowerCase().replace(/ё/g, "е"); }
  var END = /(иями|ями|ами|ого|его|ому|ему|ыми|ими|ием|ией|иях|ия|ие|ий|ые|ых|ым|ой|ей|ая|яя|ое|ее|ую|юю|ов|ев|ом|ем|ах|ях|ам|ям|ы|и|а|у|ю|я|е|о|ь|й)$/;
  function stem(w) {
    if (w.length < 4) return w;
    var s = w.replace(END, "");
    if (s.length >= 5 && w.length >= 8) { var s2 = s.replace(END, ""); if (s2.length >= 4) s = s2; }
    return s.length >= 3 ? s : w;
  }
  function lev(a, b) {
    var m = a.length, n = b.length; if (!m) return n; if (!n) return m;
    var p = [], c = [], i, j; for (j = 0; j <= n; j++) p[j] = j;
    for (i = 1; i <= m; i++) { c[0] = i; for (j = 1; j <= n; j++) c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1)); var t = p; p = c; c = t; }
    return p[n];
  }

  /* ---------- числа словами ---------- */
  var U = {
    "ноль": 0, "один": 1, "одна": 1, "одно": 1, "одну": 1, "одного": 1, "одной": 1, "два": 2, "две": 2, "двух": 2, "три": 3, "трех": 3, "четыре": 4, "четырех": 4,
    "пять": 5, "пяти": 5, "шесть": 6, "шести": 6, "семь": 7, "семи": 7, "восемь": 8, "восьми": 8, "девять": 9, "девяти": 9
  };
  var T = {
    "десять": 10, "десяти": 10, "одиннадцать": 11, "одиннадцати": 11, "двенадцать": 12, "двенадцати": 12, "тринадцать": 13, "тринадцати": 13,
    "четырнадцать": 14, "четырнадцати": 14, "пятнадцать": 15, "пятнадцати": 15, "шестнадцать": 16, "шестнадцати": 16, "семнадцать": 17, "семнадцати": 17,
    "восемнадцать": 18, "восемнадцати": 18, "девятнадцать": 19, "девятнадцати": 19
  };
  var D = {
    "двадцать": 20, "двадцати": 20, "тридцать": 30, "тридцати": 30, "сорок": 40, "сорока": 40, "пятьдесят": 50, "пятидесяти": 50,
    "шестьдесят": 60, "шестидесяти": 60, "семьдесят": 70, "семидесяти": 70, "восемьдесят": 80, "восьмидесяти": 80, "девяносто": 90, "девяноста": 90
  };
  var H = { "сто": 100, "ста": 100, "двести": 200, "двухсот": 200, "триста": 300, "трехсот": 300, "четыреста": 400, "пятьсот": 500 };
  function wordsToNum(s) {
    var toks = s.split(/(\s+)/), out = [], i = 0;
    while (i < toks.length) {
      var w = toks[i];
      if (!/\S/.test(w)) { out.push(w); i++; continue; }
      var lw = w.replace(/[^а-я]/g, ""), punct = w.slice(lw.length && w.indexOf(lw) >= 0 ? w.indexOf(lw) + lw.length : w.length);
      if (H[lw] != null || D[lw] != null || T[lw] != null || U[lw] != null || lw === "полтора" || lw === "полторы") {
        var v = 0, j = i, last = "", got = false, endPunct = "", lastJ = i;
        while (j < toks.length) {
          var t = toks[j]; if (!/\S/.test(t)) { j++; continue; }
          var lt = t.replace(/[^а-я]/g, "");
          if (lt !== t.replace(/[.,!?;:]+$/, "")) break;
          var tail = t.slice(t.replace(/[.,!?;:]+$/, "").length);
          if (H[lt] != null && !got) { v += H[lt]; last = "h"; got = true; }
          else if (D[lt] != null && (last === "" || last === "h")) { v += D[lt]; last = "d"; got = true; }
          else if (T[lt] != null && (last === "" || last === "h")) { v += T[lt]; last = "t"; got = true; }
          else if (U[lt] != null && (last === "" || last === "h" || last === "d")) { v += U[lt]; last = "u"; got = true; }
          else if ((lt === "полтора" || lt === "полторы") && last === "") { v = 1.5; last = "u"; got = true; }
          else break;
          j++; lastJ = j; endPunct = tail; if (tail) break;
        }
        if (got) { out.push(String(v) + endPunct); i = lastJ; continue; }
      }
      out.push(w); i++;
    }
    return out.join("").replace(/(\d+(?:\.\d+)?)\s+с половиной/g, function (m, a) { return String(+a + 0.5); });
  }

  function normText(text) {
    var s = low(text);
    s = s.replace(/[\u2013\u2014\u2212]/g, "-").replace(/[«»“”]/g, '"').replace(/\u00a0/g, " ").replace(/\t/g, " ");
    s = s.replace(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/gu, " ");
    s = s.replace(/пол\s?минуты/g, "30 сек").replace(/полминуты/g, "30 сек").replace(B(/\bпо минуте\b/g), "по 1 мин").replace(B(/\bминута\b/g), "1 мин").replace(B(/\bминуту\b/g), "1 мин");
    s = wordsToNum(s);
    s = s.replace(/(\d)\s*[хx×*]\s*(?=\d)/g, "$1x").replace(/(\d+)\s+на\s+(\d+)(?!\s*(кг|сек|мин|\d))/g, "$1x$2");            // 4х8 4 x 8 4*8 → 4x8
    s = s.replace(/(\d+),(\d+)(?=\s*(кг|кило))/g, "$1.$2");     // 7,5 кг
    s = s.replace(/\d+(?:\s*,\s*\d+){2,}/g, function (m) { return m.replace(/\s*,\s*/g, "/"); }); // 12,10,8 → 12/10/8
    s = s.replace(B(/килограмм\w*|кило\b|kg\b/g), "кг");
    s = s.replace(B(/секунд\w*|сек\.?(?=\s|$|[,;.])/g), "сек").replace(B(/(\d)\s*(с|s)\b(?=\s*(?:$|[^а-яa-z\s]|отдых|подх|повт|по\s|на\s|x\d|\d))/g), "$1 сек").replace(/(\d)\s*"/g, "$1 сек");
    s = s.replace(B(/минут\w*|мин\.?(?=\s|$|[,;.])/g), "мин");
    s = s.replace(B(/повторени\w*|повтор\w*|раз(а)?\b/g), function (m) { return m.indexOf("раз") === 0 ? "раз" : "повт"; });
    s = s.replace(B(/подход\w*|сет(а|ов)?\b(?!\s*:)/g), function (m) { return /^сет/.test(m) ? "подх" : "подх"; });
    return s;
  }

  /* ---------- словари ---------- */
  var EQW = [
    ["dumbbell", B(/гантел|dumbbell|\bгантельн/)],
    ["barbell", B(/штанг|\bгриф(е|ом)?\b|\bez\b|barbell/)],
    ["kettlebell", B(/\bгир(я|ей|ю|и|е|ями|ях|ям)?\b|kettlebell|\bкеттл/)],
    ["trx", B(/\btrx\b|\bтрх\b|\bтрикс|\bпетл/)],
    ["band", B(/резин|эспандер|\bленто|\bленте|\bлентой|мини.?бэнд|\bbands?\b/)],
    ["cable", B(/\bблок|кроссовер|\bcable/)],
    ["machine", B(/тренаж|\bсмит|гравитрон|хаммер|\bмашин/)],
    ["body", B(/без веса|собственн\w* вес|без инвентаря|\bвес(ом)? тела|bodyweight/)],
    ["land", /лэндмайн|ландмайн|landmine/],
    ["other", B(/медбол|фитбол|\bбосу\b|bosu|кольц|сэндбэг|слайдер/)]
  ];
  function eqCue(s) { for (var i = 0; i < EQW.length; i++) if (EQW[i][1].test(s)) return EQW[i][0]; return ""; }

  /* сленг: псевдонимы → каноничный текст + семейство id (первый = вариант по умолчанию) */
  var SLANG = [
    [["румынка", "румынская тяга", "румынская становая", "рдл", "rdl"], "румынская тяга", ["82", "144", "177", "582", "803"]],
    [["мертвая тяга", "мертвяк", "тяга на прямых"], "становая тяга на прямых ногах", ["83", "82", "144"]],
    [["становая", "становуха", "дэдлифт", "становая тяга", "deadlift"], "становая тяга классическая", ["80", "145", "178", "60", "304"]],
    [["сумо тяга", "тяга сумо", "становая сумо"], "становая тяга сумо", ["81"]],
    [["присед", "приседания", "приседание", "присяд", "скват", "squat"], "присед", ["63", "143", "211", "55", "64", "188", "581"]],
    [["присед сумо", "сумо присед", "приседания сумо", "плие"], "приседания сумо", ["156", "938"]],
    [["гоблет", "кубковый присед", "гоблет присед", "goblet"], "приседания с гантелями кубковый присед", ["143", "581", "938"]],
    [["фронталка", "фронтальный присед", "фронтальные приседания"], "фронтальный присед со штангой", ["65"]],
    [["гакк", "гак присед", "хакк", "гакк присед"], "гакк присед в тренажере", ["4"]],
    [["жим ногами", "жим платформы", "платформа", "жим ног"], "жим ногами в тренажере", ["1", "2", "728"]],
    [["жим лежа", "жим штанги лежа", "жим лежа штанги", "бенч"], "жим лежа классический", ["71", "56", "110"]],
    [["жим гантелей лежа", "жим гантелей на горизонтальной"], "жим гантелей лежа", ["110"]],
    [["жим на наклонной", "жим под углом", "наклонный жим"], "жим на наклонной скамье вверх", ["111", "74"]],
    [["армейский жим", "военный жим", "жим стоя", "жим над головой", "жим штанги стоя"], "жим штанги стоя военный жим", ["76", "114", "57"]],
    [["жим гантелей сидя", "жим сидя"], "жим гантелей сидя над головой", ["113", "77", "34"]],
    [["жим в тренажере", "жим от груди в тренажере", "жим от груди"], "жим от груди в тренажере", ["19", "20"]],
    [["разгибание ног", "разгибания ног", "разгибание голени", "разгибания"], "разгибание ног в тренажере", ["5", "6"]],
    [["сгибание ног", "сгибания ног", "бицепс бедра", "сгибание голени"], "сгибание ног в тренажере", ["7", "8", "9"]],
    [["отведение", "отведения", "отводящие", "абдукция", "разведение ног", "разведение бедер"], "отведение бедра в тренажере", ["13", "723", "459"]],
    [["сведение ног", "сведения ног", "приведение", "приводящие", "аддукция", "сведение бедер"], "приведение бедра в тренажере", ["14", "724"]],
    [["икры", "подъем на носки", "носочки", "икроножные", "подъемы на носки"], "подъем на носки", ["11", "10", "154", "757"]],
    [["гиперэкстензия", "гипер", "гиперэкстензии", "гиперка"], "гиперэкстензия", ["15", "227"]],
    [["тяга верхнего блока", "верхний блок", "вертикальная тяга", "тяга верхнего", "тяга блока к груди", "тяга вертикального блока"], "тяга верхнего блока", ["24", "25", "26", "28"]],
    [["тяга нижнего блока", "нижний блок", "горизонтальная тяга", "тяга к поясу на блоке", "тяга горизонтального блока", "тяга блока к поясу"], "тяга нижнего блока", ["30", "29", "33", "31"]],
    [["тяга гантели", "тяга гантели в наклоне", "тяга одной рукой", "тяга гантели одной рукой"], "тяга гантели в наклоне одной рукой", ["121", "122"]],
    [["тяга штанги", "тяга штанги в наклоне", "тяга в наклоне"], "тяга в наклоне", ["86", "87", "58", "122"]],
    [["тяга т грифа", "т гриф", "тяга т-грифа"], "тяга штанги т-гриф", ["89", "32"]],
    [["ягодичный мост", "хип траст", "хиптраст", "хип-траст", "hip thrust", "мост со штангой", "ягодичный мостик", "мостик"], "ягодичный мост", ["100", "452", "885", "224", "451", "305"]],
    [["выпады", "выпад"], "выпады вперед", ["217", "147", "101", "187", "59"]],
    [["выпады назад", "обратные выпады", "выпад назад", "реверс выпады"], "выпады назад", ["218", "149"]],
    [["ходьба выпадами", "шагающие выпады", "выпады в движении", "выпады шагами"], "выпады с гантелями шаг вперед walking lunge", ["148"]],
    [["выпады в сторону", "боковые выпады", "боковой выпад"], "выпады в сторону", ["219"]],
    [["болгарка", "болгарские", "болгарские выпады", "болгарский выпад", "болгарские приседания", "болгарский сплит"], "болгарские выпады", ["150", "221", "102", "585"]],
    [["зашагивания", "зашагивание", "степ ап", "степап", "step up", "заходы на платформу", "забегания"], "зашагивание на платформу", ["152", "274", "454"]],
    [["махи гирей", "свинг", "свинги", "махи гири", "мах гирей"], "свинг гири двумя руками", ["162", "749", "164"]],
    [["гравитрон"], "подтягивания в гравитроне", ["51"]],
    [["подтягивания", "подтягивание", "подтяги"], "подтягивания", ["205", "51", "311", "207", "208"]],
    [["австралийские", "австралийские подтягивания", "горизонтальные подтягивания"], "австралийские подтягивания", ["210", "342"]],
    [["отжимания", "отжимание", "отжиманий"], "отжимания классические", ["191", "196", "195"]],
    [["брусья", "отжимания на брусьях", "дипсы", "dips"], "отжимания на брусьях", ["203", "52", "725"]],
    [["обратные отжимания", "отжимания от скамьи", "отжимания сзади"], "отжимания от скамьи на трицепс", ["204"]],
    [["планка"], "планка классическая", ["230"]],
    [["боковая планка"], "планка боковая", ["231"]],
    [["скручивания", "кранчи", "скрутки", "пресс", "скручивание"], "скручивания классические", ["237", "16", "397"]],
    [["подъем ног в висе", "подъемы ног в висе", "ноги в висе"], "подъем ног в висе", ["240", "241"]],
    [["махи в стороны", "махи гантелями", "махи", "разводка в стороны", "боковые махи", "махи на плечи", "махи на дельты", "разведение в стороны", "отведение в стороны", "отведение гантелей", "отведение гантели", "боковое отведение", "отведение плеча"], "отведение гантелей стоя боковая дельта", ["126", "36", "127"]],
    [["махи в наклоне", "бабочка на заднюю", "задняя бабочка", "бабочка задняя", "задняя дельта", "разводка в наклоне", "обратная бабочка", "обратный пек дек", "отведение в наклоне", "отведение гантелей в наклоне", "отведение на заднюю дельту"], "отведение гантелей в наклоне задняя дельта", ["125", "23", "566"]],
    [["разводка", "разводка лежа", "разводка гантелей", "разведение гантелей лежа", "разведения лежа", "разведение лежа"], "разводка гантелей лежа", ["117", "118"]],
    [["бабочка", "пек дек", "пекдек", "сведение рук", "сведения рук"], "сведение рук в тренажере баттерфляй", ["22", "597"]],
    [["кроссовер", "сведение в кроссовере"], "кроссовер на блоках", ["45", "46", "47"]],
    [["бицепс", "на бицепс", "подъем на бицепс", "сгибания на бицепс", "сгибание на бицепс", "сгибания рук", "сгибание рук"], "сгибание рук", ["131", "92", "93", "42", "856"]],
    [["молотки", "молот", "хаммер сгибания", "молотковые"], "сгибание рук хватом молот", ["132", "43"]],
    [["трицепс на блоке", "разгибание на трицепс", "разгибания на трицепс", "трицепс канат", "разгибание рук на блоке", "трицепс"], "разгибание трицепса на верхнем блоке", ["37", "38", "39", "139"]],
    [["французский жим", "француз", "французский"], "французский жим", ["95", "142", "96", "41"]],
    [["кикбэк", "кикбек", "отведение ноги назад", "отведения ноги назад", "кик бэк"], "отведение ноги назад кикбэк", ["54", "307", "53", "526"]],
    [["фейс пул", "фейспул", "face pull", "тяга к лицу"], "тяга к лицу", ["48", "266", "291"]],
    [["шраги"], "шраги", ["130", "91", "561"]],
    [["пуловер"], "пуловер", ["49", "50"]],
    [["доброе утро", "гуд морнинг"], "доброе утро", ["98", "583"]],
    [["тяга к подбородку", "протяжка"], "тяга штанги к подбородку", ["90", "570"]],
    [["протяжка на блоке", "пулл тру", "pull through"], "протяжка бедрами на блоке", ["396"]],
    [["скалолаз", "альпинист", "mountain climber"], "планка скалолаз", ["234", "279"]],
    [["скакалка", "прыжки на скакалке"], "прыжки на скакалке", ["365"]],
    [["выпрыгивания", "приседания с выпрыгиванием", "джамп сквот"], "приседания с выпрыгиванием", ["369"]],
    [["мертвый жук", "дед баг", "dead bug"], "мертвый жук", ["487", "866"]],
    [["птица собака", "берд дог", "bird dog"], "птица собака", ["488"]],
    [["русский твист", "твист"], "русский твист", ["244", "161", "862"]],
    [["нордические", "нордик", "nordic"], "нордический сгибание бедра", ["228"]],
    [["колесо", "ролик для пресса", "ab wheel"], "ролл-аут с колесом для пресса", ["336"]],
    [["канаты", "волны канатом", "батл роуп"], "волны канатом", ["348"]],
    [["слэм", "слэмы", "слэм медбола"], "слэм медбола вниз", ["322"]],
    [["уолл бол", "волбол", "wall ball", "валбол"], "wall ball", ["381"]],
    [["чемоданная тяга", "чемодан"], "становая тяга гантели сбоку", ["645"]],
    [["trx тяга", "тяга trx", "тяга в петлях", "trx row", "trx тяги"], "trx тяга в наклоне", ["253", "252", "254", "255", "256"]],
    [["trx отжимания", "отжимания в петлях", "отжимания trx"], "trx отжимания в петлях", ["260", "259"]],
    [["trx жим", "жим в петлях", "trx жим от груди", "жим trx"], "trx жим от груди", ["257"]],
    [["trx присед", "присед в петлях", "trx приседания", "приседания trx", "присед trx", "приседания в петлях"], "trx приседания", ["269"]],
    [["trx бицепс", "бицепс trx", "бицепс в петлях"], "trx сгибание рук на бицепс", ["267"]],
    [["trx трицепс", "трицепс trx", "трицепс в петлях"], "trx разгибание трицепса", ["268", "285"]],
    [["trx выпады назад", "trx выпад назад", "trx реверанс"], "trx выпад назад", ["271"]],
    [["trx болгарка", "trx болгарский", "trx болгарские"], "trx болгарский выпад", ["273"]],
    [["trx мост", "trx мостик", "trx ягодичный мост", "trx ягодичный мостик"], "trx ягодичный мостик", ["276", "523"]],
    [["trx планка", "планка в петлях"], "trx планка прямая", ["280"]],
    [["trx сгибание ног", "trx бицепс бедра"], "trx сгибание бедра", ["275"]],
    [["trx y", "trx игрек", "trx y разведение", "trx y отведение"], "trx y отведение", ["262"]],
    [["trx разведение", "trx разводка"], "trx разведение рук", ["261"]],
    [["шаги фермера", "прогулка фермера", "фермер"], "прогулка фермера", []]
  ];

  var NEUTRAL = { "классическ": 1, "классическа": 1, "классически": 1, "средн": 1, "базов": 1, "обычн": 1, "стандартн": 1, "горизонтальн": 0.5, "стоя": 0.5, "двумя": 0.5, "руками": 0.5, "рук": 0.3 };
  var STOP = { "при": 1, "в": 1, "на": 1, "с": 1, "со": 1, "и": 1, "для": 1, "у": 1, "от": 1, "по": 1, "из": 1, "к": 1, "за": 1, "до": 1, "a": 1, "the": 1, "of": 1, "or": 1, "или": 1, "без": 1, "под": 1 };
  var SYN = [["гантел", "dumbbell"], ["штанг", "barbell", "гриф"], ["гир", "kettlebell"], ["петл", "trx", "трх"], ["резин", "band", "эспандер", "лент"], ["тренаж", "machine"], ["блок", "cable", "кроссовер"], ["присед", "squat", "сед"], ["выпад", "lunge"], ["тяг", "row"], ["жим", "press"], ["отжим", "pushup"], ["подтяг", "pullup"], ["планк", "plank"], ["мост", "bridge", "thrust"], ["скруч", "crunch"], ["разведен", "разводк", "fly"], ["отведен", "разведен", "abduct", "абдукц"], ["сгибан", "curl"], ["разгибан", "extension"], ["леж", "lying"], ["сид", "seated"], ["наклон", "bent"], ["одн", "single"], ["ног", "leg"], ["рук", "arm"]];
  var SYNG = {}; SYN.forEach(function (g, i) { g.forEach(function (w) { SYNG[w] = i; }); });
  function synOf(s) { for (var k in SYNG) if (s.indexOf(k) === 0 || k.indexOf(s) === 0 && s.length >= 4) return SYNG[k]; return -1; }

  function words(s) { return low(s).replace(/[^a-zа-я0-9]+/g, " ").trim().split(" ").filter(Boolean); }
  function toks(s) { var seen = {}; return words(s).filter(function (w) { return !STOP[w] && (w.length > 1 || /\d/.test(w)); }).map(function (w) { return { w: w, s: stem(w), g: synOf(stem(w)) }; }).filter(function (t) { if (seen[t.s]) return false; seen[t.s] = 1; return true; }); }

  /* ---------- индекс каталога ---------- */
  var IXC = null, IXS = null;
  function index(cat) {
    if (IXC === cat && IXS) return IXS;
    IXS = cat.map(function (e) {
      var n = String(e.n || ""), par = (n.match(/\(([^)]*)\)/g) || []).join(" "), mainTxt = n.replace(/\([^)]*\)/g, " ");
      return { e: e, main: toks(mainTxt), par: toks(par), side: toks(e.en || ""), lvl: +(e.l || e.lvl || 1) };
    });
    IXC = cat; return IXS;
  }
  function tokScore(q, t) {
    if (q.s === t.s || q.w === t.w) return 1;
    var a = q.s, b = t.s;
    if (a.length >= 4 && b.length >= 4 && (b.indexOf(a) === 0 || a.indexOf(b) === 0)) return 0.9;
    if (a.length >= 3 && b.length >= 3 && (b.indexOf(a) === 0 || a.indexOf(b) === 0) && Math.min(a.length, b.length) >= 3 && /\d/.test(a) === false) return 0.75;
    if (a.length >= 5 && b.length >= 5 && lev(a, b) <= 1) return 0.75;
    if (q.g >= 0 && q.g === t.g) return 0.65;
    return 0;
  }
  function scoreOne(qt, ix) {
    if (!qt.length) return 0;
    var used = {}, cov = 0, i, j;
    for (i = 0; i < qt.length; i++) {
      var best = 0, bj = -1, bs = 0;
      for (j = 0; j < ix.main.length; j++) { var v = tokScore(qt[i], ix.main[j]); if (v > best) { best = v; bj = "m" + j; } }
      for (j = 0; j < ix.par.length; j++) { var v1 = tokScore(qt[i], ix.par[j]) * 0.97; if (v1 > best) { best = v1; bj = "p" + j; } }
      for (j = 0; j < ix.side.length; j++) { var v2 = tokScore(qt[i], ix.side[j]) * 0.85; if (v2 > best) { best = v2; bj = "s" + j; } }
      cov += best; if (bj !== -1 && best > 0) used[bj] = 1;
    }
    cov = cov / qt.length;
    var extra = 0;
    for (j = 0; j < ix.main.length; j++) {
      if (used["m" + j]) continue;
      var nt = 1, k; for (k in NEUTRAL) if (ix.main[j].s.indexOf(k) === 0) { nt = 1 - NEUTRAL[k]; break; }
      if (/^\d+$/.test(ix.main[j].w)) nt = 0.5;
      extra += nt;
    }
    return cov - 0.055 * extra;
  }

  function covOf(qt, ix) {
    if (!qt.length) return 0; var c = 0;
    qt.forEach(function (q) { var b = 0; ix.main.forEach(function (t) { b = Math.max(b, tokScore(q, t)); }); ix.par.forEach(function (t) { b = Math.max(b, tokScore(q, t)); }); c += b; });
    return c / qt.length;
  }
  function slangHit(s) {
    var best = null, bl = 0, bp = 1e9;
    SLANG.forEach(function (row) {
      row[0].forEach(function (a) {
        var re = new RegExp("(^|[^а-яa-z])" + a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "[\\s-]+") + "(" + WCH + "{0,3})(?=$|[^а-яa-z])");
        var mm = re.exec(s);
        if (mm && (a.length > bl || (a.length === bl && mm.index < bp))) { best = row; bl = a.length; bp = mm.index; }
      });
    });
    return best;
  }

  function match(name, ctx) {
    var cat = ctx.cat, ix = index(cat), s = low(name).replace(B(/\b(трх|трикс\w*|тркс)\b/g), "trx").trim();
    if (!s) return { cand: [], conf: "none" };
    var key = learnKey(s), al = ctx.aliases || {};
    var cue = eqCue(s), sl = slangHit(s), q = s;
    var fam = {}, qual = false, restT = [];
    if (sl) {
      // канон + оставшиеся уточнения из исходной фразы
      var rest = s; sl[0].slice().sort(function (a, b) { return b.length - a.length; }).forEach(function (a) { rest = rest.replace(new RegExp(a.replace(/ /g, "[\\s-]+") + WCH + "{0,3}", "g"), " "); });
      q = sl[1] + " " + rest;
      restT = toks(rest.replace(/trx/g, " ")).filter(function (t) { return !/^(ног|рук|тренаж|блок|гантел|штанг|гир|резин|петл|упражн|подх|повт|вес|пол|обычн|классич|прост|базов|kettlebell|dumbbell|barbell|cable|band)/.test(t.s); });
      qual = restT.length > 0;
      sl[2].forEach(function (id, i) { fam[id] = { d: i === 0, rk: (sl[2].length - i) / sl[2].length }; });
    }
    var qt = toks(q), hist = ctx.hist || {}, hmax = 0, id;
    for (id in hist) if (hist[id] > hmax) hmax = hist[id];
    var res = [];
    for (var i = 0; i < ix.length; i++) {
      var r = ix[i], e = r.e, sc = scoreOne(qt, r);
      var f = fam[e.id];
      if (f) {
        var fs = 1.0 + 0.03 * f.rk + (f.d && !qual && (!cue || e.eq === cue) ? 0.22 : 0);
        if (qual) fs += 0.6 * (covOf(restT, r) - 0.5);
        sc = Math.max(sc, fs) + 0.05;
      }
      if (cue) sc += e.eq === cue ? 0.22 : (cue === "body" && e.eq !== "body" ? -0.3 : -0.32);
      if (hist[e.id]) sc += 0.08 + 0.1 * Math.min(1, hist[e.id] / Math.max(3, hmax));
      if (sc > 0.15) res.push([sc, e]);
    }
    res.sort(function (a, b) { return b[0] - a[0]; });
    var aliasId = al[key];
    if (aliasId != null && cat.some(function (e) { return String(e.id) === String(aliasId); })) {
      res = res.filter(function (r) { return String(r[1].id) !== String(aliasId); });
      var ae = cat.filter(function (e) { return String(e.id) === String(aliasId); })[0];
      res.unshift([9, ae]);
    }
    var top = res.slice(0, 6).map(function (r) { return { id: String(r[1].id), score: Math.round(r[0] * 100) / 100 }; });
    var s1 = res[0] ? res[0][0] : 0, s2 = res[1] ? res[1][0] : 0, conf;
    if (aliasId != null && top[0] && top[0].score === 9) conf = "ok";
    else if (s1 < 0.5) conf = "none";
    else if (s1 >= 0.85 && s1 - s2 >= 0.06) conf = "ok";
    else conf = "check";
    return { cand: top, conf: conf, cue: cue };
  }

  /* ---------- разбор строки ---------- */
  var PARAMW = B(/^(подх|повт|раз|кг|сек|мин|отдых\w*|отд|пауза|паузой|темп\w*|вес|весом|весе|на|по|ногу|ноги|сторону|стороны|руку|руки|каждую|каждой|каждый|ногой|рукой|до|отказа|макс\w*|x|с|и|а|в|круг\w*|между|подходами|упражнени\w*|сначала|затем|потом|дальше|далее|после|этого|еще|ещё|также|делаем|делай|делать|сделать|рабочих|рабочим|рабоч\w*|разминочн\w*|по-?\d+|штук\w*|секунд|минут|ок|ну|так|вот|это|будет|номер|первое|второе|третье|следующее|пусть|давай|конце|начале|напоследок|завершение|завершении|финал|финале|самом|amrap)$/);
  function hasName(chunk) {
    return words(chunk.replace(/\d+(\.\d+)?/g, " ")).some(function (w) { return !PARAMW.test(w) && w.length > 1; });
  }

  function num(x) { return x == null ? null : +String(x).replace(",", "."); }

  function parseChunk(raw) {
    var s = " " + raw + " ", it = { raw: raw.trim(), sets: null, reps: null, kg: null, sec: null, rest: null, side: false, notes: [] }, m;
    var cut = function (re, fn) { s = s.replace(re, function () { var r = fn.apply(null, arguments); return r == null ? " " : r; }); };
    // скобки → заметка
    cut(/\(([^)]*)\)/g, function (_, t) { if (t.trim()) it.notes.push(t.trim()); });
    // темп
    cut(B(/темп\w*\s*([\dxх]{1,2}(?:\s*[-:\/]\s*[\dxх]{1,2}){2,3})/g), function (_, t) { it.notes.push("Темп " + t.replace(/\s+/g, "").replace(/[:\/]/g, "-")); });
    // на сторону
    cut(B(/\bна\s+(каждую\s+)?(ногу|сторону|руку|ноги|стороны|руки)\b|\bкаждой\s+(ногой|рукой)\b|\bна\s+кажд\w+\b/g), function () { it.side = true; });
    // до отказа
    cut(B(/\bдо отказа\b|\bмаксимум\w*\b|\bamrap\b/g), function () { it.notes.push("До отказа"); it.fail = true; });
    // отдых
    cut(B(/(?:отдых\w*|\bотд\.?|\bпауз\w*|\brest)\s*(?:между\s+подх\s*)?(?:по\s+)?(\d+(?:\.\d+)?)(?::(\d{2}))?\s*(мин|сек)?/g), function (_, a, b, u) {
      var v = num(a); if (b != null) v = v * 60 + (+b); else if (u === "мин" || (!u && v <= 5)) v = v * 60; it.rest = Math.round(v);
    });
    cut(B(/(\d+(?:\.\d+)?)\s*(мин|сек)\s*отдых\w*/g), function (_, a, u) { var v = num(a); it.rest = Math.round(u === "мин" ? v * 60 : v); });
    // вес: лесенка и одиночный
    cut(/(\d+(?:\.\d+)?)((?:\s*[\/-]\s*\d+(?:\.\d+)?)+)\s*кг/g, function (_, a, rest) { it.kg = [num(a)].concat(rest.split(/[\/-]/).filter(function (x) { return x.trim(); }).map(num)); });
    cut(/(?:с\s+)?(?:весом|вес)\s+(\d+(?:\.\d+)?)(?:\s*кг)?/g, function (_, a) { it.kg = [num(a)]; });
    cut(/(?:по\s+)?(\d+(?:\.\d+)?)\s*кг/g, function (_, a) { if (!it.kg) it.kg = [num(a)]; });
    cut(/@\s*(\d+(?:\.\d+)?)/g, function (_, a) { it.kg = [num(a)]; });
    // подходы × время
    cut(/(\d+)\s*x\s*(\d+(?:\.\d+)?)\s*(мин|сек)/g, function (_, a, b, u) { it.sets = +a; it.sec = [Math.round(u === "мин" ? num(b) * 60 : num(b))]; });
    // подходы × повторы (с диапазоном или списком)
    cut(/(\d+)\s*x\s*(\d+)((?:\s*[\/]\s*\d+)+)?(?:\s*-\s*(\d+))?(?!\s*(?:кг|сек|мин))/g, function (_, a, b, list, hi) {
      it.sets = +a; if (list) { it.reps = [+b].concat(list.split("/").filter(function (x) { return x.trim(); }).map(Number)); }
      else { it.reps = [+b]; if (hi) it.notes.push(b + "–" + hi + " повт."); }
    });
    // "N подх по M (повт|сек|мин)" и обратный порядок
    cut(/(\d+)\s*(?:подх|раз)\s*(?:по\s*)?(\d+(?:\.\d+)?)\s*(сек|мин)/g, function (_, a, b, u) { it.sets = +a; it.sec = [Math.round(u === "мин" ? num(b) * 60 : num(b))]; });
    cut(/(\d+)\s*(?:подх|раз)\s*(?:по\s*)(\d+)(?:\s*-\s*(\d+))?(?:\s*(?:повт|раз))?/g, function (_, a, b, hi) { it.sets = +a; it.reps = [+b]; if (hi) it.notes.push(b + "–" + hi + " повт."); });
    cut(/(?:по\s*)?(\d+)(?:\s*-\s*(\d+))?\s*(?:повт|раз)\s*(?:в\s*)?(?:по\s*)?(\d+)\s*подх/g, function (_, b, hi, a) { it.sets = +a; it.reps = [+b]; if (hi) it.notes.push(b + "–" + hi + " повт."); });
    cut(/(\d+)\s*по\s*(\d+(?:\.\d+)?)\s*(сек|мин)/g, function (_, a, b, u) { it.sets = +a; it.sec = [Math.round(u === "мин" ? num(b) * 60 : num(b))]; });
    cut(/(\d+)\s*по\s*(\d+)(?:\s*-\s*(\d+))?(?:\s*(?:повт|раз))?/g, function (_, a, b, hi) { it.sets = +a; it.reps = [+b]; if (hi) it.notes.push(b + "–" + hi + " повт."); });
    cut(/(\d+)\s*подх/g, function (_, a) { it.sets = +a; });
    // список повторов 12/10/8 или 12-10-8
    cut(B(/\b(\d+)((?:\s*[\/-]\s*\d+){2,})\b(?!\s*(?:кг|сек|мин))/g), function (_, a, rest) { it.reps = [+a].concat(rest.split(/[\/-]/).filter(function (x) { return x.trim(); }).map(Number)); if (!it.sets) it.sets = it.reps.length; });
    // повторы
    cut(/(?:по\s*)?(\d+)(?:\s*-\s*(\d+))?\s*(?:повт|раз)/g, function (_, b, hi) { it.reps = [+b]; if (hi) it.notes.push(b + "–" + hi + " повт."); });
    // время
    cut(/(?:по\s*)?(\d+(?:\.\d+)?)\s*(мин|сек)/g, function (_, b, u) { it.sec = [Math.round(u === "мин" ? num(b) * 60 : num(b))]; });
    // "по 12" без единиц → повторы
    cut(B(/\bпо\s+(\d+)(?:\s*-\s*(\d+))?\b/g), function (_, b, hi) { if (!it.reps) { it.reps = [+b]; if (hi) it.notes.push(b + "–" + hi + " повт."); } });
    // голые числа после подходов → вес; одиночный диапазон 8-12 → повторы
    cut(B(/\b(\d+)\s*-\s*(\d+)\b/g), function (_, a, b) { if (!it.reps) { it.reps = [+a]; it.notes.push(a + "–" + b + " повт."); return " "; } return _; });
    var bare = [];
    s = s.replace(/(^|\s)(\d+(?:\.\d+)?)(?=\s|$|[,;.:])/g, function (m0, sp, a) { bare.push(num(a)); return sp + " "; });
    if (bare.length) {
      if (it.sets && (it.reps || it.sec) && !it.kg) it.kg = [bare[0]];
      else if (!it.sets && !it.reps && bare.length >= 2) { it.sets = bare[0]; it.reps = [bare[1]]; if (bare[2] != null && !it.kg) it.kg = [bare[2]]; }
      else if (it.sets && !it.reps && !it.sec) it.reps = [bare[0]];
      else if (!it.reps && !it.sec && bare.length === 1) it.reps = [bare[0]];
    }
    if (it.sec && !it.sets && it.sec[0] >= 180) it.sets = 1;
    var name = s.replace(B(/\b(подх|повт|раз|кг|сек|мин|весом|вес|с весом|по|х|x)\b/g), " ")
      .replace(/^[\s\-–—•*·.:,;)\]]+|[\s\-–—•*·.:,;(\[]+$/g, " ")
      .replace(/\s+(и|с|со|по|на|в)\s*$/g, " ")
      .replace(/^\s*(и|а|потом|затем|дальше|далее|еще|ещё|сначала|делаем)\s+/g, " ")
      .replace(/\s+/g, " ").trim();
    name = words(name).filter(function (w, i, arr) { return !PARAMW.test(w) || /^(ногу|ноги|сторону|стороны|руку|руки|ногой|рукой)$/.test(w) || (i > 0 && i < arr.length - 1 && /^(на|в|с|по|до)$/.test(w)); }).join(" ");
    it.name = name.replace(/\s+(на|в|с|по|до|и)$/, "").trim();
    return it;
  }

  /* ---------- текст → строки ---------- */
  var DAY = B(/^\s*(?:(день|тренировка|трен\.?|занятие|неделя|day|workout)\s*(?:№\s*)?(\d+|[абвгabcd])\b|(понедельник|вторник|среда|среду|четверг|пятница|пятницу|суббота|субботу|воскресенье|пн|вт|ср|чт|пт|сб|вс)\b)\s*[:.\-–—]?\s*(.*)$/);
  var SS = B(/^\s*(?:супер\s?-?сет|суперсерия|сс\b|ss\b|трисет|три-сет|гигант\w*\s+сет|связк\w*)\s*[:.\-–—]?\s*(.*)$/);
  var CIRC = B(/^\s*(?:круг\w*|по кругу|circuit|раунд\w*)\b[^\d\n]*?(\d+)?\s*(?:раз|круг\w*|раунд\w*)?\s*[:.\-–—]?\s*(.*)$/);
  var SEP = /\s*(?:\.\s+(?=[а-яa-z])|;\s*|(?:^|\s+)(?:и\s+)?(?:потом|затем|дальше|далее|после этого|после него|следующее упражнение|следующее|и ещё|и еще|в конце|в начале|наконец|напоследок|в завершение|на финал)\s+)/;
  /* голос без знаков препинания: новое упражнение начинается со слова-начала названия после чисел */
  var STARTS = null;
  function starts(cat) {
    if (STARTS && STARTS.cat === cat) return STARTS.set;
    var o = {};
    cat.forEach(function (e) { var w = words(String(e.n || "").replace(/\([^)]*\)/g, " "))[0]; if (w && !/^\d/.test(w)) o[stem(w)] = 1; });
    SLANG.forEach(function (r) { r[0].forEach(function (a) { var w = words(a)[0]; if (w) o[stem(w)] = 1; }); });
    ["trx", "гоблет", "мертвяк", "болгарк", "румынк", "гиперэкстенз", "кранч", "бабочк", "махи", "свинг", "брусь", "гравитрон", "икр", "пресс", "кикбэк", "шраг"].forEach(function (w) { o[stem(w)] = 1; });
    ["с", "со", "на", "в", "по", "и", "до", "весом", "вес", "отдых", "темп", "каждую", "ногу", "руку", "сторону"].forEach(function (w) { delete o[stem(w)]; });
    STARTS = { cat: cat, set: o }; return o;
  }
  function splitByNames(p, cat) {
    var ws = p.split(/\s+/), out = [], cur = [], seenNum = false, st = starts(cat);
    ws.forEach(function (w) {
      var lw = w.replace(/[^а-яa-z0-9]/g, "");
      var isNum = /\d/.test(w), isStart = lw && !isNum && !PARAMW.test(lw) && st[stem(lw)];
      if (isStart && seenNum && cur.length) { out.push(cur.join(" ")); cur = []; seenNum = false; }
      cur.push(w); if (isNum) seenNum = true;
    });
    if (cur.length) out.push(cur.join(" "));
    return out;
  }

  function learnKey(s) { return words(low(s)).map(stem).join(" ").trim(); }

  function parse(text, ctx) {
    ctx = ctx || {};
    var cat = ctx.cat || [], t0 = Date.now();
    var src = String(text || "").replace(/\r/g, "");
    var lines = src.split(/\n|•/);
    var days = [{ title: "", items: [] }], cur = days[0], title = "", group = null, gid = 0, circ = null, blank = 0, lineNo = 0;
    var firstLineCand = null;
    lines.forEach(function (L0) {
      var L = L0.replace(/^\s*[-–—*·]+\s*/, "").trim();
      if (!L) { group = null; circ = null; blank++; return; }
      lineNo++;
      var nl = normText(L), m;
      // заголовок дня
      if ((m = nl.match(DAY)) && (!m[4] || !/\d/.test(m[4]) || m[4].length < 3)) {
        var dt = L.replace(/[:.\-–—\s]+$/, "").trim();
        if (cur.items.length || cur.title) { cur = { title: dt, items: [] }; days.push(cur); } else cur.title = dt;
        group = null; circ = null;
        if (!m[4] || !hasName(m[4])) return;
        nl = m[4];
      }
      // суперсет
      if ((m = nl.match(SS))) { gid++; group = "g" + gid; circ = null; nl = m[1] || ""; if (!nl.trim()) return; }
      // круг
      var mc = nl.match(CIRC);
      if (mc && /^\s*(круг|по кругу|circuit|раунд)/.test(nl)) { gid++; group = "g" + gid; circ = mc[1] ? +mc[1] : 3; nl = mc[2] || ""; if (!nl.trim() || !hasName(nl)) return; }
      // разминка/заминка как подписи
      if (/^\s*(разминка|заминка|основная часть|основная|растяжка|кардио)\s*[:.\-–—]?\s*$/.test(nl)) return;
      // нумерация 1а/1б
      var lab = null;
      nl = nl.replace(/^\s*(\d{1,2})\s*([абвгabcd])\s*[).:\-–]?\s+/, function (_, n, l) { lab = n; return ""; });
      nl = nl.replace(/^\s*\d{1,2}\s*[).:]\s*/, "").replace(/^\s*\d{1,2}\s+(?=[а-яa-z])/, "");
      // делим на части
      var parts = [];
      nl.split(SEP).forEach(function (p0) { splitByNames(p0, cat).forEach(function (p) {
        p.split(/\s*,\s*(?=[а-яa-z])/).forEach(function (q) {
          if (!q.trim()) return;
          if (parts.length && !hasName(q)) parts[parts.length - 1] += " " + q; else parts.push(q);
        });
      }); });
      parts.forEach(function (p) {
        var plus = p.split(/\s+\+\s+|\s*\+\s*(?=[а-яa-z])/).filter(function (x) { return x.trim(); }), pg = null;
        if (plus.length > 1) { gid++; pg = "g" + gid; }
        var parsed = plus.map(parseChunk), donor = parsed.filter(function (x) { return x.sets || x.reps || x.sec; });
        parsed.forEach(function (it) {
          if (pg && donor.length === 1 && !it.sets && !it.reps && !it.sec) { it.sets = donor[0].sets; it.reps = donor[0].reps; it.sec = donor[0].sec; }
          if (!it.name) {
            // продолжение предыдущего упражнения (голос: «присед. четыре по восемь»)
            var prev = cur.items[cur.items.length - 1];
            if (prev) { ["sets", "reps", "kg", "sec", "rest"].forEach(function (k) { if (it[k] != null && prev[k] == null) prev[k] = it[k]; }); if (it.side) prev.side = true; prev.notes = prev.notes.concat(it.notes); prev.raw += " " + it.raw; }
            return;
          }
          it.group = pg || (lab ? "n" + lab : group);
          if (circ && !it.sets) it.sets = circ;
          it.line = lineNo;
          cur.items.push(it);
        });
      });
    });
    // группы по меткам 1а/1б: одиночная метка — не суперсет
    days.forEach(function (d) {
      var cnt = {}; d.items.forEach(function (it) { if (it.group) cnt[it.group] = (cnt[it.group] || 0) + 1; });
      d.items.forEach(function (it) { if (it.group && cnt[it.group] < 2) it.group = null; });
    });
    // сопоставление
    var nItems = 0, nOk = 0, nCheck = 0, nNone = 0;
    days.forEach(function (d) {
      d.items.forEach(function (it) {
        var m = match(it.name, ctx); it.cand = m.cand; it.conf = m.conf; it.cue = m.cue;
        it.id = m.conf !== "none" && m.cand[0] ? m.cand[0].id : null;
        nItems++; if (m.conf === "ok") nOk++; else if (m.conf === "check") nCheck++; else nNone++;
      });
    });
    // название тренировки: первая строка без чисел, не упражнение
    var d0 = days[0];
    if (d0.items.length >= 2 && d0.items[0].line === 1 && d0.items[0].conf !== "ok" && !d0.items[0].sets && !d0.items[0].reps && !d0.items[0].sec && !d0.items[0].kg
      && words(d0.items[0].name).length <= 5 && (d0.items[0].conf === "none" || /трениров|день|ноги|верх|низ|спина|грудь|ягодиц|фулбади|full|руки|плечи|кор|пресс|тонус|сила|кардио|мобил/.test(d0.items[0].name))) {
      var tl = d0.items.shift(); title = tl.raw.replace(/[:.\s]+$/, ""); title = title.charAt(0).toUpperCase() + title.slice(1);
      nItems--; if (tl.conf === "check") nCheck--; else if (tl.conf === "none") nNone--; else nOk--;
    }
    days = days.filter(function (d) { return d.items.length; });
    if (!days.length) days = [{ title: "", items: [] }];
    return { title: title, days: days, stats: { items: nItems, ok: nOk, check: nCheck, none: nNone, ms: Date.now() - t0 } };
  }

  /* ---------- замены ---------- */
  function vec(e) { var o = {}; (e.pc || []).forEach(function (r) { if (r && r[0]) o[r[0]] = +r[1] || 0; }); if (!Object.keys(o).length && e.m) o[e.m] = 100; return o; }
  function cos(a, b) { var s = 0, na = 0, nb = 0, k; for (k in a) { na += a[k] * a[k]; if (b[k]) s += a[k] * b[k]; } for (k in b) nb += b[k] * b[k]; return na && nb ? s / Math.sqrt(na * nb) : 0; }
  function nameSet(e) { var o = {}; toks(String(e.n || "").replace(/\([^)]*\)/g, " ")).forEach(function (t) { if (!/^(гантел|штанг|гир|тренаж|блок|резин|trx|петл|смит|машин)/.test(t.s)) o[t.s] = 1; }); return o; }
  function alts(id, ctx) {
    var cat = ctx.cat || [], e = cat.filter(function (x) { return String(x.id) === String(id); })[0]; if (!e) return [];
    var prof = ctx.prof || {}, own = { body: 1 }, lv = +prof.lvl > 0 ? +prof.lvl : 3, ex = ctx.exclude || {};
    (Array.isArray(prof.eq) ? prof.eq : []).forEach(function (k) { own[k] = 1; });
    var hasEq = Array.isArray(prof.eq) && prof.eq.length > 0, ve = vec(e), rx = ctx.rx, ne = nameSet(e);
    var c = cat.filter(function (x) {
      if (String(x.id) === String(e.id) || ex[x.id]) return false;
      if (x.m !== e.m) return false;
      if (rx && rx(x) === 2) return false;
      if (+(x.l || x.lvl || 1) > lv + 1) return false;
      if (hasEq && !own[x.eq] && x.eq !== e.eq) return false;
      return true;
    }).map(function (x) {
      var nx = nameSet(x), j = 0, u = 0, k; for (k in ne) { u++; if (nx[k]) j++; } for (k in nx) if (!ne[k]) u++;
      var s = cos(ve, vec(x)) + (x.pat === e.pat ? 0.35 : 0) + (u ? 0.5 * j / u : 0) + (x.uni === e.uni ? 0.05 : 0) - (String(x.n).length > 60 ? 0.05 : 0) - (/комбо|пауз|дефицит|с бруска|взрывн/.test(low(x.n)) ? 0.15 : 0);
      return [s, x]; });
    c.sort(function (a, b) { return b[0] - a[0]; });
    var out = [];
    if (c[0]) out.push(c[0][1]);
    var diff = function (r) { return out.indexOf(r[1]) < 0 && r[1].eq !== e.eq && (!out[0] || r[1].eq !== out[0].eq); };
    var other = c.filter(function (r) { return diff(r) && r[1].pat === e.pat; })[0] || c.filter(diff)[0] || c.filter(function (r) { return out.indexOf(r[1]) < 0; })[0];
    if (other) out.push(other[1]);
    return out.map(function (x) { return String(x.id); });
  }

  var API = { parse: parse, match: match, alts: alts, learnKey: learnKey, normText: normText, parseChunk: parseChunk, eqCue: eqCue, _slang: SLANG };
  if (typeof module !== "undefined" && module.exports) module.exports = API; else root.AIB = API;
})(typeof window !== "undefined" ? window : this);
