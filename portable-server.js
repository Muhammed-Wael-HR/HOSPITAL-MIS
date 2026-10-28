/**
 * Hospital MIS / HIS - Portable Static Web Server
 * Zero dependencies - works with pure Node.js runtime.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const DIST_DIR = path.join(__dirname, 'dist');
const DEFAULT_PORT = 3300;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
};

function startServer(port) {
  const server = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath === '/' || reqPath === '') {
      reqPath = '/index.html';
    }

    let filePath = path.join(DIST_DIR, reqPath);

    // If file doesn't exist, fallback to index.html (SPA routing support)
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(DIST_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('خطأ أثناء تحميل الملف: ' + err.message);
        return;
      }
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
      });
      res.end(content);
    });
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`[!] المنفذ ${port} مشغول، جاري تجربة المنفذ ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('[X] خطأ في تشغيل السيرفر:', err);
    }
  });

  server.listen(port, () => {
    const url = `http://localhost:${port}/`;
    console.log('============================================================');
    console.log('   نظام إدارة معلومات المستشفيات المتكامل (HIS / MIS)       ');
    console.log('   النسخة المحمولة للعرض والتقديم (Portable USB Edition)    ');
    console.log('============================================================');
    console.log(`[+] السيرفر يعمل بنجاح على: ${url}`);
    console.log(`[+] جاري فتح المتصفح تلقائياً...`);
    console.log('============================================================');
    console.log('اضغط Ctrl + C لإيقاف السيرفر عند الانتهاء.');

    // Auto open default browser
    const startCmd = process.platform === 'win32' ? `start ${url}` : process.platform === 'darwin' ? `open ${url}` : `xdg-open ${url}`;
    exec(startCmd, () => {});
  });
}

startServer(DEFAULT_PORT);
