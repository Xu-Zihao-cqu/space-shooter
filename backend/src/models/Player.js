// 【玩家模型】- 定义玩家数据结构，封装数据库操作
const { db } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Player {
  // 创建新玩家
  static create(username) {
    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO players (id, username) 
      VALUES (?, ?)
    `);
    
    try {
      stmt.run(id, username);
      return { id, username, created_at: new Date().toISOString() };
    } catch (error) {
      if (error.message.includes('UNIQUE')) {
        throw new Error('用户名已存在');
      }
      throw error;
    }
  }

  // 根据 ID 查找玩家
  static findById(id) {
    const stmt = db.prepare('SELECT * FROM players WHERE id = ?');
    return stmt.get(id);
  }

  // 根据用户名查找玩家
  static findByUsername(username) {
    const stmt = db.prepare('SELECT * FROM players WHERE username = ?');
    return stmt.get(username);
  }

  // 获取所有玩家
  static findAll(limit = 100) {
    const stmt = db.prepare('SELECT * FROM players LIMIT ?');
    return stmt.all(limit);
  }

  // 删除玩家 (同时删除相关分数)
  static delete(id) {
    const deleteScores = db.prepare('DELETE FROM scores WHERE player_id = ?');
    const deletePlayer = db.prepare('DELETE FROM players WHERE id = ?');
    
    const transaction = db.transaction(() => {
      deleteScores.run(id);
      deletePlayer.run(id);
    });
    
    transaction();
  }
}

module.exports = Player;