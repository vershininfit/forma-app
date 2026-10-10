#!/usr/bin/env bash
# Обновление: забирает свежую версию из GitHub и перезапускает. База и копии не затрагиваются.
set -euo pipefail
ROOT=/opt/forma
git -C $ROOT/repo pull --ff-only
docker compose --project-directory $ROOT -f $ROOT/repo/deploy/docker-compose.yml up -d --build
docker image prune -f >/dev/null
docker compose --project-directory $ROOT -f $ROOT/repo/deploy/docker-compose.yml ps
