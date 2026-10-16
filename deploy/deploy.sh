#!/usr/bin/env bash
# Server-side deploy script for Learntharifith Next.js app
# Run on the Contabo VPS as root (or with sudo).
#
# Usage:
#   bash deploy/deploy.sh                    # dev (default)
#   APP_ENV=prod bash deploy/deploy.sh       # production
#
# Override individual values with env vars:
#   APP_DIR=/path APP_USER=user PORT=3002 APP_NAME=foo bash deploy/deploy.sh

set -euo pipefail

# ── Environment selection ────────────────────────────────────────────
APP_ENV="${APP_ENV:-dev}"

if [[ "$APP_ENV" == "prod" ]]; then
  APP_DIR="${APP_DIR:-/home/learntharifith.com/nextapp}"
  APP_USER="${APP_USER:-learn1607}"
  PORT="${PORT:-3002}"
  APP_NAME="${APP_NAME:-learntharifith}"
  ECO_FILE="${ECO_FILE:-ecosystem.prod.config.cjs}"
else
  APP_DIR="${APP_DIR:-/home/dev.learntharifith.com/nextapp}"
  APP_USER="${APP_USER:-devle3501}"
  PORT="${PORT:-3001}"
  APP_NAME="${APP_NAME:-learntharifith-dev}"
  ECO_FILE="${ECO_FILE:-ecosystem.config.cjs}"
fi

REPO_URL="${1:-}"   # optional: git URL to clone from

echo "▶ Learntharifith deploy — $(date '+%F %T')  [$APP_ENV env]"
echo "  APP_DIR  : $APP_DIR"
echo "  APP_USER : $APP_USER"
echo "  PORT     : $PORT"
echo "  APP_NAME : $APP_NAME"
echo ""

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

# 3. Env file (with correct PORT for this environment)
echo "▶ [3/8] Writing .env…"
if [[ ! -f "$APP_DIR/.env" ]]; then
  cp "$APP_DIR/.env.production.example" "$APP_DIR/.env"
  # Override PORT and DATABASE_URL for this environment
  sed -i "s|^PORT=.*|PORT=$PORT|" "$APP_DIR/.env"
  sed -i "s|^DATABASE_URL=.*|DATABASE_URL=file:$APP_DIR/db/custom.db|" "$APP_DIR/.env"
  chown "$APP_USER:$APP_USER" "$APP_DIR/.env"
  chmod 600 "$APP_DIR/.env"
  echo "  created .env (PORT=$PORT, DB=$APP_DIR/db/custom.db)"
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
if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  pm2 restart "$APP_NAME" --update-env
  echo "  restarted existing app ($APP_NAME)"
else
  if [[ -f "$APP_DIR/$ECO_FILE" ]]; then
    pm2 start "$ECO_FILE"
  else
    # Fallback: start directly if no ecosystem file
    pm2 start .next/standalone/server.js --name "$APP_NAME" --cwd "$APP_DIR"
  fi
  echo "  started new app ($APP_NAME)"
fi
pm2 save

# 8. Smoke test
echo "▶ [8/8] Smoke test…"
sleep 2
if curl -sf -o /dev/null -m 5 "http://127.0.0.1:$PORT"; then
  echo "  ✓  app responding on port $PORT"
else
  echo "  ⚠  app not responding yet — check: pm2 logs $APP_NAME --lines 30"
fi

echo ""
echo "✅ Deploy complete.  [$APP_ENV env]"
echo "   Local:  http://127.0.0.1:$PORT"
if [[ "$APP_ENV" == "prod" ]]; then
  echo "   Public: https://www.learntharifith.com  (once OLS proxy is configured)"
else
  echo "   Public: https://dev.learntharifith.com  (once OLS proxy is configured)"
fi
echo ""
echo "   Logs:   pm2 logs $APP_NAME --lines 50"

