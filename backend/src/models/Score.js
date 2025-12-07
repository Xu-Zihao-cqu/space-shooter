// 【分数模型】- 定义分数数据结构，封装数据库操作
const { db } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Score {
  // 创建新分数记录
  static create({ playerId, score, levelReached, enemiesKilled }) {
    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO scores (id, player_id, score, level_reached, enemies_killed) 
      VALUES (?, ?, ?, ?, ?)
    `);
    
    stmt.run(id, playerId, score, levelReached, enemiesKilled);
    return { id, playerId, score, levelReached, enemiesKilled };
  }

  // 获取排行榜 (前 N 名)
  static getTopScores(limit = 10) {
    const stmt = db.prepare(`
      SELECT 
        s.id,
        s.score,
        s.level_reached,
        s.enemies_killed,
        s.created_at,
        p.username
      FROM scores s
      JOIN players p ON s.player_id = p.id
      ORDER BY s.score DESC
      LIMIT ?
    `);
    
    return stmt.all(limit);
  }

  // 获取玩家的所有分数
  static getByPlayerId(playerId, limit = 20) {
    const stmt = db.prepare(`
      SELECT * FROM scores 
      WHERE player_id = ? 
      ORDER BY score DESC 
      LIMIT ?
    `);
    
    return stmt.all(playerId, limit);
  }

  // 获取玩家最高分
  static getPlayerBestScore(playerId) {
    const stmt = db.prepare(`
      SELECT MAX(score) as best_score 
      FROM scores 
      WHERE player_id = ?
    `);
    
    return stmt.get(playerId);
  }

  // 获取游戏统计数据
  static getGameStats() {
    const stmt = db.prepare(`
      SELECT 
        COUNT(*) as total_games,
        AVG(score) as avg_score,
        MAX(score) as highest_score,
        SUM(enemies_killed) as total_enemies_killed
      FROM scores
    `);
    
    return stmt.get();
  }
}

module.exports = Score;