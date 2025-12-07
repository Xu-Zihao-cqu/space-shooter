// 【游戏画布组件】- Canvas 游戏渲染和逻辑
import React, { useRef, useEffect } from 'react';
import { 
  Player, 
  Bullet, 
  Enemy, 
  checkCollision,
  drawStarfield,
  generateStars,
  GAME_CONFIG 
} from '../utils/gameEngine';

interface GameCanvasProps {
  onScoreChange: (score: number) => void;
  onLevelChange: (level: number) => void;
  onEnemiesKilledChange: (killed: number) => void;
  onGameOver: () => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({
  onScoreChange,
  onLevelChange,
  onEnemiesKilledChange,
  onGameOver,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>();
  const playerRef = useRef<Player>(new Player());
  const bulletsRef = useRef<Bullet[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const scoreRef = useRef(0);
  const levelRef = useRef(1);
  const enemiesKilledRef = useRef(0);
  const enemySpawnTimerRef = useRef(0);
  const starsRef = useRef(generateStars(100));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 键盘事件处理
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;

      // 空格键发射子弹
      if (e.key === ' ') {
        e.preventDefault();
        const player = playerRef.current;
        bulletsRef.current.push(
          new Bullet(
            player.x + player.width / 2 - GAME_CONFIG.BULLET.WIDTH / 2,
            player.y
          )
        );
      }

      // ESC 键退出
      if (e.key === 'Escape') {
        onGameOver();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // 游戏主循环
    const gameLoop = () => {
      // 清空画布
      ctx.fillStyle = '#0a0e27';
      ctx.fillRect(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);

      // 绘制星空背景
      drawStarfield(ctx, starsRef.current);

      // 更新玩家位置
      const player = playerRef.current;
      if (keysRef.current['ArrowLeft']) player.move('left');
      if (keysRef.current['ArrowRight']) player.move('right');
      if (keysRef.current['ArrowUp']) player.move('up');
      if (keysRef.current['ArrowDown']) player.move('down');

      // 绘制玩家
      player.draw(ctx);

      // 更新并绘制子弹
      bulletsRef.current = bulletsRef.current.filter(bullet => {
        bullet.update();
        bullet.draw(ctx);
        return !bullet.isOffScreen();
      });

      // 生成敌人
      enemySpawnTimerRef.current++;
      const spawnRate = GAME_CONFIG.SPAWN_RATE - levelRef.current * 5;
      if (enemySpawnTimerRef.current > Math.max(spawnRate, 20)) {
        enemiesRef.current.push(new Enemy(levelRef.current));
        enemySpawnTimerRef.current = 0;
      }

      // 更新并绘制敌人
      enemiesRef.current = enemiesRef.current.filter(enemy => {
        enemy.update();
        enemy.draw(ctx);

        // 检测玩家碰撞
        if (checkCollision(player, enemy)) {
          onGameOver();
          return false;
        }

        return !enemy.isOffScreen();
      });

      // 子弹与敌人碰撞检测
      bulletsRef.current.forEach((bullet, bIndex) => {
        enemiesRef.current.forEach((enemy, eIndex) => {
          if (checkCollision(bullet, enemy)) {
            // 移除子弹和敌人
            bulletsRef.current.splice(bIndex, 1);
            enemiesRef.current.splice(eIndex, 1);

            // 增加分数
            scoreRef.current += 10;
            onScoreChange(scoreRef.current);

            // 增加击杀数
            enemiesKilledRef.current += 1;
            onEnemiesKilledChange(enemiesKilledRef.current);

            // 升级检测
            if (scoreRef.current > 0 && scoreRef.current % 100 === 0) {
              levelRef.current = Math.floor(scoreRef.current / 100) + 1;
              onLevelChange(levelRef.current);
            }
          }
        });
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    // 清理
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onScoreChange, onLevelChange, onEnemiesKilledChange, onGameOver]);

  return (
    <canvas
      ref={canvasRef}
      width={GAME_CONFIG.WIDTH}
      height={GAME_CONFIG.HEIGHT}
      className="game-canvas"
    />
  );
};

export default GameCanvas;