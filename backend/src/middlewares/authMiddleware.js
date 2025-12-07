// 【身份验证中间件】- 拦截请求，验证 JWT Token
const PlayerService = require('../services/playerService');
const { logger } = require('../utils/logger');

// 验证 Token 的中间件
const authMiddleware = (req, res, next) => {
  try {
    // 从请求头获取 Token
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: '未提供认证令牌' });
    }

    const token = authHeader.substring(7); // 去掉 "Bearer "

    // 验证 Token
    const decoded = PlayerService.verifyToken(token);

    // 将用户信息添加到请求对象
    req.user = decoded;

    logger.info(`✅ 身份验证成功: ${decoded.username}`);
    next();
  } catch (error) {
    logger.error(`❌ 身份验证失败: ${error.message}`);
    res.status(401).json({ error: '认证令牌无效或已过期' });
  }
};

// 可选的身份验证中间件 (Token 无效也允许继续)
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = PlayerService.verifyToken(token);
      req.user = decoded;
    }

    next();
  } catch (error) {
    // Token 无效，但允许继续
    next();
  }
};

module.exports = { authMiddleware, optionalAuth };