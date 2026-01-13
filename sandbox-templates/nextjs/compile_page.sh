#!/bin/bash
set -e

APP_DIR="/home/user"   # <-- change this if your app lives elsewhere

function ping_server() {
  local response="000"
  local counter=0
  while [[ "$response" -ne 200 ]]; do
    counter=$((counter+1))
    response=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:3000" || echo "000")
    if (( counter % 20 == 0 )); then
      echo "Waiting for server to start... (last=$response)"
      sleep 0.2
    fi
  done
}

cd "$APP_DIR"

# Start Next.js on all interfaces so E2B can expose port 3000
npx next dev -H 0.0.0.0 -p 3000 --turbopack &
NEXT_PID=$!

# Wait until it's responding (builds / warms up the page)
ping_server
echo "Server is up on 0.0.0.0:3000"

# Keep the sandbox alive by waiting on Next.js
wait "$NEXT_PID"
