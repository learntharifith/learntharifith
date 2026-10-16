#!/usr/bin/env bash
# Server-side deploy script for Learntharifith Next.js app
# Run on the Contabo VPS as root (or with sudo).
#
# Usage:
#   bash deploy/deploy.sh

set -euo pipefail

APP_DIR="/home/dev.learntharifith.com/nextapp"
APP_USER="devle3501"
PORT="3001"
REPO_URL="${1:-}"   # optional: git URL to clone from

echo "▶ Learntharifith deploy — $(date '+%F %T')"

# ── 0. Prerequisite checks (fail fast with a helpful message) ────────
echo "▶ [0/8] Checking prerequisites…"

check_cmd_for_user() {
  local cmd="$1"
  if sudo -u "$APP_USER" bash -lc "command -v $cmd" >/dev/null 2>&1; then
    local ver
    ver=$(sudo -u "$APP_USER" bash -lc "$cmd --version" 2>/dev/null | head -n1 || echo "ok")
    echo "  ✓  $cmd  ($ver)"
    return 0
  else
    echo "  ✗  $cmd is NOT available to user '$APP_USER'"
    return 1
  fi
}

MISSING=0
check_cmd_for_user bun  || { echo ""; echo "     FIX:  Install bun system-wide (not just for root):"; echo "       BUN_INSTALL=/opt/bun curl -fsSL https://bun.sh/install | bash"; echo "       ln -sf /opt/bun/bin/bun /usr/local/bin/bun"; echo ""; MISSING=1; }
check_cmd_for_user git  || { echo ""; echo "     FIX:  apt install -y git"; echo ""; MISSING=1; }
# pm2 is used by root, not APP_USER — check it for root
if command -v pm2 >/dev/null 2>&1; then
  echo "  ✓  pm2   ($(pm2 --version))"
else
  echo "  ✗  pm2 is NOT installed"
  echo ""
  echo "     FIX:  npm install -g pm2"
  echo ""
  MISSING=1
fi

if [[ "$MISSING" -ne 0 ]]; then
  echo ""
  echo "❌ Prerequisites missing. Install them, then re-run:"
  echo "   bash deploy/deploy.sh"
  exit 1
fi

# 1. App directory
echo "▶ [1/8] Preparing app directory…"
mkdir -p "$APP_DIR/db" "$APP_DIR/logs"
chown -R "$APP_USER:$APP_USER" "$APP_DIR"

if [[ -n "$REPO_URL" && ! -d "$APP_DIR/.git" ]]; then
  echo "  cloning from $REPO_URL"
  sudo -u "$APP_USER" git clone "$REPO_URL" "$APP_DIR"
elif [[ -d "$APP_DIR/.git" ]]; then
  echo "  pulling latest"
  sudo -u "$APP_USER" git -C "$APP_DIR" pull --ff-only
fi

cd "$APP_DIR"

# 2. Install dependencies
echo "▶ [2/8] Installing dependencies…"
sudo -u "$APP_USER" bash -lc "cd '$APP_DIR' && bun install --frozen-lockfile"

# 3. Env file
echo "▶ [3/8] Writing .env…"
if [[ ! -f "$APP_DIR/.env" ]]; then
  cp "$APP_DIR/.env.production.example" "$APP_DIR/.env"
  chown "$APP_USER:$APP_USER" "$APP_DIR/.env"
  chmod 600 "$APP_DIR/.env"
  echo "  created .env from template"
else
  echo "  .env already exists — keeping it"
fi

# 4. Generate Prisma client + push schema
echo "▶ [4/8] Generating Prisma client + pushing schema…"
sudo -u "$APP_USER" bash -lc "cd '$APP_DIR' && bun run db:generate && bun run db:push"

# 5. Seed (idempotent — safe to re-run)
echo "▶ [5/8] Seeding database…"
sudo -u "$APP_USER" bash -lc "cd '$APP_DIR' && bun run scripts/seed.ts"

# 6. Build (produces .next/standalone)
echo "▶ [6/8] Building Next.js app…"
sudo -u "$APP_USER" bash -lc "cd '$APP_DIR' && bun run build"

# 7. Restart PM2
echo "▶ [7/8] Restarting PM2…"
if pm2 describe learntharifith-dev >/dev/null 2>&1; then
  pm2 restart learntharifith-dev --update-env
  echo "  restarted existing app"
else
  pm2 start ecosystem.config.cjs
  echo "  started new app"
fi
pm2 save

# 8. Smoke test
echo "▶ [8/8] Smoke test…"
sleep 2
if curl -sf -o /dev/null -m 5 "http://127.0.0.1:$PORT"; then
  echo "  ✓  app responding on port $PORT"
else
  echo "  ⚠  app not responding yet — check: pm2 logs learntharifith-dev --lines 30"
fi

echo ""
echo "✅ Deploy complete."
echo "   Local:  http://127.0.0.1:$PORT"
echo "   Public: https://dev.learntharifith.com  (once OLS proxy is configured)"
echo ""
echo "   Logs:   pm2 logs learntharifith-dev --lines 50"

