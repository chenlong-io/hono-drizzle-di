import 'reflect-metadata';
import { serve } from '@hono/node-server';
import { container } from 'tsyringe';
import { app } from './app.js';
import { env } from './config/env.js';
import { DatabaseProvider } from '@/db/db.js';

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
const shutdown = async () => {
  console.log('🛑 正在停止服务器...');

  // 1. 尝试优雅关闭数据库连接
  try {
    const dbProvider = container.resolve(DatabaseProvider);
    await dbProvider.close();
  } catch (e) {
    // 忽略获取不到注入的情况
  }

  // 2. 关闭 HTTP Server
  server.close(() => {
    console.log('👋 服务器已正常关闭');
    process.exit(0);
  });

  // 3. 在开发环境下，为了加速热更新，我们缩短强制退出的超时时间
  // 这能有效解决 tsx watch 导致的 EADDRINUSE 问题
  const timeout = env.NODE_ENV === 'development' ? 500 : 10000;

  const t = setTimeout(() => {
    clearTimeout(t);
    console.error('⚠️ 警告：正在强制终止进程...');
    process.exit(1);
  }, 10000);
};

/**
 * 生产环境特有的系统监控
 * 在开发环境下，我们让 tsx 和 Node.js 处理默认的信号与异常，以获得更好的调试体验
 */
if (env.NODE_ENV !== 'development') {
  // 监听停机信号
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  // 核心错误处理：主进程级别
  process.on('uncaughtException', (err) => {
    console.error('💥 未捕获的致命错误 (uncaughtException):', err);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('🔥 未处理的 Promise 拒绝 (unhandledRejection):', promise, '原因:', reason);
  });
}
