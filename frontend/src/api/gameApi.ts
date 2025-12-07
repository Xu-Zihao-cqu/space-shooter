// 【API 通信层】- 封装与后端的所有 HTTP 请求
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器 - 自动添加 Token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('gameToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器 - 统一处理错误
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API 错误:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
);

// ========== 玩家相关 API ==========
export const playerApi = {
  // 创建玩家
  create: (username: string) =>
    apiClient.post('/players', { username }),

  // 玩家登录（获取或创建）
  login: (username: string) =>
    apiClient.post('/players/login', { username }),

  // 获取当前玩家信息
  getCurrentPlayer: () =>
    apiClient.get('/players/me'),

  // 获取玩家信息
  getById: (id: string) =>
    apiClient.get(`/players/${id}`)
};

// ========== 分数相关 API ==========
export const scoreApi = {
  // 提交分数
  submit: (data: {
    score: number;
    levelReached: number;
    enemiesKilled: number;
  }) => apiClient.post('/scores', data),

  // 获取排行榜
  getLeaderboard: (limit: number = 10) =>
    apiClient.get(`/scores/top?limit=${limit}`),

  // 获取玩家历史分数
  getPlayerScores: (playerId: string, limit: number = 20) =>
    apiClient.get(`/scores/player/${playerId}?limit=${limit}`),

  // 获取玩家排名
  getPlayerRank: (playerId: string) =>
    apiClient.get(`/scores/rank/${playerId}`),

  // 获取游戏统计
  getStats: () =>
    apiClient.get('/scores/stats')
};

// ========== 本地存储辅助函数 ==========
export const storage = {
  // 保存 Token
  saveToken: (token: string) => {
    localStorage.setItem('gameToken', token);
  },

  // 获取 Token
  getToken: () => {
    return localStorage.getItem('gameToken');
  },

  // 清除 Token
  clearToken: () => {
    localStorage.removeItem('gameToken');
  },

  // 保存玩家信息
  savePlayer: (player: any) => {
    localStorage.setItem('player', JSON.stringify(player));
  },

  // 获取玩家信息
  getPlayer: () => {
    const playerStr = localStorage.getItem('player');
    return playerStr ? JSON.parse(playerStr) : null;
  },

  // 清除玩家信息
  clearPlayer: () => {
    localStorage.removeItem('player');
  }
};