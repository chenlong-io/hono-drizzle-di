import 'reflect-metadata';
import { serve } from '@hono/node-server';
import { app } from './app.js';
import { env } from './config/env.js';

/**
 * 启动 HTTP Server
 */
const server = serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    console.log(`🚀 Server is running on http://localhost:${info.port} [${env.NODE_ENV}]`);
  },
);

/**
 * 优雅停机 (Graceful Shutdown)
 * 监听操作系统信号，确保应用安全退出
 */
const shutdown = () => {
  console.log('🛑 正在停止服务器...');
  server.close(() => {
    console.log('👋 服务器已正常关闭');
    process.exit(0);
  });

  // 强制超时退出
  const t = setTimeout(() => {
    clearTimeout(t);
    console.error('⚠️ 警告：正在强制终止进程...');
    process.exit(1);
  }, 10000);
};

// 监听常用系统停机信号
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

/**
 * 核心错误处理：主进程级别
 * 兜底捕获未捕获的错误与 Promise 拒绝
 */
process.on('uncaughtException', (err) => {
  console.error('💥 未捕获的致命错误 (uncaughtException):', err);
  process.exit(1); // 失败时退出，由 PM2 或 Docker 重启
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🔥 未处理的 Promise 拒绝 (unhandledRejection):', promise, '原因:', reason);
});
