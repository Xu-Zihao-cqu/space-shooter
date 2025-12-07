// 【游戏引擎】- 核心游戏逻辑和物理引擎

// 游戏配置
export const GAME_CONFIG = {
  WIDTH: 800,
  HEIGHT: 600,
  PLAYER: {
    WIDTH: 40,
    HEIGHT: 50,
    SPEED: 5,
    COLOR: '#00ff88',
  },
  ENEMY: {
    WIDTH: 40,
    HEIGHT: 40,
    BASE_SPEED: 2,
    COLOR: '#ff3366',
  },
  BULLET: {
    WIDTH: 5,
    HEIGHT: 15,
    SPEED: 7,
    COLOR: '#ffff00',
  },
  SPAWN_RATE: 60, // 帧数
};

// 玩家类
export class Player {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  
  constructor() {
    this.width = GAME_CONFIG.PLAYER.WIDTH;
    this.height = GAME_CONFIG.PLAYER.HEIGHT;
    this.speed = GAME_CONFIG.PLAYER.SPEED;
    this.x = GAME_CONFIG.WIDTH / 2 - this.width / 2;
    this.y = GAME_CONFIG.HEIGHT - this.height - 20;
  }
  
  move(direction: 'left' | 'right' | 'up' | 'down') {
    switch (direction) {
      case 'left':
        if (this.x > 0) this.x -= this.speed;
        break;
      case 'right':
        if (this.x < GAME_CONFIG.WIDTH - this.width) this.x += this.speed;
        break;
      case 'up':
        if (this.y > 0) this.y -= this.speed;
        break;
      case 'down':
        if (this.y < GAME_CONFIG.HEIGHT - this.height) this.y += this.speed;
        break;
    }
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = GAME_CONFIG.PLAYER.COLOR;
    ctx.beginPath();
    ctx.moveTo(this.x + this.width / 2, this.y);
    ctx.lineTo(this.x, this.y + this.height);
    ctx.lineTo(this.x + this.width, this.y + this.height);
    ctx.closePath();
    ctx.fill();
  }
}

// 子弹类
export class Bullet {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.width = GAME_CONFIG.BULLET.WIDTH;
    this.height = GAME_CONFIG.BULLET.HEIGHT;
    this.speed = GAME_CONFIG.BULLET.SPEED;
  }
  
  update() {
    this.y -= this.speed;
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = GAME_CONFIG.BULLET.COLOR;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  
  isOffScreen() {
    return this.y < -this.height;
  }
}

// 敌人类
export class Enemy {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  
  constructor(level: number) {
    this.width = GAME_CONFIG.ENEMY.WIDTH;
    this.height = GAME_CONFIG.ENEMY.HEIGHT;
    this.speed = GAME_CONFIG.ENEMY.BASE_SPEED + level * 0.3;
    this.x = Math.random() * (GAME_CONFIG.WIDTH - this.width);
    this.y = -this.height;
  }
  
  update() {
    this.y += this.speed;
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = GAME_CONFIG.ENEMY.COLOR;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  
  isOffScreen() {
    return this.y > GAME_CONFIG.HEIGHT;
  }
}

// 碰撞检测
export function checkCollision(
  obj1: { x: number; y: number; width: number; height: number },
  obj2: { x: number; y: number; width: number; height: number }
): boolean {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
}

// 绘制星空背景
export function drawStarfield(ctx: CanvasRenderingContext2D, stars: Array<{x: number, y: number}>) {
  ctx.fillStyle = 'white';
  stars.forEach(star => {
    ctx.fillRect(star.x, star.y, 2, 2);
  });
}

// 生成星星
export function generateStars(count: number): Array<{x: number, y: number}> {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * GAME_CONFIG.WIDTH,
      y: Math.random() * GAME_CONFIG.HEIGHT,
    });
  }
  return stars;
}