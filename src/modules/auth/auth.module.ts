import { Hono } from 'hono';
import { jwt } from 'hono/jwt';
import { container } from 'tsyringe';
import { AuthController } from './auth.controller.js';
import { env } from '@/config/env.js';

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

// 受保护路由 (使用内置 JWT 中间件)
authRouter.use('/profile', jwt({ secret: env.JWT_SECRET, alg: 'HS256' }));
authRouter.get('/profile', (c) => authController.getProfile(c));

export { authRouter };
