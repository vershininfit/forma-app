#!/usr/bin/env bash
# Код тренера: вы придумываете его сами (от 8 символов), в базе хранится только хеш.
#   bash coach-code.sh add "Валерий" 3     (метка и сколько устройств могут им войти)
#   bash coach-code.sh list
#   bash coach-code.sh revoke 1
ROOT=/opt/forma
CMD="${1:-add}"; shift || true
[ "$CMD" = add ] && [ $# -eq 0 ] && set -- "Валерий" 3
exec docker compose --project-directory $ROOT -f $ROOT/repo/deploy/docker-compose.yml exec api node src/cli.js "$CMD" "$@"
