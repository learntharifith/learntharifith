#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────
# MIGRATION SCRIPT: WordPress → Next.js on learntharifith.com
#
# This script:
#   1. Backs up the WordPress database + files
#   2. Deploys the Next.js app on port 3002 (as user learn1607)
#   3. Verifies the app is running locally
#   4. Switches the learntharifith.com vhost to proxy to port 3002
#   5. Clears the OLS cache
#   6. Restarts OLS and tests the live URL
#
# Usage:  bash deploy/migrate-to-prod.sh
# ─────────────────────────────────────────────────────────────────────

set -euo pipefail

WP_DIR="/home/learntharifith.com/public_html"
APP_DIR="/home/learntharifith.com/nextapp"
APP_USER="learn1607"
PORT="3002"
VHOST="/usr/local/lsws/conf/vhosts/learntharifith.com/vhost.conf"
BACKUP_DIR="/root/backups/migration-$(date +%F-%H%M)"
TS="$(date +%F-%H%M)"

echo "╔══════════════════════════════════════════════════════════╗"
echo "║  Learntharifith — WordPress → Next.js migration         ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "  WP dir    : $WP_DIR"
echo "  App dir   : $APP_DIR"
echo "  App user  : $APP_USER"
echo "  Port      : $PORT"
echo "  Backup to : $BACKUP_DIR"
echo ""

# ── 1. Backup WordPress ──────────────────────────────────────────────
echo "▶ [1/6] Backing up WordPress…"
mkdir -p "$BACKUP_DIR"

# Files
echo "  archiving WP files…"
tar -czf "$BACKUP_DIR/wp-files-$TS.tar.gz" -C /home/learntharifith.com public_html 2>/dev/null || true

# Database (find WP config to get DB creds)
WP_CONFIG="$WP_DIR/wp-config.php"
if [[ -f "$WP_CONFIG" ]]; then
  echo "  dumping WP database…"
  DB_NAME=$(grep -oP "define\(\s*'DB_NAME'\s*,\s*'\K[^']+" "$WP_CONFIG" 2>/dev/null || echo "")
  DB_USER=$(grep -oP "define\(\s*'DB_USER'\s*,\s*'\K[^']+" "$WP_CONFIG" 2>/dev/null || echo "")
  DB_PASS=$(grep -oP "define\(\s*'DB_PASSWORD'\s*,\s*'\K[^']+" "$WP_CONFIG" 2>/dev/null || echo "")
  DB_HOST=$(grep -oP "define\(\s*'DB_HOST'\s*,\s*'\K[^']+" "$WP_CONFIG" 2>/dev/null || echo "localhost")

  if [[ -n "$DB_NAME" && -n "$DB_USER" ]]; then
    mysqldump --single-transaction -h "${DB_HOST:-localhost}" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" > "$BACKUP_DIR/wp-db-$TS.sql" 2>/dev/null || echo "  (DB dump skipped — may need manual dump)"
  fi
fi

# Vhost backup
cp "$VHOST" "$BACKUP_DIR/vhost.conf.bak" 2>/dev/null || true

echo "  ✓ backup saved to $BACKUP_DIR"
echo "  $(ls -lh "$BACKUP_DIR/" | tail -n +2 | wc -l) files:"
ls -lh "$BACKUP_DIR/"
echo ""

# ── 2. Deploy Next.js app (production) ───────────────────────────────
echo "▶ [2/6] Deploying Next.js app (production)…"
cd "$APP_DIR"
APP_ENV=prod bash deploy/deploy.sh
echo ""

# ── 3. Verify app on port 3002 ───────────────────────────────────────
echo "▶ [3/6] Verifying app on port $PORT…"
if curl -sf -o /dev/null -m 5 "http://127.0.0.1:$PORT"; then
  echo "  ✓ app responding on port $PORT"
else
  echo "  ✗ app NOT responding — aborting migration (WordPress is untouched)"
  echo "    Check: pm2 logs learntharifith --lines 30"
  exit 1
