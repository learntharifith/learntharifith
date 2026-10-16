#!/usr/bin/env bash
# Server-side deploy script for Learntharifith Next.js app
# Run on the Contabo VPS as root (or with sudo).
#
# Usage:
#   bash deploy/deploy.sh
#
# Prerequisites (installed by the guide):
#   - bun  (curl -fsSL https://bun.sh/install | bash)
#   - pm2  (npm i -g pm2)
#   - git  (apt install git)

set -euo pipefail

APP_DIR="/home/dev.learntharifith.com/nextapp"
APP_USER="devle3501"
PORT="3001"
REPO_URL="${1:-}"   # optional: git URL to clone from

echo "▶ Learntharifith deploy — $(date '+%F %T')"

# 1. App directory
echo "▶ [1/7] Preparing app directory…"
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
echo "▶ [2/7] Installing dependencies…"
sudo -u "$APP_USER" bash -c "cd '$APP_DIR' && bun install --frozen-lockfile"

# 3. Env file
echo "▶ [3/7] Writing .env…"
if [[ ! -f "$APP_DIR/.env" ]]; then
  cp "$APP_DIR/.env.production.example" "$APP_DIR/.env"
  chown "$APP_USER:$APP_USER" "$APP_DIR/.env"
  chmod 600 "$APP_DIR/.env"
fi

# 4. Generate Prisma client + push schema
echo "▶ [4/7] Generating Prisma client + pushing schema…"
sudo -u "$APP_USER" bash -c "cd '$APP_DIR' && bun run db:generate && bun run db:push"

# 5. Seed (idempotent — safe to re-run)
echo "▶ [5/7] Seeding database…"
sudo -u "$APP_USER" bash -c "cd '$APP_DIR' && bun run scripts/seed.ts"

# 6. Build (produces .next/standalone)
echo "▶ [6/7] Building Next.js app…"
sudo -u "$APP_USER" bash -c "cd '$APP_DIR' && bun run build"

# 7. Restart PM2
echo "▶ [7/7] Restarting PM2…"
if pm2 describe learntharifith-dev >/dev/null 2>&1; then
  pm2 restart learntharifith-dev --update-env
else
  pm2 start ecosystem.config.cjs
fi
pm2 save

echo "✅ Deploy complete."
echo "   Local:  http://127.0.0.1:$PORT"
echo "   Public: https://dev.learntharifith.com  (once OLS proxy is configured)"
echo ""
echo "   Logs:   pm2 logs learntharifith-dev --lines 50"
