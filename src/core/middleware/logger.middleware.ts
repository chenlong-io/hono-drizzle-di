import type { Context, Next } from 'hono';

/**
 * 生产级错误日志中间件
 * 仅在响应状态码 >= 400 时打印彩色日志
 */
export const loggerMiddleware = async (c: Context, next: Next) => {
  await next();
  if (c.res.status >= 400) {
    const { method, path } = c.req;
    const status = c.res.status;
    // 使用 ANSI 转义序列：31 是红色
    console.log(`\x1b[31m[ERROR LOG]\x1b[0m ${method} ${path} - ${status}`);
  }
};
