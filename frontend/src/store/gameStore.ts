// 【全局状态管理】- 使用 Zustand 管理游戏状态
import { create } from 'zustand';

interface Player {
  id: string;
  username: string;
  token: string;
}

interface GameStore {
  // 玩家信息
  player: Player | null;
  setPlayer: (player: Player | null) => void;
  
  // 游戏状态
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  
  // 分数
  currentScore: number;
  setCurrentScore: (score: number) => void;
  
  // 等级
  currentLevel: number;
  setCurrentLevel: (level: number) => void;
  
  // 击杀数
  enemiesKilled: number;
  setEnemiesKilled: (killed: number) => void;
  
  // 排行榜
  leaderboard: any[];
  setLeaderboard: (leaderboard: any[]) => void;
  
  // 重置游戏
  resetGame: () => void;
  
  // 登出
  logout: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  // 初始状态
  player: null,
  isPlaying: false,
  currentScore: 0,
  currentLevel: 1,
  enemiesKilled: 0,
  leaderboard: [],
  
  // 设置玩家
  setPlayer: (player) => {
    set({ player });
    if (player) {
      localStorage.setItem('player', JSON.stringify(player));
    } else {
      localStorage.removeItem('player');
    }
  },
  
  // 设置游戏状态
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  
  // 设置分数
  setCurrentScore: (score) => set({ currentScore: score }),
  
  // 设置等级
  setCurrentLevel: (level) => set({ currentLevel: level }),
  
  // 设置击杀数
  setEnemiesKilled: (killed) => set({ enemiesKilled: killed }),
  
  // 设置排行榜
  setLeaderboard: (leaderboard) => set({ leaderboard }),
  
  // 重置游戏
  resetGame: () => set({
    isPlaying: false,
    currentScore: 0,
    currentLevel: 1,
    enemiesKilled: 0,
  }),
  
  // 登出
  logout: () => set({
    player: null,
    isPlaying: false,
    currentScore: 0,
    currentLevel: 1,
    enemiesKilled: 0,
  }),
}));

// 从 localStorage 恢复玩家信息
const savedPlayer = localStorage.getItem('player');
if (savedPlayer) {
  try {
    useGameStore.getState().setPlayer(JSON.parse(savedPlayer));
  } catch (e) {
    console.error('恢复玩家信息失败:', e);
  }
}