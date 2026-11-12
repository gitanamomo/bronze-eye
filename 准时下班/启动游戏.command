#!/bin/zsh
cd "${0:A:h}"
if /usr/sbin/lsof -nP -iTCP:5186 -sTCP:LISTEN >/dev/null 2>&1; then
  print '5186 端口已被使用，请关闭原服务或双击 index.html 离线运行。'
  read -k 1
  exit 1
fi
print '准时下班：http://127.0.0.1:5186'
print '退出游戏后，在本窗口按 Ctrl+C 关闭本次服务。'
(sleep 1; open 'http://127.0.0.1:5186') &
python3 -m http.server 5186 --bind 127.0.0.1
