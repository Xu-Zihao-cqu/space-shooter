// 【玩家路由】- 定义玩家相关的 API 端点
const express = require('express');
const PlayerController = require('../controllers/playerController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

// 公开路由 (不需要身份验证)
router.post('/', PlayerController.createPlayer);        // 创建玩家
router.post('/login', PlayerController.loginPlayer);    // 玩家登录

// 受保护路由 (需要身份验证)
router.get('/me', authMiddleware, PlayerController.getCurrentPlayer);  // 获取当前玩家信息
router.get('/:id', PlayerController.getPlayer);         // 获取玩家信息

module.exports = router;