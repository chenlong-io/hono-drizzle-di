import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { HTTPException } from 'hono/http-exception';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
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
  // 1. 处理自定义业务异常 (AppException 及其子类)
  if (err instanceof AppException) {
    return c.json(fail(err.message, err.code), err.status);
  }

  // 2. 处理框架内置或其他第三方抛出的 HTTPException (如 JWT 验证失败)
  if (err instanceof HTTPException) {
    // 自动获取状态码并转换为 ContentfulStatusCode (忽略 1xx 等)
    const status = err.status as ContentfulStatusCode;
    return c.json(fail(err.message, status), status);
  }

  // 3. 处理常规未捕获异常 (Runtime Error)
  console.error(`[Unhandled Error]`, err);
  return c.json(fail(err.message || '系统繁忙，请稍后再试', 500), 500);
});

// 健康检查
app.get('/health', (c) => c.text('OK'));

// 挂载各业务模块
app.route('/auth', authRouter);

export { app };
