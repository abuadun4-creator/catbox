const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// 1. Cho phép tất cả domain (Blogspot) gọi API
app.use(cors({ origin: '*' }));

// 2. Chuyển tiếp luồng Stream trực tiếp sang Catbox
app.use('/upload', createProxyMiddleware({
  target: 'https://catbox.moe',
  changeOrigin: true,
  pathRewrite: { '^/upload': '/user/api.php' },
  proxyTimeout: 600000, // Timeout 10 phút
  timeout: 600000,
  onProxyReq: (proxyReq, req) => {
    // Giả lập User-Agent tránh bị Catbox chặn
    proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
  },
  onError: (err, req, res) => {
    res.status(500).send('Proxy Stream Error: ' + err.message);
  }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy Stream running on port ${PORT}`));
