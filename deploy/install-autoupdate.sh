#!/usr/bin/env bash
# Включает автообновление (таймер каждые 5 минут). Запуск: bash /opt/forma/repo/deploy/install-autoupdate.sh
set -euo pipefail
chmod +x /opt/forma/repo/deploy/autoupdate.sh
cat > /etc/systemd/system/forma-autoupdate.service <<'U'
[Unit]
Description=Forma autoupdate
[Service]
Type=oneshot
ExecStart=/opt/forma/repo/deploy/autoupdate.sh
U
cat > /etc/systemd/system/forma-autoupdate.timer <<'U'
[Unit]
Description=Forma autoupdate every 5 min
[Timer]
OnBootSec=2min
OnUnitActiveSec=5min
[Install]
WantedBy=timers.target
U
systemctl daemon-reload
systemctl enable --now forma-autoupdate.timer
echo "Автообновление включено. Журнал: /opt/forma/autoupdate.log"
systemctl list-timers forma-autoupdate.timer --no-pager | head -3
