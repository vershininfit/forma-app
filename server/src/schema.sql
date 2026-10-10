-- Forma: схема PostgreSQL (v0.1). Права проверяются в API; все выборки тренера идут через links.status='active'.

CREATE TABLE IF NOT EXISTS users (
  id          uuid PRIMARY KEY,
  device_id   text UNIQUE,                 -- случайный id установки (до входа по почте/телефону)
  email       text UNIQUE,                 -- v2: вход по почте/телефону
  phone       text UNIQUE,
  role        text NOT NULL DEFAULT 'client' CHECK (role IN ('client','coach')),
  backup      boolean NOT NULL DEFAULT false,   -- клиент без тренера включил облачную копию данных
  name        text NOT NULL DEFAULT '',
  created_at  timestamptz NOT NULL DEFAULT now(),
  deleted_at  timestamptz
);

-- секретные коды доступа тренера. Хранится только хеш (scrypt). Код выдаёт владелец лично.
CREATE TABLE IF NOT EXISTS coach_codes (
  id          serial PRIMARY KEY,
  label       text NOT NULL,               -- «Валерий», «Тренер Иван»
  salt        text NOT NULL,
  hash        text NOT NULL,
  max_uses    int  NOT NULL DEFAULT 1,     -- сколько устройств может его активировать
  uses        int  NOT NULL DEFAULT 0,
  expires_at  timestamptz,
  revoked_at  timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- профиль тренера: публичный код приглашения, который тренер раздаёт клиентам
CREATE TABLE IF NOT EXISTS coaches (
  user_id      uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  code_id      int REFERENCES coach_codes(id),
  invite_code  text NOT NULL UNIQUE,       -- 8 символов, без похожих (0/O, 1/I)
  display_name text NOT NULL DEFAULT '',
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- привязка клиент–тренер. Один активный тренер у клиента (v1). Согласие фиксируется временем и версией текста.
CREATE TABLE IF NOT EXISTS links (
  id          bigserial PRIMARY KEY,
  coach_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id   uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status      text NOT NULL CHECK (status IN ('active','revoked_by_client','removed_by_coach')),
  consent_v   text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  ended_at    timestamptz
);
CREATE UNIQUE INDEX IF NOT EXISTS links_one_active_per_client ON links(client_id) WHERE status='active';
CREATE INDEX IF NOT EXISTS links_coach_active ON links(coach_id) WHERE status='active';

-- документы клиента: ключи профиля, плана, настроек (последняя запись побеждает, rev растёт на 1)
CREATE TABLE IF NOT EXISTS docs (
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  key        text NOT NULL,                -- profile, plan, progs, set, nutr
  rev        int  NOT NULL DEFAULT 1,
  value      jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, key)
);

-- выполненные тренировки: только добавление, id создаёт приложение (повторная отправка безопасна)
CREATE TABLE IF NOT EXISTS sessions (
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  id         text NOT NULL,
  d          date NOT NULL,
  payload    jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, id)
);
CREATE INDEX IF NOT EXISTS sessions_user_d ON sessions(user_id, d DESC);

CREATE TABLE IF NOT EXISTS weights (
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  d          date NOT NULL,
  v          numeric(5,1) NOT NULL,
  PRIMARY KEY (user_id, d)
);

-- заметки и программы тренера клиенту
CREATE TABLE IF NOT EXISTS coach_items (
  id         bigserial PRIMARY KEY,
  coach_id   uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id  uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind       text NOT NULL CHECK (kind IN ('note','program')),
  payload    jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  read_at    timestamptz
);
CREATE INDEX IF NOT EXISTS coach_items_client ON coach_items(client_id, id);

-- журнал событий для получателя: доставка в реальном времени + повтор после обрыва связи
CREATE TABLE IF NOT EXISTS events (
  id         bigserial PRIMARY KEY,
  to_user    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       text NOT NULL,
  payload    jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS events_to ON events(to_user, id);

-- кто и когда смотрел данные клиента, попытки ввода кода
CREATE TABLE IF NOT EXISTS audit_log (
  id         bigserial PRIMARY KEY,
  at         timestamptz NOT NULL DEFAULT now(),
  actor      uuid,
  action     text NOT NULL,
  target     uuid,
  meta       jsonb NOT NULL DEFAULT '{}'
);

-- «сегодня» по Москве: даты тренировок приходят из приложения в локальном времени
CREATE OR REPLACE FUNCTION msk_today() RETURNS date AS $$ SELECT (now() AT TIME ZONE 'Europe/Moscow')::date $$ LANGUAGE sql STABLE;

-- персональные промокоды программ: тренер придумывает код для клиента, клиент вводит его, программа попадает в «Мои»
CREATE TABLE IF NOT EXISTS program_codes (
  id           bigserial PRIMARY KEY,
  coach_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code         text NOT NULL UNIQUE,            -- в верхнем регистре, уникален среди всех тренеров
  label        text NOT NULL DEFAULT '',        -- для кого («Анна, ноги»), видит только тренер
  title        text NOT NULL DEFAULT '',
  program      jsonb NOT NULL,                  -- копия программы на момент выдачи
  ver          int NOT NULL DEFAULT 1,          -- растёт при обновлении программы тренером
  bind_phone   text,                            -- если задан, код сработает только у клиента с этим телефоном
  auto_link    boolean NOT NULL DEFAULT false,  -- при вводе кода ещё и подключить клиента к тренеру (с согласием)
  status       text NOT NULL DEFAULT 'active' CHECK (status IN ('active','redeemed','revoked')),
  redeemed_by  uuid REFERENCES users(id) ON DELETE SET NULL,
  redeemed_at  timestamptz,
  expires_at   timestamptz NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS program_codes_coach ON program_codes(coach_id, id DESC);

-- одноразовые коды входа по телефону (хранится только хеш)
CREATE TABLE IF NOT EXISTS otps (
  id         bigserial PRIMARY KEY,
  phone      text NOT NULL,
  code_hash  text NOT NULL,
  attempts   int  NOT NULL DEFAULT 0,
  used       boolean NOT NULL DEFAULT false,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS otps_phone ON otps(phone, id DESC);

ALTER TABLE users ADD COLUMN IF NOT EXISTS backup boolean NOT NULL DEFAULT false;

-- подписки на push (Web Push): одна строка на устройство
CREATE TABLE IF NOT EXISTS push_subs (
  endpoint   text PRIMARY KEY,
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  p256dh     text NOT NULL,
  auth       text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS push_subs_user ON push_subs(user_id);
