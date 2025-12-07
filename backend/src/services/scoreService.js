// 【分数业务逻辑层】- 处理分数相关的复杂业务规则
const Score = require('../models/Score');
const Player = require('../models/Player');

class ScoreService {
  // 提交游戏分数
  static submitScore({ playerId, score, levelReached, enemiesKilled }) {
    // 验证玩家是否存在
    const player = Player.findById(playerId);
    if (!player) {
      throw new Error('玩家不存在');
    }

    // 验证分数合法性
    if (score < 0 || score > 1000000) {
      throw new Error('分数异常，请检查游戏逻辑');
    }

    // 防作弊：分数不应该超过 敌人数量 * 100
    if (score > enemiesKilled * 100 + 1000) {
      throw new Error('分数与击杀数不匹配，疑似作弊');
    }

    // 保存分数
    const newScore = Score.create({
      playerId,
      score,
      levelReached: levelReached || 1,
      enemiesKilled: enemiesKilled || 0
    });

    // 检查是否打破个人记录
    const bestScore = Score.getPlayerBestScore(playerId);
    const isNewRecord = !bestScore.best_score || score > bestScore.best_score;

    return {
      ...newScore,
      isNewRecord,
      message: isNewRecord ? '🎉 恭喜！打破个人记录！' : '继续加油！'
    };
  }

  // 获取排行榜 (带排名)
  static getLeaderboard(limit = 10) {
    const topScores = Score.getTopScores(limit);
    
    // 添加排名
    return topScores.map((score, index) => ({
      rank: index + 1,
      ...score
    }));
  }

  // 获取玩家的排名
  static getPlayerRank(playerId) {
    const bestScore = Score.getPlayerBestScore(playerId);
    
    if (!bestScore.best_score) {
      return { rank: null, message: '还没有分数记录' };
    }

    // 计算排名：有多少人分数比我高
    const { db } = require('../config/database');
    const stmt = db.prepare(`
      SELECT COUNT(DISTINCT player_id) as rank
      FROM scores
      WHERE score > ?
    `);
    
    const result = stmt.get(bestScore.best_score);
    
    return {
      rank: result.rank + 1,
      bestScore: bestScore.best_score
    };
  }

  // 获取游戏统计数据
  static getGameStatistics() {
    const stats = Score.getGameStats();
    const playerCount = Player.findAll().length;

    return {
      ...stats,
      total_players: playerCount,
      avg_score: Math.round(stats.avg_score || 0)
    };
  }
}

module.exports = ScoreService;