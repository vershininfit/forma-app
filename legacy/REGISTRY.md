# Реестр функциональности PWA Forma (автоматически из кода)

Источник: `legacy/screens/<экран>/logic.js`, `markup.html`. Получен скриптом разбора index.html на 10 октября 2026, эталон ветка `pwa-baseline-2026-10-10` (коммит 18b5430). Номера строк относятся к `logic.js` соответствующего экрана. Каждый пункт ниже должен существовать в React Native версии или быть сознательно исключён.

Всего: функций 1599, id-элементов 781, строк логики 6852.


## Онбординг · `onb`

Строк кода: 715 · функций: 136 · элементов с id: 86 · onclick в разметке: 0

Ключи данных (FS): `plan` ×3, `profile` ×2, `wt` ×2, `progs` ×2, `ob` ×1, `set` ×1

Сообщения между экранами (`t`): `coach-link`, `fs`, `hello`, `ob-done`, `other`, `Беременность`

### Разделы и механики (комментарии разработки)

- [3] Хранилище Forma: данные живут на устройстве (localStorage), общие для всех экранов приложения
- [36] Круг-пульсация со стартового экрана: мягкое кольцо расходится от места отметки
- [40] Мягкое «жидкое» нажатие: без расходящихся колец — лёгкое сжатие и плавный возврат
- [44] только scale (compositor): без filter, повторный вызов не накладывается на предыдущий
- [54] ключ, полное название, короткое, группа, область
- [67] быстрый выбор из онбординга → состояния
- [75] 0 — подходит, 1 — с осторожностью, 2 — не рекомендуется
- [85] все ограничения упражнения (для карточки), без привязки к профилю
- [88] для профиля: строки «что беречь» для старых мест (кнопки, регулярки)
- [96] Генератор программ Forma: чистый JS (без DOM). API: mkEx, starter, templates, copyProgram, estMin, stats, setCat
- [112] стартовые значения из текста диапазона: «3–6 (сила) / 8–12 (гипертрофия)» → 8; «30–45 сек» → 30 с; «2 мин пассивно + 20–30 сек PAIL» → 20 с
- [132] ---------- упражнение ----------
- [143] ---------- группы и типы тренировок ----------
- [169] ---------- отбор ----------
- [223] разминка вперёд, кор в конец, базовые вперёд; чередуем группы, не более 2 одной группы подряд (если это возможно)
- [297] ---------- стартовая программа ----------
- [327] ---------- готовые программы ----------
- [358] ---------- утилиты ----------
- [403] state
- [410] data
- [420] ключи оборудования онбординга -> ключи каталога
- [433] helpers
- [447] цель + уточнения
- [456] где + оборудование
- [467] пол, уровень
- [473] segmented
- [479] ритм
- [496] шкалы: рост и вес
- [511] дата рождения: три колеса, возраст 14–100
- [533] осторожность + согласие
- [543] тренер + напоминания
- [557] профиль <-> состояние
- [601] активность по числу тренировок, как CALC.actFor
- [604] ограничения: быстрые зоны из онбординга + то, что человек отметил в профиле сам
- [614] план
- [643] сохранение и выход
- [658] навигация
- [692] свайп между шагами
- [700] повторное прохождение и сообщения shell

### Функции

`okT`, `rd`, `wr`, `inval`, `isoOf`, `todayIso`, `addDays`, `dowOf`, `weekStartOf`, `pulseRing`, `pulseAt`, `arr`, `keysOf`, `pregOf`, `status`, `why`, `all`, `pregTxt`, `cauOf`, `readCat`, `reindex`, `ensure`, `setCat`, `uid`, `clamp`, `RXS`, `parseRng`, `defaults`, `mkEx`, `S`, `isJump`, `hasPc`, `normMins`, `countFor`, `mkCtx`, `score`, `best`, `cands`, `baseVal`, `slotList`, `arrange`, `exParams`, `buildOne`, `add`, `buildWorkouts`, `hasRe`, `validTime`, `sessionsFor`, `dayWord`, `starter`, `templates`, `copyProgram`, `estSec`, `estMin`, `stats`, `ic`, `hlEl`, `buzz`, `raf`, `f`, `esc`, `clamp`, `pad2`, `plural`, `send`, `pu`, `nowY`, `mk`, `lv`, `ic2`, `opt`, `toast`, `chipOn`, `cleanName`, `setGoal`, `renderWhere`, `renderEq`, `presetEq`, `eqn`, `renderSex`, `renderExp`, `seg`, `place`, `mark`, `dPlace`, `renderDays`, `ticks`, `paint`, `animBar`, `labels`, `demo`, `ruler`, `pos`, `idx`, `setPos`, `apply`, `fmt1`, `wheel`, `paintI`, `age`, `ageOk`, `ageT`, `ageChanged`, `setWheels`, `ageNote`, `fixAge`, `renderCau`, `coachLbl`, `renderCoach`, `codeOk`, `showTrainer`, `addCode`, `renderRem`, `nowIso`, `oldProfile`, `hasProfile`, `fromProfile`, `syncUI`, `makeProfile`, `planTime`, `buildPlan`, `renderPlan`, `finish`, `valid`, `upd`, `zone`, `fit`, `setCta`, `go`, `autoNext`, `pulse`, `orbTap`, `startOb`, `sEnd`, `redo`, `fitQ`

### Элементы интерфейса (id)

`ageNote`, `app`, `av`, `avu`, `back`, `band`, `bar`, `bell`, `body`, `both`, `cable`, `cau`, `cbW`, `check`, `chev`, `clar`, `clarChips`, `coach`, `code`, `codeok`, `codew`, `cta`, `days`, `dumb`, `eq`, `eqCount`, `eqw`, `exp`, `flame`, `g-force`, `g-recover`, `g-reg`, `g-relief`, `g-start`, `g-stroy`, `goals`, `gym`, `hint`, `home2`, `hr`, `hv`, `kb`, `land`, `mach`, `mark`, `markf`, `mat`, `mins`, `more`, `nm`, `orb`, `planS`, `planT`, `plus`, `pregRow`, `pregW`, `rbc`, `rbc2`, `rbf`, `rbf2`, `rbk`, `rbk2`, `rbp`, `rbp2`, `rem`, `sex`, `skip`, `stp`, `strip`, `sx-f`, `sx-m`, `sx-n`, `toast`, `top`, `trainer`, `trx`, `user`, `view`, `wd`, `week`, `where`, `wlist`, `wm`, `wr`, `wv`, `wy`


## Главная · `home`

Строк кода: 1329 · функций: 281 · элементов с id: 89 · onclick в разметке: 0

Ключи данных (FS): `plan` ×10, `progs` ×5, `hist` ×4, `profile` ×4, `wt` ×3, `set` ×2, `live` ×2, `sync` ×1, `libq` ×1, `nutr` ×1

Сообщения между экранами (`t`): `fs`, `hello`, `meal`, `open`, `sub`, `swipe`, `tab`, `Беременность`

### Разделы и механики (комментарии разработки)

