// 【数据库配置】- 连接 SQLite 数据库，创建表结构
const Database = require('better-sqlite3');
const path = require('path');
const { logger } = require('../utils/logger');

const dbPath = process.env.DATABASE_PATH || './database.sqlite';
const db = new Database(dbPath);

// 初始化数据库表
function initDatabase() {
  try {
    // 创建玩家表
    db.exec(`
      CREATE TABLE IF NOT EXISTS players (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 创建分数表
    db.exec(`
      CREATE TABLE IF NOT EXISTS scores (
        id TEXT PRIMARY KEY,
        player_id TEXT NOT NULL,
        score INTEGER NOT NULL,
        level_reached INTEGER DEFAULT 1,
        enemies_killed INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (player_id) REFERENCES players(id)
      )
    `);

    // 创建分数索引 (加速查询)
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_scores_player 
      ON scores(player_id);
      
      CREATE INDEX IF NOT EXISTS idx_scores_score 
      ON scores(score DESC);
    `);

    logger.info('✅ 数据库初始化成功');
  } catch (error) {
    logger.error('❌ 数据库初始化失败:', error);
    throw error;
  }
}

// 导出数据库实例
module.exports = { db, initDatabase };