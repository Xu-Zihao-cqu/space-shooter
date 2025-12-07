// 【应用入口文件】- 启动服务器，注册路由和中间件
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./config/database');
const { logger } = require('./utils/logger');
const playerRoutes = require('./routes/playerRoutes');
const scoreRoutes = require('./routes/scoreRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ========== 中间件配置 ==========
// 1. 允许跨域请求 (前端可以访问后端)
app.use(cors());

// 2. 解析 JSON 请求体
app.use(express.json());

// 3. 请求日志记录
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// ========== 路由注册 ==========
// 健康检查接口
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '服务器正常运行' });
});

// 注册业务路由
app.use('/api/players', playerRoutes);
app.use('/api/scores', scoreRoutes);

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: '接口不存在' });
});

// 全局错误处理
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: '服务器内部错误' });
});

// ========== 启动服务器 ==========
initDatabase(); // 初始化数据库

app.listen(PORT, () => {
  logger.info(`🚀 服务器启动成功！`);
  logger.info(`🌐 地址: http://localhost:${PORT}`);
  logger.info(`📚 API文档: http://localhost:${PORT}/health`);
});