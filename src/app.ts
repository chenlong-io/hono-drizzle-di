import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { authRouter } from '@/modules/auth/auth.module.js';
import { AppException } from '@/core/exceptions.js';
import { fail } from '@/core/response.js';
import { authGuard } from '@/core/middleware/auth.middleware.js';
import { loggerMiddleware } from '@/core/middleware/logger.middleware.js';
import { whiteList } from '@/config/common.js';

/**
 * 核心 Application 定义
 */
const app = new Hono();

// 安全头
app.use('*', secureHeaders());
// CORS
app.use('*', cors());
// 日志 (仅错误状态码打印)
app.use('*', loggerMiddleware);

// 全局鉴权拦截器
app.use('*', async (c, next) => {
  if (whiteList.includes(c.req.path)) {
    return next();
  }
  return authGuard(c, next);
});

// --- 异常拦截 ---
app.onError((err, c) => {
  // 未处理错误的额外打印
  if (!(err instanceof AppException)) {
    console.error(`[Unhandled Error]`, err);
  }

  // 格式化输出
  if (err instanceof AppException) {
    return c.json(fail(err.message, err.code), err.httpStatus as any);
  }

  return c.json(fail(err.message || '系统繁忙，请稍后再试', 500), 500);
});

// 健康检查
app.get('/health', (c) => c.text('OK'));

// 挂载各业务模块
app.route('/auth', authRouter);

export { app };
