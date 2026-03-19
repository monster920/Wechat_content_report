// 生产环境启动脚本 - 使用 Express 服务静态文件
import express from 'express';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 启用 Gzip 压缩
app.use(compression());

// 静态文件服务
app.use(express.static(path.join(__dirname, 'dist')));

// 处理 React Router 的 SPA 路由
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
  ========================================
  🚀 公众号文章分析报告UI - 生产环境
  ========================================
  访问地址: http://localhost:${PORT}
  或: http://<服务器IP>:${PORT}
  
  按 Ctrl+C 停止服务器
  ========================================
  `);
});
