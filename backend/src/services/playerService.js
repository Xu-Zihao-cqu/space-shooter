// 【玩家业务逻辑层】- 处理复杂的业务规则，可被多个 Controller 调用
const Player = require('../models/Player');
const jwt = require('jsonwebtoken');

class PlayerService {
  // 创建玩家并返回 Token
  static createPlayer(username) {
    // 验证用户名格式
    if (!username || username.length < 2 || username.length > 20) {
      throw new Error('用户名长度必须在 2-20 个字符之间');
    }

    // 用户名只能包含字母、数字、下划线
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      throw new Error('用户名只能包含字母、数字和下划线');
    }

    // 创建玩家
    const player = Player.create(username);

    // 生成 JWT Token
    const token = jwt.sign(
      { playerId: player.id, username: player.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return { player, token };
  }

  // 获取或创建玩家 (如果不存在则自动创建)
  static getOrCreatePlayer(username) {
    let player = Player.findByUsername(username);
    
    if (!player) {
      return this.createPlayer(username);
    }

    // 生成新 Token
    const token = jwt.sign(
      { playerId: player.id, username: player.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return { player, token };
  }

  // 验证 Token
  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Token 无效或已过期');
    }
  }

  // 获取玩家详细信息 (包含统计数据)
  static getPlayerDetails(playerId) {
    const player = Player.findById(playerId);
    if (!player) {
      throw new Error('玩家不存在');
    }

    // 这里可以添加更多统计数据
    const Score = require('../models/Score');
    const bestScore = Score.getPlayerBestScore(playerId);

    return {
      ...player,
      best_score: bestScore?.best_score || 0
    };
  }
}

module.exports = PlayerService;