// 【日志工具】- 统一的日志输出格式
const logger = {
  // 获取时间戳
  getTimestamp() {
    return new Date().toISOString();
  },

  // 普通信息
  info(message) {
    console.log(`[${this.getTimestamp()}] [INFO] ${message}`);
  },

  // 警告信息
  warn(message) {
    console.warn(`[${this.getTimestamp()}] [WARN] ${message}`);
  },

  // 错误信息
  error(message) {
    console.error(`[${this.getTimestamp()}] [ERROR] ${message}`);
  },

  // 成功信息
  success(message) {
    console.log(`[${this.getTimestamp()}] [SUCCESS] ✅ ${message}`);
  },

  // 调试信息 (仅在开发环境显示)
  debug(message) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${this.getTimestamp()}] [DEBUG] ${message}`);
    }
  }
};

module.exports = { logger };