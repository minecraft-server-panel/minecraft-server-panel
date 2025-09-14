# Minecraft Server Panel

一个用于管理Minecraft服务器的现代化面板，使用Vue 3 + TypeScript + Vite构建前端，Node.js + Express构建后端。

## 项目结构

```
minecraft-server-panel/
├── client/                 # 客户端前端
│   ├── server/             # 客户端后端（处理用户信息和与主服务端通信）
│   └── dist/               # 客户端前端构建产物
├── server/                 # 主服务端（与Minecraft服务器通信）
├── scripts/                # 构建和部署脚本
└── release/                # 打包产物目录
```

## 服务端

服务端部分使用Node.js + Express构建，提供REST API和WebSocket服务，用于与Minecraft服务器进行交互。

### 后端技术栈
- Node.js 运行时环境
- Express.js Web框架
- TypeScript 类型系统
- WebSocket 实现实时通信

### 职责
- 与Minecraft服务器通信
- 提供管理API
- 处理服务器控制命令

## 客户端

客户端部分使用现代化的前端技术构建，提供直观的用户界面。

### 前端技术栈
- Vue 3 组件框架
- TypeScript 类型系统
- Vite 构建工具
- Sass 样式预处理器

### 客户端后端技术栈
- Node.js 运行时环境
- Express.js Web框架
- TypeScript 类型系统

### 职责
- 提供用户界面
- 处理用户认证和会话
- 与服务端通信
- 保存用户信息和偏好设置

### 通信机制
- 客户端前端 ↔ 客户端后端：HTTP/HTTPS 和 WebSocket（端口4001）
- 客户端后端 ↔ 服务端：HTTP/HTTPS 和 WebSocket（端口5001）
- 前端开发服务器运行在端口3000
- 使用代理解决跨域问题

## 部署选项

### 一体化部署
所有组件（客户端前端、客户端后端、服务端）部署在同一台服务器上，通过一个脚本启动所有服务。

### 分体式部署
客户端和服务端分别部署在不同的服务器上，可以独立扩展和维护。

## 开发和构建命令

### 开发环境
```bash
# 启动所有服务（热重载）
npm run dev

# 启动客户端前端（端口3000）
npm run dev:client

# 启动客户端后端（端口4001）
npm run dev:client-server

# 启动服务端（端口5001）
npm run dev:server
```

### 生产环境
```bash
# 构建所有组件
npm run build

# 启动所有服务（生产模式）
npm start

# 打包一体化发布包
npm run package:all-in-one

# 打包分体式发布包
npm run package:separate
```