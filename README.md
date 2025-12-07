# 🎮 Space Shooter Game - 太空射击游戏

一个展示完整 MVC 架构的前后端分离游戏项目。

## 🚀 快速开始

### 方式一：使用 Docker (推荐)
```bash
docker-compose up
```
访问：http://localhost:5173

### 方式二：手动启动

#### 1. 启动后端
```bash
cd backend
npm install
npm run dev
```
后端运行在：http://localhost:3000

#### 2. 启动前端
```bash
cd frontend
npm install
npm run dev
```
前端运行在：http://localhost:5173

## 🎯 游戏玩法

- 🎮 **移动**: 键盘方向键 ← →
- 🔫 **射击**: 空格键
- 🎯 **目标**: 消灭敌机，获得高分

## 📦 技术栈

### 前端
- React 18 + TypeScript
- Vite (构建工具)
- Canvas API (游戏渲染)
- Zustand (状态管理)

### 后端
- Node.js + Express
- SQLite (数据库)
- JWT (身份验证)

## 🏗️ 架构说明

### MVC 模式体现

**Model (模型层)**
- `backend/src/models/` - 定义数据结构
- 负责数据库交互

**View (视图层)**
- `frontend/src/components/` - UI 组件
- `frontend/src/pages/` - 页面组件
- 负责展示游戏界面

**Controller (控制器层)**
- `backend/src/controllers/` - 处理请求
- 调用 Service 层业务逻辑
- 返回响应数据

### 额外分层

**Service (业务逻辑层)**
- `backend/src/services/` - 核心业务逻辑
- 可被多个 Controller 复用

**Router (路由层)**
- `backend/src/routes/` - 定义 API 端点
- 映射 URL 到 Controller

**Middleware (中间件层)**
- `backend/src/middlewares/` - 拦截请求
- 处理身份验证、日志等

## 📡 API 接口

### 玩家相关
```
POST   /api/players          # 创建玩家
GET    /api/players/:id      # 获取玩家信息
```

### 分数相关
```
POST   /api/scores           # 提交分数
GET    /api/scores/top       # 获取排行榜
GET    /api/scores/player/:id # 玩家历史分数
```

## 📝 环境变量

### backend/.env
```
PORT=3000
DATABASE_PATH=./database.sqlite
JWT_SECRET=your_secret_key_here
```

### frontend/.env
```
VITE_API_URL=http://localhost:3000
```

## 🎓 学习要点

1. **前后端分离**: 前端专注 UI，后端专注数据
2. **MVC 架构**: 清晰的代码分层
3. **RESTful API**: 标准的接口设计
4. **状态管理**: 前端全局状态管理
5. **Canvas 游戏开发**: 2D 游戏渲染基础

## 📄 License

MIT License