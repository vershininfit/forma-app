# Проверка качества Forma (QA)

Инструменты плановой проверки приложения. Запуск из отдельной рабочей папки (не из репозитория), чтобы скриншоты и состояния не попали в git.

```
cd /path/to/forma-app && python3 -m http.server 8765 --bind 127.0.0.1 &   # локально тот же код, что на GitHub Pages
mkdir -p ~/qa-run && cd ~/qa-run
node /path/to/forma-app/tools/qa/mkstates.js          # state-base / state-live / state-tr (онбординг проходит как пользователь)
node /path/to/forma-app/tools/qa/audit.js state-base.json base          # дизайн и вёрстка 7 экранов (390x844)
node /path/to/forma-app/tools/qa/audit.js state-base.json s360 360x640  # малый экран
node /path/to/forma-app/tools/qa/crawl.js /path/to/forma-app/tools/qa/routes.json crawl.json   # нажатие каждой кнопки в чистом состоянии
```

- `lib.js` открытие приложения в Playwright (iPhone, ru-RU, Москва), поиск активного кадра, список кнопок.
- `onbauto.js` прохождение онбординга как пользователь.
- `checks.js` проверки экрана: горизонтальная прокрутка, шрифты вне шкалы, вес шрифта, курсив, мелкие кнопки, обрезанный текст, технические строки (undefined/NaN), битые картинки, кривые и длительности анимаций, серые плашки и градиенты, вылеты за экран, радиусы, контраст.
- `crawl.js` обход кнопок: ошибки JS, диалоги браузера, реакция на нажатие, вёрстка после нажатия, скриншоты в `crawl/`.
- `apply_fixes.py` правки кадров внутри `index.html` (FRAMES) и оболочки без ручной распаковки.

Правила: тестовые данные только в изолированном браузере Playwright; после правок поднять `const V` в `sw.js`; журнал проверок в проекте Claude: `claude/forma-qa-log.md`.
