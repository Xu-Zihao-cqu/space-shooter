// 【玩家控制器】- 接收 HTTP 请求，调用 Service 层，返回响应
const PlayerService = require('../services/playerService');
const { logger } = require('../utils/logger');

class PlayerController {
  // POST /api/players - 创建玩家
  static async createPlayer(req, res) {
    try {
      const { username } = req.body;

      if (!username) {
        return res.status(400).json({ error: '用户名不能为空' });
      }

      const result = PlayerService.createPlayer(username);

      logger.info(`✅ 创建玩家成功: ${username}`);
      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error(`❌ 创建玩家失败: ${error.message}`);
      res.status(400).json({ error: error.message });
    }
  }

  // POST /api/players/login - 玩家登录（获取或创建）
  static async loginPlayer(req, res) {
    try {
      const { username } = req.body;

      if (!username) {
        return res.status(400).json({ error: '用户名不能为空' });
      }

      const result = PlayerService.getOrCreatePlayer(username);

      logger.info(`✅ 玩家登录: ${username}`);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error(`❌ 玩家登录失败: ${error.message}`);
      res.status(400).json({ error: error.message });
    }
  }

  // GET /api/players/:id - 获取玩家信息
  static async getPlayer(req, res) {
    try {
      const { id } = req.params;
      const player = PlayerService.getPlayerDetails(id);

      res.json({
        success: true,
        data: player
      });
    } catch (error) {
      logger.error(`❌ 获取玩家信息失败: ${error.message}`);
      res.status(404).json({ error: error.message });
    }
  }

  // GET /api/players/me - 获取当前登录玩家信息
  static async getCurrentPlayer(req, res) {
    try {
      // req.user 由 authMiddleware 设置
      const player = PlayerService.getPlayerDetails(req.user.playerId);

      res.json({
        success: true,
        data: player
      });
    } catch (error) {
      logger.error(`❌ 获取当前玩家失败: ${error.message}`);
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = PlayerController;