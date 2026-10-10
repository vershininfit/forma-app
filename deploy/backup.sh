#!/bin/sh
# Раз в сутки дамп базы в /backups, хранится 14 дней. Восстановление: см. deploy/README.md
while true; do
  f="/backups/forma-$(date +%Y%m%d-%H%M).sql.gz"
  if pg_dump -h db -U forma forma | gzip > "$f.tmp" && [ -s "$f.tmp" ]; then mv "$f.tmp" "$f"; echo "backup ok $f"; else rm -f "$f.tmp"; echo "backup FAILED"; fi
  find /backups -name 'forma-*.sql.gz' -mtime +14 -delete
  sleep 86400
done