- [1] МЕНЮ «+» (v1) и обёртка пульсации
- [20] ТАП-АНИМАЦИЯ ИКОНОК ВКЛАДОК (v1): иконки дока с отдельными частями + проигрыватель
- [37] Хранилище Forma: данные живут на устройстве (localStorage), общие для всех экранов приложения
- [85] Круг-пульсация со стартового экрана: мягкое кольцо расходится от места отметки
- [89] Мягкое «жидкое» нажатие: без расходящихся колец — лёгкое сжатие и плавный возврат
- [93] только scale (compositor): без filter, повторный вызов не накладывается на предыдущий
- [116] нижнее меню
- [133] окно/лист
- [198] ключ, полное название, короткое, группа, область
- [211] быстрый выбор из онбординга → состояния
- [219] 0 — подходит, 1 — с осторожностью, 2 — не рекомендуется
- [229] все ограничения упражнения (для карточки), без привязки к профилю
- [232] для профиля: строки «что беречь» для старых мест (кнопки, регулярки)
- [240] Генератор программ Forma: чистый JS (без DOM). API: mkEx, starter, templates, copyProgram, estMin, stats, setCat
- [256] стартовые значения из текста диапазона: «3–6 (сила) / 8–12 (гипертрофия)» → 8; «30–45 сек» → 30 с; «2 мин пассивно + 20–30 сек PAIL» → 20 с
- [276] ---------- упражнение ----------
- [287] ---------- группы и типы тренировок ----------
- [313] ---------- отбор ----------
- [367] разминка вперёд, кор в конец, базовые вперёд; чередуем группы, не более 2 одной группы подряд (если это возможно)
- [441] ---------- стартовая программа ----------
- [471] ---------- готовые программы ----------
- [510] ---------- утилиты ----------
- [540] ---------- словари ----------
- [550] ---------- безопасные хелперы ----------
- [568] ---------- состояние ----------
- [576] ---------- чтение и нормализация данных ----------
- [595] история: только валидные записи, не из будущего
- [606] ротация: какая тренировка программы следующая
- [627] напоминание «позже»
- [629] тренер
- [633] состояние
- [635] пропущенные ранее на этой неделе
- [646] ---------- модель плана: базовые дни + добавленные тренировки + исключения ----------
- [666] все вхождения даты (включая отменённые, но без удалённых), до учёта уже выполненных
- [679] единая функция: что запланировано на дату (без уже выполненного) → [{src,wid,time,rep,cancelled,...}]
- [698] нормализация: действующие базовые дни, закончившиеся в прошлом, убираем из plan.days; чистим старые исключения
- [708] ---------- навигация ----------
- [710] в библиотеку с готовым фильтром (одноразовая заявка через хранилище; библиотека читает её при показе)
- [716] ---------- вывод секциями ----------
- [718] mode: "swap" — старое уходит 160ms, новое входит .45s (общий swapPane); "none" — без анимации секции; иначе — только мягкое появление
- [730] неделя
- [778] главная карточка: одна компактная плашка (текст слева, действие справа)
- [833] сдвиг пропущенной тренировки
- [839] сообщение тренера
- [856] вес за сегодня внесён: больше не напоминаем
- [859] питание: сколько записано сегодня (данные вкладки «Питание»), норма — если она сохранена в профиле
- [870] готовые программы по профилю
- [899] тренировка начата или проведена: подсказка не нужна
- [903] ---------- уведомления ----------
- [937] ---------- окно выбора дней ----------
- [951] ---------- «Позже» ----------
- [965] ---------- вес ----------
- [1001] ---------- календарь ----------
- [1070] ---------- изменение плана: исключения, серии, «как в Apple» ----------
- [1082] «эту и все следующие»: серия заканчивается накануне
- [1107] лист-вопрос
- [1122] форма: добавить / изменить / перенести
- [1168] ---------- действия ----------
- [1238] ---------- главный рендер ----------
- [1260] смена суток и «пора» по напоминанию
- [1282] жест вверх/вниз с нижнего меню прокручивает страницу (раньше зона меню была «мёртвой» для скролла)
- [1320] плашка нижнего меню перетекает от прежней вкладки к новой, как выбор дня

### Функции

`init`, `bz`, `set`, `okT`, `rd`, `wr`, `inval`, `isoOf`, `todayIso`, `addDays`, `dowOf`, `weekStartOf`, `dmy`, `reloadHist`, `lastOf`, `addHist`, `histOn`, `setsLine`, `pulseRing`, `pulseAt`, `ic`, `hlEl`, `buzz`, `raf`, `f`, `mix`, `hex`, `colorFor`, `esc`, `plural`, `uid`, `clone`, `fk`, `fi`, `send`, `toast`, `initTabs`, `paneOf`, `place`, `drop`, `io`, `step`, `go`, `openWin`, `closeLayers`, `openSheet`, `reduced`, `el`, `shown`, `cur`, `swapPane`, `put`, `enter`, `next`, `swapPanes`, `flip`, `next`, `initSeg`, `mark`, `place`, `set`, `arr`, `keysOf`, `pregOf`, `status`, `why`, `all`, `pregTxt`, `cauOf`, `readCat`, `reindex`, `ensure`, `setCat`, `uid`, `clamp`, `RXS`, `parseRng`, `defaults`, `mkEx`, `S`, `isJump`, `hasPc`, `normMins`, `countFor`, `mkCtx`, `score`, `best`, `cands`, `baseVal`, `slotList`, `arrange`, `exParams`, `buildOne`, `add`, `buildWorkouts`, `hasRe`, `validTime`, `sessionsFor`, `dayWord`, `starter`, `cyc`, `cloneW`, `templates`, `mkc`, `copyProgram`, `estSec`, `estMin`, `stats`, `arr`, `obj`, `num`, `clamp`, `isIso`, `isTime`, `p2`, `dnum`, `diffDays`, `dayOfMonth`, `shortDate`, `str`, `r1`, `fvol`, `agoTxt`, `ringic`, `remCfg`, `getSet`, `saveSet`, `uniqDays`, `normH`, `matchW`, `liveOk`, `load`, `wAll`, `getItems`, `itemById`, `itEvery`, `itOn`, `baseAct`, `baseWid`, `mkOcc`, `rawOn`, `plannedOn`, `activeOn`, `nextPlannedIso`, `dayDone`, `isMissed`, `wName`, `wMeta`, `repName`, `repTxt`, `inSeries`, `findOcc`, `normPlan`, `goWork`, `toLib`, `startW`, `detW`, `wById`, `put`, `draw`, `safe`, `greet`, `secHd`, `dayPct`, `goalTarget`, `wkList`, `nTr`, `wkStat`, `secWeek`, `dropMove`, `io`, `step`, `afterWeek`, `dat`, `heroBox`, `metaTxt`, `doneCard`, `heroLive`, `eqIndex`, `eqTxt`, `dayMeta`, `dLine`, `heroEmpty`, `heroTrain`, `cap`, `relDay`, `heroRest`, `heroNone`, `dayCard`, `heroKey`, `secHero`, `afterHero`, `secMiss`, `initials`, `whenTxt`, `secCoach`, `wDyn`, `plCard`, `secWeight`, `nfmt`, `foodToday`, `secFood`, `getOffers`, `secOffers`, `secMk`, `notifs`, `add`, `readNotif`, `drawNotifs`, `openNotifs`, `drawDays`, `openDays`, `closeDp`, `snoozeOpts`, `openSnooze`, `buildRuler`, `wHint`, `setW`, `openWeight`, `hold`, `step`, `stop`, `catName`, `calMonths`, `cState`, `cellHtml`, `renderCal`, `exRows`, `plEx`, `chevTog`, `doneRow`, `occRow`, `dayDetail`, `openCal`, `calAct`, `topOn`, `closeTop`, `closeAll`, `mut`, `setEx`, `dropEx`, `plItem`, `endFrom`, `opCancel`, `opDelete`, `opRestore`, `opAdd`, `opEdit`, `ask`, `askSeries`, `askCancel`, `askDelete`, `defWid`, `drawWL`, `drawForm`, `openForm`, `submitForm`, `keep`, `autoPlan`, `pickDays`, `setX`, `end`, `act`, `render`, `later`, `tick`, `scroller`, `dockT`, `end`, `step`, `layers`, `rootState`, `hscroll`, `blocked`, `subInfo`, `zi`, `closeTop`, `begin`, `finish`, `io`, `step`

### Элементы интерфейса (id)

`aC`, `aD`, `aHint`, `aMk`, `aMk2`, `aOK`, `aQ`, `aR`, `aRf`, `aSub`, `aT`, `aTm`, `aU`, `aUf`, `aUq`, `aWL`, `aWf`, `aX`, `app`, `arrow`, `bell`, `biceps`, `book`, `cal`, `calD`, `calS`, `calX`, `calic`, `chart`, `chat`, `check`, `chev`, `clock`, `dp`, `dpc`, `dpd`, `dpe`, `dph`, `dpok`, `dpsub`, `dpt`, `dumb`, `fab`, `food`, `glute`, `hero`, `home`, `leaf`, `medal`, `nall`, `nlist`, `offers`, `plus`, `qB`, `qS`, `qT`, `s-coach`, `s-f`, `s-hd`, `s-hero`, `s-miss`, `s-mk`, `s-of`, `s-w`, `s-week`, `scale`, `scrim`, `scrim2`, `scroll`, `shA`, `shN`, `shQ`, `shS`, `shSs`, `shW`, `snzl`, `tabbar`, `toast`, `user`, `whint`, `wkTip`, `wkTxt`, `wkscroll`, `wm`, `wp`, `wr`, `wsave`, `wv`, `x`


## Тренировки (включая Библиотеку, Готовые, Клиентов, конструктор, живую тренировку) · `work`

Строк кода: 1710 · функций: 428 · элементов с id: 143 · onclick в разметке: 0

Ключи данных (FS): `profile` ×8, `plan` ×7, `set` ×6, `live` ×5, `hist` ×4, `progs` ×3, `sync` ×3, `xarch` ×2

Сообщения между экранами (`t`): `coach-link`, `coach-note`, `coach-prog`, `find`, `fs`, `hello`, `meal`, `open`, `show`, `swipe`, `tab`, `Беременность`, `Выше`, `Грудь`, `Ниже`, `Переименовать`, `Подробнее`, `Ровно`, `Удалить`

### Разделы и механики (комментарии разработки)