fi
echo ""

# ── 4. Switch the vhost to proxy to Next.js ──────────────────────────
echo "▶ [4/6] Switching vhost to proxy…"

# Extract the existing vhssl block (SSL config) to preserve it
VHSSL_BLOCK=""
if grep -q "vhssl" "$VHOST"; then
  VHSSL_BLOCK=$(sed -n '/^vhssl  {/,/^}/p' "$VHOST")
fi

# Get SSL cert paths from the existing config (fallback to defaults)
SSL_KEY=$(echo "$VHSSL_BLOCK" | grep -oP 'keyFile\s+\K\S+' || echo "/etc/letsencrypt/live/learntharifith.com/privkey.pem")
SSL_CERT=$(echo "$VHSSL_BLOCK" | grep -oP 'certFile\s+\K\S+' || echo "/etc/letsencrypt/live/learntharifith.com/fullchain.pem")

# Write the new clean vhost
cat > "$VHOST" << LTCONF
docRoot                   $APP_DIR
vhDomain                  \$VH_NAME
vhAliases                 www.\$VH_NAME
enableGzip                1
enableIpGeo               1

errorlog \$VH_ROOT/logs/\$VH_NAME.error_log {
  useServer               0
  logLevel                WARN
  rollingSize             10M
}

accesslog \$VH_ROOT/logs/\$VH_NAME.access_log {
  useServer               0
  logFormat               "%h %l %u %t "%r" %>s %b "%{Referer}i" "%{User-Agent}i""
  logHeaders              5
  rollingSize             10M
  keepDays                10
  compressArchive         1
}

extprocessor learntharifith {
  type                    proxy
  address                 127.0.0.1:$PORT
  maxConns                100
  initTimeout             60
  retryTimeout            0
  respBuffer              0
}

context / {
  type                    proxy
  handler                 learntharifith
  addDefaultCharset       off
}

context /.well-known/acme-challenge {
  location                /usr/local/lsws/Example/html/.well-known/acme-challenge
  allowBrowse             1
  addDefaultCharset       off
}

vhssl  {
  keyFile                 $SSL_KEY
  certFile                $SSL_CERT
  certChain               1
  sslProtocol             24
  enableECDHE             1
  renegProtection         1
  sslSessionCache         1
  enableSpdy              15
  enableStapling           1
  ocspRespMaxAge           86400
}
LTCONF

echo "  ✓ vhost.conf rewritten (proxy to 127.0.0.1:$PORT)"
echo ""

# ── 5. Clear OLS cache + restart ─────────────────────────────────────
echo "▶ [5/6] Clearing OLS cache + restarting…"
rm -rf /usr/local/lsws/cachedata/learntharifith.com 2>/dev/null || true
rm -rf /usr/local/lsws/cachedata/www.learntharifith.com 2>/dev/null || true
systemctl restart lshttpd
sleep 3
echo "  ✓ OLS restarted"
echo ""

# ── 6. Test the live URL ─────────────────────────────────────────────
echo "▶ [6/6] Testing live URL…"
echo ""
echo "  https://www.learntharifith.com:"
curl -sI -m 10 -H "Cache-Control: no-cache" https://www.learntharifith.com | head -n 8
echo ""
echo "  https://learntharifith.com:"
curl -sI -m 10 -H "Cache-Control: no-cache" https://learntharifith.com | head -n 8
echo ""

echo "╔══════════════════════════════════════════════════════════╗"
echo "║  Migration complete!                                    ║"
echo "║                                                          ║"
echo "║  If you see 'x-powered-by: Next.js' above — you're live  ║"
echo "║                                                          ║"
echo "║  Rollback (if needed):                                   ║"
echo "║    cp $BACKUP_DIR/vhost.conf.bak $VHOST"
echo "║    systemctl restart lshttpd                             ║"
echo "║                                                          ║"
echo "║  WordPress backup: $BACKUP_DIR"
echo "╚══════════════════════════════════════════════════════════╝"
