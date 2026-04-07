import { Hono } from 'hono';
import { container } from 'tsyringe';
import { AuthController } from './auth.controller.js';
import { authGuard } from '@/core/middleware/auth.middleware.js';

/**
 * 认证模块路由定义
 * 显式绑定路由与 Controller 方法
 */
const authRouter = new Hono();

// 从 DI 容器中解析 Controller 实例
const authController = container.resolve(AuthController);

// 公开路路由
authRouter.post('/register', (c) => authController.register(c));
authRouter.post('/login', (c) => authController.login(c));

// 受保护路由 (由 index.ts 中的全局鉴权统一管理)
authRouter.get('/profile', (c) => authController.getProfile(c));

export { authRouter };
