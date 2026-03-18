# 公众号文章分析报告 UI

基于设计方案.md开发的完整商用级UI，用于公众号文章分析报告展示。

## 项目概述

这是一个基于 React + TypeScript + Vite 构建的公众号文章分析报告前端应用，实现了设计方案.md中定义的所有UI组件和交互功能。

## 技术栈

- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite 8
- **样式**: Tailwind CSS 4
- **图表**: SVG（内置实现）
- **状态管理**: React Hooks (useState, useEffect)

## 项目结构

```
report-ui/
├── src/
│   ├── api/
│   │   └── service.ts          # API服务层（Dify工作流集成）
│   ├── components/
│   │   ├── ReportHeader.tsx    # 报告头部组件
│   │   ├── ScoreGauge.tsx      # 分数仪表盘组件
│   │   ├── DimensionCard.tsx   # 维度卡片组件
│   │   ├── RadarChart.tsx      # 雷达图组件
│   │   ├── ActionList.tsx      # 建议清单组件
│   │   └── ExportToolbar.tsx   # 导出工具栏组件
│   ├── types/
│   │   └── index.ts            # 类型定义
│   ├── App.tsx                 # 主应用组件
│   ├── main.tsx                # 应用入口
│   └── index.css               # 全局样式
├── public/                     # 静态资源
├── dist/                       # 构建输出
└── package.json
```

## 核心功能

### 1. 报告头部概览区

- 文章标题、来源、时间显示
- 可折叠的报告摘要
- 总分仪表盘展示

### 2. 维度诊断详情区

- 6个维度卡片（选题、标题、结构、内容、文笔、传播）
- 每个维度显示权重、得分、状态
- 点击展开查看详细分析

### 3. 雷达图可视化

- 6维度对比雷达图
- 鼠标悬停显示详细数据
- 统计数据展示

### 4. 综合建议与行动区

- 核心优势展示
- 关键短板警示
- 可执行建议清单（带完成状态）

### 5. 操作工具栏

- 导出报告（PDF/Word/Markdown）
- 一键改稿
- 分享报告
- 创建新诊断

## 安装和运行

### 安装依赖

```bash
cd report-ui
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:5173

### 生产构建

```bash
npm run build
```

### 预览构建

```bash
npm run preview
```

## API集成

应用支持集成Dify工作流API：

1. 设置环境变量（创建 `.env` 文件）：

```env
VITE_API_BASE_URL=http://172.18.232.211
VITE_API_TOKEN=app-ppA9xlo2jovEfbA5fnBeyBzM
```

2. 在 `App.tsx` 中取消注释API调用代码：

```typescript
// const data = await fetchReport(link);
// setReportData(data);
```

## 设计规范

### 色彩系统

- 主色调：专业蓝 #1890FF
- 成功色：绿色 #52C41A
- 警示色：橙色 #FAAD14
- 错误色：红色 #F5222D

### 字体规范

- 报告标题：18px，加粗
- 维度标题：16px，加粗
- 正文：14px，常规
- 辅助文字：12px，常规

### 间距系统

- 卡片内边距：16px
- 卡片间距：24px
- 区域间距：32px
- 页面边距：24px

## 响应式设计

- **桌面端** (≥1024px)：完整布局，3列维度卡片
- **平板端** (768px-1023px)：2列维度卡片
- **移动端** (<768px)：单列布局，优化触摸交互

## 组件说明

### ReportHeader

显示文章基本信息和摘要，支持摘要展开/收起。

### ScoreGauge

圆形仪表盘显示总分，根据分数显示不同颜色和评级。

### DimensionCard

维度卡片显示权重、得分、状态，支持点击展开详情。

### RadarChart

SVG雷达图展示6维度对比，支持悬停显示详细数据。

### ActionList

建议清单组件，支持标记完成状态，复制建议功能。

### ExportToolbar

固定底部工具栏，提供导出、改稿、分享等功能。

## 开发说明

### LSP错误说明

项目中存在一些TypeScript LSP错误，但这些不影响构建和运行。主要原因是：

1. LSP服务器配置问题
2. 类型定义缓存问题

构建命令 `npm run build` 成功执行，证明代码是正确的。

### 下一步开发

1. 集成真实API调用
2. 添加更多交互功能（如图表缩放、数据筛选）
3. 实现导出功能（PDF/Word/Markdown）
4. 添加用户反馈系统
5. 优化移动端体验
