// 【首页】- 登录和排行榜展示
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { playerApi, scoreApi, storage } from '../api/gameApi';
import Leaderboard from '../components/Leaderboard';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { player, setPlayer, setLeaderboard, leaderboard } = useGameStore();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 加载排行榜
  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const response = await scoreApi.getLeaderboard(10);
      setLeaderboard(response.data);
    } catch (err) {
      console.error('加载排行榜失败:', err);
    }
  };

  // 登录或注册
  const handleLogin = async () => {
    if (!username.trim()) {
      setError('请输入用户名');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await playerApi.login(username.trim());
      storage.saveToken(response.data.token);
      setPlayer({
        id: response.data.player.id,
        username: response.data.player.username,
        token: response.data.token,
      });
      
      // 跳转到游戏页面
      navigate('/game');
    } catch (err: any) {
      setError(err.error || '登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 已登录直接进入游戏
  const handleEnterGame = () => {
    navigate('/game');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
    }}>
      <div style={{
        maxWidth: '800px',
        width: '100%',
      }}>
        <div className="card fade-in" style={{ textAlign: 'center' }}>
          <h1 style={{
            fontSize: '64px',
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            🚀 太空射击
          </h1>
          
          <p style={{
            fontSize: '18px',
            color: '#666',
            marginBottom: '40px',
          }}>
            消灭敌机，勇夺高分！使用 ← → 移动，空格键射击
          </p>

          {!player ? (
            <div>
              <input
                type="text"
                className="input"
                placeholder="输入你的游戏昵称"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                style={{ marginBottom: '20px' }}
              />
              
              {error && (
                <div style={{
                  color: '#ff3366',
                  marginBottom: '20px',
                  padding: '10px',
                  background: '#ffe0e6',
                  borderRadius: '8px',
                }}>
                  {error}
                </div>
              )}
              
              <button
                className="btn btn-primary pulse"
                onClick={handleLogin}
                disabled={loading}
                style={{
                  width: '100%',
                  fontSize: '24px',
                  padding: '16px',
                }}
              >
                {loading ? '登录中...' : '开始游戏 🎮'}
              </button>
            </div>
          ) : (
            <div>
              <div style={{
                padding: '20px',
                background: '#f0f7ff',
                borderRadius: '12px',
                marginBottom: '20px',
              }}>
                <h2 style={{ color: '#667eea', marginBottom: '10px' }}>
                  欢迎回来，{player.username}！👋
                </h2>
                <p style={{ color: '#666' }}>准备好开始新的挑战了吗？</p>
              </div>
              
              <button
                className="btn btn-primary pulse"
                onClick={handleEnterGame}
                style={{
                  width: '100%',
                  fontSize: '24px',
                  padding: '16px',
                  marginBottom: '10px',
                }}
              >
                进入游戏 🚀
              </button>
              
              <button
                className="btn"
                onClick={() => setPlayer(null)}
                style={{
                  width: '100%',
                  background: '#e0e0e0',
                  color: '#666',
                }}
              >
                切换账号
              </button>
            </div>
          )}
        </div>

        {/* 排行榜 */}
        <div style={{ marginTop: '40px' }}>
          <Leaderboard data={leaderboard} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;