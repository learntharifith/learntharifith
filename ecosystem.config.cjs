// PM2 ecosystem — keeps the Next.js app running forever on the Contabo VPS
// Usage on the server:
//   pm2 start ecosystem.config.cjs
//   pm2 save
//   pm2 startup    # follow the printed instruction once
module.exports = {
  apps: [
    {
      name: 'learntharifith-dev',
      script: '.next/standalone/server.js',
      cwd: '/home/dev.learntharifith.com/nextapp',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: '3001',
        HOSTNAME: '127.0.0.1',
        DATABASE_URL: 'file:/home/dev.learntharifith.com/nextapp/db/custom.db',
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
