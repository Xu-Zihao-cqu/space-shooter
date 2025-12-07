// 【游戏页面】- 主游戏界面
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { scoreApi } from '../api/gameApi';
import GameCanvas from '../components/GameCanvas';
import PlayerInfo from '../components/PlayerInfo';

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    player, 
    currentScore, 
    currentLevel, 
    enemiesKilled,
    setCurrentScore,
    setCurrentLevel,
    setEnemiesKilled,
    resetGame,
  } = useGameStore();

  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameOver'>('ready');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 检查是否已登录
  useEffect(() => {
    if (!player) {
      navigate('/');
    }
  }, [player, navigate]);

  // 开始游戏
  const handleStartGame = () => {
    resetGame();
    setGameState('playing');
  };

  // 游戏结束
  const handleGameOver = () => {
    setGameState('gameOver');
  };

  // 提交分数
  const handleSubmitScore = async () => {
    if (!player || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await scoreApi.submit({
        score: currentScore,
        levelReached: currentLevel,
        enemiesKilled,
      });

      alert(response.data.message || '分数提交成功！');
      navigate('/');
    } catch (err: any) {
      console.error('提交分数失败:', err);
      alert('分数提交失败: ' + (err.error || '请重试'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // 返回主菜单
  const handleBackToMenu = () => {
    if (gameState === 'playing') {
      if (window.confirm('确定要退出游戏吗？当前分数将不会保存。')) {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  if (!player) return null;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
    }}>
      {/* 玩家信息栏 */}
      <PlayerInfo
        username={player.username}
        score={currentScore}
        level={currentLevel}
        enemiesKilled={enemiesKilled}
      />

      {/* 游戏画布 */}
      <div style={{ margin: '20px 0' }}>
        {gameState === 'ready' && (
          <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
            <h2 style={{ fontSize: '36px', marginBottom: '20px' }}>
              准备开始游戏
            </h2>
            <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
              使用方向键 ← → 移动飞船<br />
              按空格键发射子弹<br />
              消灭所有敌机！
            </p>
            <button
              className="btn btn-primary pulse"
              onClick={handleStartGame}
              style={{ fontSize: '24px', padding: '16px 48px' }}
            >
              开始游戏 🚀
            </button>
          </div>
        )}

        {gameState === 'playing' && (
          <GameCanvas
            onScoreChange={setCurrentScore}
            onLevelChange={setCurrentLevel}
            onEnemiesKilledChange={setEnemiesKilled}
            onGameOver={handleGameOver}
          />
        )}

        {gameState === 'gameOver' && (
          <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
            <h2 style={{ fontSize: '48px', marginBottom: '20px', color: '#ff3366' }}>
              💥 游戏结束
            </h2>
            
            <div style={{ 
              fontSize: '24px', 
              marginBottom: '40px',
              lineHeight: '2',
            }}>
              <div>🎯 最终分数: <strong style={{ color: '#667eea' }}>{currentScore}</strong></div>
              <div>⭐ 达到等级: <strong style={{ color: '#667eea' }}>{currentLevel}</strong></div>
              <div>💀 击杀敌机: <strong style={{ color: '#667eea' }}>{enemiesKilled}</strong></div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                className="btn btn-primary"
                onClick={handleSubmitScore}
                disabled={isSubmitting}
                style={{ fontSize: '20px', padding: '16px 32px' }}
              >
                {isSubmitting ? '提交中...' : '保存分数 💾'}
              </button>
              
              <button
                className="btn"
                onClick={handleStartGame}
                style={{ 
                  fontSize: '20px', 
                  padding: '16px 32px',
                  background: '#f0f0f0',
                  color: '#333',
                }}
              >
                再玩一次 🔄
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 返回按钮 */}
      <button
        className="btn"
        onClick={handleBackToMenu}
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          border: '2px solid white',
        }}
      >
        返回主菜单
      </button>

      {/* 控制提示 */}
      {gameState === 'playing' && (
        <div style={{
          marginTop: '20px',
          padding: '12px 24px',
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#666',
        }}>
          ← → 移动 | 空格键射击 | ESC 退出
        </div>
      )}
    </div>
  );
};

export default GamePage;