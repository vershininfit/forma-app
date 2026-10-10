#!/usr/bin/env bash
# Первая установка на чистый сервер Ubuntu 22.04/24.04.
#   sudo bash setup.sh <домен> <почта>
# Ставит Docker, скачивает приложение, создаёт секреты, запускает сайт с HTTPS, базу и копии.
set -euo pipefail
DOMAIN="${1:-}"; EMAIL="${2:-}"
[ "$(id -u)" = 0 ] || { echo "Запустите через sudo"; exit 1; }
[ -n "$DOMAIN" ] && [ -n "$EMAIL" ] || { echo "Использование: sudo bash setup.sh forma.example.ru you@mail.ru"; exit 1; }
REPO_URL="${REPO_URL:-https://github.com/vershininfit/forma-app.git}"
ROOT=/opt/forma
say() { printf '\n\033[1m== %s\033[0m\n' "$*"; }

say "1/6 Проверка адреса $DOMAIN"
MYIP="$(curl -4fsS https://api.ipify.org || curl -4fsS https://ifconfig.me)"
DNSIP="$(getent ahostsv4 "$DOMAIN" | awk '{print $1; exit}' || true)"
echo "IP сервера: $MYIP, адрес $DOMAIN указывает на: ${DNSIP:-ничего}"
if [ "$MYIP" != "$DNSIP" ]; then
  echo "Домен ещё не указывает на этот сервер. Создайте у регистратора запись A: $DOMAIN -> $MYIP, подождите 5-30 минут и запустите скрипт снова."
  exit 1
fi

say "2/6 Docker"
if ! command -v docker >/dev/null; then
  apt-get update -y && apt-get install -y curl ca-certificates git openssl
  curl -fsSL https://get.docker.com | sh
fi
command -v git >/dev/null || apt-get install -y git
command -v openssl >/dev/null || apt-get install -y openssl
mkdir -p /etc/docker
[ -f /etc/docker/daemon.json ] || { echo '{"registry-mirrors":["https://mirror.gcr.io"],"log-driver":"json-file","log-opts":{"max-size":"10m","max-file":"3"}}' > /etc/docker/daemon.json; systemctl restart docker; }

say "3/6 Загрузка приложения"
mkdir -p "$ROOT/backups"; cd "$ROOT"
if [ -d repo/.git ]; then git -C repo pull --ff-only; else git clone --depth 1 "$REPO_URL" repo; fi
DC="docker compose --project-directory $ROOT -f $ROOT/repo/deploy/docker-compose.yml"

say "4/6 Секреты"
if [ ! -f .env ]; then
  umask 077
  cat > .env <<EOF
DOMAIN=$DOMAIN
ADMIN_EMAIL=$EMAIL
POSTGRES_PASSWORD=$(openssl rand -hex 16)
SECRET=$(openssl rand -hex 32)
VAPID_PUBLIC=x
VAPID_PRIVATE=x
EOF
  $DC build api
  KEYS="$($DC run --rm --no-deps -T api node -e "const w=require('web-push');const k=w.generateVAPIDKeys();console.log(k.publicKey+' '+k.privateKey)" | tail -1)"
  sed -i "s|^VAPID_PUBLIC=.*|VAPID_PUBLIC=${KEYS% *}|; s|^VAPID_PRIVATE=.*|VAPID_PRIVATE=${KEYS#* }|" .env
  echo "Секреты созданы в $ROOT/.env (файл читает только администратор). Сохраните копию этого файла в надёжном месте: без SECRET и ключей push придётся входить заново."
else
  echo ".env уже есть, оставляю как есть"
fi
chmod 600 .env

say "5/6 Запуск"
$DC up -d --build

say "6/6 Ожидание сертификата и проверка"
for i in $(seq 1 40); do
  if curl -fsS "https://$DOMAIN/health" >/dev/null 2>&1; then echo "Сервер отвечает: https://$DOMAIN/health"; break; fi
  sleep 5
  [ "$i" = 40 ] && { echo "Не отвечает. Смотрим логи: docker compose --project-directory $ROOT -f $ROOT/repo/deploy/docker-compose.yml logs --tail=50"; exit 1; }
done
cat <<EOF

Готово. Дальше:
  1) Создайте код тренера:   sudo bash $ROOT/repo/deploy/coach-code.sh
  2) Откройте https://$DOMAIN на iPhone в Safari -> Поделиться -> На экран «Домой».
Обновление приложения:     sudo bash $ROOT/repo/deploy/update.sh
EOF
