import { jwt } from 'hono/jwt';
import { env } from '@/config/env.js';
import { BusinessException } from '@/core/exceptions.js';
import type { JwtPayload } from '@/core/jwt.js';
import type { Context, Next } from 'hono';

/**
 * 基础 JWT 认证中间件
 * 预配置了 Secret 和 算法
 */
export const authGuard = jwt({
  secret: env.JWT_SECRET,
  alg: 'HS256',
});

/**
 * 角色权限校验中间件 (RBAC)
 * @param roles 允许访问的角色列表
 */
export const rolesGuard = (...roles: string[]) => {
  return async (c: Context, next: Next) => {
    const payload = c.get('jwtPayload') as JwtPayload;
    
    if (!payload || !roles.includes(payload.role)) {
      throw new BusinessException('权限不足，无法访问', 403);
    }
    
    await next();
  };
};
