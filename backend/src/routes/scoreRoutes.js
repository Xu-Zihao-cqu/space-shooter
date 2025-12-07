// 【分数路由】- 定义分数相关的 API 端点
const express = require('express');
const ScoreController = require('../controllers/scoreController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

// 公开路由 (不需要身份验证)
router.get('/top', ScoreController.getLeaderboard);             // 获取排行榜
router.get('/stats', ScoreController.getGameStats);             // 获取游戏统计
router.get('/player/:id', ScoreController.getPlayerScores);     // 获取玩家历史分数
router.get('/rank/:id', ScoreController.getPlayerRank);         // 获取玩家排名

// 受保护路由 (需要身份验证)
router.post('/', authMiddleware, ScoreController.submitScore);  // 提交分数

module.exports = router;