#!/usr/bin/env bash
# Восстановление базы из копии: bash restore.sh /opt/forma/backups/forma-20261010-0300.sql.gz
# ВНИМАНИЕ: текущие данные базы заменяются данными из копии.
set -euo pipefail
F="${1:?укажите файл копии}"; ROOT=/opt/forma
DC="docker compose --project-directory $ROOT -f $ROOT/repo/deploy/docker-compose.yml"
read -r -p "Заменить текущую базу данными из $F? Напишите yes: " a; [ "$a" = yes ] || exit 1
$DC stop api
$DC exec -T db psql -U forma -d forma -c 'DROP SCHEMA public CASCADE; CREATE SCHEMA public;'
gunzip -c "$F" | $DC exec -T db psql -U forma -d forma -v ON_ERROR_STOP=1 >/dev/null
$DC start api
echo "Готово"
