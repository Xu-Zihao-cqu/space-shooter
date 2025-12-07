// 【排行榜组件】- 显示玩家排名
import React from 'react';

interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  level_reached: number;
  enemies_killed: number;
  created_at: string;
}

interface LeaderboardProps {
  data: LeaderboardEntry[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="card fade-in">
        <h2 style={{ 
          fontSize: '32px', 
          marginBottom: '20px',
          color: '#667eea',
          textAlign: 'center',
        }}>
          🏆 排行榜
        </h2>
        <p style={{ textAlign: 'center', color: '#999' }}>
          暂无排名数据，快来成为第一名吧！
        </p>
      </div>
    );
  }

  return (
    <div className="card fade-in">
      <h2 style={{ 
        fontSize: '32px', 
        marginBottom: '20px',
        color: '#667eea',
        textAlign: 'center',
      }}>
        🏆 排行榜
      </h2>

      <div>
        {data.map((entry) => (
          <div
            key={entry.rank}
            className={`leaderboard-item ${
              entry.rank === 1 ? 'top-1' : 
              entry.rank === 2 ? 'top-2' : 
              entry.rank === 3 ? 'top-3' : ''
            }`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ 
                fontSize: '24px', 
                fontWeight: 'bold',
                minWidth: '40px',
              }}>
                {entry.rank === 1 ? '🥇' : 
                 entry.rank === 2 ? '🥈' : 
                 entry.rank === 3 ? '🥉' : 
                 `${entry.rank}.`}
              </span>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
                  {entry.username}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  等级 {entry.level_reached} · 击杀 {entry.enemies_killed}
                </div>
              </div>
            </div>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold',
              color: '#667eea',
            }}>
              {entry.score.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        marginTop: '20px', 
        textAlign: 'center',
        color: '#999',
        fontSize: '14px',
      }}>
        显示前 {data.length} 名玩家
      </div>
    </div>
  );
};

export default Leaderboard;