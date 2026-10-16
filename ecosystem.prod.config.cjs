// PM2 ecosystem — PRODUCTION (www.learntharifith.com)
// Usage on the server:
//   APP_ENV=prod bash deploy/deploy.sh
// (this file is started automatically by deploy.sh when APP_ENV=prod)
module.exports = {
  apps: [
    {
      name: 'learntharifith',
      script: '.next/standalone/server.js',
      cwd: '/home/learntharifith.com/nextapp',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: '3002',
        HOSTNAME: '127.0.0.1',
        DATABASE_URL: 'file:/home/learntharifith.com/nextapp/db/custom.db',
      },
      max_memory_restart: '512M',
      autorestart: true,
      watch: false,
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      merge_logs: true,
      time: true,
    },
  ],
}