- [1] МЕНЮ «+» (v1) и обёртка пульсации
- [20] ТАП-АНИМАЦИЯ ИКОНОК ВКЛАДОК (v1): иконки дока с отдельными частями + проигрыватель
- [35] Хранилище Forma: данные живут на устройстве (localStorage), общие для всех экранов приложения
- [83] Круг-пульсация со стартового экрана: мягкое кольцо расходится от места отметки
- [87] Мягкое «жидкое» нажатие: без расходящихся колец — лёгкое сжатие и плавный возврат
- [91] только scale (compositor): без filter, повторный вызов не накладывается на предыдущий
- [114] нижнее меню
- [121] окно/лист
- [185] Нечёткий поиск упражнений: по любой части слова, без учёта окончаний, с синонимами и опечатками
- [226] ключ, полное название, короткое, группа, область
- [239] быстрый выбор из онбординга → состояния
- [247] 0 — подходит, 1 — с осторожностью, 2 — не рекомендуется
- [257] все ограничения упражнения (для карточки), без привязки к профилю
- [260] для профиля: строки «что беречь» для старых мест (кнопки, регулярки)
- [268] Генератор программ Forma: чистый JS (без DOM). API: mkEx, starter, templates, copyProgram, estMin, stats, setCat
- [284] стартовые значения из текста диапазона: «3–6 (сила) / 8–12 (гипертрофия)» → 8; «30–45 сек» → 30 с; «2 мин пассивно + 20–30 сек PAIL» → 20 с
- [289] «2 подхода по 20», «5×5»: число подходов из текста; остаток строки — повторы или секунды (иначе «3 подхода…» читалось как 3 повтора)
- [308] ---------- упражнение ----------
- [319] ---------- группы и типы тренировок ----------
- [345] ---------- отбор ----------
- [399] разминка вперёд, кор в конец, базовые вперёд; чередуем группы, не более 2 одной группы подряд (если это возможно)
- [473] ---------- стартовая программа ----------
- [503] ---------- готовые программы ----------
- [542] ---------- утилиты ----------
- [594] ---------- каталог упражнений (parent.FCAT / window.FCAT) ----------
- [615] индекс поиска строим кусками в простое: ~1000 строк за один заход блокируют главный поток на 100+ мс
- [625] ---------- нагрузка по группам ----------
- [636] обновление полос на месте: полосы плавно меняют ширину, а не пересоздаются при каждом вводе
- [647] ---------- данные: программы ----------
- [648] поля подходов: без отрицательных и абсурдных значений (повторы ≤999, кг ≤1000, секунды и отдых ≤3600)
- [685] ---------- сегменты: initSeg / swapPane из common.js (единый стандарт v7) ----------
- [686] ---------- листы и окна ----------
- [692] закрыть самый верхний слой; итог тренировки закрывается только его кнопками
- [712] ---------- силуэты ----------
- [756] ---------- вкладка «Мои» ----------
- [779] пишем в DOM только если разметка изменилась: клики и события из других экранов не перерисовывают список зря и не повторяют анимации появления
- [826] свайп между подвкладками
- [839] заявка на Библиотеку от shell ({t:"find",id|q|eq} → forma.libq): читаем напрямую из хранилища, кэш FS мог устареть
- [855] ---------- вкладка «Готовые» ----------
- [858] шаблоны зависят от профиля (уровень, цель, место, инвентарь, ограничения): пересобираем при смене этих полей, иначе купленная программа не учтёт новые ограничения
- [867] целевые мышцы программы: группы с заметной долей подходов
- [910] фильтры: чипы меняются на месте (индикатор выбора плавный), список — мягкая смена без пересборки чипов
- [946] ---------- вкладка «Клиенты» / связь с тренером ----------
- [992] ---------- ДАШБОРД КЛИЕНТОВ (режим тренера) ----------
- [1028] показ на примере: демо-клиенты за год (помечены, удаляются без следа)
- [1048] ---------- экран клиента ----------
- [1114] заметка клиенту
- [1124] отправить тренировку или программу
- [1140] ---------- конструктор ----------
- [1157] значения прошлой недели
- [1169] прошлая неделя по упражнению: только предыдущая тренировка, без накопления
- [1190] перерисовать только тело одной карточки (подходы/режим), остальной список не трогаем
- [1200] ввод в поля не меняет карту нагрузки: обновляем только кнопки и автосохранение
- [1228] ---------- ограничения здоровья (RX) для текущего профиля ----------
- [1237] упражнение, которого нет в каталоге (старые программы): тоже требует замены
- [1242] ---------- поиск: нечёткий (FZ) + фильтры, по 40 + «Показать ещё» ----------
- [1271] порядок без запроса: подходящие по ограничениям, затем своё оборудование и посильный уровень; при замене сначала тот же паттерн движения
- [1308] мягкое подтверждение для упражнений «не рекомендуется»
- [1319] замена упражнения: тот же номер, число подходов и отдых сохраняются
- [1328] ---------- карточка упражнения (стеклянное окно) ----------
- [1330] блок «Ограничения»: сначала не рекомендуется, потом с осторожностью; внутри — по группам RX.GROUPS, совпадения с профилем выделены
- [1359] ---------- программа: «Подробнее» ----------
- [1400] ---------- режим тренировки (состояние хранится в FS.live, таймеры по меткам времени) ----------
- [1527] ---------- таймер отдыха и звук ----------
- [1540] сигналы: за 30, 10, 5, 4, 3 секунд; если кадр пропущен (вкладка в фоне), срабатывает ближайший пройденный порог
- [1556] ---------- нижняя панель, плюс ----------
- [1565] ---------- связь с оболочкой и другими экранами ----------
- [1576] готовая программа по id (из Главной/Библиотеки): вкладка «Готовые», карточка раскрыта и показана
- [1584] к конкретному упражнению внутри тренировки: {t:"open",wid|k|start,xid:"<id из каталога>"}; раскрывает карточку и прокручивает к ней
- [1599] упражнение из каталога: {t:"open",ex:"<id>"[,q:"текст"]}. Из конструктора открывается карточка поверх, иначе — Библиотека с раскрытым упражнением
- [1609] изменения из других экранов
- [1621] ---------- «назад»: Escape, свайп от левого края, смахивание шторки вниз ----------
- [1636] старт
- [1648] жест вверх/вниз с нижнего меню прокручивает страницу (раньше зона меню была «мёртвой» для скролла)
- [1686] плашка нижнего меню перетекает от прежней вкладки к новой, как выбор дня
- [1700] выделение содержимого ячейки при входе: сразу вводим новое значение, не стирая старое

### Функции

