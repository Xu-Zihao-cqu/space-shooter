// 【分数控制器】- 接收 HTTP 请求，调用 Service 层，返回响应
const ScoreService = require('../services/scoreService');
const Score = require('../models/Score');
const { logger } = require('../utils/logger');

class ScoreController {
  // POST /api/scores - 提交分数
  static async submitScore(req, res) {
    try {
      const { score, levelReached, enemiesKilled } = req.body;
      const playerId = req.user.playerId; // 从 JWT Token 获取

      // 验证必填字段
      if (score === undefined) {
        return res.status(400).json({ error: '分数不能为空' });
      }

      const result = ScoreService.submitScore({
        playerId,
        score: parseInt(score),
        levelReached: parseInt(levelReached) || 1,
        enemiesKilled: parseInt(enemiesKilled) || 0
      });

      logger.info(`✅ 玩家 ${req.user.username} 提交分数: ${score}`);
      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error(`❌ 提交分数失败: ${error.message}`);
      res.status(400).json({ error: error.message });
    }
  }

  // GET /api/scores/top - 获取排行榜
  static async getLeaderboard(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const leaderboard = ScoreService.getLeaderboard(limit);

      res.json({
        success: true,
        data: leaderboard
      });
    } catch (error) {
      logger.error(`❌ 获取排行榜失败: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/scores/player/:id - 获取玩家历史分数
  static async getPlayerScores(req, res) {
    try {
      const { id } = req.params;
      const limit = parseInt(req.query.limit) || 20;
      
      const scores = Score.getByPlayerId(id, limit);

      res.json({
        success: true,
        data: scores
      });
    } catch (error) {
      logger.error(`❌ 获取玩家分数失败: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/scores/rank/:id - 获取玩家排名
  static async getPlayerRank(req, res) {
    try {
      const { id } = req.params;
      const rankInfo = ScoreService.getPlayerRank(id);

      res.json({
        success: true,
        data: rankInfo
      });
    } catch (error) {
      logger.error(`❌ 获取玩家排名失败: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/scores/stats - 获取游戏统计
  static async getGameStats(req, res) {
    try {
      const stats = ScoreService.getGameStatistics();

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      logger.error(`❌ 获取统计数据失败: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ScoreController;