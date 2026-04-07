import { singleton, inject } from 'tsyringe';
import type { Context } from 'hono';
import { AuthService } from './auth.service.js';
import { success } from '@/core/response.js';
import { LoginSchema, RegisterSchema } from './auth.dto.js';
import { ValidationException } from '@/core/exceptions.js';

/**
 * 认证控制器
 * 处理 HTTP 请求并调用对应的 Service
 */
@singleton()
export class AuthController {
  constructor(@inject(AuthService) private readonly authService: AuthService) {}

  /**
   * 用户注册接口
   */
  async register(c: Context) {
    const body = await c.req.json();
    
    // Zod 校验
    const validation = RegisterSchema.safeParse(body);
    if (!validation.success) {
      throw new ValidationException(validation.error.issues[0].message);
    }

    const data = await this.authService.register(validation.data);
    return c.json(success(data, '注册成功'));
  }

  /**
   * 用户登录接口
   */
  async login(c: Context) {
    const body = await c.req.json();

    // Zod 校验
    const validation = LoginSchema.safeParse(body);
    if (!validation.success) {
      throw new ValidationException(validation.error.issues[0].message);
    }

    const data = await this.authService.login(validation.data);
    return c.json(success(data, '登录成功'));
  }

  /**
   * 获取个人资料 (受保护路由示例)
   */
  async getProfile(c: Context) {
    const user = c.get('jwtPayload');
    return c.json(success(user, '获取个人资料成功'));
  }
}