`init`, `bz`, `set`, `okT`, `rd`, `wr`, `inval`, `isoOf`, `todayIso`, `addDays`, `dowOf`, `weekStartOf`, `dmy`, `reloadHist`, `lastOf`, `addHist`, `histOn`, `setsLine`, `pulseRing`, `pulseAt`, `ic`, `hlEl`, `buzz`, `raf`, `f`, `mix`, `hex`, `colorFor`, `esc`, `plural`, `uid`, `clone`, `fk`, `fi`, `send`, `toast`, `initTabs`, `place`, `openWin`, `closeLayers`, `openSheet`, `reduced`, `el`, `shown`, `cur`, `swapPane`, `put`, `enter`, `next`, `swapPanes`, `flip`, `next`, `initSeg`, `mark`, `place`, `set`, `norm`, `stem`, `groupsOfWord`, `groupsOfQuery`, `lev`, `near`, `words`, `qwords`, `build`, `exact`, `chk`, `fuzzy`, `search`, `arr`, `keysOf`, `pregOf`, `status`, `why`, `all`, `pregTxt`, `cauOf`, `readCat`, `reindex`, `ensure`, `setCat`, `uid`, `clamp`, `RXS`, `parseRng`, `defaults`, `mkEx`, `S`, `isJump`, `hasPc`, `normMins`, `countFor`, `mkCtx`, `score`, `best`, `cands`, `baseVal`, `slotList`, `arrange`, `exParams`, `buildOne`, `add`, `buildWorkouts`, `hasRe`, `validTime`, `sessionsFor`, `dayWord`, `starter`, `cyc`, `cloneW`, `templates`, `mkc`, `copyProgram`, `estSec`, `estMin`, `stats`, `ic`, `hlEl`, `buzz`, `uid`, `esc`, `clone`, `plural`, `nz`, `fmt`, `f1`, `kgTxt`, `ini`, `daysBetween`, `agoTxt`, `send`, `toast`, `pls`, `readCat`, `buildCat`, `ixGet`, `ixWarm`, `idle`, `exOf`, `eqName`, `sexNow`, `armG`, `grp`, `mainG`, `exShare`, `loadStd`, `barsHtml`, `setBars`, `animBars`, `loadOf`, `estMin`, `exSum`, `capNum`, `numOr`, `normD`, `readD`, `hk`, `findP`, `findW`, `progOf`, `sameW`, `weekFrom`, `isDone`, `cleanHist`, `xaCnt`, `xaMove`, `lastFor`, `lastW`, `lwOf`, `effTxt`, `syncDone`, `applyCon`, `saveNow`, `save`, `sysProg`, `syncScrim`, `openSheet`, `blurIn`, `closeSheet`, `closeAll`, `dismissTop`, `dlgForm`, `chk`, `go`, `dlgConfirm`, `menu`, `wf`, `tx`, `ax`, `warp`, `warpOut`, `wpaths`, `figSvg`, `paintMap`, `replay`, `flagTxt`, `wtHtml`, `progName`, `progHtml`, `savedLive`, `liveSec`, `liveCnt`, `resumeHtml`, `emptyHtml`, `recentHtml`, `setList`, `renderList`, `newProgram`, `newWorkout`, `newQuick`, `autoStart`, `dropProgram`, `subDesc`, `subTitle`, `tabLbl`, `libShow`, `takeLibQ`, `ensureLib`, `setSub`, `goProg`, `tplKey`, `getTpl`, `boughtP`, `pr`, `tplFilt`, `tplMus`, `tplFcnt`, `eqTxt`, `tplHtml`, `openTplWin`, `buyTpl`, `tplBody`, `tplBar`, `renderTpl`, `tplRefresh`, `openTplFilter`, `chips`, `upd`, `tg`, `sync`, `SY`, `isCoach`, `lastDate`, `clientsArr`, `cntIn`, `wtInfo`, `sessFlags`, `statusTxt`, `clip`, `fb`, `coachNoteRecent`, `renderClients`, `renderLink`, `exLines`, `cnOf`, `cSig`, `cStrip`, `cList`, `cRows`, `cTiles`, `renderCl`, `clRefresh`, `cDemoOn`, `rnd`, `cDemoOff`, `perR`, `inR`, `agg`, `hm`, `dlt`, `kpi`, `actChart`, `dayVal`, `wtChart`, `exProg`, `feed`, `sentLog`, `clBody`, `clRest`, `openClient`, `closeClient`, `curC`, `clSwap`, `bindCl`, `pl`, `logSent`, `openNote`, `openSend`, `doSend`, `snapOf`, `isDirty`, `schedCon`, `openCon`, `closeCon`, `relink`, `buildMap`, `renderPrev`, `applyLast`, `revertLast`, `lwBtn`, `lwBox`, `updateMap`, `xLab`, `xHtml`, `renderX`, `grow`, `cardRefresh`, `refreshBar`, `touch`, `typed`, `saveCon`, `xOf`, `revertCon`, `myProf`, `rxOn`, `rxSig`, `rxSt`, `rxWhy`, `whyTxt`, `rxLbl`, `rxBadge`, `exFlag`, `flagLine`, `flagCount`, `openSearch`, `buildFilters`, `syncFilters`, `filtChanged`, `baseOrder`, `ixRanked`, `searchList`, `srRow`, `filtOn`, `renderSearch`, `appendRows`, `spUpd`, `rowOf`, `togPick`, `rxGate`, `reopenSearch`, `cautionToast`, `addMany`, `doAdd`, `startSwap`, `doSwap`, `uniq`, `secG`, `rxBlock`, `openInfo`, `gsum`, `progStats`, `pairVerdict`, `progHist`, `openProg`, `liveSnap`, `saveLive`, `lvSec`, `lvTickFn`, `coachRecent`, `enterLive`, `startLive`, `resumeLive`, `showLive`, `minLive`, `effCap`, `effPill`, `lxHtml`, `renderLive`, `lvProg`, `lxOf`, `whVal`, `whSet`, `whMark`, `effOpen`, `lxFold`, `endLive`, `recBest`, `hhmm`, `finishLive`, `commit`, `ac`, `beep`, `rtGeom`, `rtSnake`, `rtShow`, `rtCancel`, `rtReset`, `rtPrime`, `rtStop`, `rtRestore`, `rtCue`, `rtFrame`, `rtStart`, `rtPause`, `rtAdj`, `place`, `openByKey`, `goWid`, `openTpl`, `go`, `focusEx`, `go`, `leaveCon`, `handleOpen`, `go`, `closeSoft`, `onShow`, `flush`, `backNav`, `end`, `scroller`, `dockT`, `end`, `step`, `layers`, `rootState`, `hscroll`, `blocked`, `subInfo`, `zi`, `closeTop`, `begin`, `finish`, `io`, `step`, `isC`, `pick`, `pickAll`

### Элементы интерфейса (id)

`addX`, `app`, `back`, `book`, `cBack`, `cBar`, `cCancel`, `cCrumb`, `cGo`, `cName`, `cQ`, `cSave`, `cdv`, `chart`, `check`, `chev`, `clAct`, `clBack`, `clList`, `clN`, `clName`, `clPer`, `clRest`, `clS`, `clX`, `clock`, `copy`, `ctl`, `dN`, `dOk`, `dY`, `disk`, `dlg`, `dock`, `dots`, `down`, `dumb`, `edit`, `eqs`, `eye`, `fCancel`, `fDone`, `fDraft`, `fOk`, `fRs`, `fab`, `filt`, `fit`, `food`, `gNote`, `hatchW`, `home`, `iA`, `iS`, `iX`, `info`, `lBack`, `lClock`, `lName`, `lProg`, `lSeg`, `lbl`, `lbs`, `lclk`, `libHost`, `link`, `lkGo`, `lkIn`, `lock`, `lvs`, `mapHost`, `mapMin`, `menu`, `minus`, `mus`, `note`, `pSub`, `pTitle`, `pgG`, `pgX`, `pillL`, `pillT`, `play`, `plus`, `prevB`, `prevHost`, `prevRv`, `q`, `rArc`, `rM`, `rP`, `rR`, `rV`, `rVt`, `rough`, `rt`, `sCl`, `sCon`, `sFit`, `sList`, `sLive`, `sOk`, `sPr`, `sRst`, `scCl`, `scCon`, `scList`, `scLive`, `scnt`, `scrim`, `sdX`, `search`, `sgTab`, `slist`, `smb`, `smore`, `spOk`, `spark`, `spick`, `srchSheet`, `sum`, `swap`, `swn`, `tabbar`, `toast`, `tpB`, `tpBar`, `tpList`, `tpX`, `trash`, `trophy`, `up`, `user`, `vid`, `wDate`, `wNote`, `wg`, `winCl`, `winInfo`, `winPg`, `winTp`, `x`, `xl`


## Питание · `nutr`

Строк кода: 854 · функций: 214 · элементов с id: 142 · onclick в разметке: 0

Ключи данных (FS): `wt` ×4, `nutr` ×2, `profile` ×2, `plan` ×2

Сообщения между экранами (`t`): `fs`, `hello`, `meal`, `open`, `swipe`, `tab`, `Бёдра`, `Вес`, `Возраст`, `Недавнее`, `Рост`, `Талия`, `Шея`

### Разделы и механики (комментарии разработки)

