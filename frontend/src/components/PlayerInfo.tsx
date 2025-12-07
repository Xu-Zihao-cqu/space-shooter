// 【玩家信息组件】- 显示当前游戏状态
import React from 'react';

interface PlayerInfoProps {
  username: string;
  score: number;
  level: number;
  enemiesKilled: number;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({
  username,
  score,
  level,
  enemiesKilled,
}) => {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '20px',
      minWidth: '800px',
    }}>
      {/* 玩家名称 */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          fontSize: '14px', 
          color: '#999', 
          marginBottom: '4px',
        }}>
          玩家
        </div>
        <div style={{ 
          fontSize: '20px', 
          fontWeight: 'bold',
          color: '#667eea',
        }}>
          👤 {username}
        </div>
      </div>

      {/* 分数 */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          fontSize: '14px', 
          color: '#999', 
          marginBottom: '4px',
        }}>
          分数
        </div>
        <div style={{ 
          fontSize: '24px', 
          fontWeight: 'bold',
          color: '#ff9800',
        }}>
          🎯 {score.toLocaleString()}
        </div>
      </div>

      {/* 等级 */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          fontSize: '14px', 
          color: '#999', 
          marginBottom: '4px',
        }}>
          等级
        </div>
        <div style={{ 
          fontSize: '24px', 
          fontWeight: 'bold',
          color: '#4caf50',
        }}>
          ⭐ {level}
        </div>
      </div>

      {/* 击杀数 */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          fontSize: '14px', 
          color: '#999', 
          marginBottom: '4px',
        }}>
          击杀
        </div>
        <div style={{ 
          fontSize: '24px', 
          fontWeight: 'bold',
          color: '#f44336',
        }}>
          💀 {enemiesKilled}
        </div>
      </div>
    </div>
  );
};

export default PlayerInfo;