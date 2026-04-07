import 'reflect-metadata';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { authRouter } from '@/modules/auth/auth.module.js';
import { AppException } from '@/core/exceptions.js';
import { fail } from '@/core/response.js';
import { env } from '@/config/env.js';

const app = new Hono();

// --- 全局中间件 ---

// 安全头
app.use('*', secureHeaders());

// CORS
app.use('*', cors());

// 错误日志中间件 (仅 4xx/5xx 时打印)
app.use('*', async (c, next) => {
  await next();
  if (c.res.status >= 400) {
    const { method, path } = c.req;
    const status = c.res.status;
    console.log(`\x1b[31m[ERROR LOG]\x1b[0m ${method} ${path} - ${status}`);
  }
});

// 全局异常处理
app.onError((err, c) => {
  // 打印未处理的错误
  if (!(err instanceof AppException)) {
    console.error(`[Unhandled Error]`, err);
  }

  if (err instanceof AppException) {
    return c.json(fail(err.message, err.code), err.httpStatus as any);
  }

  return c.json(fail(err.message || '系统繁忙，请稍后再试', 500), 500);
});

// --- 路由挂载 ---

// 基础探活接口
app.get('/health', (c) => c.text('OK'));

// 业务模块
app.route('/auth', authRouter);

// --- 启动服务 ---
const server = serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    console.log(`🚀 Server is running on http://localhost:${info.port} [${env.NODE_ENV}]`);
  },
);

// --- 优雅停机 (Graceful Shutdown) ---
const shutdown = () => {
  console.log('🛑 Shutting down server...');
  server.close(() => {
    console.log('👋 Server closed');
    process.exit(0);
  });

  // 如果 10 秒内没关掉，强制关掉
  const t = setTimeout(() => {
    clearTimeout(t);
    console.error('Forcing shutdown...');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// --- 进程异常监听 ---

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1); // 让 PM2 重启
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