- [1] МЕНЮ «+» (v1) и обёртка пульсации
- [20] ТАП-АНИМАЦИЯ ИКОНОК ВКЛАДОК (v1): иконки дока с отдельными частями + проигрыватель
- [34] Хранилище Forma: данные живут на устройстве (localStorage), общие для всех экранов приложения
- [76] вибро: Android через vibrate, iPhone через скрытый switch (Safari 17.4+)
- [84] универсальный сегмент
- [86] «Капля»: ведущий край индикатора идёт первым, задний догоняет
- [97] одометр: цифры прокручиваются; ведущие нули схлопываются
- [107] ползунок-сфера: сфера следует за пальцем, значение меняется на ближайшей отметке, на отпускании мягко «садится» на неё
- [128] ---------- общее хранилище: дневник и настройки нормы ----------
- [147] профиль → вкладка: если рост, вес, возраст, пол или % жира изменили в другом месте, подхватываем
- [153] вкладка → профиль: правки в «Моих данных» видны везде (Прогресс, Профиль, тренер)
- [164] ---------- профиль и норма (калькулятор калорий) ----------
- [165] QA: защита от битых данных в хранилище (NaN, строки, выход за границы, лишние индексы)
- [177] QA: минимум калорий при похудении по AHA/ACC/TOS 2013: 1200 ккал женщинам, 1500 мужчинам (было 1200 всем); для поддержания и набора пол не применяется
- [188] уровень темпа: процент от поддержания, потолок 1% веса в неделю (≈11 ккал/кг в день), жёсткий пол 1200 ккал
- [204] ---------- дневник ----------
- [213] цвет прогресса: зелёный; при превышении нормы оранжевый (для белка превышения нет)
- [264] ---------- моя норма ----------
- [307] ---------- выбор величин на линейке: рост, вес, возраст, замеры, процент жира ----------
- [318] лёгкое обновление при прокрутке: цифры нормы и плитки, без перерисовки графика и дневника
- [322] полный пересчёт один раз, когда пальцы остановились или лист закрыт
- [336] из кнопок и поля: мгновенно ставим шкалу и значение
- [340] из жеста: значение по положению шкалы, без анимаций; после остановки мягко подтягиваем к ближайшему делению
- [352] ---------- пояснения к переключателям: второе нажатие на выбранное показывает подсказку, третье убирает ----------
- [471] прогноз: быстрее в начале, затем ровнее (правило Холла + небольшая «водная» составляющая)
- [502] ---------- рецепты (заглушка) ----------
- [505] ---------- подвкладки ----------
- [516] ---------- нижнее меню и связь с оболочкой ----------
- [530] ---------- лист «Всё верно?» ----------
- [566] ---------- база продуктов (Open Food Facts) ----------
- [567] ---------- локальная база продуктов (офлайн): data/base_products.json (справочник) + data/ru_products.json (Open Food Facts, Россия) ----------
- [568] строка: [код,название,бренд,ккал,Б,Ж,У,порция г,сети,доверие(3 справочник,2 полные данные,1 проверить),синонимы]
- [589] ---------- камера и штрихкод ----------
- [635] LBL-START
- [636] ---------- разбор текста этикетки (OCR): КБЖУ на 100 г, название, порция ----------
- [663] основа: 100 г или порция
- [669] недостающее и проверка
- [680] LBL-END
- [682] ---------- сканер этикетки: распознавание на устройстве (tesseract.js, офлайн) ----------
- [717] ---------- «+»: выбор способа, поиск, ручной ввод ----------
- [791] ---------- связь с оболочкой ----------
- [796] изменили в другом окне
- [807] жест вверх/вниз с нижнего меню прокручивает страницу (раньше зона меню была «мёртвой» для скролла)
- [845] плашка нижнего меню перетекает от прежней вкладки к новой, как выбор дня

### Функции

`init`, `bz`, `set`, `okT`, `rd`, `wr`, `inval`, `isoOf`, `todayIso`, `addDays`, `dowOf`, `weekStartOf`, `ic`, `uid`, `esc`, `nf`, `r1`, `r2`, `buzz`, `toast`, `play`, `mkSeg`, `pl`, `mkOd`, `mkSl`, `pct`, `lbl`, `paint`, `ring`, `pick`, `idxAt`, `follow`, `up`, `saveND`, `haveData`, `pf`, `ageOf`, `lastW`, `tIso`, `seedP`, `pullProfile`, `birthFor`, `pushProfile`, `flo`, `bmrSet`, `bmrOf`, `tdeeOf`, `tier`, `calcNorm`, `p2`, `dk`, `calcWeek`, `pcol`, `sumOf`, `keyDate`, `setDateLabel`, `hintHtml`, `monOf`, `keyDow`, `nWeekHtml`, `nDrop`, `io`, `step`, `nWeekAfter`, `renderDiary`, `chDate`, `placeSph`, `ib`, `inf`, `macroText`, `floorText`, `pctOf`, `cl`, `navyBF`, `bmiBF`, `ptile`, `stepRow`, `segH`, `fcDelta`, `expText`, `plAll`, `toggleInf`, `openChange`, `openData`, `ageWord`, `npFmt`, `accSum`, `tileTxt`, `npLive`, `autoBF`, `npApply`, `closeNP`, `isMul`, `openNP`, `clampV`, `px`, `pulse`, `show`, `setV`, `hold`, `st`, `stop`, `closePops`, `hideTip`, `rgH`, `mkRg`, `gv`, `cur`, `fr`, `paint`, `val`, `move`, `up`, `slH`, `buildNorm`, `accSet`, `paintNorm`, `X`, `Y`, `replayNorm`, `descSet`, `setSub`, `send`, `initTabs`, `place`, `barsSvg`, `sceneSvg`, `syncScrim`, `mealNow`, `calc`, `itemHtml`, `renderSheet`, `renderItems`, `paint`, `openSheet`, `closeSheet`, `rescan`, `addToDay`, `cacheBc`, `afterAdd`, `addCur`, `showProduct`, `lnorm`, `ldbLoad`, `lrowPr`, `ldbFind`, `ldbCode`, `eanOk`, `offFetch`, `n1`, `r1n`, `prodFrom`, `setStat`, `stopDecode`, `stopStream`, `snap`, `noCam`, `openCam`, `closeCam`, `startCam`, `loadZX`, `startDecode`, `found`, `gotProduct`, `lookup`, `notFound`, `renderNotFound`, `lblNum`, `lblNorm`, `lblAfter`, `lblEnergy`, `lblTitle`, `lblName`, `lblParse`, `ocrURL`, `ocrLoadLib`, `ocrWorker`, `ocrWarm`, `ocrPrep`, `ocrLines`, `ocrRead`, `labelPick`, `lblSetP`, `renderLabelBusy`, `renderLabelFail`, `labelRun`, `openSh2`, `closeSh2`, `openPick`, `recents`, `lastMeal`, `relDay`, `rrHtml`, `renderRecents`, `openSearch`, `doSearch`, `renderManual`, `chk`, `onShow`, `scroller`, `dockT`, `end`, `step`, `layers`, `rootState`, `hscroll`, `blocked`, `subInfo`, `zi`, `closeTop`, `begin`, `finish`, `io`, `step`

### Элементы интерфейса (id)

`addD`, `again`, `ah0`, `ah1`, `app`, `as0`, `as1`, `bC`, `bF`, `bP`, `back`, `bfApply`, `bfCap`, `bkP`, `book`, `cW0`, `cW1`, `calcCard0`, `calcCard1`, `cam`, `camLbl`, `camMan`, `camSrch`, `camX`, `chArea`, `chD0`, `chD1`, `chD2`, `chD3`, `chPath`, `chPu`, `chSph`, `chTip`, `chTx`, `chain`, `chart`, `chev`, `chw`, `cpg0`, `cpg1`, `down`, `dt`, `dumb`, `e`, `edit`, `fab`, `fatBase`, `fatBig`, `fatSub`, `fcCard`, `fcH`, `fcRes`, `fcS`, `fcSent`, `fcg`, `fcsp`, `floorTx`, `food`, `home`, `ibFloor`, `inf_`, `inf_floor`, `inf_katch`, `inf_src`, `items`, `lbBar`, `lbTx`, `lbl`, `lblNm`, `lblRe`, `lfMan`, `lfRe`, `mC`, `mF`, `mG`, `mK`, `mN`, `mOk`, `mP`, `meals`, `minus`, `mm`, `nC`, `nChip`, `nF`, `nK`, `nP`, `nSub`, `nfLbl`, `nfMan`, `nmCard`, `nmTitle`, `nwk`, `pDiary`, `pLbl`, `pMan`, `pNorm`, `pRec`, `pScan`, `pSrch`, `panes`, `pct`, `pkB`, `pkOk`, `pkT`, `pkU`, `pkX`, `plus`, `pm`, `pp`, `pr`, `pv`, `qS`, `rL`, `r_hp`, `sMain`, `sSub`, `scan`, `scrim`, `search`, `sgSub`, `sh2`, `shP`, `sheet`, `srcB`, `stTx`, `stat`, `tC`, `tF`, `tK`, `tP`, `tabbar`, `toast`, `trash`, `user`, `v_`, `vf`, `vid`, `x`, `yl0`, `yl1`, `yl2`


## Прогресс · `prog`

Строк кода: 852 · функций: 218 · элементов с id: 104 · onclick в разметке: 0

Ключи данных (FS): `set` ×4, `profile` ×4, `hist` ×3, `wt` ×3, `plan` ×2, `progs` ×2, `xarch` ×1, `libq` ×1, `sync` ×1

Сообщения между экранами (`t`): `fs`, `hello`, `meal`, `open`, `sub`, `swipe`, `tab`

### Разделы и механики (комментарии разработки)

