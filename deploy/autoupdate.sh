#!/usr/bin/env bash
# Автообновление: каждые 5 минут смотрит GitHub; если есть новая версия, делает копию базы,
# обновляет, проверяет /health и при сбое откатывается на прежнюю версию. Журнал: /opt/forma/autoupdate.log
set -uo pipefail
ROOT=/opt/forma; R=$ROOT/repo; LOG=$ROOT/autoupdate.log
DC="docker compose --project-directory $ROOT -f $R/deploy/docker-compose.yml"
exec 9>/run/forma-autoupdate.lock; flock -n 9 || exit 0
log(){ echo "$(date -Is) $*" >> "$LOG"; }
cd "$R" || exit 1
git fetch -q origin main 2>>"$LOG" || exit 0
OLD=$(git rev-parse HEAD); NEW=$(git rev-parse origin/main)
[ "$OLD" = "$NEW" ] && exit 0
git merge-base --is-ancestor "$OLD" "$NEW" || { log "пропуск: история GitHub не продолжает текущую версию"; exit 0; }
log "обновление ${OLD:0:7} -> ${NEW:0:7}"
mkdir -p "$ROOT/backups"
B="$ROOT/backups/forma-pre-${NEW:0:7}.sql.gz"
$DC exec -T db pg_dump -U forma forma 2>>"$LOG" | gzip > "$B.tmp" && [ -s "$B.tmp" ] && mv "$B.tmp" "$B" || { rm -f "$B.tmp"; log "копия базы не создана, обновление отменено"; exit 1; }
git merge --ff-only origin/main >>"$LOG" 2>&1 || { log "не удалось забрать версию"; exit 1; }
$DC up -d --build >>"$LOG" 2>&1
DOM=$(grep -E '^DOMAIN=' "$ROOT/.env" | cut -d= -f2)
ok=0
for i in $(seq 1 24); do
  if curl -fsS -m 5 --resolve "$DOM:443:127.0.0.1" "https://$DOM/health" 2>/dev/null | grep -q '"ok":true'; then ok=1; break; fi
  sleep 5
done
if [ $ok = 1 ]; then
  docker image prune -f >/dev/null 2>&1; log "готово, версия ${NEW:0:7}"
else
  log "СБОЙ после обновления, откат на ${OLD:0:7}"
  git reset --hard "$OLD" >>"$LOG" 2>&1
  $DC up -d --build >>"$LOG" 2>&1
  log "откат выполнен; копия базы до обновления: $B"
fi
find "$ROOT/backups" -name 'forma-pre-*.sql.gz' -mtime +14 -delete 2>/dev/null
