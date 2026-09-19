const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(cors({ origin: '*' })); // Cho phép tất cả website/blogspot truy cập

// Chuyển tiếp luồng Stream file MP4 dung lượng lớn sang Catbox
app.use('/upload', createProxyMiddleware({
  target: 'https://catbox.moe',
  changeOrigin: true,
  pathRewrite: { '^/upload': '/user/api.php' },
  onProxyReq: (proxyReq, req) => {
    proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
  }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