- [1] МЕНЮ «+» (v1) и обёртка пульсации
- [20] ТАП-АНИМАЦИЯ ИКОНОК ВКЛАДОК (v1): иконки дока с отдельными частями + проигрыватель
- [35] Хранилище Forma: данные живут на устройстве (localStorage), общие для всех экранов приложения
- [83] Круг-пульсация со стартового экрана: мягкое кольцо расходится от места отметки
- [87] Мягкое «жидкое» нажатие: без расходящихся колец — лёгкое сжатие и плавный возврат
- [91] только scale (compositor): без filter, повторный вызов не накладывается на предыдущий
- [114] нижнее меню
- [121] окно/лист
- [191] ---------- безопасные помощники ----------
- [208] ---------- каталог упражнений ----------
- [214] [[группа,%]] -> [[группа,доля]] (сумма 1) или null
- [218] ---------- нормализация данных ----------
- [237] ---------- сводные расчёты ----------
- [263] set: {weekStart:1}; -> {cur,best} подряд идущих недель; текущая неделя не рвёт серию, пока не закончилась
- [281] серия недель в ритме
- [294] ---------- медали ----------
- [307] ---------- общее состояние UI ----------
- [320] ---------- Общий ----------
- [459] ---------- запись веса ----------
- [490] ---------- медали: окно ----------
- [504] ---------- Тренировки ----------
- [558] ---------- Упражнения ----------
- [634] в каталоге есть: открываем карточку именно этого упражнения (там прогрессия/регрессия/техника); нет: поиск по названию
- [639] ---------- По неделям: таблица прогресса ----------
- [656] лучший подход ячейки: для веса — расчётный максимум (формула Эпли: вес × (1 + повторы/30), повторы свыше 12 не учитываются: оценка там ненадёжна), для своего тела — повторы, для времени — секунды
- [758] ---------- панели и навигация ----------
- [798] жест вверх/вниз с нижнего меню прокручивает страницу (раньше зона меню была «мёртвой» для скролла)
- [836] плашка нижнего меню перетекает от прежней вкладки к новой, как выбор дня

### Функции

`init`, `bz`, `set`, `okT`, `rd`, `wr`, `inval`, `isoOf`, `todayIso`, `addDays`, `dowOf`, `weekStartOf`, `dmy`, `reloadHist`, `lastOf`, `addHist`, `histOn`, `setsLine`, `pulseRing`, `pulseAt`, `ic`, `hlEl`, `buzz`, `raf`, `f`, `mix`, `hex`, `colorFor`, `esc`, `plural`, `uid`, `clone`, `fk`, `fi`, `send`, `toast`, `initTabs`, `place`, `openWin`, `closeLayers`, `openSheet`, `reduced`, `el`, `shown`, `cur`, `swapPane`, `put`, `enter`, `next`, `swapPanes`, `flip`, `next`, `initSeg`, `mark`, `place`, `set`, `arr`, `nn`, `S`, `okIso`, `th`, `f1`, `f0`, `sd`, `utc`, `daysBetween`, `wdOf`, `lowerFirst`, `dmyy`, `clamp`, `setPatch`, `catIdx`, `catOf`, `canonG`, `pairs`, `catDist`, `normEx`, `doneOf`, `normE`, `planN`, `nextW`, `exUnit`, `buildEx`, `weekRuns`, `compute`, `medalFams`, `mState`, `mLab`, `earnedIds`, `perOf`, `perFrom`, `inWin`, `go`, `barCol`, `anim`, `win`, `chips`, `bindChips`, `goBtn`, `ghostChart`, `wRem`, `wSubText`, `fzo`, `weightCard`, `wWindow`, `wDraw`, `pick`, `wSelect`, `rhythmCard`, `weeksOf`, `flRnd`, `flWave`, `flPath`, `flameSvg`, `streakCard`, `calFirst`, `calRange`, `calMonths`, `calCard`, `calSet`, `calPer`, `calUpd`, `calScroll`, `calInit`, `medalsCard`, `greeting`, `p0`, `wRS`, `parseW`, `rr1`, `buildRuler`, `wHint`, `setW`, `openW`, `hold`, `step`, `stop`, `openMedal`, `checkMedals`, `mVal`, `mLabV`, `mBars`, `muscleData`, `histRow`, `p1`, `lockedMuscles`, `soft`, `exRows`, `openSession`, `xMatch`, `xPr`, `xSorted`, `fu`, `spark`, `xDelta`, `p2`, `xNorm`, `xFind`, `xList`, `xChart`, `epl`, `rmOf`, `rmBest`, `xTipHtml`, `xChBind`, `pick`, `xNotes`, `xHist`, `xBind`, `close`, `openEx`, `sortH`, `tbCoach`, `tbNorm`, `tbGroups`, `prog`, `wk`, `tbTop`, `tbStr`, `tbNum`, `tbCell`, `line`, `tbMark`, `tbPct`, `tbVoice`, `tbTable`, `dsh`, `tbKey`, `tbSet`, `tbEnd`, `tbCard`, `tbChips`, `p3`, `tbBind`, `fail`, `renderPane`, `head`, `refresh`, `descSet`, `pl`, `showPane`, `scroller`, `dockT`, `end`, `step`, `layers`, `rootState`, `hscroll`, `blocked`, `subInfo`, `zi`, `closeTop`, `begin`, `finish`, `io`, `step`, `tg`, `fit`

### Элементы интерфейса (id)

`app`, `arrow`, `back`, `bell`, `book`, `calc`, `calic`, `chart`, `chat`, `check`, `chev`, `chevd`, `clock`, `copy`, `download`, `dumb`, `e0v`, `e0w`, `e1w`, `e2w`, `edit`, `fab`, `flame`, `flg-b`, `food`, `heart`, `hgo`, `hmore`, `home`, `info`, `leaf`, `link`, `m-bal`, `m-prg`, `m-qua`, `m-reg`, `mb`, `medal`, `mnote`, `p0`, `p1`, `p2`, `p3`, `pSub`, `pca`, `pcb`, `pcl`, `pcm`, `pcn`, `pcs`, `pdate`, `pgch`, `play`, `plus`, `ptab`, `pw`, `rgo`, `rtry`, `scale`, `scrim`, `scroll`, `search`, `shW`, `share`, `shield`, `sliders`, `tabbar`, `tbgo`, `tbl`, `tbme`, `toast`, `trash`, `upload`, `user`, `wadd`, `wbig`, `wc`, `wcard`, `wch`, `wdate`, `wdt`, `werr`, `wgo`, `whint`, `wi`, `wm`, `wnote`, `wo`, `wp`, `wr`, `wr2`, `wrs`, `wsave`, `wsl`, `wsub`, `wt`, `wtg`, `x`, `xcw`, `xl`, `xm`, `xmore`, `xq`, `xqc`


## Профиль · `prof`

Строк кода: 866 · функций: 187 · элементов с id: 135 · onclick в разметке: 0

Ключи данных (FS): `hist` ×8, `wt` ×7, `set` ×7, `plan` ×6, `progs` ×5, `demo` ×4, `profile` ×2, `sync` ×1

Сообщения между экранами (`t`): `coach-link`, `coach-unlink`, `fs`, `hello`, `meal`, `open`, `redo`, `reload`, `sub`, `swipe`, `tab`, `Беременность`, `Талия`

### Разделы и механики (комментарии разработки)

- [1] МЕНЮ «+» (v1) и обёртка пульсации
- [20] ТАП-АНИМАЦИЯ ИКОНОК ВКЛАДОК (v1): иконки дока с отдельными частями + проигрыватель
- [34] Хранилище Forma: данные живут на устройстве (localStorage), общие для всех экранов приложения
- [82] Круг-пульсация со стартового экрана: мягкое кольцо расходится от места отметки
- [86] Мягкое «жидкое» нажатие: без расходящихся колец — лёгкое сжатие и плавный возврат
- [90] только scale (compositor): без filter, повторный вызов не накладывается на предыдущий
- [95] Формулы. Все функции возвращают {ok:false,err:"..."} при недопустимых данных и никогда не NaN
- [103] BMR, ккал/сутки
- [109] sex: m|f ; age,h,w ; bf (необязательно)
- [114] цель: lose|keep|gain ; pace — доля от TDEE
- [119] опорный вес: при ИМТ > 27 белок и жиры считаем от веса при ИМТ 27, иначе цифры завышены
- [123] калорий слишком мало для такого белка: пересчёт по долям
- [125] ориентир по ИМТ и возрасту (Deurenberg 1991) — для сверки с замерами
- [129] ВМС США, см. Hodgdon & Beckett 1984
- [147] ключ, полное название, короткое, группа, область
- [160] быстрый выбор из онбординга → состояния
- [168] 0 — подходит, 1 — с осторожностью, 2 — не рекомендуется
- [178] все ограничения упражнения (для карточки), без привязки к профилю
- [181] для профиля: строки «что беречь» для старых мест (кнопки, регулярки)
- [189] Генератор программ Forma: чистый JS (без DOM). API: mkEx, starter, templates, copyProgram, estMin, stats, setCat
- [205] стартовые значения из текста диапазона: «3–6 (сила) / 8–12 (гипертрофия)» → 8; «30–45 сек» → 30 с; «2 мин пассивно + 20–30 сек PAIL» → 20 с
- [225] ---------- упражнение ----------
- [236] ---------- группы и типы тренировок ----------
- [262] ---------- отбор ----------
- [316] разминка вперёд, кор в конец, базовые вперёд; чередуем группы, не более 2 одной группы подряд (если это возможно)
- [390] ---------- стартовая программа ----------
- [420] ---------- готовые программы ----------
- [451] ---------- утилиты ----------
- [496] нижнее меню
- [503] окно/лист
- [570] локальные значения калькулятора (подставляются из профиля, правятся независимо)
- [580] ---------- сегмент ----------
- [587] ---------- сводка ----------
- [593] ---------- сворачиваемые карточки ----------
- [597] ---------- калькуляторы ----------
- [615] калории
- [661] % жира
- [687] ---------- обо мне ----------
- [714] ---------- ограничения здоровья ----------
- [735] ---------- расписание ----------
- [750] ---------- тренер ----------
- [760] ---------- данные ----------
- [777] демо-данные (помечаются demo:1 — удаляются без следа)
- [793] ---------- запуск ----------
- [805] при перезагрузке экранов вкладка «Питание» успевает дописать свои данные на выгрузке: после стирания повторяем стирание, когда она уже выгружена
- [819] жест вверх/вниз с нижнего меню прокручивает страницу (раньше зона меню была «мёртвой» для скролла)
- [857] плашка нижнего меню перетекает от прежней вкладки к новой, как выбор дня

