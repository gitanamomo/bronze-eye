#!/bin/zsh
cd "${0:A:h}"
if [ -d "古蜀迷踪：青铜之眼.app" ]; then
  open "古蜀迷踪：青铜之眼.app"
  exit 0
fi
python3 -m http.server 5173 --bind 127.0.0.1 &
game_server_pid=$!
trap 'kill "$game_server_pid" 2>/dev/null' EXIT INT TERM
sleep 1
if kill -0 "$game_server_pid" 2>/dev/null; then
  open 'http://127.0.0.1:5173'
  echo '游戏已启动。关闭此终端或按 Ctrl+C 停止本次服务器。'
  wait "$game_server_pid"
fi
