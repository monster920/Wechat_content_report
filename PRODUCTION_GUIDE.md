# 生产环境运行指南

本文档说明如何在生产环境中部署和运行公众号文章分析报告UI项目。

## 📋 项目信息

- **项目名称**: report-ui
- **技术栈**: Vite + React + TypeScript + Tailwind CSS
- **构建输出**: `dist/` 目录

## 🔧 前置要求

### 1. 安装依赖
```bash
npm install
```

### 2. 构建项目
```bash
npm run build
```
构建成功后会生成 `dist/` 目录，包含所有静态文件。

## 🚀 部署方式

### 方式一：使用 Vite 预览服务器（推荐用于测试）

```bash
# 启动预览服务器（默认端口 4173）
npm run preview

# 指定端口和主机
npm run preview -- --port 8080 --host 0.0.0.0
```

**优点**:
- 简单快捷，适合快速测试
- 自动处理静态文件服务

**访问地址**: `http://localhost:4173` 或 `http://<服务器IP>:4173`

---

### 方式二：使用 Node.js + Express（推荐用于生产）

1. **安装 Express**
```bash
npm install express compression
```

2. **创建服务器文件 `server.js`**
```javascript
const express = require('express');
const compression = require('compression');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 启用压缩
app.use(compression());

// 静态文件服务
app.use(express.static(path.join(__dirname, 'dist')));

// 处理 React Router 的 SPA 路由
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

3. **启动服务器**
```bash
node server.js
```

**优点**:
- 生产环境就绪
- 支持 Gzip 压缩
- 处理 SPA 路由

---

### 方式三：使用 Nginx（推荐用于生产环境）

1. **安装 Nginx**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

2. **配置 Nginx**
创建配置文件 `/etc/nginx/sites-available/report-ui`：

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名

    root /path/to/report-ui/dist;
    index index.html;

    # 启用 Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # 静态文件缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA 路由处理
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 代理（如果需要）
    location /api/ {
        proxy_pass http://backend-server:port;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. **启用配置并重启 Nginx**
```bash
sudo ln -s /etc/nginx/sites-available/report-ui /etc/nginx/sites-enabled/
sudo nginx -t  # 测试配置
sudo systemctl restart nginx
```

**优点**:
- 高性能
- 支持 HTTPS
- 负载均衡
- 缓存优化

---

### 方式四：使用 Docker（推荐用于容器化部署）

1. **创建 Dockerfile**
```dockerfile
# 构建阶段
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. **创建 Nginx 配置文件 `nginx.conf`**
```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript;

    server {
        listen 80;
        root /usr/share/nginx/html;
        index index.html;

        # SPA 路由
        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

3. **构建和运行 Docker 容器**
```bash
# 构建镜像
docker build -t report-ui:latest .

# 运行容器
docker run -d -p 8080:80 --name report-ui report-ui:latest
```

**优点**:
- 环境一致性
- 易于扩展
- 便于 CI/CD

---

### 方式五：使用云服务（推荐用于快速部署）

#### 1. Vercel（推荐）
```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

#### 2. Netlify
```bash
# 安装 Netlify CLI
npm i -g netlify-cli

# 部署
netlify deploy --prod
```

#### 3. GitHub Pages
```bash
# 安装 gh-pages
npm install gh-pages --save-dev

# 在 package.json 中添加
"scripts": {
  "deploy": "gh-pages -d dist"
}

# 部署
npm run deploy
```

## 📝 环境变量配置

项目使用 Vite 的环境变量系统。创建 `.env.production` 文件：

```env
# API 配置
VITE_API_BASE_URL=http://172.18.232.211
VITE_API_TOKEN=Bearer app-ppA9xlo2jovEfbA5fnBeyBzM
```

## 🔒 安全建议

1. **HTTPS 配置**
   - 使用 Let's Encrypt 获取免费 SSL 证书
   - 配置 Nginx 重定向 HTTP 到 HTTPS

2. **API 安全**
   - 不要在前端硬编码敏感信息
   - 使用环境变量管理 API 密钥
   - 考虑使用后端代理 API 请求

3. **CORS 配置**
   - 如果 API 跨域，确保后端正确配置 CORS

## 📊 性能优化

1. **启用 Gzip 压缩**
2. **配置浏览器缓存**
3. **使用 CDN 加速静态资源**
4. **代码分割和懒加载**

## 🐛 常见问题

### 1. 路由刷新 404
**问题**: 刷新页面时出现 404 错误
**解决**: 确保服务器配置了 SPA 路由回退到 `index.html`

### 2. API 请求失败
**问题**: 前端无法连接到后端 API
**解决**: 
- 检查 API 地址是否正确
- 配置 CORS 允许前端域名
- 使用代理服务器转发 API 请求

### 3. 静态资源加载失败
**问题**: CSS/JS 文件 404
**解决**: 检查构建路径和服务器根目录配置

## 📞 技术支持

如有问题，请检查：
1. 浏览器控制台错误
2. 服务器日志
3. 网络连接状态

---

**最后更新**: 2024年3月18日