### Функции

`init`, `bz`, `set`, `okT`, `rd`, `wr`, `inval`, `isoOf`, `todayIso`, `addDays`, `dowOf`, `weekStartOf`, `dmy`, `reloadHist`, `lastOf`, `addHist`, `histOn`, `setsLine`, `pulseRing`, `pulseAt`, `num`, `inr`, `r0`, `r1`, `chk`, `mifflin`, `harris`, `katch`, `actFor`, `bmr`, `target`, `macros`, `deur`, `bmi`, `bmiCat`, `navy`, `bfCat`, `arr`, `keysOf`, `pregOf`, `status`, `why`, `all`, `pregTxt`, `cauOf`, `readCat`, `reindex`, `ensure`, `setCat`, `uid`, `clamp`, `RXS`, `parseRng`, `defaults`, `mkEx`, `S`, `isJump`, `hasPc`, `normMins`, `countFor`, `mkCtx`, `score`, `best`, `cands`, `baseVal`, `slotList`, `arrange`, `exParams`, `buildOne`, `add`, `buildWorkouts`, `hasRe`, `validTime`, `sessionsFor`, `dayWord`, `starter`, `templates`, `copyProgram`, `estSec`, `estMin`, `stats`, `ic`, `hlEl`, `buzz`, `raf`, `f`, `mix`, `hex`, `colorFor`, `esc`, `plural`, `uid`, `clone`, `fk`, `fi`, `send`, `toast`, `initTabs`, `place`, `openWin`, `closeLayers`, `openSheet`, `reduced`, `el`, `shown`, `cur`, `swapPane`, `put`, `enter`, `next`, `swapPanes`, `flip`, `next`, `initSeg`, `mark`, `place`, `set`, `P`, `setP`, `ageOf`, `nf`, `num`, `goalName`, `lastW`, `wtSet`, `mkSeg`, `set`, `chips`, `toggle`, `renderSum`, `fixSegs`, `setAcc`, `acc`, `seedCalc`, `renderCalc`, `fld`, `sexSeg`, `bind`, `onSex`, `updSubs`, `drawCal`, `actTxt`, `drawPace`, `tween`, `f`, `calcRes`, `drawFat`, `fatRes`, `renderMe`, `saveH`, `saveW`, `rxSum`, `rxConflicts`, `rxSave`, `drawRxNote`, `drawRx`, `planObj`, `renderPlan`, `dn`, `renderCoach`, `syncTxt`, `copyTxt`, `fb`, `renderData`, `addDemo`, `FCATBY`, `removeDemo`, `remGet`, `remPut`, `renderRem`, `all`, `refresh`, `scroller`, `dockT`, `end`, `step`, `layers`, `rootState`, `hscroll`, `blocked`, `subInfo`, `zi`, `closeTop`, `begin`, `finish`, `io`, `step`

### Элементы интерфейса (id)

`app`, `arrow`, `back`, `bell`, `bfCal`, `bfSave`, `book`, `cAct`, `cActT`, `cCal`, `cCoach`, `cData`, `cFat`, `cGoal`, `cMe`, `cNut`, `cPace`, `cPaceW`, `cPlan`, `cRem`, `cSum`, `calBody`, `calH`, `calMsg`, `calSub`, `calWrap`, `calc`, `calic`, `chart`, `chat`, `check`, `chev`, `chevd`, `clock`, `coK`, `coS`, `coT`, `coW`, `coachBody`, `copy`, `cpCode`, `cpErr`, `cpGo`, `cpIn`, `cpOff`, `cpOn`, `dCopy`, `dDemo`, `dImp`, `dRedo`, `dWipe`, `dataBody`, `download`, `dumb`, `edit`, `fHipW`, `fPin`, `fab`, `fatBody`, `fatH`, `fatRes`, `fatSub`, `flame`, `fmSeg`, `food`, `heart`, `home`, `impErr`, `impNo`, `impOk`, `impTa`, `info`, `leaf`, `link`, `m-bal`, `m-prg`, `m-qua`, `m-reg`, `mBirth`, `mEq`, `mGoal`, `mH`, `mLvl`, `mName`, `mRx`, `mSex`, `mW`, `mWhere`, `meBody`, `meH`, `meSub`, `medal`, `mk`, `mv`, `nutGo`, `nutSave`, `pAuto`, `pDN`, `pDays`, `pMins`, `pRem`, `pTime`, `pdate`, `planBody`, `play`, `plus`, `remBody`, `rmF`, `rmM`, `rmW`, `rxBody`, `rxNote`, `rxOk`, `rxPreg`, `rxg-`, `scale`, `scrim`, `scroll`, `search`, `shImp`, `shRx`, `shWipe`, `share`, `shield`, `sliders`, `tabbar`, `toast`, `trash`, `upload`, `user`, `wipeNo`, `wipeOk`, `wipeP`, `wipeT`, `x`


## Библиотека (отдельный модуль) · `lib`

Строк кода: 526 · функций: 135 · элементов с id: 82 · onclick в разметке: 0

Ключи данных (FS): `libq` ×4, `progs` ×2, `profile` ×1

Сообщения между экранами (`t`): `body`, `fs`, `hello`, `libdock`, `open`, `tab`, `Беременность`

### Разделы и механики (комментарии разработки)

- [3] Хранилище Forma: данные живут на устройстве (localStorage), общие для всех экранов приложения
- [36] Круг-пульсация со стартового экрана: мягкое кольцо расходится от места отметки
- [40] Мягкое «жидкое» нажатие: без расходящихся колец — лёгкое сжатие и плавный возврат
- [44] только scale (compositor): без filter, повторный вызов не накладывается на предыдущий
- [49] Нечёткий поиск упражнений: по любой части слова, без учёта окончаний, с синонимами и опечатками
- [90] ключ, полное название, короткое, группа, область
- [103] быстрый выбор из онбординга → состояния
- [111] 0 — подходит, 1 — с осторожностью, 2 — не рекомендуется
- [121] все ограничения упражнения (для карточки), без привязки к профилю
- [124] для профиля: строки «что беречь» для старых мест (кнопки, регулярки)
- [150] нижнее меню
- [157] окно/лист
- [235] счётчики для листа фильтров
- [245] ---- ограничения: локальный выбор для подбора (начало = профиль) ----
- [252] ---- мое оборудование ----
- [259] ---- фильтрация ----
- [261] разговорные слова → слова каталога (запасной поиск, если по исходному запросу пусто)
- [287] ---- строки ----
- [351] смена списка — общий swapPane из common.js: старое уходит 160ms, новое входит .45s (opacity + translateY 8→0 + blur 4→0)
- [384] ---- поиск ----
- [392] быстрые чипы по оборудованию: один сегмент, индикатор скользит; несколько выбранных в листе фильтров — подсветка у каждого
- [407] ---- лист фильтров ----
- [444] ---- параметры по умолчанию для добавления ----
- [463] ---- добавить в тренировку ----
- [466] та же оценка, что в конструкторе: разминка 3 мин + на подход работа (40 с или время) + отдых, шаг 5 мин
- [498] заявка из других экранов: FS.set("libq",{eq:"mob"|q:"название"|id:"id упражнения"}) + переход на вкладку; читаем один раз
- [503] переход на конкретное упражнение: скрытое по ограничениям показываем с пометкой, дальние строки подгружаем, строку раскрываем и прокручиваем
- [515] ---- запуск ----
- [521] во встроенной Библиотеке нижняя панель вкладок принадлежит экрану «Тренировки» и лежит поверх iframe: пока открыт лист или окно, просим её спрятаться, иначе кнопки внизу листа (Показать, Добавить) недоступны

### Функции

