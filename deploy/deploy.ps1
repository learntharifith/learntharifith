#Requires -Version 5.1
<#
.SYNOPSIS
  Deploy the Learntharifith Next.js app to your Contabo VPS.

.DESCRIPTION
  1. Packages the project into a tarball (excluding node_modules, .next, logs, db)
  2. Uploads it to the server via scp
  3. Extracts it on the server as the app user
  4. Optionally runs deploy/deploy.sh on the server (install, build, seed, pm2 restart)

  Run this from the project root on Windows (the folder that contains package.json).

.PARAMETER Server
  SSH target. Default: root@109.199.106.165

.PARAMETER AppDir
  Absolute path on the server where the app lives.
  Default: /home/dev.learntharifith.com/nextapp

.PARAMETER AppUser
  Linux user that owns the app files. Default: devle3501

.PARAMETER SkipRemoteDeploy
  Upload + extract only. Do NOT run deploy/deploy.sh on the server.

.EXAMPLE
  .\deploy\deploy.ps1
  Full deploy: package, upload, extract, then run the server-side build.

.EXAMPLE
  .\deploy\deploy.ps1 -SkipRemoteDeploy
  Just push the code; you will run bash deploy/deploy.sh yourself over SSH.

.EXAMPLE
  .\deploy\deploy.ps1 -Server root@109.199.106.165 -AppUser devle3501
  Explicitly set all params (these are already the defaults).

.NOTES
  First time on this PC? You need:
    - Windows 10+ (tar, ssh, scp are built in)
    - OpenSSH client enabled (Settings → Apps → Optional features → OpenSSH Client)
#>

param(
    [string]$Server   = "root@109.199.106.165",
    [string]$AppDir   = "/home/dev.learntharifith.com/nextapp",
    [string]$AppUser  = "devle3501",
    [switch]$SkipRemoteDeploy
)

$ErrorActionPreference = "Stop"
$Tarball = "learntharifith.tar.gz"

# ── 0. Sanity check: must be in project root ─────────────────────────
if (-not (Test-Path "package.json")) {
    Write-Host "ERROR: package.json not found here." -ForegroundColor Red
    Write-Host "       Run this script from the project root folder." -ForegroundColor Red
    Write-Host "       cd C:\path\to\your\project" -ForegroundColor Yellow
    Write-Host "       .\deploy\deploy.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "================================================" -ForegroundColor DarkCyan
Write-Host "  Learntharifith deploy" -ForegroundColor Cyan
Write-Host "  Server  : $Server" -ForegroundColor DarkGray
Write-Host "  AppDir  : $AppDir" -ForegroundColor DarkGray
Write-Host "  AppUser : $AppUser" -ForegroundColor DarkGray
Write-Host "================================================" -ForegroundColor DarkCyan
Write-Host ""

# ── 1. Build the tarball ─────────────────────────────────────────────
Write-Host "[1/4] Creating tarball $Tarball ..." -ForegroundColor Cyan

if (Test-Path $Tarball) { Remove-Item $Tarball -Force }

# Array of tar arguments — splatted onto one command line.
# This avoids the fragile backtick line-continuation problem.
$tarArgs = @(
    "-czf", $Tarball,
    "--exclude=node_modules",
    "--exclude=.next",
    "--exclude=dev.log",
    "--exclude=server.log",
    "--exclude=db/*.db",
    "--exclude=*.tar.gz",
    "--exclude=.git",
    "src",
    "public",
    "prisma",
    "scripts",
    "deploy",
    "ecosystem.config.cjs",
    "package.json",
    "bun.lock",
    "next.config.ts",
    "tsconfig.json",
    ".env.production.example",
    "components.json",
    "postcss.config.mjs",
    "tailwind.config.ts"
)

# Run tar (built into Windows 10+)
& tar @tarArgs
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: tar failed (exit $LASTEXITCODE)" -ForegroundColor Red
    exit 1
}

$sizeKB = [math]::Round((Get-Item $Tarball).Length / 1KB)
Write-Host "  OK  $Tarball ($sizeKB KB)" -ForegroundColor Green

# ── 2. Upload via scp ────────────────────────────────────────────────
Write-Host ""
Write-Host "[2/4] Uploading to $Server:/tmp/$Tarball ..." -ForegroundColor Cyan

scp -o StrictHostKeyChecking=accept-new "$Tarball" "${Server}:/tmp/$Tarball"
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: scp failed (exit $LASTEXITCODE)" -ForegroundColor Red
    Write-Host "       Check the server IP, your SSH key, or password." -ForegroundColor Yellow
    exit 1
}
Write-Host "  OK  uploaded" -ForegroundColor Green

# ── 3. Extract on the server ─────────────────────────────────────────
Write-Host ""
Write-Host "[3/4] Extracting on server into $AppDir ..." -ForegroundColor Cyan

# Single SSH command — note the whole remote script is in double-quotes
# so PowerShell passes it as one argument to ssh.
$extractCmd = "mkdir -p '$AppDir' && " +
              "cd '$AppDir' && " +
              "tar -xzf /tmp/$Tarball && " +
              "chown -R $AppUser`:$AppUser '$AppDir' && " +
              "rm -f /tmp/$Tarball && " +
              "echo EXTRACT_OK"

$extractOut = ssh -o StrictHostKeyChecking=accept-new $Server $extractCmd
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: ssh extract failed (exit $LASTEXITCODE)" -ForegroundColor Red
    Write-Host $extractOut
    exit 1
}
Write-Host "  OK  extracted" -ForegroundColor Green

# ── 4. Run server-side deploy.sh (unless skipped) ────────────────────
if ($SkipRemoteDeploy) {
    Write-Host ""
    Write-Host "[4/4] Skipping server-side deploy (-SkipRemoteDeploy)" -ForegroundColor DarkYellow
    Write-Host "      To finish, SSH in and run:" -ForegroundColor DarkYellow
    Write-Host "        ssh $Server" -ForegroundColor Yellow
    Write-Host "        cd $AppDir && bash deploy/deploy.sh" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "[4/4] Running server-side deploy.sh (install + build + pm2) ..." -ForegroundColor Cyan
    Write-Host "      (this takes 1-3 minutes — bun install + next build)" -ForegroundColor DarkGray

    # Stream the deploy.sh output live so you see progress in real time
    ssh -o StrictHostKeyChecking=accept-new $Server "cd '$AppDir' && bash deploy/deploy.sh"
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "ERROR: deploy.sh failed (exit $LASTEXITCODE)" -ForegroundColor Red
        Write-Host "       SSH in and check: pm2 logs learntharifith-dev --lines 50" -ForegroundColor Yellow
        exit 1
    }
}

# ── 5. Quick smoke test ──────────────────────────────────────────────
Write-Host ""
Write-Host "Smoke test: curl -I https://dev.learntharifith.com" -ForegroundColor Cyan
Start-Sleep -Seconds 2
$smoke = curl.exe -s -o NUL -w "%{http_code}" "https://dev.learntharifith.com"
if ($smoke -eq "200") {
    Write-Host "  OK  HTTP 200 — site is live" -ForegroundColor Green
} else {
    Write-Host "  WARN  got HTTP $smoke (may need a minute, or check OLS proxy)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "================================================" -ForegroundColor DarkGreen
Write-Host "  Done. Open https://dev.learntharifith.com" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor DarkGreen
Write-Host ""