`okT`, `rd`, `wr`, `inval`, `isoOf`, `todayIso`, `addDays`, `dowOf`, `weekStartOf`, `pulseRing`, `pulseAt`, `norm`, `stem`, `groupsOfWord`, `groupsOfQuery`, `lev`, `near`, `words`, `qwords`, `build`, `exact`, `chk`, `fuzzy`, `search`, `arr`, `keysOf`, `pregOf`, `status`, `why`, `all`, `pregTxt`, `cauOf`, `ic`, `hlEl`, `buzz`, `raf`, `f`, `mix`, `hex`, `colorFor`, `esc`, `plural`, `uid`, `clone`, `fk`, `fi`, `send`, `toast`, `initTabs`, `place`, `openWin`, `closeLayers`, `openSheet`, `reduced`, `el`, `shown`, `cur`, `swapPane`, `put`, `enter`, `next`, `swapPanes`, `flip`, `next`, `initSeg`, `mark`, `place`, `set`, `ltl`, `ix`, `prof`, `has`, `eqName`, `selKeys`, `hasSel`, `seedFromProfile`, `effP`, `selLabel`, `mineEq`, `mineTxt`, `hasAny`, `alias`, `searchQ`, `pass`, `sub`, `nActive`, `apply`, `pcOf`, `barRows`, `badge`, `rowHtml`, `posWords`, `hitKeys`, `pregHit`, `restrHtml`, `errList`, `recTxt`, `ytUrl`, `bodyHtml`, `selTxt`, `plr`, `emptyHtml`, `infoRender`, `pswap`, `renderList`, `loadMore`, `toggleOpen`, `animBars`, `toggleSel`, `selIds`, `syncSel`, `resetFilters`, `reset`, `placeQ`, `drawQ`, `chp`, `drawF`, `syncF`, `afterF`, `closeF`, `lowOf`, `defaults`, `fin`, `mkEx`, `progs`, `estMin`, `badOf`, `footN`, `footW`, `tryCommit`, `openPick`, `commit`, `reseed`, `takeQ`, `n`

### Элементы интерфейса (id)

`app`, `arrow`, `back`, `bell`, `book`, `calc`, `calic`, `chart`, `chat`, `check`, `chev`, `chevd`, `clock`, `clr`, `copy`, `download`, `dumb`, `edit`, `fab`, `fbody`, `fbtn`, `fclr`, `flame`, `fnb`, `fok`, `food`, `heart`, `home`, `info`, `lcnt`, `leaf`, `link`, `ll`, `lpane`, `m-bal`, `m-prg`, `m-qua`, `m-reg`, `medal`, `mnote`, `more`, `mw`, `pgc`, `pick`, `pkb`, `pkc`, `pkf`, `pkg`, `pkin`, `pkl`, `pkname`, `pky`, `play`, `plus`, `q`, `qind`, `qrow`, `rc`, `rinb`, `rinfo`, `rl`, `rst`, `sadd`, `sback`, `scale`, `scrim`, `scroll`, `search`, `selbar`, `shF`, `share`, `shield`, `sliders`, `tabbar`, `thide`, `toast`, `trash`, `tsub`, `tw`, `upload`, `user`, `x`

# Кнопки и подписи действий по экранам (автоматически)

Текстовые кнопки и подписи доступности из разметки и шаблонов. Иконочные кнопки без текста отражены в реестре по id. Это нижняя граница: часть подписей собирается из переменных и здесь не видна. Служит чек-листом: каждая кнопка должна работать в новой версии.


## onb (7)

[Ваше имя] · [Дальше] · [Код тренера] · [Назад] · [Начать] · Добавить · Пропустить

## home (48)

[Больше на 0,1] · [Вес в килограммах] · [Время] · [Дата окончания] · [Дата] · [Добавить] · [Закрыть камеру] · [Закрыть] · [Календарь тренировок] · [Меньше на 0,1] · [Оставить как есть] · [Подробнее о тренировке] · [Ритм недели] · [Собрать тренировку] · [Уведомления] · · : ) mn мин · · Без конца · Вернуть в план · Вернуть по плану · Все готовые программы · Готово · Добавить · Добавить приём пищи · Добавить тренировку · Другой день · Завтра · Изменить · Каждую неделю · На сегодня · Настроить напоминания · Начать · Новая тренировка · Один раз · Оставить как есть · Открыть · Отмена · Перенести · Пропустить сегодня · Прочитано · Прочитать все · Раз в 2 недели · Раз в месяц · Сегодня · Собрать с нуля · Создать новую тренировку · Сохранить · Удалить · Через

## work (82)

[Вернуться к тренировке] · [Действия с программой] · [Действия с тренировкой] · [Действия] · [Закрыть камеру] · [Закрыть] · [Запустить таймер отдыха] · [Информация об упражнении] · [Минус 15 секунд] · [Назад] · [Название тренировки] · [Новая тренировка] · [Объединить в суперсет] · [Отменить замену] · [Пауза] · [Переключить килограммы и секунды] · [Плюс 15 секунд] · [Подходит мне: скрыть не рекомендуемые упражнения] · [Пояснение к упражнению] · [Предпросмотр] · [Предыдущий день] · [Сбросить таймер] · [Свернуть] · [Следующий день] · [Смотреть трейлер] · [Сохранить черновик] · [Что такое усилие] · Библиотека · В Прогресс · Вернуть · Все · Все мышцы · Готово · Готовые · Готовые программы · Дискомфорт · Добавить приём пищи · Добавить упражнение · Завершить · Завершить без сохранения · Закрыть · Заменить · Заметка · Заметка тренера · · Изменить код · К тренировкам · Клиенты · Купить · Любой уровень · Мои · Начать · Недавние тренировки · Новая тренировка · Одну тренировку · Оставить прежний · Открыть «Мои» · Открыть как тренер, на примере · Отменить · Отправить · Подключиться · Подобрать автоматически · Подход · Подходит мне · Показать все · Показать ещё · Показать ещё … из · Показать на примере · Программу целиком · Продолжить · Прошлая неделя · Сбросить · Сбросить поиск и фильтры · Сбросить фильтры · Скопировать код · Скопировать мой код · · Собрать самой · Создать программу · Трейлер · Тренировка · Убрать демо-клиентов · Черновик · программа……~… мин

## nutr (39)

[Больше] · [Граммы] · [Добавить еду] · [Закрыть камеру] · [Закрыть] · [Меньше] · [Название продукта] · [Пояснение] · [Проверьте результат] · [Сканировать штрихкод] · [Удалить запись] · Ввести вручную · Готово · Дневник · Добавить · Добавить в дневник · Добавить приём пищи · Источники · К выбору · Калькулятор калорий · Калькулятор процента жира · Моя норма · Найти по названию · Найти продукт · Новая тренировка · Переснять · Повторить весь приём · … ккал · Подобрать блюда · Прогноз веса · Рецепты · Сканировать штрихкод · Сохранить · Сфотографировать название · Указать данные · Фото этикетки · Фото этикеткиЗаполню калории и БЖУ сам · Цель: … · норма … ккал · ккал · ккал на 100 г

## prog (31)

[Больше на 0,1] · [Вес в килограммах] · [График веса] · [Закрыть камеру] · [Закрыть] · [Заметки] · [Меньше на 0,1] · [Напоминать о весе] · [Очистить] · [По неделям, последние 6] · [Собрать тренировку] · [Тренировок по неделям, последние 6] · В тренировки · Варианты облегчения · Добавить приём пищи · Закрыть · Записать вес · К тренировкам · Мои тренировки · Начать первую тренировку · Новая тренировка · Обновить · Общий · По неделям · Повторить тренировку · Показать ещё · Посмотреть технику · Сохранить · Тренировки · Упражнения · раз

## prof (27)

[Больше] · [Закрыть камеру] · [Закрыть] · [Меньше] · [Напоминания] · [Собрать тренировку] · Восстановить · Восстановить из копии · Готово · Добавить приём пищи · Мой портретИмя, пол, рост, вес, оборудование · Новая тренировка · Оставить · Ответить на вопросы заново · Отключиться · Открыть клиентов · Отмена · Подключиться · Подобрать программу заново · Процент жираПо замерам тела · Скопировать код · Скопировать копию данных · Сохранить % жира · Сохранить как мою норму · Стереть · Стереть все данные на этом телефоне · Учесть в калориях

## lib (26)

[Выбрать] · [Очистить] · [Скрывать нерекомендованное] · [Собрать тренировку] · [Фильтры] · · ≈ … мин · Все · Все ограничения · · Всё равно добавить · Добавить · Добавить в тренировку · Назад · Найти разбор техники в видео · Новая тренировкаСоздадим и добавим упражнения · Обновить · Отмена · Подробнее: техника и ошибки · Показать · Показать все · Показать всё · Показать ещё · Показать скрытые · · Сбросить · Сбросить поиск · Сбросить фильтры · Скрыть
